import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const getMapAndPath = input => {
  const inputParts = input.split("\n\n");

  const map = inputParts[0].split("\n").map(line => line.split(""));
  const path = inputParts[1].split("").reduce((acc, elem) => {
    if ("RL".includes(elem)) {
      acc.push({ turnDir: elem == "R" ? 1 : -1, steps: 0 });
    }
    else {
      acc[acc.length-1].steps = 10 * acc[acc.length-1].steps + parseFloat(elem);
    }
    return acc;
  }, [{ turnDir : 0, steps: 0 }]);

  return [ map, path ];
};

const moveNext = {
  '0' : ([x,y]) => ([x+1,y]),
  '1' : ([x,y]) => ([x,y+1]),
  '2' : ([x,y]) => ([x-1,y]),
  '3' : ([x,y]) => ([x,y-1])
};

const connectionsPart1 = (maxX, maxY) => ({
  '0' : [
      [() => (true), ([x,y]) => [(x +1)%maxX, y], 0]
    ],
  '1' : [
      [() => (true), ([x,y]) => [x, (y +1)%maxY], 1]
    ],
  '2' : [
      [() => (true), ([x,y]) => [(x -1+maxX)%maxX, y], 2]
    ],
  '3' : [
      [() => (true), ([x,y]) => [x, (y -1+maxY)%maxY], 3]
    ]
});

const connectionsPart2Test ={
  '0' : [
      [([,y]) => (y < 4), ([,y]) => [15, 11 - y], 2],
      [([,y]) => (y < 8), ([,y]) => [19 - y,   8], 1],
      [([,y]) => (y < 12), ([,y]) => [11, 11 - y], 2]
    ],
  '1' : [
      [([x,]) => (x < 4), ([x,]) => [11 - x,   11], 3],
      [([x,]) => (x < 8), ([x,]) => [8,  15 - x], 0],
      [([x,]) => (x < 12), ([x,]) => [11 - x,   7], 3],
      [([x,]) => (x < 16), ([,y]) => [0,   19 - y], 0]
    ],
  '2' : [
      [([,y]) => (y < 4), ([,y]) => [4 + y,   4], 1],
      [([,y]) => (y < 8), ([,y]) => [19 - y,  11], 3],
      [([,y]) => (y < 12), ([,y]) => [15 - y,  7], 3]
    ],
  '3' : [
      [([x,]) => (x < 4), ([x,]) => [11 - x,   0], 1],
      [([x,]) => (x < 8), ([x,]) => [8, x - 4], 0],
      [([x,]) => (x < 12), ([x,]) => [11 - x, 4], 1],
      [([x,]) => (x < 16), ([x,]) => [11, 19 - x], 2]
    ]
};

const connectionsPart2Input = {
  '0' : [
      [([,y]) => (y < 50), ([,y]) => [99,  149 - y], 2],
      [([,y]) => (y < 100), ([,y]) => [y + 50,   49], 3],
      [([,y]) => (y < 150), ([,y]) => [149,   149-y], 2],
      [([,y]) => (y < 200), ([,y]) => [y - 100, 149], 3]
    ],
  '1' : [
      [([x,]) => (x < 50), ([x,]) => [x + 100,   0], 1],
      [([x,]) => (x < 100), ([x,]) => [49,  x + 100], 2],
      [([x,]) => (x < 150), ([x,]) => [99,   x - 50], 2]
    ],
  '2' : [
      [([,y]) => (y < 50), ([,y]) => [0,   149 - y], 0],
      [([,y]) => (y < 100), ([,y]) => [y - 50,  100], 1],
      [([,y]) => (y < 150), ([,y]) => [50,  149 - y], 0],
      [([,y]) => (y < 200), ([,y]) => [y - 100,   0], 1],
    ],
  '3' : [
      [([x,]) => (x < 50), ([x,]) => [50,   x + 50], 0],
      [([x,]) => (x < 100), ([x,]) => [0,   x + 100], 0],
      [([x,]) => (x < 150), ([x,]) => [x - 100, 199], 3],
    ]
};

const followPath = (path, map, connections) => {
  let position = [map[0].findIndex(elem => elem == "."), 0];
  let direction = 0;

  for (let { turnDir, steps } of path) {
    let candidatePosition = position;
    let candidateDirection = (direction + 4 + turnDir) % 4;
    let newPosition = candidatePosition;
    let newDirection = candidateDirection;

    let foundWall = false;
    let counter = 0;
    while (counter <= steps && !foundWall) {
      const value = map[candidatePosition[1]]? map[candidatePosition[1]][candidatePosition[0]] : null;
      if (value == '#') {
        foundWall = true;
      }
      else if (value === '.') {
        newPosition = candidatePosition;
        newDirection = candidateDirection;

        candidatePosition = moveNext[newDirection](candidatePosition);
        counter++;
      } else {
        for (const [condition, transform, turn] of connections[newDirection]) {
          if (condition(candidatePosition)) {
            candidatePosition = transform(candidatePosition);
            candidateDirection = turn;
            break;
          }
        }
      }
    }

    position = newPosition;
    direction = newDirection;
  }

  return { position, direction };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const [ map, path ] = getMapAndPath(input);

  const { position, direction } = followPath(path, map, connectionsPart1(map[0].length, map.length));
  const [x, y] = position;

  return 1000 * (y + 1) + 4 * (x + 1) + direction;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const [ map, path ] = getMapAndPath(input);

  const { position, direction } = followPath(path, map, input.length < 250? connectionsPart2Test : connectionsPart2Input);
  const [x, y] = position;

  return 1000 * (y + 1) + 4 * (x + 1) + direction;
};

run({
  part1: {
    tests: [
      {
        input: `        ...#    \n        .#..    \n        #...    \n        ....    \n...#.......#    \n........#...    \n..#....#....    \n..........#.    \n        ...#....\n        .....#..\n        .#......\n        ......#.\n\n10R5L5R10L4R5L5`,
        expected: 6032,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `        ...#    \n        .#..    \n        #...    \n        ....    \n...#.......#    \n........#...    \n..#....#....    \n..........#.    \n        ...#....\n        .....#..\n        .#......\n        ......#.\n\n10R5L5R10L4R5L5`,
        expected: 5031,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
