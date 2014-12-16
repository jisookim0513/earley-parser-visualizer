//ENUM for state of edge.
complete = 0
inProgress = 1

// Used as a key for the graph
function Key(dst, status){
    this.dst = dst;
    this.status = status;
}

Key.prototype.toString = function(){
    return "(" + this.dst + ", " + this.status +")";
}

// Used to parse key and return the destination
function getDestProg(key){
    var dest_prog = key.substring(1, key.length - 1).split(", ");
    return dest_prog;
}

//Used to represent an edge
function Edge(src, dst, edgeProgression){
    this.src = src;
    this.dst = dst;
    this.edgeProgression = edgeProgression;
}

//(S -> E+E, 0)
function EdgeProgression(N, RHS, pos){
    this.N = N;
    this.RHS = RHS;
    this.pos = pos;
}

//BECAUSE JAVASCRIPT HASH CANT HOLD TUPLE OR OBJECTS
function edgeInList(edge, lst){
    for (index in lst){
        var otherEdge = lst[index];
        if(edge.src == otherEdge.src && edge.dst == otherEdge.dst && equalProgression(edge.edgeProgression, otherEdge.edgeProgression)){
            return true;
        }
    }
    return false;
}

function equalProgression(prog1, prog2){
    return prog1.N == prog2.N && prog1.RHS == prog2.RHS && prog1.pos == prog2.pos;
}

function getDprec(rhs, lstRHS){
    for (index in lstRHS){
        if (lstRHS[index]["rhs"] == rhs){
            return lstRHS[index]["dprec"];
        }
    }
    return -1;
}

// returns the index of the edge in the list with given properties
function getIndexOfEdge(dest, src, lhs, rhs, pos, edgeList){
    for (edgeIndex in edgeList){
        var edge = edgeList[edgeIndex];
        var srcE = edge.src;
        var destE = edge.dst;
        var edgeProgression = edge.edgeProgression;
        var N = edgeProgression.N;
        var RHS = edgeProgression.RHS;
        var posE = edgeProgression.pos;
        if (src == srcE && dest == destE && lhs == N && rhs == RHS && pos == posE) {
            return edgeIndex;
        }
    }
    return -1;
}

function earleyParseInput(grammars, input, completeEdgesOnly){
    //grammar represented by rhs, prec, lhs
    //a dictionary of edges
    var initEdgeList = [];
    var nodelist = [];
    var finalEdges = []; // List of edges added that this function returns at the end

    //initiation
    for (count = 0; count < input.length; count++){
        nodelist.push(count);
        initEdgeList.push([count, count + 1, input[count]]);
        if (count == input.length - 1) {
            nodelist.push(count+1);
        }
    }

    // Key is key representation.
    // Value is an array. 1st element is list of edges. 2nd is set of edges
    var graph = {};

    function edgesIncomingTo(dst,status){
        var key = new Key(dst,status);
        if (key in graph){ //!!! What did Jisoo say? I forgot...
            return graph[key];
        }else{
            graph[key] = [[],[]];
            return graph[key];
        }
    } 

    function isUpperCase(c){
        return /^[A-Z]/.test(c);
    }

    // Adds edge to the graph if not in the graph already
    function addEdge(e){
        var src = e.src;
        var dst = e.dst;
        var edgeProgression = e.edgeProgression;
        var N = edgeProgression.N;
        var RHS = edgeProgression.RHS;
        var pos = edgeProgression.pos;
        var status;
        if (RHS.length == pos) {
            status = complete;
        } else {
            status = inProgress;
        }
        var temp = edgesIncomingTo(dst, status);
        var edgeList = temp[0];
        var edgeSet = temp[1];

        if (!(edgeInList(e, edgeSet))){
            edgeList.push(e);
            edgeSet.push(e);
            if(!completeEdgesOnly || (completeEdgesOnly && status === complete)){
                finalEdges.push(e);
            }
            return true;
        }
        
        return false;
    }

    //seeds with all starts  
    var RHSes = rhsesAsList("S");
    for (index in RHSes){ //iterates through every RHS that has LHS as "S" (start terminal)
        var rhs = RHSes[index];
        addEdge(new Edge(0,0, new EdgeProgression("S", rhs, 0)));
    }

    for (j = 0; j < input.length + 1; j++){// !!! Why is this not 0?
        // skip in first iteration; we need to complete and predict the
        // start nonterminal S before we start advancing over the input
        
        if (j > 0){
            // ADVANCE TO THE NEXT TOKEN
            // for each edge (i,j-1,N -> alpha . inp[j] beta)
            // add edge (i,j,N -> alpha inp[j] . beta)
            
            var edgeList = edgesIncomingTo(j-1,inProgress)[0];            
            for (edgeIndex in edgeList){ //(i, _j, n, rhs, pos)
                var edge = edgeList[edgeIndex];
                var i = edge.src;
                var _j = edge.dst;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;

                if (_j !=j-1){    
                    break;
                }
                
                if ((pos < RHS.length) && (RHS[pos] === input[j-1])){
                    addEdge(new Edge(i,j, (new EdgeProgression(N, RHS, pos+1))));
                }
            }
        }

        var edgeWasInserted = true;
        while (edgeWasInserted){
            edgeWasInserted = false;
            // COMPLETE productions
            // for each edge (i,j,N -> alpha .)
            //    for each edge (k,i,M -> beta . N gamma)
            //        add edge (k,j,M -> beta N . gamma)
            
            var edgeList = edgesIncomingTo(j, complete)[0];
            
            
            for (edgeIndex in edgeList){ //(i,_j,n,rhs,pos)
                var edge = edgeList[edgeIndex];
                var i = edge.src;
                var _j = edge.dst;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;
                
                if(_j != j || pos != RHS.length){
                    
                    break;
                }
                var edgeList2 = edgesIncomingTo(i,inProgress)[0];
                
                for (edgeIndex2 in edgeList2){ //(k,_i,m,rhs2,pos2)
                    var edge2 = edgeList2[edgeIndex2];
                    var k = edge2.src;
                    var _i = edge2.dst;
                    var edgeProgression2 = edge2.edgeProgression;
                    var M = edgeProgression2.N;
                    var RHS2 = edgeProgression2.RHS;
                    var pos2 = edgeProgression2.pos;

                    
                    if (RHS2[pos2] == N){
                        
                        var x = addEdge(new Edge(k,j, new EdgeProgression(M, RHS2, pos2+1)));
                        edgeWasInserted = x || edgeWasInserted;
                    }
                }
            }
        

            // PREDICT what the parser is to see on input (move dots in edges 
            // that are in progress)
            //
            // for each edge (i,j,N -> alpha . M beta)
            //    for each production M -> gamma
            //          add edge (j,j,M -> . gamma)
            
            var edgeList = edgesIncomingTo(j,inProgress)[0];
            for (edgeIndex in edgeList){ //(i,_j,n,rhs,pos)
                var edge = edgeList[edgeIndex];
                var i = edge.src;
                var _j = edge.dst;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;

                // Non terminals are upper case
                if (isUpperCase(RHS[pos])) {
                    var M = RHS[pos];
                    //prediction: for all rules D->alpha add edge (j,j,.alpha)
                    // !!! What is the format
                    //var RHSes = grammars[M];
                    var RHSes = rhsesAsList(M);
                    
                    
                    for (RHSindex in RHSes){ //iterates through the list of RHS from the every grammar with this LHS
                        var RHS = RHSes[RHSindex];
                        var x = addEdge(new Edge(j,j, new EdgeProgression(M, RHS, 0)));
                        edgeWasInserted = x || edgeWasInserted;
                    }
                }
            }
        }
    }

    // Checking ambiguity and modifying "graph" according to dprec (if given)
    var is_amb = false;
    var ambiguousStuff = [];
    console.log(graph);
    for (key in graph) {
        var dest = getDestProg(key)[0];
        var comp = getDestProg(key)[1];
        //console.log(getDestProg(key));
        if (comp == complete) {
            console.log("complete edges");
            var edgeList = edgesIncomingTo(dest, comp)[0];
            var edgeSet = edgesIncomingTo(dest, comp)[1];
            console.log(edgeList);
            for (edgeIndex in edgeList) {
                var edge = edgeList[edgeIndex];
                var src = edge.src;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;
                for (edgeIndex2 in edgeSet) {
                    var edge2 = edgeSet[edgeIndex2];
                    var src2 = edge2.src;
                    var edgeProgression2 = edge2.edgeProgression;
                    var N2 = edgeProgression2.N;
                    var RHS2 = edgeProgression2.RHS;
                    var pos2 = edgeProgression2.pos;
                    if (getIndexOfEdge(dest, src2, N2, RHS2, pos2, finalEdges) > -1) {
                        if (src == src2 && N == N2 && RHS != RHS2 && pos == pos2) {
                            var dprecRHS = getDprec(RHS, grammars[N]);
                            var dprecRHS2 = getDprec(RHS2, grammars[N]);
                            console.log("dprecRHS: " + dprecRHS);
                            console.log("dprecRHS2: " + dprecRHS2);
                            if (dprecRHS == dprecRHS2) {
                                is_amb = true;
                                ambiguousStuff.push(N + "->" + RHS);
                                ambiguousStuff.push(N + "->" + RHS2);
                            } else if (dprecRHS < dprecRHS2) {
                                var index = getIndexOfEdge(dest, src2, N2, RHS2, pos2, finalEdges);
                                if (index > -1) {
                                    finalEdges.splice(index, 1);
                                }
                            } else if (dprecRHS > dprecRHS2) {
                                var index = getIndexOfEdge(dest, src, N, RHS, pos, finalEdges);
                                if (index > -1) {
                                    finalEdges.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (is_amb) {
        var ambiguousOnes = "The following grammars are causing ambiguity: \n";
        for (index in ambiguousStuff) {
            ambiguousOnes = ambiguousOnes + ambiguousStuff[index] + "\n";
        }
        alert(ambiguousOnes);
    }
    console.log(is_amb);
    console.log(finalEdges);
    return {"nodes": nodelist, "initEdges": initEdgeList, "edges": finalEdges};
 }