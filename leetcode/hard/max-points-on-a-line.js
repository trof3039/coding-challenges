// https://leetcode.com/problems/max-points-on-a-line/

const points = [[1,1],[2,2],[3,3]]
const p1 = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
const p2 = [[1,1],[3,2],[3,3],[3,1],[2,3],[1,4]]
const p3 = [[1,1],[3,2],[4,2],[6,2],[2,3],[1,4]]

// first, not the best (slow) solution
// Runtime 192 ms. Beats 57.39%.
// Memory 65.7 MB. Beats 15.65%.

const maxPoints = points => {
    if (points.length <= 2) return points.length

    const x = i => points[i][0]
    const y = i => points[i][1]
    let maxPoints = 2

    for (let i = 0; i < points.length; i++) {
        let currentMax = 2
        const parameters = new Map()
        for (let k = i + 1; k < points.length; k++) {
            if (currentMax + points.length - k <= maxPoints) break

            let a, b
            let parralelToOrdinate = false
            if (y(i) === y(k)) a = 0, b = y(i)
            else if (x(i) === x(k)) a = 0, b = x(i), parralelToOrdinate = true
            else {
                if (x(i) === 0) b = y(i), a = (y(k) - b)/x(k) 
                else if (x(k) === 0) b = y(k), a = (y(i) - b)/x(i)
                else b = (y(i)*x(k) - y(k)*x(i))/(x(k) - x(i)), a = (y(i) - b)/x(i)
            }

            const s = Symbol.for([a, b, parralelToOrdinate])
            const mapValue = parameters.get(s)
            parameters.set(s, mapValue ? mapValue + 1 : 2)
            currentMax = mapValue ? Math.max(currentMax, mapValue + 1) : currentMax
        }
        maxPoints = Math.max(currentMax, maxPoints)
    }

    return maxPoints
};

console.log(maxPoints(points))
console.log(maxPoints(p1))
console.log(maxPoints(p2))
console.log(maxPoints(p3))

// second, better solution
// Runtime 106 ms. Beats 93.91%.
// Memory 42.2 MB. Beats 98.26%.

const maxPoints1 = points => {
    if (points.length <= 2) return points.length

    const onSameLine = (first, second, third) => {
        if (first[0] === second[0]) return first[0] === third[0]
        if (first[0] === third[0]) return false
    
        return (second[1] - first[1])/(second[0] - first[0]) === (third[1] - first[1])/(third[0] - first[0])
    }
    let maxPoints = 2

    for (let i = 0; i < points.length; i++) {
        const first = points[i]
        for (let k = i + 1; k < points.length; k++) {
            const second = points[k]
            let currentMax = 2
            for (let j = k + 1; j < points.length; j++) {
                if (onSameLine(first, second, points[j])) {
                    currentMax++
                }
            }
            maxPoints = Math.max(maxPoints, currentMax)
        }
    }

    return maxPoints
};

console.log(maxPoints1(points))
console.log(maxPoints1(p1))
console.log(maxPoints1(p2))
console.log(maxPoints1(p3))