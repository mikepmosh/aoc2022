import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const getClosestPaths = (valvesInfo, start, targets) => {
  for (const valveName of valvesInfo[start].next) {
    if (targets.includes(valveName)) {
      const nextTargets = targets.filter((elem) => (elem != valveName && valvesInfo[start].distanceToValves[elem] != 1));
      getClosestPaths(valvesInfo, valveName, nextTargets);

      for (const targetName of nextTargets) {
        const currentDistance = valvesInfo[start].distanceToValves[targetName];
        const distanceToAdd = valvesInfo[valveName].distanceToValves[targetName];

        if (distanceToAdd && (!currentDistance || ((distanceToAdd +1) < currentDistance))) {
          valvesInfo[start].distanceToValves[targetName] = distanceToAdd +1;
        }
      }
    }

    valvesInfo[start].distanceToValves[valveName] = 1;
  }
};

const getValves = (inputLines) => {
  const valvesInfo = {};
  const valvesNames = [];
  for (const line of inputLines) {
    const lineParts = line.split(/; .*valve[s]? /);
    const name = lineParts[0].split(' ')[1];
    const pressure = parseFloat(lineParts[0].split('=')[1]);
    const next = lineParts[1].split(', ');

    valvesInfo[name] = { pressure, next, distanceToValves: {} };
    valvesNames.push(name);
  }

  let maxOpenValvesPressure = 0;
  const valvesToOpen = [];
  for (const valveName of valvesNames) {
    getClosestPaths(valvesInfo, valveName, valvesNames.filter((elem) => (elem != valveName)));
    if (valvesInfo[valveName].pressure > 0) {
      valvesToOpen.push(valveName);
      maxOpenValvesPressure += valvesInfo[valveName].pressure;
    }
  }

  const valves = {};
  for (const valveName1 of ["AA", ...valvesToOpen]) {
    const pressure = valvesInfo[valveName1].pressure;
    const distanceToValves = {};
    for (const valveName2 of valvesToOpen) {
      const distance = valvesInfo[valveName1].distanceToValves[valveName2];
      if (distance ){
        distanceToValves[valveName2] = distance;
      }
    }

    valves[valveName1] = { pressure, distanceToValves }
  }

  const sortedPressures = valvesToOpen.map((name) => ({ name, value: valves[name].pressure })).sort((v1, v2) => (v2.value - v1.value));
  const sortedValvesToOpen = sortedPressures.map((elem) => (elem.name));

  return { valves, sortedValvesToOpen, maxOpenValvesPressure };
};

const getMaximumTotalPressure = (valves, sortedValvesToOpen, maxOpenValvesPressure, maxTimeOut) => {
  const candidates = [{ currentValve: "AA", accPressure: 0, openValves: [], openValvesPressure: 0, timeout: maxTimeOut }];

  let maximumTotalPressure = 0;
  while (candidates.length > 0) {
    const { currentValve, accPressure, openValves, openValvesPressure, timeout } = candidates.shift();

    const remainingValvesToOpen = sortedValvesToOpen.filter((elem) => !openValves.includes(elem));

    let candidateBestTotalPressure = accPressure + openValvesPressure * timeout;
    let counter = 1;
    for (const valveName of sortedValvesToOpen) {
      if (remainingValvesToOpen.includes(valveName)) {
        candidateBestTotalPressure += (timeout - 2*counter) * valves[valveName].pressure;
        counter++;
      }
    }

    if (candidateBestTotalPressure > maximumTotalPressure) {
      for (const nextValve of remainingValvesToOpen) {
        const minutesToSpent = valves[currentValve].distanceToValves[nextValve] + 1;
        const newTimeout = timeout - minutesToSpent;

        if (newTimeout >= 0) {
          const newAccPressure = accPressure + minutesToSpent * openValvesPressure;
          const newOpenValvesPressure = openValvesPressure + valves[nextValve].pressure;
          maximumTotalPressure = Math.max(maximumTotalPressure, newAccPressure + newOpenValvesPressure * newTimeout);

          if (newOpenValvesPressure < maxOpenValvesPressure) {
            candidates.push({
              currentValve: nextValve,
              accPressure: newAccPressure,
              openValves: [...openValves, nextValve],
              openValvesPressure: newOpenValvesPressure,
              timeout: newTimeout
            });
          }
        }
      }
    }
  }

  return maximumTotalPressure;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const { valves, sortedValvesToOpen, maxOpenValvesPressure } = getValves(inputLines);

  return getMaximumTotalPressure(valves, sortedValvesToOpen, maxOpenValvesPressure, 30);
};

const performValvesSplit = (valves, sortedValvesToOpen) => {
  let valvesToOpenByMe = [];
  let valvesToOpenByElefant = [];
  let shorterWalkByMe = 999;
  let shorterWalkByElefant = 999;

  if (sortedValvesToOpen.length === 0) {
    return { valvesToOpenByMe: ["AA"], valvesToOpenByElefant: ["AA"], walkByMe : 0, walkByElefant : 0 };
  }

  for (const valveName of sortedValvesToOpen.slice(0, Math.floor(sortedValvesToOpen.length / 2) || 1)) {
    const res = performValvesSplit(valves, sortedValvesToOpen.filter((elem) => (elem != valveName)));

    let walkByMe = res.walkByMe;
    for (const valveNameByMe of res.valvesToOpenByMe) {
      walkByMe += valves[valveNameByMe].distanceToValves[valveName];
    }

    let walkByElefant = res.walkByElefant;
    for (const valveNameByElefant of res.valvesToOpenByElefant) {
      walkByElefant += valves[valveNameByElefant].distanceToValves[valveName];
    }

    const shorterWalk = Math.min(walkByMe + res.walkByElefant, res.walkByMe + walkByElefant);
    if (shorterWalk < (shorterWalkByMe + shorterWalkByElefant)) {
      if (walkByMe + res.walkByElefant < res.walkByMe + walkByElefant) {
        shorterWalkByMe = walkByMe;
        shorterWalkByElefant = res.walkByElefant;
        valvesToOpenByMe = [...res.valvesToOpenByMe, valveName];
        valvesToOpenByElefant = res.valvesToOpenByElefant;
      }
      else {
        shorterWalkByMe = res.walkByMe;
        shorterWalkByElefant = walkByElefant;
        valvesToOpenByMe = res.valvesToOpenByMe;
        valvesToOpenByElefant = [...res.valvesToOpenByElefant, valveName];
      }
    }
  }

  return { valvesToOpenByMe, valvesToOpenByElefant, walkByMe : shorterWalkByMe, walkByElefant : shorterWalkByElefant };
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const { valves, sortedValvesToOpen } = getValves(inputLines);

  const { valvesToOpenByMe, valvesToOpenByElefant } = performValvesSplit(valves, sortedValvesToOpen);

  let maxOpenValvesPressureByMe = 0;
  for (const valveName of valvesToOpenByMe) {
    maxOpenValvesPressureByMe += valves[valveName].pressure;
  }

  let maxOpenValvesPressureByElefant = 0;
  for (const valveName of valvesToOpenByElefant) {
    maxOpenValvesPressureByElefant += valves[valveName].pressure;
  }

  const maximumTotalPressureForMe = getMaximumTotalPressure(valves, valvesToOpenByMe.filter((elem) => (elem != "AA")), maxOpenValvesPressureByMe, 26);
  const maximumTotalPressureForElefant = getMaximumTotalPressure(valves, valvesToOpenByElefant.filter((elem) => (elem != "AA")), maxOpenValvesPressureByElefant, 26);

  return maximumTotalPressureForMe + maximumTotalPressureForElefant;
};

run({
  part1: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\nValve BB has flow rate=13; tunnels lead to valves CC, AA\nValve CC has flow rate=2; tunnels lead to valves DD, BB\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\nValve EE has flow rate=3; tunnels lead to valves FF, DD\nValve FF has flow rate=0; tunnels lead to valves EE, GG\nValve GG has flow rate=0; tunnels lead to valves FF, HH\nValve HH has flow rate=22; tunnel leads to valve GG\nValve II has flow rate=0; tunnels lead to valves AA, JJ\nValve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\nValve BB has flow rate=13; tunnels lead to valves CC, AA\nValve CC has flow rate=2; tunnels lead to valves DD, BB\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\nValve EE has flow rate=3; tunnels lead to valves FF, DD\nValve FF has flow rate=0; tunnels lead to valves EE, GG\nValve GG has flow rate=0; tunnels lead to valves FF, HH\nValve HH has flow rate=22; tunnel leads to valve GG\nValve II has flow rate=0; tunnels lead to valves AA, JJ\nValve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
