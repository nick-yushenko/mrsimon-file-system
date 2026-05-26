import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useFmActions } from "@/entities/fm/models/actions";

type TProps = {
  open: boolean;
  onClose: () => void;
};

export type CreateFolderRequest = {
  name: string;
  type: "FOLDER";
  parentId?: string | null;
};

export const AddFolderDialog = ({ open, onClose }: TProps) => {
  const formId = "add-folder-form";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateFolderRequest>({
    defaultValues: {
      name: "",
      type: "FOLDER",
      parentId: null,
    },
  });

  const { createFolder, isCreating, creatingError } = useFmActions();

  const onSubmit = (data: CreateFolderRequest) => {
    createFolder(data);
    console.log(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Создать папку</DialogTitle>

      <DialogContent>
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
