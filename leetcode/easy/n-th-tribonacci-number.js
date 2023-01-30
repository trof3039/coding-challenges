// https://leetcode.com/problems/n-th-tribonacci-number/

// Runtime 66 ms Beats 61.7%.
// Memory 41.4 MB Beats 92.35%.

const tribonacci = n => {
    if (n === 0) return 0
    if (n === 1) return 1
    if (n === 2) return 1

    let prev1 = 0
    let prev2 = 1
    let prev3 = 1

    for (let i = 3; i <= n; i++) {
        let curr = prev1 + prev2 + prev3
        prev1 = prev2
        prev2 = prev3
        prev3 = curr
    }

    return prev3
};


console.log(tribonacci(25))