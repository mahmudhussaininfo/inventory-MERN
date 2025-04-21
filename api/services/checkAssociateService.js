export const checkAssociateService = async (queryObjectId, assoCiateModel) => {
  try {
    const data = await assoCiateModel.aggregate([{ $match: queryObjectId }]);
    return data.length > 0;
  } catch (error) {
    return false;
  }
};
