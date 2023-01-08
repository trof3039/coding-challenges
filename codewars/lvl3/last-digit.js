// https://www.codewars.com/kata/5518a860a73e708c0a00002

const lastDigit = numbersArr => {
    const getLastDigit = (digitToPower, remainderOfPowerDividedBy4) => {
        if (
            digitToPower === 0
            ||
            digitToPower === 1
            ||
            digitToPower === 5
            ||
            digitToPower === 6
            ) return digitToPower

        const reminder = remainderOfPowerDividedBy4
        if (digitToPower === 4) return reminder % 2 === 0 ? 6 : 4
        if (digitToPower === 9) return reminder % 2 === 0 ? 1 : 9

        if (digitToPower === 2) return reminder === 0 ? 6
        : reminder === 1 ? 2
        : reminder === 2 ? 4
        : 8

        if (digitToPower === 3) return reminder === 0 ? 1
        : reminder === 1 ? 3
        : reminder === 2 ? 9
        : 7

        if (digitToPower === 7) return reminder === 0 ? 1
        : reminder === 1 ? 7
        : reminder === 2 ? 9
        : 3

        if (digitToPower === 8) return reminder === 0 ? 6
        : reminder === 1 ? 8
        : reminder === 2 ? 4
        : 2
    }

    const isPenultimateDigitEvenAfterPow = (digit, isPenEven, prevDigit, isPrevPenEven) => {
        if (digit === 0) return true
        if (digit === 6) return false
        if (digit % 2 === 1) return isPenEven || prevDigit % 2 === 0

        const reminder = ((isPrevPenEven ? 0 : 10) + prevDigit) % 4
        if (digit === 2) return reminder === 2 || reminder === 3
        if (digit === 4) return reminder % 2 === 1
        if (digit === 8) return reminder === 1 || reminder === 2
    }

    const isPenultimateDigitEven = number => (number % 100 - number % 10) % 20 === 0

    const getNextPair = (number, lastPowDigit, isPowPenEven) => [
        getLastDigit(number % 10, ((isPowPenEven ? 0 : 10) + lastPowDigit) % 4),
        isPenultimateDigitEvenAfterPow(number % 10, isPenultimateDigitEven(number), lastPowDigit, isPowPenEven),
    ]

    const getIndexOf2Zeros = arr => arr.findIndex((num, i) => num === 0 && arr[i + 1] === 0 && arr[i + 2] !== 0)

    const makeArrayEasier = arr => {
        let indexOf2Zeros = getIndexOf2Zeros(arr)
        while (indexOf2Zeros !== -1) {
            arr.splice(indexOf2Zeros)
            arr.push(1)
            indexOf2Zeros = getIndexOf2Zeros(arr)
        }

        const indexOfZero = arr.findIndex(num => num === 0)
        
        if (indexOfZero === 0) return arr = [0]
        if (indexOfZero !== -1) arr.splice(indexOfZero - 1, Infinity, 1)

        const indexOfOne = arr.findIndex(num => num === 1)
        if (indexOfOne !== -1) arr.splice(indexOfOne)

        while(arr[arr.length - 1] < 10 && arr[arr.length - 2] < 100 && arr.length > 1) {
            arr[arr.length - 2] = arr[arr.length - 2] ** arr.pop()
        }

        return arr
    }

    makeArrayEasier(numbersArr)

    if (numbersArr.length === 0) return 1
    if (numbersArr.length === 1) return numbersArr[0] % 10

    const lastPair = numbersArr
        .reverse()
        .reduce(
            (acc, num) => typeof acc === 'number' 
                ? getNextPair(num, acc % 10, isPenultimateDigitEven(acc))
                : getNextPair(num, acc[0], acc[1])
        )

    return lastPair[0]
}

console.log(lastDigit([2,0,1,1,1,1,2,2,2]));
console.log(lastDigit([]         ), 1);
console.log(lastDigit([0,0]      ), 1); 
console.log(lastDigit([0,0,0]    ), 0);
console.log(lastDigit([1,2]      ), 1);
console.log(lastDigit([3,4,5]    ), 1);
console.log(lastDigit([4,3,6]    ), 4);
console.log(lastDigit([7,6,21]   ), 1);
console.log(lastDigit([12,30,21] ), 6);
console.log(lastDigit([2,2,2,0]  ), 4);
console.log(lastDigit([0,0,2,2,2,2,2]), 1);
console.log(lastDigit([937640,767456,981242]), 0);
console.log(lastDigit([123232,694022,140249]), 6);
console.log(lastDigit([499942,898102,846073]), 6);



// too slow
// const lastDigit = as => {
//     if (as[0] === undefined) return 1

//     const b100 = BigInt(100)
//     const lastPower = Number(as
//         .reverse()
//         .reduce(
//             (acc, number, index) => 
//                 index !== as.length - 1
//                 ? ((BigInt(number) % b100) ** acc) % b100 
//                 : acc
//             , BigInt(1)
//         )
//     )

//     const getNumberAfterPower = (number, power) => {
//         if (power === 0) return 1

//         const lastNumber = number%10


//         switch (lastNumber) {
//             case 0: return 0
//             case 1: return 1
//             case 2: switch ((power - 1) % 4) {
//                 case 0: return 2
//                 case 1: return 4
//                 case 2: return 8
//                 case 3: return 6
//             }
//             case 3: switch ((power - 1) % 4) {
//                 case 0: return 3
//                 case 1: return 9
//                 case 2: return 7
//                 case 3: return 1
//             }
//             case 4: switch ((power - 1) % 2) {
//                 case 0: return 4
//                 case 1: return 6
//             }
//             case 5: return 5
//             case 6: return 6
//             case 7: switch ((power - 1) % 4) {
//                 case 0: return 7
//                 case 1: return 9
//                 case 2: return 3
//                 case 3: return 1
//             }
//             case 8: switch ((power - 1) % 4) {
//                 case 0: return 8
//                 case 1: return 4
//                 case 2: return 2
//                 case 3: return 6
//             }
//             case 9: switch ((power - 1) % 2) {
//                 case 0: return 9
//                 case 1: return 1
//             }
//         }
//     }

//     return getNumberAfterPower(as[0], lastPower)
// }