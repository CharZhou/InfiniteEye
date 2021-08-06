module.exports = async (sourceData, transferParam) => {
  return sourceData.reduce((total, num) => {
    return total + num;
  });
};
