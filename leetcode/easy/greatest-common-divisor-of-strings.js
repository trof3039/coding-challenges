// https://leetcode.com/problems/greatest-common-divisor-of-strings/

// good solution
// Runtime 64 ms. Beats 85.42%.
// Memory 41.9 MB. Beats 92.71%.
// or if we remove line 13 (check for str1 + str2 !== str2 + str1), result will be
// Runtime 59 ms. Beats 94.79%.
// Memory 42.4 MB. Beats 59.38%.

const gcdOfStrings = (str1, str2) => {
    if (str1.length === str2.length) return str1 === str2 ? str1 : ''
    if (str1.length === 0 || str2.length === 0) return ''
    if (str1 + str2 !== str2 + str1) return ''

    const primeFactorized = num => {
        const primeDivisors = {}
        let divisor = 2
        while (true) {
            if (num < divisor ** 2) {
                primeDivisors[num] = 1
                break
            }
            primeDivisors[divisor] = 0
            while (num%divisor === 0) num = num/divisor, primeDivisors[divisor]++
            divisor++
        }
        return primeDivisors
    }

    const primes1 = primeFactorized(str1.length)
    const primes2 = primeFactorized(str2.length)

    let maxDivisor = 1

    for (const key in primes1) {
        if (!primes2[key]) continue
        maxDivisor *= (key ** Math.min(primes1[key], primes2[key]))
    }

    const expectedStr1 = ''.padStart(str1.length, str1.slice(0, maxDivisor))
    const expectedStr2 = ''.padStart(str2.length, str1.slice(0, maxDivisor))
    return expectedStr1 === str1 && expectedStr2 === str2 ? str1.slice(0, maxDivisor) : ''
};


// another good solution
// Runtime 57 ms Beats 94.79%.
// Memory 41.8 MB Beats 92.71%.
const gcdOfStrings1 = (str1, str2) => {
    if (str1.length === 0 || str2.length === 0) return ''
    if (str1 + str2 !== str2 + str1) return ''

    const gcd = (a, b) => 0 === b ? a : gcd(b, a % b)
    return str1.slice(0, gcd(str1.length, str2.length))
};

// const str1 = "ABCABC", str2 = "ABC"
// const str1 = "ABABAB", str2 = "ABAB"
// const str1 = "LEET", str2 = "CODE"
const str1 = "TAUXXTAUXXTAUXXTAUXXTAUXX", str2 = "TAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXX"

console.log(gcdOfStrings(str1, str2))