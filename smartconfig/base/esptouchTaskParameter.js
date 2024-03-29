"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.esptouchTaskParameter = exports.EsptouchTaskParameter = void 0;
var EsptouchTaskParameter = function() {
	function t() {
		this.mBroadcast = !0,
		this.mIntervalGuideCodeMillisecond = 20,
		this.mIntervalDataCodeMillisecond = 20,
		this.mTimeoutGuideCodeMillisecond = 1500,
		this.mTimeoutDataCodeMillisecond = 5e3,
		this.mTotalRepeatTime = 1,
		this.mEsptouchResultOneLen = 1,
		this.mEsptouchResultMacLen = 6,
		this.mEsptouchResultIpLen = 4,
		this.mEsptouchResultTotalLen = 11,
		this.mPortListening = 18266,
		this.mTargetPort = 7001,
		this.mWaitUdpReceivingMilliseond = 25e3,
		this.mWaitUdpSendingMillisecond = 45e3,
		this.mThresholdSucBroadcastCount = 1,
		this.mExpectTaskResultCount = 1,
		this._datagramCount = 0
	}
	return t.prototype.getIntervalGuideCodeMillisecond = function() {
		return this.mIntervalGuideCodeMillisecond
	},
	t.prototype.getIntervalDataCodeMillisecond = function() {
		return this.mIntervalDataCodeMillisecond
	},
	t.prototype.getTimeoutGuideCodeMillisecond = function() {
		return this.mTimeoutGuideCodeMillisecond
	},
	t.prototype.getTimeoutDataCodeMillisecond = function() {
		return this.mTimeoutDataCodeMillisecond
	},
	t.prototype.getTimeoutTotalCodeMillisecond = function() {
		return this.mTimeoutGuideCodeMillisecond + this.mTimeoutDataCodeMillisecond
	},
	t.prototype.getTotalRepeatTime = function() {
		return this.mTotalRepeatTime
	},
	t.prototype.getEsptouchResultOneLen = function() {
		return this.mEsptouchResultOneLen
	},
	t.prototype.getEsptouchResultMacLen = function() {
		return this.mEsptouchResultMacLen
	},
	t.prototype.getEsptouchResultIpLen = function() {
		return this.mEsptouchResultIpLen
	},
	t.prototype.getEsptouchResultTotalLen = function() {
		return this.mEsptouchResultTotalLen
	},
	t.prototype.getPortListening = function() {
		return this.mPortListening
	},
	t.prototype.getTargetHostname = function() {
		if (this.mBroadcast) return "255.255.255.255";
		var t = this.__getNextDatagramCount();
		return "234." + t + "." + t + "." + t
	},
	t.prototype.getTargetPort = function() {
		return this.mTargetPort
	},
	t.prototype.getWaitUdpReceivingMillisecond = function() {
		return this.mWaitUdpReceivingMilliseond
	},
	t.prototype.getWaitUdpSendingMillisecond = function() {
		return this.mWaitUdpSendingMillisecond
	},
	t.prototype.getWaitUdpTotalMillisecond = function() {
		return this.mWaitUdpReceivingMilliseond + this.mWaitUdpSendingMillisecond
	},
	t.prototype.setWaitUdpTotalMillisecond = function(t) {
		if (t < this.mWaitUdpReceivingMilliseond + this.getTimeoutTotalCodeMillisecond()) throw new Error("waitUdpTotalMillisecod is less than \n      " + this.mWaitUdpReceivingMilliseond + " " + this.getTimeoutTotalCodeMillisecond() + "\n      ");
		this.mWaitUdpSendingMillisecond = t - this.mWaitUdpReceivingMilliseond
	},
	t.prototype.getThresholdSucBroadcastCount = function() {
		return this.mThresholdSucBroadcastCount
	},
	t.prototype.getExpectTaskResultCount = function() {
		return this.mExpectTaskResultCount
	},
	t.prototype.setExpectTaskResultCount = function(t) {
		this.mExpectTaskResultCount = t
	},
	t.prototype.setBroadcast = function(t) {
		this.mBroadcast = t
	},
	t.prototype.__getNextDatagramCount = function() {
		return 1 + this._datagramCount++%100
	},
	t
} ();
exports.EsptouchTaskParameter = EsptouchTaskParameter,
exports.esptouchTaskParameter = new EsptouchTaskParameter;
