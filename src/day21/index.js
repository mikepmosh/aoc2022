import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const simplifyEquation = (monkeys, monkey) =>
{
  const simplifiedEquation = monkeys[monkey].split(' ')
    .map(elem => (monkeys[elem]) ? simplifyEquation(monkeys, elem) : elem)
    .join(' ');

  if (simplifiedEquation.includes('X')) {
    return `(${simplifiedEquation})`;
  }

  return eval(simplifiedEquation);
};

const part1 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const monkeys = inputLines.reduce((acc, line) =>  {
    const [monkey, equation] = line.split(': ');
    acc[monkey] = equation;
    return acc;
  }, {});

  return eval(simplifyEquation(monkeys, 'root'));
};

const part2 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const monkeys = inputLines.reduce((acc, line) =>  {
    const [monkey, equation] = line.split(': ');
    acc[monkey] = equation;
    return acc;
  }, {});

  monkeys['humn'] = 'X';
  const [leftMonkey, , rightMonkey] = monkeys['root'].split(' ');
  const leftEquation = simplifyEquation(monkeys, leftMonkey);
  const rightEquation = simplifyEquation(monkeys, rightMonkey);
  const equation = leftEquation.includes('X') ? leftEquation : rightEquation;
  const expectedResult = leftEquation.includes('X') ? rightEquation : leftEquation;

  // Simplexe algorithm to search the value of X
  const getDistance = (value) => Math.abs(expectedResult - eval(equation.replace('X', value)));
  const solutions = [0, 2 * expectedResult].map(elem => ({value: elem, distance: getDistance(elem)}));

  while (solutions.every(elem => elem.distance > 0)) {
    const indexClose = (solutions[0].distance < solutions[1].distance)? 0 : 1;
    const indexFar = (indexClose)? 0 : 1;

    const candidates = [
      Math.floor((solutions[indexClose].value + solutions[indexFar].value) / 2),
      solutions[indexClose].value + Math.ceil((solutions[indexClose].value - solutions[indexFar].value) / 2),
      solutions[indexClose].value + Math.floor((solutions[indexClose].value - solutions[indexFar].value))
    ];
    const distances = candidates.map(getDistance);

    const closest = Math.min(...distances, solutions[indexFar].distance);
    const indexCadidate = distances.indexOf(closest);
    if (-1 == indexCadidate) {
      const newValue =  Math.floor((3 * solutions[indexClose].value + solutions[indexFar].value) / 4);
      solutions[indexFar] = { value : newValue, distance : getDistance(newValue)};
    }
    else {
      solutions[indexFar] = { value : candidates[indexCadidate], distance : getDistance(candidates[indexCadidate])};
    }
  }

  return solutions.find(elem => elem.distance == 0).value;
};

run({
  part1: {
    tests: [
      {
        input: `root: pppw + sjmn\ndbpl: 5\ncczh: sllz + lgvd\nzczc: 2\nptdq: humn - dvpt\ndvpt: 3\nlfqf: 4\nhumn: 5\nljgn: 2\nsjmn: drzm * dbpl\nsllz: 4\npppw: cczh / lfqf\nlgvd: ljgn * ptdq\ndrzm: hmdt - zczc\nhmdt: 32`,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `root: pppw + sjmn\ndbpl: 5\ncczh: sllz + lgvd\nzczc: 2\nptdq: humn - dvpt\ndvpt: 3\nlfqf: 4\nhumn: 5\nljgn: 2\nsjmn: drzm * dbpl\nsllz: 4\npppw: cczh / lfqf\nlgvd: ljgn * ptdq\ndrzm: hmdt - zczc\nhmdt: 32`,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
