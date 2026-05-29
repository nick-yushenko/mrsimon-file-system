import type { CreateFolderRequest } from "@mrsimon/shared";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { useFmActions } from "@/entities/fm/models/actions";

type TProps = {
  open: boolean;
  onClose: () => void;
  parentId: string | null;
};

const formId = "add-folder-form";

export const AddFolderDialog = ({ open, onClose, parentId }: TProps) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFolderRequest>({
    defaultValues: {
      name: "",
      type: "FOLDER",
      parentId: null,
    },
  });

  const { createFolder, isCreating, creatingError } = useFmActions(parentId);

  const onSubmit = async (data: CreateFolderRequest) => {
    const res = await createFolder({
      ...data,
      parentId,
    });

    if (res.renamed) {
      alert(`Папка "${res.originalName}" уже существует. Новое имя: "${res.node.name}"`);
    }

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Создать папку</DialogTitle>

      <DialogContent>
        {creatingError?.message && <Typography color="error">{creatingError.message}</Typography>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} id={formId} sx={{ py: 1 }}>
          <TextField
            fullWidth
            label="Название"
            {...register("name", { required: "Название обязательно" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button type="submit" form={formId} loading={isCreating}>
          Создать папку
        </Button>
      </DialogActions>
    </Dialog>
  );
};
