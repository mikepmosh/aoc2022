import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const mixNumber = (oldIndex, encryptedFile, decryptedFile) =>
{
  const currentIndex = decryptedFile.indexOf(encryptedFile[oldIndex]);
  const newIndex = (currentIndex + encryptedFile[oldIndex].value)  % (decryptedFile.length - 1);

  decryptedFile.splice(currentIndex, 1);
  decryptedFile.splice(newIndex, 0, encryptedFile[oldIndex]);
};

const getGroveCoordinates = (decryptedFile) => {
  let idxOf0 = decryptedFile.indexOf(decryptedFile.find((item) => item.value === 0));

  let sum = 0;
  for (let i = 1000; i <= 3000; i += 1000) {
    let groveCoordinate = (i + idxOf0) % decryptedFile.length;
    sum += decryptedFile[groveCoordinate].value;
  }

  return sum;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const encryptedFile = inputLines.map((line, index) => ({ value: parseFloat(line), index }));

  const decryptedFile = [...encryptedFile];
  for (let i = 0; i < encryptedFile.length; i++) {
    mixNumber(i, encryptedFile, decryptedFile);
  }

  return getGroveCoordinates(decryptedFile);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const encryptedFile = inputLines.map((line, index) => ({ value: parseFloat(line), index }));

  encryptedFile.forEach((item) => (item.value *= 811589153));

  const decryptedFile = [...encryptedFile];
  for (let count = 0; count < 10; count++) {
    for (let i = 0; i < encryptedFile.length; i++) {
      mixNumber(i, encryptedFile, decryptedFile);
    }
  }

  return getGroveCoordinates(decryptedFile);
};

run({
  part1: {
    tests: [
      {
        input: `1\n2\n-3\n3\n-2\n0\n4`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1\n2\n-3\n3\n-2\n0\n4`,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
