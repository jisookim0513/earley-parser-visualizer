/* Parser for grammar/standard input.
 * Examples:
 * input 1 + 1
 * { “type”: “input”,
 *   “value”: “1 + 1”
 * }
 * { “type”: “grammar”,
 *   “lhs” : “E”,
 *   “rhs” : “E;E”,
 *   “dprec” : null,
 *   “prec”: null,
 * }
 * assoc left +
 * { "type": "assoc", 
 *	 "direction": "left",
 *   "procedures": ["+"]
 * };
 */

 // handles only Grammar, Input, and Assoc for now
 function parseInput(text){
 	var ast = {}
 	var splited = text.split(" ");
 	switch(splited[0].toLowerCase()) {
 		case "grammar":
 			ast["type"] = "grammar";
 			ast = handleGrammar(text.substring(8, text.length), ast);
 			break;

 		case "input":
 			ast["type"] = "input";
 			ast["value"] = text.substring(6, text.length);
 			break;

 		case "assoc":
 			ast["type"] = "assoc";
 			ast = handleAssoc(text.substring(6, text.length), ast);
 			break;

 		default: 
 			alert("Unknown input type: " + splited[0]);
			throw new ExecError("Unknown input type: " + splited[0]);
			break;
 	}
 	return ast;
 }

 function handleGrammar(text, ast){
 	ast["dprec"] = null;
 	ast["prec"] = null;
 	var byArrow = text.split("->");
 	ast["lhs"] = (byArrow[0].split(" "))[0];
 	var dprecIndex = byArrow[1].indexOf("%dprec");
 	var precIndex = byArrow[1].indexOf("%prec");
 	if (dprecIndex > -1) {
 		var byDprec = byArrow[1].split("%dprec");
 		ast["rhs"] = byDprec[0].substring(1, byDprec[0].length-1);
 		ast["dprec"] = parseInt(byDprec[1]);
 	} else if (precIndex > -1) {
 		var byPrec = byArrow[1].split("%prec");
 		ast["rhs"] = byPrec[0].substring(1, byPrec[0].length-1);
 		ast["prec"] = byPrec[1].substring(1, byPrec[1].length);
 	} else if (dprecIndex > -1 && precIndex > -1) {
 		alert("Can't have %dprec and %prec at the same time!");
 		throw new ExecError("Can't have %dprec and %prec at the same time!");
 	} else {
 		ast["rhs"] = byArrow[1].substring(1, byArrow[1].length);
 	}
 	return ast;
 }

 function handleAssoc(text, ast){
 	var bySpace = text.split(" ");
 	ast["direction"] = bySpace[0];
 	var rest = text.substring(5, text.length);
 	if (ast.direction == "right") {
 		rest = text.substring(6, text.length);
 	}
 	if (ast.direction != "left" && ast.direction != "right") {
 		alert("Association direction can only be either left or right!");
 		throw new ExecError("Association direction can only be either left or right!"); 		
 	}
 	var byComma = rest.split(",");
 	var procs = [];
 	for (i = 0; i < byComma.length; i++) {
 		if (byComma[i] != " ") {
 			procs.push(byComma[i]);
 		}
 	}
 	ast["procedures"] = procs;
 	return ast;
 }
 