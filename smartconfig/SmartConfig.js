"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.SmartConfig = void 0;
var EventEmitterImpl = require("../EventEmitter").EventEmitter;
var delay = require("../util").delay;
var tslib_1 = require("tslib"),
esptouchTaskParameter_1 = require("./base/esptouchTaskParameter"),
EsptouchGenerator_1 = require("./protocol/EsptouchGenerator"),
UDPSocketClient = require("../UDPSocketClient").UDPSocketClient,
UDPSocketServer = require("../UDPSocketServer").UDPSocketServer,
parseInetAddr = require("../util").parseInetAddr,
byteUtil = require("../byteUtil").byteUtil,
SmartConfig = function(e) {
	function t(t, r, s, i, o, a) {
		var n = e.call(this) || this;
		return n.TAG = "SmartConfig",
		n.ONE_DATA_LEN = 3,
		n.mIsSuc = !1,
		n.mIsInterrupt = !1,
		n.mIsExecuted = !1,
		n.mEncryptor = a,
		n.mApSsid = t.getData(),
		n.mApPassword = s.getData(),
		n.mApBssid = r.getData(),
		n.mIsCancelled = !1,
		n.mParameter = esptouchTaskParameter_1.esptouchTaskParameter,
		n.mSocketClient = new UDPSocketClient(n.mParameter.getPortListening()),
		n.mSocketServer = new UDPSocketServer(n.mSocketClient.mSocket, n.mParameter.getWaitUdpTotalMillisecond(), n.mParameter.getEsptouchResultTotalLen()),
		n.mSocketClient.on("udpSocketError", (function(e) {
			e = typeof e === "string" ? {errMsg: e} : e;
			n.trigger("onError", Object.assign({code: "UDP_ERROR"}, e)),
			n.interrupt()
		})),
		n.mEsptouchResultList = [],
		n.mBssidTaskSucCountMap = {},
		n.mLocalIp = i,
		n.logger = o,
		n.logger.info("Welcome Esptouch smartconfig in weapp"),
		n
	}
	return tslib_1.__extends(t, e),
	t.prototype.__checkTaskValid = function() {
		return this.mIsExecuted ? (this.logger.error({
			msg: "the Esptouch task could be executed only once"
		}), !1) : (this.mIsExecuted = !0, !0)
	},
	t.prototype.start = function(e) {
		return void 0 === e && (e = 1),
		tslib_1.__awaiter(this, void 0, void 0, (function() {
			var t, r;
			return tslib_1.__generator(this, (function(s) {
				switch (s.label) {
				case 0:
					if (!this.__checkTaskValid()) return [2];
					this.mParameter.setExpectTaskResultCount(e),
					this.logger.info("start smartconfig in promise settimeout"),
					t = new EsptouchGenerator_1.EsptouchGenerator(this.mApSsid, this.mApBssid, this.mApPassword, this.mLocalIp, this.mEncryptor),
					this.mSocketServer.startServer(),
					this.__listenAsyn(this.mParameter.getEsptouchResultTotalLen()),
					!1,
					r = 0,
					s.label = 1;
				case 1:
					return r < this.mParameter.getTotalRepeatTime() ? [4, this.__execute(t)] : [3, 4];
				case 2:
					if (s.sent()) return [2, this.__getEsptouchResultList()];
					s.label = 3;
				case 3:
					return r++,
					[3, 1];
				case 4:
					return this.mIsInterrupt ? [3, 6] : [4, delay(this.mParameter.getWaitUdpReceivingMillisecond())];
				case 5:
					s.sent(),
					this.mIsSuc || this.trigger("onError", {
						code: "PROTOCOL_TIMEOUT"
					}),
					this.interrupt(),
					s.label = 6;
				case 6:
					return [2, this.__getEsptouchResultList()]
				}
			}))
		}))
	},
	t.prototype.startInNoPromise = function(e) {
		var t = this;
		if (void 0 === e && (e = 1), this.__checkTaskValid()) {
			this.mParameter.setExpectTaskResultCount(e),
			this.logger.info("start smartconfig in no promise settimeout");
			var r = new EsptouchGenerator_1.EsptouchGenerator(this.mApSsid, this.mApBssid, this.mApPassword, this.mLocalIp, this.mEncryptor);
			this.mSocketServer.startServer(),
			this.__listenAsyn(this.mParameter.getEsptouchResultTotalLen()),
			this.__executeInNoPromise(r),
			setTimeout((function() {
				t.mIsSuc || t.trigger("onError", {
					code: "PROTOCOL_TIMEOUT"
				}),
				t.trigger("result", t.__getEsptouchResultList()),
				t.interrupt()
			}), this.mParameter.getWaitUdpTotalMillisecond())
		}
	},
	t.prototype.__executeInNoPromise = function(e) {
		var t = this,
		r = Date.now(),
		s = r - this.mParameter.getTimeoutTotalCodeMillisecond(),
		i = 0,
		o = e.getGCBytes2(),
		a = e.getDCBytes2(),
		n = function() {
			if (!t.mIsInterrupt && Date.now() - r < t.mParameter.getTimeoutGuideCodeMillisecond()) return t.mSocketClient.sendDataSideBySide(o, 0, o.length, t.mParameter.getTargetHostname(), t.mParameter.getTargetPort(), t.mParameter.getIntervalGuideCodeMillisecond(), n);
			c()
		},
		c = function() {
			t.mIsInterrupt ? t.trigger("result", t.__getEsptouchResultList()) : (r - s >= t.mParameter.getTimeoutDataCodeMillisecond() ? (t.logger.info("send gc code "), n(), s = r) : (t.mSocketClient.sendDataSideBySide(a, i, t.ONE_DATA_LEN, t.mParameter.getTargetHostname(), t.mParameter.getTargetPort(), t.mParameter.getIntervalDataCodeMillisecond(), c), i = (i + t.ONE_DATA_LEN) % a.length), r = Date.now())
		};
		c(),
		setTimeout((function() {
			t.interrupt()
		}), this.mParameter.getWaitUdpSendingMillisecond())
	},
	t.prototype.__execute = function(e) {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			var t, r, s, i, o, a;
			return tslib_1.__generator(this, (function(n) {
				switch (n.label) {
				case 0:
					t = Date.now(),
					s = (r = t) - this.mParameter.getTimeoutTotalCodeMillisecond(),
					i = e.getGCBytes2(),
					o = e.getDCBytes2(),
					a = 0,
					n.label = 1;
				case 1:
					if (this.mIsInterrupt) return [3, 8];
					if (! (r - s >= this.mParameter.getTimeoutDataCodeMillisecond())) return [3, 5];
					this.logger.info("send gc code "),
					n.label = 2;
				case 2:
					return ! this.mIsInterrupt && Date.now() - r < this.mParameter.getTimeoutGuideCodeMillisecond() ? [4, this.mSocketClient.sendData(i, 0, i.length, this.mParameter.getTargetHostname(), this.mParameter.getTargetPort(), this.mParameter.getIntervalGuideCodeMillisecond())] : [3, 4];
				case 3:
					return n.sent(),
					Date.now() - t > this.mParameter.getWaitUdpSendingMillisecond() ? [3, 4] : [3, 2];
				case 4:
					return s = r,
					[3, 7];
				case 5:
					return [4, this.mSocketClient.sendData(o, a, this.ONE_DATA_LEN, this.mParameter.getTargetHostname(), this.mParameter.getTargetPort(), this.mParameter.getIntervalDataCodeMillisecond())];
				case 6:
					n.sent(),
					a = (a + this.ONE_DATA_LEN) % o.length,
					n.label = 7;
				case 7:
					return (r = Date.now()) - t > this.mParameter.getWaitUdpSendingMillisecond() ? [3, 8] : [3, 1];
				case 8:
					return [2, this.mIsSuc]
				}
			}))
		}))
	},
	t.prototype.__listenAsyn = function() {
		var e = this;
		this.logger.info("__listenAsyn() start");
		var t = this.mApSsid,
		r = this.mApPassword,
		s = Date.now(),
		i = byteUtil.convertUint8toByte(t.length + r.length + 9);
		this.logger.info("expectOneByte: " + i);
		this.mSocketServer.on("recieveCorrectMsg", (function(t) {
			e.mIsInterrupt || (e.logger.info("RECIEVE_MSG", t),
			function(t) {
				var r = t.message,
				o = t.remoteInfo,
				a = -1,
				n = new Int8Array(r);
				if (e.logger.info("Int8Array", {
					data: n
				}), a = n ? tslib_1.__read(n, 1)[0] : -1, e.logger.info("receiveOneByte: " + a), a !== i) e.logger.info("receive rubbish message, just ignore");
				else {
					e.logger.info("receive correct broadcast");
					var c = Date.now() - s,
					l = Number(e.mParameter.getWaitUdpTotalMillisecond() - c);
					if (l < 0) e.logger.error({
						msg: "esptouch  receive timeout"
					});
					else if (e.logger.info("mSocketServer's new timeout is " + l + " milliseconds"), e.logger.info("receive correct broadcast"), n) {
						var u = byteUtil.parseBssid(n, e.mParameter.getEsptouchResultOneLen(), e.mParameter.getEsptouchResultMacLen()),
						m = parseInetAddr(n, e.mParameter.getEsptouchResultOneLen() + e.mParameter.getEsptouchResultMacLen(), e.mParameter.getEsptouchResultIpLen());
						e.__putEsptouchResult(!0, u, m, o)
					}
				}
			} (t), e.mIsSuc = e.mEsptouchResultList.length >= e.mParameter.getExpectTaskResultCount(), e.mIsSuc && (e.logger.info("__listenAsyn() finish"), e.interrupt()))
		}))
	},
	t.prototype.__putEsptouchResult = function(e, t, r, s) {
		var i, o, a = this.mBssidTaskSucCountMap[t];
		if (void 0 === a && (a = 0), ++a, this.logger.info("PUT_ESPTOUCH_RESULT:__putEsptouchResult(): count = " + a), this.mBssidTaskSucCountMap[t] = a, a >= this.mParameter.getThresholdSucBroadcastCount()) {
			var n = !1;
			try {
				for (var c = tslib_1.__values(this.mEsptouchResultList), l = c.next(); ! l.done; l = c.next()) {
					if (l.value.bssid === t) {
						n = !0;
						break
					}
				}
			} catch(e) {
				i = {
					error: e
				}
			} finally {
				try {
					l && !l.done && (o = c.
					return) && o.call(c)
				} finally {
					if (i) throw i.error
				}
			}
			if (!n) {
				this.logger.info("PUT_ESPTOUCH_RESULT:put one more result bssid = " + t + ",\n      address = " + r + ",\n      the remoteInfo from weapp" + JSON.stringify(s) + "\n      ");
				var u = {
					isSuc: e,
					bssid: t,
					inetAddress: r,
					remoteInfo: s
				};
				this.mEsptouchResultList.push(u)
			}
		} else this.logger.info("PUT_ESPTOUCH_RESULT:__putEsptouchResult(): count = " + a + ", isn't enough")
	},
	t.prototype.__getEsptouchResultList = function() {
		return this.logger.info("GET_RESULT", {
			data: this.mEsptouchResultList
		}),
		this.mEsptouchResultList
	},
	t.prototype.interrupt = function() {
		return tslib_1.__awaiter(this, void 0, void 0, (function() {
			return tslib_1.__generator(this, (function(e) {
				return this.mIsInterrupt || (this.mIsCancelled = !0, this.mIsInterrupt = !0, this.mSocketClient.interrupt(), delete this.mSocketClient),
				[2]
			}))
		}))
	},
	t.prototype.isCancelled = function() {
		return this.mIsCancelled
	},
	t.prototype.setPackageBroadcast = function(e) {
		this.mParameter.setBroadcast(e)
	},
	t
} (EventEmitterImpl);
exports.SmartConfig = SmartConfig;