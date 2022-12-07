import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

/*
Rock     A X 1
Paper    B Y 2
Scissors C Z 3
*/

const scoreMap = {
   'A X' : 4,
   'A Y' : 8,
   'A Z' : 3,
   'B X' : 1,
   'B Y' : 5,
   'B Z' : 9,
   'C X' : 7,
   'C Y' : 2,
   'C Z' : 6,
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const games = input.split('\n');

  const total = games.reduce((acc, game) => {
	return acc + scoreMap[game];
  }, 0);

  return total;
};

/*
Rock     A 1
Paper    B 2
Scissors C 3

X lose
Y draw
Z win

*/

const scoreMap2 = {
	'A A' : 4,
	'A B' : 8,
	'A C' : 3,
	'B A' : 1,
	'B B' : 5,
	'B C' : 9,
	'C A' : 7,
	'C B' : 2,
	'C C' : 6,
 };

 const scoreWinStrategy = {
	'A X' : 'A C',
	'A Y' : 'A A',
	'A Z' : 'A B',
	'B X' : 'B A',
	'B Y' : 'B B',
	'B Z' : 'B C',
	'C X' : 'C B',
	'C Y' : 'C C',
	'C Z' : 'C A',
 };


const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const games = input.split('\n');

  const total = games.reduce((acc, game) => {
	return acc + scoreMap2[scoreWinStrategy[game]];
  }, 0);

  return total;
};

run({
  part1: {
    tests: [
       {
         input: `A Y\nB X\nC Z`,
         expected: 15,
       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
		  input: `A Y\nB X\nC Z`,
		  expected: 12,
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
