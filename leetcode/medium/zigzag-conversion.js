// https://leetcode.com/problems/zigzag-conversion/


// good sulution, idk why it's not in top 90%
// Runtime 100 ms. Beats 56.87%.
// Memory 48.1 MB. Beats 50.60%.
const convert = (s, numRows) => {
    if (numRows === 1) return s
    const rows = Array.from({length: numRows}, () => [])
    let moveDown = true
    let row = 0
    for (let i = 0; i < s.length; i++) {
        rows[row].push(s[i])
        if (row === 0 || row === rows.length - 1) moveDown = row === 0
        if (moveDown) row++
        else row--
    }
    return rows.flat().join('')
};

// const s = "PAYPALISHIRING", numRows = 3, output = 'PAHNAPLSIIGYIR'
const s = "PAYPALISHIRING", numRows = 4, output = 'PINALSIGYAHRPI'

console.log(convert(s, numRows) === output)