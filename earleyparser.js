// Used as a key for the graph
function Key(dst, status){
    this.dst = dst;
    this.status = status;
}

Key.prototype.toString = function(){
    return "(" + this.dst + ", " + this.complete +")";
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

function earleyParseInput(grammars, input){
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

    //ENUM for state of edge.
    complete = 0
    inProgress = 1

    // Adds edge to the graph if not in the graph already
    function addEdge(e){
        var src = e.src;
        var dst = e.dst;
        var edgeProgression = e.edgeProgression;
        var N = edgeProgression.N;
        var RHS = edgeProgression.RHS;
        var pos = edgeProgression.pos;

        var temp = edgesIncomingTo(dst, status);
        var edgeList = temp[0];
        var edgeSet = temp[1];

        var status;
        if (RHS.length == pos) {
            status = complete;
        } else {
            status = inProgress;
        }

        if (!(edgeInList(e, edgeSet))){
            console.log("NEW!!!!!!!!!!!!!!!!!!!!!!!!!");
            edgeList.push(e);
            edgeSet.push(e);
            finalEdges.push(e);
            return true;
        }
        console.log("~~~~~~~~~~~~~~~~~~~");
        return false;
    }

    //!!! What is the format
    //seeds with all starts  
    //var RHSes = grammars["S"];
    var RHSes = rhsesAsList("S");
    for (index in RHSes){ //iterates through every RHS that has LHS as "S" (start terminal)
        var rhs = RHSes[index];
        addEdge(new Edge(0,0, new EdgeProgression("S", rhs, 0)));
    }

    for (j = 0; j < input.length + 1; j++){// !!! Why is this not 0?
        // skip in first iteration; we need to complete and predict the
        // start nonterminal S before we start advancing over the input
        console.log(">>>>>>>>>>>>>> MAIN FOR LOOP: " + j);
        if (j > 0){
            // ADVANCE TO THE NEXT TOKEN
            // for each edge (i,j-1,N -> alpha . inp[j] beta)
            // add edge (i,j,N -> alpha inp[j] . beta)
            console.log("Edges Incoming To: " + (j-1));
            var edgeList = edgesIncomingTo(j-1,inProgress)[0];
            console.log("edges coming here: ")
            console.log(edgeList);
            for (edgeIndex in edgeList){ //(i, _j, n, rhs, pos)
                var edge = edgeList[edgeIndex];
                var i = edge.src;
                var _j = edge.dst;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;

                if (_j !=j-1){
                    console.log("WTH IS THIS ASSERTION");
                    break;
                }
                console.log(pos);
                console.log(RHS);
                console.log(RHS.length);
                console.log(pos < RHS.length);
                console.log(input[j-1]);
                console.log(RHS[pos]);

                if ((pos < RHS.length) && (RHS[pos] === input[j-1])){
                    addEdge(new Edge(i,j, (new EdgeProgression(N, RHS, pos+1))));
                }
            }
        }

        var edgeWasInserted = true;
        while (edgeWasInserted){
            console.log("WHILE EDGE IS INSERTED")
            edgeWasInserted = false;
            // COMPLETE productions
            // for each edge (i,j,N -> alpha .)
            //    for each edge (k,i,M -> beta . N gamma)
            //        add edge (k,j,M -> beta N . gamma)
            console.log("COMPLETE");
            var edgeList = edgesIncomingTo(j, complete)[0];
            console.log("COMPLETE: Edges incoming to " + j);
            console.log(edgeList);
            for (edgeIndex in edgeList){ //(i,_j,n,rhs,pos)
                var edge = edgeList[edgeIndex];
                var i = edge.src;
                var _j = edge.dst;
                var edgeProgression = edge.edgeProgression;
                var N = edgeProgression.N;
                var RHS = edgeProgression.RHS;
                var pos = edgeProgression.pos;
                console.log("COMPLETE: Edges incoming to "+ i);
                if(_j != j || pos != RHS.length){
                    console.log("BREAK");
                    break;
                }
                var edgeList2 = edgesIncomingTo(i,inProgress)[0];
                console.log(edgeList2);
                for (edgeIndex2 in edgeList2){ //(k,_i,m,rhs2,pos2)
                    var edge2 = edgeList2[edgeIndex2];
                    var k = edge2.src;
                    var _i = edge2.dst;
                    var edgeProgression2 = edge2.edgeProgression;
                    var M = edgeProgression2.N;
                    var RHS2 = edgeProgression2.RHS;
                    var pos2 = edgeProgression2.pos;

                    console.log(RHS[pos2] + "  " + N);
                    if (RHS2[pos2] == N){
                        console.log("TRYING TO INSERT TO COMPLETE");
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
            console.log("PREDICTION");
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
                    console.log("WOO FIND NEW RHSes");
                    console.log(RHSes);
                    for (RHSindex in RHSes){ //iterates through the list of RHS from the every grammar with this LHS
                        var RHS = RHSes[RHSindex];
                        var x = addEdge(new Edge(j,j, new EdgeProgression(M, RHS, 0)));
                        edgeWasInserted = x || edgeWasInserted;
                    }
                }
            }
        }
    }

    return {"nodes": nodelist, "initEdges": initEdgeList, "edges": finalEdges};
 }