// https://www.codewars.com/kata/52742f58faf5485cae000b9a/train/javascript


const formatDuration = second => {
    const m = 60
    const h = m*60
    const d = h*24
    const y = d*365

    const year = Math.trunc(second/y)
    second -= year*y
    const day = Math.trunc(second/d)
    second -= day*d
    const hour = Math.trunc(second/h)
    second -= hour*h
    const minute = Math.trunc(second/m)
    second -= minute*m
    
    const data = [
        [`year${year > 1 ? 's' : ''}`, year],
        [`day${day > 1 ? 's' : ''}`, day],
        [`hour${hour > 1 ? 's' : ''}`, hour],
        [`minute${minute > 1 ? 's' : ''}`, minute],
        [`second${second > 1 ? 's' : ''}`, second],
    ].filter(arr => arr[1] > 0)

    if (data.length === 0) return 'now'
    if (data.length === 1) return `${data[0][1]} ${data[0][0]}`
    return data.reduce((
        (acc, val, i) => 
            i === 0 ? `${val[1]} ${val[0]}` 
            : i === data.length - 1 ? acc.concat(` and ${val[1]} ${val[0]}`)
            : acc.concat(`, ${val[1]} ${val[0]}`)
        ), ''
    )
}

console.log(formatDuration(1))