/**
 * Inserts zero if the input data is undefined.
 * 
 * @param data - The input data, which can be of any type.
 * @returns The input data if it is not undefined, otherwise returns zero.
 */
export const insertZeroIfUndefined = (data?: any): number => {
  return !!data ? data : 0
}