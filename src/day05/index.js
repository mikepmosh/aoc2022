import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const buildStacks = (inputLines) => {
	let separatorLine = 0;
	while (inputLines[separatorLine]) {
		inputLines[separatorLine] = inputLines[separatorLine].replace(/\s\s\s\s/g, " [!]");
		separatorLine = separatorLine + 1;
	}

	const stacks = {};
	for (let lineIdx = separatorLine - 2; lineIdx >= 0; lineIdx = lineIdx - 1)
	{
		const crates = inputLines[lineIdx].split(' ');
		for (let crateIdx = 0; crateIdx < crates.length; crateIdx = crateIdx + 1)
		{
			const key = `${crateIdx+1}`;
			if (!stacks[key])
			{
				stacks[key] = [];
			}
			if (crates[crateIdx][1] !== '!') { stacks[key].push(crates[crateIdx][1]); }
		}
	}

	return { stacks, startLine: separatorLine + 1 };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const { stacks, startLine } = buildStacks(inputLines);

  for (let lineIdx = startLine; lineIdx < inputLines.length; lineIdx = lineIdx + 1)
  {
	const actions = inputLines[lineIdx].split(' ');

	for (let repeatCount = 0; repeatCount < parseInt(actions[1]); repeatCount = repeatCount + 1)
	{
		stacks[actions[5]].push(stacks[actions[3]].pop());
	}
  }

  const result = [];
  for (const key of Object.keys(stacks))
  {
	result.push(stacks[key].pop());
  }

  return result.join('');
};

const part2 = (rawInput) => {
	const input = parseInput(rawInput);
	const inputLines = input.split('\n');

	const { stacks, startLine } = buildStacks(inputLines);

	for (let lineIdx = startLine; lineIdx < inputLines.length; lineIdx = lineIdx + 1)
	{
	  const actions = inputLines[lineIdx].split(' ');

	  const intermediateStack = [];
	  for (let repeatCount = 0; repeatCount < parseInt(actions[1]); repeatCount = repeatCount + 1)
	  {
		intermediateStack.push(stacks[actions[3]].pop());
	  }
	  for (let repeatCount = 0; repeatCount < parseInt(actions[1]); repeatCount = repeatCount + 1)
	  {
		  stacks[actions[5]].push(intermediateStack.pop());
	  }
	}

	const result = [];
	for (const key of Object.keys(stacks))
	{
	  result.push(stacks[key].pop());
	}

	return result.join('');
};

run({
  part1: {
    tests: [
      {
        input: `[!] [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
		  input: `[!] [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2`,
		  expected: "MCD",
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
