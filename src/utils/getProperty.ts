export function getDocumentProperty(object: any, idKey: string) {
  let result;
  if (object) {
    type MyObjectKey = keyof typeof object;
    const myId = idKey as MyObjectKey;
    result = object[myId];
  }
  return "" + result;
}
