// https://www.codewars.com/kata/5e98a87ce8255200011ea60f/

// tooooo hard task

const Format = {
    _stored: [],

    div: function (str) { return this._stored.reverse().reduce((acc, fn) => fn(acc), `<div>${str}</div>`) },
    h1: function (str) { return this._stored.reverse().reduce((acc, fn) => fn(acc), `<h1>${str}</h1>`) },
    p: function (str) { return this._stored.reverse().reduce((acc, fn) => fn(acc), `<p>${str}</p>`) },
    span: function (str) { return this._stored.reverse().reduce((acc, fn) => fn(acc), `<span>${str}</span>`) },

    get div() {
        this._stored.push((str) => `<div>${str}</div>`)
        return this
    }
}

console.log(Format.div.h1('str'))
console.log(Format.div.h1('str'))
