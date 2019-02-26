// Pinch a couple of Numbas functions, for ease of later use
var compile = Numbas.jme.compile;
var ttJME = Numbas.jme.display.treeToJME;

/** Differentiates an expression, given as a string, recursively.
* Deals with each token in the syntax tree separately, applying the
* relevant rules, differentiating the child tokens as required.
*
* @param {String} input The expression as a string
* @param {String} arg The argument to differentiate with respect to
*
* @returns {String} The differentiated expression, as a string.
*/
function diff(input, arg)
{
  // Compiles a string to a syntax tree using NUMBAS
  var expr = compile(input);
  // If the current token is a variable, check if it's the differentiating variable or not
  if (expr['tok'].type == "name")
  {
    if (expr['tok'].name == arg)
      return "1";
    else
      return "0";
  }
  // If the current token is a number, return 0
  if (expr['tok'].type == "number")
    return "0";
  // For any other types, distinguigh by their name
  var ename = expr['tok'].name;
  // Unary minus
  if (ename == "-u")
    return "-1*("+diff(ttJME(expr.args[0]),arg)+")";
  // Binary operations: according to differentiation rules, we differentiate its children and recombine
  if (expr['tok'].vars ==  "2")
  {
    var earg1 = ttJME(expr.args[0]);
    var earg2 = ttJME(expr.args[1]);
    if (ename == "+")
      return "(" + diff(earg1,arg)+")+("+diff(earg2,arg)+")";
    if (ename == "-")
      return "("+diff(earg1,arg)+")-("+diff(earg2,arg)+")";
    if (ename == "*")
      return "("+diff(earg1,arg)+")*("+earg2+")+("+earg1+")*("+diff(earg2,arg)+")";
    if (ename == "/")
      return "(("+diff(earg1,arg)+")*("+earg2+")-("+earg1+")*("+diff(earg2,arg)+"))/(("+earg2+")*("+earg2+"))";
    // General form for differential of f(x)^g(x). Accounts for both stuff like x^n and e^x
    if (ename == "^")
      return "(("+earg1+")^("+earg2+"))*("+diff(earg2,arg)+"*ln("+earg1+")+((("+earg2+")*("+diff(earg1,arg)+"))/("+earg1+")))";

  }
  // Function operations: sin, cos etc. Basically the chain rule.
  if (expr['tok'].type == "function")
  {
    var earg = ttJME(expr.args[0]);
    if (ename == "sin")
      return "("+diff(earg,arg)+")*cos("+earg+")";
    if (ename == "cos")
      return "-1*("+diff(earg,arg)+")*sin("+earg+")";
    if (ename == "tan")
      return "("+diff(earg,arg)+")/(cos("+earg+")^2)";
    if (ename == "arcsin")
      return "("+diff(earg,arg)+")/sqrt(1-("+earg+")^2)";
    if (ename == "arccos")
      return "-1*("+diff(earg,arg)+")/sqrt(1-("+earg+")^2)";
    if (ename == "arctan")
      return "("+diff(earg,arg)+")/(1+("+earg+")^2)";
    if (ename == "sinh")
      return "("+diff(earg,arg)+")*cosh("+earg+")";
    if (ename == "cosh")
      return "("+diff(earg,arg)+")*sinh("+earg+")";
    if (ename == "tanh")
      return "("+diff(earg,arg)+")/(cosh("+earg+")^2)";
    if (ename == "arcsinh")
      return "("+diff(earg,arg)+")/sqrt(1+("+earg+")^2)";
    if (ename == "arccosh")
      return "("+diff(earg,arg)+")/sqrt(("+earg+")^2-1)";
    if (ename == "arctanh")
      return "("+diff(earg,arg)+")/(1-("+earg+")^2)";
    if (ename == "ln")
      return "("+diff(earg,arg)+")/("+earg+")";
    if (ename == "sqrt")
      return "("+diff(earg,arg)+")/(2*sqrt("+earg+"))";
  }
}

// The object wrapper for the Numbas extension
Numbas.addExtension('Differentiation',['jme','jme-display','math'], function(di)
{
  var diffScope = di.scope;

  /** A wrapper for the recursive differentiation function diff. Allows for multiple differentiation.
  *
  * @param {String} input The input expression
  * @param {String} arg The parameter to differentiate with respect to
  * @param {Integer} n The number of times to differentiate
  *
  * @returns {String} output
  */
  function d(input,arg,n)
  {
    var ind = n, expr = input;
    if (ind==0)
      return expr;
    for (i=0; i<ind; i++)
    {
      expr = diff(expr,arg);
    }
    return ttJME(Numbas.jme.display.simplify(expr,'all',Numbas.jme.builtinScope),{wrapexpressions: true});
  }

  // General stuff for NUMBAS definitions. Just needed to make a function object that NUMBAS likes.
  var funcObj = Numbas.jme.funcObj;
  var TString = Numbas.jme.types.TString;
  var TNum = Numbas.jme.types.TNum;

  diffScope.addFunction(new funcObj('d',[TString,TString,TNum],TString, function(input,arg,n){return d(input,arg,n);},{unwrapValues:true}));
})
