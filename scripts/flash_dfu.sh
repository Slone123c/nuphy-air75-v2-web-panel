#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BIN_PATH="${1:-${REPO_DIR}/firmware/releases/nuphy_air75_v2_ansi_battery.bin}"

if [ ! -f "${BIN_PATH}" ]; then
  echo "Firmware binary not found: ${BIN_PATH}" >&2
  exit 1
fi

echo "Flashing ${BIN_PATH} to STM32 DFU (0483:df11)..."
dfu-util -a 0 -d 0483:df11 -s 0x08000000:leave -D "${BIN_PATH}"
