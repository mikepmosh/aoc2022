import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

const emptyValue = 0; // '.';
const busyValue = 1; // '#';

const shapes = [
  // ####
  {
    nl: 1,
    nc: 4,
    colission: (position, target) => (
      (target.l - position.l) == 0 && (target.c >= position.c) && (target.c - position.c) < 4
    ),
    draw: ({ l, c }, playground, value = busyValue) => {
      playground[l][c] = value;
      playground[l][c+1] = value;
      playground[l][c+2] = value;
      playground[l][c+3] = value;
    }
  },
  // .#.
  // ###
  // .#.
  {
    nl: 3,
    nc: 3,
    colission: (position, target) => (
      ((target.l - position.l) == 1 && (target.c >= position.c) && (target.c - position.c) < 3) ||
        ((target.c - position.c) == 1 && (target.l >= position.l) && (target.l - position.l) < 3)
    ),
    draw: ({ l, c }, playground, value = busyValue) => {
      playground[l][c+1] = value;
      playground[l+1][c] = value;
      playground[l+1][c+1] = value;
      playground[l+1][c+2] = value;
      playground[l+2][c+1] = value;
    }
  },
  // ..#
  // ..#
  // ###
  {
    nl: 3,
    nc: 3,
    colission: (position, target) => (
      ((target.l - position.l) == 0 && (target.c >= position.c) && (target.c - position.c) < 3) ||
        ((target.c - position.c) == 2 && (target.l >= position.l) && (target.l - position.l) < 3)
    ),
    draw: ({ l, c }, playground, value = busyValue) => {
      playground[l][c] = value;
      playground[l][c+1] = value;
      playground[l][c+2] = value;
      playground[l+1][c+2] = value;
      playground[l+2][c+2] = value;
    }
  },
  // #
  // #
  // #
  // #
  {
    nl: 4,
    nc: 1,
    colission: (position, target) => (
      (target.l >= position.l) && (target.l - position.l) < 4 && (target.c - position.c) == 0
    ),
    draw: ({ l, c }, playground, value = busyValue) => {
      playground[l][c] = value;
      playground[l+1][c] = value;
      playground[l+2][c] = value;
      playground[l+3][c] = value;
    }
  },
  // ##
  // ##
  {
    nl: 2,
    nc: 2,
    colission: (position, target) => (
      (target.l >= position.l) && (target.l - position.l) < 2 && (target.c >= position.c) && (target.c - position.c) < 2
    ),
    draw: ({ l, c }, playground, value = busyValue) => {
      playground[l][c] = value;
      playground[l][c+1] = value;
      playground[l+1][c] = value;
      playground[l+1][c+1] = value;
    }
  }
];

// Playground

const getPattern = (diffHistory, startIndex = 0) => {
  const len = diffHistory.length;
  if (len < 50) {
    return null;
  }

  if (len % 2 == 0)
  {
    const side1 = diffHistory.slice(0, len/2).join('');
    const side2 = diffHistory.slice(len/2).join('');
    if (side1 == side2) {
      return { startIndex, pattern: diffHistory.slice(0, len/2) };
    }

    return getPattern(diffHistory.slice(2), startIndex+2);
  }

  return getPattern(diffHistory.slice(1), startIndex+1);
};

const getHighestLine = (jetPattern, nbRocks) => {
  const sizeBuffer = 10000;
  const playground = utils.createMatrix(sizeBuffer, 7, emptyValue);
  const rocksHistory = { highestLineDiff: [], nbJets: [] };
  let patternFound = false;

  let accLineIncrement = 0;
  let highestLine = -1;
  let jetIndex = 0;
  for (let rockIndex = 0; rockIndex < nbRocks; rockIndex++) {

    const shape = shapes[rockIndex%5];
    const rockPosition = { l: highestLine +4, c: 2 };

    let keepMoving = true;
    while (keepMoving) {
      const jetModifier = (jetPattern[jetIndex % jetPattern.length] == '>')? 1 : -1;
      jetIndex++;

      let foundSideCollision = jetModifier == 1? (rockPosition.c + shape.nc == 7) : (rockPosition.c == 0);
      rockPosition.c += jetModifier;
      let indexLine = 0, indexColumn = 0;
      while (!foundSideCollision && indexLine < shape.nl)
      {
        indexColumn = 0;
        while (!foundSideCollision && indexColumn < shape.nc)
        {
          const pointToCheck = { l: rockPosition.l +indexLine, c: rockPosition.c +indexColumn};
          if (playground[pointToCheck.l][pointToCheck.c] != emptyValue) {
            foundSideCollision = shape.colission(rockPosition, pointToCheck);
          }
          indexColumn++;
        }
        indexLine++;
      }

      if (foundSideCollision) {
        rockPosition.c -= jetModifier;
      }

      let foundDownCollission = rockPosition.l == 0;
      rockPosition.l--;
      indexLine = 0;
      while (!foundDownCollission && indexLine < shape.nl)
      {
        indexColumn = 0;
        while (!foundDownCollission && indexColumn < shape.nc)
        {
          const pointToCheck = { l: rockPosition.l +indexLine, c: rockPosition.c +indexColumn};
          if (playground[pointToCheck.l][pointToCheck.c] != emptyValue) {
            foundDownCollission = shape.colission(rockPosition, pointToCheck);
          }
          indexColumn++;
        }
        indexLine++;
      }

      if (foundDownCollission) {
        rockPosition.l++;
        keepMoving = false;
      }
    }

    const rockHighestLine = rockPosition.l + shape.nl -1;
    if (!patternFound) {
      rocksHistory.highestLineDiff.push((rockHighestLine > highestLine)? Math.abs(rockHighestLine - highestLine) : 0);
      rocksHistory.nbJets.push(jetIndex);
      const patternRes = getPattern(rocksHistory.highestLineDiff);
      if (patternRes) {
        patternFound = true;

        const { startIndex, pattern } = patternRes;
        const patternSize = pattern.length;
        const totalDiff = pattern.reduce((acc, elem) => (acc + elem), 0);
        const nbJetsDiff = rocksHistory.nbJets[startIndex + patternSize] - rocksHistory.nbJets[startIndex];

        const remaingCycles = Math.floor((nbRocks - rockIndex) / patternSize);

        rockIndex += remaingCycles * patternSize;
        jetIndex += remaingCycles * nbJetsDiff;
        accLineIncrement += remaingCycles * totalDiff;
      }
    }

    // console.log("ROCK STOP", rockIndex);

    highestLine = Math.max(highestLine, rockHighestLine);
    shape.draw(rockPosition, playground);

    // utils.displayMatrix(playground);
  }

  return accLineIncrement + highestLine +1;
};



const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const jetPattern = input.split('');
  const nbRocks = 2022;

  return getHighestLine(jetPattern, nbRocks);
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const jetPattern = input.split('');
  const nbRocks =  1000000000000;

  return getHighestLine(jetPattern, nbRocks);
};

run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
