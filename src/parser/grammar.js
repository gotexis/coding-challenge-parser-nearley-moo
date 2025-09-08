// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }
 
import moo from 'moo';

// Define lexer tokens with custom whitespace handling
const lexer = moo.compile({
  WS:      /[ \t]+/,                   // Whitespace (spaces and tabs)  
  number:  /[0-9]+(?:\.[0-9]+)?/,      // Numbers (integers and decimals)
  neq:     '!=',                       // Not equal operator (must come before '=' to avoid conflicts)
  eq:      '=',                        // Equal operator
  lparen:  '(',                        // Left parenthesis
  rparen:  ')',                        // Right parenthesis
  plus:    '+',                        // Addition operator
  minus:   '-',                        // Subtraction operator
  times:   '*',                        // Multiplication operator
  divide:  '/',                        // Division operator
});

// Custom whitespace skipping - COMPLETELY IGNORE ALL WHITESPACEs
lexer.next = (function(next) {
  return function() {
    let tok;
    while ((tok = next.call(this)) && tok.type === "WS") {
      // Skip whitespace tokens completely
    }
    return tok;
  };
})(lexer.next);
let Lexer = lexer;
let ParserRules = [
    {"name": "expr", "symbols": ["sum", (lexer.has("eq") ? {type: "eq"} : eq), "sum"], "postprocess": d => ({ type: "eq", left: d[0], right: d[2] })},
    {"name": "expr", "symbols": ["sum", (lexer.has("neq") ? {type: "neq"} : neq), "sum"], "postprocess": d => ({ type: "neq", left: d[0], right: d[2] })},
    {"name": "expr", "symbols": ["sum"]},
    {"name": "sum", "symbols": ["sum", (lexer.has("plus") ? {type: "plus"} : plus), "product"], "postprocess": d => ({ type: "add", left: d[0], right: d[2] })},
    {"name": "sum", "symbols": ["sum", (lexer.has("minus") ? {type: "minus"} : minus), "product"], "postprocess": d => ({ type: "sub", left: d[0], right: d[2] })},
    {"name": "sum", "symbols": ["product"]},
    {"name": "product", "symbols": ["product", (lexer.has("times") ? {type: "times"} : times), "factor"], "postprocess": d => ({ type: "mul", left: d[0], right: d[2] })},
    {"name": "product", "symbols": ["product", (lexer.has("divide") ? {type: "divide"} : divide), "factor"], "postprocess": d => ({ type: "div", left: d[0], right: d[2] })},
    {"name": "product", "symbols": ["factor"]},
    {"name": "factor", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => ({ type: "number", value: parseFloat(d[0].value) })},
    {"name": "factor", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "expr", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d[1]}
];
let ParserStart = "expr";
export default { Lexer, ParserRules, ParserStart };
