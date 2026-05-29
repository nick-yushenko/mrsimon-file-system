import { useState } from "react";
import Paper from "@mui/material/Paper";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import { NodeItem } from "@/widgets/fm/ui/nodeItem";
import { useFmQuery } from "@/entities/fm/models/queries";
import { AddFolderDialog } from "@/widgets/fm/actions/addFolderDialog";
import { UploadFilesDialog } from "@/widgets/fm/actions/UploadFilesDialog";

export const FileManager = () => {
  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const query = useFmQuery(parentId);

  const nodes = query.data?.nodes;
  const breadcrumbs = query.data?.breadcrumbs ?? [];

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 3 }}>
        <>
          <h1>File System</h1>

          <Breadcrumbs sx={{ mb: 2 }}>
            {breadcrumbs.map((item) => (
              <MuiLink
                key={item.id ?? "root"}
                component="button"
                type="button"
                underline="hover"
                onClick={() => setParentId(item.id)}
              >
                {item.name}
              </MuiLink>
            ))}
          </Breadcrumbs>

          <Button variant="outlined" onClick={() => setOpen(true)}>
            Создать папку
          </Button>

          <Button variant="outlined" onClick={() => setUploadOpen(true)}>
            Добавить файл
          </Button>

          <Divider sx={{ my: 2 }} />
          {nodes?.map((item) => (
            <NodeItem key={item.id} node={item} onOpenFolder={setParentId} />
          ))}
        </>
      </Paper>

      <AddFolderDialog open={open} parentId={parentId} onClose={() => setOpen(false)} />
      <UploadFilesDialog
        open={uploadOpen}
        parentId={parentId}
        onClose={() => setUploadOpen(false)}
      />
    </>
  );
};
