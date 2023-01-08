// https://www.codewars.com/kata/554a44516729e4d80b000012

const nbMonths = (startPriceOld, startPriceNew, savingPerMonth, percentLossByMonth) => {
    let month = 0
    while (savingPerMonth * month < startPriceNew - startPriceOld) {
        month++
        if (month % 2 === 0) percentLossByMonth += 0.5
        startPriceNew = startPriceNew * (100 - percentLossByMonth) / 100
        startPriceOld = startPriceOld * (100 - percentLossByMonth) / 100
    }

    return [month, Math.round(savingPerMonth * month + startPriceOld - startPriceNew)]
}

console.log(nbMonths(2000, 8000, 1000, 1.5))