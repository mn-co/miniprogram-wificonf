"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.EsptouchGenerator = void 0;
var DatumCode_1 = require("./DatumCode"),
GuideCode_1 = require("./GuideCode"),
byteUtil = require("../../byteUtil").byteUtil,
EsptouchGenerator = function() {
	function e(e, t, r, o, s) {
		console.log("inetAddress", o);
		var i = (new GuideCode_1.GuideCode).getU8s();
		this.mGcBytes2 = new Array(i.length);
		for (var u = 0; u < this.mGcBytes2.length; u++) this.mGcBytes2[u] = byteUtil.getSpecBytesFromChar(i[u]);
		var d = new DatumCode_1.DatumCode(e, t, r, o, s).getU8s();
		this.mDcBytes2 = new Array(d.length);
		for (u = 0; u < this.mDcBytes2.length; u++) this.mDcBytes2[u] = byteUtil.getSpecBytesFromChar(d[u])
	}
	return e.prototype.getGCBytes2 = function() {
		return this.mGcBytes2
	},
	e.prototype.getDCBytes2 = function() {
		return this.mDcBytes2
	},
	e
} ();
exports.EsptouchGenerator = EsptouchGenerator;
//# sourceMappingURL=EsptouchGenerator.js.map
