import * as nearley from 'nearley';
const grammar = require('./grammar.js');

export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'add' | 'sub' | 'mul' | 'div'; left: ASTNode; right: ASTNode }
  | { type: 'eq' | 'neq'; left: ASTNode; right: ASTNode };

function flattenAST(node: any): ASTNode {
  // Recursively flatten arrays until we get to actual objects
  if (Array.isArray(node)) {
    // Keep unwrapping arrays until we get to the actual content
    let current = node;
    while (Array.isArray(current)) {
      current = current[0];
    }
    return flattenAST(current);
  }
  
  // If it's already a proper AST node, recursively flatten its children
  if (node && typeof node === 'object' && node.type) {
    if (node.type === 'number') {
      return node;
    }
    
    // For binary operations, flatten left and right recursively
    if (['add', 'sub', 'mul', 'div', 'eq', 'neq'].includes(node.type)) {
      return {
        type: node.type,
        left: flattenAST(node.left),
        right: flattenAST(node.right)
      };
    }
  }
  
  return node;
}

function evaluate(node: ASTNode): number | boolean {
  switch (node.type) {
    case 'number':
      return node.value;
    case 'add':
      return (evaluate(node.left) as number) + (evaluate(node.right) as number);
    case 'sub':
      return (evaluate(node.left) as number) - (evaluate(node.right) as number);
    case 'mul':
      return (evaluate(node.left) as number) * (evaluate(node.right) as number);
    case 'div':
      const divisor = evaluate(node.right) as number;
      if (divisor === 0) {
        throw new Error('Division by zero');
      }
      return (evaluate(node.left) as number) / divisor;
    case 'eq':
      return evaluate(node.left) === evaluate(node.right);
    case 'neq':
      return evaluate(node.left) !== evaluate(node.right);
    default:
      throw new Error('Unknown AST node');
  }
}

export function parseAndEvaluate(input: string): { ast?: ASTNode; result?: boolean; error?: string } {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);
    if (parser.results.length === 0) {
      return { error: 'Invalid input: no parse found.' };
    }
    if (parser.results.length > 1) {
      return { error: 'Ambiguous grammar: multiple parses found.' };
    }
    let ast = parser.results[0] as ASTNode;
    
    // Always flatten the AST since nearley grammar creates nested arrays
    ast = flattenAST(ast) as ASTNode;
    let result: boolean | undefined = undefined;
    if (ast.type === 'eq' || ast.type === 'neq') {
      result = evaluate(ast) as boolean;
    }
    return { ast, result };
  } catch (e: any) {
    // Enhanced error reporting with location if available
    let errorMsg = e.message;
    if (e.token && typeof e.token === 'object') {
      const { line, col, text } = e.token;
      errorMsg += line && col ? ` (at line ${line}, column ${col})` : '';
      if (text) errorMsg += `: '${text}'`;
    }
    return { error: errorMsg };
  }
}

