export const naturalSort = (array: { [key: string]: string }[], order: "asc" | "desc", column: string) => {
  return [...array].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];
    if (order === "asc") {
        return valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
    } else {
      return valueB.localeCompare(valueA, undefined, { numeric: true, sensitivity: 'base' });
    }
  });
};
