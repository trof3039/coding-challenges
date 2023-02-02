// https://leetcode.com/problems/verifying-an-alien-dictionary/

// not bad solution 
// Runtime 71 ms. Beats 58.67%.
// Memory 42.3 MB. Beats 74.49%.
const isAlienSorted = (words, order) => {
    const compareWords = (w1, w2) => {
        const shorterWordLength = w1.length >= w2.length ? w1.length : w2.length
        for (let i = 0; i < shorterWordLength; i++) {
            const l1 = w1[i]
            const l2 = w2[i]

            if (l1 === l2) continue
            if (!l1 && l2 || order.indexOf(l1) < order.indexOf(l2)) return true
            if (l1 && !l2 || order.indexOf(l1) > order.indexOf(l2)) return false
        }
        return true
    }

    for (let i = 1; i < words.length; i++) {
        const prevWord = words[i - 1]
        const currWord = words[i]
        if (!compareWords(prevWord, currWord)) return false
    }
    return true
};

const words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"

console.log(isAlienSorted(words, order))