Number.prototype.toString = function() {
    return JSON.stringify(this)
}

Boolean.prototype.toString = function() {
    return JSON.stringify(this)
}

Array.prototype.toString = function() {
    return JSON.stringify(this)
}


const num = 5
console.log([2,4,8,17].toString())
