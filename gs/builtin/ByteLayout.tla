-------------------------- MODULE ByteLayout --------------------------
EXTENDS Naturals, Sequences, TLC

\* Byte views share one backing store. Each element has fields at offsets 0
\* and 2, leaving a padding byte. A tail view aliases the second whole element.
CONSTANTS CorrectStride, SharedBacking, PreserveOrigins
Views == {"whole", "tail", "reference"}
Fields == {"tag", "word"}
Offset(field) == IF field = "tag" THEN 0 ELSE 2
Base(v) == IF v = "whole" \/ (v = "reference" /\ ~PreserveOrigins) THEN 0 ELSE 3
Stride == IF CorrectStride THEN 3 ELSE 2
Address(v, i, field) == Base(v) + i * Stride + Offset(field)
Indexes(v) == IF v = "whole" THEN {0, 1} ELSE {0}
VARIABLES bytes, local
vars == <<bytes, local>>
Read(v, i, field) == IF SharedBacking THEN bytes[Address(v, i, field)] ELSE local[v][Address(v, i, field)]
Init == /\ bytes = [b \in 0..5 |-> 0]
        /\ local = [v \in Views |-> [b \in 0..5 |-> 0]]
Write(v, i, field, value) ==
  /\ bytes' = [bytes EXCEPT ![Address(v, i, field)] = value]
  /\ local' = IF SharedBacking THEN local ELSE [local EXCEPT ![v][Address(v, i, field)] = value]
Next == \E v \in Views : \E i \in Indexes(v), field \in Fields, value \in {0, 1} : Write(v, i, field, value)
Spec == Init /\ [][Next]_vars
AliasesReadSame == \A v \in Views \ {"whole"}, field \in Fields : Read("whole", 1, field) = Read(v, 0, field)
ReadsBacking == \A v \in Views : \A i \in Indexes(v), field \in Fields : Read(v, i, field) = bytes[Address(v, i, field)]
AddressesStable == \A v \in Views \ {"whole"}, field \in Fields : Address("whole", 1, field) = Address(v, 0, field)
Bounds == \A v \in Views : \A i \in Indexes(v), field \in Fields : Address(v, i, field) \in 0..5
PaddingUntouched == bytes[1] = 0 /\ bytes[4] = 0
=============================================================================
