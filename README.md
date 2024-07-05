# Explorer Exclude Toggle

Explorer Exclude Toggle is a VS Code extension that allows you to easily toggle the `files.exclude` settings in your user or workspace settings.

## Motivation

Managing larger projects in VS Code containing numerous template and generator files clutters the workspace. While these files may be hidden by setting `files.exclude`, occasional modifications or additions require their visibility. Explorer Exclude Toggle provides a quick and efficient solution to toggle the visibility of these files in the VS Code explorer.

## Features

- Toggle all entries in `files.exclude` between `true` and `false`.
- Set all entries in `files.exclude` to `true`.
- Set all entries in `files.exclude` to `false`.
- Keep system files hidden when toggling.
- Ignore specific exclusions when toggling.
- Status bar icon to quickly toggle file visibility.

## Usage

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
2. Type one of the following commands and select it:
   - `Toggle Files Exclude`
   - `Toggle Files Exclude (Hide)`
   - `Toggle Files Exclude (Show)`
3. Use the status bar icon to quickly toggle file visibility.
4. Use the keybinding `Ctrl+Shift+E` (or `Cmd+Shift+E` on macOS) to toggle files.exclude.

## Settings

- `explorerExcludeToggle.keepSystemFilesHidden`: Keep system files hidden when toggling (default: `true`).
- `explorerExcludeToggle.ignoreExclusions`: List of exclusions to ignore when toggling (default: `[]`).
- `explorerExcludeToggle.showStatusBarIcon`: Show status bar icon for toggling files.exclude (default: `true`).
- `explorerExcludeToggle.showNotifications`: Show notifications when toggling files.exclude (default: `false`).

## Requirements

This extension has no additional requirements or dependencies.

## Known Issues

There are currently no known issues. If you encounter any problems, please report them on the [issue tracker](https://github.com/khrisgriffis/explorer-exclude-toggle/issues).

## Release Notes

### 1.1.0

- Added commands to set all entries in `files.exclude` to `true` or `false`.
- Improved handling of configuration settings.
- Added detailed logging for better debugging.
- Updated command titles for clarity:
  - `Toggle Files Exclude`
  - `Toggle Files Exclude (Hide)`
  - `Toggle Files Exclude (Show)`
- Added status bar icon to quickly toggle file visibility.
- Added settings to keep system files hidden and to ignore specific exclusions.
- Added setting to show notifications when toggling files.exclude.
- Added keybinding `Ctrl+Shift+E` (or `Cmd+Shift+E` on macOS) to toggle files.exclude.

### 1.0.1

- Updated README

### 1.0.0

- Initial release of Explorer Exclude Toggle

## License

MIT
