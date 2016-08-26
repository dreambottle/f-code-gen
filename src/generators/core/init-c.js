"use strict";
var _ = require("lodash");
var weaver = require("../../code-weaver");
var Block = require("../../generator-block");

function InitCModule() {
    this.includes = ["hi_lib.h"];
}

// Not very generic right now,
// the 'neuro' part can and should be separated later
InitCModule.prototype.generate = function(props) {
    // header block
    var inclBlock = new Block();
    var headers = this.includes;
    _.each(weaver.modules, function(module, id) {
        if (module.headers !== undefined) {
            headers = headers.concat(module.headers);
        }
    });
    headers = _.uniq(headers);
    _.each(headers, function(header) {
        inclBlock.add("#include \"" + header + "\"");
    });

    // declarations
    var declBlock = new Block();
    _.each(weaver.modules, function(module){
        _.each(module.declarations, function(decl) {
            declBlock.add(decl);
        });
    });

    // functions
    var funcBlock = new Block();
    _.each(weaver.modules, function(module){
        _.each(module.functions, function(func) {
            funcBlock.add(func);
        });
    });

    // init
    var initBlock = new Block();
    initBlock.add("void vHiInitTask(VP) {");
    _.each(weaver.modules, function(module){
        if (module.init) initBlock.add(module.init);
    });
    initBlock.add("Hi_IWDG_Enable(1000);");
    initBlock.add("vTaskDelete(NULL);");
    initBlock.add("}");


    // main
    // HARDCODE until the pattern is figured out
    var mainBlock = new Block(
"int main(void) {\n\
    CreateTask2(vHiInitTask);\n\
    vTaskStartScheduler();\n\
    \n\
    while(1) {\n\
    }\n\
}"
    );


    var rootBlock = new Block([
        inclBlock, "",
        declBlock, "",
        funcBlock, "",
        initBlock, "",
        mainBlock]);
    return rootBlock;
}


module.exports = InitCModule
