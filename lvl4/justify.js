// https://www.codewars.com/kata/537e18b6147aa838f600001b

const justify = (text, maxLength) => {
    const getReqNumOfSpaces = (wordIndex, numOfWordsInLine, allWordsLength) => {
        const allSpaces = maxLength - allWordsLength
        const minSpaces = Math.floor(allSpaces / (numOfWordsInLine - 1))
        const maxSpaces = Math.ceil(allSpaces / (numOfWordsInLine - 1))

        if (minSpaces === maxSpaces) return minSpaces

        const wordsWithMaxSpaces = allSpaces - (numOfWordsInLine - 1) * minSpaces

        return wordIndex < wordsWithMaxSpaces ? maxSpaces : minSpaces
    }

    const wordsArr = text.split(' ').filter(w => w !== '' && w !== ' ')

    const linesArr = wordsArr.reduce(
        (acc, word) => {
            acc[acc.length - 1].length === 0 || acc[acc.length - 1].join(' ').length + word.length + 1 <= maxLength
            ? acc[acc.length - 1].push(word)
            : acc.push([word])

            return acc
        }, [[]]
    )

    const linesWithSpaces = linesArr.map((line, index) => {
        const allWordsLength = line.reduce((acc, w) => acc + w.length, 0)

        return line.map(
            (word, i) => 
                i === line.length - 1 ? word 
                : index === linesArr.length - 1 ? word + ' '
                : word.concat(''.padStart(getReqNumOfSpaces(i, line.length, allWordsLength), ' '))
        )
    })

    return linesWithSpaces.reduce(
        (acc, lineArr, i) => acc + lineArr.join(''), i === linesWithSpaces.length - 1 ? '' : '\n'
        , ''
    )
}

const text = "elementum  ligula tempor eget. In quis rhoncus nunc, at aliquet orci. Fusce at dolor sit amet felis' to equal 'elementum  ligula tempor eget. In quis rhoncus nunc, at aliquet orci. Fusce at dolor sit amet felis"
const text2 = 'Lorem  ipsum  dolor  sit amet, consectetur  adipiscing  elit. Vestibulum    sagittis   dolor mauris,  at  elementum  ligula tempor  eget.  In quis rhoncus nunc,  at  aliquet orci. Fusce at   dolor   sit   amet  felis suscipit   tristique.   Nam  a imperdiet   tellus.  Nulla  eu vestibulum    urna.    Vivamus tincidunt  suscipit  enim, nec ultrices   nisi  volutpat  ac. Maecenas   sit   amet  lacinia arcu,  non dictum justo. Donec sed  quam  vel  risus faucibus euismod.  Suspendisse  rhoncus rhoncus  felis  at  fermentum. Donec lorem magna, ultricies a nunc    sit    amet,   blandit fringilla  nunc. In vestibulum velit    ac    felis   rhoncus pellentesque. Mauris at tellus enim.  Aliquam eleifend tempus dapibus. Pellentesque commodo, nisi    sit   amet   hendrerit fringilla,   ante  odio  porta lacus,   ut   elementum  justo nulla         et        dolor.'

const res1 = "Lorem  ipsum  dolor  sit amet,\nconsectetur  adipiscing  elit.\nVestibulum    sagittis   dolor\nmauris,  at  elementum  ligula\ntempor  eget.  In quis rhoncus\nnunc,  at  aliquet orci. Fusce\nat   dolor   sit   amet  felis\nsuscipit   tristique.   Nam  a\nimperdiet   tellus.  Nulla  eu\nvestibulum    urna.    Vivamus\ntincidunt  suscipit  enim, nec\nultrices   nisi  volutpat  ac.\nMaecenas   sit   amet  lacinia\narcu,  non dictum justo. Donec\nsed  quam  vel  risus faucibus\neuismod.  Suspendisse  rhoncus\nrhoncus  felis  at  fermentum.\nDonec lorem magna, ultricies a\nnunc    sit    amet,   blandit\nfringilla  nunc. In vestibulum\nvelit    ac    felis   rhoncus\npellentesque. Mauris at tellus\nenim.  Aliquam eleifend tempus\ndapibus. Pellentesque commodo,\nnisi    sit   amet   hendrerit\nfringilla,   ante  odio  porta\nlacus,   ut   elementum  justo\nnulla         et        dolor." 
const res2 = "Lorem  ipsum  dolor  sit amet,\nconsectetur  adipiscing  elit.\nVestibulum    sagittis   dolor\nmauris,  at  elementum  ligula\ntempor  eget.  In quis rhoncus\nnunc,  at  aliquet orci. Fusce\nat   dolor   sit   amet  felis\nsuscipit   tristique.   Nam  a\nimperdiet   tellus.  Nulla  eu\nvestibulum    urna.    Vivamus\ntincidunt  suscipit  enim, nec\nultrices   nisi  volutpat  ac.\nMaecenas   sit   amet  lacinia\narcu,  non dictum justo. Donec\nsed  quam  vel  risus faucibus\neuismod.  Suspendisse  rhoncus\nrhoncus  felis  at  fermentum.\nDonec lorem magna, ultricies a\nnunc    sit    amet,   blandit\nfringilla  nunc. In vestibulum\nvelit    ac    felis   rhoncus\npellentesque. Mauris at tellus\nenim.  Aliquam eleifend tempus\ndapibus. Pellentesque commodo,\nnisi    sit   amet   hendrerit\nfringilla,   ante  odio  porta\nlacus,   ut   elementum  justo\nnulla et dolor."
console.log(justify(text2, 30))


// old bad solution
// const justify = (str, len) => {
//     const baseArray = str
//         .split(' ')
//         .filter(w => w!== '' && w !== ' ')

//     const getArrLength = array => array.reduce((acc, w) => w === '' ? acc : acc + 1, 0)

//     const getLineEndIndex = (array, index) => {
//         const indexToSlice = array.reduce(
//             (acc, w, i) => 
//                 Number.isInteger(acc[0]) ? acc 
//                 : [w].concat(acc).length <= len && i !== array.length - 1 ? [w].concat(acc) 
//                 : [w].concat(acc).length <= len && i === array.length - 1 ? [i].concat([w], acc) 
//                 : [i].concat(acc)
//             , []
//         )[0]

//       const nextArray = array.map((word, i) => i < indexToSlice ? '' : word)

//       return index < indexToSlice ? indexToSlice - 1 
//         : index === indexToSlice && index === array.length - 1 ? indexToSlice 
//         : getLineEndIndex(nextArray, index)
//     }

//     const getLine = (lastIndex) => baseArray
//         .slice()
//         .reverse()
//         .reduce(
//             (newArr, word, i) => 
//                 i >= baseArray.length - lastIndex - 1 && [word].concat(newArr).length < len ? [word].concat(newArr) : newArr,[]
//         )

//     const arrayOfLineArrays = baseArray
//         .map((_, index) => index === getLineEndIndex(baseArray, index) ? getLine(index) : '')
//         .filter(word => word !== '')

//     const fillLineWithSpaces = line => {
//         if (line.length === 1) return line

//         const lineWithSpaces = line.map((word, index) => index < len - line.length && index !== line.length - 1 ? word + ' ' : word)

//         return lineWithSpaces.length === len ? lineWithSpaces : fillLineWithSpaces(lineWithSpaces)
//     }

//     const arrayOfStringArrays = arrayOfLineArrays.map((line, index) => index === arrayOfLineArrays.length - 1 ? line : fillLineWithSpaces(line))
//     const arrayOfStrings = arrayOfStringArrays.map((line, i, a) => line.join(' ') + (i === a.length - 1 ? '' : '\n'))
//     console.log(arrayOfLineArrays)
//     console.log(arrayOfStringArrays)
//     console.log(arrayOfStrings)
//     return arrayOfStrings.join('')
// }