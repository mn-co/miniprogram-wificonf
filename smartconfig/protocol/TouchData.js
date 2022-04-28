"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.TouchData = void 0;
var byteUtil = require("../../byteUtil").byteUtil,
TouchData = function() {
	function t(t) {
		if (this.mData = "", "string" == typeof t) this.mData = byteUtil.stringToByteArray(t);
		else {
			if (! (t instanceof Int8Array)) throw "data cannot be null";
			this.mData = t
		}
	}
	return t.prototype.getData = function() {
		return this.mData
	},
	t
} ();
exports.TouchData = TouchData;
//# sourceMappingURL=TouchData.js.map
