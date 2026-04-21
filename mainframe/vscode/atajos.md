
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
  "key": "alt+w alt+w",//muestra espacios en blanco
  "command": "editor.action.toggleRenderWhitespace"
}
{
  "key": "ctrl+m ctrl+m",//arregla los problemas
  "command": "markdownlint.fixAll"
}
{
  "key": "ctrl+m ctrl+l",
  "command": "markdown.showLockedPreviewToSide"
}

////editados
{
  "key": "ctrl+alt+r",//ctrl+k ctrl+s
  "command": "workbench.action.openGlobalKeybindings"
}
{
  "key": "ctrl+alt+c",//ctrl+k ctrl+u
  "command": "editor.action.addCommentLine",
  "when": "editorTextFocus && !editorReadonly"
}
{
  "key": "ctrl+alt+u",//ctrl+k ctrl+u
  "command": "editor.action.addCommentLine",
  "when": "editorTextFocus && !editorReadonly"
}
{
  "key":  "ctrl+alt+o",//"ctrl+shift+o",
  "command": "editor.action.accessibleViewGoToSymbol",
  "when": "accessibilityHelpIsShown && accessibleViewGoToSymbolSupported || accessibleViewGoToSymbolSupported && accessibleViewIsShown"
}
{
  "key":  "ctrl+alt+o",// "key": "ctrl+alt+o",
  "command": "workbench.action.gotoSymbol",
  "when": "!accessibilityHelpIsShown && !accessibleViewIsShown"
}
{
  "key": "ctrl+shift+p",
  "command": "workbench.action.showCommands"
}
/////eliminados
{
  "key": "ctrl+alt+o",
  "command": "workbench.action.remote.showMenu"
}
´´´
