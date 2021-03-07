---
slug: "/computers/compilers_part_3"
date: "2021-02-27"
title: "Compilers Part 3: Semantic Analysis"
featuredImage: ../images/ast.png
---

This is part 3 of my notes from the University of Toronto course CSC467: Compilers. This section covers semantic analysis.

Find [part 2 here](/computers/compilers_part_2) and [part 4 here](/computers/compilers_part_4).

Key concepts of semantic analysis:
- Abstract Syntax Tree
- S-expressions
- Scope Checking (static v dynamic)
- Type Checking (strong v weak, static v dynamic)

---

Semantic analysis converts the parse tree into an Abstract Syntax Tree in order to perform scope checking and type checking.

# Abstract Syntax Tree (AST)

An AST is similar to a parse tree, but it ignores details that are unused for evaluation. E.g.

```
  Parse Tree  | |            AST
-------------------------------------------
    E         | |  ----------------
  / | \       | |  | * | int1 | | |
 E  *  E      | |  -------------|--
 |    /|\     | |         _____/  
int1 ( E )    | |      --/----------------
      /|\     | |      | + | int2 | int3 |
     E + E    | |      -------------------
     |   |    | |
   int2 int3  | |
```

Where the third entry of the first block points to the second block. 

## S-expressions

An S-expression is a serialization of an AST. E.g. the above AST, expressed as an S-expression, would be: `(* 1 (+ 2 3))`. Note that some languages (LISP) are essentially programming with S-expressions.

To generate an S-expression, you traverse the AST depth-first. The basic algorithm is:

```
if leaf: print value
if else: print "(" + children + ")"
```

## Syntax Directed Translation

Bison-style semantic actions execute code while reducing using a grammar rule. This means that everything under the node (in the graph) must already be constructed. Note that non-terminals are inner nodes, and terminals are leaf nodes.

E.g. 
```
E -> T + E1   { E.node = new Node(+, T.node, E1.node); }
E -> T        { E.node = T.node; }
T -> int * T1 { T.node = new Node(*, new Leaf(int.val), T.node); }
```

# Semantic Analysis

Recall:
- **Lexical analysis** - generates token stream, checks identifiers are valid and literals are proper form.
- **Syntax/Parsing** - checks expressions are syntactically valid, generates AST.
- **Semantic** - detects remaining errors, such as type mismmatch, undeclared or redeclared variables.

Semantic analysis makes sure that the program has well-defined meaning. This means we detect things such as type mismatch, and undeclared or redeclared variables. Once we are past this step, we can guarantee the program is legal. 

However, we cannot detect link errors, logical bugs, or certain undefined behaviors. More on these later.

The two things we do in semantic analysis are:
- **Scope Checking** - determine what object an identifier refers to.
- **Type Checking** - make sure expressions and function arguments have the correct types.

Both of these can be expressed as a recursive descent algorithm.

## Scope Checking

Here we discuss several methods of performing scope checking. In general, you need a **symbol table**, which is a data structure that maps names to variables.

### Map-Stack Symbol Table

For this, you use a stack of maps. Each map is for the variables in one scope.

Algorithm:
```
ENTER SCOPE     -> push new map
EXIT SCOPE      -> pop/discard top of stack
NEW DECLARATION -> insert into the map at top of stack
LOOKUP          -> find declaration (search stack top to bottom)
```

This builds the symbol table on-the-fly, but at the end it is destroyed. So, you have to do all analysis in one pass.

### Spaghetti Stack Symbol Table

Here, you define the symbol table as a tree. Each node points to its parent. For any point in the pgoram, the table _appears_ to be a stack (only search in current node and parents). Lookup is still a linear search of that stack, but now the symbol table is a static structure.

Algorithm:
```
ENTER SCOPE     -> save current pointer
NEW DECLARATION -> add new node, update current node
EXIT SCOPE      -> restore to saved pointer
```

### Static vs Dynamic Scoping

- **Static/Lexical** - both map-stack and spaghetti stack are static, as the reference is determined at compile time.
- **Dynamic** (Perl, LISP) - reference determined at runtime. This means we need to preserve the symbol table within the language's runtime. This is less efficient, as the compiler cannot hardcode variable location (need runtime lookups).

### Scope Checking in Object-Oriented Languages

Object-oriented languages also need to store information about class and class hierarchy. Here is an example symbol table for a short program in Java:

```Java
class Base {
    int value;
}

class Derived extends Base {
    void work() {
        int value = 3;
        this.value = 1;
        //symbol table at this point
    }

    public static void main(String args[]) {
        Derived d = new Derived();
        d.work();
    }
}

```

```
             symbol table
             ^
             |
            -----------
super ---> |     Base  | (class member variable)
           | value | 1 |
            -----------
             ^
             |
            -----------
this  ---> |  Derived  |                        
            -----------
             ^
             |
            -----------
           |   work()  |
           | value | 3 | (local variable)
            -----------
```

## Type Checking

Type checking is how the compiler enforces correct types. We have some design decisions to make, with a series of trade-offs:

### Trade-Offs

#### Static vs Dynamic Typing

Static typing does type checking at compile time (e.g. C++, C, Rust). The type is determined explicitly by the developer, or deduced by the compiler. The advantage of static typing is that you see type-related errors at compile time, instead of at run time.

Dynamic typing does the type check at runtime (e.g. Python, Perl, Javascript). Here the developer does not say the time, the interpreter assigns and checks at runtime. The advantage of dynamic typing is the faster speed you can write programs.

#### Strong vs Weak Typing

Strong typing forces you to explicitly state type casting (e.g. Rust, Haskell, Python). The advantage here is the robustness (avoid certain types of logic errors).

Weak typing allows for implicit or automatic type casting (e.g. C, C++, Java, Perl, Javascript). The advantage here is the faster speed.

#### Our Focus: C

C uses static, weak types. The user declares types for identifiers before use, but the compiler infers types for expressions.

### Type Inference

Before we can verify types through type checking, we first have to fill in any missing type information. Since we are focusing on C, this means filling in missing type information for each expression.

Using **inference rules**, we formalize the inference of types. First, defining some notation.

1. Preconditions => Postconditions
```
      Preconditions (if this is true)
-----------------------------------------
 Postconditions (then we can infer this)
```
2. Type of expression
```
|- e: T  (expression e has type T)
```
3. Type Compatibility
```
T1 ~ T2 (if type T1 is compatible with type T2)
```
4. Specify scope
```
 i is int variable in scope O
 ----------------------------
          O |- i:int
```
5. Function Call. For a function with id F, defined in scope M, with type (T1, ..., Tn) -> U (i.e. takes args T1, ... T2 and returns type U).
```
 O, M |- ei : Ri where Ri ~ Ti, for 1<=i<=n
 ------------------------------------------
          O, M |- f(e1, ..., en): U
```

#### Simple example

In simple language: if 1 is an integer constant (i.e. 1 is of type int), and 2 is an integer constant (i.e. 2 is of type int), then 1+2 is also of type int.
```
 1 is int const     2 is int const
 --------------     --------------
   |- 1:int            |- 2:int
------------------------------------
            |- 1+2:int
```

#### Type Compatibility Example

C allows for implicit conversion, and ranks types. E.g. (double, float, long long, long, int). T1 <= T2 if type T1 is ranked lower or equal. So an int can be implicitly cast to a double, but not vice-versa.

```
 |- x: T1  |- y: T2  T2<=T1
 --------------------------
       |- x+y: T1

or, more generally

 |- x: T1  |- y: T2  T1~T2
 -------------------------
    |- x+y: max(T1, T2)
```

So, in the second example, if you add a double to an int, you get a double.

#### Integer Promotion

Going from something smaller than an int (e.g. short, char) to an int has some special circumstances. One important case is the difference between unsigned and signed. E.g.

```c++
unsigned char a = 0xFF; //when promoted to int, a becomes 255 (0xFF)
char b = 0xFF;          //when promoted to int, b becomes -1  (0xFF...FF)
```

### Proof System

Finally, we extend our proof system to define **well-formed** statements.

`S |- WF(stmt)` if statement is well-formed in the scope S. If every statement is well formed, then the program is valid. Below is a non-exhaustive list of example proofs.

1. Declaration
```
 T is valid type in S
 --------------------
   S |- WF(T name;)

 T is valid type in S
  S |- expr: T`, T~T`
 --------------------
 S |- WF(T name=expr;)
```
2. Assignment (where l-value is a dedicated variable name)
```
 X is l-value.  S |- x:T1  S |- expr:T2  T1~T2
 ---------------------------------------------
             S |- WF(x=expr;)
```
3. If statement
```
                S |- expr: bool
 S1 |- WF(stmt1), S1 is scope for then-branch
 S2 |- WF(stmt2), S2 is scope for else-branch
 --------------------------------------------
   S |- WF( if(expr) {stmt1} else {stmt2} )
```

### Function Overloading

This is when 2+ functions have the same name, but different arguments. Which one is called is determined at compile time. 

Filter out functions that cannot match (based on argument types). If none left, then you have an error. If one left, then pick it. If more than one, choose the best based on type-specificity (also, prefer non-variadic functions). Note that you can still have ambiguous calls.
