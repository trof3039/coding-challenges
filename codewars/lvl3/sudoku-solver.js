// https://www.codewars.com/kata/5296bc77afba8baa690002d7

const sudoku = puzzle => {
    const findValue = (puzzle, number, index, arrIndex) => {
      const variants = puzzle.map((arr, i) => i === arrIndex ? arr 
      : Math.floor(i/3) === Math.floor(arrIndex/3) ? arr.slice(Math.floor(index/3) * 3, (Math.floor(index/3) + 1) * 3) 
      : arr.slice(index, index + 1))
            .join().split(',').map(n => +n)
            .filter(element => element !== 0)
            .slice()
            .sort()
            .reduce(
                (answers,_, index, array) => 
                    new Set(array).size <= 7 ? []
                    : array.indexOf(index + 1) === -1 && index <= 8 ? [index + 1, ...answers] 
                    : new Set(array).size === 8 && array.indexOf(9) === -1 ? [9] 
                    : answers
            , []
            )

      return number !== 0 ? number 
        : variants.length === 1 ? variants[0] 
        : 0
    }

    const newPuzzle = puzzle.map((arr, arrIndex) => arr.map((item, index) => findValue(puzzle, item, index, arrIndex)))

    return puzzle
      .join()
      .split(',')
      .map(n => +n)
      .indexOf(0) === -1 ? puzzle : sudoku(newPuzzle)
}

const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

console.log(sudoku(puzzle))