import React from 'react'
import MonacoEditor from 'react-monaco-editor';
import './CodeEditor.css';

const CodeEditor = ({code, language, onChangeCode}) => {

    const options = {
        selectOnLineNumbers: true,
        copyWithSyntaxHighlighting: true,
        colorDecorators: true,
        quickSuggestions: false
    };

    const editorDidMount = (editor, monaco) => {
        // console.log('editorDidMount', editor);
        editor.focus();
    }
    const onChange = (newValue, e) => {
        console.log('onChange', newValue, e);
        onChangeCode(newValue);
    }
    // const code = 'console.log("Hi")';
    return (
        <div className="code-editor-container">
            <MonacoEditor
                width="35em"
                height="30em"
                language={language}
                theme="vs-dark"
                value={code}
                options={options}
                onChange={onChange}
                className="language-js"
                editorDidMount={editorDidMount}
            />
        </div>
    )
}

export default CodeEditor
