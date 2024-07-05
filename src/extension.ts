import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Explorer Exclude Toggle extension is now active!');

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'explorer-exclude-toggle.toggleFilesExclude';
    context.subscriptions.push(statusBarItem);

    const toggleCommand = vscode.commands.registerCommand('explorer-exclude-toggle.toggleFilesExclude', async () => {
        await toggleFilesExclude(context);
    });

    const setTrueCommand = vscode.commands.registerCommand('explorer-exclude-toggle.setFilesExcludeTrue', async () => {
        await setFilesExclude(context, true);
    });

    const setFalseCommand = vscode.commands.registerCommand('explorer-exclude-toggle.setFilesExcludeFalse', async () => {
        await setFilesExclude(context, false);
    });

    context.subscriptions.push(toggleCommand, setTrueCommand, setFalseCommand);

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('explorerExcludeToggle.showStatusBarIcon')) {
            updateStatusBarIcon(context);
        }
    });

    // Ensure the status bar icon is visible on activation
    updateStatusBarIcon(context);

    // Initialize state based on current settings
    initializeState(context);
}

async function initializeState(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration();
    const filesExclude = config.get<{ [key: string]: boolean }>('files.exclude', {});
    const keepSystemFilesHidden = config.get<boolean>('explorerExcludeToggle.keepSystemFilesHidden', true);

    let initialState = 'hidden';
    for (const key in filesExclude) {
        if (filesExclude.hasOwnProperty(key)) {
            if (keepSystemFilesHidden && isSystemFile(key)) {
                continue;
            }
            if (filesExclude[key] === true) {
                initialState = 'visible';
                break;
            }
        }
    }

    context.globalState.update('lastStatus', initialState);
    updateStatusBarIcon(context);
}

async function toggleFilesExclude(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration();
    const filesExclude = config.inspect<{ [key: string]: boolean }>('files.exclude');

    if (filesExclude) {
        const keepSystemFilesHidden = config.get<boolean>('explorerExcludeToggle.keepSystemFilesHidden', true);
        const ignoreExclusions = config.get<string[]>('explorerExcludeToggle.ignoreExclusions', []);
        const showNotifications = config.get<boolean>('explorerExcludeToggle.showNotifications', false);

        const currentValues = filesExclude.workspaceValue || filesExclude.globalValue || {};
        const newValues: { [key: string]: boolean } = {};
        const report: string[] = [];

        for (const key in currentValues) {
            if (ignoreExclusions.includes(key)) continue;
            const newValue = !currentValues[key];
            if (keepSystemFilesHidden && isSystemFile(key)) {
                newValues[key] = true;
            } else {
                newValues[key] = newValue;
                report.push(`${key}: ${currentValues[key]} -> ${newValue}`);
            }
        }

        if (filesExclude.workspaceValue) {
            await config.update('files.exclude', newValues, vscode.ConfigurationTarget.Workspace);
        } else if (filesExclude.globalValue) {
            await config.update('files.exclude', newValues, vscode.ConfigurationTarget.Global);
        }

        if (showNotifications && report.length > 0) {
            vscode.window.showInformationMessage(`Toggled files.exclude entries:\n${report.join('\n')}`);
        }

        const lastStatus = context.globalState.get('lastStatus', 'hidden');
        const newStatus = lastStatus === 'hidden' ? 'visible' : 'hidden';
        context.globalState.update('lastStatus', newStatus);
        updateStatusBarIcon(context);
    }
}

async function setFilesExclude(context: vscode.ExtensionContext, value: boolean) {
    const config = vscode.workspace.getConfiguration();
    const filesExclude = config.inspect<{ [key: string]: boolean }>('files.exclude');

    if (filesExclude) {
        const currentValues = filesExclude.workspaceValue || filesExclude.globalValue || {};
        const newValues: { [key: string]: boolean } = {};
        const report: string[] = [];
        const showNotifications = config.get<boolean>('explorerExcludeToggle.showNotifications', false);

        for (const key in currentValues) {
            newValues[key] = value;
            if (!(isSystemFile(key) && config.get<boolean>('explorerExcludeToggle.keepSystemFilesHidden', true)) && !config.get<string[]>('explorerExcludeToggle.ignoreExclusions', []).includes(key)) {
                report.push(`${key}: ${currentValues[key]} -> ${value}`);
            }
        }

        if (filesExclude.workspaceValue) {
            await config.update('files.exclude', newValues, vscode.ConfigurationTarget.Workspace);
        } else if (filesExclude.globalValue) {
            await config.update('files.exclude', newValues, vscode.ConfigurationTarget.Global);
        }

        if (showNotifications && report.length > 0) {
            vscode.window.showInformationMessage(`Set all files.exclude entries to ${value}:\n${report.join('\n')}`);
        }

        const newStatus = value ? 'hidden' : 'visible';
        context.globalState.update('lastStatus', newStatus);
        updateStatusBarIcon(context);
    }
}

function updateStatusBarIcon(context: vscode.ExtensionContext) {
    const showStatusBarIcon = vscode.workspace.getConfiguration().get<boolean>('explorerExcludeToggle.showStatusBarIcon', true);

    if (!showStatusBarIcon) {
        statusBarItem.hide();
        return;
    }

    const lastStatus = context.globalState.get('lastStatus', 'hidden');
    statusBarItem.text = lastStatus !== 'hidden' ? `$(eye) Files Visible` : `$(eye-closed) Files Hidden`;
    statusBarItem.tooltip = lastStatus !== 'hidden' ? 'Hide Excluded Files' : 'Show Excluded Files';
    statusBarItem.show();
}

function isSystemFile(filePath: string): boolean {
    const systemFiles = ['**/.git', '**/.svn', '**/.hg', '**/CVS', '**/.DS_Store', '**/Thumbs.db'];
    return systemFiles.includes(filePath);
}

export function deactivate() {
    console.log('Explorer Exclude Toggle extension is now deactivated!');
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
