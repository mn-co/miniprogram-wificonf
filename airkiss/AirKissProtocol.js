"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.AirKissProtocol = void 0;
var tslib_1 = require("tslib"),
UDPSocket = require("../UDPSocket").UDPSocket,
byteUtil = require("../byteUtil").byteUtil;
function arraycopy(t, e, r, i, s) {
	r.splice.apply(r, tslib_1.__spread([i, 0], t.slice(e, e + s)))
}
var AirKissProtocol = function() {
	function t(t, e) {
		this.TARGET_ADDR = "255.255.255.255",
		this.TARGET_PORT = 10001,
		this.NUMBERS_OF_PRECURSOR = 20,
		this.NUMBERS_OF_MAGICCODE = 20,
		this.DATAS_IN_ONE_SEQUENCE = 4,
		this.SEND_PRECURSOR_DURATION_MS = 2e3,
		this.INTERVAL_OF_PACKET_DATA = 5,
		this.INTERVAL_OF_PACKET_GUIDE_CODE = 10,
		this.USE_BITS = 9,
		this.MAGIC_CODE_FLAG = 0,
		this.SEQUENCE_HEADER_FLAG = 1 << this.USE_BITS - 2,
		this.DATA_FLAG = 1 << this.USE_BITS - 1,
		this.mOriData = this.buildOriginalData(t, e),
		this.mValidPayload = this.buildValidPayload(this.mOriData),
		this.mMagicCodeField = this.getMagicCodeField(t, this.mOriData.length),
		this.mPrefixCodeField = this.getPrefixCodeField(e.length),
		this.mSequencesData = this.getSequencesData(this.mValidPayload),
		this.socket = new UDPSocket(1e4)
	}
	return t.prototype.destroy = function() {
		this.socket.destroy()
	},
	t.prototype.checkRandFromFeedback = function(t) {
		var e = new DataView(t).getUint8(0);
		return console.log("checkRandFromFeedback", e, 255 & e, this.rand, 255 & this.rand, (255 & e) == (255 & this.rand)),
		(255 & e) == (255 & this.rand)
	},
	t.prototype.randomByte = function() {
		return String(127 - Math.round(256 * Math.random()))
	},
	t.prototype.buildOriginalData = function(t, e) {
		return this.rand = this.randomByte(),
		tslib_1.__spread(byteUtil.stringToByteArray(e), [Number(this.rand)], byteUtil.getBytesByString(t))
	},
	t.prototype.buildValidPayload = function(t) {
		for (var e, r, i, s, a = Math.ceil((t.length << 3) / (this.USE_BITS - 1)), o = Array(a), n = 0; n < a; ++n) e = n * (this.USE_BITS - 1) >> 3,
		r = n * (this.USE_BITS - 1) & 7,
		i = ((255 & t[e]) << r & 255) >> 8 - this.USE_BITS + 1,
		s = n + 1 === a ? 0 : (255 & t[e + 1]) >> 8 - r >> 8 - this.USE_BITS + 1,
		o[n] = String(i | s);
		return o
	},
	t.prototype.getMagicCodeField = function(t, e) {
		var r = Array(4),
		i = byteUtil.stringToUtf8ByteArray(t),
		s = byteUtil.crc8Bytes(i, i.length);
		return e < 16 && (e += 128),
		r[0] = 0 | this.MAGIC_CODE_FLAG | e >> 4 & 15,
		r[1] = 16 | this.MAGIC_CODE_FLAG | 15 & e,
		r[2] = 32 | this.MAGIC_CODE_FLAG | s >> 4 & 15,
		r[3] = 48 | this.MAGIC_CODE_FLAG | 15 & s,
		r
	},
	t.prototype.getPrefixCodeField = function(t) {
		var e = Array(4),
		r = byteUtil.crc8Bytes([t], 1);
		return e[0] = 64 | this.MAGIC_CODE_FLAG | t >> 4 & 15,
		e[1] = 80 | this.MAGIC_CODE_FLAG | 15 & t,
		e[2] = 96 | this.MAGIC_CODE_FLAG | r >> 4 & 15,
		e[3] = 112 | this.MAGIC_CODE_FLAG | 15 & r,
		e
	},
	t.prototype.getSequencesData = function(t) {
		for (var e = Math.ceil(1 * t.length / this.DATAS_IN_ONE_SEQUENCE), r = [], i = null, s = 0, a = 0, o = 0; o < e; o++) a = o === e - 1 ? t.length - o * this.DATAS_IN_ONE_SEQUENCE: this.DATAS_IN_ONE_SEQUENCE,
		s = o * this.DATAS_IN_ONE_SEQUENCE,
		arraycopy(i = this.getSequenceField(o, t, s, a), 0, r, s + (o << 1), i.length);
		return r
	},
	t.prototype.getSequenceField = function(t, e, r, i) {
		var s = [],
		a = Array(i + 2);
		s.push(t),
		arraycopy(e, r, s, 1, i);
		var o = byteUtil.crc8Bytes(s, i + 1);
		a[0] = this.SEQUENCE_HEADER_FLAG | o & 255 >> 8 - this.USE_BITS + 2,
		a[1] = this.SEQUENCE_HEADER_FLAG | t & 255 >> 8 - this.USE_BITS + 2;
		for (var n = 0; n < i; ++n) a[2 + n] = this.DATA_FLAG | 255 & e[r + n];
		return a
	},
	t.prototype.startPrecursorBroadcast = function() {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var t, e, r, i, s, a, o, n, _, l, c, h, A, E;
			return tslib_1.__generator(this, (function(d) {
				switch (d.label) {
				case 0:
					t = 0,
					e = this.mMagicCodeField,
					r = [1, 2, 3, 4],
					i = new ArrayBuffer(1 << this.USE_BITS - 1),
					s = Date.now(),
					a = s,
					d.label = 1;
				case 1:
					if (! (a - s < this.SEND_PRECURSOR_DURATION_MS)) return [3, 6];
					o = 0,
					d.label = 2;
				case 2:
					return o < 4 ? [4, this.socket.sendData({
						message: i,
						address: this.TARGET_ADDR,
						port: this.TARGET_PORT,
						length: r[o],
						timeDelay: this.INTERVAL_OF_PACKET_GUIDE_CODE
					})] : [3, 5];
				case 3:
					d.sent(),
					d.label = 4;
				case 4:
					return++o,
					[3, 2];
				case 5:
					return a = Date.now(),
					[3, 1];
				case 6:
					n = 0,
					d.label = 7;
				case 7:
					if (! (n < this.NUMBERS_OF_MAGICCODE)) return [3, 16];
					d.label = 8;
				case 8:
					d.trys.push([8, 13, 14, 15]),
					A = void 0,
					_ = tslib_1.__values(e),
					l = _.next(),
					d.label = 9;
				case 9:
					return l.done ? [3, 12] : (c = l.value, [4, this.socket.sendData({
						message: i,
						address: this.TARGET_ADDR,
						port: this.TARGET_PORT,
						length: c,
						timeDelay: this.INTERVAL_OF_PACKET_DATA
					})]);
				case 10:
					d.sent(),
					d.label = 11;
				case 11:
					return l = _.next(),
					[3, 9];
				case 12:
					return [3, 15];
				case 13:
					return h = d.sent(),
					A = {
						error: h
					},
					[3, 15];
				case 14:
					try {
						l && !l.done && (E = _.
						return) && E.call(_)
					} finally {
						if (A) throw A.error
					}
					return [7];
				case 15:
					return++n,
					[3, 7];
				case 16:
					return [2, t]
				}
			}))
		}))
	},
	t.prototype.startPrecursorBroadcastUseSetTimeout = function() {
		var t = this;
		return new Promise((function(e) {
			for (var r, i, s = t.mMagicCodeField,
			a = [1, 2, 3, 4], o = new ArrayBuffer(1 << t.USE_BITS - 1), n = [], _ = 0; _ < t.SEND_PRECURSOR_DURATION_MS / (4 * t.INTERVAL_OF_PACKET_GUIDE_CODE); _++) for (var l = 0; l < 4; ++l) n.push(o.slice(0, a[l]));
			for (_ = 0; _ < t.NUMBERS_OF_MAGICCODE; ++_) try {
				for (var c = (r = void 0, tslib_1.__values(s)), h = c.next(); ! h.done; h = c.next()) {
					var A = h.value;
					n.push(o.slice(0, A))
				}
			} catch(t) {
				r = {
					error: t
				}
			} finally {
				try {
					h && !h.done && (i = c.
					return) && i.call(c)
				} finally {
					if (r) throw r.error
				}
			}
			t.socket.sendDataSideBySide({
				data: n,
				address: t.TARGET_ADDR,
				port: t.TARGET_PORT,
				offset: 0,
				length: n.length,
				timeDelay: t.INTERVAL_OF_PACKET_DATA,
				callback: function() {
					e()
				}
			})
		}))
	},
	t.prototype.startDataBroadcast = function() {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var t, e, r;
			return tslib_1.__generator(this, (function(i) {
				switch (i.label) {
				case 0:
					t = this.mPrefixCodeField,
					e = new ArrayBuffer(1 << this.USE_BITS),
					r = 0,
					i.label = 1;
				case 1:
					return r < t.length ? [4, this.socket.sendData({
						message: e,
						address: this.TARGET_ADDR,
						port: this.TARGET_PORT,
						length: t[r],
						timeDelay: this.INTERVAL_OF_PACKET_DATA
					})] : [3, 4];
				case 2:
					i.sent(),
					i.label = 3;
				case 3:
					return++r,
					[3, 1];
				case 4:
					r = 0,
					i.label = 5;
				case 5:
					return r < this.mSequencesData.length ? [4, this.socket.sendData({
						message: e,
						address: this.TARGET_ADDR,
						port: this.TARGET_PORT,
						length: this.mSequencesData[r],
						timeDelay: this.INTERVAL_OF_PACKET_DATA
					})] : [3, 8];
				case 6:
					i.sent(),
					i.label = 7;
				case 7:
					return++r,
					[3, 5];
				case 8:
					return [2]
				}
			}))
		}))
	},
	t.prototype.startDataBroadcastUseSetTimeout = function() {
		var t = this;
		return new Promise((function(e) {
			for (var r = t.mPrefixCodeField,
			i = new ArrayBuffer(1 << t.USE_BITS), s = [], a = 0; a < r.length; ++a) s.push(i.slice(0, r[a]));
			for (a = 0; a < t.mSequencesData.length; ++a) s.push(i.slice(0, t.mSequencesData[a]));
			t.socket.sendDataSideBySide({
				data: s,
				address: t.TARGET_ADDR,
				port: t.TARGET_PORT,
				offset: 0,
				length: s.length,
				timeDelay: t.INTERVAL_OF_PACKET_DATA,
				callback: function() {
					e()
				}
			})
		}))
	},
	t
} ();
exports.AirKissProtocol = AirKissProtocol;
