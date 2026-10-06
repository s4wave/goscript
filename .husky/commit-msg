#!/bin/sh
# commit-msg: reject Co-authored-by trailers. A commit names its author and
# Signed-off-by and credits no co-author, person or tool. Comment lines and the
# verbose diff below the scissors line are ignored, as Git discards them.

msg=${1:?commit message path required}

if sed '/^# -* >8 -*$/q' "$msg" | grep -v '^#' | grep -qi '^[[:space:]]*co-authored-by:'; then
	printf 'commit-msg: remove the Co-authored-by trailer; the author and\n' >&2
	printf 'Signed-off-by identify who wrote the commit.\n' >&2
	exit 1
fi
