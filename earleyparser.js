function earleyParseInput(grammars, input){
    //grammar represented by rhs, prec, lhs
    //a dictionary of edges
    var initEdgeList = [];
    var nodelist = [];

    //initiation
    for (count = 0; count < input.length; count++){
        nodelist.push(count);
        initEdgeList.push([count, count + 1, input[count]]);
        if (count == input.length - 1) {
            nodelist.push(count+1);
        }
    }

    console.log(nodelist);
    console.log(initEdgeList);

    var graph = {};

    function edgesIncomingTo(dst,status){
        var key = (dst,status);
        if (key in graph){
            return graph[key];
        }else{
            return {};
        }
    } 

	function match(token, input){
        if (token == input){
            return true;
        }else{
            return false;
        }
    }

    function addEdge(e){
        if (e[3].length == pos){
            //complete
            var x = edgesIncomingTo(e[1],0);
            edgeSet = x;
            if (e in edgeSet){
                //if it's already in the set, it's ambiguous, use prec
                //TODO: check assoc
            }else{                
                graph[(e[1], 0)] = graph[(e[1], 0)].add(e);
            }
        }else{
            //in progress
            var x = edgesIncomingTo(e[1],1);
            edgeSet = x;
            if (!(e in edgeSet)){
                graph[(e[1], 1)] = graph[(e[1], 1)].add(e);
            }
        }
    
        return (false, true);
    }
    //seeds with all starts  
    for (production in grammars["S"][0]){ //iterates through every RHS that has LHS as "S" (start terminal)
        addEdge((0,0,"S", production, 0));
    }

    for (j = 1; j < input.length + 1; j ++){
        if (j > 0){
            for (edgeIndex in edgesIncomingTo(j-1,1)[0]){ //(i, _j, n, rhs, pos)
                var edge = edgesIncomingTo(j-1,1)[0][edgeIndex];
                if ((edge[4] < edge[3].length) && (match(edge[3][edge[4]], input[j-1]))){
                    addEdge(edge);
                }
            }
        }

        //complete
        edgeWasInserted = true;
        while (edgeWasInserted){
            edgeWasInserted = false;
            for (edgeIndex in edgesIncomingTo(j,0)[0]){ //(i,_j,n,rhs,pos)
                var edge = edgesIncomingTo(j,0)[0][edgeIndex];
                for (edgeIndex2 in edgesIncomingTo(edge[0],1)[0]){ //(k,_i,m,rhs2,pos2)
                    var edge2 = edgesIncomingTo(edge[0],1)[0][edgeIndex2];
                    if (edge2[3][edge2[4]]==edge[2]){
                        var x = addEdge((edge2[0],j,edge2[2],edge2[3],edge2[4]+1));
                        var inserted = x[0];
                        var amb = x[1];
                        edgeWasInserted = inserted || edgeWasInserted;
                    }
                }
            }
        }
//predict          
        for (edgeIndex in edgesIncomingTo(j,1)[0]){ //(i,_j,n,rhs,pos)
            var edge = edgesIncomingTo(j,1)[0][edgeIndex];
            if (edge[3][edge[4]] in string.ascii_uppercase){
                var m = edge[3][edge[4]];
                //!!!
                for (edge2 in grammars[m][0]){ //iterates through the list of RHS from the every grammar with this LHS
                    var edge2 = grammars[m][0][3];
                    var x = addEdge((j,j,m,edge2[3],0));
                    var inserted = x[0];
                    var amb = x[1];
                    edgeWasInserted = inserted || edgeWasInserted;
                }
            }
        }
    }

    //convert list of edges to format
    var finalEdge = [];
    for (edgeList in graph){ //edgeList is a list of (source, destination, n, rhs, pos)
        for (edge in edgeList){
            finalEdge.append([source, destination, edge[2] + "->" + edge[3]]);
        }
    }
    return {"nodes": nodelist, "initEdges": initEdgeList, "edges": finalEdge};
 }