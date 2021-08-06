const Sum = require('./Sum');

module.exports = async (sourceData, transferParam) => {
  const sum = await Sum(sourceData);
  return sum / sourceData.length;
};
