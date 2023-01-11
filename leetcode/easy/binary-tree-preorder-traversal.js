// https://leetcode.com/problems/binary-tree-preorder-traversal

// Runtime 52 ms. Beats 98.99%.
// Memory 42.4 MB. Beats 29.3%.

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */

const preorderTraversal = root => {
    const result = []
    const stack = []
    
    if (root === null) {
        return result;
    }
    
    stack.push(root);
    while (stack.length) {
        const node = stack.pop();
        result.push(node.val);
        
        if (node.right != null) {
            stack.push(node.right);
        }
        if (node.left != null) {
            stack.push(node.left);
        }
    }

    return result;
};
