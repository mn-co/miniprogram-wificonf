"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.UDPSocketClient = void 0;
var delay = require("./util").delay;
var tslib_1 = require("tslib"),
EventEmitterImpl = require("./EventEmitter").EventEmitter;
var compareVersion = require("./util").compareVersion,
delayPromise = function(e) {
	return new Promise((function(t) {
		setTimeout((function() {
			t()
		}), e)
	}))
},
UDPSocketClient = function(e) {
	function t(t) {
		var o = e.call(this) || this;
		return o.TAG = "UDPSocketClient",
		o.dataQueue = {},
		o.queueExcuteState = {},
		o.checkIsSupport() && (o.mSocket = wx.createUDPSocket(), o.mSocket.bind(t), o.isClose = !1, o.mSocket.onClose((function() {
			o.isClose = !0
		})), o.errorHandler = function(e) {
			o.trigger("udpSocketError", e)
		},
		o.mSocket.onError(o.errorHandler)),
		o
	}
	return tslib_1.__extends(t, e),
	t.prototype.checkIsSupport = function() {
		var e = wx.getSystemInfoSync().SDKVersion;
		return ! (compareVersion(e, "2.7.0") < 0) || (this.trigger("udpSocketError", "当前微信版本过低，无法使用udpsocket的功能，请升级到最新微信版本后重试。"), !1)
	},
	t.prototype.interrupt = function() {
		console.log(this.TAG, "USPSocketClient is interrupt"),
		this.close()
	},
	t.prototype.close = function() {
		this.isClose = !0,
		this.mSocket && (this.mSocket.offError(this.errorHandler), this.mSocket.close(), this.mSocket = null)
	},
	t.prototype.sendDataSideBySide = function(e, t, o, s, r, i, n) {
		var l = this;
		if (void 0 === t && (t = 0), 1 === o || this.isClose) return ! this.isClose && (console.log("UDPSocketClient send", {
			address: s,
			port: r,
			message: e[t]
		}), this.mSocket.send({
			address: s,
			port: r,
			message: e[t]
		})),
		n();
		setTimeout((function() {
			var c = Math.min(e.length - 1, t + 1),
			u = c >= e.length - 1 ? 1 : o - 1; ! l.isClose && (console.log("UDPSocketClient send", {
				address: s,
				port: r,
				message: e[t]
			}), l.mSocket.send({
				address: s,
				port: r,
				message: e[t]
			})),
			l.sendDataSideBySide(e, c, u, s, r, i, n)
		}), i)
	},
	t.prototype.sendData = function(e, t, o, s, r, i) {
		return void 0 === t && (t = 0),
		tslib_1.__awaiter(this, void 0, void 0, (function() {
			var n;
			return tslib_1.__generator(this, (function(l) {
				switch (l.label) {
				case 0:
					if (!e || e.length <= 0) return console.log(this.TAG, "sendData(): data == null or length <= 0"),
					[2];
					if (this.isClose) return console.log(this.TAG, "udpsocket is close"),
					[2];
					n = t,
					l.label = 1;
				case 1:
					return n < Math.min(t + o, e.length) ? (console.log("UDPSocketClient send", {
						address: s,
						port: r,
						message: e[n]
					}), ! this.isClose && this.mSocket.send({
						address: s,
						port: r,
						message: e[n]
					}), [4, delayPromise()]) : [3, 4];
				case 2:
					l.sent(),
					l.label = 3;
				case 3:
					return n++,
					[3, 1];
				case 4:
					return [4, delay(i)];
				case 5:
					return l.sent(),
					[2]
				}
			}))
		}))
	},
	t
} (EventEmitterImpl);
exports.UDPSocketClient = UDPSocketClient;
