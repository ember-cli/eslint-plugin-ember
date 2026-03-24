#!/usr/bin/env bash
#
# Wrapper that runs a node command with CPU pinning when available.
#
# Usage: ./scripts/run-bench.sh <node args...>

set -euo pipefail

CMD=(node --expose-gc "$@")

# CPU pinning on Linux — keep the process on a single core
if command -v taskset &>/dev/null; then
  CMD=(taskset -c 0 "${CMD[@]}")
  echo "📌  CPU pinning enabled (taskset -c 0)" >&2
  echo "" >&2
fi

exec "${CMD[@]}"
