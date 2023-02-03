// https://leetcode.com/problems/median-of-two-sorted-arrays/

// solution with using just js sort
// Runtime 99 ms. Beats 90.98%.
// Memory 48 MB. Beats 37.4%.
const findMedianSortedArrays = (nums1, nums2) => {
    const sorted = [...nums1, ...nums2].sort((a, b) => a - b)
    return sorted.length%2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2] + sorted[sorted.length/ 2 - 1]) / 2
};

const nums1 = [1,2], nums2 = [3,4]
console.log(findMedianSortedArrays(nums1, nums2))