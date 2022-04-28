"use strict";
var noop = require("./util").noop;
var EventEmitterImpl = require("./EventEmitter").EventEmitter;
var delay = require("./util").delay;

Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.UDPSocket = void 0;
var tslib_1 = require("tslib"),
UDPSocket = function(e) {
	function t(t) {
		var o = e.call(this) || this;
		o.isClose = !1,
		o.destroy = noop,
		o.socket = wx.createUDPSocket(),
		console.log("udp socket bind on port", t || "random");
		try {
			o.socket.bind(t)
		} catch(e) {
			o.trigger("error", e)
		}
		var s = function(e) {
			return o.trigger("close", e)
		},
		r = function(e) {
			return o.trigger("error", e)
		},
		n = function(e) {
			return o.trigger("message", e)
		},
		i = function(e) {
			return o.trigger("listening", e)
		};
		return o.socket.onClose((function(e) {
			return s(e)
		})),
		o.socket.onError((function(e) {
			return r(e)
		})),
		o.socket.onMessage((function(e) {
			return n(e)
		})),
		o.socket.onListening(i),
		o.destroy = function() {
			console.log("udp client destroy"),
			o.isClose = !0,
			o.socket.offClose(s),
			o.socket.offError(r),
			o.socket.offMessage(n),
			o.socket.offListening(i),
			o.socket.close();
			EventEmitterImpl.prototype.destory.call(this);
		},
		o
	}
	return tslib_1.__extends(t, e),
	t.prototype.sendData = function(e) {
		var t = e.address,
		o = e.port,
		s = e.message,
		r = e.offset,
		n = e.length,
		i = e.timeDelay;
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var e = this;
			return tslib_1.__generator(this, (function(c) {
				switch (c.label) {
				case 0:
					return [4, new Promise((function(i, c) {
						try {
							e.socket.send({
								address: t,
								port: o,
								message: s,
								offset: r,
								length: n
							}),
							i()
						} catch(e) {
							c(e)
						}
					}))];
				case 1:
					return c.sent(),
					i ? [4, delay(i)] : [3, 3];
				case 2:
					c.sent(),
					c.label = 3;
				case 3:
					return [2]
				}
			}))
		}))
	},
	t.prototype.sendDataSideBySide = function(e) {
		var t = this,
		o = e.address,
		s = e.port,
		r = e.data,
		n = void 0 === r ? [] : r,
		i = e.offset,
		c = e.length,
		a = e.timeDelay,
		d = e.callback;
		if (c <= 0 || this.isClose) return d();
		setTimeout((function() {
			t.socket.send({
				address: o,
				port: s,
				message: n[i]
			});
			var e = Math.min(n.length - 1, i + 1),
			r = e >= n.length ? 0 : c - 1;
			t.sendDataSideBySide({
				address: o,
				port: s,
				data: n,
				offset: e,
				length: r,
				timeDelay: a,
				callback: d
			})
		}), a)
	},
	t
} (EventEmitterImpl);
exports.UDPSocket = UDPSocket;
