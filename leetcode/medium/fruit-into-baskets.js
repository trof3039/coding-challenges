// https://leetcode.com/problems/fruit-into-baskets/

// very fast solution
// Runtime 70 ms. Beats 99.70%.
// Memory 48.7 MB. Beats 98.59%.
const totalFruit = fruits => {
    const totalTrees = fruits.length
    if (totalTrees <= 2) return totalTrees

    let max = 2
    let currentMax = 1
    let currF1 = -1
    let currF2 = fruits[0]
    let lastF1Index = 0

    for (let i = 1; i < totalTrees; i++) {
        if (max >= currentMax + totalTrees - i) break
        const currF = fruits[i]
        if (currF === currF1) {
            currF1 = currF2
            currF2 = currF
            lastF1Index = i - 1
            currentMax++
        }
        else if (currF === currF2) currentMax++
        else {
            if (currF1 === -1) currentMax++
            else max = Math.max(max, currentMax), currentMax = i - lastF1Index
            currF1 = currF2
            currF2 = currF
            lastF1Index = i - 1
        }
    }
    return Math.max(max, currentMax)
};

// refactored and slower for some reason
// Runtime 89 ms. Beats 92.76%. 
// Memory 48.7 MB. Beats 98.59%.
const totalFruit1 = fruits => {
    const totalTrees = fruits.length
    if (totalTrees <= 2) return totalTrees

    let max = 2
    let currentMax = 1
    let currF1 = -1
    let currF2 = fruits[0]
    let lastF1Index = -1

    for (let i = 1; i < totalTrees; i++) {
        if (max >= currentMax + totalTrees - i) break

        const currF = fruits[i]

        if (currF === currF1 || currF === currF2) {
            if (currF === currF1) {
                currF1 = currF2
                currF2 = currF
                lastF1Index = i - 1
            }

            currentMax++
        } else {
            max = Math.max(max, currentMax)
            currentMax = i - lastF1Index
            currF1 = currF2
            currF2 = currF
            lastF1Index = i - 1
        }
    }
    
    return Math.max(max, currentMax)
};

// const fruits = [1,2,3,2,2]
const fruits = [3,3,3,1,2,1,1,2,3,3,4]
// const fruits = [1,0,1,4,1,4,1,2,3]

console.log(totalFruit(fruits))