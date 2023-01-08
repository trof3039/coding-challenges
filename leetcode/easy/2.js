// Input: name = "alex", typed = "aaleex"
// Output: true
// Explanation: 'a' and 'e' in 'alex' were long pressed.
const name = "alex"
const typed = "aaleex"
// const name = "alex"
// const typed = "aaleexa"
// const name = "alexd"
// const typed = "ale"
// const name = "saeed"
// const typed = "ssaaedd"
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