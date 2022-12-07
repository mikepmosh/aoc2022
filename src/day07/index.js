import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const parseFileSystem = (lines, lineIdx) => {
	const ls = [];
	const dirs = {};
	let size = 0;
	let res = 0;
	while (lineIdx < lines.length) {
		const line = lines[lineIdx];
		const words = line.split(' ');
		if (words[0] === '$') {
			if (words[1] === 'cd') {
				if (words[2] === '..') {
					return { ls, dirs, size, res, lineIdx };
				}
				else {
					const subFolder = parseFileSystem(lines, lineIdx + 1);
					dirs[words[2]] = subFolder;
					size += subFolder.size;
					res += subFolder.res;
					if (subFolder.size < 100000) {
						res += subFolder.size;
					}
					lineIdx = subFolder.lineIdx;
				}
			}
		}
		else if (words[0] === 'dir') {
			ls.push(words[1]);
		}
		else {
			ls.push(words[1]);
			const fileSize = parseInt(words[0]);
			size += fileSize;
		}
		lineIdx = lineIdx + 1;
	}

	return { ls, dirs, size, res, lineIdx };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const fileSystem = parseFileSystem(inputLines, 0);

  return fileSystem.res;
};

const getSizeToDelete = (folder, missingSize, sizeToDelete) =>
{
	for (const dirname of Object.keys(folder.dirs)) {
		const size = folder.dirs[dirname].size;
		if (missingSize <= size && size < sizeToDelete) {
			sizeToDelete = size;
		}
		sizeToDelete = getSizeToDelete(folder.dirs[dirname], missingSize, sizeToDelete);
	}

	return sizeToDelete;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const inputLines = input.split('\n');

  const fileSystem = parseFileSystem(inputLines, 0);
  const missingSize = fileSystem.size - 40000000;

  const sizeToDelete = getSizeToDelete(fileSystem, missingSize, fileSystem.size);

  return sizeToDelete;
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
		{
			input: `$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k`,
			expected: 24933642,
		},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
