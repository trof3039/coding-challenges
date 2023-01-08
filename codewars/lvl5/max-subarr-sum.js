// https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c

const maxSequence = arr => {
    const getSumForRange = (start, end) => start <= end ? arr.slice(start, end + 1).reduce((a, v) => a + v) : 0

    const positiveSequences = arr.reduce(
        (acc, v, i) => {
            if (v < 0) return acc

            if (!acc[acc.length - 1] || acc[acc.length - 1].end !== i - 1) {
                acc.push({ start: i, end: i })
                return acc
            }

            acc[acc.length - 1].end = i
            return acc
        },
        []
    )

    const possibleStarts = positiveSequences.map(range => range.start)
    const possibleEnds = positiveSequences.map(range => range.end)

    const result = possibleStarts.reduce(
        (acc, start) => {
            const bestResult = possibleEnds.reduce((acc, end) => {
                const currSum = getSumForRange(start, end)
                return currSum > acc.sum ? { sum: currSum, end } : acc
            }, { sum: 0 })

            return bestResult.sum > acc.sum ? { start, ...bestResult} : acc
        },
        {
            start: 0,
            end: 0,
            sum: 0
        }
    )

    return result.sum
}

console.log(maxSequence([-2, 1, -3, 4, -1, 2, 1, -5, 4]))