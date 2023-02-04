// https://leetcode.com/problems/permutation-in-string/

// not bad solution
// Runtime 128 ms. Beats 53.17%.
// Memory 48.8 MB. Beats 28.77%.
const checkInclusion = (s1, s2) => {
    const letters = s1.split('').reduce((acc, l) => (acc[l] = (acc[l] || 0) + 1, acc), {})
    for (let i = 0; i < s2.length; i++) {
        const letterToInclude = s2[i]
        const letterToExclude = s2[i - s1.length]
        
        if (letterToExclude && letterToInclude === letterToExclude) continue
        
        const toIncludeCount = letters[letterToInclude]

        if (toIncludeCount === 1) delete letters[letterToInclude]
        else letters[letterToInclude] = (toIncludeCount || 0) - 1

        if (i >= s1.length) {
            const toExcludeCount = letters[letterToExclude]
            
            if (toExcludeCount === -1) delete letters[letterToExclude]
            else letters[letterToExclude] = (toExcludeCount || 0) + 1
        }

        if (i >= s1.length - 1 && Object.keys(letters).length === 0) return true 
    }
    return false    
}

const s1 = "aba", s2 = "eidbaooo"
console.log(checkInclusion(s1, s2))