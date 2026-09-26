package main

import "sync"

var hosts struct {
	sync.Mutex

	byAddr map[string][]string
}

type table struct {
	sync.Mutex

	byAddr map[string][]string
}

var named table

func lookup(addr string) []string {
	hosts.Lock()
	defer hosts.Unlock()
	if len(hosts.byAddr) != 0 {
		if hosts, ok := hosts.byAddr[addr]; ok {
			return hosts
		}
	}
	return nil
}

func lookupNamed(addr string) []string {
	named.Lock()
	defer named.Unlock()
	if len(named.byAddr) != 0 {
		if named, ok := named.byAddr[addr]; ok {
			return named
		}
	}
	return nil
}

func lookupLocal(addr string) []string {
	var local table
	local.byAddr = map[string][]string{addr: {"local"}}
	ptr := &local
	ptr.Lock()
	defer ptr.Unlock()
	if local, ok := local.byAddr[addr]; ok {
		return local
	}
	return nil
}

func main() {
	println(lookupLocal("127.0.0.1")[0])
	hosts.byAddr = map[string][]string{"127.0.0.1": {"localhost"}}
	named.byAddr = hosts.byAddr
	println(lookup("127.0.0.1")[0])
	println(lookupNamed("127.0.0.1")[0])
	println(len(lookup("::1")))
}
