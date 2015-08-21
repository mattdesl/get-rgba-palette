var quantize = require('quantize')

module.exports = function(pixels, count, quality, filter) {
    return compute(pixels, count, quality, filter).map(function(vb) {
        return vb.color
    })
}

module.exports.bins = function(pixels, count, quality) {
    var vboxes = compute(pixels, count, quality)

    vboxes = vboxes.map(function(vb) {
        return {
            color: vb.color,
            size: vb.vbox.count()*vb.vbox.volume(),
            amount: 0
        }
    })

    //total bin size
    var sum = vboxes.reduce(function(prev, vb) {
        return prev + vb.size
    }, 0)

    //normalize amount
    vboxes.forEach(function(vb) {
        vb.amount = vb.size/sum
    })
    return vboxes
}

function compute(pixels, count, quality, filter) {
    count = typeof count === 'number' ? (count|0) : 5
    quality = typeof quality === 'number' ? (quality|0) : 10
    if (quality <= 0)
        throw new Error('quality must be > 0')

    // Store the RGB values in an array format suitable for quantize function
    var pixelArray = [],
        step = 4*quality

    for (var i=0, len=pixels.length; i<len; i+=step) {
        var r = pixels[i + 0],
            g = pixels[i + 1],
            b = pixels[i + 2],
            a = pixels[i + 3]

        if (!filter || filter(pixels, i, pixels)) {
            pixelArray.push([r, g, b])
        }
    }

    //fix because quantize breaks on < 2
    var vboxes = quantize(pixelArray, Math.max(2,count)).vboxes
    return vboxes.map(function(vb) { //map to array structure
        return vb
    }).slice(0, count)
}
