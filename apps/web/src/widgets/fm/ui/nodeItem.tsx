import type { NodeDto } from "@mrsimon/shared";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
type TProps = {
  node: NodeDto;
};
export const NodeItem = ({ node }: TProps) => {
  return (
    <Stack direction="row" sx={{ border: "1px solid", borderColor: "divider", p: 1, mb: 1 }}>
      {node.type === "FILE" ? (
        <InsertDriveFileIcon sx={{ color: "#22C55E" }} />
      ) : (
        <FolderIcon sx={{ color: "#FFCF5C" }} />
      )}

      <Typography>{node.name}</Typography>
    </Stack>
  );
};
