async function parseFromDataWithPath (data, pathArray) {
  const key = pathArray[0];
  if (pathArray.length === 1) {
    return data[key];
  }

  let parseResult;

  if (key === '$') {
    parseResult = Promise.all(data.map((p) => {
      return parseFromDataWithPath(p, pathArray.slice(1, pathArray.length));
    }));
  } else {
    parseResult = parseFromDataWithPath(data[key], pathArray.slice(1, pathArray.length));
  }

  return parseResult;
}

module.exports = { parseFromDataWithPath };
