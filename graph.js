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

var circleDist = 200;
var circleY = 100;
var lineMarginX = 17;
var lineMarginY = 10;
var lineMarginBetweenSteps = 20;
var textMarginX = -10;
var textMarginY = 10;
var nodeHeight = 150;


var curved = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("cardinal")
            .tension(0);

function drawGraph(graph){
  var svg = d3.select('body').select('svg');
  //circleDist = svg.style("width")/graph.nodes.length;
  console.log("cleaning up svg");
  svg.html(""); //Cleans SVG
  drawNodes(graph);
  drawInitEdges(graph);
}

function drawNodes(graph){
var svg = d3.select('body').select('svg');
var circles = svg.selectAll("circle").data(graph.nodes).enter().append("circle");
circleDist = parseInt(svg.style("width").substring(0,svg.style("width").length-2)) / (graph.nodes).length;
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
};