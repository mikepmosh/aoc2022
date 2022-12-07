import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const abcd = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const rucksacks = input.split('\n');

  const total = rucksacks.reduce((acc, rucksack) => {
	const halfSize = Math.floor(rucksack.length / 2)
	const rs1 = rucksack.slice(0, halfSize).split('');
	const rs2 = rucksack.slice(halfSize).split('');

	const commun = rs1.map((item) => { if (rs2.includes(item)) return item; } ).join('');

	return acc + abcd.indexOf(commun[0]) + 1;
  }, 0);

  return total;
};

const part2 = (rawInput) => {
	const input = parseInput(rawInput);

	const rucksacks = input.split('\n');

	let total = 0;
	for (let index = 0; index < rucksacks.length; index=index+3)
	{
	  const rs1 = rucksacks[index].split('');
	  const rs2 = rucksacks[index+1].split('');
	  const rs3 = rucksacks[index+2].split('');

	  const commun = rs1.map((item) => { if (rs2.includes(item) && rs3.includes(item)) return item; } ).join('');

	  total = total + abcd.indexOf(commun[0]) + 1;
	}

	return total;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
