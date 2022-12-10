import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

// const matrixLineSize = 21;
// const matrixColumnSize = 26;
// const startLine = 15;
// const startColumn = 11;
// const performTests = true;
const matrixLineSize = 500;
const matrixColumnSize = 500;
const startLine = matrixLineSize/2;
const startColumn = matrixColumnSize/2;
const performTests = false;

const displayState = (rope) => {
  for (let lineIdx = 0; lineIdx <matrixLineSize; lineIdx++) {
    let text = "";
    for (let columnIdx = 0; columnIdx <matrixColumnSize; columnIdx++) {
      const index = rope.findIndex((elem) => (lineIdx == elem.l && columnIdx == elem.c));
      if (index !== -1) {
        text += (index === 0)? 'H' : `${index}`;
      }
      else if (lineIdx == startLine && columnIdx == startColumn) {
        text += "S";
      }
      else {
        text += ".";
      }
    }
    console.log(text);
  }
};

const updateKnotPosition = (rope, idx) => {
  const lineDistance = Math.abs(rope[idx-1].l - rope[idx].l);
  const columnDistance = Math.abs(rope[idx-1].c - rope[idx].c);

  if (lineDistance > 1 && columnDistance > 1) {
    rope[idx].l = (rope[idx-1].l + rope[idx].l) / 2;
    rope[idx].c = (rope[idx-1].c + rope[idx].c) / 2;
    return true;
  }

  if (lineDistance > 1) {
    rope[idx].l = (rope[idx-1].l + rope[idx].l) / 2;
    rope[idx].c = rope[idx-1].c;
    return true;
  }

  if (columnDistance > 1) {
    rope[idx].c = (rope[idx-1].c + rope[idx].c) / 2;
    rope[idx].l = rope[idx-1].l;
    return true;
  }

  return false;
};

const playWithRope = (inputLines, playground, rope) => {
  const moveHead = {
    U: () => rope[0].l--,
    D: () => rope[0].l++,
    R: () => rope[0].c++,
    L: () => rope[0].c--,
  };

  for(const line of inputLines) {
    const [action, repeat] = line.split(' ');
    for (let counter=0; counter < parseInt(repeat); counter++){
      moveHead[action](0);
      for (let idx=1; idx < rope.length; idx++){
        if (!updateKnotPosition(rope, idx)) break;
      }
      playground[rope[rope.length-1].l][rope[rope.length-1].c] = 1; // flag visited point
    }
    //displayState(rope);
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const playground = utils.createMatrix(matrixLineSize, matrixColumnSize);

  playground[startLine][startColumn] = 1; // flag starting point
  const rope = [{ l: startLine, c: startColumn }, { l: startLine, c: startColumn }];

  playWithRope(inputLines, playground, rope);

  return utils.countInMatrix(playground, 1);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const playground = utils.createMatrix(matrixLineSize, matrixColumnSize);

  playground[startLine][startColumn] = 1; // flag starting point
  const rope = [
    { l: startLine, c: startColumn }, { l: startLine, c: startColumn },
    { l: startLine, c: startColumn }, { l: startLine, c: startColumn },
    { l: startLine, c: startColumn }, { l: startLine, c: startColumn },
    { l: startLine, c: startColumn }, { l: startLine, c: startColumn },
    { l: startLine, c: startColumn }, { l: startLine, c: startColumn }
  ];

  playWithRope(inputLines, playground, rope);

  return utils.countInMatrix(playground, 1);
};

run({
  part1: {
    tests: [
      {
        input: `R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: performTests,
});
