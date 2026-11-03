package compiler

import "go/types"

// identicalVariantTypes compares types from the same source declarations when
// Go's production and test package variants have distinct go/types objects.
// Local declarations remain distinct through their source positions. Named
// types keep their declared identity rather than comparing underlying shapes.
// Both operands belong to one PackageGraph check, whose packageChecker shares
// one FileSet and parsed-file cache across all production and test variants.
func identicalVariantTypes(a, b types.Type) bool {
	// Keep Go's identity rule when the checked objects already agree.
	if types.IdenticalIgnoreTags(a, b) {
		return true
	}

	// Compare variant declarations and the containers that carry them.
	a, b = types.Unalias(a), types.Unalias(b)
	switch left := a.(type) {
	case *types.Named:
		right, ok := b.(*types.Named)
		if !ok || !sameVariantDeclaration(left.Origin().Obj(), right.Origin().Obj()) || left.TypeArgs().Len() != right.TypeArgs().Len() {
			return false
		}
		for idx := range left.TypeArgs().Len() {
			if !identicalVariantTypes(left.TypeArgs().At(idx), right.TypeArgs().At(idx)) {
				return false
			}
		}
		return true
	case *types.Pointer:
		right, ok := b.(*types.Pointer)
		return ok && identicalVariantTypes(left.Elem(), right.Elem())
	case *types.Slice:
		right, ok := b.(*types.Slice)
		return ok && identicalVariantTypes(left.Elem(), right.Elem())
	case *types.Array:
		right, ok := b.(*types.Array)
		return ok && left.Len() == right.Len() && identicalVariantTypes(left.Elem(), right.Elem())
	case *types.Map:
		right, ok := b.(*types.Map)
		return ok && identicalVariantTypes(left.Key(), right.Key()) && identicalVariantTypes(left.Elem(), right.Elem())
	case *types.Chan:
		right, ok := b.(*types.Chan)
		return ok && left.Dir() == right.Dir() && identicalVariantTypes(left.Elem(), right.Elem())
	case *types.Signature:
		right, ok := b.(*types.Signature)
		return ok && left.TypeParams().Len() == 0 && right.TypeParams().Len() == 0 && methodSignaturesIdentical(left, right)
	case *types.Struct:
		right, ok := b.(*types.Struct)
		if !ok || left.NumFields() != right.NumFields() {
			return false
		}
		for idx := range left.NumFields() {
			l, r := left.Field(idx), right.Field(idx)
			if l.Id() != r.Id() || l.Embedded() != r.Embedded() || !identicalVariantTypes(l.Type(), r.Type()) {
				return false
			}
		}
		return true
	case *types.Interface:
		right, ok := b.(*types.Interface)
		if !ok || !left.IsMethodSet() || !right.IsMethodSet() || left.NumMethods() != right.NumMethods() {
			return false
		}
		for idx := range left.NumMethods() {
			l, r := left.Method(idx), right.Method(idx)
			if l.Id() != r.Id() || !identicalVariantTypes(l.Type(), r.Type()) {
				return false
			}
		}
		return true
	}
	return false
}

// sameVariantDeclaration identifies one declaration checked in two package
// variants. The checker shares parsed files, so their token positions match.
func sameVariantDeclaration(a, b types.Object) bool {
	return a.Pos().IsValid() && a.Pos() == b.Pos() && a.Name() == b.Name() &&
		a.Pkg() != nil && b.Pkg() != nil && a.Pkg().Path() == b.Pkg().Path()
}
