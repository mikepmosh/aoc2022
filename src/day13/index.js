import run from "aocrunner";

const getPairsFromInput = (rawInput) => {
  const pairsStrList = rawInput.split('\n\n');

  const pairs = [];
  for (const elem of pairsStrList) {
    const pairStr = elem.split('\n');
    pairs.push({ left: JSON.parse(pairStr[0]), right: JSON.parse(pairStr[1]) });
  }
  return pairs;
};

const compare = (left, right) => {
  const leftIsArray = Array.isArray(left);
  const rightIsArray = Array.isArray(right);

  if (!leftIsArray && !rightIsArray) {
    return left - right;
  }

  if (leftIsArray) {
    if (rightIsArray) {
      let index = 0, res = 0;
      while (res == 0 && index < left.length && index < right.length) {
        res = compare(left[index], right[index]);
        index++;
      }

      if (res == 0) {
        return left.length - right.length;
      }

      return res;
    }

    return compare(left, [right]);
  }

  // if (rightIsArray && !leftIsArray)
  return compare([left], right);
};

const part1 = (rawInput) => {
  const pairs = getPairsFromInput(rawInput);

  let sumCorrect = 0;
  for (let index = 0; index < pairs.length; index++ ) {
    const { left, right } = pairs[index];
    if (1 > compare(left, right)) {
      sumCorrect += index +1;
    }
  }

  return sumCorrect;
};

const part2 = (rawInput) => {
  const candidates = rawInput.replace(/(\n\n)/gm, "\n").split('\n').map(JSON.parse);
  candidates.push([[2]]);
  candidates.push([[6]]);
  candidates.sort(compare);

  const firstIndex = candidates.findIndex((elem) => (Array.isArray(elem) && Array.isArray(elem[0]) && elem[0][0] === 2));
  const secondIndex =  candidates.findIndex((elem) => (Array.isArray(elem) && Array.isArray(elem[0]) && elem[0][0] === 6));

  return (firstIndex+1) * (secondIndex+1);
};

run({
  part1: {
    tests: [
      {
        input: `[1,1,3,1,1]\n[1,1,5,1,1]\n\n[[1],[2,3,4]]\n[[1],4]\n\n[9]\n[[8,7,6]]\n\n[[4,4],4,4]\n[[4,4],4,4,4]\n\n[7,7,7,7]\n[7,7,7]\n\n[]\n[3]\n\n[[[]]]\n[[]]\n\n[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `[1,1,3,1,1]\n[1,1,5,1,1]\n\n[[1],[2,3,4]]\n[[1],4]\n\n[9]\n[[8,7,6]]\n\n[[4,4],4,4]\n[[4,4],4,4,4]\n\n[7,7,7,7]\n[7,7,7]\n\n[]\n[3]\n\n[[[]]]\n[[]]\n\n[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
