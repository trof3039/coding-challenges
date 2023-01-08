// https://www.codewars.com/kata/5b86a6d7a4dcc13cd900000b

const mazeSolver = arr => {
    const beginning = [
        arr.findIndex(l => l.find(c => c === 'B')), 
        arr[arr.findIndex(l => l.find(c => c === 'B'))].findIndex(e => e === 'B')
    ]

    const ending = [
        arr.findIndex(l => l.find(c => c === 'X')), 
        arr[arr.findIndex(l => l.find(c => c === 'X'))].findIndex(e => e === 'X')
    ]

    const dirs = ['N', 'W', 'S', 'E']

    const getWalls = num => Number(num).toString(2).padStart(4, '0').split('').map(v => +v)    
    const arePointsEqual = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1]
    const getCell = (point) => field[point[0]][point[1]]
    const getRotatedCell = ceil => ceil.concat(ceil[0]).slice(1)
    const getRotatedField = field => field.map(line => line.map(v => Array.isArray(v) ? getRotatedCell(v) : v))

    const getNearCellsIndices = point => [
        [point[0] + 1, point[1]],
        [point[0] - 1, point[1]],
        [point[0], point[1] + 1],
        [point[0], point[1] - 1],
    ].filter(p => p[0] > -1 && p[0] < arr.length && p[1] > -1 && p[1] < arr.length)

    const getDirection = (start, end) => start[0] === end[0] + 1 ? 'N'
        : start[1] === end[1] + 1 ? 'W'
        : start[0] === end[0] -1  ? 'S'
        : start[1] === end[1] - 1 ? 'E'
        : null 

    const isPathFree = (start, end) => {
        const sVal = getCell(start)
        const eVal = getCell(end)
        const dir = getDirection(start, end)

        const res = dir === 'N' ? sVal[0] + eVal[2] === 0
        : dir === 'W' ?  sVal[1] + eVal[3] === 0
        : dir === 'S' ?  sVal[2] + eVal[0] === 0
        : dir === 'E' ?  sVal[3] + eVal[1] === 0
        : null

        return res
    }

    const isPointAlreadyReached = (point, step) => !!allReachedPoints.find(item => arePointsEqual(item.point, point) && item.step <= step )

    const getNextSteps = (point, step) => getNearCellsIndices(point)
        .filter(p => isPathFree(point, p) && !isPointAlreadyReached(p, step))
        .map(p => ({ dir: getDirection(point, p), point: p }))
        .concat({dir: '', point})

    // path: [{ path: 'nnw', start: [0, 0], end: [0, 0], ended: false}]
    const getPaths = (point, step, paths) => {
        if(!paths) {
            const nextSteps = getNextSteps(point, step)

            nextSteps.forEach(move => allReachedPoints.push({ point: move.point, step }))

            const paths = nextSteps.map(step => ({ path: step.dir, start: point, end: step.point, ended: false }))
            return getPaths(point, step, paths)
        }

        if (paths.filter(path => !path.ended).length === 0) {
            return paths
        }

        const newPaths = paths
            .map(path => {
                if (path.ended) return [path]
                path.ended = true

                const nextSteps = getNextSteps(path.end, step)

                if (!nextSteps.length) return [path]

                nextSteps.forEach(move => allReachedPoints.push({ point: move.point, step }))

                return [path, ...nextSteps.map(step => ({
                    path: path.path + step.dir,
                    start: path.start,
                    end: step.point,
                    ended: false
                }))]
            })
            .reduce((acc, arr) => [...acc, ...arr], [])

        return getPaths(point, step, newPaths)
    }

    let totalSteps = 0
    // [{ steps: ['ww', 'wee'], end: [2, 3], lastStep: 1 }]
    const solveGame = (step, paths) => {
        if (!paths) {
            const paths = getPaths(beginning, step)
            totalSteps++
            field = getRotatedField(field)
            return solveGame(step + 1, paths.map(p => ({ steps: [p.path], end: p.end, lastStep: step })))
        }

        
        const newPaths = paths.reduce(
            (acc, path) => {
                const additionalPaths = getPaths(path.end, step)
                const formattedPaths = additionalPaths.map(p => ({ steps: [...path.steps, p.path], end: p.end, lastStep: step }))
                return [...acc, ...formattedPaths, path]
            },
            []
        )

        const end = newPaths.reduce((acc, path) => arePointsEqual(ending, path.end) && (!acc || acc.lastStep > path.lastStep) ? path : acc, null)
        
        if (end) return end.steps

        if (totalSteps > 100) return null
        totalSteps++
        field = getRotatedField(field)

        return solveGame(step + 1, newPaths)
    }

    const allReachedPoints = [{ point: beginning, step: 0 }]
    let field = arr.map(line => line.map(v => v === 'X' || v === 'B' ? getWalls(0) : getWalls(v)))
    return solveGame(0)
}

let example = [
    [  4,  2,  5,  4],
    [  4, 15, 11,  1],
    ['B',  9,  6,  8],
    [ 12,  7,  7,'X']
];

let e2 = [
    [6, 3, 0, 9, 14, 13, 14], 
    ['B', 14, 9, 11, 15, 14, 15], 
    [2, 15, 0, 12, 6, 15, 'X'], 
    [4, 10, 7, 6, 15, 5, 3], 
    [7, 3, 13, 13, 14, 7, 0]
]

const example_tests = [
    [
        [4,2,5,4],
        [4,15,11,1],
        ['B',9,6,8],
        [12,7,7,'X']
    ],
    [
        [6,3,10,4,11],
        [8,10,4,8,5],
        ['B',14,11,3,'X'],
        [15,3,4,14,15],
        [14,7,15,5,5]
    ],
    [
        [9,1,9,0,13,0],
        [14,1,11,2,11,4],
        ['B',2,11,0,0,15],
        [4,3,9,6,3,'X']
    ],
    [
        ['B',6,12,15,11],
        [8,7,15,7,10],
        [13,7,13,15,'X'],
        [11,10,8,1,3],
        [12,6,9,14,7]
    ],
    [
        [6,3,0,9,14,13,14],
        ['B',14,9,11,15,14,15],
        [2,15,0,12,6,15,'X'],
        [4,10,7,6,15,5,3],
        [7,3,13,13,14,7,0]
    ]
];

// дописать проверку "4 хода назад"

console.log(mazeSolver(example_tests[3]))