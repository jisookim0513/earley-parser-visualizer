/* Parser for grammar/standard input.
 * Examples:
 * input 1 + 1
 * { “type”: “input”,
 *   “value”: “1 + 1”
 * }
 * grammar E -> E ; E
 * { “type”: “grammar”,
 *   “lhs” : “E”,
 *   “rhs” : “E;E”,
 *   “dprec” : null,
 *   “prec”: null,
 * }
 */