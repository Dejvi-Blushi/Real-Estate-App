export function randomNumericId(length = 8): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export function getDate() {
  const time = Date.now();
  return time;
}
