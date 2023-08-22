export function join(arr: string[], separator = "\n") {
  let result = arr[0] ?? "";

  const until = arr.length;
  for (let i = 1; i < until; i++) {
    result += separator + arr[i]!;
  }

  return result;
}
