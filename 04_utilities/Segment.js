// shortens the segment command so it can be called in javascript more easily
function segment(name, r, g, b) {
    Ds.SendStringCommand(`coveLights segment ${name} ${r} ${g} ${b}`)
}
// sets all segments to black
function reset() {
    var i = 0
    while (i <= 127) {
        segment(i, 0, 0, 0)
        var i = i + 1
    }
}


reset()

