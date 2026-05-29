import type { NodeDto } from "@mrsimon/shared";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

type TProps = {
  node: NodeDto;
  onOpenFolder: (id: string) => void;
};

export const NodeItem = ({ node, onOpenFolder }: TProps) => {
  const isFolder = node.type === "FOLDER";

  return (
    <Stack
      component={isFolder ? "button" : "div"}
      direction="row"
      spacing={1}
      onClick={isFolder ? () => onOpenFolder(node.id) : undefined}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        p: 1,
        mb: 1,
        cursor: isFolder ? "pointer" : "default",
        background: "transparent",
        textAlign: "left",
      }}
    >
      {!isFolder ? (
        <InsertDriveFileIcon sx={{ color: "#22C55E" }} />
      ) : (
        <FolderIcon sx={{ color: "#FFCF5C" }} />
      )}

      <Typography>{node.name}</Typography>
      <Typography>{node.status}</Typography>
    </Stack>
  );
};
