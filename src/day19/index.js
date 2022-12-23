import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const getBlueprints = (inputLines) =>
{
  return inputLines.map((line) =>
  {
    const lineParts = line.split('. ');
    const oreBotCost = parseFloat(lineParts[0].split('costs ')[1].split(' ')[0]);
    const clayBotCost = parseFloat(lineParts[1].split('costs ')[1].split(' ')[0]);
    const obsidianBotCost = lineParts[2].split('costs ')[1].split(' and ').map((p) => parseFloat(p.split(' ')[0]));
    const geodeBotCost = lineParts[3].split('costs ')[1].split(' and ').map((p) => parseFloat(p.split(' ')[0]));

    return {
      ore: { ore: oreBotCost },
      clay: { ore: clayBotCost },
      obsidian: { ore: obsidianBotCost[0], clay: obsidianBotCost[1] },
      geode: { ore: geodeBotCost[0], obsidian: geodeBotCost[1] }
    };
  });
};

const ressourcesTypes = ["ore", "clay", "obsidian", "geode"];
const ressourcesToSpent = ["ore", "clay", "obsidian"];

const computeOpenGeodes = (
  blueprint,
  stocks,
  timeout,
  limits
) => {
  const geodeProductionCandidates = [0];
  for (const resource of ressourcesTypes) {
    const bot = blueprint[resource];
    if (timeout >= limits[resource]) {
      let newTimeout = timeout;

      const newResources = {};
      for (const resource of ressourcesToSpent) {
        newResources[resource] = stocks[resource].production;
      }

      while (newTimeout > 0 && !ressourcesToSpent.every((r) => (!bot[r] || bot[r] <= newResources[r]))) {
        for (const resource of ressourcesToSpent) {
          newResources[resource] += stocks[resource].factor;
        }
        newTimeout--;
      }

      if (newTimeout > 1) {
        for (const resource of ressourcesToSpent) {
          newResources[resource] += stocks[resource].factor;
          if (bot[resource]) {
            newResources[resource] -= bot[resource];
          }
        }
        newTimeout--;

        const newStocks = {};
        for (const resource of ressourcesTypes) {
          newStocks[resource] = { factor: stocks[resource]["factor"] };
          newStocks[resource].production = newResources[resource];
        }
        newStocks[resource].factor++;

        geodeProductionCandidates.push((resource == "geode" ? newTimeout : 0) + computeOpenGeodes(
          blueprint,
          newStocks,
          newTimeout,
          limits
        ));
      }
    }
  }

  return Math.max(...geodeProductionCandidates);
};

const part1 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const blueprints = getBlueprints(inputLines, true);

  let qualityLevel = 0;
  for (let index = 0; index < blueprints.length; index++)
  {
    qualityLevel += (index + 1) * computeOpenGeodes(
      blueprints[index],
      {
        ore: { production: 0, factor: 1 },
        clay: { production: 0, factor: 0 },
        obsidian: { production: 0, factor: 0 },
        geode: { production: 0, factor: 0 }
      },
      24,
      { ore: 16, clay: 9, obsidian: 4, geode: 2 }
    );
  }

  return qualityLevel;
};

const part2 = (rawInput) =>
{
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');
  const blueprints = getBlueprints(inputLines);

  let qualityLevel = 1;
  for (let index = 0; index < Math.min(blueprints.length, 3); index++)
  {
    qualityLevel *= computeOpenGeodes(
      blueprints[index],
      {
        ore: { production: 0, factor: 1 },
        clay: { production: 0, factor: 0 },
        obsidian: { production: 0, factor: 0 },
        geode: { production: 0, factor: 0 }
      },
      32,
      { ore: 24, clay: 13, obsidian: 8, geode: 2 }
    );
  }

  return qualityLevel;
};

run({
  part1: {
    tests: [
      {
        input: `Blueprint 1: Each ore bot costs 4 ore. Each clay bot costs 2 ore. Each obsidian bot costs 3 ore and 14 clay. Each geode bot costs 2 ore and 7 obsidian.\nBlueprint 2: Each ore bot costs 2 ore. Each clay bot costs 3 ore. Each obsidian bot costs 3 ore and 8 clay. Each geode bot costs 3 ore and 12 obsidian.`,
        expected: 33,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Blueprint 1: Each ore bot costs 4 ore. Each clay bot costs 2 ore. Each obsidian bot costs 3 ore and 14 clay. Each geode bot costs 2 ore and 7 obsidian.\nBlueprint 2: Each ore bot costs 2 ore. Each clay bot costs 3 ore. Each obsidian bot costs 3 ore and 8 clay. Each geode bot costs 3 ore and 12 obsidian.`,
        expected: 3472,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
