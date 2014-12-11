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
 *   "procedures": ["+"]
 * };
 */

 // handles only Grammar, Input, and Assoc for now
 function parse(text){
 	var ast = {}
 	var splited = text.split(" ");
 	switch(splited[0].toLowerCase()) {
 		case "grammar":
 			ast["type"] = "grammar";
 			ast = handleGrammar(text.substring(7, text.length), ast);
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
			throw new ExecError("Unknown input type: " + splited[0]);
			break;
 	}
 	return ast;
 }

 function handleGrammar(text, ast){
 	ast["deprec"] = null;
 	ast["prec"] = null;
 	var byArrow = text.split("->");
 	ast["lhs"] = byArrow[0];
 	if (byArrow[1].indexOf("%dprec") > -1) {

 	} else if (byArrow[1].indexOf("%prec") > -1) {
 		
 	} else {
 		ast["rhs"] = byArrow[1];
 	}
 	var byDprec = byArrow.split("%deprec");
 	var byPrec = byArrow.split("%prec");
 }

 function handleAssoc(text, ast){

 }