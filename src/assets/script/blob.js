!function (t) { "use strict"; if (t.URL = t.URL || t.webkitURL, t.Blob && t.URL) try { return void new Blob } catch (t) { } var e = t.BlobBuilder || t.WebKitBlobBuilder || t.MozBlobBuilder || function (t) { var e = function (t) { return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1] }, n = function () { this.data = [] }, o = function (t, e, n) { this.data = t, this.size = t.length, this.type = e, this.encoding = n }, i = n.prototype, a = o.prototype, r = t.FileReaderSync, c = function (t) { this.code = this[this.name = t] }, s = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "), d = s.length, l = t.URL || t.webkitURL || t, u = l.createObjectURL, R = l.revokeObjectURL, f = l, h = t.btoa, p = t.atob, b = t.ArrayBuffer, g = t.Uint8Array; for (o.fake = a.fake = !0; d--;)c.prototype[s[d]] = d + 1; return l.createObjectURL || (f = t.URL = {}), f.createObjectURL = function (t) { var e, n = t.type; return null === n && (n = "application/octet-stream"), t instanceof o ? (e = "data:" + n, "base64" === t.encoding ? e + ";base64," + t.data : "URI" === t.encoding ? e + "," + decodeURIComponent(t.data) : h ? e + ";base64," + h(t.data) : e + "," + encodeURIComponent(t.data)) : u ? u.call(l, t) : void 0 }, f.revokeObjectURL = function (t) { "data:" !== t.substring(0, 5) && R && R.call(l, t) }, i.append = function (t) { var n = this.data; if (g && (t instanceof b || t instanceof g)) { for (var i = "", a = new g(t), s = 0, d = a.length; s < d; s++)i += String.fromCharCode(a[s]); n.push(i) } else if ("Blob" === e(t) || "File" === e(t)) { if (!r) throw new c("NOT_READABLE_ERR"); var l = new r; n.push(l.readAsBinaryString(t)) } else t instanceof o ? "base64" === t.encoding && p ? n.push(p(t.data)) : "URI" === t.encoding ? n.push(decodeURIComponent(t.data)) : "raw" === t.encoding && n.push(t.data) : ("string" != typeof t && (t += ""), n.push(unescape(encodeURIComponent(t)))) }, i.getBlob = function (t) { return arguments.length || (t = null), new o(this.data.join(""), t, "raw") }, i.toString = function () { return "[object BlobBuilder]" }, a.slice = function (t, e, n) { var i = arguments.length; return i < 3 && (n = null), new o(this.data.slice(t, i > 1 ? e : this.data.length), n, this.encoding) }, a.toString = function () { return "[object Blob]" }, a.close = function () { this.size = this.data.length = 0 }, n }(t); t.Blob = function (t, n) { var o = n ? n.type || "" : "", i = new e; if (t) for (var a = 0, r = t.length; a < r; a++)i.append(t[a]); return i.getBlob(o) } }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this);