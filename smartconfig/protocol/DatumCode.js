"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.DatumCode = void 0;
var tslib_1 = require("tslib"),
DataCode_1 = require("./DataCode"),
byteUtil = require("../../byteUtil").byteUtil,
CRC8 = require("../../CRC8").CRC8,
formatInetAddr = require("../../util").formatInetAddr,
DatumCode = function() {
	function t(t, e, o, a, r) {
		this.EXTRA_LEN = 40,
		this.EXTRA_HEAD_LEN = 5,
		this.DATA_CODE_LEN = 6;
		var i = 0,
		n = o.length,
		s = new CRC8;
		s.update(t);
		var d = byteUtil.convertNumberToChar(s.getValue());
		s.reset(),
		s.update(e);
		var l = byteUtil.convertNumberToChar(s.getValue()),
		_ = t.length,
		u = formatInetAddr(a),
		h = u.length,
		C = byteUtil.convertNumberToChar(this.EXTRA_HEAD_LEN + h + n + _);
		this.mDataCodes = [],
		this.mDataCodes.push(new DataCode_1.DataCode(C, 0)),
		i ^= C,
		this.mDataCodes.push(new DataCode_1.DataCode(n, 1)),
		i ^= n,
		this.mDataCodes.push(new DataCode_1.DataCode(d, 2)),
		i ^= d,
		this.mDataCodes.push(new DataCode_1.DataCode(l, 3)),
		i ^= l;
		for (var p = 0; p < h; ++p) {
			i ^= v = byteUtil.convertByte2Uint8(u[p]),
			this.mDataCodes.push(new DataCode_1.DataCode(v, p + this.EXTRA_HEAD_LEN))
		}
		for (p = 0; p < o.length; p++) {
			i ^= v = byteUtil.convertByte2Uint8(o[p]),
			this.mDataCodes.push(new DataCode_1.DataCode(v, p + this.EXTRA_HEAD_LEN + h))
		}
		for (p = 0; p < t.length; p++) {
			i ^= v = byteUtil.convertByte2Uint8(t[p]),
			this.mDataCodes.push(new DataCode_1.DataCode(v, p + this.EXTRA_HEAD_LEN + h + n))
		}
		this.mDataCodes.splice(4, 0, new DataCode_1.DataCode(i, 4));
		var D = this.EXTRA_HEAD_LEN;
		for (p = 0; p < e.length; p++) {
			var c = C + p,
			v = byteUtil.convertByte2Uint8(e[p]),
			y = new DataCode_1.DataCode(v, c);
			D >= this.mDataCodes.length ? this.mDataCodes.push(y) : this.mDataCodes.splice(D, 0, y),
			D += 4
		}
	}
	return t.prototype.getBytes = function() {
		var t = new Int8Array(this.mDataCodes.length * this.DATA_CODE_LEN),
		e = 0;
		return this.mDataCodes.forEach((function(o) {
			o.getBytes().forEach((function(o) {
				t[e++] = o
			}))
		})),
		t
	},
	t.prototype.toString = function() {
		var t, e, o = "",
		a = this.getBytes();
		try {
			for (var r = tslib_1.__values(a), i = r.next(); ! i.done; i = r.next()) {
				var n = i.value,
				s = byteUtil.convertByte2HexString(n);
				o += "0x",
				1 === s.length && (o += "0"),
				o = o + s + " "
			}
		} catch(e) {
			t = {
				error: e
			}
		} finally {
			try {
				i && !i.done && (e = r.
				return) && e.call(r)
			} finally {
				if (t) throw t.error
			}
		}
		return o
	},
	t.prototype.getU8s = function() {
		for (var t, e, o = this.getBytes(), a = o.length / 2, r = new Uint16Array(a), i = 0; i < a; i++) t = o[2 * i],
		e = o[2 * i + 1],
		r[i] = byteUtil.convertNumberToChar(byteUtil.combine2bytesToU16(t, e) + this.EXTRA_LEN);
		return r
	},
	t
} ();
exports.DatumCode = DatumCode;
