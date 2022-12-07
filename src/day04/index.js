import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const pairs = input.split('\n');

  const total = pairs.reduce((acc, pair) => {
	const zones = pair.split(',');
	const zone1str = zones[0].split('-');
	const zone2str = zones[1].split('-');
	const zone1 = [parseInt(zone1str[0]),parseInt(zone1str[1])];
	const zone2 = [parseInt(zone2str[0]),parseInt(zone2str[1])];

	if ((zone1[0] <= zone2[0] && zone2[1] <= zone1[1]) || (zone2[0] <= zone1[0] && zone1[1] <= zone2[1]))
	{
		return acc + 1;
	}

	return acc;
  }, 0);

  return total;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const pairs = input.split('\n');

  const total = pairs.reduce((acc, pair) => {
	const zones = pair.split(',');
	const zone1str = zones[0].split('-');
	const zone2str = zones[1].split('-');
	const zone1 = [parseInt(zone1str[0]),parseInt(zone1str[1])];
	const zone2 = [parseInt(zone2str[0]),parseInt(zone2str[1])];

	if ((zone1[1] < zone2[0]) || (zone2[1] < zone1[0]))
	{
		return acc;
	}

	return acc + 1;
  }, 0);

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
		  input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
		  expected: 4,
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
