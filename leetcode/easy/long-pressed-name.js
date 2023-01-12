// https://leetcode.com/problems/long-pressed-name/description

const name = "alex"
const typed = "aaleex"

// Runtime 69 ms. Beats 74.57%.
// Memory 44 MB. Beats 19.8%.
const isLongPressedName = (name, typed) => {
    const getLetterGroups = string => string.split('').reduce(
        (acc, l, i, arr) => {
            if (arr[i - 1] === l) {
                acc[acc.length - 1][1]++
            } else {
                acc.push([l, 1])
            }
            return acc
        }
        , []
    )
    const nameLetters = getLetterGroups(name)
    const typedLetters = getLetterGroups(typed)

    if (nameLetters.length !== typedLetters.length) return false

    return !typedLetters.find((arr, i) => nameLetters[i][0] !== arr[0] || nameLetters[i][1] > arr[1])
}

console.log(isLongPressedName(name, typed))