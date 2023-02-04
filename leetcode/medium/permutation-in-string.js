// https://leetcode.com/problems/permutation-in-string/

// not bad solution
// Runtime 128 ms. Beats 51.6%.
// Memory 48.8 MB. Beats 28.77%.
const checkInclusion = (s1, s2) => {
    const letters = s1.split('').reduce((acc, l) => (acc[l] = (acc[l] || 0) + 1, acc), {})
    for (let i = 0; i < s1.length; i++) {
        const l = s2[i]
        const letterCount = letters[l]
        if (letterCount === 1) {
            delete letters[l] 
            continue
        }
        letters[l] = (letterCount || 0) - 1
    }
    if (Object.keys(letters).length === 0) return true

    for (let i = s1.length; i < s2.length; i++) {
        const letterToInclude = s2[i]
        const letterToExclude = s2[i - s1.length]
        if (letterToInclude === letterToExclude) continue

        const toIncludeCount = letters[letterToInclude]
        if (toIncludeCount === 1) delete letters[letterToInclude]
        else letters[letterToInclude] = (toIncludeCount || 0) - 1

        const toExcludeCount = letters[letterToExclude]
        if (toExcludeCount === -1) delete letters[letterToExclude]
        else letters[letterToExclude] = (toExcludeCount || 0) + 1

        if (Object.keys(letters).length === 0) return true 
    }
    return false    
}

const s1 = "aba", s2 = "eidbaooo"
console.log(checkInclusion(s1, s2))