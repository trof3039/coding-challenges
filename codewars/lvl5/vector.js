// https://www.codewars.com/kata/526dad7f8c0eb5c4640000a4/

function Vector (coords) {
    this.coords = coords

    this.add = (vector) => {
        if (vector.coords.length !== this.coords.length) throw new Error()
        const newCoords = this.coords.map((v, i) => v + vector.coords[i])
        return new Vector(newCoords)
    }

    this.subtract = (vector) => {
        if (vector.coords.length !== this.coords.length) throw new Error()
        const newCoords = this.coords.map((v, i) => v - vector.coords[i])
        return new Vector(newCoords)
    }

    this.dot = (vector) => {
        if (vector.coords.length !== this.coords.length) throw new Error()
        return this.coords.reduce((acc, v, i) => acc + v*vector.coords[i], 0)
    }

    this.norm = () => this.coords.reduce((acc, v, i, a) => i === a.length - 1 ? Math.sqrt(acc + v**2) : acc + v**2, 0)

    this.toString = () => `(${this.coords.join()})`

    this.equals  = (vector) => {
        if (vector.coords.length !== this.coords.length) return false
        return this.coords.reduce((acc, v, i) => v === vector.coords[i] ? acc : false, true)
    }
};

console.log(new Vector([1, 2, 3]).toString())
// SyntaxError: Unexpected identifier "constructor"
// class Vector {
//     coords

//     constructor(coords) {
//         this.coords = coords
//     }

//     add = (vector) => {
//         if (vector.coords.length !== this.coords.length) throw new Error()
//         const newCoords = this.coords.map((v, i) => v + vector.coords[i])
//         return new Vector(newCoords)
//     }

//     subtract = (vector) => {
//         if (vector.coords.length !== this.coords.length) throw new Error()
//         const newCoords = this.coords.map((v, i) => v - vector.coords[i])
//         return new Vector(newCoords)
//     }

//     dot = (vector) => {
//         if (vector.coords.length !== this.coords.length) throw new Error()
//         return this.coords.reduce((acc, v, i) => acc + v*vector.coords[i], 0)
//     }

//     norm = () => this.coords.reduce((acc, v, i, a) => i === a.length - 1 ? Math.sqrt(acc + v**2) : acc + v**2, 0)

//     toString = () => `(${this.coords.join()})`

//     equals  = (vector) => {
//         if (vector.coords.length !== this.coords.length) return false
//         return this.coords.reduce((acc, v, i) => v === vector.coords[i] ? acc : false, true)
//     }
// };

