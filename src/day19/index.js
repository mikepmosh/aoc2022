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

const computeOpenGeodes = (
  blueprint,
  maxRequired,
  stocks,
  timeout
) => {
  const geodeProductionCandidates = [0];
  for (const botRessource of ressourcesTypes) {
    if (maxRequired[botRessource] && (stocks[botRessource].production + timeout * stocks[botRessource].factor > (timeout -1) * maxRequired[botRessource])) {
      // We have enough bots to produce the maximum we can spent of this ressource in the remaining time
      geodeProductionCandidates.push(stocks["geode"].production + timeout * stocks["geode"].factor);
    }
    else {
      const newStocks = {};
      for (const ressource of ressourcesTypes) {
        newStocks[ressource] = { ...stocks[ressource] };
      }

      const bot = blueprint[botRessource];
      let newTimeout = timeout;
      while (newTimeout > 1 && !Object.keys(bot).every((r) => bot[r] <= newStocks[r].production)) {
        for (const ressource of ressourcesTypes) {
          newStocks[ressource].production += stocks[ressource].factor;
        }
        newTimeout--;
      }

      if (newTimeout > 1) {
        for (const ressource of Object.keys(bot)) {
          newStocks[ressource].production -= bot[ressource];
        }
        newStocks[botRessource].factor++;

        for (const ressource of ressourcesTypes) {
          newStocks[ressource].production += stocks[ressource].factor;
        }
        newTimeout--;

        if (newTimeout < 2) {
          geodeProductionCandidates.push(newStocks["geode"].production + newTimeout * newStocks["geode"].factor);
        }
        else {
          geodeProductionCandidates.push(computeOpenGeodes(
            blueprint,
            maxRequired,
            newStocks,
            newTimeout
          ));
        }
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
    const stocks = ressourcesTypes.reduce((acc, ressource) => { acc[ressource] = { production: 0, factor: 0 }; return acc; }, {});
    stocks["ore"].factor++;
    const maxRequired = {
      ore: Math.max(...ressourcesTypes.map((ressource) => blueprints[index][ressource].ore)),
      clay: blueprints[index]["obsidian"].clay,
      obsidian: blueprints[index]["geode"].obsidian
    };

    qualityLevel += (index + 1) * computeOpenGeodes(blueprints[index], maxRequired, stocks, 24);
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
    const stocks = ressourcesTypes.reduce((acc, ressource) => { acc[ressource] = { production: 0, factor: 0 }; return acc; }, {});
    stocks["ore"].factor++;
    const maxRequired = {
      ore: Math.max(...ressourcesTypes.map((ressource) => blueprints[index][ressource].ore)),
      clay: blueprints[index]["obsidian"].clay,
      obsidian: blueprints[index]["geode"].obsidian
    };

    qualityLevel *= computeOpenGeodes(blueprints[index], maxRequired, stocks, 32);
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
