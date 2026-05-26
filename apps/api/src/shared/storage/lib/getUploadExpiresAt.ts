export const getUploadExpiresAt = (size: number) => {
  const minMinutes = 30;
  const maxMinutes = 24 * 60;

  // грубая оценка: 1 МБ ≈ 1 минута ожидания
  const sizeMb = Math.ceil(size / 1024 / 1024);

  const minutes = Math.min(Math.max(sizeMb, minMinutes), maxMinutes);

  return new Date(Date.now() + minutes * 60 * 1000);
};
