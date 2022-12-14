/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.js,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 */

const utils = {
    createMatrixFromInput : (lines, parser = parseFloat) => lines.map(line => line.split('').map(parser)),
    createMatrix : (nbLines, nbColumns, val = 0) => new Array(nbLines).fill(null).map(() => new Array(nbColumns).fill(val)),
    displayMatrix : (matrix) => { for(const line of matrix) console.log(line.join('')); },
    countInMatrix : (matrix, val) => matrix.reduce((acc, elem) => acc + elem.reduce((acc, elem) => (val == elem)? acc + 1 : acc, 0), 0),
    maxInMatrix : (matrix) => matrix.reduce((acc, elem) => Math.max(acc, elem.reduce((acc, elem) => Math.max(acc, elem), 0)), 0),
};

export default utils;
