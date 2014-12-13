//input takes in a string like "1+1"
//outputs a list of nodes and edges

/*          case "1+1":
            return {"nodes": [0,1,2,3], "edges":[[0,1,"E->Id"], [0,1,"Id->1"], [2,3,"E->Id"], [2,3,"Id->1"], [0,3,"E->E+E"]]};
          case "1+2*3":
            return {"nodes": nodelist, "edges":steplist};
          default:
            return {"nodes": [], "edges":[]};
*/

function earleyParse(grammars, input){
	//edges stored as (start position, end position, source node, destination node)
	//preprocessing
	var terminals = [];
        for (regex in grammars.ignores){
            terminals.push ((regex, None));
		};
        for (sym, regex in gram.optionals){
            terminals.append ((regex, sym));
        };
        operators = {};
        for (op, prec, assoc in gram.getAssocDecls ()){
            operators [op.pattern] = (prec, assoc);
        };
        //check to see if grammars match this syntax
        var ruleNum = 0;
        var renamedTerminals = [];
        for (rule in gram.rules){
            var lhs = rule.lhs;
            for (production in rule.productions){
                var actions = production.actions;
                var rhs = production.RHS;
                if (actions[rhs.length]){
                    actions[rhs.length] = (actions[rhs.length], rhs.length);
                }
                for (i, sym in enumerate (rhs){
                    if (rhs[i] == grammar.Grammar.EPSILON){
                        rhs = [];
                        production.RHS = [];
                    }else if (typeof(rhs[i]) == typeof(REGEX)){
                        if (rhs[i].pattern in renamedTerminals){
                            var termSym = renamedTerminals[rhs[i].pattern];
                        }else{
                            var termSym = '%s%d'% (EarleyParser.TERM_PFX, ruleNum);
                            ruleNum = ruleNum + 1;
                            renamedTerminals[rhs[i].pattern] = termSym;
                            terminals.push ((sym, termSym));
                        }
                        if (rhs[i].pattern in operators){
                            var prec = operators[rhs[i].pattern][0];
                            var assoc = operators[rhs[i].pattern][1];
                            production.opPrec = prec;
                            production.opAssoc = assoc;
                        }
                        rhs[i] = termSym;
                    }
                    if (actions[i]){
                        actions[i] = (actions[i], rhs.length);
                    }
                production.RHS = rhs;
            }
        }   
        ruleNum = 0
        for (rule in gram.rules){
            for (production in rule.productions){
                lhs = rule.lhs;
                rhs = production.RHS;
                if (rhs.length == 1 && rhs[0] == grammar.Grammar.EPSILON){
                    continue;
                }
                if (production.assoc != null){
                    var opPrec = operators[production.assoc.pattern][0];
                    var assoc = operators[production.assoc.pattern][1];
                }else if (production.opPrec != null){
                    opPrec = production.opPrec;
                    assoc = production.opAssoc;
                }else{
                    opPrec = null;
                    assoc = null;
                }
                if (production.prec != -1){
                    var dprec = production.prec;
                }else{
                    dprec = null;
				}
                production.info = (opPrec, assoc, dprec, production);
        }
	//tokenize input
	var tokens = [];
    var pos = 0
	while(true){
        var matchLHS = 0;
        var matchText = null;
        var matchEnd = -1;
		for (regex, lhs in self.terminals){
            var match = regex.match (input, pos);
            if (match && match.end () > matchEnd){
                matchLHS = lhs;
                matchText = match.group ();
                matchEnd = match.end ();
            }
            if (pos == input.length){
                if (matchLHS){
                	tokens.push ((matchLHS, matchText));
                	break;
            	}
            }else if (typeof(matchLHS) == null){
            }else if (matchLHS){
                tokens.push ((matchLHS, matchText));
            }else{
                alert(pos);
            }
            pos = matchEnd;
		}	
	}
	var tokens = tokenize(input);
	var graphRHS = {}; //graph indexed by RHS
	var graphLHS = {};
	var parseTree = {};
	var edgeWasInserted = [];
	//states stored as list
	function addEdge(e, children){
        var src = e[0];
        var dst = e[1];
        var p = e[2];
        var pos = e[3];
        if (p.rhs.length==pos){
        	var status = 0; //complete status
        }else{
        	var status = 1; //in progress status
        }
            var edgeList = graph[(dst, status)];
            var edgeHash = graph[(dst, status)];
               
            //in-progress edges
            if (status == 1){
                //in progress indexed by rhs
                if (!(e in edgeHash[p.RHS])){
                    edgeHash[p.RHS].push(e);
                    var newEdge = e + children;
                    edgeList.push(newEdge);
                    edgeWasInserted[0] = true;
	    	}else{
                //Edge e is complete.  See if another edge (src,dst,p.LHS) exists.
                // For complete edges, edgeHash is indexd by LHS
                var oldEdgeList = [eo for eo in edgeHash[p.LHS] if eo[0]==src];
                if (0 == oldEdgelist.length){
                    edgeHash[p.LHS].push(e);
                    edgeList.push(e);
                    parseTree[(src,dst,p.LHS)] = (children, p);
                    edgeWasInserted[0] = true;
                }else{
                    var oldEdge = oldEdgeList[0];
                    //disambiguate on precedence                        
                    (newOpPrec, newAssoc, newDprec, newProduction) = p.info;
                    (oldOpPrec, oldAssoc, oldDprec, oldProduction) = oldEdge[PROD].info;
                    children = null;
                    var oldChildren = parseTree[(src,dst,p.LHS)][0];                    
                    if ((newOpPrec != null) && (oldOpPrec != null)){
                        if (newOpPrec < oldOpPrec){
                            var replaceEdge = true;
                        }else if (newOpPrec == oldOpPrec){
                            if ((children.length == 3) && (oldChildren.length == 3)){
                                var lop1 = children[0];
                                var lop2 = oldChildren[0];
                                var leftLarger = (lop1[1]-lop1[0]) > (lop2[1]-lop2[0]);
                                if (newAssoc == grammar.Grammar.LEFT_ASSOCIATIVE){
                                    replaceEdge = leftLarger;
                                }else{
                                    replaceEdge = !leftLarger;
                                }
                            }
                        }                                    
                    else if ((newDprec != null) && (oldDprec != null) && (newDprec != oldDprec)){
                        replaceEdge = newDprec > oldDprec;
					}else{ 
						//failed to disambiguate
                        var reinsert = false;
                        if (p == oldEdge[2]){
                            if hash(children) == hash(oldChildren){
                                reinsert = true;
                             }
                        }
                    }
                    if (replaceEdge){
                    	//new edge more precedence remove old edge
                        edgeHash[p.LHS].splice(edgeHash[p.LHS].indexOf(oldEdge), 1);
                        edgeList.splice(edgeList.indexOf(oldEdge), 1);
                        //add new edge
                        edgeHash[p.LHS].push(e);
                        edgeList.push(e);
                        //point parser tree to new production
                        parseTree[(src,dst,p.LHS)] = (children, p);
                    }
                }
            }
        }
    }

	}
	for (p in grammars[grammars.startSymbol].productions){
            addEdge((0,0,p,0), ());
        }
	for (j = 0; j < tokens.length + 1; j++){
		if (j > 0){
			for e in graph(j-1, 1){
                    (i,_j,p,pos,children) = e;
                    if ((pos < p.RHS.length) && (p.RHS[pos]==tokens[j-1][0]){
                        addEdge((i,j,p,pos+1), children+(tokens[j-1][1],));
                    }
            }
            //Repeat COMPLETE and PREDICT until no more edges can be added
            edgeWasInserted[0] = true;
            while (edgeWasInserted[0]){
                edgeWasInserted[0] = false;
                //COMPLETE productions
                for (eij in graph(j, 0)){
                    (i,_j,p,pos) = eij;
                    for (eki in graph(i, 1)){
                        (k,_i,p2,pos2,childrenki) = eki;
                        if (p2.RHS[pos2]==p.LHS){
                            addEdge((k,j,p2,pos2+1), childrenki+((i,j,p.LHS),));
                        }
                    }
                }
                //PREDICT what the parser is to see on input (move dots in edges that are in progress)
                for ((i,_j,p,pos,children) in edgesIncomingTo(j, 1)){
                	//if nonterminal
                    if ((p.RHS[pos]) != terminalSymbol){
                        var M = p.RHS[pos];
                        for (p2 in self.grammar[M].productions){
                            addEdge((j,j,p2,0), ()));
                        }
                    }
                }
            }
        }
    }
 //input has been parsed OK iff an edge (0,n,S -> alpha .) exists
        var root = null;
        for (e in graph(tokens.length, 0){
            (frm,to,p,pos) = e;
            if (frm==0 && p.LHS==self.grammar.startSymbol && pos==p.RHS.length){
                root = e;
            }
        }
            
        if (!root){
            //input syntax error
        }

        visited = {}
        function constructTheParse (tree):
            '''Returns a ParseTreeNode representing this parse tree.
            '''
            # There are two kinds of leaves: tokens and epsilons.  For both
            # kinds we need to create an extra child node.  This level of
            # indirection is needed so that in the rule below, we can refer
            # to the value of the token symbol ID with the same syntax as to the
            # value of the non-terminal symbol E, using the notation 'ni.val'
            #
            #     E --> E + ID %{ n0.val = n1.val + int(n3.val) %}
            # 
            
            visited[tree] = True
            
            # (1) Token is a leaf of String type: the string is the lexeme
            if isinstance (tree, basestring):
                return ParseTreeNode(symbol=None, value=tree)

            # (src,dst,LHS) = tree
            (children,p) = parseTree[tree]
            
            # 2) Epsilon is a node with no children.
            if len(children)==0:
                return ParseTreeNode(symbol=p.LHS,
                                     actions=p.actions,
                                     children=[ParseTreeNode(symbol=None,value=None)])
            # internal node
            else:
                return ParseTreeNode(symbol=p.LHS, 
                                     actions=p.actions,
                                     children=[constructTheParse(c) for c in children]) # if not visited.get(c,False)])

        # build the parse tree object
        (src,dst,p,pos) = root
        theParse = constructTheParse((src,dst,p.LHS))
        # theParse.dump()
        
        # And finally, execute semantic actions on the parse tree or emit code for doing so
        
        if self.emit:
            return theParse.emit(self.grammar.imports)
        else:
            # try:
            return theParse.evaluate ()
            # except Exception, e:
            #    util.error ('error while executing semantic actions: %s'% (e))
            #    sys.exit(1)
	}