export const saveTrainingResults = async (answers) => {
  const response = await api.post("/training/save", answers);
  return response.data;
};