// Interpreter that takes in an AST from Jison
// Keeps track of grammara and input that will be passed in to the Earley parser

var grammars = {};
// Key is string representing binary operator. Value is an array. 
//First element int, presenting the operator's priority. 
//Second element "left" or "right" which is the associtiavity
var assocs = {}; 
assocs.counter = 0;
var dprecs = {}; // Key is Grammar. Value is an int presenting the rule's precedence

function ExecError(m) {
  this.message = m;
}
ExecError.prototype = Error;
ExecError.prototype.constructor = ExecError;

//ADT to rerepsent grammar for dprecs
function Grammar(lhs, rhs, dprec){
	return {"lhs": lhs, "rhs": {"rhs": rhs, "dprec": dprec}};
}

//Adds grammar
function addGrammar(grammar){
	var lhs = grammar.lhs;
	var rhs = grammar.rhs;
	var dprec = grammar.dprec;
	if (lhs in grammars) {
		console.log(rhs);
		var skip = false;
		for (i=0; i<grammars[lhs].length; i++) {
			if (grammars[lhs][i]["rhs"] == rhs["rhs"] && grammars[lhs][i]["dprec"] != rhs["dprec"]) {
				grammars[lhs][i]["dprec"] = rhs["dprec"];
				skip = true;
			} else if (grammars[lhs][i]["rhs"] == rhs["rhs"] && grammars[lhs][i]["dprec"] == rhs["dprec"]){
				throw new ExecError("Grammar declared previously");
			}
		}
		if (!skip) {
			grammars[lhs].push(rhs);
		}
	} else {
		grammars[lhs] = [rhs];
	}
	console.log(grammars)
}


function addDPrec(grammar, dprec){
	console.log(dprec);
	if (dprec > 0) {
		dprecs[grammar] = dprec;
	} else {
		throw new ExecError("Illegal precedence: " + dprec);
	}
}

// Returns associtivaity of operator. either "left" or "right"
function getOpAssoc(op){
	if (op in assocs) {
		return assocs[op][1];
	} else {
		throw new Error("Unknown associtiavity: " + op);
	}
}

// Returns the precedence level of an operator
function getOpPrec(op){
	if (op in assocs){
		return assocs[op][0];
	} else {
		throw new Error("Unknown Operator Precedence: " + op);
	}
}

function assertNumber(x){
	if( typeof(x) != "number"){
		throw new ExecError("Not a number: " + x);
	}
}

function eval(ast) {
	switch(ast.type) {
		case "grammar" :
			//Adds dprec of this grammar if it exists
			var dprec = ast.dprec;
			if (dprec != null){
				addDPrec(grammar, dprec);
			}

			// Adds dprec based on operator's precendence
			var operator = ast.prec;
			if (operator != null){
				dprec = getOpPrec(operator);
				addDPrec(grammar, prec);
			} 

			// Adds to this grammar
			var grammar = Grammar(ast.lhs, ast.rhs, dprec);
			console.log(grammar);
			addGrammar(grammar);
			return null;
			break;

		case "input" :
			var value = ast.value;
			return {"grammars":grammars, "input":value};
			break;

		case "assoc":
			var operators = ast.procedures;
			var direction = ast.direction;
			var precLevel = assocs.counter + 1;
			assocs.counter += 1;
			for (i = 0; i < operators.length; i++) {
				var operator = operators[i];
				if (operator in assocs) {
					throw new ExecError("Associativity/precedence already declared: " + operator);
				}
				assocs[operator] = [precLevel, direction];
			}
			return null
			break;

		default: 
			throw new ExecError("Unknown ast type: " + ast.type);
			break;
	}

}