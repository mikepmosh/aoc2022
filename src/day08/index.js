import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const createMatrixFromInput = (lines) => lines.map(line => line.split('').map(parseFloat));
const createMatrix = (nbLines, nbColumns, val = 1) => new Array(nbLines).fill(null).map(() => new Array(nbColumns).fill(val));

const computeVisibility = (forest, nbLines, nbColumns, visibilityMap) =>
{
    let lineIdx = null, columnIdx = null, maxheight = null;

  for (lineIdx = 0; lineIdx < nbLines; lineIdx++)
  {
    columnIdx = 1;
    maxheight = forest[lineIdx][0];
    visibilityMap[lineIdx][0] += 1;
    while (columnIdx < nbColumns)
    {
      visibilityMap[lineIdx][columnIdx] += (maxheight < forest[lineIdx][columnIdx])? 1 : 0;
      maxheight = Math.max(maxheight, forest[lineIdx][columnIdx]);
      columnIdx++;
    }

    columnIdx = nbColumns - 2;
    maxheight = forest[lineIdx][nbColumns - 1];
    visibilityMap[lineIdx][nbColumns - 1] += 1;
    while (0 < columnIdx)
    {
      visibilityMap[lineIdx][columnIdx] += (maxheight < forest[lineIdx][columnIdx])? 1 : 0;
      maxheight = Math.max(maxheight, forest[lineIdx][columnIdx]);
      columnIdx--;
    }
  }

  for (columnIdx = 0; columnIdx < nbColumns; columnIdx++)
  {
    lineIdx = 1;
    maxheight = forest[0][columnIdx];
    visibilityMap[0][columnIdx] += 1;
    while (lineIdx < nbLines)
    {
      visibilityMap[lineIdx][columnIdx] += (maxheight < forest[lineIdx][columnIdx])? 1 : 0;
      maxheight = Math.max(maxheight, forest[lineIdx][columnIdx]);
      lineIdx++;
    }

    lineIdx = nbLines - 2;
    maxheight = forest[nbLines - 1][columnIdx];
    visibilityMap[nbLines - 1][columnIdx] += 1;
    while (0 < lineIdx)
    {
      visibilityMap[lineIdx][columnIdx] += (maxheight < forest[lineIdx][columnIdx])? 1 : 0;
      maxheight = Math.max(maxheight, forest[lineIdx][columnIdx]);
      lineIdx--;
    }
  }
};

const countInMatrix = (matrix, val) => {
    return matrix.reduce((acc, elem) => acc + elem.reduce((acc, elem) => (val == elem)? acc + 1 : acc, 0), 0);
}

const part1 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const forest = createMatrixFromInput(inputLines);
  const visibilityMap = createMatrix(inputLines.length, inputLines[0].length);

  computeVisibility(forest, inputLines.length, inputLines[0].length, visibilityMap);

  return (inputLines.length * inputLines[0].length) - countInMatrix(visibilityMap, 1);
};

const computeScenicSolution1 = (forest, nbLines, nbColumns, scenicMap) =>
{
  // Just follow the instructions : look up, down, left, and right from each tree
  let lineIdx = null, columnIdx = null, index = null;

  const getVisibilityLeft = () => {
    index = columnIdx - 1;
    while (0 < index) {
        if (forest[lineIdx][columnIdx] <= forest[lineIdx][index]) return (columnIdx - index);
        index--;
    }
    return columnIdx;
  };

  const getVisibilityRight = () => {
    index = columnIdx + 1;
    while (index < nbColumns) {
        if (forest[lineIdx][columnIdx] <= forest[lineIdx][index]) return (index - columnIdx);
        index++;
    }
    return (nbColumns - columnIdx -1);
  };

  const getVisibilityUp = () => {
    index = lineIdx - 1;
    while (0 < index) {
        if (forest[lineIdx][columnIdx] <= forest[index][columnIdx]) return (lineIdx - index);
        index--;
    }
    return lineIdx;
  };

  const getVisibilityDown = () => {
    index = lineIdx + 1;
    while (index < nbLines) {
        if (forest[lineIdx][columnIdx] <= forest[index][columnIdx]) return (index - lineIdx);
        index++;
    }
    return (nbLines - lineIdx -1);
  };

  for (lineIdx = 1; lineIdx < nbLines -1; lineIdx++)
  {
    for (columnIdx = 1; columnIdx < nbColumns -1; columnIdx++)
    {
      scenicMap[lineIdx][columnIdx] *= getVisibilityLeft();
      scenicMap[lineIdx][columnIdx] *= getVisibilityRight();
      scenicMap[lineIdx][columnIdx] *= getVisibilityUp();
      scenicMap[lineIdx][columnIdx] *= getVisibilityDown();
    }
  }
};

const computeScenicSolution2 = (forest, nbLines, nbColumns, scenicMap) =>
{
  // Reduce the number of time a tree is visited
  // When we visit a tree, we keep trace of the trees we could potentially see in next visits
  // so we can come back directly without visiting again the trees that are no more in the view
  let lineIdx = null, columnIdx = null, visited = new Array(10), closestLimit = null, currentHeight = null;

  for (lineIdx = 1; lineIdx < nbLines -1; lineIdx++)
  {
    columnIdx = 0;
    visited.fill(0);
    while (columnIdx < nbColumns)
    {
      currentHeight = forest[lineIdx][columnIdx];
      closestLimit = visited.slice(currentHeight).reduce((acc, item) => Math.max(acc, item), 0);
      scenicMap[lineIdx][columnIdx] *= columnIdx - closestLimit;
      visited[currentHeight] = columnIdx;
      columnIdx++;
    }

    columnIdx = nbColumns - 1;
    visited.fill(nbColumns - 1);
    while (0 < columnIdx)
    {
      currentHeight = forest[lineIdx][columnIdx];
      closestLimit = visited.slice(currentHeight).reduce((acc, item) => Math.min(acc, item), nbColumns - 1);
      scenicMap[lineIdx][columnIdx] *= closestLimit - columnIdx;
      visited[currentHeight] = columnIdx;
      columnIdx--;
    }
  }

  for (columnIdx = 1; columnIdx < nbColumns -1; columnIdx++)
  {
    lineIdx = 0;
    visited.fill(0);
    while (lineIdx < nbLines)
    {
      currentHeight = forest[lineIdx][columnIdx];
      closestLimit = visited.slice(currentHeight).reduce((acc, item) => Math.max(acc, item), 0);
      scenicMap[lineIdx][columnIdx] *= lineIdx - closestLimit;
      visited[currentHeight] = lineIdx;
      lineIdx++;
    }

    lineIdx = nbLines - 1;
    visited.fill(nbLines - 1);
    while (0 < lineIdx)
    {
      currentHeight = forest[lineIdx][columnIdx];
      closestLimit = visited.slice(currentHeight).reduce((acc, item) => Math.min(acc, item), nbLines - 1);
      scenicMap[lineIdx][columnIdx] *= closestLimit - lineIdx;
      visited[currentHeight] = lineIdx;
      lineIdx--;
    }
  }
};

const maxInMatrix = (matrix) => {
    return matrix.reduce((acc, elem) => Math.max(acc, elem.reduce((acc, elem) => Math.max(acc, elem), 0)), 0);
};

const part2 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const forest = createMatrixFromInput(inputLines);
  const scenicMap = createMatrix(inputLines.length, inputLines[0].length);

  //computeScenicSolution1(forest, inputLines.length, inputLines[0].length, scenicMap);
  computeScenicSolution2(forest, inputLines.length, inputLines[0].length, scenicMap);

  return maxInMatrix(scenicMap);
};

run({
  part1: {
    tests: [
      {
        input: `30373\n25512\n65332\n33549\n35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
        {
          input: `30373\n25512\n65332\n33549\n35390`,
          expected: 8,
        },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
