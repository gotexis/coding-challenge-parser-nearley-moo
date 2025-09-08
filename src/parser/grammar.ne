@preprocessor esmodule

@{% 
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
%}

@lexer lexer

# GRAMMAR RULES
# =============
# This grammar implements operator precedence parsing for arithmetic and comparison expressions
# Precedence (highest to lowest): parentheses > */ > +- > = !=

# Main entry point
expr -> sum %eq sum {% d => ({ type: "eq", left: d[0], right: d[2] }) %}      # Equal comparison
     | sum %neq sum {% d => ({ type: "neq", left: d[0], right: d[2] }) %}     # Not equal comparison
     | sum                                                                     # Or just a sum (no comparison)

# Addition and subtraction - medium precedence
# Left-associative: 1 + 2 + 3 = ((1 + 2) + 3)
sum -> sum %plus product {% d => ({ type: "add", left: d[0], right: d[2] }) %}    # Addition
    | sum %minus product {% d => ({ type: "sub", left: d[0], right: d[2] }) %}    # Subtraction
    | product                                                                      # Or just a product (no +/-)

# Multiplication and division - high precedence
# Left-associative: 2 * 3 / 4 = ((2 * 3) / 4)
product -> product %times factor {% d => ({ type: "mul", left: d[0], right: d[2] }) %}    # Multiplication
        | product %divide factor {% d => ({ type: "div", left: d[0], right: d[2] }) %}    # Division
        | factor                                                                           # Or just a factor (no */)

# Factors - highest precedence (numbers and parenthesized expressions)
factor -> %number {% d => ({ type: "number", value: parseFloat(d[0].value) }) %}    # Parse number literal
       | %lparen expr %rparen {% d => d[1] %}                                        # Parenthesized expression (returns inner expr)