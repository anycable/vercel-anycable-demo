export function truthy<T>(val: T | false | null | undefined): asserts val is T {
  if (val === void 0 || val === false || val === null) {
    throw new Error("Cannot be falsy");
  }
}

export function exists<T>(val: T | false | null | undefined): T {
  truthy(val);
  return val;
}
