"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.DataCode = void 0;
var byteUtil = require("../../byteUtil").byteUtil,
CRC8 = require("../../CRC8").CRC8,
DataCode = function() {
	function t(t, e) {
		if (this.DATA_CODE_LEN = 6, this.INDEX_MAX = 127, e > this.INDEX_MAX) throw "index > INDEX_MAX";
		var o = byteUtil.splitUint8To2bytes(t);
		this.mDataHigh = o[0],
		this.mDataLow = o[1];
		var i = new CRC8;
		i.update(byteUtil.convertUint8toByte(t)),
		i.update(e);
		var r = byteUtil.splitUint8To2bytes(byteUtil.convertNumberToChar(i.getValue()));
		this.mCrcHigh = r[0],
		this.mCrcLow = r[1],
		this.mSeqHeader = byteUtil.convertNumberToByte(e)
	}
	return t.prototype.getBytes = function() {
		var t = new Int8Array(this.DATA_CODE_LEN);
		return t[0] = 0,
		t[1] = byteUtil.combine2bytesToOne(this.mCrcHigh, this.mDataHigh),
		t[2] = 1,
		t[3] = this.mSeqHeader,
		t[4] = 0,
		t[5] = byteUtil.combine2bytesToOne(this.mCrcLow, this.mDataLow),
		t
	},
	t.prototype.toString = function() {
		for (var t = "",
		e = this.getBytes(), o = 0; o < this.DATA_CODE_LEN; o++) {
			var i = byteUtil.convertByte2HexString(e[o]);
			t += "0x",
			1 === i.length && (t += "0"),
			t = t + i + " "
		}
		return t
	},
	t.prototype.getU8s = function() {
		throw "DataCode don't support getU8s()"
	},
	t
} ();
exports.DataCode = DataCode;
//# sourceMappingURL=DataCode.js.map
