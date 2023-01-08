// https://www.codewars.com/kata/58c5577d61aefcf3ff000081

const arrEncoder = (array, numberRails) => {
    const dirs = {
        up: -1,
        down: 1
    }
    let direction = {
        curr: dirs.down,
        change: () => direction.curr === -1 ? direction.curr = 1 : direction.curr = -1
    }

    const result = Array.from({ length: numberRails }, () => [])

    const doStep = (lineIndex = 0, arrIndex = 0) => {
        result[lineIndex].push(array[arrIndex])

        if (lineIndex + direction.curr === -1 || lineIndex + direction.curr === numberRails) {
            direction.change()
        }

        if (arrIndex < array.length - 1) {
            doStep(lineIndex + direction.curr, arrIndex + 1)
        }
    }

    doStep()

    return result.reduce((acc, arr) => [...acc, ...arr], [])
}

const encodeRailFenceCipher = (string, numberRails) => arrEncoder(string.split(''), numberRails).join('')

const decodeRailFenceCipher = (string, numberRails) => {
    const toEncode = Array.from({ length: string.length }, (_, i) => i)
    const encoded = arrEncoder(toEncode, numberRails)

    const result = Array.from({ length: string.length }, () => null)

    string.split('').forEach((letter, i) => result[encoded[i]] = letter)
    return result.join('')
}
