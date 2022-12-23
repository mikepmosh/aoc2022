import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const getLavaDroplet = (inputLines) => {
  const lavaDroplets = inputLines.map((line) => line.split(',').map(parseFloat));

  const lavaDropletsSorted = [];

  lavaDropletsSorted.push([...lavaDroplets
    .sort((drop1, drop2) => {
      if (drop1[0] != drop2[0]) {
        return drop1[0] - drop2[0];
      }
      if (drop1[1] != drop2[1]) {
        return drop1[1] - drop2[1];
      }
      return drop1[2] - drop2[2];
    })]);

  lavaDropletsSorted.push([...lavaDroplets
    .sort((drop1, drop2) => {
      if (drop1[1] != drop2[1]) {
        return drop1[1] - drop2[1];
      }
      if (drop1[2] != drop2[2]) {
        return drop1[2] - drop2[2];
      }
      return drop1[0] - drop2[0];
    })]);

  lavaDropletsSorted.push([...lavaDroplets
    .sort((drop1, drop2) => {
      if (drop1[2] != drop2[2]) {
        return drop1[2] - drop2[2];
      }
      if (drop1[0] != drop2[0]) {
        return drop1[0] - drop2[0];
      }
      return drop1[1] - drop2[1];
    })]);

  return lavaDropletsSorted;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const lavaDroplets = getLavaDroplet(inputLines);

  let nbFaces = 6 * lavaDroplets[0].length;
  let axe = 0;
  for (const lavaDropletsSorted of lavaDroplets) {
    const nextAxe = (axe +1)%3;
    const nextNextAxe = (axe +2)%3;
    for (let index = 0; index < lavaDropletsSorted.length -1; index++) {
      const drop1 = lavaDropletsSorted[index];
      const drop2 = lavaDropletsSorted[index+1];
      if ((drop1[axe] == drop2[axe]) && (drop1[nextAxe] == drop2[nextAxe]) && (drop1[nextNextAxe] +1 == drop2[nextNextAxe])) {
        nbFaces -= 2;
      }
    }
    axe++;
  }

  return nbFaces;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const lavaDroplets = getLavaDroplet(inputLines);

  const Min = [], Max = [];
  for (let axe = 0; axe < 3; axe++) {
    Min[axe] = lavaDroplets[axe][0][axe];
    Max[axe] = lavaDroplets[axe][lavaDroplets[axe].length-1][axe];
  }

  const adjacents = (point) => ([
    [point[0]-1,point[1],point[2]],
    [point[0]+1,point[1],point[2]],
    [point[0],point[1]-1,point[2]],
    [point[0],point[1]+1,point[2]],
    [point[0],point[1],point[2]-1],
    [point[0],point[1],point[2]+1],
  ].filter((p) => {
    return [0,1,2].every((axe) => (Min[axe]-1 <= p[axe] && p[axe] <= Max[axe]+1));
  }));

  const space = new Array(Max[0]+3).fill(null).map(() => new Array(Max[1]+3).fill(null).map(() => new Array(Max[2]+3).fill(0)));
  for (const [x,y,z] of lavaDroplets[0]) {
    space[x+1][y+1][z+1] = 1;
  }

  const airCubes = [[Min[0]-1,Min[1]-1,Min[2]-1]];
  space[Min[0]-1,Min[1]-1,Min[2]-1] = 2;
  while (airCubes.length) {
    const air = airCubes.shift();
    for (const [x,y,z] of adjacents(air)) {
      if (!space[x+1][y+1][z+1]) {
        space[x+1][y+1][z+1] = 2;
        airCubes.push([x,y,z]);
      }
    }
  }

  let nbFaces = 0;
  for (const lavaDroplet of lavaDroplets[0]) {
    for (const [x,y,z] of adjacents(lavaDroplet)) {
      if (space[x+1][y+1][z+1] == 2) {
        nbFaces++;
      }
    }
  }

  return nbFaces;
};

run({
  part1: {
    tests: [
      {
        input: `2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
