import { useEffect, useState, useRef } from "react";
import * as monaco from "monaco-editor";

const Editor = ({ fileName = "index.js", initialValue = "" }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    console.log("Initializing Editor...");
    const editor = monaco.editor.create(editorRef.current, {
      value: initialValue || "// Start coding...",
      language: getLanguageFromFileName(fileName),
      theme: "vs-dark",
    });

    // تحديث المحتوى عند التعديل
    editor.onDidChangeModelContent(() => {
      setContent(editor.getValue());
    });

    // التعامل مع اختصار Ctrl+S للحفظ
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveFile();  // استدعاء وظيفة الحفظ
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      editor.dispose();
    };
  }, [fileName, initialValue]);

  const saveFile = () => {
    // إرسال البيانات إلى Electron لحفظ الملف
    window.electron.saveFile(fileName, content);
  };

  const getLanguageFromFileName = (fileName) => {
    const extension = fileName.split(".").pop();
    const languages = monaco.languages.getLanguages();
    const language = languages.find((lang) =>
      lang.extensions?.includes(`.${extension}`)
    );
    return language?.id || "plaintext";
  };

  return (
    <div ref={editorRef} style={{ height: "100vh" }} />
  );
};

export default Editor;
