import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const caloriesArray = input.split('\n');

  const calByElf = caloriesArray.reduce((acc, val) => {
	if (val) {
		acc[acc.length - 1] += parseInt(val);
	}
	else {
		acc.push(0);
	}
	return acc;
  }, [0]);

  const res = Math.max(...calByElf);

  return res;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);


  const caloriesArray = input.split('\n');

  const calByElf = caloriesArray.reduce((acc, val) => {
	if (val) {
		acc[acc.length - 1] += parseInt(val);
	}
	else {
		acc.push(0);
	}
	return acc;
  }, [0]);

  calByElf.sort((a, b) => (a - b));

  const res = calByElf[calByElf.length - 3] + calByElf[calByElf.length - 2] + calByElf[calByElf.length - 1];

  return res;
};

run({
  part1: {
    tests: [
      {
         input: `1\n\n2\n3\n\n4`,
         expected: 5,
      },
      {
         input: `8\n\n2\n3\n\n4`,
         expected: 8,
      },
      {
         input: `2\n\n2\n1\n\n3\n1`,
         expected: 4,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
		   input: `1\n\n2\n3\n\n4`,
		   expected: 10,
		},
		{
		   input: `1\n\n2\n3\n\n4\n1\n\n2\n3\n\n4`,
		   expected: 15,
		},
		{
		   input: `1\n\n2\n3\n5\n\n4\n1\n4\n1\n\n2\n3\n\n4`,
		   expected: 25,
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
