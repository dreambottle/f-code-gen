'use strict'

// TODO

// a common data object, which is passed between "event" calls.
// when passing variables, should store their type (and value of course)
// class Data {
// 	constructor (val, type) {
// 		if (val instanceof Object
// 			&& val.type && val.value) {
// 			type = val.type
// 			val = val.value
// 		}
// 		this.type = type
// 		this.value = value
// 	}
	
// 	// toStr() {
// 	// 	if (this.type === Data.TYPE_INT) {
// 	// 		return `sprintf(str, "%d", aInt)`
// 	// 	}
// 	// }
// }
var Data = {}
Data.TYPE_INT = "i"
Data.TYPE_CHAR = "c"
Data.TYPE_CHARPTR = "s"
Data.TYPE_BYTE = "b"
Data.TYPE_BYTEARRAY = "B"

module.exports = Data