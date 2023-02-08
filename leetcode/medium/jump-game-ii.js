// https://leetcode.com/problems/jump-game-ii/description/

// good solution 
// Runtime 68 ms. Beats 84.48%.
// Memory 44.1 MB. Beats 57.71%.
const jump = nums => {
    if (nums.length === 1) return 0
    let jumpI = 0
    let candateI = 0
    let candidateJumpI = 0
    let totalJumps = 0

    for (let i = 0; i < nums.length; i++) {
        const currentJumpI = nums[i] + i
        if (currentJumpI > candidateJumpI) candateI = i, candidateJumpI = currentJumpI
        if (candidateJumpI >= nums.length - 1) break
        if (jumpI === i) {
            jumpI = candidateJumpI
            lastI = candateI
            totalJumps++
        }
    }
    return totalJumps + 1
}

const nums = [2,3,2,1,4]
console.log(jump(nums))