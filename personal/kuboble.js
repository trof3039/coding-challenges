// https://www.kuboble.com

const DIRECTIONS = {
    DOWN: 'down',
    UP: 'up',
    RIGTH: 'rigth',
    LEFT: 'left'
}

class Field {
    constructor(field) {
        this.field = field;
    }

    /**
     * 
     * @param {Array<Number>} square
     * @param {Array<Array<Number>>} position
     */
    isSquareAvailable(square, position) {
        const alreadyHasBall = position.some(ball => ball[0] === square[0] && ball[1] === square[1])
        if (alreadyHasBall) return false
        return this.field[square[0]] && this.field[square[0]][square[1]]
    }

    /**
     * 
     * @param {Array<Array<Number>>} position - indecies of balls
     * @param {Number} ballIndex - index (in posiotion array) of ball to move 
     * @param {string} direction - moving direction
     */
    getMove(position, ballIndex, direction) {
        const move = position[ballIndex].slice()

        movingCycle:
        while (true) {
            switch (direction) {
                case DIRECTIONS.DOWN:
                    if (this.isSquareAvailable([move[0] + 1, move[1]], position)) move[0]++
                    else break movingCycle;
                    break;

                case DIRECTIONS.UP:
                    if (this.isSquareAvailable([move[0] - 1, move[1]], position)) move[0]--
                    else break movingCycle;
                    break;

                case DIRECTIONS.RIGTH:
                    if (this.isSquareAvailable([move[0], move[1] + 1], position)) move[1]++
                    else break movingCycle;
                    break;

                case DIRECTIONS.LEFT:
                    if (this.isSquareAvailable([move[0], move[1] - 1], position)) move[1]--
                    else break movingCycle;
                    break;

                default:
                    throw new Error('Wrong direction')
            }
        }

        if (move[0] === position[ballIndex][0] && move[1] === position[ballIndex][1]) return null
        else return move
    }
}

class Solution {
    constructor(moves, position, field) {
        this.moves = JSON.parse(JSON.stringify(moves))
        this.position = JSON.parse(JSON.stringify(position))
        this.field = field
        this.isFinal = false
    }

    getPossibleMoves() {
        const possibleMoves = []
        this.position.forEach((_, index) => {
            const movesForBall = [
                this.field.getMove(this.position, index, DIRECTIONS.DOWN),
                this.field.getMove(this.position, index, DIRECTIONS.UP),
                this.field.getMove(this.position, index, DIRECTIONS.RIGTH),
                this.field.getMove(this.position, index, DIRECTIONS.LEFT)
            ]
            possibleMoves.push(...movesForBall.filter(b => !!b).map(move => [this.position[index], move]))
        })

        return possibleMoves
    }

    doMove(move) {
        this.moves.push(move)

        const start = move[0]
        const end = move[1]
        const ballToMoveIndex = this.position.findIndex(ball => ball[0] === start[0] && ball[1] === start[1])
        this.position[ballToMoveIndex] = end
    }

    finalize(goal) {
        if (!goal.some((ball, index) => ball[0] !== this.position[index][0] || ball[1] !== this.position[index][1])) this.isFinal = true
    }
}

class Solver {
    constructor(field, startingPosition, endingPosition) {
        this.field = new Field(field)
        this.startingPosition = startingPosition
        this.endingPosition = endingPosition
        this.reachedPositions = [{position: startingPosition, step: 0}]
    }

    getPosition(position) {
        return this.reachedPositions.reduce((acc, reached) => {
            if (acc) return acc

            const hasDifference = reached.position.some((ball, index) => position[index][0] !== ball[0] || position[index][1] !== ball[1])

            return !hasDifference ? reached.position : null
        }, null)
    }

    addPosition(position, step) {
        this.reachedPositions.push({position, step})
    }
    getNextStepSolutions(solutions) {
        return solutions.reduce(
            (acc, solution) => {
                if (solution.isFinal) return [...acc, solution]

                const moves = solution.getPossibleMoves()
                const currNewSolutions = moves.map(move => {
                    const sol = new Solution(solution.moves, solution.position, solution.field)
                    sol.doMove(move)
                    sol.finalize(this.endingPosition)
                    const existingPosition = this.getPosition(sol.position)

                    if (existingPosition) return null
                    else this.addPosition(sol.position, sol.moves.length)

                    return sol
                })
                return [...acc, ...currNewSolutions.filter(s => !!s)]
            }
            , []
        )
    }

    getSolutions(maxSteps = 1) {
        let solutions = [new Solution([], this.startingPosition, this.field)]
        
        for (let i = 1; i <= maxSteps; i++) solutions = this.getNextStepSolutions(solutions)
        
        return solutions.filter(solution => solution.isFinal).map(solution => solution.moves)
    }
}

const decodeInput = string => {
    const validSymbolds = ['A', 'a', 'B', 'b', 'C', 'c', 'X', '.'];
    [,,, maxSteps, rawBoard] = string.trim().split(',')
    const board = rawBoard.trim().split(';')
    const startingPosition = []
    const endingPosition = []
    const field = board.map((rawLine, y) => rawLine.trim().split(' ').map((sym, x) => {
        if (sym === 'A' || sym[0] === 'A' || sym[1] === 'A') startingPosition[0] = [y, x]
        if (sym === 'a' || sym[0] === 'a' || sym[1] === 'a') endingPosition[0] = [y, x]
        if (sym === 'B' || sym[0] === 'B' || sym[1] === 'B') startingPosition[1] = [y, x]
        if (sym === 'b' || sym[0] === 'b' || sym[1] === 'b') endingPosition[1] = [y, x]
        if (sym === 'C' || sym[0] === 'C' || sym[1] === 'C') startingPosition[2] = [y, x]
        if (sym === 'c' || sym[0] === 'c' || sym[1] === 'c') endingPosition[2] = [y, x]

        if (
            sym.length === 1 && !validSymbolds.includes(sym)
            ||
            sym.length === 2 && (!validSymbolds.includes(sym[0]) || !validSymbolds.includes(sym[1]))
        ) throw new Error(`Invalid input. Unknown symbol <${sym}>.`)

        return sym !== 'X'
    }))

    if (field.length < 1 || field.find(line => line.length !== field[0].length)) throw new Error(`Invalid Input. The field is not square.`)
    if (Number.isNaN(+maxSteps)) throw new Error(`Invalid Input. Max steps is not a number.`)
 
    return {field, startingPosition, endingPosition, maxSteps: +maxSteps}
}

const convertSolution = (solution, startingPosition, level) => {
    let currGreen = startingPosition[0]
    let currOrange = startingPosition[1]
    let currBlue = startingPosition[2]

    let text = `Solution for the level ${level} by ${solution.length} step${solution.length > 1 ? 's' : ''}.`
    solution.forEach(([start, end], index) => {
        let color
        if (currGreen[0] === start[0] && currGreen[1] === start[1]) color = 'green', currGreen = end
        if (currOrange[0] === start[0] && currOrange[1] === start[1]) color = 'orange', currOrange = end
        if (currBlue && currBlue[0] === start[0] && currBlue[1] === start[1]) color = 'blue', currBlue = end

        let direction
        if (start[0] === end[0]) direction = start[1] > end[1] ? 'left' : 'right'
        if (start[1] === end[1]) direction = start[0] > end[0] ? 'up' : 'down'

        text = text.concat(`\nStep ${index + 1}: move ${color} ${direction}`)
    })
    return text
}

const rawProblems = `17a96e3cd1e5c029809e5ada508deeb3f913b6008c92ba44cb28ae54081525a5,2 pieces,Level 1,5,A B . ;. . . ;b a . 
78800281ac875e1dd805da09b4f7779b7860072e791aa880558a44e9a5e73460,2 pieces,Level 2,6,A B a ;. X . ;. b . 
143dc74b7d453363da5abb39d3b9a24dce2123ae3ed2817f46aa289e2c82951b,2 pieces,Level 3,7,A B . ;a b . ;X . . 
72d9f23e946d36d3c643cd7506399aa2f19ac2876916f1360fe88f7321f5b91b,2 pieces,Level 4,7,A B . ;. a b ;X . . 
43b9ad2f8db29998c2b0cd5ff4dd7a4e003019df7a454d72fc766a504882003e,2 pieces,Level 5,5,X . B A ;a . . . ;X b . . 
1c5c07e950bd9e1c807270315c2cf1142b08a6f03654c1951c6af5d0ff7f37d3,2 pieces,Level 6,7,X a X . ;X b . . ;. . B A 
b176a72816c0b4ac662029c058998f99456d2d297e956cdce48b907d51271f67,2 pieces,Level 7,7,X X B A ;a . b . ;X . . . 
c0bae89c5340cbd03008bb2bebf5dd499176e49a273754c3ba3afa0ace11dc1a,2 pieces,Level 8,7,a X B A ;. . b . ;. . . . 
e5712cbfcf61fee6c7beee97cfbdecafcfcd7bdb3dcec8206e8f00037737eeba,2 pieces,Level 9,7,X . B A ;X . b X ;a . . . 
1471a045b68b45f6f5266bf19e679fa905e17acc69fe4861b4995c0658dbe78b,2 pieces,Level 10,8,X . X b ;. a . . ;X . B A 
543abaaa142ed8f56104221cf8d3ced2bfe2a25e9d59f306419d069a32fc367d,2 pieces,Level 11,8,X . . X ;. a b . ;X . B A 
a703420a4aa2c86b88e7d72af5e54cc8617344a71739ad1024e34b9fbd99beae,2 pieces,Level 12,8,A aB . . ;X . . . ;. . b . 
cd6a86a0cdd0a85466636d3369be7f9c0ce14276e0515a2eda4b2aefca70d4d0,2 pieces,Level 13,8,X . aB A ;X X . . ;. b . . 
23e5ddac5badee2d2a292581fd782e84e20b3bf84b9b7c060baa9669f2574a30,2 pieces,Level 14,9,X . . X ;. b a . ;. . B A 
52fd21ac157f2bbdfe005b78a34a06706a2cfec40694fa9f157d9b7697298efe,2 pieces,Level 15,10,A aB . . ;X . X . ;. . b . 
572ae38854bfd9b0106379dbeacabbc05dfd967b0be773ff3ecb10ed86d6b686,2 pieces,Level 16,10,X b X . ;. . a . ;. . B A 
a8df2af64d5bc394ed2131e80cfdbbdaf171fd067b494f3ca3f5302a9e4a440c,2 pieces,Level 17,10,X . bB A ;. a . X ;. . . . 
3954f388c2b0f1570f75d11b0a0c3bb75d9130f88e4698ffcdf005dcd4f05dea,2 pieces,Level 18,8,. X B A ;. . . a ;b X . . ;. . . . 
01ae3904d832a5c8357cdbb86d157016b1f32a46c29f32c7566ed98385219c32,2 pieces,Level 19,9,X b X . ;. . . . ;. X . . ;. . aB A 
1946ed3de8f8dcecf7135e079ecfd2219b33c22732a597eb67b7bc91c04b8bd8,2 pieces,Level 20,9,X X . X ;. . a . ;. . . . ;. b B A 
2ee73c98c564030c9956e76def2ae289f10e83f023df4dfc243497fc2b753b1f,2 pieces,Level 21,9,X . bB A ;. . . X ;. . a . ;. X . . 
5f0478c9a58808c2161e8a61b92183ae7b1f2fdf5d6ec03807ca84eecf8e2be4,2 pieces,Level 22,9,X . X . ;a . . . ;X b . . ;. . B A 
a1478dcdc67c5a0dfc165f7fcc32465e7671af3ccee15d9b693ba0c06413a027,2 pieces,Level 23,9,X . X . ;. . . . ;. . b . ;a X B A 
3e88468c027269836569e09df38ff4065906ee8bb4c4b9a1d7224a372c196ea7,2 pieces,Level 24,10,X b X . ;. . a . ;. . . . ;. . B A 
52564450a1d7f3c098ce2a6ae0c297e117c31956280c499fa67af0beb73a3e99,2 pieces,Level 25,10,X . aB A ;. X . . ;. b . . ;. . . . 
bded4725b6713288f2a295a4e66c3f73478a52111d60b68a44bb3197c34e529f,2 pieces,Level 26,10,. X X . ;. . b . ;. a . . ;. X B A 
0a3d3e1414df0a73102c7f444ad7dde21fa99e8c50c963c5ba8c06c32824d2cd,2 pieces,Level 27,11,. X B A ;. . . . ;a X . X ;. . b . 
21c479297a2a94ee9b71f5578ff47961054e98205f76f5aa18e54b3dc5d194e3,2 pieces,Level 28,11,X X B A ;. . a . ;b . . X ;. . . . 
322b7e4794d776130eec66d633e3c4ac73f67b75a5165c2cc760d37d57d3e962,2 pieces,Level 29,11,. X X . ;. X . a ;. b . . ;. . B A 
a70500b304a21946a4e9e7af27e376376c25e1a15a2ad5cbf96e2b65a8e51b92,2 pieces,Level 30,11,. X B A ;. . b . ;. . . X ;. a . . 
bf9888966dac56338ceb711cd6c7bab574e631dddddd510d5cd5afac220137c1,2 pieces,Level 31,11,A B b . ;. X . . ;a . . . ;. . . . 
cb47327f4742f02438d7d89796ad4f636e449a326dddade52697067d8120b3e8,2 pieces,Level 32,11,a X B A ;. . . . ;. . . . ;b X . . 
249625e781616148efaed8adaccb32e6f29bb6654f00aec0aa2471ce3c0795a9,2 pieces,Level 33,12,. X X . ;. a . b ;. X . . ;. . B A 
9628979d2b3ef41ced1f1efbbdce2a7e832a7023ae863da64a9f8415d865f58a,2 pieces,Level 34,12,X b X . ;. . . . ;. . a . ;A B . X 
c9dafdf97573a517cb15633cc677082dc029d5c12b15f88935fcd4892c81f7a8,2 pieces,Level 35,12,X X B A ;. . . . ;. a . . ;b X . . 
3f6b1d354ecc5436f2c449e4bc5a5c477c5d94a53b867f165ef4e99c4b6b512a,2 pieces,Level 36,13,X . X . ;. a . . ;. b . . ;X . B A 
b2f5a261dea11f7f334c24a7acc45e3ae26bf0f499f3dd072ff2aa32ef4a996e,2 pieces,Level 37,13,X X B A ;. a . . ;. . b . ;. . . X 
5914823eb391a2d011ac5d283cb6ca77d05f2c4a39584f77242280ba482de4db,2 pieces,Level 38,17,X . . X ;. b . . ;. X a . ;. . B A 
61e67a3a85159c3036498fe4fe6400d8942bd9af99ccc69931f4895a70ff234f,3 pieces,Level 39,9,A B C . ;c . b . ;. . . a 
7665835e821f820d8b044b4abf345e5394988a5654c6030a202b3865fec51e1e,3 pieces,Level 40,9,A B aC . ;. . . b ;. c . . 
c93a598b267b8834c968055e6945ea469eb4eafc50621aa5204e403a4b55d012,3 pieces,Level 41,9,A B C . ;. a . . ;. c . b 
d20115648ad92bf0da75baf03d6a6ff38738710fbe5f314643045582846e9ba9,3 pieces,Level 42,9,A B C b ;. . a . ;. c . . 
dbc8cca8eb8bd891da40c91b7c2b9e7aee2f74676fa536efe0449e343a6bb3ca,3 pieces,Level 43,9,A B C . ;. c b . ;a . . . 
6e6e3e76df620ec0623347ca0339583f841d009db0794b4bf302430702805df4,3 pieces,Level 44,10,A B aC . ;c X . . ;. b . . 
769e18ccf31019dc2df29850e69ef6162fd053f552ab27774617c268f6d1f1bd,3 pieces,Level 45,10,b X . . ;. . c . ;. C aB A 
866a5f1f9e8f82b8475f02f779524cf6143a9a7cd3900a77f17da825aa55d04d,3 pieces,Level 46,10,. X . c ;. b . . ;. aC B A 
af3332fef3d2de1ac4fec1d6767f3078f1ea5839f17bcbaad41675113b8fb728,3 pieces,Level 47,10,A B bC . ;. X . a ;. c . . 
bd5e1ea25759e650af7d26518dd083bfc4b38eff314d990c0243fc9bd51ab40c,3 pieces,Level 48,10,X . X b ;. a . . ;A B cC X 
ee1cb545391c7a9ee33f41dd774c1f3ce07c45e390ba121da27176233735b14c,3 pieces,Level 49,10,A bB C a ;. X . . ;. c . . 
09530a171324e3b4e613f30bb2235e73099faf83ec85550a844fa4b054be641d,3 pieces,Level 50,11,X C B A ;b . c . ;a X . . 
0ceb4738e659874e731a3c7cc74f91ffe96be0bac221fd9db6dc1c33b6a716cb,3 pieces,Level 51,11,X C cB A ;. b . . ;. . a . 
24ba5872d3ffb432fba1d6caf370d097000bf1f0f52025164bc56df52a3bd27c,3 pieces,Level 52,11,A X . c ;B . b . ;C . X a 
db4b9e9a8431a58d2c24dc992d09c4bdc55611b8bb7ba3acba1f9d58c388e40a,3 pieces,Level 53,11,A X . . ;B a . . ;C b X c 
ed6937e8603927fdde34ed086a94549da4b1e1ec37e03bde37414ea90e486346,3 pieces,Level 54,13,X C aB A ;. c X . ;. . b . 
aa739c2470bd7f373ee94be59e081039dddbe02fe49aebff6a77fe47945bfceb,3 pieces,Level 55,14,. X . . ;a X b . ;. C cB A 
d4a3404489d33bc3c727cc9b8d695ffcd02166cfe59e56c2647df4bb89fbbf56,3 pieces,Level 56,15,. X . . ;a . X c ;. C bB A 
4285b5c9856aa4925865884bfcab62603e57e6bf1e6e50a2af4d5afb7c11af41,3 pieces,Level 57,11,b X X . ;. . . . ;. . a . ;. C cB A 
6cfdacae572a9f0b21f422a612b2735475016b0dd127e2556cf4e3b088a07237,3 pieces,Level 58,11,. X X . ;. b . a ;. . c . ;. C B A 
0864e0b8d9e39b5708c6ade198dd9c95ea10f8156acae7f736bd964fddb35011,3 pieces,Level 59,12,X a X . ;. . . . ;. b . . ;. C cB A 
2420d08b4bfbc1e7df346d3826d8b8a2c1a7c077ab5a42f0f0b075ee6cf52723,3 pieces,Level 60,13,A X . c ;B . . . ;C a . b ;. X . . 
9270196b7765142bccba88c5e397a56a645e44609d1c89638cd6c62c222a751e,3 pieces,Level 61,13,A B C . ;. c . . ;a . . . ;. . b . 
e0070aafe494379585d813d3c3af40ff38fe29c666eb2658bdace3d28f57327a,3 pieces,Level 62,14,X . . X ;. . b . ;. a . c ;. C B A 
1c0b84649a34806aabbe3f4a7b500907b34a5539fc657bf5cb35bb47fdcbc5dd,3 pieces,Level 63,12,X X C B A ;. X . . b ;. c a . . ;. . . . . 
11869b07a49158cbdd77fc8dba183d4ebb41a9afd0a0df7c49fcc188d95bb721,3 pieces,Level 64,13,. X C B A ;. . a . . ;. c . . b ;. . . . . 
251d4407a5f6fc0f1e089e251bacc8e16230bb567c03830a4cea911fa0eea938,3 pieces,Level 65,13,X . C B A ;. . a . . ;. X . . b ;. c . . . 
f9b9bb4717aecb2d06b843eb33ea2c73fa4a4ce3782356e1c72d4097e134b1dc,3 pieces,Level 66,13,X X C B A ;. . . a . ;. b . c . ;. . X . . 
5229491b05419b4cc74012fe5ca0dd5e994f0912be82c342755e582dd5fbf118,3 pieces,Level 67,13,a X C B A ;. . . . . ;. c . . . ;. . . b . 
aae569d51876d61d9f685f9e8d7db135af742e6032d8b850ef3df210ab47806f,3 pieces,Level 68,13,. X c X . ;. . . b . ;. a . . . ;. . C B A 
b15056d301c9d10cbbcdbe12a1a0072f5d129c50d821393a2dc65a3afa6977b4,3 pieces,Level 69,13,X . . . X ;. a . b . ;X X . c . ;X . C B A 
de83366b23d7d5398ed0127a462ef81996056ea7853c15798b95312ebcc86c2c,3 pieces,Level 70,13,c X a X . ;. . . . . ;. . b . . ;. . C B A 
0a6aea17ef6a7b39243cdec4b427f33ef1141007d89d5e40a55a6b247aa97567,3 pieces,Level 71,14,b X X . . ;. . . . . ;X . c a . ;. . C B A 
9a62ff477dc3319ca5b533f0942232946a464295be23d1af88f48838a3b2b3bc,3 pieces,Level 72,14,. X c X . ;. . . . . ;. . X a . ;. . C bB A 
2fefa6d1008610d3db400f4bfa39149fa37b4c35b66d17f3d39dfbc712ce33a5,3 pieces,Level 73,15,X . C B A ;. . X . b ;. X . c . ;. a . . X 
44c23aa60d63949e12b181e4b042d357d7b5355c71b1d04d33880bf73e6bc9cf,3 pieces,Level 74,15,X . C B A ;b . X . . ;X . . c . ;. . a . . 
1f366576568b0b4174908bd583ff384bd45e1ae9797b6a33dcfb2f716772f925,3 pieces,Level 75,16,. X a X . ;. c . . . ;b X . . . ;. . C B A 
23f403548bf184ef5d6c0cadf17d19cfb60525e83e4fa351a760b47f8fd63512,3 pieces,Level 76,16,. X C B A ;c . a . . ;. X . . X ;. b . . . 
2afd16e7f2d813267d5d6d34edc901ca2705e9ec1b61c2adccb0bad4da3f4e35,3 pieces,Level 77,16,. X C B A ;. . . X b ;. . X . . ;. c . a . 
2dcc5596ff8dde576ab9cd2a1460a506740f1c46ff8948b98e6bad2ba2a379cf,3 pieces,Level 78,16,b X C B A ;. . . c . ;X . . a . ;. . . . . 
3ea17f570a22a7abec2379cb3c25845604a10590239b08358abe8c6cfa8158bc,3 pieces,Level 79,16,. X C B A ;. . c . . ;. a X X . ;. . b . . 
3eadaf012cadb4122dfeff4832d1ab804b8e20735383fd54e011de46d6732da2,3 pieces,Level 80,16,A cB C . . ;. X b X . ;a . . . . ;. . . . . 
4b8996f5f3057461c2d9e955f243d4577c180a946534d10ba211d7f4656bcf36,3 pieces,Level 81,16,X X C B A ;. . . c . ;. . . a . ;b X . . . 
73548e2de6953d7a427fd2bca4d8e927761d6b66857e2fdc0a58e5c6b13c2f58,3 pieces,Level 82,16,. X C B A ;. b . . X ;. . . . . ;. c . X a 
771e5d6e6462ba33d59991f57b9c6dfafc74fa160ef5ae0d1aa6c9bd0ccb85aa,3 pieces,Level 83,16,X . . X . ;. . a . . ;. b . . c ;. . C B A 
7c3d66263385aa44038d074c13fe8ba104c1ff7b72e83f2f9151296176313169,3 pieces,Level 84,16,X B . . X ;A . b . C ;. . . c . ;X . a . X 
7f44b2b0ec1872e7b9c2525d0e41dc008675e6c8ab8b7aec0898fb64316a3f18,3 pieces,Level 85,16,X . C B A ;. a . . . ;X . . b . ;. . c . . 
8aaf569af1784eb78b6113a6ace3d693522beb5a140c31f6a836f884258a4391,3 pieces,Level 86,16,X X C B A ;. . a . . ;. c . . . ;. . . b . 
9569c7cfc71e39acc187223115295e16907c9f92226098cc3ade8ee0ce62959c,3 pieces,Level 87,16,A bB C . . ;X . . c . ;. X . . a ;. . . . . 
a1fa3b58b26993d6867248a613e154745a63ada8f1d7fc0f317e80531ac275b7,3 pieces,Level 88,16,X X . b X ;. . . . . ;. a c . . ;. . C B A 
a4f100235398878445a83ce0713905aa661e3e256ee320d44432cafba0a8ec74,3 pieces,Level 89,16,X . C B A ;. a c . . ;. . . b . ;. . X . . 
bc3f62bc3cacdd33965c55f0fde45ebc21ea73905008f94473ab3abbe640016e,3 pieces,Level 90,16,. X C B A ;. X X . . ;. . a . b ;. . c . . 
da71e5ba2f85c9311980e0451a5d684fc36f94ff3223131a25c6898b25bbc9b0,3 pieces,Level 91,16,X . X . . ;. c . . . ;. . a . . ;X . bC B A 
e2538c60f3c2342a685a12682494e4f973a434c15f5c845d8ffb3f3e2bc85904,3 pieces,Level 92,16,X X C bB A ;. . c . . ;X . . a . ;. . . . . 
e6a775b4aa2cbee98d47f5c76724826eddbc1663b9ffa401907c55ab54ed456e,3 pieces,Level 93,16,. X C B A ;. . b . . ;a X . . X ;. . c . . 
ea0b824bc40b01b2e296d2380b804451c98faf929f10178a6ebba47d60297057,3 pieces,Level 94,16,. X X . . ;. . c . b ;. . X . . ;. . aC B A 
ea5134a58962ae7e15503aa8871885f2dcbb9784b989df5c3a0e58b26a0db51c,3 pieces,Level 95,16,. X C B A ;. b . . X ;. c . . . ;. X . . a 
f9283ef9cb74119c46eee2c9279de77e8151e7ed866ade1bf7b9f731b821d7ec,3 pieces,Level 96,16,X . . X . ;. b . . . ;. . a . X ;. . C cB A 
10f41dc36c26160f8f632f53757c0ecf7e66f7e4e06bb3359d9ba1ab8f7e9245,3 pieces,Level 97,17,. X C B A ;. . . c . ;. a . . X ;b . . . . 
187a9672ad64079a6092fa9ccf099616796948a4a41df9b65c11eefb11d34ac4,3 pieces,Level 98,17,X . . . X ;. a . . . ;c X b . . ;. . C B A 
413498ffdede3d598efbba45074321152f1a6c72e339d4e2f0981b824c1b32e1,3 pieces,Level 99,17,A bB C c . ;X X . . . ;. . a . . ;. . . . . 
48f119e2bafe60febe80de5e2aecc18366995b3e0277acedeeffcd1de7d899a3,3 pieces,Level 100,17,X b X . A ;. . . c B ;. a . . C ;. . X . . 
58e1865ad3af718d9bdda6dae1b989438ab1a2e9d8a9ddefe3f881a5b2b9cb3f,3 pieces,Level 101,17,A aB C . . ;. X X . . ;. . . c . ;. . b . . 
832ea4b70def3e774dd6e352c2083379d9d47736a0633db92d11d3f09607c391,3 pieces,Level 102,17,X . . . X ;. b . c . ;. . . . . ;. . C aB A 
928fec9272776cd8a4a59ccb2d68981743d0c9b0e74966e1792895b105d021d0,3 pieces,Level 103,17,. X C B A ;b X . . c ;. . . a . ;. . X . . 
99e05a23ca71dac72fe4996c23d240b1823bbf99a00e32f3986da7d623a7807c,3 pieces,Level 104,17,c X . X . ;. . a . . ;X . . b . ;. . C B A 
a0bcf2d911c1c6f37953e0edd3690b1f9493993b9b3a122cbbf5ca97733cbfc3,3 pieces,Level 105,17,X . X . A ;. . c . B ;. . a . C ;b . X . . 
b0863f78eefeef98da3396bd1293abd27546515a6ab95578a3c6e4297327925c,3 pieces,Level 106,17,. . X . . ;. b . . . ;X . c . a ;. . C B A 
df7b7acbce439b8fb5e20be79103a0e13bb46b64259229e837a6c2da3b2247b7,3 pieces,Level 107,17,b . X . . ;. . a . . ;. . X . . ;. . cC B A 
e2638427890c0f690438e117a6918e88a774c39e87dad9f40590d51955262741,3 pieces,Level 108,17,X . C B A ;c X a X b ;. . . . . ;. . . . . 
fff0854209d95abb31c31992d8fcecc03a6e4d0812541617575a9f519fa06ad3,3 pieces,Level 109,17,A B bC . . ;. X X . . ;c . . a . ;. . . . . 
2e4edf1e1c7890f330c3eacccf483a189981e4569988b213a297cea5b276b2cf,3 pieces,Level 110,18,X X C B A ;. . b . . ;. a . c . ;. . . X . 
599e4edc3fbc6acc4e3a9ab8b8e4c9c11256a78bc00af7194cad4dcbdd309edd,3 pieces,Level 111,18,A B C . . ;X . . c . ;. a . . . ;. . b . . 
8e114b8cec2d9ec9334590206b5f054d4ed99f8f2e96863b1960195ccbb185d5,3 pieces,Level 112,18,X . X . . ;. c . a . ;X . . . . ;. . C bB A 
9b2caf81fb336ffe9f1742aa1927985672678ad47dcd6ed64aa4fcbbdca9181b,3 pieces,Level 113,18,X . bC B A ;. . X c X ;. . . . . ;. . . a . 
c4d84fac20fd36c1d959941ff956f05fde4dc6eaa60687c1f39a609b770d1394,3 pieces,Level 114,18,X X X . . ;. c . a . ;. . b . . ;. . C B A 
075483060384aa0fae0b146dfa3260b1e75f8e7a8dc60f8cb4212c7b4c43727c,3 pieces,Level 115,18,X . C B A ;c . a . . ;. . b . . ;X . . . . 
57e54572e663c0ab874caf0524bfc1c9a86fed84b7a5e8ce1ef6346dbc41a50a,3 pieces,Level 116,18,X . X . . ;. . . a . ;. c b . X ;. . C B A 
023d92b222ad1bd17dcdfd3096eb823cd19d68f72ed83c4278428c5cee899a43,3 pieces,Level 117,19,A B aC . . ;X . X c X ;X . . b . ;. . . . . 
14a3eebb55dd094d30bfb41a260950199ba8046ba704956d088ab7a47f6978f1,3 pieces,Level 118,19,X . . X . ;. c . . . ;. . X b X ;. a C B A 
2256ff7f8aa57167477c8f14837079cb71cc97011ed6db1165961c657bdbda6d,3 pieces,Level 119,19,X . C aB A ;. . c X . ;. . . b . ;X . . . . 
427502276cdbfe1683ec3ebddffd39d629fa7c6e1ad6b05585b6f1d4d446584a,3 pieces,Level 120,19,X . C aB A ;. . . X . ;. . c . . ;X . . b . 
6080a1879f57de1c546b1f165d3fe06ae73ed0c418b87361c776d8f644f40e7e,3 pieces,Level 121,19,X . aC B A ;. X X . . ;. . . b . ;. . c . . 
66320d481f201e0345256c1a371e36f83a991e7eca53aef95b767782aed3b700,3 pieces,Level 122,19,X . . X . ;. . c . . ;. a X b X ;. . C B A 
7a270a24021c27ad8c7156763419f462efbd45d067bb8cc7e5d388bb775355bd,3 pieces,Level 123,19,X . . X . ;. b . . . ;X . a . . ;. . C cB A 
a807f1eff85114eb38235d96328f396de3bb63c0629bbc89ee338c1cb3306b37,3 pieces,Level 124,19,b X C B A ;. a . X c ;. X . . . ;. . . X . 
c3e33b304fc88d1c710a556441038d03202b13aaf6cb17afe86ef404369e1a42,3 pieces,Level 125,19,X . X . . ;. . . a . ;. . b . X ;. c C B A 
42d5b91e27e4e3517f83acd7503c218b79b62b959700f27c999fb783a078e010,3 pieces,Level 126,20,X . C B A ;. . . c . ;. a . . b ;X . . . . 
5282cf0185d7062c0c220e3ed70e211e2b9fb71d3a4a514d23b382a17504a823,3 pieces,Level 127,20,X . . X . ;. . b . . ;. a X . c ;. . C B A 
6cafae7d2aa808f7eeae9adcc54c72c041d4a7d1aa15bd8621e255a6d7532bc3,3 pieces,Level 128,20,X . C B A ;. a X . . ;. . b . . ;X . c . . 
c90f3b7b5968adaf5612ffa6ccee45c2dbc46aede5aa293ad84aa3e7e8acd597,3 pieces,Level 129,20,X . . X . ;. . b . . ;c X . . . ;. . aC B A 
d9649cabf4c973d1e48478356f56da833934278f79814384f524298abf003d35,3 pieces,Level 130,20,X . . X . ;. . a . . ;b X . . X ;. . cC B A 
e5ca2f8e3690ecdf456dd989b86b1369fd1dcb44339dbc0fdc100b425d66e789,3 pieces,Level 131,20,. X C B A ;. . a . c ;X . . X . ;. . . b . 
f8271c6c658e66aaadfdf01b0a3ef072d4c4d019c8a837ee8eb32d5975de6bdd,3 pieces,Level 132,20,. X C B A ;. . . X . ;. c . X b ;. . a . . 
08f47c8eaa8f531d79fba5f511bb38364f73dde891db73cac9ec9c9c9650ffd7,3 pieces,Level 133,21,X . . . X ;. . . b . ;. c X . . ;. . C aB A 
8c831dcdc7947364bd2071f5b701f90aa31c868dea856d0cb9a7c4c00d4bb3b1,3 pieces,Level 134,23,. X cC B A ;. . X . . ;. a . X b ;. . . . . 
448d14cb471afafd176ab3d9f7bbc816e18b260f7b0dd6b2db5b30ac43b9896d,3 pieces,Level 135,11,. X X X . . ;. . a b . . ;. . X . . . ;. . c C B A 
79dedc433611c846b255fcc9e5aeb212c847149d8a335802775efc83d7ca9b38,3 pieces,Level 136,11,. X . C B A ;. a . . X . ;. b c . . . ;. . . X . . 
f4726091fa47369d6613a7c5616aff4807ac6b49386c2dac40477c4492758aeb,3 pieces,Level 137,11,X X . C B A ;. c b . . . ;X a . X X . ;. . . . . . 
0d89b530736ad5584072c731b98f0f10b9e9d7b390aa544cc7ef7991a625c9df,3 pieces,Level 138,12,a X . C B A ;. . . . . X ;X b X . X . ;. c . . . . 
15d1d9844f1f7a6598f95b131afe65e6f0d5ea8ec0ea02553e8a6eb4809e7a51,3 pieces,Level 139,12,X . . . . X ;X c . . X . ;. . b a . . ;. X . C B A 
645df7d8362cd84b78781d87dcb0a96409b7396a7c5979a09d28504d0bf683b8,3 pieces,Level 140,12,X . . . X . ;. a c b . . ;X . . . . X ;A B C X . . 
94f1c83eaa31df0a2307506486ae1f607cd759db1dd5cb5f2961890260db529d,3 pieces,Level 141,12,X . . . X . ;. . . a c . ;. X . . b . ;A B C X X . 
c38f8f791566c9db03519073ed04f5bae8d6754b89c2fa0b6109f7e99d33b06e,3 pieces,Level 142,12,X X . C B A ;. . X c . . ;. . . a b . ;. . . . . . 
1f965baace0dff434103604f551613d9fd1327d952f9d1fd7c6d02f33720b01a,3 pieces,Level 143,13,X . . C B A ;a X b . . . ;. c . X . . ;. X . . . . 
232ecedc284d8d419a5437ed9db9d194ac73f52819d5fa02e570cfef819d47dc,3 pieces,Level 144,13,X . . . X . ;. X . a . . ;. c b . . . ;A B C X . . 
5130f398ce663691fc3c4917085459902627a479108026468f5fd0114ce440b3,3 pieces,Level 145,13,X . . . X . ;X . b . . . ;. . a c . . ;A B C . . X 
5a361497cb47ffcee6f8a768737e860427dd54778d8053e6d5c8c1797b58ffff,3 pieces,Level 146,13,A B C . . . ;X . b c . . ;. . X a X . ;. . . . . . 
5fc7b4c540153b015cbca866242ae84fb8156716f39af3d30214461e35275666,3 pieces,Level 147,13,X . . . X . ;. X a X . . ;. . c b . . ;. . . C B A 
613d67d4cd204f8a9c0e6ec5374b748ca720ec95df2e03c8ec8bc3d1fad8c451,3 pieces,Level 148,13,X a X . X . ;. . . . . . ;. X . b . . ;. . c C B A 
646ad7cb5ccc21e06663a342850da43f19e369b79712e3c5baae433290577a2e,3 pieces,Level 149,13,X X . C B A ;. a c . X . ;. b . . . . ;. . . X . . 
707b4fd373c4872fa68c2cd02d0a2e21aadf8850c26543d28ce7d824fc89a696,3 pieces,Level 150,13,X X b X . A ;. . . . . B ;. . a c . C ;. . X . . X 
84d49bc7e56939791ea314212a52a993b1938960a3f4c38cbef3e2c10d813a86,3 pieces,Level 151,13,A B C . . . ;X X . b c . ;. . . X a . ;. . . . . . 
8f87d29f0c60ed05e27a5fa81e9ffc7b3e9e79930ba6f3be2d54527dea5aa63b,3 pieces,Level 152,13,X . X C B A ;. a . . . . ;. . c . . . ;. b . X . X 
8fd777b3c004b3fac92f39e42c43b06e3ea244868f5df0623f7d2c4be4b0f8d4,3 pieces,Level 153,13,X . . C B A ;. X b . . . ;a . c X . . ;. . . . . X 
aa4a88428c2c03f9a82e028e1a60d3b8b150b3f813759af4d3a886f5b7d2b3a2,3 pieces,Level 154,13,X X . C B A ;. . . . . . ;. a X . X . ;. c b . X . 
ad4916a8eba2fe181f0062ea7522862c1d30a6424866efd9990f1d924720076f,3 pieces,Level 155,13,X X a X . A ;. . . . . B ;. . b . . C ;. . X c X . 
b374184e8e14666bdde2b22fd80f6cea6487473940268ff03867b65eeb7a2bf7,3 pieces,Level 156,13,X . . . X . ;X . b . . . ;. a c . . . ;A B C . X . 
b476dcaf6c3fed52d1c512e172482372ff3c0b4532be216aeed074f12fa19529,3 pieces,Level 157,13,A B C . . . ;X . a X . . ;. . b c . . ;. . . . . . 
be923d127a38dede70eda5f0a8da38b8b921e36ed9f333d04d7a920bdbbc423e,3 pieces,Level 158,13,X . X X . . ;. . . . a . ;. b c . . . ;A B C . X . 
c93ecf7402d058c4dcf2a978ca36661629257d7cc8799c9a503269fb1ecd7991,3 pieces,Level 159,13,X . . C B A ;X . c b . . ;. . . a . X ;. . X . . . 
e0679cebcc5b70c80c7dc60edab662d1ec0104c52c27d6f07a0d9cb311df2031,3 pieces,Level 160,13,A B C . . . ;X . . b c . ;. . . X a . ;. . . . . . 
ed67c5bda99b3ea61bb7c0b6e801c561b24c06ec7753211a1e603c483b217c86,3 pieces,Level 161,13,X . X X . . ;X . a . . . ;. . b c . . ;. . . C B A 
f5d468d946003ba1850f53d8d483d2503c55155755fad672e2ef90d0731284f0,3 pieces,Level 162,13,. . X C B A ;. . a . X . ;b X . . . . ;. c . . . . 
046bcf5de7c34f68ba365507b13588392db84a41cf68ad179fb85b8a6f10521f,3 pieces,Level 163,14,X . . . . X ;. X b X . . ;. . a c . . ;A B C X . . 
082059b63ca3b39920151f2403079408fd66febc48ab1d4531e072ceb11b2f52,3 pieces,Level 164,14,X . . C B A ;. X X . . . ;b X . a X . ;. c . . . . 
25f0d783579fff85a0b95ee2bb82afb1c961d431bba781f98ba1daa0edfa66f7,3 pieces,Level 165,14,. X X C B A ;. a c . . . ;. b X . X . ;. . . . X . 
3a1c76db73320ae984b8a6b584549855b187ebebf583884e4816359ab97a82a8,3 pieces,Level 166,14,X . . C B A ;. . b a . . ;. . c . . . ;. . . . X . 
4347cba2586c02850d6529d5d7f79f4486117c4b87e54bfa57c4b24073efbbec,3 pieces,Level 167,14,. X X C B A ;. a c . . X ;. . . . . . ;. X b X . . 
43ec97553ed12d4dffd9a9830be458f38c48281722ea23ada60670bac3bb0178,3 pieces,Level 168,14,X . . C B A ;X . a b . X ;. . . X c X ;. . . . . . 
4b9e8a04d0a85e8be5ebfca4b11c8c5749a74bb9172469bbce906af39a6258c0,3 pieces,Level 169,14,. X X C B A ;. c a . . . ;. X . . X . ;. . b . X . 
4db0a7c285c4a7fca2b47a72c294a0adffbb64b2907ecf731407992eca43e4a7,3 pieces,Level 170,14,A B C . . . ;. X . a X . ;. . b c . . ;. . . . . . 
551a163326d7a7a75cfad92403132b1bdc10484714d80acc6425db39a0cdb541,3 pieces,Level 171,14,X . . C B A ;. . a . X . ;. X . . c X ;. b . . . . 
67881696eb5baa9350dd199bcbdeb2986b6c526f17011fad1908442e4ad5a817,3 pieces,Level 172,14,X X . C B A ;X . . a . . ;. c . . . . ;b X . X . . 
6a8d23b76f9de2102839a385d3a1649e9f5a5c98a2978247c76357d4f4a973a9,3 pieces,Level 173,14,X . . . . X ;. a b . . . ;X . c . X . ;. . X C B A 
861b3735a4148bdaf25ea9add0be7ad854787e7f3a5b3a8407c379951177a46a,3 pieces,Level 174,14,A X c X . . ;B . . b . . ;C . . a . X ;. . X X . . 
992b187cd110b0040b3a2f3c677f329bed06f4fa5b5f8ef123e52d62f93530f9,3 pieces,Level 175,14,. X . X . b ;. . a . . X ;. . . c . X ;A B C X . . 
a360c4a8f3ea7b3769560c8e9025d872e25b7ee6d6ed4b4c5bf2c0819d53bf56,3 pieces,Level 176,14,X . c . X . ;. . X b X . ;. . . a . . ;X . . C B A 
aec0b7e8c182e4bcaab13203768657ba046a506d11cb1f94df1a83664f4e874b,3 pieces,Level 177,14,X . X X . . ;a . . . . . ;X . c b . . ;. . . C B A 
bd41ed76a9bdba7ee178182b777ab78907e2d0232867eb1d86304d8a26eb9f0f,3 pieces,Level 178,14,X . . C B A ;. . a c . . ;. . . b . . ;. . . X . . 
c7461a8a2dc60ae96f992956f2487307e3385771289ed7d0b8a053b24c1529e4,3 pieces,Level 179,14,. X . . X . ;. X . a . . ;. X X . c . ;. . . bC B A 
cbbe3ec77a88d2cb2399ca85d25adbedf4008fab9977bfddad0802fb82fde0d3,3 pieces,Level 180,14,X . . C B A ;. . . a c . ;. . . b . . ;. X . . . . 
cecf77e7745794bab68ce273e96efad70280fb02e9bdf0a1b56a3e5f9cead05b,3 pieces,Level 181,14,. X . C B A ;. . . a . X ;. . . b c . ;. . . . . . 
d712eaebb1ba05cdaf7f4d23cb528f8acf0d3db232339225d10121d75be8f5c3,3 pieces,Level 182,14,A B C . . . ;. X a X . . ;. . b c . . ;. . . . . . 
e34652ffd3ffddda51c2df119f1d156a196e08caabadbbdc8a63f21ef132cd61,3 pieces,Level 183,14,X . . C B A ;. X X . . X ;. a b c . . ;. . . . . X 
f260e052e9ca762dd88f78f103332042593fcf3de7b66a893b72be08fc19393d,3 pieces,Level 184,14,. X X C B A ;. c a . . . ;X X b . . X ;. . . . . . 
1111bd3e6794b5dc7f31a1d1186cfa8f01cecfde80ab3503ae83259a5fc3821e,3 pieces,Level 185,15,X . . C B A ;. . a . X . ;. . c b . . ;X . . . . . 
217d9112ab1a54e526406d53621e45579ec7a35a58ebf4243f364a4a98762626,3 pieces,Level 186,15,X . . . X . ;. . a . X . ;c X . b . . ;X . . C B A 
311137a1ad4271a2d01bd37197883b7741028a018db69d965327da876a1d0d08,3 pieces,Level 187,15,. X . C B A ;. . . a . X ;. b . c . . ;. . X . . . 
5659d123a361c65d11d5296460867b6691999aff81acf1606e473f847ddef051,3 pieces,Level 188,15,. X X C B A ;. b . . . . ;. X . . a . ;. . c . . . 
6181c59a5d25978df249ddcb4e6e2d0aeaa60f4a81ca6226974d54ade58d7cc5,3 pieces,Level 189,15,. X . C B A ;. c . . . X ;. a b . . . ;. . . . X . 
6c60ab79cde2ce4c0bffb76a60679d984c2e4f5222f67ef8f2c5d8fdbea779bc,3 pieces,Level 190,15,X . X b X . ;. . . . . . ;. c . X . . ;. . a C B A 
74a67cc7b70ea4f611a610dc29718e5cf97ef4a95375611280ea113423c435fd,3 pieces,Level 191,15,X X . . X . ;. . c . . . ;. a b . . X ;A B C . . X 
94c0a722118fc68bb37d6c7482701435a59f24307d03310262cccab7be7379e7,3 pieces,Level 192,15,. X . C B A ;b . . . X . ;. a . . . X ;. . . . c . 
b97289733fbeb47f8ac349952780b68ecc5d7542bc3cb64845a355ccfee59119,3 pieces,Level 193,15,X . . X . . ;. . b . . . ;. . a c . . ;. . . C B A 
c103f78229392b6081615b051a9740101916985b10dac1fba893b587d8514cd1,3 pieces,Level 194,15,. X X C B A ;. a c . . . ;. . X . b . ;. . . . . . 
f27368b63a3f690a9b2eade084ff3d96a1f7d2ffed2ea4c3bec029dfc1ac0f1b,3 pieces,Level 195,15,A . X X . . ;B c X . . . ;C . b a . . ;. . X X . . 
07bcdb5cba9783b60865ad395944cf088ff00677c37f467cf8e48360fdad8210,3 pieces,Level 196,16,X X . X . . ;. . . . . X ;. a . b c . ;A B C X . . 
0c62b2caa59aa4dfd4145f3837a7dc012e229dc51e3918e8f1ed81c190354e69,3 pieces,Level 197,16,X . . . . X ;. . . c . . ;. . a b . . ;X . . C B A 
0f499828d0f3c90ce1a3389640ff52c8943afce444c99af216c9aa4914ed4ba0,3 pieces,Level 198,16,. X X C B A ;c X . . . X ;. . . b a . ;. . X . . . 
12afb94b955c91efbf45a26b5d10f31a19103f5557635756ebf2291f9edeef19,3 pieces,Level 199,16,X X . . . X ;. . . . . . ;. a . b . X ;c X . C B A 
1dfbb02d2f506b0079f1bb64e01ae4f16ab9069a824635a76ce629a53aaa561b,3 pieces,Level 200,16,X X . X . . ;. c . . . X ;. . . a b . ;. X . C B A 
206c2c0692329255d57326df19a665f00e80d23734918d1d46e039b33648e170,3 pieces,Level 201,16,X . . C B A ;X X a c X . ;. . b . . . ;. . . X . . 
20ebb206114b3a2542c82fe2b63c0fb751f35e11bb65bd8972b622f6df25e6cb,3 pieces,Level 202,16,X X . . a X ;. . . . . . ;. c b . X X ;. . . C B A 
2b4758dfd210a33f27feab3f14079aa5394a64b01803e829f4ceb3a8f524a148,3 pieces,Level 203,16,X . . X . . ;. c . . . . ;. . a b . . ;. X . C B A 
31263c01e7fb71837290e7987fe93a68af7d6fa7d20f910c845a7dedbd7dd52d,3 pieces,Level 204,16,. X . C B A ;. . . a c . ;X . . b . . ;. . . . . . 
39d9ad9e1fac05f1c4647eaf4b6af12c80996b9e9ab1594332437ccbc9008b7f,3 pieces,Level 205,16,. X X C B A ;a . X X . . ;. . X . b . ;. . c . . . 
430fa116d39cdd748c76c4c1050ce32aa103c2baaa2a7b6f32ff35e0c34555cc,3 pieces,Level 206,16,X . . C B A ;X . a b . X ;. c . . . . ;. . . . . . 
61a0da33248290afa0a514ba2f5d3a00dfdd29cf4a03678e7539130a40d18934,3 pieces,Level 207,16,X X c X . . ;. . . a . . ;X b X . . . ;. . . C B A 
729b94945a0ac497cf14f680c06989d7cac1364c99eb8c92cf396af7ff467b1e,3 pieces,Level 208,16,X X a X . . ;. . . b . . ;. . X X . . ;. . c C B A 
73e163738962610cfa1ecbff8ba7fba23556c23fc163768569626be2633f12d3,3 pieces,Level 209,16,X . . C B A ;. X X . a . ;. . . b c . ;. . . . . . 
7f3555e7a18d6fcccefbdfb0d70be9cea49a50cdb299dc559ec2fa448dd1be0d,3 pieces,Level 210,16,X . . C B A ;. X . a c . ;. . b . . . ;. X . . . . 
83372915f50f622f27f0e66a381b3ff048416768e7f25dba7db381147b6b07a5,3 pieces,Level 211,16,X . . . X A ;. . a . . B ;. . c b . C ;. X . . X . 
8b2006833833f4e80eb3d20451af002c2d5084390de794c446d62877f789284e,3 pieces,Level 212,16,X . X . . X ;. . . . . . ;. a c . . . ;. . . bC B A 
941a7cea1d1d9648b3263a850502dfaeef26c056858b94a49d5be1d9012e0572,3 pieces,Level 213,16,a X X C B A ;b c X . . . ;X . . . X . ;. . . . . . 
9976c95fdf9fbb469b8b8188a8df9f48fada6a6243181b4f5f7b1bbefa15d2c5,3 pieces,Level 214,16,X . . b X . ;. . . . . . ;. c a . . . ;. . . C B A 
a62c683994c85b1b8d64a27569d8e7833dff5ecc232ace564b39a9b80127bb90,3 pieces,Level 215,16,. X X C B A ;c X . a . . ;. . . . X . ;b X . . . . 
ade150b5ddd590e13c4bd2eb7b168927073296aeb236bafe46ab8b04ff5c4dca,3 pieces,Level 216,16,X . . C B A ;. . . X . . ;c . b a . X ;X . . . . . 
ae933bf3cc28129950abea4e3f2d6a935b9c099fe5e2db883b77d4165718ca28,3 pieces,Level 217,16,X . . C B A ;X X . b . X ;X . . a c . ;. . . . . . 
b9757b455f40df193a4e18cd7a20314af3647b2e12e5477ae2f5aac4b003c0d9,3 pieces,Level 218,16,X . . C B A ;b . X . . . ;X . . a c . ;. . . . . . 
cd71601108b4c30439001a3650da1779a41aaeaf8bc7cb304a7d604488301fc3,3 pieces,Level 219,16,X . . C B A ;X X c . . X ;. a . . b . ;. . X . . . 
d79b0c9f5b2f9800ff1eb455443566dcffdb02a7cb96ade5700323bc7afcdf5c,3 pieces,Level 220,16,X . . . X . ;. . a c . . ;. . b . . . ;X . . C B A 
f3223f3f2fae5f288a3147b949484001290ce4637768e7ebb83d114dcb7c60fe,3 pieces,Level 221,16,X X . C B A ;. . . a c . ;. . . b . . ;. X . . . . 
f7072ae11cd9bff0405d86de7924b3e058935794c2ed91e742b8e6949d9102e1,3 pieces,Level 222,16,X . . X . . ;. . . . c . ;. a b . . . ;A B C . X . 
fae7809e8fa303fbeef87da6c86fc5cb485832c6740d6aadfbdcc2e6fa7fb446,3 pieces,Level 223,16,X a . . . X ;. . . . . . ;. . b c . . ;. . . C B A 
feffb1c11563df4370fc6e8df78e64be37d99ff40d19d63bfe0ea67dec57ddd8,3 pieces,Level 224,16,X . . C B A ;. X . b . X ;. . . a c . ;. . . . . . 
207eb6e427447a1c669a8b33abf3371d5c9b929fd09148dcf1936809e4570bdd,3 pieces,Level 225,17,. X . . X . ;. . . b a . ;X . . . X c ;A B C . X . 
32ede3c790237f20ee304ce62dde00317302436db44ff0382e7a0349a08ccebf,3 pieces,Level 226,17,b X . C B A ;. a . . c . ;X . . X . . ;. . . . . . 
413b6f9ec1acc249e6170635f3ae8855f829e0853f45f7e54aaeb8ab555e4a8c,3 pieces,Level 227,17,. X . . X . ;. . . c . . ;X b X . a . ;A B C . X . 
41b32d7c9397bb78bb75754cc3edcd33cb916a7b1985e417c88de61afac8cb32,3 pieces,Level 228,17,. X . C B A ;. . . X X . ;. b . a c . ;. . . . . . 
44d28e4a171c109f8b6e65a0cf27bc6528eee49587e418946e9682d273967cf7,3 pieces,Level 229,17,. . X X . . ;c X X . b . ;. a . . . . ;. . X C B A 
5640e81e4531773d6a7d96f05b5c02b9149011797679105d2c4fc14ceb0b293a,3 pieces,Level 230,17,X . . C B A ;. b . . X . ;. . c a . . ;. . . . . . 
5de6c34d01d7eee2127c422e769a0128cc02383f554f35c0c754e80d798accfb,3 pieces,Level 231,17,a X . C B A ;c . . X . . ;X . . . b . ;. . . . . . 
6062d79a46e821732d33b9fbb46a7b663cbaa158d5232c47c10b98eea9d32751,3 pieces,Level 232,17,b . X C B A ;X . . . c . ;. X . . a . ;. . . . . . 
73f72b42d224b3af53f35a926854dc803971c937cc34164786536377fda2706f,3 pieces,Level 233,17,X b X C B A ;. . . a . X ;. . c . X . ;. X . . . . 
85a443f6af07fa52103a3023708f70cf054eab708d614b376c4c3fe5d8a1f4e3,3 pieces,Level 234,17,X . . C B A ;X X . c . . ;. . a . . . ;. b . X . . 
b01f90eab2cfd4bbb9b58b7a684c74e33e3de55e8e55e16e239bf417eac0848b,3 pieces,Level 235,17,. X c X . . ;. b . X . . ;. X . a . . ;. . . C B A 
d51d50bd8262e4c7421e4e2560959b8b031209b4656a088e1c5f7ae68e51818f,3 pieces,Level 236,17,A B C a . . ;X b . X X . ;. . X X . . ;. . . c . . 
dcea989b32daed28d644c1d72a3caebd67dddfaa2a2b3918497cf7c9446d0f97,3 pieces,Level 237,17,. . X X . . ;. a . c . . ;X . . . X b ;A B C X . . 
dfabe52243539f8330b1fdd09f74de11177292c4e8017086777e84a7e5d2cc4c,3 pieces,Level 238,17,. . X C B A ;. X X . a . ;b . . . c . ;. . . . . . 
0abac18915ae32854c3e56095675a9f21d8d1dafc7e6b8f647a7e9e23efe72c8,3 pieces,Level 239,18,. X a X . . ;. . . . c . ;. b . . . X ;. . X C B A 
1a0ef17e40161e11e675c84b3806be6406e34987f545c98ed0b69a3c0353b88c,3 pieces,Level 240,18,. X X X . . ;. . . a . . ;. b . X . . ;. . . C cB A 
7ab88349bbe2371719a71a099c14f60c7093d2ba4352ed8a6b2b511b9516b829,3 pieces,Level 241,18,. X . . X . ;. X . b a . ;. . c . X . ;. . . C B A 
9a961d907a370e3986ce6de1d8cbd7fa403b85a4843658f34eada2ce777b90c4,3 pieces,Level 242,18,. X . X . . ;. . . . a . ;. b . . X c ;A B C X . . 
a58112becccd084fe7861a6f0b78106b07a0c381d1362a4a29232fba14af5e61,3 pieces,Level 243,18,X . . C B A ;X . a b . X ;X . . . c . ;. . . . . X 
e8ebdacf1ad37bbf36b0bed6eb28a7a0780e428d599c7ba93aea87f2a8f919db,3 pieces,Level 244,18,. X . X . . ;. . . . a . ;. b X c . . ;. . X C B A 
4cf3952440704af43c10e786739195ce5eca40847b9cdd1c6bc6e27423da9d00,3 pieces,Level 245,19,X X . bC B A ;. . . c . . ;. . . X . . ;a X . . . . 
5758abafcc4deaf57a986d3a9f5211130538153014d5e1748ab668621d380c21,3 pieces,Level 246,19,X . . C B A ;X . . . a X ;X . c b . X ;. . . . . . 
62b519a024811428dfc01d90d3127e44a9669b4c629e461ce25218b2fc019ab8,3 pieces,Level 247,19,X . a . . X ;. X X . . . ;. . . b . X ;. . c C B A 
882b545037ce7dce08afd97c3dd688e9ea5f476f8def517b7c96fc252d9d5a91,3 pieces,Level 248,19,. X . X . . ;. . . . a . ;. . c b . X ;. . . C B A 
8e20e13c5137e7f2669454403fc37435582e2a0e4d60e9398009ecde04e5c66d,3 pieces,Level 249,19,X . . . . X ;X . . . . b ;X . c a . X ;. . . C B A 
a2e318021d56a7c7c9fed9d4c9fb5b7d911abbc39d828cc5ca06adb1c1b7e95c,3 pieces,Level 250,19,X . . a . X ;X b X X . . ;. c . . . . ;. . . C B A 
c6aa24c67e553079c7a0a4a396bd9a3ce2be94f7dd3a4494beb8d4cb2928d129,3 pieces,Level 251,19,X A . . C X ;X . . a c B ;. . . b . . ;X . . . . X 
ca7fc7b510a2dd9d63ed8f127d420e9916ac9fbb1bd9ec9eb311cdd9bf3d72cf,3 pieces,Level 252,19,. X . C B A ;. . . a b . ;. c . . . X ;. . . . . . 
daa8747a73500f7a670d4e33b9022a92906193130c99ee897696d59b9880c4a5,3 pieces,Level 253,19,X . . C B A ;X a c X . . ;. . . b . . ;. X . . X . 
f1082d32cc99d8a9882e2ca72bd28227f523ae2494eb42954f83bc320c500be6,3 pieces,Level 254,19,X . . C B A ;. . . a . . ;. . c b . . ;X . . . . . 
b284603ccaa4e778969bdbfd2ee727d58352d1b9ca44e2ef883ce9fc6528a401,3 pieces,Level 255,20,X X . . X . ;. . . . . . ;. b . . a . ;. X . cC B A 
b3f278308b8a6709a435275ff949f13a2ccfce44c08a8ab6911ae7bc5bfe214d,3 pieces,Level 256,20,. X . . X . ;. b . a . . ;. X c . X . ;. . . C B A 
8432c66d76862b3d3a8be1d4bb5ad84b50bda58df64d24aa40ad811d4bbec16d,3 pieces,Level 257,21,X . . . X . ;. a b . . . ;. . . . c . ;. . X C B A 
fcfe29be531caeb472cd36d5318062969ac110ed89f9c8581cd24da7a919ebb3,3 pieces,Level 258,21,X . . X a . ;. c . . X b ;. X . . . . ;A B C . X . 
211ea703dc658779e66b584c12d2e29d799818a3e72075723ee42e4adbf942b9,3 pieces,Level 259,22,X . . X . . ;. . . . . . ;X c X a X . ;. b . C B A 
3ad20bd4a3c6034b6309ef6d11556e61e97982b69123a0a4d686399e02e09199,3 pieces,Level 260,22,X . . X . . ;. b . . . . ;. X a . X c ;A B C . X . 
797e083f7d9418707af40261e521ee2b6922478137d41668a724dfe477ec6bd8,3 pieces,Level 261,22,. . X C cB A ;. a . . X X ;X . . . . . ;. . b . . . 
305aeedf98103142bb25a24bd22424da5077eddeab00b3d5cc7eb46bb43d6cf2,3 pieces,Level 262,23,X . . X . . ;. a . . . . ;X X c b . X ;. . . C B A 
669bb05f0819155bf38a88d93c9605004d03802728d19b315ca75f2ffee2165c,3 pieces,Level 263,23,X . X C B A ;. . . b . . ;. c a . . X ;. . . . . . 
964f8b4da9eff2d473b930ded2108b3089653532e1cab03055b541d08aa3164c,3 pieces,Level 264,23,X . . X . . ;. b . . a . ;. c X . . . ;A B C X X . 
b62603f02e37d5a5b4dbd488971f490b149a1dd7397b6cd60b07416e6b9d7138,3 pieces,Level 265,23,X . . X . . ;X . a . . . ;. X b X . . ;. . . cC B A 
d184df48a8f7814e57e4cba9d37aa4c899292aecd22e96589671fb1fd359d9b6,3 pieces,Level 266,23,X . . X . . ;. . . . b . ;X a X c . X ;. . . C B A 
dc8042751659a7c50b100e5cfbb29548869c2959cfb129a38a7287dfe60b550f,3 pieces,Level 267,23,X . . . X . ;X b X . a . ;. c . . X . ;. . . C B A 
808790257a3f21218ecab978e837513cb0485d744a697cafe02a0d5dfc5cf3da,3 pieces,Level 268,24,A B aC . . . ;X . X . . . ;. . . X c X ;. . b . . . 
a79c150b745de18e217ebb862c9e63a6bc4bc8ff5bae824096b0fa5cdee9bf84,3 pieces,Level 269,24,A B C . . . ;X . . a b X ;X . . . c X ;. . . . . . 
a855dba5b82fa30f3d7a4ae411012f4fd5dd50c5a9aa4a9a452b7fef01f3ad7e,3 pieces,Level 270,24,. X . C B A ;a . . X . X ;. . . c b . ;. . . X . . 
cf12193a03b7d3487a6327813b3142ed491a55bb9da796fb508592c81ed8e0bc,3 pieces,Level 271,24,A B C . . . ;X a X . . X ;X b X . . . ;. . c . . . 
3766c56f67a4da86535f074f995f26594149ab4631d5176696bf6c29f4e3d207,3 pieces,Level 272,25,X . . C B A ;. X . X a . ;. . b c . . ;. . . X . . 
772cf44b3991ce47e118a1e3671690b9f84e42224c3cf42e49a443a391fe416f,3 pieces,Level 273,25,. X . X . . ;. X . a b . ;. . . X . X ;. . c C B A 
a32dbbd0d65cb53118a2c2038ed51a0988de524920e37076dbf0801c68759dd2,3 pieces,Level 274,26,X X . . . X ;. . . a b . ;. c . X . X ;. . . C B A 
bb58c6c4a6bdca54232b717c22e64bf69c97c0179cb5bcd6e9de3b4665970f30,3 pieces,Level 275,26,X . X X . . ;. . . b a . ;. c . X . X ;. . . C B A 
4e8a3d6744d8ec08295cdd56a963fad2b701819f639aa14e9b8cb5de4523f7a1,3 pieces,Level 276,27,. . X C B A ;. a . . . X ;X b X . c X ;. . . . . . 
0792abef77d89c359428d48ee6d3e6ccd2f7504f45296688b2937d0ee27e244e,3 pieces,Level 277,28,X . c C B A ;. . X . X X ;. . a b . . ;. . X . . . 
34229a1f3ba3a613daf96d3d9de22f60d879a7e6a96b045faeccf1b12bf01a8c,3 pieces,Level 278,28,. . X C B A ;. b a . . . ;X . X c X . ;. . . . . . 
7b06225a01bdfbd32ae69358a9dca21a0b855a6c76ce6e8010bbb16b44872a44,3 pieces,Level 279,28,. X . . X . ;. . . c . . ;. X X . . . ;. a . bC B A 
8089c6764089dd64b08b702b48d08dcaee5effc543c269d3d0fd10748a189319,3 pieces,Level 280,28,X . X C B A ;. . c . . X ;. a X . b . ;X . . . . . 
86c96999522464a354273acc2410c488fbee35234c27916d9da339ca700f9f6e,3 pieces,Level 281,29,X . . aC B A ;. X . X . X ;. . b c . . ;. . . X . . 
cf9b68543cc129e76c42595d0d142e4757ce16486c2d1f8a4561480ec02587cd,3 pieces,Level 282,30,. X . cC B A ;. . . X . X ;X a X . . . ;. . . b . . 
e41434198b2bb5db8da237b541cbf1b0349cb12c1eccf1f3bac360bdd9be8958,3 pieces,Level 283,31,X b X . . X ;. . . a . C ;X c X . . B ;X . . . X A 
e89e029e5f17274e39bc2fc9eae3676371eaff06ed9692adae3079da82a83f1c,3 pieces,Level 284,31,X X b X . . ;. . . a . . ;. c . X . X ;. . . C B A 
18e94197c01899d3d4177730f1c69f8dfd1582f91b43d5510c882cf7ee622d1a,3 pieces,Level 285,32,X . . X . . ;. . . a b . ;X c . X . X ;. . . C B A 
26d99c3efa1249e5ae6395bd4db40302923faec1423a8ee098b83f752e9e0f28,3 pieces,Level 286,36,X . . X . . ;. . b . . . ;X X c X . . ;. . . aC B A
72435508dfe03cc248df6b8cb4b8f543bef28414df05efad59f8cc7cbca6726c,3 pieces,Level 287,54,X . . X . . ;. . c . b . ;. . . X . X ;a . . . . . ;A B C X . .
`

const getBestSolution = (level) => {
    const {field, startingPosition, endingPosition, maxSteps} = decodeInput(rawProblems.split('\n')[level - 1])
    const solver = new Solver(field, startingPosition, endingPosition)
    return convertSolution(solver.getSolutions(maxSteps)[0], startingPosition, level)
}

console.log(getBestSolution(40))