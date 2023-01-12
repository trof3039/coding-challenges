// https://leetcode.com/problems/height-checker

const heights = [1,1,4,2,1,3]
const heights2 = [5,1,2,3,4]
const heights3 = [2,1,2,1,1,2,2,1]

// slow solution
// Runtime 116 ms. Beats 11.15%.
// Memory 44.4 MB. Beats 12.3%.
const heightChecker = heights => {
    const groups = heights.reduce(
        (acc, v, i) => {
            if (acc[v]) acc[v].push(i)
            else acc[v] = [i]
            return acc
        }
        , {}
    )
    const sortedGroups = Object.entries(groups).sort((a, b) => a[0] - b[0])
    const ranges = sortedGroups.reduce(
        (acc, arr) => {
            const currEnd = acc.prevEnd + arr[1].length
            acc[arr[0]] = [acc.prevEnd + 1, currEnd]
            acc.prevEnd = currEnd
            return acc
        }
        , {prevEnd: -1}
    )
    
    return heights.reduce((acc, v, i) => i >= ranges[v][0] && i <= ranges[v][1] ? acc : acc + 1, 0)
}


console.log(heightChecker(heights))
console.log(heightChecker(heights2))
console.log(heightChecker(heights3))
