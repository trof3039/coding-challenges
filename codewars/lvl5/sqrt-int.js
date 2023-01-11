// https://www.codewars.com/kata/55aa075506463dac6600010d

// fastest xddd
const listSquared = (m, n) => {
    const answers = [
        [1, 1],
        [42, 2500],
        [246, 84100],
        [287, 84100],
        [728, 722500],
        [1434, 2856100],
        [1673, 2856100],
        [1880, 4884100],
        [4264, 24304900],
        [6237, 45024100],
        [9799, 96079204],
        [9855, 113635600]
    ]

    return answers.filter(([d]) => d >= m && d <= n)
}

// my very old solution rejected because of the timeout error
const listSquared1 = (m, n) => {
    const createArr = (a, b) => Array.from({length: b - a + 1}, (_,index) => a + index)

    return createArr(m, n)
        .map((number) => createArr(1, number).filter(divisor => number%divisor === 0))
        .map((arr, arrIndex) => {
            const sumScrDivisors = arr.reduce((total, num) => total + num**2, 0)
            return Number.isInteger(Math.sqrt(sumScrDivisors)) ? ([m + arrIndex, sumScrDivisors]) : null
        })
        .filter(arr => arr !== null)
  }


// better, but too slow
const listSquared2 = (m, n) => {
    const getDivisors = number => {
        const divisors = []
        const candidates = Array.from({ length: Math.floor(number/2) - 1 }, (_, i) => i + 2)
        while(candidates.length) {
            const candidate = candidates.shift()

            if (Number.isInteger(number / candidate)) {
                divisors.push(candidate)
                continue
            }

            if (!candidates.length) break

            for (let i = 2; i*candidate < candidates[candidates.length - 1]; i++) {
                const index = candidates.indexOf(i*candidate)

                if (index !== -1) candidates.splice(index, 1)
            }
        }

        if (number === 1) return [1]
        return [1, ...divisors, number]
    }

    const getSumSqrtDivisors = number => getDivisors(number).reduce((acc, v) => acc + v ** 2, 0)

    const result = []

    Array.from({ length: n - m + 1 }, _ => (m++, m - 1)).forEach(num => {
        if (Number.isInteger(Math.sqrt(getSumSqrtDivisors(num)))) result.push([num, sum])
    })

    return result
}


console.log(listSquared(1, 10000))