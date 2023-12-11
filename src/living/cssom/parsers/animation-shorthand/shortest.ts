export const shortest = (...list: Array<string>): string => {
  const listLength = list.length;
  let result = list[0];
  for (let index = 1; index < listLength; index++) {
    const candidate = list[index];
    if (candidate.length < result.length) {
      result = candidate;
    }
  }
  return result;
};
