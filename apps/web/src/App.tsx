import "./App.css";

import { useState, useEffect } from "react";

type FileSystemItem = {
  id: string;
  name: string;
  type: "file" | "folder";
};

type FilesResponse = {
  items: FileSystemItem[];
};

function App() {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        const response = await fetch("http://localhost:4000/api/files");

        if (!response.ok) {
          throw new Error("Failed to load files");
        }

        const data = (await response.json()) as FilesResponse;
        setItems(data.items);
      } finally {
        setIsLoading(false);
      }
    }

    void loadFiles();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>File System</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.type === "folder" ? "📁" : "📄"} {item.name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
