// https://www.codewars.com/kata/550f22f4d758534c1100025a

const dirReduc = arr => {
    const isBad = (dir1, dir2) => {
        if (dir1 === 'NORTH') return dir2 === 'SOUTH'
        if (dir1 === 'SOUTH') return dir2 === 'NORTH'
        if (dir1 === 'WEST') return dir2 === 'EAST'
        if (dir1 === 'EAST') return dir2 === 'WEST'
    }
    let i = 0
    while (arr[i]) {
        if (isBad(arr[i], arr[i + 1])) {
            arr.splice(i, 2)
            if (i !== 0) i--
            continue
        }
        i++
    }

    return arr
}



console.log(dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]))
console.log(dirReduc([ 'NORTH', 'WEST', 'SOUTH', 'EAST' ]))

// const dirReduc = arr => {
//     const result = {
//         vertical: 0,
//         horizontal: 0
//     }

//     arr.forEach(dir => dir === 'NORTH' ? result.vertical++ 
//         : dir === 'SOUTH' ? result.vertical--
//         : dir === 'WEST' ? result.horizontal--
//         : result.horizontal++ 
//     )

//     return arr.reduce(
//         (acc, dir) => {
//             if (dir === 'NORTH' && result.vertical > 0) {
//                 result.vertical--
//                 acc.push(dir)
//             }

//             if (dir === 'SOUTH' && result.vertical < 0) {
//                 result.vertical++
//                 acc.push(dir)
//             }

//             if (dir === 'WEST' && result.horizontal < 0) {
//                 result.horizontal++
//                 acc.push(dir)
//             }

//             if (dir === 'EAST' && result.vertical > 0) {
//                 result.horizontal--
//                 acc.push(dir)
//             }

//             return acc
//         }
//         , []
//     )
// }