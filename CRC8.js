"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.CRC8 = void 0;
var byteUtil = require("./byteUtil").byteUtil,
CRC8 = function() {
	function t() {
		this.crcTable = new Int32Array(256),
		this.CRC_POLYNOM = 140,
		this.CRC_INITIAL = 0;
		for (var t = 0; t < 256; t++) {
			for (var e = t,
			r = 0; r < 8; ++r) 0 != (1 & e) ? e = e >>> 1 ^ this.CRC_POLYNOM: e >>>= 1;
			this.crcTable[t] = e
		}
		this.value = this.init = this.CRC_INITIAL
	}
	return t.prototype.updateValue = function(t, e, r) {
		for (var i = 0; i < r; i++) {
			var o = t[e + i] ^ this.value;
			this.value = this.crcTable[255 & o] ^ this.value << 8
		}
	},
	t.prototype.update = function(t) {
		t instanceof Int8Array ? this.updateValue(t, 0, t.length) : "number" == typeof t && this.update(new Int8Array([byteUtil.convertNumberToByte(t)]))
	},
	t.prototype.getValue = function() {
		return 255 & this.value
	},
	t.prototype.reset = function() {
		this.value = this.init
	},
	t
} ();
exports.CRC8 = CRC8;
