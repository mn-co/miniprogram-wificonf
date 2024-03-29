"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.UDPSocketServer = void 0;
var tslib_1 = require("tslib"),
EventEmitterImpl = require("./EventEmitter").EventEmitter,
noop = require("./util").noop,
UDPSocketServer = function(e) {
	function t(t, o, i) {
		var r = e.call(this) || this;
		return r.TAG = "UDPSocketServer",
		r.msgHandler = noop,
		r.mSocket = t,
		r.isClose = !1,
		r.mSocket.onClose((function() {
			r.interrupt()
		})),
		r.mTimeout = o,
		i && (r.mCorrectLen = i),
		r
	}
	return tslib_1.__extends(t, e),
	t.prototype.startServer = function() {
		this.handlerTimeout(this.mTimeout),
		this.onListening(),
		this.onMessage(this.mCorrectLen)
	},
	t.prototype.handlerTimeout = function(e) {
		var t = this;
		this.mSocketTimeoutTimer = setTimeout((function() {
			t.trigger("timeout"),
			t.interrupt()
		}), e)
	},
	t.prototype.onMessage = function(e) {
		var t = this;
		this.msgHandler = function(o) {
			t.isClose || (console.log(t.TAG, "recieveMsg", o), t.trigger("recieveMsg", o), !e || e && o.remoteInfo.size === e ? t.trigger("recieveCorrectMsg", o) : console.log(t.TAG, "received len is different from specific len"))
		},
		this.mSocket.onMessage(this.msgHandler)
	},
	t.prototype.onListening = function() {
		var e = this;
		this.mSocket.onListening((function(t) {
			e.isClose || (e.trigger("recieveMsg", t), console.log(e.TAG, "onListening", t))
		}))
	},
	t.prototype.interrupt = function() {
		console.log(this.TAG, "USPSocketServer is interrupt"),
		this.mSocket.offMessage(this.msgHandler),
		this.close()
	},
	t.prototype.close = function() {
		this.isClose = !0
	},
	t
} (EventEmitterImpl);
exports.UDPSocketServer = UDPSocketServer;
