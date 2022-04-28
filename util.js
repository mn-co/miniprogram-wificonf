"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
})

exports.delay = function delay(r){
	return new Promise((function(t) {
		return setTimeout(t, r)
	}))
};

exports.genPromise = function genPromise() {
	var r, t;
	return {
		promise: new Promise((function(e, o) {
			r = e,
			t = o
		})),
		resolve: r,
		reject: t
	}
}

exports.parseInetAddr = function parseInetAddr(r, e, t) {
	for (var n = "",
	o = 0; o < t; o++) n += String(255 & r[e + o]),
	o !== t - 1 && (n += ".");
	return n
}

exports.formatInetAddr = function formatInetAddr(r) {
	void 0 === r && (r = "");
	for (var e = r.split("."), t = new Int8Array(e.length), n = 0; n < e.length; n++) {
		var o = parseInt(e[n]);
		t[n] = o > 127 ? o - 256 : o
	}
	return t
}

exports.noop = function(){};

exports.compareVersion = function compareVersion(vs1, vs2){
    var v1 = vs1.split('.')
    var v2 = vs2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0;
}