var palette = require('./')
var test = require('tape').test
var array = require('array-range')
var almostEqual = require('almost-equal')

var RED = [255,0,0,255]
var BLUE_TRANSPARENT = [0,0,255,0]
var concat = function(a, b) { return a.concat(b) }

test("gets a palette of main colors from an array of pixels", function(t) {
    //a red image 
    var red = array(100)
        .map(function() { return RED })
        .reduce(concat)
    
    t.deepEqual(palette(red, 1), [ [252,4,4] ], 'should guess red-like rgba color')
    t.deepEqual(palette(red, 0), [], 'should return empty array')
    t.deepEqual(palette(red, 6).length, 6, 'should return 6 colors')
    
    function truthy() {
        return true
    }
    var blue = array(300)
        .map(function () { return BLUE_TRANSPARENT })
        .reduce(concat)
    var redAndBlue = red.slice().concat(blue)
        
    t.deepEqual(palette(redAndBlue, 1, undefined, undefined), [ [ 252, 4, 4 ] ], 'gets red')
    t.deepEqual(palette(redAndBlue, 1, undefined, truthy), [ [ 4, 4, 252 ] ], 'gets blue')
    
    var gradient = array(100)
        .map(function(i, x, self) { 
            var c = RED.slice()
            //gradient from black to red
            c[0] = ~~(c[0] * (x/self.length))
            return c
        })
        .reduce(function(a, b) { return a.concat(b) })
    
    var sum1 = palette.bins(gradient, 4).reduce(sum, 0)
    t.ok(almostEqual(sum1, 1), 'amount sums to one')

    var sum2 = palette.bins(gradient, 2).reduce(sum, 0)
    t.ok(almostEqual(sum2, 1), 'amount sums to one')

    var colors1 = palette.bins(gradient, 2).map(function(b) { return b.color })
    var colors2 = palette(gradient, 2)
    t.deepEqual(colors1, colors2, 'bins map -> color works same as default export')

    t.throws(palette.bind(null, gradient, 2, 0), '0 quality should throw error')
    t.end()
})

test("gets bins from an empty array without crashing", function(t) {
    //a red image
    var red = array(100)
        .map(function() { return RED })
        .reduce(concat)

    t.deepEqual(palette.bins(red, 1, 1, alwaysFalseFilter), [], 'should return empty array')
    t.end()
})

function sum(prev, a) {
    return prev + a.amount
}

function alwaysFalseFilter(pixels, index) {
    return false;
}
