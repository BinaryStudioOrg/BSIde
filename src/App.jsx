import { useState } from "react";
import Editor from "./components/Editor";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Consolas, monospace",
  },
  sidebar: {
    width: "240px",
    borderRight: "1px solid #333",
    backgroundColor: "#2d2d2d",
    color: "#b5b5b5",
    padding: "10px",
    overflowY: "auto",
  },
  fileItem: {
    padding: "8px 15px",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
  },
  fileItemHover: {
    backgroundColor: "#3a3d42",
    color: "#ffffff",
  },
  fileItemSelected: {
    backgroundColor: "#007acc",
    color: "#ffffff",
  },
  header: {
    backgroundColor: "#333333",
    color: "#ffffff",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "1px solid #444",
  },
  button: {
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
    backgroundColor: "#007acc",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  fileIcon: {
    fontSize: "16px",
    marginRight: "8px",
  },
};

const App = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    name: "index.js",
    content: "// Start coding here!",
  });

  const handleSelectFolder = async () => {
    const folderData = await window.electron.selectFolder();
    if (folderData) {
      setSelectedFolder(folderData);
    }
  };

  const handleFileClick = async (file) => {
    if (!file.isDirectory) {
      try {
        const fileContent = await window.electron.readFile(file.path);
        setSelectedFile({ name: file.name, content: fileContent });
      } catch (error) {
        console.error("Error loading file:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <button onClick={handleSelectFolder} style={styles.button}>
          Select Folder
        </button>
        {selectedFolder?.files.map((file) => (
          <div
            key={file.path}
            style={{
              ...styles.fileItem,
              ...(selectedFile.name === file.name && styles.fileItemSelected),
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.fileItemHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                selectedFile.name === file.name
                  ? styles.fileItemSelected.backgroundColor
                  : "transparent")
            }
            onClick={() => handleFileClick(file)}
          >
            <span style={styles.fileIcon}>
              {file.isDirectory ? "📁" : "📄"}
            </span>
            {file.name}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={styles.header}>{selectedFile.name}</div>
        <Editor
          fileName={selectedFile.name}
          initialValue={selectedFile.content}
        />
      </div>
    </div>
  );
};

export default App;
