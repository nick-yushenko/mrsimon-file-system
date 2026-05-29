import type { CreateUploadUrlRequest } from "@mrsimon/shared";

import { useState } from "react";
import Box from "@mui/material/Box";
import Dropzone from "react-dropzone";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { uploadFileToUrl } from "@/shared/api/uploadFile";
import { useFmActions } from "@/entities/fm/models/actions";

type TProps = {
  open: boolean;
  onClose: () => void;
  parentId: string | null;
};

const formId = "upload-files-form";

export const UploadFilesDialog = ({ open, onClose, parentId }: TProps) => {
  const [uploads, setUploads] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUploadUrlRequest>({
    defaultValues: {
      name: "",
      type: "FILE",
      size: 0,
      parentId: null,
    },
  });

  const { createUploadUrl, completeUpload, isCreating, creatingError } = useFmActions(parentId);

  const onDrop = (acceptedFiles: File[]) => {
    setUploads(acceptedFiles);
  };

  const onSubmit = async (data: CreateUploadUrlRequest) => {
    const file = uploads[0];

    if (!file) {
      alert("no files");
      return;
    }
    try {
      const res = await createUploadUrl({
        ...data,
        parentId,
        mimeType: file.type,
        size: file.size,
      });

      if (res.renamed) {
        alert(`Файл "${res.originalName}" уже существует. Новое имя: "${res.node.name}"`);
      }

      await uploadFileToUrl(res.uploadUrl, file, {
        onProgress: (progress) => console.log(progress),
      });

      await completeUpload(res.node.id);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Создать папку</DialogTitle>

      <DialogContent>
        {creatingError?.message && <Typography color="error">{creatingError.message}</Typography>}

        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          id={formId}
          sx={{ py: 1 }}
        >
          <TextField
            fullWidth
            label="Название"
            {...register("name", { required: "Название обязательно" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Dropzone onDrop={onDrop} maxFiles={1}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Box
                sx={{
                  height: "240px",
                  border: "1px dashed",
                  borderColor: isDragActive ? "red" : "gray",
                  borderRadius: 2,
                  p: 2,
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {uploads.map((item) => (
                  <Stack spacing={1}>
                    <InsertDriveFileIcon />
                    <Typography>{item.name}</Typography>
                    <Typography>{item.size}</Typography>
                  </Stack>
                ))}
              </Box>
            )}
          </Dropzone>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button type="submit" form={formId} loading={isCreating}>
          Создать папку
        </Button>
      </DialogActions>
    </Dialog>
  );
};
