import * as vscode from "vscode";
import * as fs from "fs";

interface ExtData {
  version: string;
  isActive: boolean;
  location: {
      scheme: string;
      authority: string;
      path: string;
      query: string;
      fragment: string;
      _formatted: string | null;
      _fsPath: string;
    };
}

interface ExtDict {
  [id: string]: ExtData;
}

const write = (path: string, data: string) => {
  fs.writeFileSync(path, data, "utf8");
};

const getInstalledExtDict = (includeBuiltin: boolean = false): ExtDict => {
  const extDict: ExtDict = {};
  vscode.extensions.all.forEach((ext) => {
    if (includeBuiltin || !ext.packageJSON.isBuiltin) {
      extDict[ext.id] = {
        // If there are multiple versions per ext.id, current using version is assigned
        version: ext.packageJSON.version, // ext.packageJSON.isBuiltin, ext.packageJSON.extensionLocation
        isActive: ext.isActive,
        location: {
          scheme: ext.packageJSON.extensionLocation.scheme,
          authority: ext.packageJSON.extensionLocation.authority,
          path: ext.packageJSON.extensionLocation.path,
          query: ext.packageJSON.extensionLocation.query,
          fragment: ext.packageJSON.extensionLocation.fragment,
          _formatted: ext.packageJSON.extensionLocation.toString(), // typically for formatted URI
          _fsPath: ext.packageJSON.extensionLocation.fsPath, // filesystem path
        },
        // location: ext.packageJSON.extensionLocation,
      };
    }
  });
  return extDict;
};

const exportExtensionsData = async () => {
  const config = vscode.workspace.getConfiguration("sync-extensions");
  const extDict = getInstalledExtDict();

  const saveUri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(config.path || "extensions.json"),
    filters: {
      JSON: ["json"]
    }
  });

  if (!saveUri) {
    vscode.window.showWarningMessage("Save operation was canceled.");
    return;
  }


  try {
    write(config.path, JSON.stringify(extDict, null, 2));
    vscode.window.showInformationMessage(
      `Exported Extensions list to
      [exported file path]: ${config.path}`
    );
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






const importExtensionsData = async () => {
  const config = vscode.workspace.getConfiguration("sync-extensions");
  const openUri = await vscode.window.showOpenDialog({
    defaultUri: vscode.Uri.file(config.path || "extensions.json"),
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      JSON: ["json"]
    },
    openLabel: "Import Extensions Data"
  });

  if (!openUri || openUri.length === 0) {
    vscode.window.showWarningMessage("Import operation was canceled.");
    return;
  }

  const filePath = openUri[0].fsPath;

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const extDict: ExtDict = JSON.parse(fileContent);

    // Process the imported extensions data
    Object.keys(extDict).forEach((extId) => {
      const extData = extDict[extId];
      console.log(`Extension ID: ${extId}`);
      console.log(`Version: ${extData.version}`);
      console.log(`Is Active: ${extData.isActive}`);
      console.log(`Location: ${extData.location._fsPath}`);
      // You can add more logic here to install the extensions, update settings, etc.
    });

    vscode.window.showInformationMessage(
      `Imported Extensions data from
      [imported file path]: ${filePath}`
    );
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    vscode.window.showErrorMessage(
      `Error reading extensions data
      [message]: ${errorMessage}
      [imported file path]: ${filePath}`
    );
  }
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


  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sync-extensions.importExtensionsData",
      importExtensionsData
    ),
    // cf. https://code.visualstudio.com/api/references/vscode-api#extensions
    vscode.extensions.onDidChange(importExtensionsData)
  );




	// let importExtensionsData = vscode.commands.registerCommand('sync-extensions.importExtensionsData', async () => {
	// 	// let filePathWithLineNumber;
	// 	// try {
	// 	// 	filePathWithLineNumber = await copyCurrentFilePathWithCurrentLineNumber();
	// 	// } catch (e) {
	// 	// 	if (e instanceof NoWorkspaceOpen) {
	// 	// 	} else if (e instanceof NoTextEditorOpen) {
	// 	// 	} else if (e instanceof DocumentIsUntitled) {
	// 	// 	} else {
	// 	// 		throw e;
	// 	// 	}
	// 	// }

	// 	// if (!filePathWithLineNumber) {
	// 	// 	throw new Error("Could not get file path with line number.");
	// 	// }
  //   vscode.window.showWarningMessage('Importing Extensions is not yet implemented!');
  //   // vscode.window.showInformationMessage('Importing Extensions is not yet implemented!');

	// 	// vscode.env.clipboard.writeText(filePathWithLineNumber).then(() => {
	// 	// 	vscode.window.showInformationMessage('URL Copied to Clipboard');
	// 	// });

	// });

	// context.subscriptions.push(importExtensionsData);
}
