// https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label/

// const n = 7, edges = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], labels = "abaedcd"
// const n = 4, edges = [[0,1],[1,2],[0,3]], labels = "bbbb"
const n = 5, edges = [[0,1],[0,2],[1,3],[0,4]], labels = "aabab"

// Idk why this solution is slow. It uses DFS algorithm and has difficulty O(n)
// Runtime 3143 ms. Beats 33.33%.
// Memory 131.8 MB. Beats 66.67%.
const countSubTrees = (n, edges, labels) => {
    const adjecency = {}
    for (let i = 0; i < n - 1; i ++) {
        const edge = edges[i]
        adjecency[edge[0]] ? adjecency[edge[0]].push(edge[1]) : adjecency[edge[0]] = [edge[1]]
        adjecency[edge[1]] ? adjecency[edge[1]].push(edge[0]) : adjecency[edge[1]] = [edge[0]]
    }

    const result = []
    const dfs = (node, parent) => {
        const childs = adjecency[node]
        const labelsCount = {}
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i]

            if (child === parent && i !== childs.length - 1) continue
            
            if (child !== parent) {
                const childLabelsCount = dfs(child, node)
                for (const key in childLabelsCount) {
                    labelsCount[key] = (labelsCount[key] || 0) + childLabelsCount[key]
                }
            }

            if (i === childs.length - 1) {
                const label = labels[node]
                const labelCount = labelsCount[label] || 0
                labelsCount[label] = labelCount + 1
                result[node] = labelCount + 1
            }
        }
        return labelsCount
    }

    dfs(0, -1)
    return result
};

// it's even slower for some reason
const countSubTrees1 = (n, edges, labels) => {
    const adjecency = {}
    for (let i = 0; i < n - 1; i ++) {
        const edge = edges[i]
        adjecency[edge[0]] ? adjecency[edge[0]].push(edge[1]) : adjecency[edge[0]] = [edge[1]]
        adjecency[edge[1]] ? adjecency[edge[1]].push(edge[0]) : adjecency[edge[1]] = [edge[0]]
    }

    const result = []
    const dfs = (node, parent) => {
        const childs = adjecency[node]
        const labelsCount = {[labels[node]]: 1}
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i]

            if (child === parent) continue

            const childLabelsCount = dfs(child, node)

            for (const key in childLabelsCount) {
                labelsCount[key] = (labelsCount[key] || 0) + childLabelsCount[key]
            }
        }
        result[node] = labelsCount[labels[node]]
        return labelsCount
    }

    dfs(0, -1)
    return result
};

console.log(countSubTrees1(n, edges, labels))