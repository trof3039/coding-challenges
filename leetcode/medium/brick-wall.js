// https://leetcode.com/problems/brick-wall


// very old ugly solution from when I started learning JS
const leastBricks = (wall) => {
    const lineLength = wall[0].reduce((acum, brick) => acum + brick)
    const gaps = wall.map(line => line.reduce(
        (acc, brickLength) => 
            acc.length === 0 ? [brickLength] :
            acc.concat(brickLength + acc[acc.length - 1])
        ,[]
    ))
    .map(item => item.filter(pos => pos !== lineLength))
    const allPositions = Array.from(new Set(gaps.reduce((positions, posInLine) => positions.concat(posInLine))))

    if (allPositions.length === 0) return wall.length

    const allLinesCrossings = allPositions.map(position => [
        position, 
        gaps.reduce(
            (numOfCrossings, line) => 
                line.indexOf(position) === -1 || line.length === 0 ? 
                numOfCrossings + 1 : 
                numOfCrossings
            , 0
        )
    ])

    return allLinesCrossings.reduce(
        (minCrossings, line) => 
            minCrossings === -1 ? line[1] :
            minCrossings > line[1] ? line[1] :
            minCrossings
        , -1
    )
}