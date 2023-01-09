// https://leetcode.com/problems/container-with-most-water/

const height = [1,8,6,2,5,4,8,3,7]
const height2 = [1,1]
const height3 = [4,3,2,1,4]
const height4 = [0,2]
const height5 = [1,2,4,3]
const height6 = [1,0,0,0,0,0,0,2,2]
const height7 = [4,4,2,11,0,11,5,11,13,8]
const height8 = [8,20,1,2,3,4,5,6]

// solve the problem, but get timeout error on large numbers
const maxArea1 = h => h.reduce((acc, h1, i1) => 
    Math.max(acc, h.reduce((a, h2, i2) => 
        Math.max(a, i1 === i2 ? acc : Math.min(h1, h2) * Math.abs(i2 - i1)), 0)), 0)


// slow solution 
// Runtime
// 138 ms
// Beats
// 23.6%
// Memory
// 51.6 MB
// Beats
// 5.57%
const maxArea = (height = []) => {
    const getMax = minHeight => {
        const firstIndex = height.findIndex(h => h >= minHeight)
        let lastIndex
        for (let i = height.length - 1; i > 0; i--) {
            if (height[i] >= minHeight) {
                lastIndex = i
                break
            }
        }
        return (lastIndex - firstIndex) * Math.min(height[firstIndex], height[lastIndex])
    }

    let globalMax = 0
    const set = new Set(height)
    set.forEach(v => {
        if (v * (height.length - 1) <= globalMax) return
        const max = getMax(v)
        if (max > globalMax) globalMax = max
    })

    return globalMax
}

// even slower solution
// Runtime
// 187 ms
// Beats
// 7.98%
// Memory
// 60.2 MB
// Beats
// 5.2%
const maxArea2 = (height = []) => {
    const tallestLines = height.reduce((acc, h, i) => {
        if (!acc[0].length) acc[0].push([h, i])
        else if (!acc[1].length) {
            if (acc[0][0][0] > h) acc[1].push([h, i])
            else if (acc[0][0][0] === h) acc[0].push([h, i])
            else acc[1] = acc[0], acc[0] = [[h, i]]
        }
        else if (h > acc[0][0][0]) acc[1] = acc[0], acc[0] = [[h, i]]
        else if (h === acc[0][0][0]) acc[0].push([h, i])
        else if (h === acc[1][0][0]) acc[1].push([h, i])
        else if (h > acc[1][0][0]) acc[1] = [[h, i]]
        return acc
    }, [[], []])
    const pair = (tallestLines[0].length > 1 ? [tallestLines[0][0], tallestLines[0][tallestLines[0].length - 1]] 
        : tallestLines[1].length === 1 ? tallestLines.flat()
        : [
            tallestLines[0][0], 
            tallestLines[1].reduce((acc,[h, i]) => 
                Math.abs(tallestLines[0][0][1] - i) > Math.abs(tallestLines[0][0][1]- acc[1]) ? [h, i] : acc)
        ]
    ).sort((a, b) => a[1] - b[1])
    const pairIndecies = [pair[0][1], pair[1][1]]

    if (pair[0][0] === 0 || pair[1][0] === 0) return 0

    let leftIndex = pair[0][1]
    let rightIndex = pair[1][1]
    let max = (rightIndex - leftIndex) * Math.min(pair[0][0], pair[1][0])
    while (true) {
        if (leftIndex < 1 && rightIndex > height.length - 1) break

        const maxR = rightIndex > height.length - 2 ? 0 : (rightIndex + 1 - pair[0][1]) * Math.min(pair[0][0], height[rightIndex + 1])
        const maxL = leftIndex < 1 ? 0 : (pair[1][1] - (leftIndex - 1)) * Math.min(pair[1][0], height[leftIndex - 1])

        if (rightIndex <= height.length - 2 && leftIndex >= 1) {
            const maxRlocalL = (rightIndex + 1 - leftIndex) * Math.min(height[leftIndex], height[rightIndex + 1])
            const maxLLocalR = (rightIndex - (leftIndex - 1)) * Math.min(height[rightIndex], height[leftIndex - 1])
            max = Math.max(max, maxRlocalL, maxLLocalR)
        }

        if (maxR >= max) {
            max = maxR
            rightIndex++
            pair[1] = [height[rightIndex], rightIndex]

            for (let i = leftIndex; i <= pairIndecies[0]; i++) {
                const lm = (pair[1][1] - i) * Math.min(pair[1][0], height[i])
                if (lm > max) {
                    max = lm
                    leftIndex = i
                    pair[0] = [height[i], i]
                }
            }
        } else if (maxL >= max) {
            max = maxL
            leftIndex--
            pair[0] = [height[leftIndex], leftIndex]

            for (let i = rightIndex; i >= pairIndecies[1]; i--) {
                const lm = (i - pair[0][1]) * Math.min(pair[0][0], height[i])
                if (lm > max) {
                    max = lm
                    rightIndex = i
                    pair[1] = [height[i], i]
                }
            }
        }
        else if (leftIndex > height.length - 1 - rightIndex) leftIndex-- 
        else rightIndex++
    }
    return max
}


// one more slow solution
// Runtime
// 379 ms
// Beats
// 5.94%
// Memory
// 55.3 MB
// Beats
// 5%
const maxArea3 = (height = []) => { 
    const listL = height.reduce((acc, h, i) => {
        if (acc.length && acc[acc.length - 1][0] >= h) return acc
        return [...acc, [h, i]]
    }, [])
    const lastL = listL[listL.length - 1]
    const listR = []
    for (let i = height.length - 1; i >= 0; i--) {
        const h = height[i]
        if (!listR.length || h > listR[listR.length - 1][0] || h === lastL[0]) listR.push([h, i])
        if (h === lastL[0]) break
    }

    const maxL =  listL.reduce((acc, el) => {
        const higherRight = listR.find(e => e[0] >= el[0])
        const max = higherRight ? (higherRight[1] - el[1]) * el[0] : 0
        return Math.max(acc, max)
    }, 0)

    const maxR =  listR.reduce((acc, el) => {
        const higherLeft = listL.find(e => e[0] >= el[0])
        const max = higherLeft ? (el[1] - higherLeft[1]) * el[0] : 0
        return Math.max(acc, max)
    }, 0)

    return Math.max(maxL, maxR)
}

console.log(maxArea(height))
console.log(maxArea(height2))
console.log(maxArea(height3))
console.log(maxArea(height4))
console.log(maxArea(height5))
console.log(maxArea(height6))
console.log(maxArea(height7))
console.log(maxArea(height8))