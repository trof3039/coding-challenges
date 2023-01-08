// https://leetcode.com/problems/gas-station/

// Runtime
// 78 ms
// Beats
// 89.82%

// Memory
// 50.1 MB
// Beats
// 84.11%

const gas = [1,2,3,4,5]
const cost = [3,4,5,1,2]
const gas1 = [2,3,4]
const cost1 = [3,4,3]

const canCompleteCircuit = (gas, cost) => {
    let start = 0, end = 0,  g = gas[start]
    for (let i = 0; i < gas.length; i++) {
        if (g - cost[end] < 0) {
            start = start === 0 ? gas.length - 1 : start - 1
            g += gas[start] - cost[start]
        } else g += gas[end + 1] - cost[end], end++
    }
    return g - gas[start] < 0 ? -1 : start
};


console.log(canCompleteCircuit(gas, cost))
console.log(canCompleteCircuit(gas1, cost1))
