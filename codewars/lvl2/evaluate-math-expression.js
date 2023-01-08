// https://www.codewars.com/kata/52a78825cdfc2cfc87000005/train/javascript

const calc = (expressionString) => {
    const symbols = expressionString.split('').filter(item => item !== ' ')

    const regExpSign = /[*\-+\/]$/

    const getMatchForOpenBracket = (array, bracketIndex)  => {
        const nextCloseBracketsIndices = array.reduce((
            (acc, s, i) => i <= bracketIndex || s !== ')' ? acc : [...acc, i]
        ), [])

        const nextOpenBracketsIndices = array.reduce((
            (acc, s, i) => i <= bracketIndex || s !== '(' ? acc : [...acc, i]
        ), [])

        return nextCloseBracketsIndices.filter((cBracketIndex, i) => nextOpenBracketsIndices[i] > cBracketIndex || !nextOpenBracketsIndices[i])[0]
    }

    const getFlattenedResult = (arr) => arr.reduce(((acc, v) => acc.concat(Array.isArray(v) ? getFlattenedResult(v) : v)), [])

    const getSubArrays = arr => {
        const result = arr.reduce((
            (acc, s, i) => i < acc.nextPos ? acc 
                : Array.isArray(s) ? (acc.nextPos += 1, acc.v.push(getSubArrays(s)), acc)
                : s !== '(' ? (acc.nextPos += 1, acc.v.push(s), acc)
                : (acc.nextPos = getMatchForOpenBracket(arr, i) + 1, acc.v.push(arr.slice(i + 1, getMatchForOpenBracket(arr, i))), acc)
            )
            , { nextPos: 0, v: [] }
        )

        return getFlattenedResult(result.v, Infinity).includes('(') ? getSubArrays(result.v) : result.v
    }

    const joinNumbers = arr => arr.reduce((
        (acc, s, i) => 
            i === 0 ? [s]
            : String(arr[i - 1]).match(regExpSign) || String(s).match(regExpSign) ? [...acc, String(s)]
            : (acc[acc.length - 1] = acc[acc.length - 1].concat(s), acc)
    ), [])

    const joinMinuses = arr => arr
        .reduce((
            (acc, v, i) => 
                (v !== '-' && (v.match(regExpSign) || acc[acc.length - 1] === arr[i - 1]))
                || 
                (v === '-' && i !== 0 && !arr[i - 1].match(regExpSign)) ? [...acc, v]
                : v === '-' ? [...acc, v.concat(arr[i + 1])]
                : acc
            ), []
        ).map(v => v.indexOf('--') !== -1 ? v.substr(2) : v)

    const performMultiplyingAndDivision = arr => arr.reduce((
        (acc, v, i) => i === 0 ? [v]
            : v === '*' ? (acc[acc.length - 1] *= arr[i + 1], acc)
            : v === '/' ? (acc[acc.length - 1] /= arr[i + 1], acc)
            : acc[acc.length - 1] == arr[i - 1] || v === '-' || v === '+' ? [...acc, v]
            : acc
        ), []
    )

    const performAddition = arr => String(arr.map(v => v === '-' || v === '+' ? v : +v).reduce(
        (acc, v, i, newArr) => 
            v === '-' ? acc -= newArr[i + 1]
            : v === '+' ? acc += newArr[i + 1]
            : acc
    ))

    const calculateArray = arr => performAddition(performMultiplyingAndDivision(joinMinuses(joinNumbers(arr))))

    const calculateNestedArrays = arr => calculateArray(arr.reduce((
        (acc, v) => 
            !Array.isArray(v) ? [...acc, v]
            : v.find(a => Array.isArray(a)) ? [...acc, calculateNestedArrays(v)]
            : [...acc, calculateArray(v)]
        ), []
    ))

    return +calculateNestedArrays(getSubArrays(symbols))
};

const str = '(2 / (2 + 3) * 4.33 + 5*(3 - 2*(15 - 2*5 - 3.5)))- -6'
const str2 = '12* 123/-(-5 + 2)'
const str3 = '(123.45 * (678.90 / (-2.5+ 11.5) - (80 - 19) * 33.25) / 20) - (123.45 * (678.90 / (-2.5 + 11.5)-(((80 - 19)) * 33.25)) / 20) + (13 - 2)/ -(-11)'

// ['1', '5', '-', '2', '*', '5', '-', '3', '.', '5']
calc(str)
calc(str2)
console.log(calc(str3))
