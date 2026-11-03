---- MODULE HashClone ----
\* Incremental state is abstracted by a scalar; input bytes are never retained.
\* Sum copies before finalization, Clone copies the compression state, and
\* Reset replaces only its receiver's state. The mutants share a clone,
\* finalize the source on Sum, or reset both branches.
EXTENDS Naturals
CONSTANTS SeparateCopies, PreserveSum, IndependentReset
VARIABLES phase, state, copy
vars == <<phase, state, copy>>
Init == /\ phase = 0 /\ state = [i \in 0..1 |-> 0] /\ copy = 1
Step ==
  CASE phase = 0 -> /\ phase' = 1 /\ state' = [state EXCEPT ![0] = 3] /\ UNCHANGED copy
    [] phase = 1 -> /\ phase' = 2 /\ state' = (IF PreserveSum THEN state ELSE [state EXCEPT ![0] = 0]) /\ UNCHANGED copy
    [] phase = 2 -> /\ phase' = 3 /\ state' = [state EXCEPT ![1] = state[0]] /\ copy' = IF SeparateCopies THEN 1 ELSE 0
    [] phase = 3 -> /\ phase' = 4 /\ state' = [state EXCEPT ![0] = 7] /\ UNCHANGED copy
    [] phase = 4 -> /\ phase' = 5 /\ state' = [state EXCEPT ![copy] = 11] /\ UNCHANGED copy
    [] phase = 5 -> /\ phase' = 6 /\ state' = (IF IndependentReset THEN [state EXCEPT ![0] = 0] ELSE [i \in 0..1 |-> 0]) /\ UNCHANGED copy
    [] phase = 6 -> /\ phase' = 7 /\ state' = [state EXCEPT ![copy] = 0] /\ UNCHANGED copy
    [] OTHER -> UNCHANGED vars
Spec == Init /\ [][Step]_vars
SourceIndependent == state[0] = IF phase = 0 \/ phase >= 6 THEN 0 ELSE IF phase >= 4 THEN 7 ELSE 3
CloneIndependent == phase < 3 \/ state[copy] = IF phase >= 7 THEN 0 ELSE IF phase >= 5 THEN 11 ELSE 3
====
