# sync-extensions

This extension automatically exports your installed extensions data when extensions are installed, uninstalled, enabled or disabled.

Also you can export manually with `sync-extensions: export extensions data` command.

## Extension Settings

This extension has the following settings:

+ `sync-extensions.path`
  - file name and its absolute path in which extensions data is exported
  - setting example: `/path/to/myextensions.json`

## Exported Data Format

The format is JSON.
If you install multiple versions per extension id, current using version is written.

```
{
  ...
  "vscode.typescript": {
    "version": "1.0.0"
  },
  "vscode.typescript-language-features": {
    "version": "1.0.0"
  },
  ...
}
```

## How to import extensions from exported settings

1. install "code" command referring "[Launching from the command line](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)"
2. Execute this shell scripts (you can execute from anywhere) after replacing "/path/to/myextensions.json" string in the script with your value of `sync-extensions.path`
   ```sh
   SYNC_EXTENSIONS_PATH="/path/to/myextensions.json" /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/hoddy3190/sync-extensions/main/install_extensions.sh)"
   ```

## Why not use "Settings Sync"

VS Code has function for syncing settings, called "[Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)".
In fact, this can sync extensions.

The reason why I don't use "Settings Sync" is the followings:

- Settings Sync uses cloud service such as GitHub, Microsoft to sync, but I want to sync locally for security.
- Settings Sync exports settings manually, but I want to export automatically.
