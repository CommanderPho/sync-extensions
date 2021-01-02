# sync-extensions

This extension automatically exports your installed extensions data when extensions are installed, uninstalled, enabled or disabled.

Also you can export manually with `sync-extensions: export extensions data` command.

## Extension Settings

This extension has the following settings:

+ `sync-extensions.path`
  - file path in which extensions data is exported

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
