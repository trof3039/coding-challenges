// https://www.codewars.com/kata/52bb6539a4cf1b12d90005b7/

const validateBattlefield = field => {

    const realSumOfCells = field.reduce((sum, line) => sum + line.reduce((a, v) => a + v), 0)
    if (realSumOfCells !== 20) return false

    const myField = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
    let fieldIsValid = true
    let shipsDestroyed = 0
    let cellsDestroyed = 0

    const hasPointShip = point => myField[point[0]][point[1]] === 0 && field[point[0]][point[1]] === 1

    const isPointValid = point => point[0] > -1 && point[0] < 10 && point[1] > -1 && point[1] < 10

    const getNextNoEmptyPoint = (point) => {
        const vertical = point[0]
        const horizontal = point[1]
        const bot = [vertical + 1, horizontal]
        const right = [vertical, horizontal + 1]

        return hasPointShip(bot) ? bot : hasPointShip(right) ? right : null
    }

    const getPointsAround = point => {
        const points = [
            [point[0] - 1, point[1] - 1],
            [point[0] - 1, point[1]],
            [point[0] - 1, point[1] + 1],
            [point[0], point[1] - 1],
            [point[0], point[1] + 1],
            [point[0] + 1, point[1] - 1],
            [point[0] + 1, point[1]],
            [point[0] + 1, point[1] + 1],
        ]
        return points.filter(isPointValid)
    }

    const finalizeShip = ship => ship
        .forEach(point => (
            myField[point[0]][point[1]] = -1,
            getPointsAround(point).forEach(p => myField[p[0]][p[1]] = -1)
        ))

    const destroyShip = startPoint => {
        const ship = [startPoint]

        let currPoint = getNextNoEmptyPoint(startPoint)

        if (currPoint) {
            const direction = startPoint[0] === currPoint[0] ? [0, 1] : [1, 0]

            while (currPoint) {
                ship.push(currPoint)

                const nextPoint = [currPoint[0] + direction[0], currPoint[1] + direction[1]]
                currPoint = hasPointShip(nextPoint) ? nextPoint : null
            }
            if (ship.length > 4) fieldIsValid = false
        }
        shipsDestroyed++
        cellsDestroyed += ship.length
        finalizeShip(ship)
    }

    const doStep = point => {
        if (hasPointShip(point)) destroyShip(point)
        else myField[point[0]][point[1]] = -1
        if (point[0] === 9 && point[1] === 9) return
        if (point[1] === 9) doStep([point[0] + 1, 0])
        else doStep([point[0], point[1] + 1])
    }

    doStep([0, 0])

    return shipsDestroyed === 10 && cellsDestroyed === 20 && fieldIsValid
}