const codes = { e: "enter", i: "imes", a: "ai", o: "ober", u: "ufat" };
const codesEntries = Object.entries(codes);
const encryptMap = new Map(codesEntries);
const decryptMap = new Map(codesEntries.map((code) => code.reverse()));

function encrypt(text) {
  const resultArray = [...text].reduce((result, letter) => {
    if (encryptMap.has(letter)) result.push(...encryptMap.get(letter));
    else result.push(letter);

    return result;
  }, []);

  return resultArray.join("");
}

function decrypt(encryptText) {
  const splittedText = splitByCodes(encryptText);

  if (!splittedText) return encryptText;

  const resultArray = [];
  for (const text of splittedText) {
    if (decryptMap.has(text)) resultArray.push(decryptMap.get(text));
    else resultArray.push(text);
  }

  return resultArray.join("");
}

function findAll(inputStr, targetStr) {
  let i = 0;
  const result = [];
  while (i < inputStr.length) {
    const finded = inputStr.indexOf(targetStr, i);

    if (finded < 0) break;

    result.push(finded);
    i = finded + targetStr.length;
  }

  return result.length > 0 ? result : null;
}

function splitByCodes(str) {
  const splitPoints = [];
  for (const code of decryptMap.keys()) {
    const startPositions = findAll(str, code);
    if (!startPositions) continue;

    const wholePositions = startPositions.reduce((all, curr) => {
      all.push(curr, curr + code.length);
      return all;
    }, []);

    if (wholePositions.length > 0) splitPoints.push(...wholePositions);
  }

  if (splitPoints.length === 0) return null;

  const sortedPoints = splitPoints.toSorted((a, b) => a - b);

  const result = [];
  let position = 0;
  for (let i = 0; i < sortedPoints.length; i++) {
    const next = sortedPoints.at(i);

    if (position === next) continue;

    result.push(str.substring(position, next));

    position = next;
  }

  if (position < str.length) result.push(str.substring(position));

  return result;
}

export { encrypt, decrypt };
