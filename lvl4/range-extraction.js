// https://www.codewars.com/kata/51ba717bb08c1cd60f00002f/train/javascript 


const solution = arr => { 
    const getRangeEnd = index => arr[index] !== arr[index + 1] - 1 ? index : arr.findIndex((v, i) => i > index && v !== arr[i + 1] - 1)

    const result = arr.reduce(
        (acc, v, i) => {
            if (i === 0) acc.valIndex = 0

            const end = getRangeEnd(i)

            if (acc.valIndex > i) return acc

            if (i === end || i === end - 1) {
                acc.valIndex++
                return [...acc, v]
            }

            acc.valIndex = end + 1

            acc.push(`${v}-${arr[end]}`)
            return acc
        }
        , []
    )

    return result.join()
}

const data = [-10, -9, -8, -6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20]
console.log(solution(data))