Ctrl+K Ctrl+S  atajos

Ctrl+Shift+O || Cmd+P (and type an @) outline  

Ctrl + Shift + x extencions

Ctrl + alt + z extencions

```Json
///locales
{
  "key": "ctrl+k ctrl+[Comma]",
  "command": "editor.createFoldingRangeFromSelection",
  "when": "editorTextFocus && foldingEnabled"
},
{
  "key": "ctrl+k ctrl+[Period]",
  "command": "editor.removeManualFoldingRanges",
  "when": "editorTextFocus && foldingEnabled"
}
///////// personales
{
  "key": "alt+w alt+w",
  "command": "editor.action.toggleRenderWhitespace"
}
{
  "key": "ctrl+m ctrl+m",
  "command": "markdownlint.fixAll"
}
{
  "key": "ctrl+m ctrl+l",
  "command": "markdown.showLockedPreviewToSide"
}

////editados
{
  "key": "ctrl+alt+r",////// "ctrl+k ctrl+o",
  "command": "workbench.action.files.openFolder",
  "when": "openFolderWorkspaceSupport && !isSessionsWindow"
}
´´´
