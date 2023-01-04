import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

const blizzardMoves = (nbColumns, nbLines) =>
{
  const loopX = (x) => (1 + (x + nbColumns - 3) % (nbColumns - 2));
  const loopY = (y) => (1 + (y + nbLines - 3) % (nbLines - 2));
  return {
    '>': ({ x, y }) => ({ x: loopX(x + 1), y }),
    'v': ({ x, y }) => ({ x, y: loopY(y + 1) }),
    '<': ({ x, y }) => ({ x: loopX(x - 1), y }),
    '^': ({ x, y }) => ({ x, y: loopY(y - 1) })
  };
};

const buildAllBlizzards = (inputLines) =>
{
  const nbColumns = inputLines[0].length, nbLines = inputLines.length;
  const moves = blizzardMoves(nbColumns, nbLines);
  let allBlizzards = [];

  let currentBlizzards = inputLines.reduce((accLines, line, indexLine) =>
    line.split('').reduce((acc, elem, indexColumn) => {
      if (!'.#'.includes(elem)) {
        acc[elem].push({ x: indexColumn, y: indexLine });
      }
      return acc;
    }, accLines), { '>': [], 'v': [], '<': [], '^': [] });

  for (let minute = 0; minute <= nbColumns * nbLines; minute++)
  {
    allBlizzards.push(utils.createMatrix(nbColumns, nbLines, false));
    for (const [direction, positions] of Object.entries(currentBlizzards)) {
      for (const { x, y } of positions)
      {
        allBlizzards[minute][x][y] = true;
      }
      currentBlizzards[direction] = positions.map(moves[direction]);
    }
  }

  return allBlizzards;
};

const nextMoves = (position) => ([
  ({ x, y }) => ({ x: x + 1, y }),
  ({ x, y }) => ({ x, y: y + 1 }),
  ({ x, y }) => ({ x: x - 1, y }),
  ({ x, y }) => ({ x, y: y - 1 })
].map((move) => move(position)));

const walkBlizzards = (nbColumns, nbLines, unavailablePositions) => ({ x, y }, endPosition, initialMinute = 0) =>
{
  const candidates = [[{ x, y }]];
  unavailablePositions[initialMinute % (nbColumns * nbLines)][x][y] = true;

  let found = -1;
  let minute = 0;
  while (found == -1 && minute != -1)
  {
    const position = candidates[minute].shift();
    const candidatePositions = nextMoves(position);
    if (candidatePositions.some((pos) => (pos.x == endPosition.x && pos.y == endPosition.y))) {
      found = minute + 1;
    }
    else {
      while (candidates.length <= minute +1) {
        candidates.push([]);
      }
      for (const {x, y} of [...candidatePositions.filter(({x,y}) => (0 < x && x < nbColumns -1 && 0 < y && y < nbLines -1)), position])
      {
        if (!unavailablePositions[(minute + 1 + initialMinute) % (nbColumns * nbLines)][x][y]) {
          candidates[minute + 1].push({x, y});
          unavailablePositions[(minute + 1 + initialMinute) % (nbColumns * nbLines)][x][y] = true;
        }
      }
    }

    minute = candidates.findIndex(elem => elem.length > 0);
  }

  return found + initialMinute;
};

const part1 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const startPosition = { x: 1, y: 0 };
  const endPosition = { x: inputLines[0].length - 2, y: inputLines.length - 1 };
  const blizzards = buildAllBlizzards(inputLines);

  return walkBlizzards(inputLines[0].length, inputLines.length, blizzards)(startPosition, endPosition);
};

const part2 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const startPosition = { x: 1, y: 0 };
  const endPosition = { x: inputLines[0].length - 2, y: inputLines.length - 1 };
  const blizzards = buildAllBlizzards(inputLines);

  const walk = walkBlizzards(inputLines[0].length, inputLines.length, blizzards);
  return walk(startPosition, endPosition, walk(endPosition, startPosition, walk(startPosition, endPosition)));
};

run({
  part1: {
    tests: [
      {
        input: `#.######\n#>>.<^<#\n#.<..<<#\n#>v.><>#\n#<^v^^>#\n######.#`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.######\n#>>.<^<#\n#.<..<<#\n#>v.><>#\n#<^v^^>#\n######.#`,
        expected: 54,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
