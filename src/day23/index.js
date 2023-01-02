import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

const buildWorkingPlayground = playground => [playground[0].map(() => "."), ...playground, playground[0].map(() => ".")].map(line => [".", ...line, "."]);

const cleanWorkingPlayground = (playground) => {
  let minColumn = 9999, maxColumn = 0, minLine = 9999, maxLine = 0;
  for (let indexLine = 0; indexLine < playground.length; indexLine++) {
    const firstIndex = playground[indexLine].findIndex(elem => elem === "#");
    if (firstIndex != -1) {
      minColumn = Math.min(minColumn, firstIndex);
    }
    const lastIndex = playground[indexLine].findLastIndex(elem => elem === "#");
    if (lastIndex != -1) {
      maxColumn = Math.max(maxColumn, lastIndex);
    }
    if (firstIndex != -1 || lastIndex != -1) {
      if (minLine == 9999) {
        minLine = indexLine;
      }
      maxLine = indexLine;
    }
  }

  return playground.slice(minLine, maxLine + 1).map(row => row.slice(minColumn, maxColumn + 1));
};

const applyTransf = (elf) => (transf) => ([elf[0] + transf[0], elf[1] + transf[1]]);

const getNeighbors = (elf) => [[-1,-1],[ 0,-1],[ 1,-1],[-1, 0],[ 1, 0],[-1, 1],[ 0, 1],[ 1, 1]].map(applyTransf(elf));

const getCanditateElves = playground => {
  const elves = [];
  for (let indexLine = 0; indexLine < playground.length; indexLine++) {
    for (let indexColumn = 0; indexColumn < playground[indexLine].length; indexColumn++) {
      if (playground[indexLine][indexColumn] == '#') {
        elves.push([indexColumn, indexLine]);
      }
    }
  }

  return elves.filter(elf => getNeighbors(elf).some(([x, y]) => playground[y][x] === "#"));
};

const possibleMoves = [
  [
    (elf) => [[-1,-1],[0,-1],[1,-1]].map(applyTransf(elf)),
    (elf) => applyTransf(elf)([0,-1])
  ],
  [
    (elf) => [[-1,1],[0,1],[1,1]].map(applyTransf(elf)),
    (elf) => applyTransf(elf)([0,1])
  ],
  [
    (elf) => [[-1,-1],[-1,0],[-1,1]].map(applyTransf(elf)),
    (elf) => applyTransf(elf)([-1,0])
  ],
  [
    (elf) => [[1,-1],[1,0],[1,1]].map(applyTransf(elf)),
    (elf) => applyTransf(elf)([1,0])
  ]
];

const getElveMoves = (playground, elves, round) => {
  const moveCandidates = [];

  for (const elf of elves) {
    for (const counter of [0,1,2,3]) {
      const [neighbors, move] = possibleMoves[(round + counter) % 4];
      if (neighbors(elf).every(([x, y]) => playground[y][x] === ".")) {
        moveCandidates.push({ start: elf, end: move(elf) });
        break;
      }
    }
  }

  return moveCandidates.filter(({ end }, index, arr) => arr
    .every((elem, indexNext) => (indexNext == index || ((elem.end[0] != end[0]) || (elem.end[1] != end[1])))));
};

const perfomElveMoves = (playground, moves) => {
  for (const { start, end } of moves) {
    playground[start[1]][start[0]] = ".";
    playground[end[1]][end[0]] = "#";
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  let playground = utils.createMatrixFromInput(inputLines, (x) => (x));

  let round = 0;
  while (round < 10) {
    const workingMap = buildWorkingPlayground(playground);
    const elves = getCanditateElves(workingMap);
    const moves = getElveMoves(workingMap, elves, round++);
    if (moves.length > 0) {
      perfomElveMoves(workingMap, moves);
    }

    playground = cleanWorkingPlayground(workingMap);
  }

  return utils.countInMatrix(playground, ".");
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  let playground = utils.createMatrixFromInput(inputLines, (x) => (x));

  let round = 0;
  let elvesCanMove = true;
  while (elvesCanMove) {
    const workingMap = buildWorkingPlayground(playground);
    const elves = getCanditateElves(workingMap);
    const moves = getElveMoves(workingMap, elves, round++);
    if (moves.length > 0) {
      perfomElveMoves(workingMap, moves);
    }
    else {
      elvesCanMove = false;
    }

    playground = cleanWorkingPlayground(workingMap);
  }

  return round;
};

run({
  part1: {
    tests: [
      {
        input: `....#..\n..###.#\n#...#.#\n.#...##\n#.###..\n##.#.##\n.#..#..`,
        expected: 110,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `....#..\n..###.#\n#...#.#\n.#...##\n#.###..\n##.#.##\n.#..#..`,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
