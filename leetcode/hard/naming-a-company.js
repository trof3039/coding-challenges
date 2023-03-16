// https://leetcode.com/problems/naming-a-company/

const distinctNames = ideas => {
    const lettersByEndings = {}
    for (let i = 0; i < ideas.length; i++) {
        const w = ideas[i], end = w.slice(1)
        const arr = lettersByEndings[end]
        arr ? arr.push(w.charCodeAt(0) - 97) : lettersByEndings[end] = [w.charCodeAt(0) - 97]
    }

    const gs = Object.values(lettersByEndings)

    const gsByLetters = Array.from({length: 26}, () => ({}))
    for (let i = 0; i < gs.length; i++) {
        const g = gs[i]
        for (let j = 0; j < g.length; j++) {
            const code = g[j]
            gsByLetters[code][i] = true
        }
    }

    let res = 0
    for (let i = 0; i < gs.length - 1; i++) {
        const g = gs[i]

        const groupMatches = {}
        for (let j = 0; j < g.length; j++) {
            const groups = gsByLetters[g[j]]
            for (const group in groups) {
                if (group > i) groupMatches[group] = (groupMatches[group] || 0) + 1
            }
        }

        let validPairs = 0
        for (let j = i + 1; j < gs.length; j++) {
            const matches = groupMatches[j] || 0
            validPairs += (g.length - matches) * (gs[j].length - matches)
        }
        
        res += validPairs
    }

    return res * 2
};
// const ideas = ["aaa","baa","caa","bbb","cbb","cee","bee","dbb"]
const ideas = ["coffee","donuts","time","toffee", "zzz", "aaa","baa","caa","bbb","cbb","cee","bee","dbb"]

// solution looks good (pretty) but gets timeout error on large testcases
const distinctNames1 = ideas => {
    const l = ideas.length
    const fls = {}
    const es = {}
    for (let i = 0; i < l; i++) {
        const w = ideas[i], fl = w[0], e = w.slice(1)
        const efls = fls[fl]
        const ees = es[e]
        efls ? efls.push(e) : fls[fl] = [e]
        ees ? ees.push(fl) : es[e] = [fl]
    }

    let result = 0
    for (let i = 0; i < l; i++) {
        const w1 = ideas[i], fl1 = w1[0], e1 = w1.slice(1)

        let validCount = 0
        for (let j = i; j < l; j++) {
            const w2 = ideas[j]

            const fl2 = w2[0]
            if (fl1 === fl2) continue
            const e2 = w2.slice(1)
            if (e1 === e2 || fls[fl2].includes(e1) || es[e2].includes(fl1)) continue

            validCount++
        }

        result +=validCount
    }

    return result * 2
};

// also gets timeout error on large testcases
const distinctNames2 = ideas => {
    const n = ideas.length
    const fls = {}
    const ends = {}
    for (let i = 0; i < n; i++) {
        const w = ideas[i], fl = w[0], e = w.slice(1)
        const existingFls = fls[fl]
        const existingEnds = ends[e]
        existingFls ? existingFls.push(e) : fls[fl] = [e]
        existingEnds ? existingEnds.push(fl) : ends[e] = [fl]
    }

    let result = 2
    for (let i = 2; i < n; i++) result += i * 2
    for (const fl in fls) {
        const currentEnds = fls[fl]
        let excludeForEach = 0
        let excludeByEnds = 0

        for (let i = 0; i < currentEnds.length; i++) {
            const end = currentEnds[i]
            const letters = ends[end]
            excludeForEach += letters.length
            
            for (let j = 0; j < letters.length; j++) {
                const letter = letters[j]
                if (letter === fl) continue

                const endsToExclude = fls[letter]
                for (let k = 0; k < endsToExclude.length; k++) {
                    if (!currentEnds.includes(endsToExclude[k])) excludeByEnds++
                }
            }
        }
        result -= (excludeForEach - 1) * currentEnds.length + excludeByEnds
    }

    return result
};


// its better by performance but also gets timeout error
const distinctNames3 = ideas => {
    const n = ideas.length
    const ends = {}
    for (let i = 0; i < n; i++) {
        const w = ideas[i], end = w.slice(1)
        const arr = ends[end] || []
        if (!ends[end]) ends[end] = arr, arr.len = 0, arr.min = 25, arr.max = -1
        const code = w.charCodeAt(0) - 97
        arr[code] = true, arr.len++
        arr.min = Math.min(arr.min, code)
        arr.max = Math.max(arr.max, code)
    }
    const groups = Object.values(ends)
    let res = 0
    for (let i = 0; i < groups.length - 1; i++) {
        const g1 = groups[i]
        let validPairs = 0
        for (let j = i + 1; j < groups.length; j++) {
            const g2 = groups[j]
            let matches = 0
            for (let k = Math.max(g1.min, g2.min); k <= Math.min(g1.max, g2.max); k++) {
                if (g1[k] && g2[k]) matches++
            }
            validPairs += (g1.len - matches) * (g2.len - matches)
        }
        res += validPairs
    }
    return res * 2
};
console.log(distinctNames(ideas))
console.log(distinctNames1(ideas))
