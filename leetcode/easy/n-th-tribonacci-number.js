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

// Runtime 63 ms Beats 71.15%.
// Memory 41.4 MB Beats 87.72%.
const cache = [0, 1, 1]
const tribonacci1 = n => {
    if (cache[n] === undefined) {
        cache[n] = tribonacci1(n - 3) + tribonacci1(n - 2) + tribonacci1(n - 1);
    }

    return cache[n];
};
console.log(tribonacci(25))