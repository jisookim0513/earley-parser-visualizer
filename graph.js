<<<<<<< HEAD
	//DESIGN NOTESSSS:

	//0. at each step, a new tree is created from the old tree, deleting/adding a node
	//the alternative would be to create a new tree fresh from the list each time
	//was between these two for a long time, not sure which is better

	//1. graph representation is d3 friendly
	//nodes + edges rendered separately by d3 ->
	//tree object represented 2 lists: nodes and edges.

	//2. parsing outside the scope for this project
	//input by calling the function addnode, not by parsing a textfile

	//3. design question: allow people to step backward, and if they didn't like it, delete a line of the grammar, and rewrite it?
	//i opted not to allow this for clarity's sake:
	//since we just wanted to demonstrate stepping forwards and backwards through addition of nodes it seemed to overcomplicate.
	//therefore, the list of steps is unchanged after the input step

	//4. d3 is not implemented.
	//code annotated for where d3 goes
	//positions of each node are not given... only nodes and how they relate to each other through edges
	//not sure how to do this or if d3 can figure this out by itself


  //Tree Object
  //Steplist stores node addition steps
  function Tree(steplist, nodelist, initEdgelist) {
    this.nodes = nodelist;
    this.edges = [];
    this.drawnEdges = {};
    this.steplist = steplist;
    this.initEdges = initEdgelist;
    this.current = 0;
    for (var index = 0; index < steplist.length; ++index){
      this.edges.push(steplist[index]);
    }
    for (var index = 0; index < nodelist.length; ++index){
      this.drawnEdges[nodelist[index]] = [];
    }
  };

  //Tree Functions
  //returns new tree with same properties
  //helper func used in the other 2 functions
  Tree.prototype.copy = function(){
    var newTree = new Tree(this.steplist, this.nodes);
    newTree.edges = this.edges.slice(0);
    newTree.drawnEdges = this.edges.slice(0);
    newTree.current = this.current;
    return newTree;
  }

  //Returns a Tree with removed edge
  Tree.prototype.rem = function(){
    var steplist = this.steplist;
    var newTree = this.copy();
    newTree.current = newTree.current - 1;
    return newTree;
  }

  Tree.prototype.step = function(){
    var steplist = this.steplist;
    var newTree = this.copy();
    newTree.current = newTree.current + 1;
    newTree.edges.push(steplist[this.current]);
    return newTree;
  }

  //adds a node to the liste
  //steps forward in the animation
  Tree.prototype.addEdge = function(node, tonode, desc){
    var arr = [node, tonode, desc];
    this.steplist.push(arr);
    this.edges.push(arr);
  }

  Tree.prototype.isAmb = function(edge){
    var src = getEdgeSource(edge);
    var dest = getEdgeDest(edge);
    var lhs = (getEdgeDesc(edge).split("->"))[0];
    var drawn = this.drawnEdges[src];
    for (var index = 0; index < drawn.length; ++index){
      var e = drawn[index];
      if (dest == getEdgeDest(e)) {
        if (lhs == (getEdgeDesc(e).split("->"))[0] && getEdgeDesc(edge) != getEdgeDesc(e)) {
          alert("Ambiguous!");
        }
      }
    }
  };

  // Selectors for edge components
  function getEdgeSource(edge){
    return edge? edge[0] : NullEdgeException();
  }

  function getEdgeDest(edge){
    return edge? edge[1] : NullEdgeException();
  }

  function getEdgeDesc(edge){
    return edge? edge[2] : NullEdgeException();
  }

  function NullEdgeException(){
    throw "Null Edge";
  }

  //steps backward a step and animates
  function stepBack(nowtree){
    var backtree = nowtree.rem();
    animate(nowtree, backtree);
    nowtree.current = nowtree.current - 1;
  };

  //steps forward a step and animates
  function stepForward(nowtree){
    if (nowtree.steplist.length < nowtree.current + 1){
      alert("no more steps forward");
    } else {
      	var forwardtree = nowtree.step();
      	animate(nowtree, forwardtree);
      	nowtree.current = nowtree.current + 1;
      	console.log("Current is  " + nowtree.current)
    }
  };
	    
=======
/* Used to construct and draw graph for early parsing */

//Graph Object
//Steplist stores node addition steps
function Graph(steplist, nodelist, initEdgelist) {
  this.nodes = nodelist;
  this.edges = [];
  this.drawnEdges = {};
  this.steplist = steplist;
  this.initEdges = initEdgelist;
  this.current = 0;
  for (var index = 0; index < steplist.length; ++index){
    this.edges.push(steplist[index]);
  }
  for (var index = 0; index < nodelist.length; ++index){
    this.drawnEdges[nodelist[index]] = [];
  }
};

//Graph Functions
//returns new graph with same properties
//helper func used in the other 2 functions
Graph.prototype.copy = function(){
  var newGraph = new Graph(this.steplist, this.nodes);
  newGraph.edges = this.edges.slice(0);
  newGraph.drawnEdges = this.edges.slice(0);
  newGraph.current = this.current;
  return newGraph;
}

//Returns a Graph with removed edge
Graph.prototype.rem = function(){
  var steplist = this.steplist;
  var newGraph = this.copy();
  newGraph.current = newGraph.current - 1;
  return newGraph;
}

Graph.prototype.step = function(){
  var steplist = this.steplist;
  var newGraph = this.copy();
  newGraph.current = newGraph.current + 1;
  newGraph.edges.push(steplist[this.current]);
  return newGraph;
}

//adds a node to the liste
//steps forward in the animation
Graph.prototype.addEdge = function(node, tonode, desc){
  var arr = [node, tonode, desc];
  this.steplist.push(arr);
  this.edges.push(arr);
}

Graph.prototype.isAmb = function(edge){
  var src = getEdgeSource(edge);
  var dest = getEdgeDest(edge);
  var lhs = (getEdgeDesc(edge).split("->"))[0];
  var drawn = this.drawnEdges[src];
  for (var index = 0; index < drawn.length; ++index){
    var e = drawn[index];
    if (dest == getEdgeDest(e)) {
      if (lhs == (getEdgeDesc(e).split("->"))[0] && getEdgeDesc(edge) != getEdgeDesc(e)) {
        alert("Ambiguous!");
      }
    }
  }
};

// Selectors for edge components
function getEdgeSource(edge){
  return edge? edge[0] : NullEdgeException();
}

function getEdgeDest(edge){
  return edge? edge[1] : NullEdgeException();
}

function getEdgeDesc(edge){
  return edge? edge[2] : NullEdgeException();
}

function NullEdgeException(){
  throw "Null Edge";
}

//steps backward a step and animates
function stepBack(nowGraph){
  var backGraph = nowGraph.rem();
  animate(nowGraph, backGraph);
  nowGraph.current = nowGraph.current - 1;
};

//steps forward a step and animates
function stepForward(nowGraph){
  if (nowGraph.steplist.length < nowGraph.current + 1){
    alert("no more steps forward");
  } else {
      var forwardGraph = nowGraph.step();
      animate(nowGraph, forwardGraph);
      nowGraph.current = nowGraph.current + 1;
      console.log("Current is  " + nowGraph.current)
  }
};
    
>>>>>>> 15b789354888dd84c4219182f9d7fbdd286e06c8

var circleDist = 200;
var circleY = 100;
var lineMarginX = 17;
var lineMarginY = 10;
var lineMarginBetweenSteps = 20;
var textMarginX = -10;
var textMarginY = 10;
var nodeHeight = 150;


var curved = d3.svg.line()
<<<<<<< HEAD
              .x(function(d) { return d.x; })
              .y(function(d) { return d.y; })
              .interpolate("cardinal")
              .tension(0);

function drawTree(tree){
  	var svg = d3.select('body').select('svg');
  	drawNodes(tree);
    drawInitEdges(tree);
}

function drawNodes(tree){
  var svg = d3.select('body').select('svg');
  var circles = svg.selectAll("circle").data(tree.nodes).enter().append("circle");
  circles.style("opacity",0)
  		   .transition().duration(100)
  		   .style("opacity", 1)
  		   .attr("cx", function(d,i){ return i*circleDist + 100})
  		   .attr("cy", function(d,i){ return circleY;})
  		   .attr("r", 20)
  		   .attr("fill", "skyblue");
}

function drawInitEdges(tree){
  var svg = d3.select('body').select('svg');
  var edges = svg.selectAll("line").data(tree.initEdges).enter().append("line");
  var labels = svg.selectAll("text[id=init-label]").data(tree.initEdges).enter().append("text");
  edges.style("opacity",0)
       .transition().duration(100)
       .style("opacity", 1)
       .attr("x1", function(d){ return getEdgeSource(d)*circleDist+100+lineMarginX; })
       .attr("y1", circleY)
       .attr("x2", function(d){ return getEdgeDest(d)*circleDist+100-lineMarginX; })
       .attr("y2", circleY)
       .attr("stroke-width", 1)
       .attr("stroke", "grey");

  labels.style("opacity", 0)
        .transition().duration(100)
        .style("opacity", 1)
        .attr("id", "init-label")
        .attr("x", function(d){ return ((getEdgeSource(d)+getEdgeDest(d))*circleDist+180+2*lineMarginX)/2+textMarginX; })
        .attr("y", circleY+textMarginY)
        .text(function(d){ return getEdgeDesc(d); })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "teal");
}

// Adds elements (with animation) whenever we draw an edge between two nodes
function animate(oldTree, newTree){
	 //insert d3 here
	 var svg = d3.select("body").select("svg");
	 var paths = svg.selectAll("path"); // Paths are edges
	 var labels = svg.selectAll("text[id=label]");
	 var prevCounter = oldTree.current;
	 var nextCounter = newTree.current;

	 if(prevCounter < nextCounter){ // Steps forward
	 	var edgeToAdd = oldTree.edges[oldTree.current];
    var numEdges = oldTree.drawnEdges[getEdgeSource(edgeToAdd)].length;
    oldTree.isAmb(edgeToAdd);
    oldTree.drawnEdges[getEdgeSource(edgeToAdd)].push(edgeToAdd);
    var src = getEdgeSource(edgeToAdd);
    var dest = getEdgeDest(edgeToAdd);
    var diff = dest - src - 1;
    var x1 = src*circleDist + 100 + lineMarginX;
	 	var x2 = dest*circleDist + 100 - lineMarginX;
    svg.append("path")
       .style("opacity", 0)
       .transition().duration(100)
       .style("opacity", 1)
       .attr("d", curved([{x:x1, y:circleY+lineMarginY}, {x:(x1+x2)/2,y:nodeHeight+lineMarginBetweenSteps*(numEdges+diff)},{x:x2,y:circleY+lineMarginY}]))
       .style("stroke", "darkgrey").style("fill", "none");

    svg.append("text")
       .style("opacity", 0)
       .transition().duration(100)
       .style("opacity", 1)
         .attr("id", "label")
         .attr("x", function() { return (x1+x2)/2+textMarginX; })
         .attr("y", function() { return nodeHeight+lineMarginBetweenSteps*(numEdges+diff)+textMarginY; })
         .text(getEdgeDesc(edgeToAdd))
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "teal");

	 } else { // steps backwards
	 	var edgeToRemove = newTree.edges[newTree.current];
	 	paths[0][newTree.current].remove();
	 	labels[0][newTree.current].remove();
    var edges = oldTree.drawnEdges[getEdgeSource(edgeToRemove)];
    edges.splice(edges.indexOf(edgeToRemove), 1);
	 }
=======
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("cardinal")
            .tension(0);

function drawGraph(graph){
  var svg = d3.select('body').select('svg');
  console.log("cleaning up svg");
  svg.html(""); //Cleans SVG
  drawNodes(graph);
  drawInitEdges(graph);
}

function drawNodes(graph){
var svg = d3.select('body').select('svg');
var circles = svg.selectAll("circle").data(graph.nodes).enter().append("circle");
circles.style("opacity",0)
       .transition().duration(100)
       .style("opacity", 1)
       .attr("cx", function(d,i){ return i*circleDist + 100})
       .attr("cy", function(d,i){ return circleY;})
       .attr("r", 20)
       .attr("fill", "skyblue");
}

function drawInitEdges(graph){
var svg = d3.select('body').select('svg');
var edges = svg.selectAll("line").data(graph.initEdges).enter().append("line");
var labels = svg.selectAll("text[id=init-label]").data(graph.initEdges).enter().append("text");
edges.style("opacity",0)
     .transition().duration(100)
     .style("opacity", 1)
     .attr("x1", function(d){ return getEdgeSource(d)*circleDist+100+lineMarginX; })
     .attr("y1", circleY)
     .attr("x2", function(d){ return getEdgeDest(d)*circleDist+100-lineMarginX; })
     .attr("y2", circleY)
     .attr("stroke-width", 1)
     .attr("stroke", "grey");

labels.style("opacity", 0)
      .transition().duration(100)
      .style("opacity", 1)
      .attr("id", "init-label")
      .attr("x", function(d){ return ((getEdgeSource(d)+getEdgeDest(d))*circleDist+180+2*lineMarginX)/2+textMarginX; })
      .attr("y", circleY+textMarginY)
      .text(function(d){ return getEdgeDesc(d); })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "teal");
}

// Adds elements (with animation) whenever we draw an edge between two nodes
function animate(oldGraph, newGraph){
 //insert d3 here
 var svg = d3.select("body").select("svg");
 var paths = svg.selectAll("path"); // Paths are edges
 var labels = svg.selectAll("text[id=label]");
 var prevCounter = oldGraph.current;
 var nextCounter = newGraph.current;

 if(prevCounter < nextCounter){ // Steps forward
  var edgeToAdd = oldGraph.edges[oldGraph.current];
  var numEdges = oldGraph.drawnEdges[getEdgeSource(edgeToAdd)].length;
  oldGraph.isAmb(edgeToAdd);
  oldGraph.drawnEdges[getEdgeSource(edgeToAdd)].push(edgeToAdd);
  var src = getEdgeSource(edgeToAdd);
  var dest = getEdgeDest(edgeToAdd);
  var diff = dest - src - 1;
  var x1 = src*circleDist + 100 + lineMarginX;
  var x2 = dest*circleDist + 100 - lineMarginX;
  svg.append("path")
     .style("opacity", 0)
     .transition().duration(100)
     .style("opacity", 1)
     .attr("d", curved([{x:x1, y:circleY+lineMarginY}, {x:(x1+x2)/2,y:nodeHeight+lineMarginBetweenSteps*(numEdges+diff)},{x:x2,y:circleY+lineMarginY}]))
     .style("stroke", "darkgrey").style("fill", "none");

  svg.append("text")
     .style("opacity", 0)
     .transition().duration(100)
     .style("opacity", 1)
       .attr("id", "label")
       .attr("x", function() { return (x1+x2)/2+textMarginX; })
       .attr("y", function() { return nodeHeight+lineMarginBetweenSteps*(numEdges+diff)+textMarginY; })
       .text(getEdgeDesc(edgeToAdd))
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "teal");

 } else { // steps backwards
  var edgeToRemove = newGraph.edges[newGraph.current];
  paths[0][newGraph.current].remove();
  labels[0][newGraph.current].remove();
  var edges = oldGraph.drawnEdges[getEdgeSource(edgeToRemove)];
  edges.splice(edges.indexOf(edgeToRemove), 1);
 }
>>>>>>> 15b789354888dd84c4219182f9d7fbdd286e06c8
};