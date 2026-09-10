//go:build go1.27

package main

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"io"
	"reflect"
	"time"
)

// connector selects either the ordinary row path or the direct column scanner.
type connector struct {
	direct bool
	blob   bool
}

func (c connector) Connect(context.Context) (driver.Conn, error) { return c, nil }
func (c connector) Driver() driver.Driver                        { return c }
func (c connector) Open(string) (driver.Conn, error)             { return c, nil }
func (c connector) Close() error                                 { return nil }
func (c connector) Prepare(string) (driver.Stmt, error)          { return nil, driver.ErrSkip }
func (c connector) Begin() (driver.Tx, error)                    { return nil, driver.ErrSkip }

func (c connector) QueryContext(context.Context, string, []driver.NamedValue) (driver.Rows, error) {
	time.Sleep(time.Millisecond)
	if c.direct {
		return &columnRows{}, nil
	}
	return &rows{blob: c.blob}, nil
}

func (c connector) ExecContext(context.Context, string, []driver.NamedValue) (driver.Result, error) {
	time.Sleep(time.Millisecond)
	return driver.RowsAffected(0), nil
}

// rows yields one integer through the traditional driver.Rows interface.
type rows struct {
	done bool
	blob bool
}

func (*rows) Columns() []string { return []string{"value"} }
func (*rows) Close() error      { return nil }

func (r *rows) Next(dest []driver.Value) error {
	if r.done {
		return io.EOF
	}
	r.done = true
	if r.blob {
		dest[0] = []byte("durable")
	} else {
		dest[0] = int64(42)
	}
	return nil
}

// columnRows requires database/sql to supply its opaque scan context.
type columnRows struct {
	rows
}

func (*columnRows) Next([]driver.Value) error { panic("ordinary Next called on column scanner") }

func (r *columnRows) NextRow() error {
	if r.done {
		return io.EOF
	}
	r.done = true
	return nil
}

func (*columnRows) ScanColumn(ctx driver.ScanContext, index int, dest any) error {
	if index != 0 {
		panic("unexpected column")
	}
	return sql.ConvertAssign(ctx, dest, int64(42))
}

func main() {
	for _, direct := range []bool{false, true} {
		db := sql.OpenDB(connector{direct: direct})
		if _, err := db.ExecContext(context.Background(), "create"); err != nil {
			panic(err)
		}
		var value int
		if err := db.QueryRowContext(context.Background(), "query", []byte("key")).Scan(&value); err != nil {
			panic(err)
		}
		println(direct, value)
		if err := db.Close(); err != nil {
			panic(err)
		}
	}
	var value int
	if err := sql.ConvertAssign(driver.ScanContext{}, &value, int64(7)); err != nil {
		panic(err)
	}
	println("zero context", value)
	db := sql.OpenDB(connector{blob: true})
	var data []byte
	if err := db.QueryRow("blob").Scan(&data); err != nil {
		panic(err)
	}
	println("blob", string(data))
	var raw sql.RawBytes
	println("raw rejected", db.QueryRow("blob").Scan(&raw) != nil)
	if err := db.Close(); err != nil {
		panic(err)
	}
	var plainPointer *[]byte
	var rawPointer *sql.RawBytes
	_, plainIsRaw := any(plainPointer).(*sql.RawBytes)
	_, rawIsPlain := any(rawPointer).(*[]byte)
	println("nil pointer identity", plainIsRaw, rawIsPlain)

	type namedInt int
	type tagged struct {
		Value int `json:"first"`
	}
	type retagged struct {
		Value int `json:"second"`
	}
	println("named integer", reflect.TypeFor[namedInt]().ConvertibleTo(reflect.TypeFor[int64]()))
	println("boolean string", reflect.TypeFor[bool]().ConvertibleTo(reflect.TypeFor[string]()))
	println("byte string", reflect.TypeFor[[]byte]().ConvertibleTo(reflect.TypeFor[string]()))
	println("slice array", reflect.TypeFor[[]int]().ConvertibleTo(reflect.TypeFor[[2]int]()))
	println("named elements", reflect.TypeFor[[]namedInt]().ConvertibleTo(reflect.TypeFor[[]int]()))
	println("struct tags", reflect.TypeFor[tagged]().ConvertibleTo(reflect.TypeFor[retagged]()))
}
