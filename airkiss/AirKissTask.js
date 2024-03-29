"use strict";
var genPromise = require("../util").genPromise;
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.AirKissTask = void 0;
var tslib_1 = require("tslib"),
AirKissProtocol_1 = require("./AirKissProtocol"),
byteUtil = require("../byteUtil").byteUtil,
TASK_TIMEOUT = 3e4,
AirKissTask = function() {
	function s(s, r) {
		var i = this;
		this.SEND_DATA_PER_CIRCLE_TIME = 3e3,
		this.ssid = s,
		this.pwd = r,
		this.airKissProtocol = new AirKissProtocol_1.AirKissProtocol(this.ssid, this.pwd),
		this.airKissProcessing = !1,
		this.airKissPromise = genPromise(),
		this.airKissProtocol.socket.on("message", (function(s) {
			try {
				i.airKissProtocol.checkRandFromFeedback(s.message) && (i.airKissProcessing = !1, s.remoteInfo ? i.airKissPromise.resolve({
					mac: byteUtil.byteArrayToHex(new Uint8Array(s.message).slice(1)),
					address: s.remoteInfo.address
				}) : i.airKissPromise.reject({
					code: "PROTOCOL_INVALID_RESPONSE"
				}))
			} catch(s) {
				console.log("onMessage error", s)
			}
		})),
		this.airKissProtocol.socket.on("error", (function(s) {
			s = typeof s === "string" ? {errMsg: s} : s;
			i.airKissProcessing && i.airKissPromise.reject(Object.assign({
				code: "UDP_ERROR"
			}, s))
		})),
		this.airKissProtocol.socket.on("close", (function() {
			i.airKissProcessing && i.airKissPromise.reject({
				code: "UDP_CLOSED"
			})
		}))
	}
	return s.prototype.sendAirKissData = function() {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var s, r, i, e;
			return tslib_1.__generator(this, (function(t) {
				switch (t.label) {
				case 0:
					r = (s = {
						android: {
							precursor: "startPrecursorBroadcastUseSetTimeout",
							data: "startDataBroadcastUseSetTimeout"
						},
						ios: {
							precursor: "startPrecursorBroadcast",
							data: "startDataBroadcast"
						}
					})[wx.getSystemInfoSync().platform] || s.ios,
					t.label = 1;
				case 1:
					return this.airKissProcessing ? [4, this.airKissProtocol[r.precursor]()] : [3, 6];
				case 2:
					t.sent(),
					i = Date.now(),
					e = Date.now(),
					t.label = 3;
				case 3:
					return i - e <= this.SEND_DATA_PER_CIRCLE_TIME ? [4, this.airKissProtocol[r.data]()] : [3, 5];
				case 4:
					return t.sent(),
					i = Date.now(),
					[3, 3];
				case 5:
					return [3, 1];
				case 6:
					return [2]
				}
			}))
		}))
	},
	s.prototype.startAirKiss = function() {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var s, r, i = this;
			return tslib_1.__generator(this, (function(e) {
				switch (e.label) {
				case 0:
					if (this.airKissProcessing) return [2, Promise.reject("AirKiss当前正在执行配网流程")];
					e.label = 1;
				case 1:
					return e.trys.push([1, 3, , 4]),
					this.airKissProcessing = !0,
					[4, Promise.race([new Promise((function(s, r) {
						return tslib_1.__awaiter(i, void 0, void 0, (function() {
							var s;
							return tslib_1.__generator(this, (function(i) {
								switch (i.label) {
								case 0:
									return i.trys.push([0, 2, , 3]),
									[4, this.sendAirKissData()];
								case 1:
									return i.sent(),
									[3, 3];
								case 2:
									return s = i.sent(),
									this.airKissProcessing && r({
										code: "PROTOCOL_FAIL",
										error: s
									}),
									[3, 3];
								case 3:
									return [2]
								}
							}))
						}))
					})), this.airKissPromise.promise, new Promise((function(s, r) {
						setTimeout((function() {
							r({
								code: "PROTOCOL_TIMEOUT"
							})
						}), TASK_TIMEOUT)
					}))])];
				case 2:
					return s = e.sent(),
					this.airKissProcessing = !1,
					this.airKissProtocol.destroy(),
					[2, s];
				case 3:
					return r = e.sent(),
					this.airKissProcessing = !1,
					this.destroy(),
					[2, Promise.reject(r)];
				case 4:
					return [2]
				}
			}))
		}))
	},
	s.prototype.destroy = function() {
		this.airKissProcessing = !1,
		this.airKissProtocol.destroy()
	},
	s
} ();
exports.AirKissTask = AirKissTask;
