import * as vscode from "vscode";
import * as fs from "fs";

interface ExtData {
  version: string;
}

interface ExtDict {
  [id: string]: ExtData;
}

const write = (path: string, data: string) => {
  fs.writeFileSync(path, data, "utf8");
};

const getInstalledExtDict = (): ExtDict => {
  const extDict: ExtDict = {};
  vscode.extensions.all.forEach(
    (ext) =>
      (extDict[ext.id] = {
        // If there are multiple versions per ext.id, current using version is assigned
        version: ext.packageJSON.version,
      })
  );
  return extDict;
};

const exportExtensionsData = () => {
  const config = vscode.workspace.getConfiguration("sync-extensions");
  const extDict = getInstalledExtDict();
  try {
    write(config.path, JSON.stringify(extDict, null, 2));
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    vscode.window.showErrorMessage(
      `write extensions data error
      [message]: ${errorMessage}
      [exported file path]: ${config.path}`
    );

    return;
  }
  console.log(
    `Your installed extensions data has been exported to ${config.path}`
  );
};

export function activate(context: vscode.ExtensionContext): void {
  // onDidChange doesn't catch uninstalling and disabling which need reloading.
  // e.g. 'dbaeumer.vscode-eslint' needs reloading to uninstall, but 'vivaxy.vscode-conventional-commits' doesn't.
  // So extensions data are exported in starting up too for catching after reloading.
  exportExtensionsData();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sync-extensions.exportExtensionsData",
      exportExtensionsData
    ),
    // cf. https://code.visualstudio.com/api/references/vscode-api#extensions
    vscode.extensions.onDidChange(exportExtensionsData)
  );
}
