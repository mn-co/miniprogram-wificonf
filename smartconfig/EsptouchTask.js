"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
}),
exports.EsptouchTask = void 0;
var tslib_1 = require("tslib"),
TouchData_1 = require("./protocol/TouchData"),
SmartConfig_1 = require("./SmartConfig"),
byteUtil = require("../byteUtil").byteUtil,
EsptouchTask = function() {
	function t(ssid, bssid, pwd, localIp) {
		var s = ssid,
		e = bssid,
		i = pwd,
		r = console,
		o = localIp,
		a = void 0 === o ? "255.255.255.255": o;
		if (this.ssid = new TouchData_1.TouchData(byteUtil.getBytesByString(s)), this.bssid = new TouchData_1.TouchData(byteUtil.parseBssid2bytes(e)), 6 !== this.bssid.getData().length) throw "Bssid format must be aa:bb:cc:dd:ee:ff";
		this.password = new TouchData_1.TouchData(byteUtil.getBytesByString(i)),
		this.localIp = a,
		this.logger = r || console
	}
	return t.prototype.start = function() {
		var t = this;
		return new Promise((function(s, e) {
			return tslib_1.__awaiter(t, void 0, void 0, (function() {
				var t, i;
				return tslib_1.__generator(this, (function(r) {
					switch (r.label) {
					case 0:
						if (this.mTask) {
							if (!this.isCancelled()) return [2, e({
								code: 3,
								msg: "已经有任务在进行中，请等待任务结束，或者中断任务"
							})];
							this.mTask = null
						}
						this.mTask = new SmartConfig_1.SmartConfig(this.ssid, this.bssid, this.password, this.localIp, this.logger),
						this.logger.info("广播方式"),
						this.mTask.on("onError", (function(t) {
							e(t)
						})),
						r.label = 1;
					case 1:
						return r.trys.push([1, 5, , 6]),
						"android" !== wx.getSystemInfoSync().platform ? [3, 2] : (this.mTask.on("result", (function(t) {
							s(t)
						})), this.mTask.startInNoPromise(), [3, 4]);
					case 2:
						return [4, this.mTask.start()];
					case 3:
						(t = r.sent()).length && s(t),
						r.label = 4;
					case 4:
						return [3, 6];
					case 5:
						return i = r.sent(),
						e(i),
						[3, 6];
					case 6:
						return [2]
					}
				}))
			}))
		}))
	},
	t.prototype.interrupt = function() {
		var t;
		null === (t = this.mTask) || void 0 === t || t.interrupt(),
		this.mTask = null
	},
	t.prototype.isCancelled = function() {
		return this.mTask.isCancelled()
	},
	t
} ();
exports.EsptouchTask = EsptouchTask;
//# sourceMappingURL=EsptouchTask.js.map
