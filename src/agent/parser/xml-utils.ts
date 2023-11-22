export function toNode(xmlObject: any) {
  const node: Partial<{
    name: string;
    text: string;
    attrs: { [key: string]: any };
    children: any[];
  }> = {};

  let setTimes = 0;
  const keys = Object.keys(xmlObject);
  keys.forEach(key => {
    if (key === ':@') {
      node.attrs = xmlObject[key];
    } else if (key === '#text') {
      node.name = key;
      node.text = xmlObject[key];
    } else {
      node.name = key;
      node.children = xmlObject[key];
      setTimes += 1;
    }
  });
  if (setTimes > 1) {
    throw new TypeError('Invalid XML object, which has more than attributes and children members, the object keys are: ' + JSON.stringify(keys));
  }

  if (!node.attrs) {
    node.attrs = {};
  }
  return node;
}
