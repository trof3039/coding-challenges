// https://leetcode.com/contest/weekly-contest-331/problems/count-vowel-strings-in-ranges/
// https://leetcode.com/contest/weekly-contest-331/problems/house-robber-iv/
// https://leetcode.com/contest/weekly-contest-331/problems/rearranging-fruits/
// https://leetcode.com/contest/weekly-contest-331/problems/take-gifts-from-the-richest-pile/

const pickGifts = function(gifts, k) {
    const sorted = gifts.sort((a, b) => b - a)
    for (let i = 0; i < k; i++) {
        const number = sorted.splice(0, 1)
        const sqrt = Math.floor(Math.sqrt(number))
        for (let j = 0; j < k; j++) {
            if (sorted[j] >= sqrt) {
                if (j !== k - 1) continue
                sorted.push(sqrt)
            } else {
                sorted.splice(j, 0, sqrt)
                break
            } 
        }
    }
    return sorted.reduce((acc, v) => acc + v)
};

const vowelStrings = (words, queries) => {
    const vowels = ['a', 'e', 'i', 'o', 'u']
    const res = []

    for (let i = 0; i < words.length; i++) {
        const word = words[i]
        words[i] = vowels.includes(word[0]) && vowels.includes(word[word.length - 1])
    }
    for (let i = 0; i < queries.length; i++) {
        let localRes = 0
        for (let j = queries[i][0]; j <= queries[i][1]; j++) {
            if (words[j]) localRes++
        }
        res.push(localRes)
    }
    return res
}