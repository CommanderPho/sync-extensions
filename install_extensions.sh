#!/bin/sh

set -euo pipefail

if ! type code > /dev/null; then
    echo "please install code comannd"
    echo "see: https://code.visualstudio.com/docs/editor/command-line#_code-is-not-recognized-as-an-internal-or-external-command"
    exit 1
fi

function install_extension () {
    set +e
    if code --install-extension "$1" >/dev/null 2>&1; then
        echo "install $1 success!"
    else
        echo "install $1 fail!"
    fi
    set -e
}

(
    for ext in $(cat "$SYNC_EXTENSIONS_PATH" | jq -r '. | keys | .[]' | grep -v -e 'vscode\.'); do
        install_extension "$ext"
    done
)
