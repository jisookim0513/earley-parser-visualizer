/* HW 5 Earley parser interpreted in JS */

function parse(grammar, inp, incr) {
	// default value: ([], set()) in python -> [[], Set()]
	var graph = {}

    // status of edge is either complete or inProgress
    var complete = 0
    var inProgress = 1

    // return [list,set] of edges 
    function edgesIncomingTo(dst,status) {
    	var key = [dst,status]
        return graph[key]
    }
}