import * as vscode from 'vscode';

/**
 * Digistar 7 Scripting Extension for VS Code
 * Provides IntelliSense, snippets, and language support
 */

export function activate(context: vscode.ExtensionContext) {
    console.log('Digistar 7 Scripting extension is now active');

    // Register completion provider for Digistar API
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['javascript', 'digistar-js'],
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // Only show Ds completions after typing "Ds."
                if (!linePrefix.endsWith('Ds.')) {
                    return undefined;
                }

                const completions: vscode.CompletionItem[] = [];

                // Core API functions
                const apiFunctions = [
                    { name: 'SendMessage', detail: 'Send message to console', snippet: 'SendMessage(${1:0}, "${2:message}")' },
                    { name: 'SendStringCommand', detail: 'Send command string', snippet: 'SendStringCommand("${1:command}")' },
                    { name: 'Sleep', detail: 'Pause execution', snippet: 'Sleep(${1:1.0})' },
                    { name: 'Wait', detail: 'Wait without blocking', snippet: 'Wait(${1:5.0})' },
                    { name: 'CreateObject', detail: 'Create new object', snippet: 'CreateObject("${1:name}", "${2:class}", "${3:temporary}")' },
                    { name: 'DeleteObject', detail: 'Delete object', snippet: 'DeleteObject("${1:name}")' },
                    { name: 'GetObjectID', detail: 'Get object ID', snippet: 'GetObjectID("${1:name}")' },
                    { name: 'GetObjectAttr', detail: 'Get attribute value', snippet: 'GetObjectAttr("${1:object}", "${2:attribute}")' },
                    { name: 'SetObjectAttr', detail: 'Set attribute value', snippet: 'SetObjectAttr("${1:object}", "${2:attribute}", ${3:value})' },
                    { name: 'SceneAddObject', detail: 'Add to scene', snippet: 'SceneAddObject("${1:object}")' },
                    { name: 'SceneRemoveObject', detail: 'Remove from scene', snippet: 'SceneRemoveObject("${1:object}")' },
                    { name: 'GetObjPositionInDome', detail: 'Get dome position', snippet: 'GetObjPositionInDome("${1:object}")' },
                    { name: 'FileRead', detail: 'Read file', snippet: 'FileRead(ResolvePath("${1:$Content/file.txt}"))' },
                    { name: 'FileWrite', detail: 'Write file', snippet: 'FileWrite(ResolvePath("${1:$Content/output.txt}"), ${2:lines})' },
                    { name: 'ResolvePath', detail: 'Resolve path variables', snippet: 'ResolvePath("${1:$Content/}${2:file}")' },
                    { name: 'SystemCommand', detail: 'Execute system command', snippet: 'SystemCommand("${1:command}")' },
                ];

                apiFunctions.forEach(func => {
                    const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
                    item.detail = func.detail;
                    item.insertText = new vscode.SnippetString(func.snippet);
                    item.documentation = new vscode.MarkdownString(`**Digistar API:** ${func.detail}`);
                    completions.push(item);
                });

                return completions;
            }
        },
        '.' // Trigger on '.'
    );

    // Register hover provider for documentation
    const hoverProvider = vscode.languages.registerHoverProvider(
        ['javascript', 'digistar-js'],
        {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);

                // Check for Digistar API functions
                const docs: { [key: string]: string } = {
                    'SendMessage': '**Ds.SendMessage(level, message)**\n\nSend message to console\n- Level 0: Info\n- Level 1: Warning\n- Level 2: Error',
                    'Sleep': '**Ds.Sleep(seconds)**\n\nPause script execution (blocks Digistar)',
                    'Wait': '**Ds.Wait(seconds)**\n\nWait without blocking Digistar',
                    'SetObjectAttr': '**Ds.SetObjectAttr(object, attribute, value, controller?)**\n\nSet object attribute\n\nOptional controller: `{time: 5.0, func: "EaseInOut"}`',
                    'GetObjectAttr': '**Ds.GetObjectAttr(object, attribute, mode?)**\n\nGet object attribute value',
                };

                if (word in docs) {
                    return new vscode.Hover(new vscode.MarkdownString(docs[word]));
                }

                return null;
            }
        }
    );

    // Register diagnostics for common mistakes
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('digistar');
    context.subscriptions.push(diagnosticCollection);

    const diagnosticsProvider = vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;
        if (document.languageId !== 'javascript' && document.languageId !== 'digistar-js') {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();

        // Check for common mistakes
        // 1. Using os. instead of Ds.
        const osPattern = /\bos\.(SendMessage|Wait|Sleep|SystemCommand)/g;
        let match;
        while ((match = osPattern.exec(text)) !== null) {
            const range = new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );
            const diagnostic = new vscode.Diagnostic(
                range,
                `Use 'Ds.${match[1]}' instead of 'os.${match[1]}' in Digistar 7`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = 'digistar';
            diagnostics.push(diagnostic);
        }

        // 2. Degrees instead of radians warning
        const degreePattern = /(?:azimuth|elevation|ra|dec|declination):\s*(\d+)/gi;
        while ((match = degreePattern.exec(text)) !== null) {
            const value = parseInt(match[1]);
            if (value > 6.3) { // Likely degrees, not radians
                const range = new vscode.Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + match[0].length)
                );
                const diagnostic = new vscode.Diagnostic(
                    range,
                    'JavaScript uses RADIANS, not degrees. Convert with: (degrees * Math.PI / 180)',
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostic.source = 'digistar';
                diagnostics.push(diagnostic);
            }
        }

        diagnosticCollection.set(document.uri, diagnostics);
    });

    context.subscriptions.push(completionProvider, hoverProvider, diagnosticsProvider);
}

export function deactivate() {}
