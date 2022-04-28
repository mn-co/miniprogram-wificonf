"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.GuideCode = void 0;
var byteUtil = require("../../byteUtil").byteUtil,
GuideCode = function() {
	function e() {
		this.GUIDE_CODE_LEN = 4
	}
	return e.prototype.toString = function() {
		for (var e = "",
		t = this.getU8s(), o = 0; o < this.GUIDE_CODE_LEN; o++) {
			e = (e += "0x") + byteUtil.convertU8ToHexString(t[o]) + " "
		}
		return e
	},
	e.prototype.getU8s = function() {
		var e = new Uint16Array(this.GUIDE_CODE_LEN);
		return e[0] = 515,
		e[1] = 514,
		e[2] = 513,
		e[3] = 512,
		e
	},
	e
} ();
exports.GuideCode = GuideCode;
