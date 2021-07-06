export function reverse<T>(arr: Array<T>): Array<T> {
  return [...arr].map(arr.pop, arr);
}
