import run from "aocrunner";

const parseInput = (rawInput) => rawInput;


const operations = {
  'old * old' : (x) => (x * x),
  '*' : (constant) => (x) => (x * constant),
  '+' : (constant) => (x) => (x + constant),
};

const createMonkeysFromInput = (inputLines) => {
  const monkeys = [];

  let lineCounter = 0, items = [], operation = null, test = null, nextTrue = null, nextFalse = null;
  inputLines.push("");
  for (const line of inputLines) {
    if (!line) {
      monkeys.push( { items, operation, test, nextTrue, nextFalse, counter: 0 } );
      lineCounter = 0, items = [];
    }
    else {
      const words = line.split(" ");
      switch(lineCounter) {
        case 0:
          break;
        case 1:
          const startingItemsStr = line.split(": ")[1];
          items = startingItemsStr.split(", ").map(parseFloat);
          break;
        case 2:
          const operationStr = line.split("= ")[1];
          operation = operations[operationStr];
          if (!operation) {
            operation = operations[words[words.length-2]](parseInt(words[words.length-1]));
          }
          break;
        case 3:
          test = parseInt(words[words.length-1]);
          break;
        case 4:
          nextTrue = parseInt(words[words.length-1]);
          break;
        case 5:
          nextFalse = parseInt(words[words.length-1]);
          break;
      }

      lineCounter++;
    }
  }

  return monkeys;
};

const playMonkeys = (monkeys, rounds, reliefFnc) => {
  for (let round = 0; round < rounds; round++) {
    for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
      for (const item of monkeys[monkeyIndex].items) {
        monkeys[monkeyIndex].counter++;
        const newLevel = reliefFnc(monkeys[monkeyIndex].operation(item));

        const next = (newLevel % monkeys[monkeyIndex].test)? monkeys[monkeyIndex].nextFalse : monkeys[monkeyIndex].nextTrue;
        monkeys[next].items.push(newLevel);
      }
      monkeys[monkeyIndex].items = [];
    }
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const monkeys = createMonkeysFromInput(inputLines);
  playMonkeys(monkeys, 20, (x) => Math.floor(x/3));
  const counters = monkeys.map((monkey) => monkey.counter).sort((a,b) => (b - a));

  return counters[0] * counters[1];
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const monkeys = createMonkeysFromInput(inputLines);

  let maximumValue = 1;
  for (const monkey of monkeys) {
    maximumValue *= monkey.test;
  }

  playMonkeys(monkeys, 10000, (x) => x % maximumValue);
  const counters = monkeys.map((monkey) => monkey.counter).sort((a,b) => (b - a));

  return counters[0] * counters[1];
};

run({
  part1: {
    tests: [
      {
        input: `Monkey 0:\nStarting items: 79, 98\nOperation: new = old * 19\nTest: divisible by 23\n  If true: throw to monkey 2\n  If false: throw to monkey 3\n\nMonkey 1:\nStarting items: 54, 65, 75, 74\nOperation: new = old + 6\nTest: divisible by 19\n  If true: throw to monkey 2\n  If false: throw to monkey 0\n\nMonkey 2:\nStarting items: 79, 60, 97\nOperation: new = old * old\nTest: divisible by 13\n  If true: throw to monkey 1\n  If false: throw to monkey 3\n\nMonkey 3:\nStarting items: 74\nOperation: new = old + 3\nTest: divisible by 17\n  If true: throw to monkey 0\n  If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Monkey 0:\nStarting items: 79, 98\nOperation: new = old * 19\nTest: divisible by 23\n  If true: throw to monkey 2\n  If false: throw to monkey 3\n\nMonkey 1:\nStarting items: 54, 65, 75, 74\nOperation: new = old + 6\nTest: divisible by 19\n  If true: throw to monkey 2\n  If false: throw to monkey 0\n\nMonkey 2:\nStarting items: 79, 60, 97\nOperation: new = old * old\nTest: divisible by 13\n  If true: throw to monkey 1\n  If false: throw to monkey 3\n\nMonkey 3:\nStarting items: 74\nOperation: new = old + 3\nTest: divisible by 17\n  If true: throw to monkey 0\n  If false: throw to monkey 1`,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
