import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

const cleanUpRockPaths = (rockPaths) => { // useful for display
  let  startLine = 0, startColumn = 500;
  let minLine = startLine, maxLine = startLine, minColumn = startColumn, maxColumn = startColumn;

  for (const rockPath of rockPaths) {
    for (const pathEdge of rockPath) {
      minLine = Math.min(minLine, pathEdge[1]);
      maxLine = Math.max(maxLine, pathEdge[1]);
      minColumn = Math.min(minColumn, pathEdge[0]);
      maxColumn = Math.max(maxColumn, pathEdge[0]);
    }
  }

  minLine -= 2;
  maxLine += 2;
  minColumn -= 150;
  maxColumn += 150;

  startLine -= minLine;
  startColumn -= minColumn;
  for (const rockPath of rockPaths) {
    for (const pathEdge of rockPath) {
      pathEdge[1] -= minLine;
      pathEdge[0] -= minColumn;
    }
  }

  return { startLine, startColumn, nbLines : maxLine - minLine +1, nbColum : maxColumn - minColumn +1 };
};

const addRockPathsInMap = (map, rockPaths) => {
  for (const rockPath of rockPaths) {
    let index = 0;
    for (index; index < rockPath.length -1; index++) {
      const startEdge = rockPath[index];
      const endEdge = rockPath[index+1];

      const directionIndex = (endEdge[0] == startEdge[0]) ? 1 : 0;
      const nbStep = Math.abs(endEdge[directionIndex] - startEdge[directionIndex]);
      const direction = (endEdge[directionIndex] - startEdge[directionIndex]) / nbStep;

      if (startEdge[0] == endEdge[0]) {
        for (let counter = 0; counter < nbStep; counter++) {
          map[startEdge[1] + (direction * counter)][startEdge[0]] = '#';
        }
      }
      else {
        for (let counter = 0; counter < nbStep; counter++) {
          map[startEdge[1]][startEdge[0] + (direction * counter)] = '#';
        }
      }
    }
    map[rockPath[index][1]][rockPath[index][0]] = '#';
  }
};

const simulateFallingSand = (map, startLine, startColumn, maxLine) => {
  let keepSimulating = true;
  while (keepSimulating) {
    const sand = { l: startLine, c: startColumn};
    let sandCanFall = true;

    while (sandCanFall) {
      if (sand.l == maxLine) {
        sandCanFall = false;
        keepSimulating = false;
      }
      else if (map[sand.l + 1][sand.c] == '.') {
        sand.l++;
      }
      else if (map[sand.l + 1][sand.c - 1] == '.') {
        sand.l++;
        sand.c--;
      }
      else if (map[sand.l + 1][sand.c + 1] == '.') {
        sand.l++;
        sand.c++;
      }
      else {
        sandCanFall = false;
      }
    }

    map[sand.l][sand.c] = 'o';

    if (sand.l == startLine && sand.c == startColumn) {
      keepSimulating = false;
    }
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const rockPaths = inputLines.map((rockPath) => rockPath.split(' -> ').map((pathEdge) => pathEdge.split(',')));

  const { startLine, startColumn, nbLines, nbColum } = cleanUpRockPaths(rockPaths);

  const map = utils.createMatrix(nbLines, nbColum, '.');
  map[startLine][startColumn] = '+';

  addRockPathsInMap(map, rockPaths);
  simulateFallingSand(map, startLine, startColumn, nbLines-1);

  return utils.countInMatrix(map, 'o') -1;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const rockPaths = inputLines.map((rockPath) => rockPath.split(' -> ').map((pathEdge) => pathEdge.split(',')));

  const { startLine, startColumn, nbLines, nbColum } = cleanUpRockPaths(rockPaths);
  rockPaths.push([[0,nbLines-1],[nbColum-1,nbLines-1]]);

  const map = utils.createMatrix(nbLines, nbColum, '.');
  map[startLine][startColumn] = '+';

  addRockPathsInMap(map, rockPaths);
  simulateFallingSand(map, startLine, startColumn, nbLines-1);

  return utils.countInMatrix(map, 'o');
};

run({
  part1: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
