import { useFmQuery } from "@/entities/fm/models/queries";
import { AddFolderDialog } from "@/widgets/fm/actions/addFolderDialog";
import { NodeItem } from "@/widgets/fm/ui/nodeItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";

type FileSystemItem = {
  id: string;
  name: string;
  type: "file" | "folder";
};

type FilesResponse = {
  items: FileSystemItem[];
};

type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "preparing" | "uploading" | "completing" | "uploaded" | "error";
};

function uploadFile(uploadUrl: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);

      onProgress(progress);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("PUT", uploadUrl);

    xhr.setRequestHeader("Content-Type", file.type);

    xhr.send(file);
  });
}

export const FileManager = () => {
  const [open, setOpen] = useState(false);

  const query = useFmQuery();

  const nodes = query.data;

  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];

  //   if (!file) {
  //     return;
  //   }

  //   const tempId = crypto.randomUUID();

  //   setUploads((prev) => [
  //     ...prev,
  //     {
  //       id: tempId,
  //       name: file.name,
  //       progress: 0,
  //       status: "preparing",
  //     },
  //   ]);

  //   try {
  //     // 1. Получаем upload URL
  //     const response = await fetch("http://localhost:3001/api/files/nodes/upload-url", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: file.name,
  //         mimeType: file.type,
  //         size: file.size,
  //         parentId: null,
  //       }),
  //     });

  //     const data = await response.json();

  //     const uploadUrl = data.uploadUrl;
  //     const nodeId = data.node.id;

  //     updateUpload(tempId, {
  //       status: "uploading",
  //     });

  //     // 2. Загружаем файл в S3
  //     await uploadFile(uploadUrl, file, (progress) => {
  //       updateUpload(tempId, {
  //         progress,
  //       });
  //     });

  //     updateUpload(tempId, {
  //       status: "completing",
  //     });

  //     // 3. Подтверждаем upload
  //     await fetch(`http://localhost:3001/api/files/nodes/${nodeId}/complete-upload`, {
  //       method: "POST",
  //     });

  //     updateUpload(tempId, {
  //       progress: 100,
  //       status: "uploaded",
  //     });
  //   } catch (error) {
  //     console.error(error);

  //     updateUpload(tempId, {
  //       status: "error",
  //     });
  //   }
  // };

  // const updateUpload = (id: string, patch: Partial<UploadItem>) => {
  //   setUploads((prev) =>
  //     prev.map((item) => {
  //       if (item.id !== id) {
  //         return item;
  //       }

  //       return {
  //         ...item,
  //         ...patch,
  //       };
  //     }),
  //   );
  // };

  // useEffect(() => {
  //   async function loadFiles() {
  //     try {
  //       const response = await fetch("http://localhost:3001/api/files/nodes");

  //       if (!response.ok) {
  //         throw new Error("Failed to load files");
  //       }

  //       const data = (await response.json()) as FileSystemItem[];
  //       setItems(data);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   void loadFiles();
  // }, []);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 3 }}>
        <>
          <h1>File System</h1>

          {/* <input type="file" onChange={handleFileChange} /> */}

          <div style={{ marginTop: 16 }}>
            {uploads.map((upload) => (
              <div
                key={upload.id}
                style={{
                  padding: 8,
                  border: "1px solid #ccc",
                  marginBottom: 8,
                }}
              >
                <div>{upload.name}</div>

                <div>Status: {upload.status}</div>

                <div>Progress: {upload.progress}%</div>
              </div>
            ))}
          </div>

          <Button variant="outlined" onClick={() => setOpen(true)}>
            Создать папку
          </Button>

          <Divider sx={{ my: 2 }} />
          {nodes?.map((item) => (
            <NodeItem key={item.id} node={item} />
          ))}
        </>
      </Paper>

      <AddFolderDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};
