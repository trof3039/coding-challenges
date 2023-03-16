// https://leetcode.com/problems/shuffle-the-array/

// idk why not in top 90%
// Runtime 79 ms. Beats 53.33%. 
// Memory 44.6 MB. Beats 35.37%.
const shuffle = (nums, n) => {
    const res = []
    for (let i = 0; i < n; i++) res.push(nums[i], nums[i + n])
    return res
};


// faster solution
// Runtime 68 ms. Beats 89.31%.
// Memory 44.9 MB. Beats 10.84%.
const shuffle1 = (nums, n) => {
    const res = []
    const secondArr = nums.splice(n, n)
    while (nums.length) res.push(nums.shift(), secondArr.shift()) 
    return res
};


// wtf? why slower then previous solution
// Runtime 79 ms. Beats 53.33%. 
// Memory 44.1 MB. Beats 81.48%.
const shuffle2 = (nums, n) => {
    const secondArr = nums.splice(n, n)
    for (let i = 0; i < n; i++) nums.push(nums.shift(), secondArr.shift()) 
    return nums
};

const nums = [2,5,1,3,4,7], n = 3
console.log(shuffle2(nums, n))