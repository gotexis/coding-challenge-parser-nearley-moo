import { useState } from 'react'
import { parseAndEvaluate, type ASTNode } from './parser/parser'

function App() {
  const [input, setInput] = useState('2 + 3 * 2 = 8')
  const [result, setResult] = useState<{
    ast?: ASTNode
    result?: boolean
    error?: string
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parseResult = parseAndEvaluate(input)
    setResult(parseResult)
  }

  const renderAST = (node: ASTNode, depth = 0): JSX.Element => {
    const indent = depth * 20
    
    if (node.type === 'number') {
      return (
        <div 
          key={`${depth}-${node.value}`}
          style={{ marginLeft: `${indent}px` }}
          className="py-1 px-2 bg-blue-100 rounded text-blue-800 inline-block mb-1"
        >
          <span className="font-mono text-sm">
            number: {node.value}
          </span>
        </div>
      )
    }

    return (
      <div key={`${depth}-${node.type}`} className="mb-2">
        <div 
          style={{ marginLeft: `${indent}px` }}
          className="py-1 px-2 bg-green-100 rounded text-green-800 inline-block mb-1"
        >
          <span className="font-mono text-sm font-semibold">
            {node.type}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm text-gray-600 font-medium">left:</div>
          {renderAST(node.left, depth + 1)}
          <div className="text-sm text-gray-600 font-medium mt-2">right:</div>
          {renderAST(node.right, depth + 1)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expression Parser Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test mathematical expressions with equality/inequality comparisons
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-2">
                Enter an expression:
              </label>
              <div className="flex space-x-2">
                <input
                  id="expression"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 + 3 * 2 = 8"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Parse
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Supported operations:</strong> +, -, *, /, =, !=</p>
            <p><strong>Examples:</strong> "2 + 3 = 5", "4 * 2 != 10", "6 / (1 + 2) = 2"</p>
          </div>
        </div>

        {/* Results Section */}
        {(result.ast || result.error) && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* AST Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Abstract Syntax Tree
              </h2>
              {result.ast ? (
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  {renderAST(result.ast)}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No AST available
                </div>
              )}
            </div>

            {/* Result Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Result
              </h2>
              
              {result.error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center">
                    <div className="text-red-600 mr-2">❌</div>
                    <div>
                      <h3 className="text-red-800 font-semibold">Error</h3>
                      <p className="text-red-700 text-sm mt-1">
                        {result.error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : result.result !== undefined ? (
                <div className={`border rounded-md p-4 ${
                  result.result 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`mr-2 ${result.result ? 'text-green-600' : 'text-yellow-600'}`}>
                      {result.result ? '✅' : '⚠️'}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        result.result ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {result.result ? 'True' : 'False'}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        result.result ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        The comparison evaluates to {result.result.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No result available
                </div>
              )}
            </div>
          </div>
        )}

        {/* Example expressions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Try These Examples
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              '1 + 2 = 3',
              '2 * 3 + 4 = 10',
              '2 * (3 + 4) = 14',
              '6 = 10 / 2 + 1',
              '12 + 3 != 4 / 2 + 5',
              '2 + 3 * 2 = 8'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-left px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-mono"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
