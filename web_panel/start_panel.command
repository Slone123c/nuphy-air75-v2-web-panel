#!/bin/zsh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=19752
URL="http://127.0.0.1:${PORT}/"

if ! lsof -iTCP:${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
  nohup python3 -m http.server ${PORT} --bind 127.0.0.1 --directory "${DIR}" >/tmp/air75_v2_web_panel.log 2>&1 &
  sleep 0.5
fi

if [ -d "/Applications/Google Chrome.app" ]; then
  open -a "Google Chrome" "${URL}"
elif [ -d "/Applications/Arc.app" ]; then
  open -a "Arc" "${URL}"
else
  open "${URL}"
fi
