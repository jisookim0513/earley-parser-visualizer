// Interpreter that takes in an AST from Jison
// Keeps track of grammara and input that will be passed in to the Earley parser

console.log("interpeter loadade");
var grammars = {};
var assocs = {}; // Key is string representing binary operator. Value is an int, presenting the operator's precedence. 
assocs.counter = 0;
var dprecs = {}; // Key is Grammar. Value is an int presenting the operator's precedner
var input = null;

function ExecError(m) {
  this.message = m;
}
ExecError.prototype = Error;
ExecError.prototype.constructor = ExecError;

//ADT to rerepsent grammar for dprecs
function Grammar(lhs, rhs){
	return lhs + " - > " + rhs;
}

//Helper to check precedence of grammar in dprecs. Because dictionaries by default check for referential equality
function grammarPrec(grammar){
	for (var gram in dprecs) {
		if (dprecs.hasOwnProperty(gram) && gram.lhs == grammar.lhs && gram.rhs == grammar.rhs) {
			return dprecs[gram];
		}
	}
	return null;
}

function addGrammarPrec(grammar, precLevel){
	assertNumber(precLevel);
	if (grammarPrec(grammar)) {
		throw new ExecError("Dprec already defined for grammar: " +  lhs + " " + rhs );
	}
	dprecs[grammar] = precLevel; 
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
			if (lhs in grammars) {
				grammars[lhs].push(rhs);
			} else {
				grammars[lhs] = [rhs];
			}

			//Adds dprec of this grammar if it exists
			var dprec = ast.dprec;
			if(dprec) {
				dprecs[grammar] = dprec;
			}

			// Adds dprec based on operator's precendence
			var operator = ast.prec;
			if (operator){
				if (! (operator in assocs)) {
					alert("Declaring precedence with unknown operator: " + operator);
					throw new ExecError("Declaring precedence with unknown operator: " + operator);
				}
				var prec = assocs[operator];
				dprecs[grammar] = prec;
			} 
			return null;
			break;

		case "input" :
			var rhs = ast.value;
			input = rhs;
			return {"grammars":grammars, "input":input};
			break;

		case "assoc":
			var operators = ast.operators;
			var precLevel = assocs.counter + 1;
			assocs.counter += 1;
			for (i = 0; i < operators.length; i++) {
				var operator = operators[i];
				if (assocs[operator]) {
					alert("Associativity/precedence already declared: " + operator);
					throw new ExecError("Associativity/precedence already declared: " + operator);
				}
				assocs[operator] = precLevel;
			}
			return null
			break;

		default: 
			throw new ExecError("Unknown ast type: " + ast.type);
			break;
	}

}