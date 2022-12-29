import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const mixNumber = (oldIndex, encryptedFile, decryptedFile) =>
{
  const currentIndex = decryptedFile.indexOf(encryptedFile[oldIndex]);
  const newIndex = (currentIndex + encryptedFile[oldIndex].value) % (decryptedFile.length - 1);

  decryptedFile.splice(currentIndex, 1);
  decryptedFile.splice(newIndex, 0, encryptedFile[oldIndex]);
};

const getGroveCoordinates = (encryptedFile, decryptedFile) => {
  const startIndex = decryptedFile.indexOf(encryptedFile.find((elem) => elem.value == 0));

  return [1000, 2000, 3000].reduce((acc, elem) => (acc + decryptedFile[(startIndex + elem) % decryptedFile.length].value), 0);
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const encryptedFile = inputLines.map((line, index) => ({ value: parseFloat(line), index }));
  const decryptedFile = [...encryptedFile];

  for (let index = 0; index < encryptedFile.length; index++) {
    mixNumber(index, encryptedFile, decryptedFile);
  }

  return getGroveCoordinates(encryptedFile, decryptedFile);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const encryptedFile = inputLines.map((line, index) => ({ value: parseFloat(line) * 811589153, index }));
  const decryptedFile = [...encryptedFile];

  for (let mixCounter = 0; mixCounter < 10; mixCounter++) {
    for (let index = 0; index < encryptedFile.length; index++) {
      mixNumber(index, encryptedFile, decryptedFile);
    }
  }

  return getGroveCoordinates(encryptedFile, decryptedFile);
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
