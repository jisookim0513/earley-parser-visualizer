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
function Grammar(lhs, rhs){
	return lhs + " - > " + rhs;
}

//Adds grammar
function addGrammar(lhs, rhs){
	if (lhs in grammars) {
		if (! (rhs in grammars[lhs])){
			grammars[lhs].push(rhs);
		} else {
			throw new ExecError("Grammar declared previously");
		}
	} else {
		grammars[lhs] = [rhs];
	}
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
			// Adds to this grammar
			var lhs = ast.lhs;
			var rhs = ast.rhs;
			var grammar = Grammar(lhs,rhs);
			addGrammar(lhs, rhs);

			//Adds dprec of this grammar if it exists
			var dprec = ast.dprec;
			if (dprec != null){
				addDPrec(grammar, dprec);
			}

			// Adds dprec based on operator's precendence
			var operator = ast.prec;
			if (operator != null){
				var prec = getOpPrec(operator);
				addDPrec(grammar, prec);
			} 
			return null;
			break;

		case "input" :
			var value = ast.value;
			return {"grammars":grammars, "input":value};
			break;

		case "assoc":
			var operators = ast.operators;
			var assoc = ast.direction;
			var precLevel = assocs.counter + 1;
			assocs.counter += 1;
			for (i = 0; i < operators.length; i++) {
				var operator = operators[i];
				if (operator in assocs) {
					throw new ExecError("Associativity/precedence already declared: " + operator);
				}
				assocs[operator] = [precLevel, assoc];
			}
			return null
			break;

		default: 
			throw new ExecError("Unknown ast type: " + ast.type);
			break;
	}

}