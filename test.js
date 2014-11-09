var palette = require('./')
var test = require('tape').test
var array = require('array-range')
var almostEqual = require('almost-equal')

var RED = [255,0,0,255]

test("gets a palette of main colors from an array of pixels", function(t) {
    //a red image 
    var red = array(100)
        .map(function() { return RED })
        .reduce(function(a, b) { return a.concat(b) })
    
    t.deepEqual(palette(red, 10, 1), [ [252,4,4] ], 'should guess red-like rgba color')
    t.deepEqual(palette(red, 10, 0), [], 'should return empty array')
    t.deepEqual(palette(red, 10, 6).length, 6, 'should return 6 colors')
    
    var gradient = array(100)
        .map(function(i, x, self) { 
            var c = RED.slice()
            //gradient from black to red
            c[0] = ~~(c[0] * (x/self.length))
            return c
        })
        .reduce(function(a, b) { return a.concat(b) })
    
    var sum1 = palette.bins(gradient, 10, 4).reduce(sum, 0)
    t.ok(almostEqual(sum1, 1), 'amount sums to one')

    var sum2 = palette.bins(gradient, 10, 2).reduce(sum, 0)
    t.ok(almostEqual(sum2, 1), 'amount sums to one')
    t.end()

    var colors1 = palette.bins(gradient, 10, 2).map(function(b) { return b.color })
    var colors2 = palette(gradient, 10, 2)
    t.deepEqual(colors1, colors2, 'bins map -> color works same as default export')
})

function sum(prev, a) {
    return prev + a.amount
}