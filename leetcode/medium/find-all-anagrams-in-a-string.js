// https://leetcode.com/problems/find-all-anagrams-in-a-string/


// not bad solution
// Runtime 150 ms. Beats 57.19%.
// Memory 48.8 MB. Beats 50.15%.
const findAnagrams = (s2, s1) => {
    const indecies = []
    const letters = s1.split('').reduce((acc, l) => (acc[l] = (acc[l] || 0) + 1, acc), {})
    let addNext = false
    for (let i = 0; i < s2.length; i++) {
        const letterToInclude = s2[i]
        const letterToExclude = s2[i - s1.length]

        if (letterToExclude && letterToInclude === letterToExclude) {
            if (addNext) indecies.push(i - s1.length + 1)
            continue
        }

        addNext = false
        const toIncludeCount = letters[letterToInclude]

        if (toIncludeCount === 1) delete letters[letterToInclude]
        else letters[letterToInclude] = (toIncludeCount || 0) - 1

        if (i >= s1.length) {
            const toExcludeCount = letters[letterToExclude]

            if (toExcludeCount === -1) delete letters[letterToExclude]
            else letters[letterToExclude] = (toExcludeCount || 0) + 1
        }

        if (i >= s1.length - 1 && Object.keys(letters).length === 0) {
            addNext = true
            indecies.push(i - s1.length + 1)
        }
    }
    return indecies
};

// const s = "cbaebabacd", p = "abc"
const s = "abab", p = "ab"
console.log(findAnagrams(s, p))
