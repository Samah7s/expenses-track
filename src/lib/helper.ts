// function getOffset(currentPage: number = 1, listerPerPage: number) {
//   return (currentPage - 1) * [listerPerPage];
// }

function emptyOrRows(rows: string[]) {
  if (!rows) {
    return [];
  }
  return rows;
}

function propToUpdate(obj1: any, obj2: any): string[] {
  let keys = Object.keys(obj1);
  let keysToUpdate: string[] = [];
  keys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      keysToUpdate.push(key);
    }
  });
  return keysToUpdate;
}

export { emptyOrRows, propToUpdate };
