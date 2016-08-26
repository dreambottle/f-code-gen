"use strict"

// Thoughts on interface:
// - "library" getter for a given platform (library is a dicionary of name:modulepath)
// - has a programmatic configuration:
// -- can add/set source folders to scan for packages
// -- package is a folder with generator modules and a descriptor file (node module?), which maps names to paths
// - automatically scans folders

//