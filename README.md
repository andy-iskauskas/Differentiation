Differentiation Package
=======================

A <a href="https://www.Numbas.org.uk">Numbas</a> extension for differentiating functions. NUMBAS has a very good suite of checking functions for algebraic equivalence of a student's answer and the correct answer, but there are problems when setting questions on solutions to differential equations: for example, if the student chooses different names for constants of integration, then the answer will be marked incorrectly. To mark these sorts of questions, taking advantage of NUMBAS' built-in checking, and without using regular expressions, it's necessary to differentiate the student expression and plug it into the differential equation.

## JavaScript Functions
Quite minimal!
`diff`: a single Javascript function that recursively differentiates down a NUMBAS syntax tree. Currently supports:
- Addition, Subtraction, Multiplication, Division
- Exponents (both x^n and n^x, using a general form f(x)^g(x))
- Trigonometric functions sin, cos, tan and inverses arcsin, arcos, arctan
- Hyperbolic trig sinh, cosh, tanh...arcsinh, arccosh, arctanh
- sqrt and ln
Takes three parameters: a string corresponding to the expression to differentiate, an argument to differentiate with respect to, and a number of times to differentiate the expression.
Example:
```JavaScript
diff("x^3","x",2)
// Returns '6x'
```
There are also a series of additional simplification rules applied to the answer at the end of each round of differentiation, to deal with the result of the differentiation: for example, `d("x^2","x",1)` initially outputs `2x*(1/x)`, which is clearly not in simplest form (and causes problems if you want to perform multiple differentiations). These are collected as a set `diffrules`, which can be subsequently used in any questions that use this extension.
This is implictly partial differentiation: if a student gives an answer A*e^(2t), then `diff(...,'x')` treats the A as constant, as it rightly should.

## NUMBAS Functions
`d`: A wrapper for the `diff` function above. Takes three arguments: the additional argument is the number of times to differentiate.

## Usage
Relatively self-explanatory: use `d(expression,argument,number)` anywhere differentiation is needed. For examples, see <a href="https://numbas.mathcentre.ac.uk/accounts/profile/724/"> the sample exam and the custom part type. Will be continually updated as I refine and work out more aspects.

### Suggestions
Any feedback or suggestions for improvement would be great: a working list of things to do are
- Test further to ensure all code is behaving as it should!
- Think about making the output easier to deal with: at present the string output has to be run through expression to display in latex form.
- Ensure that there are no important mathematical functions missing from the extension
- Modify the custom part type: need to ensure for nth-order ODEs that there are n linearly independent solutions (not currently checking this)
- Consider integration (much much harder)
