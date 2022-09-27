// https://www.codewars.com/kata/534e01fbbb17187c7e0000c6/

const spiralize = n => {
    const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => 0))

    const dirs = {
        right: [0, 1],
        left: [0, -1],
        down: [1, 0],
        up: [-1, 0],
    }

    const direction = {
        curr: dirs.right,
        change: () => {
            if (isEqual(direction.curr, dirs.right)) return direction.curr = dirs.down
            if (isEqual(direction.curr, dirs.down)) return direction.curr = dirs.left
            if (isEqual(direction.curr, dirs.left)) return direction.curr = dirs.up
            if (isEqual(direction.curr, dirs.up)) return direction.curr = dirs.right
        },
        nextPoint: (currPoint) => currPoint.map((n, i) => n + direction.curr[i])
    }

    const isValid = point => point[0] > -1 && point[0] < n && point[1] > -1 && point[1] < n
    const isEqual = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1]
    const getValue = point => matrix[point[0]][point[1]]
    const setValue = (point, value) => matrix[point[0]][point[1]] = value

    const getPointsAround = point => {
        const points = [
            [point[0] - 1, point[1]],
            [point[0] + 1, point[1]],
            [point[0], point[1] - 1],
            [point[0], point[1] + 1],
        ]
        return points.filter(isValid)
    }

    const isAvailable = (prevPoint, point) => getPointsAround(point).reduce(
        (res, p) =>
            res ? getValue(p) === 0 || isEqual(p, prevPoint) : res
        , true
    )

    const doStep = (point = [0, 0]) => {
        setValue(point, 1)
        let nextPoint = direction.nextPoint(point)

        if (!isValid(nextPoint) || !isAvailable(point, nextPoint)) {
            direction.change()
            nextPoint = direction.nextPoint(point)

            if (!isAvailable(point, nextPoint)) return
        }

        if (isAvailable(point, nextPoint)) {
            doStep(nextPoint)
        }
        return
    }

    doStep()

    return matrix
}

console.log(spiralize(5))