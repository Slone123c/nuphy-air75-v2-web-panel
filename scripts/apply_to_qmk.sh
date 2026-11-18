#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
QMK_DIR="${1:-${HOME}/qmk_firmware}"

if [ ! -d "${QMK_DIR}/keyboards/nuphy/air75_v2/ansi" ]; then
  echo "QMK NuPhy Air75 V2 directory not found at: ${QMK_DIR}" >&2
  echo "Usage: $0 /path/to/qmk_firmware" >&2
  exit 1
fi

cp "${REPO_DIR}/firmware/keyboards/nuphy/air75_v2/ansi/ansi.c" "${QMK_DIR}/keyboards/nuphy/air75_v2/ansi/ansi.c"
cp "${REPO_DIR}/firmware/keyboards/nuphy/air75_v2/ansi/side.c" "${QMK_DIR}/keyboards/nuphy/air75_v2/ansi/side.c"

echo "Updated ansi.c and side.c in ${QMK_DIR}"
echo "Build with: cd \"${QMK_DIR}\" && make nuphy/air75_v2/ansi:via"
