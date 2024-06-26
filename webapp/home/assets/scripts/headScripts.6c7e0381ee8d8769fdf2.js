(() => {
    var e = {
        808: (e, t, i) => {
            var r, o;
            ! function (n) {
                if (void 0 === (o = "function" == typeof (r = n) ? r.call(t, i, t, e) : r) || (e.exports = o), !0, e.exports = n(), !!0) {
                    var a = window.Cookies,
                        s = window.Cookies = n();
                    s.noConflict = function () {
                        return window.Cookies = a, s
                    }
                }
            }((function () {
                function e() {
                    for (var e = 0, t = {}; e < arguments.length; e++) {
                        var i = arguments[e];
                        for (var r in i) t[r] = i[r]
                    }
                    return t
                }

                function t(e) {
                    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
                }
                return function i(r) {
                    function o() { }

                    function n(t, i, n) {
                        if ("undefined" != typeof document) {
                            "number" == typeof (n = e({
                                path: "/"
                            }, o.defaults, n)).expires && (n.expires = new Date(1 * new Date + 864e5 * n.expires)), n.expires = n.expires ? n.expires.toUTCString() : "";
                            try {
                                var a = JSON.stringify(i);
                                /^[\{\[]/.test(a) && (i = a)
                            } catch (e) { }
                            i = r.write ? r.write(i, t) : encodeURIComponent(String(i)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                            var s = "";
                            for (var c in n) n[c] && (s += "; " + c, !0 !== n[c] && (s += "=" + n[c].split(";")[0]));
                            return document.cookie = t + "=" + i + s
                        }
                    }

                    function a(e, i) {
                        if ("undefined" != typeof document) {
                            for (var o = {}, n = document.cookie ? document.cookie.split("; ") : [], a = 0; a < n.length; a++) {
                                var s = n[a].split("="),
                                    c = s.slice(1).join("=");
                                i || '"' !== c.charAt(0) || (c = c.slice(1, -1));
                                try {
                                    var u = t(s[0]);
                                    if (c = (r.read || r)(c, u) || t(c), i) try {
                                        c = JSON.parse(c)
                                    } catch (e) { }
                                    if (o[u] = c, e === u) break
                                } catch (e) { }
                            }
                            return e ? o[e] : o
                        }
                    }
                    return o.set = n, o.get = function (e) {
                        return a(e, !1)
                    }, o.getJSON = function (e) {
                        return a(e, !0)
                    }, o.remove = function (t, i) {
                        n(t, "", e(i, {
                            expires: -1
                        }))
                    }, o.defaults = {}, o.withConverter = i, o
                }((function () { }))
            }))
        },
        708: function (e) {
            e.exports = (() => {
                var e = {
                    20: e => {
                        "use strict";
                        var t = "%[a-f0-9]{2}",
                            i = new RegExp(t, "gi"),
                            r = new RegExp("(" + t + ")+", "gi");

                        function o(e, t) {
                            try {
                                return decodeURIComponent(e.join(""))
                            } catch (e) { }
                            if (1 === e.length) return e;
                            t = t || 1;
                            var i = e.slice(0, t),
                                r = e.slice(t);
                            return Array.prototype.concat.call([], o(i), o(r))
                        }

                        function n(e) {
                            try {
                                return decodeURIComponent(e)
                            } catch (n) {
                                for (var t = e.match(i), r = 1; r < t.length; r++) t = (e = o(t, r).join("")).match(i);
                                return e
                            }
                        }
                        e.exports = function (e) {
                            if ("string" != typeof e) throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof e + "`");
                            try {
                                return e = e.replace(/\+/g, " "), decodeURIComponent(e)
                            } catch (t) {
                                return function (e) {
                                    for (var t = {
                                        "%FE%FF": "��",
                                        "%FF%FE": "��"
                                    }, i = r.exec(e); i;) {
                                        try {
                                            t[i[0]] = decodeURIComponent(i[0])
                                        } catch (e) {
                                            var o = n(i[0]);
                                            o !== i[0] && (t[i[0]] = o)
                                        }
                                        i = r.exec(e)
                                    }
                                    t["%C2"] = "�";
                                    for (var a = Object.keys(t), s = 0; s < a.length; s++) {
                                        var c = a[s];
                                        e = e.replace(new RegExp(c, "g"), t[c])
                                    }
                                    return e
                                }(e)
                            }
                        }
                    },
                    806: e => {
                        "use strict";
                        e.exports = function (e, t) {
                            for (var i = {}, r = Object.keys(e), o = Array.isArray(t), n = 0; n < r.length; n++) {
                                var a = r[n],
                                    s = e[a];
                                (o ? -1 !== t.indexOf(a) : t(a, s, e)) && (i[a] = s)
                            }
                            return i
                        }
                    },
                    563: (e, t, i) => {
                        "use strict";
                        const r = i(610),
                            o = i(20),
                            n = i(500),
                            a = i(806),
                            s = Symbol("encodeFragmentIdentifier");

                        function c(e) {
                            if ("string" != typeof e || 1 !== e.length) throw new TypeError("arrayFormatSeparator must be single character string")
                        }

                        function u(e, t) {
                            return t.encode ? t.strict ? r(e) : encodeURIComponent(e) : e
                        }

                        function d(e, t) {
                            return t.decode ? o(e) : e
                        }

                        function l(e) {
                            return Array.isArray(e) ? e.sort() : "object" == typeof e ? l(Object.keys(e)).sort(((e, t) => Number(e) - Number(t))).map((t => e[t])) : e
                        }

                        function p(e) {
                            const t = e.indexOf("#");
                            return -1 !== t && (e = e.slice(0, t)), e
                        }

                        function b(e) {
                            const t = (e = p(e)).indexOf("?");
                            return -1 === t ? "" : e.slice(t + 1)
                        }

                        function w(e, t) {
                            return t.parseNumbers && !Number.isNaN(Number(e)) && "string" == typeof e && "" !== e.trim() ? e = Number(e) : !t.parseBooleans || null === e || "true" !== e.toLowerCase() && "false" !== e.toLowerCase() || (e = "true" === e.toLowerCase()), e
                        }

                        function f(e, t) {
                            c((t = Object.assign({
                                decode: !0,
                                sort: !0,
                                arrayFormat: "none",
                                arrayFormatSeparator: ",",
                                parseNumbers: !1,
                                parseBooleans: !1
                            }, t)).arrayFormatSeparator);
                            const i = function (e) {
                                let t;
                                switch (e.arrayFormat) {
                                    case "index":
                                        return (e, i, r) => {
                                            t = /\[(\d*)\]$/.exec(e), e = e.replace(/\[\d*\]$/, ""), t ? (void 0 === r[e] && (r[e] = {}), r[e][t[1]] = i) : r[e] = i
                                        };
                                    case "bracket":
                                        return (e, i, r) => {
                                            t = /(\[\])$/.exec(e), e = e.replace(/\[\]$/, ""), t ? void 0 !== r[e] ? r[e] = [].concat(r[e], i) : r[e] = [i] : r[e] = i
                                        };
                                    case "comma":
                                    case "separator":
                                        return (t, i, r) => {
                                            const o = "string" == typeof i && i.includes(e.arrayFormatSeparator),
                                                n = "string" == typeof i && !o && d(i, e).includes(e.arrayFormatSeparator);
                                            i = n ? d(i, e) : i;
                                            const a = o || n ? i.split(e.arrayFormatSeparator).map((t => d(t, e))) : null === i ? i : d(i, e);
                                            r[t] = a
                                        };
                                    case "bracket-separator":
                                        return (t, i, r) => {
                                            const o = /(\[\])$/.test(t);
                                            if (t = t.replace(/\[\]$/, ""), !o) return void (r[t] = i ? d(i, e) : i);
                                            const n = null === i ? [] : i.split(e.arrayFormatSeparator).map((t => d(t, e)));
                                            void 0 !== r[t] ? r[t] = [].concat(r[t], n) : r[t] = n
                                        };
                                    default:
                                        return (e, t, i) => {
                                            void 0 !== i[e] ? i[e] = [].concat(i[e], t) : i[e] = t
                                        }
                                }
                            }(t),
                                r = Object.create(null);
                            if ("string" != typeof e) return r;
                            if (!(e = e.trim().replace(/^[?#&]/, ""))) return r;
                            for (const o of e.split("&")) {
                                if ("" === o) continue;
                                let [e, a] = n(t.decode ? o.replace(/\+/g, " ") : o, "=");
                                a = void 0 === a ? null : ["comma", "separator", "bracket-separator"].includes(t.arrayFormat) ? a : d(a, t), i(d(e, t), a, r)
                            }
                            for (const e of Object.keys(r)) {
                                const i = r[e];
                                if ("object" == typeof i && null !== i)
                                    for (const e of Object.keys(i)) i[e] = w(i[e], t);
                                else r[e] = w(i, t)
                            }
                            return !1 === t.sort ? r : (!0 === t.sort ? Object.keys(r).sort() : Object.keys(r).sort(t.sort)).reduce(((e, t) => {
                                const i = r[t];
                                return Boolean(i) && "object" == typeof i && !Array.isArray(i) ? e[t] = l(i) : e[t] = i, e
                            }), Object.create(null))
                        }
                        t.extract = b, t.parse = f, t.stringify = (e, t) => {
                            if (!e) return "";
                            c((t = Object.assign({
                                encode: !0,
                                strict: !0,
                                arrayFormat: "none",
                                arrayFormatSeparator: ","
                            }, t)).arrayFormatSeparator);
                            const i = i => t.skipNull && null == e[i] || t.skipEmptyString && "" === e[i],
                                r = function (e) {
                                    switch (e.arrayFormat) {
                                        case "index":
                                            return t => (i, r) => {
                                                const o = i.length;
                                                return void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? i : null === r ? [...i, [u(t, e), "[", o, "]"].join("")] : [...i, [u(t, e), "[", u(o, e), "]=", u(r, e)].join("")]
                                            };
                                        case "bracket":
                                            return t => (i, r) => void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? i : null === r ? [...i, [u(t, e), "[]"].join("")] : [...i, [u(t, e), "[]=", u(r, e)].join("")];
                                        case "comma":
                                        case "separator":
                                        case "bracket-separator":
                                            {
                                                const t = "bracket-separator" === e.arrayFormat ? "[]=" : "=";
                                                return i => (r, o) => void 0 === o || e.skipNull && null === o || e.skipEmptyString && "" === o ? r : (o = null === o ? "" : o, 0 === r.length ? [
                                                    [u(i, e), t, u(o, e)].join("")
                                                ] : [
                                                    [r, u(o, e)].join(e.arrayFormatSeparator)
                                                ])
                                            }
                                        default:
                                            return t => (i, r) => void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? i : null === r ? [...i, u(t, e)] : [...i, [u(t, e), "=", u(r, e)].join("")]
                                    }
                                }(t),
                                o = {};
                            for (const t of Object.keys(e)) i(t) || (o[t] = e[t]);
                            const n = Object.keys(o);
                            return !1 !== t.sort && n.sort(t.sort), n.map((i => {
                                const o = e[i];
                                return void 0 === o ? "" : null === o ? u(i, t) : Array.isArray(o) ? 0 === o.length && "bracket-separator" === t.arrayFormat ? u(i, t) + "[]" : o.reduce(r(i), []).join("&") : u(i, t) + "=" + u(o, t)
                            })).filter((e => e.length > 0)).join("&")
                        }, t.parseUrl = (e, t) => {
                            t = Object.assign({
                                decode: !0
                            }, t);
                            const [i, r] = n(e, "#");
                            return Object.assign({
                                url: i.split("?")[0] || "",
                                query: f(b(e), t)
                            }, t && t.parseFragmentIdentifier && r ? {
                                fragmentIdentifier: d(r, t)
                            } : {})
                        }, t.stringifyUrl = (e, i) => {
                            i = Object.assign({
                                encode: !0,
                                strict: !0,
                                [s]: !0
                            }, i);
                            const r = p(e.url).split("?")[0] || "",
                                o = t.extract(e.url),
                                n = t.parse(o, {
                                    sort: !1
                                }),
                                a = Object.assign(n, e.query);
                            let c = t.stringify(a, i);
                            c && (c = `?${c}`);
                            let d = function (e) {
                                let t = "";
                                const i = e.indexOf("#");
                                return -1 !== i && (t = e.slice(i)), t
                            }(e.url);
                            return e.fragmentIdentifier && (d = `#${i[s] ? u(e.fragmentIdentifier, i) : e.fragmentIdentifier}`), `${r}${c}${d}`
                        }, t.pick = (e, i, r) => {
                            r = Object.assign({
                                parseFragmentIdentifier: !0,
                                [s]: !1
                            }, r);
                            const {
                                url: o,
                                query: n,
                                fragmentIdentifier: c
                            } = t.parseUrl(e, r);
                            return t.stringifyUrl({
                                url: o,
                                query: a(n, i),
                                fragmentIdentifier: c
                            }, r)
                        }, t.exclude = (e, i, r) => {
                            const o = Array.isArray(i) ? e => !i.includes(e) : (e, t) => !i(e, t);
                            return t.pick(e, o, r)
                        }
                    },
                    500: e => {
                        "use strict";
                        e.exports = (e, t) => {
                            if ("string" != typeof e || "string" != typeof t) throw new TypeError("Expected the arguments to be of type `string`");
                            if ("" === t) return [e];
                            const i = e.indexOf(t);
                            return -1 === i ? [e] : [e.slice(0, i), e.slice(i + t.length)]
                        }
                    },
                    610: e => {
                        "use strict";
                        e.exports = e => encodeURIComponent(e).replace(/[!'()*]/g, (e => `%${e.charCodeAt(0).toString(16).toUpperCase()}`))
                    },
                    238: function (e, t, i) {
                        var r;
                        ! function (o, n) {
                            "use strict";
                            var a = "function",
                                s = "undefined",
                                c = "object",
                                u = "string",
                                d = "model",
                                l = "name",
                                p = "type",
                                b = "vendor",
                                w = "version",
                                f = "architecture",
                                m = "console",
                                g = "mobile",
                                h = "tablet",
                                v = "smarttv",
                                y = "wearable",
                                _ = "embedded",
                                k = "Amazon",
                                x = "Apple",
                                C = "ASUS",
                                E = "BlackBerry",
                                O = "Google",
                                S = "Huawei",
                                j = "LG",
                                P = "Microsoft",
                                A = "Motorola",
                                I = "Samsung",
                                R = "Sony",
                                N = "Xiaomi",
                                T = "Zebra",
                                U = "Facebook",
                                q = function (e) {
                                    for (var t = {}, i = 0; i < e.length; i++) t[e[i].toUpperCase()] = e[i];
                                    return t
                                },
                                F = function (e, t) {
                                    return typeof e === u && -1 !== L(t).indexOf(L(e))
                                },
                                L = function (e) {
                                    return e.toLowerCase()
                                },
                                D = function (e, t) {
                                    if (typeof e === u) return e = e.replace(/^\s\s*/, "").replace(/\s\s*$/, ""), typeof t === s ? e : e.substring(0, 255)
                                },
                                V = function (e, t) {
                                    for (var i, r, o, s, u, d, l = 0; l < t.length && !u;) {
                                        var p = t[l],
                                            b = t[l + 1];
                                        for (i = r = 0; i < p.length && !u;)
                                            if (u = p[i++].exec(e))
                                                for (o = 0; o < b.length; o++) d = u[++r], typeof (s = b[o]) === c && s.length > 0 ? 2 === s.length ? typeof s[1] == a ? this[s[0]] = s[1].call(this, d) : this[s[0]] = s[1] : 3 === s.length ? typeof s[1] !== a || s[1].exec && s[1].test ? this[s[0]] = d ? d.replace(s[1], s[2]) : n : this[s[0]] = d ? s[1].call(this, d, s[2]) : n : 4 === s.length && (this[s[0]] = d ? s[3].call(this, d.replace(s[1], s[2])) : n) : this[s] = d || n;
                                        l += 2
                                    }
                                },
                                $ = function (e, t) {
                                    for (var i in t)
                                        if (typeof t[i] === c && t[i].length > 0) {
                                            for (var r = 0; r < t[i].length; r++)
                                                if (F(t[i][r], e)) return "?" === i ? n : i
                                        } else if (F(t[i], e)) return "?" === i ? n : i;
                                    return e
                                },
                                M = {
                                    ME: "4.90",
                                    "NT 3.11": "NT3.51",
                                    "NT 4.0": "NT4.0",
                                    2e3: "NT 5.0",
                                    XP: ["NT 5.1", "NT 5.2"],
                                    Vista: "NT 6.0",
                                    7: "NT 6.1",
                                    8: "NT 6.2",
                                    8.1: "NT 6.3",
                                    10: ["NT 6.4", "NT 10.0"],
                                    RT: "ARM"
                                },
                                B = {
                                    browser: [
                                        [/\b(?:crmo|crios)\/([\w\.]+)/i],
                                        [w, [l, "Chrome"]],
                                        [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                                        [w, [l, "Edge"]],
                                        [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],
                                        [l, w],
                                        [/opios[\/ ]+([\w\.]+)/i],
                                        [w, [l, "Opera Mini"]],
                                        [/\bopr\/([\w\.]+)/i],
                                        [w, [l, "Opera"]],
                                        [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i, /(weibo)__([\d\.]+)/i],
                                        [l, w],
                                        [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
                                        [w, [l, "UCBrowser"]],
                                        [/\bqbcore\/([\w\.]+)/i],
                                        [w, [l, "WeChat(Win) Desktop"]],
                                        [/micromessenger\/([\w\.]+)/i],
                                        [w, [l, "WeChat"]],
                                        [/konqueror\/([\w\.]+)/i],
                                        [w, [l, "Konqueror"]],
                                        [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
                                        [w, [l, "IE"]],
                                        [/yabrowser\/([\w\.]+)/i],
                                        [w, [l, "Yandex"]],
                                        [/(avast|avg)\/([\w\.]+)/i],
                                        [
                                            [l, /(.+)/, "$1 Secure Browser"], w
                                        ],
                                        [/\bfocus\/([\w\.]+)/i],
                                        [w, [l, "Firefox Focus"]],
                                        [/\bopt\/([\w\.]+)/i],
                                        [w, [l, "Opera Touch"]],
                                        [/coc_coc\w+\/([\w\.]+)/i],
                                        [w, [l, "Coc Coc"]],
                                        [/dolfin\/([\w\.]+)/i],
                                        [w, [l, "Dolphin"]],
                                        [/coast\/([\w\.]+)/i],
                                        [w, [l, "Opera Coast"]],
                                        [/miuibrowser\/([\w\.]+)/i],
                                        [w, [l, "MIUI Browser"]],
                                        [/fxios\/([-\w\.]+)/i],
                                        [w, [l, "Firefox"]],
                                        [/\bqihu|(qi?ho?o?|360)browser/i],
                                        [
                                            [l, "360 Browser"]
                                        ],
                                        [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
                                        [
                                            [l, /(.+)/, "$1 Browser"], w
                                        ],
                                        [/(comodo_dragon)\/([\w\.]+)/i],
                                        [
                                            [l, /_/g, " "], w
                                        ],
                                        [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],
                                        [l, w],
                                        [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i],
                                        [l],
                                        [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
                                        [
                                            [l, U], w
                                        ],
                                        [/safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i],
                                        [l, w],
                                        [/\bgsa\/([\w\.]+) .*safari\//i],
                                        [w, [l, "GSA"]],
                                        [/headlesschrome(?:\/([\w\.]+)| )/i],
                                        [w, [l, "Chrome Headless"]],
                                        [/ wv\).+(chrome)\/([\w\.]+)/i],
                                        [
                                            [l, "Chrome WebView"], w
                                        ],
                                        [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
                                        [w, [l, "Android Browser"]],
                                        [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
                                        [l, w],
                                        [/version\/([\w\.]+) .*mobile\/\w+ (safari)/i],
                                        [w, [l, "Mobile Safari"]],
                                        [/version\/([\w\.]+) .*(mobile ?safari|safari)/i],
                                        [w, l],
                                        [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
                                        [l, [w, $, {
                                            "1.0": "/8",
                                            1.2: "/1",
                                            1.3: "/3",
                                            "2.0": "/412",
                                            "2.0.2": "/416",
                                            "2.0.3": "/417",
                                            "2.0.4": "/419",
                                            "?": "/"
                                        }]],
                                        [/(webkit|khtml)\/([\w\.]+)/i],
                                        [l, w],
                                        [/(navigator|netscape\d?)\/([-\w\.]+)/i],
                                        [
                                            [l, "Netscape"], w
                                        ],
                                        [/mobile vr; rv:([\w\.]+)\).+firefox/i],
                                        [w, [l, "Firefox Reality"]],
                                        [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i],
                                        [l, w]
                                    ],
                                    cpu: [
                                        [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
                                        [
                                            [f, "amd64"]
                                        ],
                                        [/(ia32(?=;))/i],
                                        [
                                            [f, L]
                                        ],
                                        [/((?:i[346]|x)86)[;\)]/i],
                                        [
                                            [f, "ia32"]
                                        ],
                                        [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
                                        [
                                            [f, "arm64"]
                                        ],
                                        [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                                        [
                                            [f, "armhf"]
                                        ],
                                        [/windows (ce|mobile); ppc;/i],
                                        [
                                            [f, "arm"]
                                        ],
                                        [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
                                        [
                                            [f, /ower/, "", L]
                                        ],
                                        [/(sun4\w)[;\)]/i],
                                        [
                                            [f, "sparc"]
                                        ],
                                        [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],
                                        [
                                            [f, L]
                                        ]
                                    ],
                                    device: [
                                        [/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
                                        [d, [b, I],
                                            [p, h]
                                        ],
                                        [/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i],
                                        [d, [b, I],
                                            [p, g]
                                        ],
                                        [/\((ip(?:hone|od)[\w ]*);/i],
                                        [d, [b, x],
                                            [p, g]
                                        ],
                                        [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i],
                                        [d, [b, x],
                                            [p, h]
                                        ],
                                        [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
                                        [d, [b, S],
                                            [p, h]
                                        ],
                                        [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i],
                                        [d, [b, S],
                                            [p, g]
                                        ],
                                        [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],
                                        [
                                            [d, /_/g, " "],
                                            [b, N],
                                            [p, g]
                                        ],
                                        [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],
                                        [
                                            [d, /_/g, " "],
                                            [b, N],
                                            [p, h]
                                        ],
                                        [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],
                                        [d, [b, "OPPO"],
                                            [p, g]
                                        ],
                                        [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
                                        [d, [b, "Vivo"],
                                            [p, g]
                                        ],
                                        [/\b(rmx[12]\d{3})(?: bui|;|\))/i],
                                        [d, [b, "Realme"],
                                            [p, g]
                                        ],
                                        [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],
                                        [d, [b, A],
                                            [p, g]
                                        ],
                                        [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
                                        [d, [b, A],
                                            [p, h]
                                        ],
                                        [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
                                        [d, [b, j],
                                            [p, h]
                                        ],
                                        [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i],
                                        [d, [b, j],
                                            [p, g]
                                        ],
                                        [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],
                                        [d, [b, "Lenovo"],
                                            [p, h]
                                        ],
                                        [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
                                        [
                                            [d, /_/g, " "],
                                            [b, "Nokia"],
                                            [p, g]
                                        ],
                                        [/(pixel c)\b/i],
                                        [d, [b, O],
                                            [p, h]
                                        ],
                                        [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
                                        [d, [b, O],
                                            [p, g]
                                        ],
                                        [/droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],
                                        [d, [b, R],
                                            [p, g]
                                        ],
                                        [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
                                        [
                                            [d, "Xperia Tablet"],
                                            [b, R],
                                            [p, h]
                                        ],
                                        [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],
                                        [d, [b, "OnePlus"],
                                            [p, g]
                                        ],
                                        [/(alexa)webm/i, /(kf[a-z]{2}wi)( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i],
                                        [d, [b, k],
                                            [p, h]
                                        ],
                                        [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
                                        [
                                            [d, /(.+)/g, "Fire Phone $1"],
                                            [b, k],
                                            [p, g]
                                        ],
                                        [/(playbook);[-\w\),; ]+(rim)/i],
                                        [d, b, [p, h]],
                                        [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
                                        [d, [b, E],
                                            [p, g]
                                        ],
                                        [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],
                                        [d, [b, C],
                                            [p, h]
                                        ],
                                        [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
                                        [d, [b, C],
                                            [p, g]
                                        ],
                                        [/(nexus 9)/i],
                                        [d, [b, "HTC"],
                                            [p, h]
                                        ],
                                        [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i],
                                        [b, [d, /_/g, " "],
                                            [p, g]
                                        ],
                                        [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
                                        [d, [b, "Acer"],
                                            [p, h]
                                        ],
                                        [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
                                        [d, [b, "Meizu"],
                                            [p, g]
                                        ],
                                        [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
                                        [d, [b, "Sharp"],
                                            [p, g]
                                        ],
                                        [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i],
                                        [b, d, [p, g]],
                                        [/(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i],
                                        [b, d, [p, h]],
                                        [/(surface duo)/i],
                                        [d, [b, P],
                                            [p, h]
                                        ],
                                        [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
                                        [d, [b, "Fairphone"],
                                            [p, g]
                                        ],
                                        [/(u304aa)/i],
                                        [d, [b, "AT&T"],
                                            [p, g]
                                        ],
                                        [/\bsie-(\w*)/i],
                                        [d, [b, "Siemens"],
                                            [p, g]
                                        ],
                                        [/\b(rct\w+) b/i],
                                        [d, [b, "RCA"],
                                            [p, h]
                                        ],
                                        [/\b(venue[\d ]{2,7}) b/i],
                                        [d, [b, "Dell"],
                                            [p, h]
                                        ],
                                        [/\b(q(?:mv|ta)\w+) b/i],
                                        [d, [b, "Verizon"],
                                            [p, h]
                                        ],
                                        [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
                                        [d, [b, "Barnes & Noble"],
                                            [p, h]
                                        ],
                                        [/\b(tm\d{3}\w+) b/i],
                                        [d, [b, "NuVision"],
                                            [p, h]
                                        ],
                                        [/\b(k88) b/i],
                                        [d, [b, "ZTE"],
                                            [p, h]
                                        ],
                                        [/\b(nx\d{3}j) b/i],
                                        [d, [b, "ZTE"],
                                            [p, g]
                                        ],
                                        [/\b(gen\d{3}) b.+49h/i],
                                        [d, [b, "Swiss"],
                                            [p, g]
                                        ],
                                        [/\b(zur\d{3}) b/i],
                                        [d, [b, "Swiss"],
                                            [p, h]
                                        ],
                                        [/\b((zeki)?tb.*\b) b/i],
                                        [d, [b, "Zeki"],
                                            [p, h]
                                        ],
                                        [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
                                        [
                                            [b, "Dragon Touch"], d, [p, h]
                                        ],
                                        [/\b(ns-?\w{0,9}) b/i],
                                        [d, [b, "Insignia"],
                                            [p, h]
                                        ],
                                        [/\b((nxa|next)-?\w{0,9}) b/i],
                                        [d, [b, "NextBook"],
                                            [p, h]
                                        ],
                                        [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
                                        [
                                            [b, "Voice"], d, [p, g]
                                        ],
                                        [/\b(lvtel\-)?(v1[12]) b/i],
                                        [
                                            [b, "LvTel"], d, [p, g]
                                        ],
                                        [/\b(ph-1) /i],
                                        [d, [b, "Essential"],
                                            [p, g]
                                        ],
                                        [/\b(v(100md|700na|7011|917g).*\b) b/i],
                                        [d, [b, "Envizen"],
                                            [p, h]
                                        ],
                                        [/\b(trio[-\w\. ]+) b/i],
                                        [d, [b, "MachSpeed"],
                                            [p, h]
                                        ],
                                        [/\btu_(1491) b/i],
                                        [d, [b, "Rotor"],
                                            [p, h]
                                        ],
                                        [/(shield[\w ]+) b/i],
                                        [d, [b, "Nvidia"],
                                            [p, h]
                                        ],
                                        [/(sprint) (\w+)/i],
                                        [b, d, [p, g]],
                                        [/(kin\.[onetw]{3})/i],
                                        [
                                            [d, /\./g, " "],
                                            [b, P],
                                            [p, g]
                                        ],
                                        [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                                        [d, [b, T],
                                            [p, h]
                                        ],
                                        [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
                                        [d, [b, T],
                                            [p, g]
                                        ],
                                        [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
                                        [b, d, [p, m]],
                                        [/droid.+; (shield) bui/i],
                                        [d, [b, "Nvidia"],
                                            [p, m]
                                        ],
                                        [/(playstation [345portablevi]+)/i],
                                        [d, [b, R],
                                            [p, m]
                                        ],
                                        [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
                                        [d, [b, P],
                                            [p, m]
                                        ],
                                        [/smart-tv.+(samsung)/i],
                                        [b, [p, v]],
                                        [/hbbtv.+maple;(\d+)/i],
                                        [
                                            [d, /^/, "SmartTV"],
                                            [b, I],
                                            [p, v]
                                        ],
                                        [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
                                        [
                                            [b, j],
                                            [p, v]
                                        ],
                                        [/(apple) ?tv/i],
                                        [b, [d, "Apple TV"],
                                            [p, v]
                                        ],
                                        [/crkey/i],
                                        [
                                            [d, "Chromecast"],
                                            [b, O],
                                            [p, v]
                                        ],
                                        [/droid.+aft(\w)( bui|\))/i],
                                        [d, [b, k],
                                            [p, v]
                                        ],
                                        [/\(dtv[\);].+(aquos)/i],
                                        [d, [b, "Sharp"],
                                            [p, v]
                                        ],
                                        [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i],
                                        [
                                            [b, D],
                                            [d, D],
                                            [p, v]
                                        ],
                                        [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
                                        [
                                            [p, v]
                                        ],
                                        [/((pebble))app/i],
                                        [b, d, [p, y]],
                                        [/droid.+; (glass) \d/i],
                                        [d, [b, O],
                                            [p, y]
                                        ],
                                        [/droid.+; (wt63?0{2,3})\)/i],
                                        [d, [b, T],
                                            [p, y]
                                        ],
                                        [/(quest( 2)?)/i],
                                        [d, [b, U],
                                            [p, y]
                                        ],
                                        [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
                                        [b, [p, _]],
                                        [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],
                                        [d, [p, g]],
                                        [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
                                        [d, [p, h]],
                                        [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
                                        [
                                            [p, h]
                                        ],
                                        [/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i],
                                        [
                                            [p, g]
                                        ],
                                        [/(android[-\w\. ]{0,9});.+buil/i],
                                        [d, [b, "Generic"]]
                                    ],
                                    engine: [
                                        [/windows.+ edge\/([\w\.]+)/i],
                                        [w, [l, "EdgeHTML"]],
                                        [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                                        [w, [l, "Blink"]],
                                        [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i],
                                        [l, w],
                                        [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                                        [w, l]
                                    ],
                                    os: [
                                        [/microsoft (windows) (vista|xp)/i],
                                        [l, w],
                                        [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],
                                        [l, [w, $, M]],
                                        [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
                                        [
                                            [l, "Windows"],
                                            [w, $, M]
                                        ],
                                        [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /cfnetwork\/.+darwin/i],
                                        [
                                            [w, /_/g, "."],
                                            [l, "iOS"]
                                        ],
                                        [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
                                        [
                                            [l, "Mac OS"],
                                            [w, /_/g, "."]
                                        ],
                                        [/droid ([\w\.]+)\b.+(android[- ]x86)/i],
                                        [w, l],
                                        [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i],
                                        [l, w],
                                        [/\(bb(10);/i],
                                        [w, [l, E]],
                                        [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
                                        [w, [l, "Symbian"]],
                                        [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],
                                        [w, [l, "Firefox OS"]],
                                        [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                                        [w, [l, "webOS"]],
                                        [/crkey\/([\d\.]+)/i],
                                        [w, [l, "Chromecast"]],
                                        [/(cros) [\w]+ ([\w\.]+\w)/i],
                                        [
                                            [l, "Chromium OS"], w
                                        ],
                                        [/(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i],
                                        [l, w],
                                        [/(sunos) ?([\w\.\d]*)/i],
                                        [
                                            [l, "Solaris"], w
                                        ],
                                        [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i, /(unix) ?([\w\.]*)/i],
                                        [l, w]
                                    ]
                                },
                                z = function (e, t) {
                                    if (typeof e === c && (t = e, e = n), !(this instanceof z)) return new z(e, t).getResult();
                                    var i = e || (typeof o !== s && o.navigator && o.navigator.userAgent ? o.navigator.userAgent : ""),
                                        r = t ? function (e, t) {
                                            var i = {};
                                            for (var r in e) t[r] && t[r].length % 2 == 0 ? i[r] = t[r].concat(e[r]) : i[r] = e[r];
                                            return i
                                        }(B, t) : B;
                                    return this.getBrowser = function () {
                                        var e, t = {};
                                        return t.name = n, t.version = n, V.call(t, i, r.browser), t.major = typeof (e = t.version) === u ? e.replace(/[^\d\.]/g, "").split(".")[0] : n, t
                                    }, this.getCPU = function () {
                                        var e = {};
                                        return e.architecture = n, V.call(e, i, r.cpu), e
                                    }, this.getDevice = function () {
                                        var e = {};
                                        return e.vendor = n, e.model = n, e.type = n, V.call(e, i, r.device), e
                                    }, this.getEngine = function () {
                                        var e = {};
                                        return e.name = n, e.version = n, V.call(e, i, r.engine), e
                                    }, this.getOS = function () {
                                        var e = {};
                                        return e.name = n, e.version = n, V.call(e, i, r.os), e
                                    }, this.getResult = function () {
                                        return {
                                            ua: this.getUA(),
                                            browser: this.getBrowser(),
                                            engine: this.getEngine(),
                                            os: this.getOS(),
                                            device: this.getDevice(),
                                            cpu: this.getCPU()
                                        }
                                    }, this.getUA = function () {
                                        return i
                                    }, this.setUA = function (e) {
                                        return i = typeof e === u && e.length > 255 ? D(e, 255) : e, this
                                    }, this.setUA(i), this
                                };
                            z.VERSION = "1.0.2", z.BROWSER = q([l, w, "major"]), z.CPU = q([f]), z.DEVICE = q([d, b, p, m, g, v, h, y, _]), z.ENGINE = z.OS = q([l, w]), typeof t !== s ? (e.exports && (t = e.exports = z), t.UAParser = z) : i.amdO ? (r = function () {
                                return z
                            }.call(t, i, t, e)) === n || (e.exports = r) : typeof o !== s && (o.UAParser = z);
                            var H = typeof o !== s && (o.jQuery || o.Zepto);
                            if (H && !H.ua) {
                                var G = new z;
                                H.ua = G.getResult(), H.ua.get = function () {
                                    return G.getUA()
                                }, H.ua.set = function (e) {
                                    G.setUA(e);
                                    var t = G.getResult();
                                    for (var i in t) H.ua[i] = t[i]
                                }
                            }
                        }("object" == typeof window ? window : this)
                    },
                    877: (e, t, i) => {
                        var r = i(570),
                            o = i(171),
                            n = o;
                        n.v1 = r, n.v4 = o, e.exports = n
                    },
                    327: e => {
                        for (var t = [], i = 0; i < 256; ++i) t[i] = (i + 256).toString(16).substr(1);
                        e.exports = function (e, i) {
                            var r = i || 0,
                                o = t;
                            return [o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], "-", o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]], o[e[r++]]].join("")
                        }
                    },
                    217: e => {
                        var t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
                        if (t) {
                            var i = new Uint8Array(16);
                            e.exports = function () {
                                return t(i), i
                            }
                        } else {
                            var r = new Array(16);
                            e.exports = function () {
                                for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), r[t] = e >>> ((3 & t) << 3) & 255;
                                return r
                            }
                        }
                    },
                    570: (e, t, i) => {
                        var r, o, n = i(217),
                            a = i(327),
                            s = 0,
                            c = 0;
                        e.exports = function (e, t, i) {
                            var u = t && i || 0,
                                d = t || [],
                                l = (e = e || {}).node || r,
                                p = void 0 !== e.clockseq ? e.clockseq : o;
                            if (null == l || null == p) {
                                var b = n();
                                null == l && (l = r = [1 | b[0], b[1], b[2], b[3], b[4], b[5]]), null == p && (p = o = 16383 & (b[6] << 8 | b[7]))
                            }
                            var w = void 0 !== e.msecs ? e.msecs : (new Date).getTime(),
                                f = void 0 !== e.nsecs ? e.nsecs : c + 1,
                                m = w - s + (f - c) / 1e4;
                            if (m < 0 && void 0 === e.clockseq && (p = p + 1 & 16383), (m < 0 || w > s) && void 0 === e.nsecs && (f = 0), f >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                            s = w, c = f, o = p;
                            var g = (1e4 * (268435455 & (w += 122192928e5)) + f) % 4294967296;
                            d[u++] = g >>> 24 & 255, d[u++] = g >>> 16 & 255, d[u++] = g >>> 8 & 255, d[u++] = 255 & g;
                            var h = w / 4294967296 * 1e4 & 268435455;
                            d[u++] = h >>> 8 & 255, d[u++] = 255 & h, d[u++] = h >>> 24 & 15 | 16, d[u++] = h >>> 16 & 255, d[u++] = p >>> 8 | 128, d[u++] = 255 & p;
                            for (var v = 0; v < 6; ++v) d[u + v] = l[v];
                            return t || a(d)
                        }
                    },
                    171: (e, t, i) => {
                        var r = i(217),
                            o = i(327);
                        e.exports = function (e, t, i) {
                            var n = t && i || 0;
                            "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
                            var a = (e = e || {}).random || (e.rng || r)();
                            if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, t)
                                for (var s = 0; s < 16; ++s) t[n + s] = a[s];
                            return t || o(a)
                        }
                    }
                },
                    t = {};

                function i(r) {
                    var o = t[r];
                    if (void 0 !== o) return o.exports;
                    var n = t[r] = {
                        exports: {}
                    };
                    return e[r].call(n.exports, n, n.exports, i), n.exports
                }
                i.amdO = {}, i.n = e => {
                    var t = e && e.__esModule ? () => e.default : () => e;
                    return i.d(t, {
                        a: t
                    }), t
                }, i.d = (e, t) => {
                    for (var r in t) i.o(t, r) && !i.o(e, r) && Object.defineProperty(e, r, {
                        enumerable: !0,
                        get: t[r]
                    })
                }, i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), i.r = e => {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
                };
                var r = {};
                return (() => {
                    "use strict";
                    i.r(r), i.d(r, {
                        Analytics: () => _,
                        default: () => k,
                        events: () => e
                    });
                    var e = {};

                    function t(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var i = arguments[t];
                            for (var r in i) e[r] = i[r]
                        }
                        return e
                    }
                    i.r(e), i.d(e, {
                        ATTRIBUTION_SOURCE_SELECTED: () => w,
                        BUTTON_CLICKED: () => b,
                        ELEMENT_IN_VIEW: () => f,
                        PAGE_SCROLLED: () => m,
                        PAGE_VISITED: () => p,
                        PURCHASE_EVENT: () => g,
                        VIDEO_PLAYBACK_PAUSED: () => l,
                        VIDEO_PLAYBACK_STARTED: () => d
                    });
                    var o = function e(i, r) {
                        function o(e, o, n) {
                            if ("undefined" != typeof document) {
                                "number" == typeof (n = t({}, r, n)).expires && (n.expires = new Date(Date.now() + 864e5 * n.expires)), n.expires && (n.expires = n.expires.toUTCString()), e = encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
                                var a = "";
                                for (var s in n) n[s] && (a += "; " + s, !0 !== n[s] && (a += "=" + n[s].split(";")[0]));
                                return document.cookie = e + "=" + i.write(o, e) + a
                            }
                        }
                        return Object.create({
                            set: o,
                            get: function (e) {
                                if ("undefined" != typeof document && (!arguments.length || e)) {
                                    for (var t = document.cookie ? document.cookie.split("; ") : [], r = {}, o = 0; o < t.length; o++) {
                                        var n = t[o].split("="),
                                            a = n.slice(1).join("=");
                                        try {
                                            var s = decodeURIComponent(n[0]);
                                            if (r[s] = i.read(a, s), e === s) break
                                        } catch (e) { }
                                    }
                                    return e ? r[e] : r
                                }
                            },
                            remove: function (e, i) {
                                o(e, "", t({}, i, {
                                    expires: -1
                                }))
                            },
                            withAttributes: function (i) {
                                return e(this.converter, t({}, this.attributes, i))
                            },
                            withConverter: function (i) {
                                return e(t({}, this.converter, i), this.attributes)
                            }
                        }, {
                            attributes: {
                                value: Object.freeze(r)
                            },
                            converter: {
                                value: Object.freeze(i)
                            }
                        })
                    }({
                        read: function (e) {
                            return '"' === e[0] && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
                        },
                        write: function (e) {
                            return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
                        }
                    }, {
                        path: "/"
                    });
                    const n = o;
                    var a = i(877),
                        s = i(563),
                        c = i(238),
                        u = i.n(c);
                    const d = "web_video_playback_started",
                        l = "web_video_playback_paused",
                        p = "web_page_visited",
                        b = "web_button_clicked",
                        w = "attribution_selected",
                        f = "web_element_in_view",
                        m = "web_page_scrolled",
                        g = "web_purchase_event",
                        h = {
                            202: "Accepted",
                            502: "Bad Gateway",
                            400: "Bad Request",
                            409: "Conflict",
                            100: "Continue",
                            201: "Created",
                            417: "Expectation Failed",
                            424: "Failed Dependency",
                            403: "Forbidden",
                            504: "Gateway Timeout",
                            410: "Gone",
                            505: "HTTP Version Not Supported",
                            418: "I'm a teapot",
                            419: "Insufficient Space on Resource",
                            507: "Insufficient Storage",
                            500: "Server Error",
                            411: "Length Required",
                            423: "Locked",
                            420: "Method Failure",
                            405: "Method Not Allowed",
                            301: "Moved Permanently",
                            302: "Moved Temporarily",
                            207: "Multi-Status",
                            300: "Multiple Choices",
                            511: "Network Authentication Required",
                            204: "No Content",
                            203: "Non Authoritative Information",
                            406: "Not Acceptable",
                            404: "Not Found",
                            501: "Not Implemented",
                            304: "Not Modified",
                            200: "OK",
                            206: "Partial Content",
                            402: "Payment Required",
                            308: "Permanent Redirect",
                            412: "Precondition Failed",
                            428: "Precondition Required",
                            102: "Processing",
                            407: "Proxy Authentication Required",
                            431: "Request Header Fields Too Large",
                            408: "Request Timeout",
                            413: "Request Entity Too Large",
                            414: "Request-URI Too Long",
                            416: "Requested Range Not Satisfiable",
                            205: "Reset Content",
                            303: "See Other",
                            503: "Service Unavailable",
                            101: "Switching Protocols",
                            307: "Temporary Redirect",
                            429: "Too Many Requests",
                            401: "Unauthorized",
                            422: "Unprocessable Entity",
                            415: "Unsupported Media Type",
                            305: "Use Proxy"
                        },
                        v = {
                            baseUrl: "https://stagingapi.yousician.com",
                            cookies: {
                                visitID: {
                                    options: {
                                        domain: ".yousician.com",
                                        secure: !1,
                                        path: "/",
                                        sameSite: "lax",
                                        expires: 30
                                    },
                                    name: "ys_visit"
                                },
                                visitorID: {
                                    options: {
                                        domain: ".yousician.com",
                                        secure: !1,
                                        path: "/",
                                        sameSite: "lax",
                                        expires: 1051200
                                    },
                                    name: "ys_visitor"
                                }
                            }
                        };
                    class y {
                        constructor(e) {
                            if (this.trackReferenceSource = e => {
                                if (!this.profileId) throw new Error("profile id not found.\nRun setProfileId() before tracking the event");
                                if (!(null == e ? void 0 : e.attributionSource)) throw new Error("attributionSource must be defined");
                                if (!this._hasCookieConsent) return;
                                const {
                                    attributionSource: t,
                                    instrument: i
                                } = e, r = Object.assign({
                                    attribution_source: t,
                                    device_id: (0, a.v4)(),
                                    profile_id: this.profileId
                                }, {
                                    instrument: i
                                });
                                this._queueEvent({
                                    name: w,
                                    body: r
                                })
                            }, !e) throw new Error("[Analytics config] config object is required");
                            const t = {
                                channel: e.channel,
                                xApplicationName: e.xApplicationName
                            };
                            if (Object.values(t).some((e => void 0 === e))) {
                                const e = [];
                                for (const [i, r] of Object.entries(t)) void 0 === r && e.push(i);
                                throw new Error(`[Analytics config] mandatory argument${e.length > 1 ? "s" : ""} undefined: ${e.join(", ")}`)
                            }
                            e.baseUrl, y.initialized, this.config = Object.assign(Object.assign({}, v), e), this.eventsQueue = [], this.UAParser = new (u()), this.profileId = e.profileId, this.isLandingPage = e.isLandingPage, this.landingPageCategory = e.landingPageCategory, this._hasCookieConsent() && !this._getVisitorId() && this._setVisitorCookie(), y.initialized = !0
                        }
                        // _callApi(e, t) {
                        //     const i = new XMLHttpRequest;
                        //     i.open("POST", e, !1), i.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), i.setRequestHeader("X-Application-Name", this.config.xApplicationName), i.send(JSON.stringify(t))
                        // }
                        _hasCookieConsent(e = "C0001") {
                            if ("C0001" === e) return !0;
                            if (!window.OnetrustActiveGroups) throw new Error('The event requires cookie consent. \n"OnetrustActiveGroups" must be available in the window object');
                            return window.OnetrustActiveGroups.includes(e)
                        }
                        _setVisitCookie() {
                            this._setCookie(this.config.cookies.visitID, (0, a.v4)())
                        }
                        _setVisitorCookie() {
                            this._setCookie(this.config.cookies.visitorID, (0, a.v4)())
                        }
                        _getCookie(e) {
                            return n.get(e)
                        }
                        _setCookie(e, t) {
                            let i = e.options;
                            if (e.options.expires) {
                                const t = new Date;
                                i = Object.assign(Object.assign({}, i), {
                                    expires: new Date(t.setTime(t.getTime() + 60 * Number(e.options.expires) * 1e3))
                                })
                            }
                            return n.set(e.name, t, i)
                        }
                        _getVisitId() {
                            return this._getCookie(this.config.cookies.visitID.name)
                        }
                        _getVisitorId() {
                            return this._getCookie(this.config.cookies.visitorID.name)
                        }
                        _getReferrer() {
                            return this.referrer || document.referrer || void 0
                        }
                        _strSlugify(e) {
                            return e.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
                        }
                        _defaultParams() {
                            const e = s.parse(location.search),
                                {
                                    utm_source: t,
                                    utm_campaign: i,
                                    utm_content: r,
                                    utm_medium: o,
                                    utm_term: n
                                } = e,
                                a = this.UAParser.getResult(),
                                c = this.profileId,
                                u = window.Leanplum ? window.Leanplum.getVariants().map((e => e.id)).join(",") : void 0,
                                d = this._getReferrer();
                            return this._getVisitId() || this._setVisitCookie(), this._getVisitorId() || this._setVisitorCookie(), Object.assign({
                                path: window.location.pathname,
                                visit_token: this._getVisitId(),
                                visitor_token: this._getVisitorId(),
                                channel: this.config.channel,
                                visitor_browser: `${a.browser.name} ${a.browser.version}`,
                                visitor_os: `${a.os.name} ${a.os.version}`,
                                visitor_device_type: a.device.type || "desktop",
                                platform: a.os.name,
                                user_agent: window.navigator.userAgent,
                                url: window.location.href
                            }, {
                                utm_campaign: i,
                                utm_content: r,
                                utm_medium: o,
                                utm_source: t,
                                utm_term: n,
                                referring_url: d,
                                profile_id: c,
                                variants: u,
                                visitor_city: "",
                                visitor_region: "",
                                visitor_country: ""
                            })
                        }
                        _prepareHttpParams(e) {
                            return {
                                data: Object.assign(Object.assign({}, this._defaultParams()), e)
                            }
                        }
                        // _queueEvent(e) {
                        //     this.eventsQueue.push(e), this._sendQueuedEvents()
                        // }
                        // _sendQueuedEvents() {
                        //     if (!this.sendingEvents && this.eventsQueue.length && this._hasCookieConsent()) {
                        //         for (this.sendingEvents = !0; this.eventsQueue.length > 0;) {
                        //             const e = this.eventsQueue.shift();
                        //             this._callApi(`${this.config.baseUrl}/web_events/new/${e.name}`, this._prepareHttpParams(e.body))
                        //         }
                        //         this.sendingEvents = !1
                        //     }
                        // }
                        trackPageVisit(e, t = 200) {
                            if (!e) throw new Error("pathName must be specified");
                            const i = this.redirectedFrom,
                                r = this.isLandingPage,
                                o = this.landingPageCategory,
                                n = {
                                    initial_referral: window.document.referrer,
                                    initial_referral_domain: self.origin
                                },
                                a = "2" === t.toString().charAt(0),
                                s = {
                                    success: a,
                                    error_message: a ? "" : h[t]
                                },
                                c = Object.assign(Object.assign(Object.assign({
                                    title: document.title,
                                    page: this._strSlugify(e.replace(/\//g, "-")),
                                    path: e
                                }, s), n), {
                                    redirected_from: i,
                                    is_landing_page: r,
                                    landing_page_category: o
                                });
                            this.redirectedFrom = void 0, this._queueEvent({
                                name: p,
                                body: c
                            })
                        }
                        trackPageScroll() {
                            const e = this.isLandingPage,
                                t = this.landingPageCategory,
                                i = Object.assign({
                                    scrolled: 0
                                }, {
                                    is_landing_page: e,
                                    landing_page_category: t
                                });
                            let r = {
                                reached25Percent: !1,
                                reached50Percent: !1,
                                reached75Percent: !1,
                                reached100Percent: !1
                            };
                            const o = e => {
                                const t = e => {
                                    r = {
                                        reached25Percent: 25 === e,
                                        reached50Percent: 50 === e,
                                        reached75Percent: 75 === e,
                                        reached100Percent: 100 === e
                                    }, 0 !== e && (i.scrolled = e)
                                };
                                switch (!0) {
                                    case e < 25:
                                        t(0);
                                        break;
                                    case e >= 25 && e < 50 && !r.reached25Percent:
                                        t(25);
                                        break;
                                    case e >= 50 && e < 75 && !r.reached50Percent:
                                        t(50);
                                        break;
                                    case e >= 75 && e < 100 && !r.reached75Percent:
                                        t(75), i.scrolled = 75;
                                        break;
                                    case e >= 100 && !r.reached100Percent:
                                        t(100), i.scrolled = 100
                                }
                            };
                            document.addEventListener("scroll", (() => {
                                const e = (() => {
                                    const e = window.scrollY / (document.body.offsetHeight - window.innerHeight);
                                    return Math.round(100 * e)
                                })();
                                o(e)
                            }))
                        }
                        trackPurchaseEvent(e) {
                            this._queueEvent({
                                name: g,
                                body: e
                            })
                        }
                        trackClick(e) {
                            if (!this._hasCookieConsent()) return;
                            (null == e ? void 0 : e.name) && (e.name = e.name.toLowerCase()), (null == e ? void 0 : e.context) && (e.context = e.context.toLowerCase());
                            const t = this.isLandingPage,
                                i = this.landingPageCategory;
                            e = Object.assign(Object.assign({}, e), {
                                is_landing_page: t,
                                landing_page_category: i
                            })
                        }
                        trackElementInView(e) {
                            if (!this._hasCookieConsent()) return;
                            const t = this.isLandingPage,
                                i = this.landingPageCategory,
                                r = document.querySelector(`#${e.id}`);
                            new IntersectionObserver((r => {
                                r.forEach((r => {
                                    r.isIntersecting && (e = Object.assign(Object.assign({}, e), {
                                        is_landing_page: t,
                                        landing_page_category: i
                                    }))
                                }))
                            }), {
                                root: null,
                                threshold: 1
                            }).observe(r)
                        }
                        trackVideoEvent(e) {
                            const t = [d, l];
                            if (!e) throw new Error("parameters must be specified");
                            const {
                                attributes: i,
                                eventType: r,
                                videoId: o,
                                videoTitle: n,
                                sessionId: s,
                                trackWordPressSection: c,
                                domElement: u
                            } = e;
                            if (!Object.values(t).includes(r)) throw new Error(`Unsupported event type. Allowed events:\n${t.join(",\n")}`);
                            if (!i) throw new Error("Attributes must be specified.");
                            if (["src", "currentTime", "totalDuration", "autoPlay", "muted"].forEach((e => {
                                if (void 0 === i[e]) throw new Error(`Needed video attribute ${e} is not defined. Please include it in "attributes".`)
                            })), !this._hasCookieConsent()) return;
                            if (c && !u) throw new Error("DOM video element must be specified to track the ACF section.");
                            const p = o || i.src;
                            this.trackedVideos || (this.trackedVideos = {});
                            let b = this.trackedVideos[p];
                            if (!b) {
                                const e = c && u.closest("[class*='section-']") && u.closest("[class*='section-']").className.match(/section-[^\s]*/i)[0] || void 0,
                                    t = n;
                                b = Object.assign({
                                    web_video_content_src: i.src,
                                    web_video_content_id: p,
                                    web_video_content_total_duration: i.totalDuration,
                                    web_video_playback_autoplay: i.autoPlay,
                                    web_video_playback_muted: i.muted,
                                    web_video_playback_session_id: s || (0, a.v4)(),
                                    web_video_playback_position: i.currentTime
                                }, {
                                    web_video_player_position: e,
                                    web_video_content_title: t
                                }), this.trackedVideos[p] = b
                            }
                            b.web_video_playback_position = i.currentTime, this._queueEvent({
                                name: r,
                                body: b
                            })
                        }
                        setReferrer(e) {
                            this.referrer = e
                        }
                        setRedirectedFrom(e) {
                            this.redirectedFrom = e
                        }
                        setProfileId(e) {
                            this.profileId = e
                        }
                        setIsLandingPage(e) {
                            this.isLandingPage = e
                        }
                        setLandingPageCategory(e) {
                            this.landingPageCategory = e
                        }
                    }
                    y.initialized = !1;
                    const _ = y,
                        k = y
                })(), r
            })()
        }
    },
        t = {};

    function i(r) {
        var o = t[r];
        if (void 0 !== o) return o.exports;
        var n = t[r] = {
            exports: {}
        };
        return e[r].call(n.exports, n, n.exports, i), n.exports
    }
    i.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return i.d(t, {
            a: t
        }), t
    }, i.d = (e, t) => {
        for (var r in t) i.o(t, r) && !i.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        "use strict";
        var e = i(708),
            t = i.n(e),
            r = i(808),
            o = i.n(r);
        const n = ["web_paid_lp_yousician", "web_paid_lp_yousician_us"],
            a = [{
                path: "/lp/yousician",
                feature_id: "web_paid_lp_yousician"
            }, {
                path: "/lp/yousician-us",
                feature_id: "web_paid_lp_yousician_us"
            }];

        function s(e) {
            return "ys_exp_".concat(e)
        }

        function c(e) {
            const t = new URL(window.location);
            let i = !1;
            if (e.forEach((e => {
                (function (e) {
                    const t = s(e);
                    return "true" === o().get(t)
                })(e) && (i = !0, null === t.searchParams.get(e) && t.searchParams.append(e, !0), t.searchParams.set(e, !0))
            })), i) {
                var r;
                return null !== (r = t.protocol + "//" + t.host + t.pathname + "?" + t.searchParams + t.hash) && void 0 !== r ? r : ""
            }
            return null
        }

        function u(e) {
            const t = e.toLocaleLowerCase();
            return e.indexOf("http") >= 0 ? window.location.href.toLocaleLowerCase() == t : window.location.pathname.toLocaleLowerCase() == t
        }

        function d(e, t) {
            if (void 0 === e) return null;
            const i = e[t];
            return null != i && 1 == i.active && 1 == i.active && i.payload && i.payload.value ? i.payload.value : null
        }

        function l(e) {
            if (!e || u(e) || window.location.search.toLocaleLowerCase().indexOf("preview_id") >= 0) return;
            const t = e.indexOf("http") >= 0 ? e : `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}` + e;
            window.location.replace(t)
        }
        async function p(e = "web") {
            if (!o().get("ys_visitor")) return;
            const t = function (e) {
                const t = JSON.parse(localStorage.getItem(e));
                return t ? t._expires && (new Date).valueOf() >= t._expires ? null : t : null
            }("ys_features");
            if (null != t) return t;
            try {
                const t = o().get("ys_visitor");
                let u = n.reduce(((e, t) => e + "&features=" + t), "");
                const d = `${window.apiUrl}/features/web?visitor_id=${t}${u}&project=${e}`,
                    l = await fetch(d, {
                        method: "GET",
                        headers: {
                            "X-Application-Name": "YousicianMainSite"
                        }
                    }),
                    p = await l.json();
                return i = "ys_features", r = p.features, a = 1, s = r, (c = new Date).setDate(c.getDate() + a), c = c.valueOf(), s._expires = c, localStorage.setItem(i, JSON.stringify(s)), p.features
            } catch (e) {
                return null
            }
            var i, r, a, s, c
        }

        function b(e) {
            a.forEach((t => {
                if (u(t.path)) {
                    const i = d(e, t.feature_id);
                    i && l(i)
                }
            }));
            const t = [];
            n.forEach((i => {
                const r = d(e, i);
                if (r && r.startsWith("?")) {
                    const e = r.replaceAll("?", "");
                    t.push(e),
                        function (e) {
                            const t = s(e);
                            o().set(t, !0, {
                                expires: 30,
                                path: "/"
                            })
                        }(e)
                }
            }));
            const i = c(t);
            null !== i && l(i)
        }

        function w() {
            var e = .01 * window.innerHeight;
            document.documentElement.style.setProperty("--vh", e + "px")
        }
        let f = window.matchMedia("(orientation: portrait)");
        f.addEventListener ? f.addEventListener("change", (() => {
            w()
        })) : f.addListener((() => {
            w()
        })), w(), window.apiUrl = "https://api.yousician.com", window.ysAnalytics = new (t())({
            channel: "yousician-landing",
            xApplicationName: "YousicianMainSite",
            baseUrl: window.apiUrl,
            isLandingPage: "true" === window.isLandingPage,
            landingPageCategory: window.landingPageCategory
        }), p().then((e => {
            b(e)
        }))
    })()
})();
//# sourceMappingURL=headScripts.6c7e0381ee8d8769fdf2.js.map