import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const includesChar = (str, char, idx1, idx2) =>
{
	for (let index = idx1; index <= idx2; index++)
	{
		if (char == str[index]) {
			return index;
		}
	}
	return -1;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let found = false;
  let currentIndex = 0;

  while (!found && currentIndex < (input.length - 3) )
  {
	found = true;
	for (let index = currentIndex; index < currentIndex + 3; index++)
	{
		const pos = includesChar(input, input[index], index + 1, currentIndex + 3);
		if (pos != -1)
		{
			found = false;
			break;
		}
	}

	if (!found) {
		currentIndex = currentIndex + 1;
	}
  }

  return currentIndex + 4;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let found = false;
  let currentIndex = 0;

  while (!found && currentIndex < (input.length - 13) )
  {
	found = true;
	for (let index = currentIndex; index < currentIndex + 13; index++)
	{
		const pos = includesChar(input, input[index], index + 1, currentIndex + 13);
		if (pos != -1)
		{
			found = false;
			break;
		}
	}

	if (!found) {
		currentIndex = currentIndex + 1;
	}
  }

  return currentIndex + 14;
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
		  input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
		  expected: 19,
		},
		{
		  input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
		  expected: 23,
		},
		{
		  input: `nppdvjthqldpwncqszvftbrmjlhg`,
		  expected: 23,
		},
		{
		  input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
		  expected: 29,
		},
		{
		  input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
		  expected: 26,
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
