import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const weightsToValue = ['=','-','0','1','2'].reduce((acc, elem, idx) => { acc[elem] = idx - 2; return acc; }, {});
const valueToWeights = Object.keys(weightsToValue).reduce((acc, elem) => { acc[weightsToValue[elem]] = elem; return acc; }, {})

const convertToDecimal = (snafulValues, pow = 0) =>
  (snafulValues.length == 0)? 0 : weightsToValue[snafulValues.pop()]*Math.pow(5, pow) + convertToDecimal(snafulValues, pow+1);

const convertToSnafu = (decimal) =>
  (decimal <= 0)? "" : convertToSnafu(Math.floor((decimal + 2) / 5)) + valueToWeights[((decimal + 2) % 5) - 2];

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const snafuValues = input.split('\n').map((num) => num.split(''));

  return convertToSnafu(snafuValues.reduce((acc, num) => (acc + convertToDecimal(num)), 0));
};

const part2 = () => {
  return "Blender started!";
};

run({
  part1: {
    tests: [
      {
        input: `1=-0-2\n12111\n2=0=\n21\n2=01\n111\n20012\n112\n1=-1=\n1-12\n12\n1=\n122`,
        expected: '2=-1=0',
      },
      {
        input: `1\n2\n1=\n1-\n10\n11\n12\n2=\n2-\n20\n1=0\n1-0\n1=11-2\n1-0---0\n1121-1110-1=0`,
        expected: '1121-121=0--2',
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: ``,
        expected: "Blender started!",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
