# Brief #

The code generator has the following classes and modules:

Weaver: Is the "manager" module which accepts the project config (schema), loads generator modules and provides means for calling other modules' functions.

Block: A container which consists of strings, other Blocks and functions, returning a string or Block;
They are used as elements for constructing a document hierarchy.

Generator Modules: Are responsible for generating code Blocks. A corresponding generator is instantiated for every element on the schema. Generator Modules are nodejs modules, which export a class. Methods and parameters of the class should conform to an API, defined in the Root Module of a target platform.

Root Generator Module: a special module which is an entry point of code generation. This module needs to have a method generate(), which collects blocks from other generators, combines them into a root Block and it.


The code generation has 3 steps:
1. Load generator modules from a json schema;
2. Generate a hierarchy of Blocks;
3. Convert root block into a final string.
