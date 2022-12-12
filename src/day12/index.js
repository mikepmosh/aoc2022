import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
import utils from '../utils/index.js';

const travelMap = (map, visited, currentLine, currentColumn, acceptStepFnc, continueFnc = null) => {
  if (!continueFnc || continueFnc(currentLine, currentColumn)) {
    const currentValue = map[currentLine][currentColumn];
    const currentDistance = visited[currentLine][currentColumn];
    const newDistance = currentDistance +1;

    const checkNeighbor = (lineIdx, columnIdx) => {
      if (acceptStepFnc(map[lineIdx][columnIdx], currentValue)) {
        if (newDistance < visited[lineIdx][columnIdx]) {
          visited[lineIdx][columnIdx] = newDistance;
          travelMap(map, visited, lineIdx, columnIdx, acceptStepFnc, continueFnc);
        }
      }
    };

    if (0 < currentLine) {
      checkNeighbor(currentLine-1, currentColumn);
    }
    if (currentLine < map.length -1) {
      checkNeighbor(currentLine+1, currentColumn);
    }
    if (0 < currentColumn) {
      checkNeighbor(currentLine, currentColumn-1);
    }
    if (currentColumn < map[0].length -1) {
      checkNeighbor(currentLine, currentColumn+1);
    }
  }
};

const aAsInteger = 'a'.charCodeAt(0);

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const nbLines = inputLines.length;
  const nbColumns = inputLines[0].length;
  const map = utils.createMatrixFromInput(inputLines, (x) => x.charCodeAt(0) - aAsInteger);

  const startLine = (nbLines == 5)? 0 : 20;
  const startColumn = (nbLines == 5)? 0: 0;
  const endLine = (nbLines == 5)? 2: 20;
  const endColumn = (nbLines == 5)? 5: 77;

  map[startLine][startColumn] = -1;
  map[endLine][endColumn] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

  const visited = utils.createMatrix(nbLines, nbColumns, 99999999);

  visited[startLine][startColumn] = 0;

  const acceptStepFnc = (nextElevation, currentElevation) => ((nextElevation - currentElevation) <= 1);
  travelMap(map, visited, startLine, startColumn, acceptStepFnc);

  return visited[endLine][endColumn];
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const nbLines = inputLines.length;
  const nbColumns = inputLines[0].length;
  const map = utils.createMatrixFromInput(inputLines, (x) => x.charCodeAt(0) - aAsInteger);

  const startLine = (nbLines == 5)? 0 : 20;
  const startColumn = (nbLines == 5)? 0: 0;
  const endLine = (nbLines == 5)? 2: 20;
  const endColumn = (nbLines == 5)? 5: 77;

  map[startLine][startColumn] = 0;
  map[endLine][endColumn] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

  const visited = utils.createMatrix(nbLines, nbColumns, 99999999);

  visited[endLine][endColumn] = 0;

  let stepsToBestStart = 99999999;
  const acceptStepFnc = (nextElevation, currentElevation) => ((currentElevation - nextElevation) <= 1);

  const continueFnc = (currentLine, currentColumn) => {
    if (stepsToBestStart < visited[currentLine][currentColumn]) {
      return false;
    }
    if (map[currentLine][currentColumn] == 0) {
      stepsToBestStart = Math.min(stepsToBestStart, visited[currentLine][currentColumn]);
      return false;
    }
    return true;
  };

  travelMap(map, visited, endLine, endColumn, acceptStepFnc, continueFnc);

  return stepsToBestStart;
};

run({
  part1: {
    tests: [
      {
        input: `Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
