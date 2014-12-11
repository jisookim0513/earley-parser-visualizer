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
 * assoc +
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

 }

 function handleAssoc(text, ast){

 }