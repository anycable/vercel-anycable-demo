function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function seededRandom<T>(id: string, arr: T[]) {
  const hash = simpleHash(id);
  const index = Math.abs(hash) % arr.length;
  return arr[index];
}
