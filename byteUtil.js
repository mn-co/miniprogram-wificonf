"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.byteUtil = void 0;
var tslib_1 = require("tslib"),
ByteUtil = function() {
	function t() {
		this.ESPTOUCH_ENCODING_CHARSET = "UTF-8"
	}
	return t.prototype.toInt8Array = function(t) {
		return "[object ArrayBuffer]" === Object.prototype.toString.call(t) || Array.isArray(t) ? new Int8Array(t) : t
	},
	t.prototype.toUint8Array = function(t) {
		return "[object ArrayBuffer]" === Object.prototype.toString.call(t) || Array.isArray(t) ? new Uint8Array(t) : t
	},
	t.prototype.stringToByteArray = function(t) {
		for (var r = [], e = 0, o = 0; o < t.length; o++) {
			var n = t.charCodeAt(o);
			n > 255 && (r[e++] = 255 & n, n >>= 8),
			r[e++] = n
		}
		return r
	},
	t.prototype.putString2bytes = function(t, r, e, o, n) {
		for (var i = this.stringToByteArray(r), s = 0; s < n; s++) t[n + s] = i[s]
	},
	t.prototype.convertUint8toByte = function(t) {
		return "string" == typeof t && (t = t.charCodeAt(0)),
		new Int8Array([t])[0]
	},
	t.prototype.convertUnit8s2Bytes = function(t) {
		for (var r = t.length,
		e = new Int8Array(r), o = 0; o < r; o++) e[o] = this.convertUint8toByte(t[o]);
		return e
	},
	t.prototype.convertNumberToChar = function(t) {
		return new Uint16Array([t])[0]
	},
	t.prototype.convertNumberToByte = function(t) {
		return new Int8Array([t])[0]
	},
	t.prototype.convertByte2Uint8 = function(t) {
		return "string" == typeof t && (t = t.charCodeAt(0)),
		255 & t
	},
	t.prototype.convertBytes2Uint8s = function(t) {
		for (var r = t.length,
		e = new Uint8Array(r), o = 0; o < r; o++) e[o] = this.convertByte2Uint8(t[o]);
		return e
	},
	t.prototype.putbytes2Uint8s = function(t, r, e, o, n) {
		for (var i = 0; i < n; i++) t[e + i] = this.convertByte2Uint8(r[o + i])
	},
	t.prototype.byteToHex = function(t) {
		var r = (255 & t).toString(16);
		return r.length > 1 ? r: "0" + r
	},
	t.prototype.byteArrayToString = function(t) {
		var r = 8192;
		if ((t = exports.byteUtil.toUint8Array(t)).length <= r) return String.fromCharCode.apply(null, t);
		for (var e = "",
		o = 0; o < t.length; o += r) {
			var n = t.slice(o, o + r);
			e += String.fromCharCode.apply(null, n)
		}
		return e
	},
	t.prototype.byteArrayToHex = function(t, r) {
		var e = this;
		void 0 === r && (r = "");
		var o = [];
		return t.forEach((function(t) {
			o.push(e.byteToHex(255 & t))
		})),
		o.join(r || "")
	},
	t.prototype.convertByte2HexString = function(t) {
		var r = this.convertByte2Uint8(t);
		return this.byteToHex(r)
	},
	t.prototype.convertU8ToHexString = function(t) {
		return this.byteToHex(t)
	},
	t.prototype.splitUint8To2bytes = function(t) {
		if (t < 0 || t > 255) throw "Out of Boundary";
		var r, e, o = this.convertByte2HexString(t);
		return o.length > 1 ? (e = parseInt(o.substring(0, 1), 16), r = parseInt(o.substring(1, 2), 16)) : (e = 0, r = parseInt(o.substring(0, 1), 16)),
		[e, r]
	},
	t.prototype.combine2bytesToOne = function(t, r) {
		if (t < 0 || t > 15 || r < 0 || r > 15) throw "Out of Boundary";
		return t << 4 | r
	},
	t.prototype.combine2bytesToU16 = function(t, r) {
		return this.convertByte2Uint8(t) << 8 | this.convertByte2Uint8(r)
	},
	t.prototype.getSpecBytesFromChar = function(t) {
		for (var r = new Int8Array(t), e = 0; e < t; e++) r[e] = this.convertUint8toByte("1");
		return r
	},
	t.prototype.genSpecBytes = function(t) {
		var r = this.convertByte2Uint8(t);
		return this.getSpecBytesFromChar(r)
	},
	t.prototype.parseBssid = function(t) {
		var r = new Int8Array(tslib_1.__spread(t));
		return this.getParsedBssid(r)
	},
	t.prototype.getParsedBssid = function(t) {
		for (var r, e = "",
		o = 0; o < t.length; o++) {
			r = 255 & t[o],
			e += this.byteToHex(r)
		}
		return e
	},
	t.prototype.parseBssid2bytes = function(t) {
		for (var r = t.split(":"), e = new Int8Array(r.length), o = 0; o < r.length; o++) e[o] = parseInt(r[o], 16);
		return e
	},
	t.prototype.getStringBytesLength = function(t) {
		for (var r, e = 0,
		o = 0; o < t.length; o++)(r = t.charCodeAt(o)) < 127 ? e++:e += r >= 128 && r <= 2047 ? 2 : r >= 2048 && r <= 65535 ? 3 : 4;
		return e
	},
	t.prototype.stringToUtf8ByteArray = function(t) {
		for (var r = new Int8Array(this.getStringBytesLength(t)), e = 0, o = 0; o < t.length; o++) {
			var n = t.charCodeAt(o);
			n < 128 ? r[e++] = n: n < 2048 ? (r[e++] = n >> 6 | 192, r[e++] = 63 & n | 128) : 55296 == (64512 & n) && o + 1 < t.length && 56320 == (64512 & t.charCodeAt(o + 1)) ? (n = 65536 + ((1023 & n) << 10) + (1023 & t.charCodeAt(++o)), r[e++] = n >> 18 | 240, r[e++] = n >> 12 & 63 | 128, r[e++] = n >> 6 & 63 | 128, r[e++] = 63 & n | 128) : (r[e++] = n >> 12 | 224, r[e++] = n >> 6 & 63 | 128, r[e++] = 63 & n | 128)
		}
		return r
	},
	t.prototype.utf8ByteArrayToString = function(t) {
		for (var r = [], e = 0, o = 0; e < t.length;) {
			var n = t[e++];
			if (n < 128) r[o++] = String.fromCharCode(n);
			else if (n > 191 && n < 224) {
				var i = t[e++];
				r[o++] = String.fromCharCode((31 & n) << 6 | 63 & i)
			} else if (n > 239 && n < 365) {
				var s = (7 & n) << 18 | (63 & (i = t[e++])) << 12 | (63 & (a = t[e++])) << 6 | (63 & t[e++]) - 65536;
				r[o++] = String.fromCharCode(55296 + (s >> 10)),
				r[o++] = String.fromCharCode(56320 + (1023 & s))
			} else {
				i = t[e++];
				var a = t[e++];
				r[o++] = String.fromCharCode((15 & n) << 12 | (63 & i) << 6 | 63 & a)
			}
		}
		return r.join("")
	},
	t.prototype.getBytesByString = function(t) {
		try {
			switch (this.ESPTOUCH_ENCODING_CHARSET) {
			case "UTF-8":
				return this.stringToUtf8ByteArray(t)
			}
		} catch(t) {
			throw "the charset is invalid"
		}
	},
	t.prototype.hexStringToByteArray = function(t) {
		for (var r = t.length,
		e = function(t) {
			for (var r = []; t-->0;) r.push(0);
			return r
		} (r / 2 | 0), o = 0; o < r; o += 2) e[o / 2 | 0] = this.convertNumberToByte((parseInt(t.charAt(o), 16) << 4) + parseInt(t.charAt(o + 1), 16) | 0);
		return e
	},
	t.prototype.hexString2hexArray = function(t) {
		return void 0 === t && (t = ""),
		t.match(/[\da-f]{2}/gi)
	},
	t.prototype.hexArray2Float32 = function(t, r) {
		if (4 !== t.length) throw "hex length is wrong";
		var e = new Uint32Array([parseInt(t.join(""), 16)]),
		o = new DataView(e.buffer);
		return void 0 === r ? o.getFloat32(0) : o.getFloat32(0).toFixed(r)
	},
	t.prototype.float32ToHexArray = function(t) {
		var r = new Float32Array([t]),
		e = new DataView(r.buffer).getUint32(0).toString(16);
		return this.hexString2hexArray("" + "0000000000".slice(0, 8 - e.length) + e)
	},
	t.prototype.hex2Int32 = function(t) {
		if ("string" == typeof t && (t = this.hexString2hexArray(t)), 4 !== t.length) throw "int32 must be 4 bytes";
		var r = parseInt(t.join(""), 16);
		return new Int32Array([r])[0]
	},
	t.prototype.int32ToHex = function(t) {
		var r = new Uint32Array([t])[0].toString(16);
		return "" + "00000000".slice(0, 8 - r.length) + r
	},
	t.prototype.arrayCopy = function(t, r, e, o, n) {
		if (t !== e || o >= r + n) for (; --n >= 0;) e[o++] = t[r++];
		else for (var i = t.slice(r, r + n), s = 0; s < n; s++) e[o++] = i[s]
	},
	t.prototype.crc8Byte = function(t) {
		for (var r = 0,
		e = 255 & t,
		o = 0; o < 8; ++o) 0 != (1 & (r ^ e)) ? (r ^= 24, r >>= 1, r |= 128) : r >>= 1,
		e >>= 1;
		return this.convertNumberToByte(255 & r)
	},
	t.prototype.crc8Bytes = function(t, r) {
		for (var e = 0,
		o = 0; o < r; ++o) e = this.crc8Byte(e ^ t[o]);
		return e
	},
	t.prototype.base64Encode = function(t) {
		for (var r, e, o, n, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		s = "",
		a = 0,
		y = (t = String(t)).length % 3; a < t.length;) {
			if ((e = t.charCodeAt(a++)) > 255 || (o = t.charCodeAt(a++)) > 255 || (n = t.charCodeAt(a++)) > 255) throw new TypeError("Failed to execute 'btoa' on 'Window':\n          The string to be encoded contains characters outside of the Latin1 range");
			s += i.charAt((r = e << 16 | o << 8 | n) >> 18 & 63) + i.charAt(r >> 12 & 63) + i.charAt(r >> 6 & 63) + i.charAt(63 & r)
		}
		return y ? s.slice(0, y - 3) + "===".substring(y) : s
	},
	t.prototype.testSplitUint8To2bytes = function() {
		var t = this.splitUint8To2bytes(20);
		1 === t[0] && 4 === t[1] ? console.log("test_splitUint8To2bytes(): pass") : console.log("test_splitUint8To2bytes(): fail")
	},
	t.prototype.testCombine2bytesToOne = function() {
		20 === this.combine2bytesToOne(1, 4) ? console.log("test_combine2bytesToOne(): pass") : console.log("test_combine2bytesToOne(): fail")
	},
	t.prototype.testConvertChar2Uint8 = function() {
		97 === this.convertByte2Uint8("a") && 128 === this.convertByte2Uint8( - 128) && 255 === this.convertByte2Uint8( - 1) ? console.log("test_convertChar2Uint8(): pass") : console.log("test_convertChar2Uint8(): fail")
	},
	t.prototype.testConvertUint8toByte = function() {
		97 === this.convertUint8toByte("a") && -128 === this.convertUint8toByte(128) && -1 === this.convertUint8toByte(255) ? console.log("test_convertUint8toByte(): pass") : console.log("test_convertUint8toByte(): fail")
	},
	t.prototype.testParseBssid = function() {
		var t = [15, -2, 52, -102, -93, -60];
		console.log(this.parseBssid(t)),
		"0ffe349aa3c4" === this.parseBssid(t) ? console.log("test_parseBssid(): pass") : console.log("test_parseBssid(): fail")
	},
	t.prototype.testMain = function() {
		this.testConvertUint8toByte(),
		this.testConvertChar2Uint8(),
		this.testSplitUint8To2bytes(),
		this.testCombine2bytesToOne(),
		this.testParseBssid()
	},
	t
} ();
exports.byteUtil = new ByteUtil;
