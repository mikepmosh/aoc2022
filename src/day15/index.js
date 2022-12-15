import run from "aocrunner";
import utils from '../utils/index.js';

const parseInput = (rawInput) => rawInput;

const analyseCoordinates = (pairsSensorBeacon) => { // useful for display and getting min and max
  const firstCoords = pairsSensorBeacon[0][0];
  let minLine = firstCoords[1], maxLine = firstCoords[1], minColumn = firstCoords[0], maxColumn = firstCoords[0];

  for (const pair of pairsSensorBeacon) {
    for (const coord of pair) {
      minLine = Math.min(minLine, coord[1]);
      maxLine = Math.max(maxLine, coord[1]);
      minColumn = Math.min(minColumn, coord[0]);
      maxColumn = Math.max(maxColumn, coord[0]);
    }
  }

  return { minLine, minColumn, nbLines : maxLine - minLine +1, nbColum : maxColumn - minColumn +1 };
};

const getPairsSensorBeacon = (inputLines) => {
  let pairs = [];
  for (const line of inputLines) {
    const lineParts = line.split(": ");
    let pair = [];
    for (const linePart of lineParts) {
      const coordsStr = linePart.split("at ")[1].split(', ');
      let elem = [];
      for (const coordStr of coordsStr) {
        elem.push(parseFloat(coordStr.split('=')[1]));
      }
      pair.push(elem);
    }
    pairs.push(pair);
  }
  return pairs;
};

const addSensorsAndBeaconsInMap = (map, pairsSensorBeacon, minLine, minColumn) => { // useful for display
  for (const pair of pairsSensorBeacon) {
    map[pair[0][1] - minLine][pair[0][0] - minColumn] = 'S';
    map[pair[1][1] - minLine][pair[1][0] - minColumn] = 'B';
  }
};

const computeDistanceSensorBeacon = (pairsSensorBeacon) => {
  const distances = [];
  for (const pair of pairsSensorBeacon) {
    distances.push(Math.abs(pair[1][0] - pair[0][0]) + Math.abs(pair[1][1] - pair[0][1]));
  }
  return distances;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const pairsSensorBeacon = getPairsSensorBeacon(inputLines);
  const { minLine, minColumn, nbLines, nbColum } = analyseCoordinates(pairsSensorBeacon);

  // const map = utils.createMatrix(nbLines, nbColum, '.');
  // addSensorsAndBeaconsInMap(map, pairsSensorBeacon, minLine, minColumn);
  // utils.displayMatrix(map);

  const distancesSensorBeacon = computeDistanceSensorBeacon(pairsSensorBeacon);

  let nbNotPossibleBeaconPositions = 0;
  const lineIdx = (nbColum == 28) ? 10 : 2000000;
  const extended = nbLines + nbColum;
  for (let counter = -extended; counter < nbColum + extended;  counter++) {
    const columnIdx = counter + minColumn;
    let sensorFound = false;
    let beaconFound = false;
    let pairIdx = 0;

    while (!sensorFound && !beaconFound && pairIdx < pairsSensorBeacon.length) {
      const sensor = pairsSensorBeacon[pairIdx][0];
      const beacon = pairsSensorBeacon[pairIdx][1];
      const distance = Math.abs(sensor[0] - columnIdx) + Math.abs(sensor[1] - lineIdx);
      sensorFound = !distance || (distance <= distancesSensorBeacon[pairIdx]);
      beaconFound = (beacon[0] == columnIdx && beacon[1] == lineIdx);
      pairIdx++;
    }
    if (!beaconFound && sensorFound) {
      nbNotPossibleBeaconPositions++;
    }
  }

  return nbNotPossibleBeaconPositions;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const pairsSensorBeacon = getPairsSensorBeacon(inputLines);
  const { minLine, minColumn, nbLines, nbColum } = analyseCoordinates(pairsSensorBeacon);
  const distancesSensorBeacon = computeDistanceSensorBeacon(pairsSensorBeacon);

  let signal = 0;
  const maxColumn = (nbColum == 28) ? 20 : 4000000;

  for (let lineIdx = 0; lineIdx < nbLines;  lineIdx++) {
    for (let columnIdx = 0; columnIdx < maxColumn;  columnIdx++) {
      let sensorFound = false;
      let beaconFound = false;
      let pairIdx = 0;
      let distanceDiff = 0;

      while (!sensorFound && !beaconFound && pairIdx < pairsSensorBeacon.length) {
        const sensor = pairsSensorBeacon[pairIdx][0];
        const beacon = pairsSensorBeacon[pairIdx][1];
        const distance = Math.abs(sensor[0] - columnIdx) + Math.abs(sensor[1] - lineIdx);
        distanceDiff = distancesSensorBeacon[pairIdx] - distance;
        sensorFound = !distance || (0 <= distanceDiff);
        beaconFound = (beacon[0] == columnIdx && beacon[1] == lineIdx);
        pairIdx++;
      }
      if (!beaconFound && !sensorFound) {
        signal = 4000000 * columnIdx + lineIdx;
        break;
      }
      if (sensorFound && distanceDiff > 0) {
        // considering Manhattan distance definition, we can perform jumps with the remaining distance
        columnIdx += distanceDiff -1;
      }
    }
    if (signal != 0) {
      break;
    }
  }

  return signal;
};

run({
  part1: {
    tests: [
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});