(() => {
    var e = {
        755: function (e, t) {
            var n;
            ! function (t, n) {
                "use strict";
                "object" == typeof e.exports ? e.exports = t.document ? n(t, !0) : function (e) {
                    if (!e.document) throw new Error("jQuery requires a window with a document");
                    return n(e)
                } : n(t)
            }("undefined" != typeof window ? window : this, (function (r, i) {
                "use strict";
                var o = [],
                    a = Object.getPrototypeOf,
                    s = o.slice,
                    c = o.flat ? function (e) {
                        return o.flat.call(e)
                    } : function (e) {
                        return o.concat.apply([], e)
                    },
                    u = o.push,
                    l = o.indexOf,
                    d = {},
                    f = d.toString,
                    p = d.hasOwnProperty,
                    h = p.toString,
                    g = h.call(Object),
                    m = {},
                    v = function (e) {
                        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
                    },
                    y = function (e) {
                        return null != e && e === e.window
                    },
                    b = r.document,
                    w = {
                        type: !0,
                        src: !0,
                        nonce: !0,
                        noModule: !0
                    };

                function x(e, t, n) {
                    var r, i, o = (n = n || b).createElement("script");
                    if (o.text = e, t)
                        for (r in w) (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
                    n.head.appendChild(o).parentNode.removeChild(o)
                }

                function k(e) {
                    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? d[f.call(e)] || "object" : typeof e
                }
                var T = "3.7.1",
                    C = /HTML$/i,
                    E = function (e, t) {
                        return new E.fn.init(e, t)
                    };

                function S(e) {
                    var t = !!e && "length" in e && e.length,
                        n = k(e);
                    return !v(e) && !y(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
                }

                function A(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                }
                E.fn = E.prototype = {
                    jquery: T,
                    constructor: E,
                    length: 0,
                    toArray: function () {
                        return s.call(this)
                    },
                    get: function (e) {
                        return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
                    },
                    pushStack: function (e) {
                        var t = E.merge(this.constructor(), e);
                        return t.prevObject = this, t
                    },
                    each: function (e) {
                        return E.each(this, e)
                    },
                    map: function (e) {
                        return this.pushStack(E.map(this, (function (t, n) {
                            return e.call(t, n, t)
                        })))
                    },
                    slice: function () {
                        return this.pushStack(s.apply(this, arguments))
                    },
                    first: function () {
                        return this.eq(0)
                    },
                    last: function () {
                        return this.eq(-1)
                    },
                    even: function () {
                        return this.pushStack(E.grep(this, (function (e, t) {
                            return (t + 1) % 2
                        })))
                    },
                    odd: function () {
                        return this.pushStack(E.grep(this, (function (e, t) {
                            return t % 2
                        })))
                    },
                    eq: function (e) {
                        var t = this.length,
                            n = +e + (e < 0 ? t : 0);
                        return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
                    },
                    end: function () {
                        return this.prevObject || this.constructor()
                    },
                    push: u,
                    sort: o.sort,
                    splice: o.splice
                }, E.extend = E.fn.extend = function () {
                    var e, t, n, r, i, o, a = arguments[0] || {},
                        s = 1,
                        c = arguments.length,
                        u = !1;
                    for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || v(a) || (a = {}), s === c && (a = this, s--); s < c; s++)
                        if (null != (e = arguments[s]))
                            for (t in e) r = e[t], "__proto__" !== t && a !== r && (u && r && (E.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || E.isPlainObject(n) ? n : {}, i = !1, a[t] = E.extend(u, o, r)) : void 0 !== r && (a[t] = r));
                    return a
                }, E.extend({
                    expando: "jQuery" + (T + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function (e) {
                        throw new Error(e)
                    },
                    noop: function () { },
                    isPlainObject: function (e) {
                        var t, n;
                        return !(!e || "[object Object]" !== f.call(e)) && (!(t = a(e)) || "function" == typeof (n = p.call(t, "constructor") && t.constructor) && h.call(n) === g)
                    },
                    isEmptyObject: function (e) {
                        var t;
                        for (t in e) return !1;
                        return !0
                    },
                    globalEval: function (e, t, n) {
                        x(e, {
                            nonce: t && t.nonce
                        }, n)
                    },
                    each: function (e, t) {
                        var n, r = 0;
                        if (S(e))
                            for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
                        else
                            for (r in e)
                                if (!1 === t.call(e[r], r, e[r])) break;
                        return e
                    },
                    text: function (e) {
                        var t, n = "",
                            r = 0,
                            i = e.nodeType;
                        if (!i)
                            for (; t = e[r++];) n += E.text(t);
                        return 1 === i || 11 === i ? e.textContent : 9 === i ? e.documentElement.textContent : 3 === i || 4 === i ? e.nodeValue : n
                    },
                    makeArray: function (e, t) {
                        var n = t || [];
                        return null != e && (S(Object(e)) ? E.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)), n
                    },
                    inArray: function (e, t, n) {
                        return null == t ? -1 : l.call(t, e, n)
                    },
                    isXMLDoc: function (e) {
                        var t = e && e.namespaceURI,
                            n = e && (e.ownerDocument || e).documentElement;
                        return !C.test(t || n && n.nodeName || "HTML")
                    },
                    merge: function (e, t) {
                        for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
                        return e.length = i, e
                    },
                    grep: function (e, t, n) {
                        for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) !t(e[i], i) !== a && r.push(e[i]);
                        return r
                    },
                    map: function (e, t, n) {
                        var r, i, o = 0,
                            a = [];
                        if (S(e))
                            for (r = e.length; o < r; o++) null != (i = t(e[o], o, n)) && a.push(i);
                        else
                            for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
                        return c(a)
                    },
                    guid: 1,
                    support: m
                }), "function" == typeof Symbol && (E.fn[Symbol.iterator] = o[Symbol.iterator]), E.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function (e, t) {
                    d["[object " + t + "]"] = t.toLowerCase()
                }));
                var _ = o.pop,
                    j = o.sort,
                    D = o.splice,
                    O = "[\\x20\\t\\r\\n\\f]",
                    N = new RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$", "g");
                E.contains = function (e, t) {
                    var n = t && t.parentNode;
                    return e === n || !(!n || 1 !== n.nodeType || !(e.contains ? e.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
                };
                var q = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

                function L(e, t) {
                    return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
                }
                E.escapeSelector = function (e) {
                    return (e + "").replace(q, L)
                };
                var P = b,
                    R = u;
                ! function () {
                    var e, t, n, i, a, c, u, d, f, h, g = R,
                        v = E.expando,
                        y = 0,
                        b = 0,
                        w = ee(),
                        x = ee(),
                        k = ee(),
                        T = ee(),
                        C = function (e, t) {
                            return e === t && (a = !0), 0
                        },
                        S = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                        q = "(?:\\\\[\\da-fA-F]{1,6}" + O + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
                        L = "\\[" + O + "*(" + q + ")(?:" + O + "*([*^$|!~]?=)" + O + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + q + "))|)" + O + "*\\]",
                        I = ":(" + q + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + L + ")*)|.*)\\)|)",
                        M = new RegExp(O + "+", "g"),
                        H = new RegExp("^" + O + "*," + O + "*"),
                        F = new RegExp("^" + O + "*([>+~]|" + O + ")" + O + "*"),
                        $ = new RegExp(O + "|>"),
                        B = new RegExp(I),
                        U = new RegExp("^" + q + "$"),
                        W = {
                            ID: new RegExp("^#(" + q + ")"),
                            CLASS: new RegExp("^\\.(" + q + ")"),
                            TAG: new RegExp("^(" + q + "|[*])"),
                            ATTR: new RegExp("^" + L),
                            PSEUDO: new RegExp("^" + I),
                            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)", "i"),
                            bool: new RegExp("^(?:" + S + ")$", "i"),
                            needsContext: new RegExp("^" + O + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)", "i")
                        },
                        z = /^(?:input|select|textarea|button)$/i,
                        V = /^h\d$/i,
                        X = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                        G = /[+~]/,
                        Y = new RegExp("\\\\[\\da-fA-F]{1,6}" + O + "?|\\\\([^\\r\\n\\f])", "g"),
                        K = function (e, t) {
                            var n = "0x" + e.slice(1) - 65536;
                            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
                        },
                        Q = function () {
                            ce()
                        },
                        J = fe((function (e) {
                            return !0 === e.disabled && A(e, "fieldset")
                        }), {
                            dir: "parentNode",
                            next: "legend"
                        });
                    try {
                        g.apply(o = s.call(P.childNodes), P.childNodes), o[P.childNodes.length].nodeType
                    } catch (e) {
                        g = {
                            apply: function (e, t) {
                                R.apply(e, s.call(t))
                            },
                            call: function (e) {
                                R.apply(e, s.call(arguments, 1))
                            }
                        }
                    }

                    function Z(e, t, n, r) {
                        var i, o, a, s, u, l, p, h = t && t.ownerDocument,
                            y = t ? t.nodeType : 9;
                        if (n = n || [], "string" != typeof e || !e || 1 !== y && 9 !== y && 11 !== y) return n;
                        if (!r && (ce(t), t = t || c, d)) {
                            if (11 !== y && (u = X.exec(e)))
                                if (i = u[1]) {
                                    if (9 === y) {
                                        if (!(a = t.getElementById(i))) return n;
                                        if (a.id === i) return g.call(n, a), n
                                    } else if (h && (a = h.getElementById(i)) && Z.contains(t, a) && a.id === i) return g.call(n, a), n
                                } else {
                                    if (u[2]) return g.apply(n, t.getElementsByTagName(e)), n;
                                    if ((i = u[3]) && t.getElementsByClassName) return g.apply(n, t.getElementsByClassName(i)), n
                                }
                            if (!(T[e + " "] || f && f.test(e))) {
                                if (p = e, h = t, 1 === y && ($.test(e) || F.test(e))) {
                                    for ((h = G.test(e) && se(t.parentNode) || t) == t && m.scope || ((s = t.getAttribute("id")) ? s = E.escapeSelector(s) : t.setAttribute("id", s = v)), o = (l = le(e)).length; o--;) l[o] = (s ? "#" + s : ":scope") + " " + de(l[o]);
                                    p = l.join(",")
                                }
                                try {
                                    return g.apply(n, h.querySelectorAll(p)), n
                                } catch (t) {
                                    T(e, !0)
                                } finally {
                                    s === v && t.removeAttribute("id")
                                }
                            }
                        }
                        return ye(e.replace(N, "$1"), t, n, r)
                    }

                    function ee() {
                        var e = [];
                        return function n(r, i) {
                            return e.push(r + " ") > t.cacheLength && delete n[e.shift()], n[r + " "] = i
                        }
                    }

                    function te(e) {
                        return e[v] = !0, e
                    }

                    function ne(e) {
                        var t = c.createElement("fieldset");
                        try {
                            return !!e(t)
                        } catch (e) {
                            return !1
                        } finally {
                            t.parentNode && t.parentNode.removeChild(t), t = null
                        }
                    }

                    function re(e) {
                        return function (t) {
                            return A(t, "input") && t.type === e
                        }
                    }

                    function ie(e) {
                        return function (t) {
                            return (A(t, "input") || A(t, "button")) && t.type === e
                        }
                    }

                    function oe(e) {
                        return function (t) {
                            return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && J(t) === e : t.disabled === e : "label" in t && t.disabled === e
                        }
                    }

                    function ae(e) {
                        return te((function (t) {
                            return t = +t, te((function (n, r) {
                                for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                            }))
                        }))
                    }

                    function se(e) {
                        return e && void 0 !== e.getElementsByTagName && e
                    }

                    function ce(e) {
                        var n, r = e ? e.ownerDocument || e : P;
                        return r != c && 9 === r.nodeType && r.documentElement ? (u = (c = r).documentElement, d = !E.isXMLDoc(c), h = u.matches || u.webkitMatchesSelector || u.msMatchesSelector, u.msMatchesSelector && P != c && (n = c.defaultView) && n.top !== n && n.addEventListener("unload", Q), m.getById = ne((function (e) {
                            return u.appendChild(e).id = E.expando, !c.getElementsByName || !c.getElementsByName(E.expando).length
                        })), m.disconnectedMatch = ne((function (e) {
                            return h.call(e, "*")
                        })), m.scope = ne((function () {
                            return c.querySelectorAll(":scope")
                        })), m.cssHas = ne((function () {
                            try {
                                return c.querySelector(":has(*,:jqfake)"), !1
                            } catch (e) {
                                return !0
                            }
                        })), m.getById ? (t.filter.ID = function (e) {
                            var t = e.replace(Y, K);
                            return function (e) {
                                return e.getAttribute("id") === t
                            }
                        }, t.find.ID = function (e, t) {
                            if (void 0 !== t.getElementById && d) {
                                var n = t.getElementById(e);
                                return n ? [n] : []
                            }
                        }) : (t.filter.ID = function (e) {
                            var t = e.replace(Y, K);
                            return function (e) {
                                var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                                return n && n.value === t
                            }
                        }, t.find.ID = function (e, t) {
                            if (void 0 !== t.getElementById && d) {
                                var n, r, i, o = t.getElementById(e);
                                if (o) {
                                    if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                                    for (i = t.getElementsByName(e), r = 0; o = i[r++];)
                                        if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                                }
                                return []
                            }
                        }), t.find.TAG = function (e, t) {
                            return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : t.querySelectorAll(e)
                        }, t.find.CLASS = function (e, t) {
                            if (void 0 !== t.getElementsByClassName && d) return t.getElementsByClassName(e)
                        }, f = [], ne((function (e) {
                            var t;
                            u.appendChild(e).innerHTML = "<a id='" + v + "' href='' disabled='disabled'></a><select id='" + v + "-\r\\' disabled='disabled'><option selected=''></option></select>", e.querySelectorAll("[selected]").length || f.push("\\[" + O + "*(?:value|" + S + ")"), e.querySelectorAll("[id~=" + v + "-]").length || f.push("~="), e.querySelectorAll("a#" + v + "+*").length || f.push(".#.+[+~]"), e.querySelectorAll(":checked").length || f.push(":checked"), (t = c.createElement("input")).setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), u.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && f.push(":enabled", ":disabled"), (t = c.createElement("input")).setAttribute("name", ""), e.appendChild(t), e.querySelectorAll("[name='']").length || f.push("\\[" + O + "*name" + O + "*=" + O + "*(?:''|\"\")")
                        })), m.cssHas || f.push(":has"), f = f.length && new RegExp(f.join("|")), C = function (e, t) {
                            if (e === t) return a = !0, 0;
                            var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                            return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !m.sortDetached && t.compareDocumentPosition(e) === n ? e === c || e.ownerDocument == P && Z.contains(P, e) ? -1 : t === c || t.ownerDocument == P && Z.contains(P, t) ? 1 : i ? l.call(i, e) - l.call(i, t) : 0 : 4 & n ? -1 : 1)
                        }, c) : c
                    }
                    for (e in Z.matches = function (e, t) {
                        return Z(e, null, null, t)
                    }, Z.matchesSelector = function (e, t) {
                        if (ce(e), d && !T[t + " "] && (!f || !f.test(t))) try {
                            var n = h.call(e, t);
                            if (n || m.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                        } catch (e) {
                            T(t, !0)
                        }
                        return Z(t, c, null, [e]).length > 0
                    }, Z.contains = function (e, t) {
                        return (e.ownerDocument || e) != c && ce(e), E.contains(e, t)
                    }, Z.attr = function (e, n) {
                        (e.ownerDocument || e) != c && ce(e);
                        var r = t.attrHandle[n.toLowerCase()],
                            i = r && p.call(t.attrHandle, n.toLowerCase()) ? r(e, n, !d) : void 0;
                        return void 0 !== i ? i : e.getAttribute(n)
                    }, Z.error = function (e) {
                        throw new Error("Syntax error, unrecognized expression: " + e)
                    }, E.uniqueSort = function (e) {
                        var t, n = [],
                            r = 0,
                            o = 0;
                        if (a = !m.sortStable, i = !m.sortStable && s.call(e, 0), j.call(e, C), a) {
                            for (; t = e[o++];) t === e[o] && (r = n.push(o));
                            for (; r--;) D.call(e, n[r], 1)
                        }
                        return i = null, e
                    }, E.fn.uniqueSort = function () {
                        return this.pushStack(E.uniqueSort(s.apply(this)))
                    }, t = E.expr = {
                        cacheLength: 50,
                        createPseudo: te,
                        match: W,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function (e) {
                                return e[1] = e[1].replace(Y, K), e[3] = (e[3] || e[4] || e[5] || "").replace(Y, K), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                            },
                            CHILD: function (e) {
                                return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || Z.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && Z.error(e[0]), e
                            },
                            PSEUDO: function (e) {
                                var t, n = !e[6] && e[2];
                                return W.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && B.test(n) && (t = le(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                            }
                        },
                        filter: {
                            TAG: function (e) {
                                var t = e.replace(Y, K).toLowerCase();
                                return "*" === e ? function () {
                                    return !0
                                } : function (e) {
                                    return A(e, t)
                                }
                            },
                            CLASS: function (e) {
                                var t = w[e + " "];
                                return t || (t = new RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) && w(e, (function (e) {
                                    return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                                }))
                            },
                            ATTR: function (e, t, n) {
                                return function (r) {
                                    var i = Z.attr(r, e);
                                    return null == i ? "!=" === t : !t || (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i.replace(M, " ") + " ").indexOf(n) > -1 : "|=" === t && (i === n || i.slice(0, n.length + 1) === n + "-"))
                                }
                            },
                            CHILD: function (e, t, n, r, i) {
                                var o = "nth" !== e.slice(0, 3),
                                    a = "last" !== e.slice(-4),
                                    s = "of-type" === t;
                                return 1 === r && 0 === i ? function (e) {
                                    return !!e.parentNode
                                } : function (t, n, c) {
                                    var u, l, d, f, p, h = o !== a ? "nextSibling" : "previousSibling",
                                        g = t.parentNode,
                                        m = s && t.nodeName.toLowerCase(),
                                        b = !c && !s,
                                        w = !1;
                                    if (g) {
                                        if (o) {
                                            for (; h;) {
                                                for (d = t; d = d[h];)
                                                    if (s ? A(d, m) : 1 === d.nodeType) return !1;
                                                p = h = "only" === e && !p && "nextSibling"
                                            }
                                            return !0
                                        }
                                        if (p = [a ? g.firstChild : g.lastChild], a && b) {
                                            for (w = (f = (u = (l = g[v] || (g[v] = {}))[e] || [])[0] === y && u[1]) && u[2], d = f && g.childNodes[f]; d = ++f && d && d[h] || (w = f = 0) || p.pop();)
                                                if (1 === d.nodeType && ++w && d === t) {
                                                    l[e] = [y, f, w];
                                                    break
                                                }
                                        } else if (b && (w = f = (u = (l = t[v] || (t[v] = {}))[e] || [])[0] === y && u[1]), !1 === w)
                                            for (;
                                                (d = ++f && d && d[h] || (w = f = 0) || p.pop()) && (!(s ? A(d, m) : 1 === d.nodeType) || !++w || (b && ((l = d[v] || (d[v] = {}))[e] = [y, w]), d !== t)););
                                        return (w -= i) === r || w % r == 0 && w / r >= 0
                                    }
                                }
                            },
                            PSEUDO: function (e, n) {
                                var r, i = t.pseudos[e] || t.setFilters[e.toLowerCase()] || Z.error("unsupported pseudo: " + e);
                                return i[v] ? i(n) : i.length > 1 ? (r = [e, e, "", n], t.setFilters.hasOwnProperty(e.toLowerCase()) ? te((function (e, t) {
                                    for (var r, o = i(e, n), a = o.length; a--;) e[r = l.call(e, o[a])] = !(t[r] = o[a])
                                })) : function (e) {
                                    return i(e, 0, r)
                                }) : i
                            }
                        },
                        pseudos: {
                            not: te((function (e) {
                                var t = [],
                                    n = [],
                                    r = ve(e.replace(N, "$1"));
                                return r[v] ? te((function (e, t, n, i) {
                                    for (var o, a = r(e, null, i, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                                })) : function (e, i, o) {
                                    return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                                }
                            })),
                            has: te((function (e) {
                                return function (t) {
                                    return Z(e, t).length > 0
                                }
                            })),
                            contains: te((function (e) {
                                return e = e.replace(Y, K),
                                    function (t) {
                                        return (t.textContent || E.text(t)).indexOf(e) > -1
                                    }
                            })),
                            lang: te((function (e) {
                                return U.test(e || "") || Z.error("unsupported lang: " + e), e = e.replace(Y, K).toLowerCase(),
                                    function (t) {
                                        var n;
                                        do {
                                            if (n = d ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                        } while ((t = t.parentNode) && 1 === t.nodeType);
                                        return !1
                                    }
                            })),
                            target: function (e) {
                                var t = r.location && r.location.hash;
                                return t && t.slice(1) === e.id
                            },
                            root: function (e) {
                                return e === u
                            },
                            focus: function (e) {
                                return e === function () {
                                    try {
                                        return c.activeElement
                                    } catch (e) { }
                                }() && c.hasFocus() && !!(e.type || e.href || ~e.tabIndex)
                            },
                            enabled: oe(!1),
                            disabled: oe(!0),
                            checked: function (e) {
                                return A(e, "input") && !!e.checked || A(e, "option") && !!e.selected
                            },
                            selected: function (e) {
                                return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                            },
                            empty: function (e) {
                                for (e = e.firstChild; e; e = e.nextSibling)
                                    if (e.nodeType < 6) return !1;
                                return !0
                            },
                            parent: function (e) {
                                return !t.pseudos.empty(e)
                            },
                            header: function (e) {
                                return V.test(e.nodeName)
                            },
                            input: function (e) {
                                return z.test(e.nodeName)
                            },
                            button: function (e) {
                                return A(e, "input") && "button" === e.type || A(e, "button")
                            },
                            text: function (e) {
                                var t;
                                return A(e, "input") && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                            },
                            first: ae((function () {
                                return [0]
                            })),
                            last: ae((function (e, t) {
                                return [t - 1]
                            })),
                            eq: ae((function (e, t, n) {
                                return [n < 0 ? n + t : n]
                            })),
                            even: ae((function (e, t) {
                                for (var n = 0; n < t; n += 2) e.push(n);
                                return e
                            })),
                            odd: ae((function (e, t) {
                                for (var n = 1; n < t; n += 2) e.push(n);
                                return e
                            })),
                            lt: ae((function (e, t, n) {
                                var r;
                                for (r = n < 0 ? n + t : n > t ? t : n; --r >= 0;) e.push(r);
                                return e
                            })),
                            gt: ae((function (e, t, n) {
                                for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                                return e
                            }))
                        }
                    }, t.pseudos.nth = t.pseudos.eq, {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) t.pseudos[e] = re(e);
                    for (e in {
                        submit: !0,
                        reset: !0
                    }) t.pseudos[e] = ie(e);

                    function ue() { }

                    function le(e, n) {
                        var r, i, o, a, s, c, u, l = x[e + " "];
                        if (l) return n ? 0 : l.slice(0);
                        for (s = e, c = [], u = t.preFilter; s;) {
                            for (a in r && !(i = H.exec(s)) || (i && (s = s.slice(i[0].length) || s), c.push(o = [])), r = !1, (i = F.exec(s)) && (r = i.shift(), o.push({
                                value: r,
                                type: i[0].replace(N, " ")
                            }), s = s.slice(r.length)), t.filter) !(i = W[a].exec(s)) || u[a] && !(i = u[a](i)) || (r = i.shift(), o.push({
                                value: r,
                                type: a,
                                matches: i
                            }), s = s.slice(r.length));
                            if (!r) break
                        }
                        return n ? s.length : s ? Z.error(e) : x(e, c).slice(0)
                    }

                    function de(e) {
                        for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
                        return r
                    }

                    function fe(e, t, n) {
                        var r = t.dir,
                            i = t.next,
                            o = i || r,
                            a = n && "parentNode" === o,
                            s = b++;
                        return t.first ? function (t, n, i) {
                            for (; t = t[r];)
                                if (1 === t.nodeType || a) return e(t, n, i);
                            return !1
                        } : function (t, n, c) {
                            var u, l, d = [y, s];
                            if (c) {
                                for (; t = t[r];)
                                    if ((1 === t.nodeType || a) && e(t, n, c)) return !0
                            } else
                                for (; t = t[r];)
                                    if (1 === t.nodeType || a)
                                        if (l = t[v] || (t[v] = {}), i && A(t, i)) t = t[r] || t;
                                        else {
                                            if ((u = l[o]) && u[0] === y && u[1] === s) return d[2] = u[2];
                                            if (l[o] = d, d[2] = e(t, n, c)) return !0
                                        } return !1
                        }
                    }

                    function pe(e) {
                        return e.length > 1 ? function (t, n, r) {
                            for (var i = e.length; i--;)
                                if (!e[i](t, n, r)) return !1;
                            return !0
                        } : e[0]
                    }

                    function he(e, t, n, r, i) {
                        for (var o, a = [], s = 0, c = e.length, u = null != t; s < c; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), u && t.push(s)));
                        return a
                    }

                    function ge(e, t, n, r, i, o) {
                        return r && !r[v] && (r = ge(r)), i && !i[v] && (i = ge(i, o)), te((function (o, a, s, c) {
                            var u, d, f, p, h = [],
                                m = [],
                                v = a.length,
                                y = o || function (e, t, n) {
                                    for (var r = 0, i = t.length; r < i; r++) Z(e, t[r], n);
                                    return n
                                }(t || "*", s.nodeType ? [s] : s, []),
                                b = !e || !o && t ? y : he(y, h, e, s, c);
                            if (n ? n(b, p = i || (o ? e : v || r) ? [] : a, s, c) : p = b, r)
                                for (u = he(p, m), r(u, [], s, c), d = u.length; d--;)(f = u[d]) && (p[m[d]] = !(b[m[d]] = f));
                            if (o) {
                                if (i || e) {
                                    if (i) {
                                        for (u = [], d = p.length; d--;)(f = p[d]) && u.push(b[d] = f);
                                        i(null, p = [], u, c)
                                    }
                                    for (d = p.length; d--;)(f = p[d]) && (u = i ? l.call(o, f) : h[d]) > -1 && (o[u] = !(a[u] = f))
                                }
                            } else p = he(p === a ? p.splice(v, p.length) : p), i ? i(null, a, p, c) : g.apply(a, p)
                        }))
                    }

                    function me(e) {
                        for (var r, i, o, a = e.length, s = t.relative[e[0].type], c = s || t.relative[" "], u = s ? 1 : 0, d = fe((function (e) {
                            return e === r
                        }), c, !0), f = fe((function (e) {
                            return l.call(r, e) > -1
                        }), c, !0), p = [function (e, t, i) {
                            var o = !s && (i || t != n) || ((r = t).nodeType ? d(e, t, i) : f(e, t, i));
                            return r = null, o
                        }]; u < a; u++)
                            if (i = t.relative[e[u].type]) p = [fe(pe(p), i)];
                            else {
                                if ((i = t.filter[e[u].type].apply(null, e[u].matches))[v]) {
                                    for (o = ++u; o < a && !t.relative[e[o].type]; o++);
                                    return ge(u > 1 && pe(p), u > 1 && de(e.slice(0, u - 1).concat({
                                        value: " " === e[u - 2].type ? "*" : ""
                                    })).replace(N, "$1"), i, u < o && me(e.slice(u, o)), o < a && me(e = e.slice(o)), o < a && de(e))
                                }
                                p.push(i)
                            }
                        return pe(p)
                    }

                    function ve(e, r) {
                        var i, o = [],
                            a = [],
                            s = k[e + " "];
                        if (!s) {
                            for (r || (r = le(e)), i = r.length; i--;)(s = me(r[i]))[v] ? o.push(s) : a.push(s);
                            s = k(e, function (e, r) {
                                var i = r.length > 0,
                                    o = e.length > 0,
                                    a = function (a, s, u, l, f) {
                                        var p, h, m, v = 0,
                                            b = "0",
                                            w = a && [],
                                            x = [],
                                            k = n,
                                            T = a || o && t.find.TAG("*", f),
                                            C = y += null == k ? 1 : Math.random() || .1,
                                            S = T.length;
                                        for (f && (n = s == c || s || f); b !== S && null != (p = T[b]); b++) {
                                            if (o && p) {
                                                for (h = 0, s || p.ownerDocument == c || (ce(p), u = !d); m = e[h++];)
                                                    if (m(p, s || c, u)) {
                                                        g.call(l, p);
                                                        break
                                                    }
                                                f && (y = C)
                                            }
                                            i && ((p = !m && p) && v--, a && w.push(p))
                                        }
                                        if (v += b, i && b !== v) {
                                            for (h = 0; m = r[h++];) m(w, x, s, u);
                                            if (a) {
                                                if (v > 0)
                                                    for (; b--;) w[b] || x[b] || (x[b] = _.call(l));
                                                x = he(x)
                                            }
                                            g.apply(l, x), f && !a && x.length > 0 && v + r.length > 1 && E.uniqueSort(l)
                                        }
                                        return f && (y = C, n = k), w
                                    };
                                return i ? te(a) : a
                            }(a, o)), s.selector = e
                        }
                        return s
                    }

                    function ye(e, n, r, i) {
                        var o, a, s, c, u, l = "function" == typeof e && e,
                            f = !i && le(e = l.selector || e);
                        if (r = r || [], 1 === f.length) {
                            if ((a = f[0] = f[0].slice(0)).length > 2 && "ID" === (s = a[0]).type && 9 === n.nodeType && d && t.relative[a[1].type]) {
                                if (!(n = (t.find.ID(s.matches[0].replace(Y, K), n) || [])[0])) return r;
                                l && (n = n.parentNode), e = e.slice(a.shift().value.length)
                            }
                            for (o = W.needsContext.test(e) ? 0 : a.length; o-- && (s = a[o], !t.relative[c = s.type]);)
                                if ((u = t.find[c]) && (i = u(s.matches[0].replace(Y, K), G.test(a[0].type) && se(n.parentNode) || n))) {
                                    if (a.splice(o, 1), !(e = i.length && de(a))) return g.apply(r, i), r;
                                    break
                                }
                        }
                        return (l || ve(e, f))(i, n, !d, r, !n || G.test(e) && se(n.parentNode) || n), r
                    }
                    ue.prototype = t.filters = t.pseudos, t.setFilters = new ue, m.sortStable = v.split("").sort(C).join("") === v, ce(), m.sortDetached = ne((function (e) {
                        return 1 & e.compareDocumentPosition(c.createElement("fieldset"))
                    })), E.find = Z, E.expr[":"] = E.expr.pseudos, E.unique = E.uniqueSort, Z.compile = ve, Z.select = ye, Z.setDocument = ce, Z.tokenize = le, Z.escape = E.escapeSelector, Z.getText = E.text, Z.isXML = E.isXMLDoc, Z.selectors = E.expr, Z.support = E.support, Z.uniqueSort = E.uniqueSort
                }();
                var I = function (e, t, n) {
                    for (var r = [], i = void 0 !== n;
                        (e = e[t]) && 9 !== e.nodeType;)
                        if (1 === e.nodeType) {
                            if (i && E(e).is(n)) break;
                            r.push(e)
                        }
                    return r
                },
                    M = function (e, t) {
                        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                        return n
                    },
                    H = E.expr.match.needsContext,
                    F = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

                function $(e, t, n) {
                    return v(t) ? E.grep(e, (function (e, r) {
                        return !!t.call(e, r, e) !== n
                    })) : t.nodeType ? E.grep(e, (function (e) {
                        return e === t !== n
                    })) : "string" != typeof t ? E.grep(e, (function (e) {
                        return l.call(t, e) > -1 !== n
                    })) : E.filter(t, e, n)
                }
                E.filter = function (e, t, n) {
                    var r = t[0];
                    return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? E.find.matchesSelector(r, e) ? [r] : [] : E.find.matches(e, E.grep(t, (function (e) {
                        return 1 === e.nodeType
                    })))
                }, E.fn.extend({
                    find: function (e) {
                        var t, n, r = this.length,
                            i = this;
                        if ("string" != typeof e) return this.pushStack(E(e).filter((function () {
                            for (t = 0; t < r; t++)
                                if (E.contains(i[t], this)) return !0
                        })));
                        for (n = this.pushStack([]), t = 0; t < r; t++) E.find(e, i[t], n);
                        return r > 1 ? E.uniqueSort(n) : n
                    },
                    filter: function (e) {
                        return this.pushStack($(this, e || [], !1))
                    },
                    not: function (e) {
                        return this.pushStack($(this, e || [], !0))
                    },
                    is: function (e) {
                        return !!$(this, "string" == typeof e && H.test(e) ? E(e) : e || [], !1).length
                    }
                });
                var B, U = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
                (E.fn.init = function (e, t, n) {
                    var r, i;
                    if (!e) return this;
                    if (n = n || B, "string" == typeof e) {
                        if (!(r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : U.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                        if (r[1]) {
                            if (t = t instanceof E ? t[0] : t, E.merge(this, E.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : b, !0)), F.test(r[1]) && E.isPlainObject(t))
                                for (r in t) v(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                            return this
                        }
                        return (i = b.getElementById(r[2])) && (this[0] = i, this.length = 1), this
                    }
                    return e.nodeType ? (this[0] = e, this.length = 1, this) : v(e) ? void 0 !== n.ready ? n.ready(e) : e(E) : E.makeArray(e, this)
                }).prototype = E.fn, B = E(b);
                var W = /^(?:parents|prev(?:Until|All))/,
                    z = {
                        children: !0,
                        contents: !0,
                        next: !0,
                        prev: !0
                    };

                function V(e, t) {
                    for (;
                        (e = e[t]) && 1 !== e.nodeType;);
                    return e
                }
                E.fn.extend({
                    has: function (e) {
                        var t = E(e, this),
                            n = t.length;
                        return this.filter((function () {
                            for (var e = 0; e < n; e++)
                                if (E.contains(this, t[e])) return !0
                        }))
                    },
                    closest: function (e, t) {
                        var n, r = 0,
                            i = this.length,
                            o = [],
                            a = "string" != typeof e && E(e);
                        if (!H.test(e))
                            for (; r < i; r++)
                                for (n = this[r]; n && n !== t; n = n.parentNode)
                                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && E.find.matchesSelector(n, e))) {
                                        o.push(n);
                                        break
                                    }
                        return this.pushStack(o.length > 1 ? E.uniqueSort(o) : o)
                    },
                    index: function (e) {
                        return e ? "string" == typeof e ? l.call(E(e), this[0]) : l.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                    },
                    add: function (e, t) {
                        return this.pushStack(E.uniqueSort(E.merge(this.get(), E(e, t))))
                    },
                    addBack: function (e) {
                        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                    }
                }), E.each({
                    parent: function (e) {
                        var t = e.parentNode;
                        return t && 11 !== t.nodeType ? t : null
                    },
                    parents: function (e) {
                        return I(e, "parentNode")
                    },
                    parentsUntil: function (e, t, n) {
                        return I(e, "parentNode", n)
                    },
                    next: function (e) {
                        return V(e, "nextSibling")
                    },
                    prev: function (e) {
                        return V(e, "previousSibling")
                    },
                    nextAll: function (e) {
                        return I(e, "nextSibling")
                    },
                    prevAll: function (e) {
                        return I(e, "previousSibling")
                    },
                    nextUntil: function (e, t, n) {
                        return I(e, "nextSibling", n)
                    },
                    prevUntil: function (e, t, n) {
                        return I(e, "previousSibling", n)
                    },
                    siblings: function (e) {
                        return M((e.parentNode || {}).firstChild, e)
                    },
                    children: function (e) {
                        return M(e.firstChild)
                    },
                    contents: function (e) {
                        return null != e.contentDocument && a(e.contentDocument) ? e.contentDocument : (A(e, "template") && (e = e.content || e), E.merge([], e.childNodes))
                    }
                }, (function (e, t) {
                    E.fn[e] = function (n, r) {
                        var i = E.map(this, t, n);
                        return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = E.filter(r, i)), this.length > 1 && (z[e] || E.uniqueSort(i), W.test(e) && i.reverse()), this.pushStack(i)
                    }
                }));
                var X = /[^\x20\t\r\n\f]+/g;

                function G(e) {
                    return e
                }

                function Y(e) {
                    throw e
                }

                function K(e, t, n, r) {
                    var i;
                    try {
                        e && v(i = e.promise) ? i.call(e).done(t).fail(n) : e && v(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
                    } catch (e) {
                        n.apply(void 0, [e])
                    }
                }
                E.Callbacks = function (e) {
                    e = "string" == typeof e ? function (e) {
                        var t = {};
                        return E.each(e.match(X) || [], (function (e, n) {
                            t[n] = !0
                        })), t
                    }(e) : E.extend({}, e);
                    var t, n, r, i, o = [],
                        a = [],
                        s = -1,
                        c = function () {
                            for (i = i || e.once, r = t = !0; a.length; s = -1)
                                for (n = a.shift(); ++s < o.length;) !1 === o[s].apply(n[0], n[1]) && e.stopOnFalse && (s = o.length, n = !1);
                            e.memory || (n = !1), t = !1, i && (o = n ? [] : "")
                        },
                        u = {
                            add: function () {
                                return o && (n && !t && (s = o.length - 1, a.push(n)), function t(n) {
                                    E.each(n, (function (n, r) {
                                        v(r) ? e.unique && u.has(r) || o.push(r) : r && r.length && "string" !== k(r) && t(r)
                                    }))
                                }(arguments), n && !t && c()), this
                            },
                            remove: function () {
                                return E.each(arguments, (function (e, t) {
                                    for (var n;
                                        (n = E.inArray(t, o, n)) > -1;) o.splice(n, 1), n <= s && s--
                                })), this
                            },
                            has: function (e) {
                                return e ? E.inArray(e, o) > -1 : o.length > 0
                            },
                            empty: function () {
                                return o && (o = []), this
                            },
                            disable: function () {
                                return i = a = [], o = n = "", this
                            },
                            disabled: function () {
                                return !o
                            },
                            lock: function () {
                                return i = a = [], n || t || (o = n = ""), this
                            },
                            locked: function () {
                                return !!i
                            },
                            fireWith: function (e, n) {
                                return i || (n = [e, (n = n || []).slice ? n.slice() : n], a.push(n), t || c()), this
                            },
                            fire: function () {
                                return u.fireWith(this, arguments), this
                            },
                            fired: function () {
                                return !!r
                            }
                        };
                    return u
                }, E.extend({
                    Deferred: function (e) {
                        var t = [
                            ["notify", "progress", E.Callbacks("memory"), E.Callbacks("memory"), 2],
                            ["resolve", "done", E.Callbacks("once memory"), E.Callbacks("once memory"), 0, "resolved"],
                            ["reject", "fail", E.Callbacks("once memory"), E.Callbacks("once memory"), 1, "rejected"]
                        ],
                            n = "pending",
                            i = {
                                state: function () {
                                    return n
                                },
                                always: function () {
                                    return o.done(arguments).fail(arguments), this
                                },
                                catch: function (e) {
                                    return i.then(null, e)
                                },
                                pipe: function () {
                                    var e = arguments;
                                    return E.Deferred((function (n) {
                                        E.each(t, (function (t, r) {
                                            var i = v(e[r[4]]) && e[r[4]];
                                            o[r[1]]((function () {
                                                var e = i && i.apply(this, arguments);
                                                e && v(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[r[0] + "With"](this, i ? [e] : arguments)
                                            }))
                                        })), e = null
                                    })).promise()
                                },
                                then: function (e, n, i) {
                                    var o = 0;

                                    function a(e, t, n, i) {
                                        return function () {
                                            var s = this,
                                                c = arguments,
                                                u = function () {
                                                    var r, u;
                                                    if (!(e < o)) {
                                                        if ((r = n.apply(s, c)) === t.promise()) throw new TypeError("Thenable self-resolution");
                                                        u = r && ("object" == typeof r || "function" == typeof r) && r.then, v(u) ? i ? u.call(r, a(o, t, G, i), a(o, t, Y, i)) : (o++, u.call(r, a(o, t, G, i), a(o, t, Y, i), a(o, t, G, t.notifyWith))) : (n !== G && (s = void 0, c = [r]), (i || t.resolveWith)(s, c))
                                                    }
                                                },
                                                l = i ? u : function () {
                                                    try {
                                                        u()
                                                    } catch (r) {
                                                        E.Deferred.exceptionHook && E.Deferred.exceptionHook(r, l.error), e + 1 >= o && (n !== Y && (s = void 0, c = [r]), t.rejectWith(s, c))
                                                    }
                                                };
                                            e ? l() : (E.Deferred.getErrorHook ? l.error = E.Deferred.getErrorHook() : E.Deferred.getStackHook && (l.error = E.Deferred.getStackHook()), r.setTimeout(l))
                                        }
                                    }
                                    return E.Deferred((function (r) {
                                        t[0][3].add(a(0, r, v(i) ? i : G, r.notifyWith)), t[1][3].add(a(0, r, v(e) ? e : G)), t[2][3].add(a(0, r, v(n) ? n : Y))
                                    })).promise()
                                },
                                promise: function (e) {
                                    return null != e ? E.extend(e, i) : i
                                }
                            },
                            o = {};
                        return E.each(t, (function (e, r) {
                            var a = r[2],
                                s = r[5];
                            i[r[1]] = a.add, s && a.add((function () {
                                n = s
                            }), t[3 - e][2].disable, t[3 - e][3].disable, t[0][2].lock, t[0][3].lock), a.add(r[3].fire), o[r[0]] = function () {
                                return o[r[0] + "With"](this === o ? void 0 : this, arguments), this
                            }, o[r[0] + "With"] = a.fireWith
                        })), i.promise(o), e && e.call(o, o), o
                    },
                    when: function (e) {
                        var t = arguments.length,
                            n = t,
                            r = Array(n),
                            i = s.call(arguments),
                            o = E.Deferred(),
                            a = function (e) {
                                return function (n) {
                                    r[e] = this, i[e] = arguments.length > 1 ? s.call(arguments) : n, --t || o.resolveWith(r, i)
                                }
                            };
                        if (t <= 1 && (K(e, o.done(a(n)).resolve, o.reject, !t), "pending" === o.state() || v(i[n] && i[n].then))) return o.then();
                        for (; n--;) K(i[n], a(n), o.reject);
                        return o.promise()
                    }
                });
                var Q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
                E.Deferred.exceptionHook = function (e, t) {
                    r.console && r.console.warn && e && Q.test(e.name) && r.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
                }, E.readyException = function (e) {
                    r.setTimeout((function () {
                        throw e
                    }))
                };
                var J = E.Deferred();

                function Z() {
                    b.removeEventListener("DOMContentLoaded", Z), r.removeEventListener("load", Z), E.ready()
                }
                E.fn.ready = function (e) {
                    return J.then(e).catch((function (e) {
                        E.readyException(e)
                    })), this
                }, E.extend({
                    isReady: !1,
                    readyWait: 1,
                    ready: function (e) {
                        (!0 === e ? --E.readyWait : E.isReady) || (E.isReady = !0, !0 !== e && --E.readyWait > 0 || J.resolveWith(b, [E]))
                    }
                }), E.ready.then = J.then, "complete" === b.readyState || "loading" !== b.readyState && !b.documentElement.doScroll ? r.setTimeout(E.ready) : (b.addEventListener("DOMContentLoaded", Z), r.addEventListener("load", Z));
                var ee = function (e, t, n, r, i, o, a) {
                    var s = 0,
                        c = e.length,
                        u = null == n;
                    if ("object" === k(n))
                        for (s in i = !0, n) ee(e, t, s, n[s], !0, o, a);
                    else if (void 0 !== r && (i = !0, v(r) || (a = !0), u && (a ? (t.call(e, r), t = null) : (u = t, t = function (e, t, n) {
                        return u.call(E(e), n)
                    })), t))
                        for (; s < c; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
                    return i ? e : u ? t.call(e) : c ? t(e[0], n) : o
                },
                    te = /^-ms-/,
                    ne = /-([a-z])/g;

                function re(e, t) {
                    return t.toUpperCase()
                }

                function ie(e) {
                    return e.replace(te, "ms-").replace(ne, re)
                }
                var oe = function (e) {
                    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
                };

                function ae() {
                    this.expando = E.expando + ae.uid++
                }
                ae.uid = 1, ae.prototype = {
                    cache: function (e) {
                        var t = e[this.expando];
                        return t || (t = {}, oe(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                            value: t,
                            configurable: !0
                        }))), t
                    },
                    set: function (e, t, n) {
                        var r, i = this.cache(e);
                        if ("string" == typeof t) i[ie(t)] = n;
                        else
                            for (r in t) i[ie(r)] = t[r];
                        return i
                    },
                    get: function (e, t) {
                        return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][ie(t)]
                    },
                    access: function (e, t, n) {
                        return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
                    },
                    remove: function (e, t) {
                        var n, r = e[this.expando];
                        if (void 0 !== r) {
                            if (void 0 !== t) {
                                n = (t = Array.isArray(t) ? t.map(ie) : (t = ie(t)) in r ? [t] : t.match(X) || []).length;
                                for (; n--;) delete r[t[n]]
                            } (void 0 === t || E.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                        }
                    },
                    hasData: function (e) {
                        var t = e[this.expando];
                        return void 0 !== t && !E.isEmptyObject(t)
                    }
                };
                var se = new ae,
                    ce = new ae,
                    ue = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                    le = /[A-Z]/g;

                function de(e, t, n) {
                    var r;
                    if (void 0 === n && 1 === e.nodeType)
                        if (r = "data-" + t.replace(le, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(r))) {
                            try {
                                n = function (e) {
                                    return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : ue.test(e) ? JSON.parse(e) : e)
                                }(n)
                            } catch (e) { }
                            ce.set(e, t, n)
                        } else n = void 0;
                    return n
                }
                E.extend({
                    hasData: function (e) {
                        return ce.hasData(e) || se.hasData(e)
                    },
                    data: function (e, t, n) {
                        return ce.access(e, t, n)
                    },
                    removeData: function (e, t) {
                        ce.remove(e, t)
                    },
                    _data: function (e, t, n) {
                        return se.access(e, t, n)
                    },
                    _removeData: function (e, t) {
                        se.remove(e, t)
                    }
                }), E.fn.extend({
                    data: function (e, t) {
                        var n, r, i, o = this[0],
                            a = o && o.attributes;
                        if (void 0 === e) {
                            if (this.length && (i = ce.get(o), 1 === o.nodeType && !se.get(o, "hasDataAttrs"))) {
                                for (n = a.length; n--;) a[n] && 0 === (r = a[n].name).indexOf("data-") && (r = ie(r.slice(5)), de(o, r, i[r]));
                                se.set(o, "hasDataAttrs", !0)
                            }
                            return i
                        }
                        return "object" == typeof e ? this.each((function () {
                            ce.set(this, e)
                        })) : ee(this, (function (t) {
                            var n;
                            if (o && void 0 === t) return void 0 !== (n = ce.get(o, e)) || void 0 !== (n = de(o, e)) ? n : void 0;
                            this.each((function () {
                                ce.set(this, e, t)
                            }))
                        }), null, t, arguments.length > 1, null, !0)
                    },
                    removeData: function (e) {
                        return this.each((function () {
                            ce.remove(this, e)
                        }))
                    }
                }), E.extend({
                    queue: function (e, t, n) {
                        var r;
                        if (e) return t = (t || "fx") + "queue", r = se.get(e, t), n && (!r || Array.isArray(n) ? r = se.access(e, t, E.makeArray(n)) : r.push(n)), r || []
                    },
                    dequeue: function (e, t) {
                        t = t || "fx";
                        var n = E.queue(e, t),
                            r = n.length,
                            i = n.shift(),
                            o = E._queueHooks(e, t);
                        "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, (function () {
                            E.dequeue(e, t)
                        }), o)), !r && o && o.empty.fire()
                    },
                    _queueHooks: function (e, t) {
                        var n = t + "queueHooks";
                        return se.get(e, n) || se.access(e, n, {
                            empty: E.Callbacks("once memory").add((function () {
                                se.remove(e, [t + "queue", n])
                            }))
                        })
                    }
                }), E.fn.extend({
                    queue: function (e, t) {
                        var n = 2;
                        return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? E.queue(this[0], e) : void 0 === t ? this : this.each((function () {
                            var n = E.queue(this, e, t);
                            E._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && E.dequeue(this, e)
                        }))
                    },
                    dequeue: function (e) {
                        return this.each((function () {
                            E.dequeue(this, e)
                        }))
                    },
                    clearQueue: function (e) {
                        return this.queue(e || "fx", [])
                    },
                    promise: function (e, t) {
                        var n, r = 1,
                            i = E.Deferred(),
                            o = this,
                            a = this.length,
                            s = function () {
                                --r || i.resolveWith(o, [o])
                            };
                        for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = se.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
                        return s(), i.promise(t)
                    }
                });
                var fe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                    pe = new RegExp("^(?:([+-])=|)(" + fe + ")([a-z%]*)$", "i"),
                    he = ["Top", "Right", "Bottom", "Left"],
                    ge = b.documentElement,
                    me = function (e) {
                        return E.contains(e.ownerDocument, e)
                    },
                    ve = {
                        composed: !0
                    };
                ge.getRootNode && (me = function (e) {
                    return E.contains(e.ownerDocument, e) || e.getRootNode(ve) === e.ownerDocument
                });
                var ye = function (e, t) {
                    return "none" === (e = t || e).style.display || "" === e.style.display && me(e) && "none" === E.css(e, "display")
                };

                function be(e, t, n, r) {
                    var i, o, a = 20,
                        s = r ? function () {
                            return r.cur()
                        } : function () {
                            return E.css(e, t, "")
                        },
                        c = s(),
                        u = n && n[3] || (E.cssNumber[t] ? "" : "px"),
                        l = e.nodeType && (E.cssNumber[t] || "px" !== u && +c) && pe.exec(E.css(e, t));
                    if (l && l[3] !== u) {
                        for (c /= 2, u = u || l[3], l = +c || 1; a--;) E.style(e, t, l + u), (1 - o) * (1 - (o = s() / c || .5)) <= 0 && (a = 0), l /= o;
                        l *= 2, E.style(e, t, l + u), n = n || []
                    }
                    return n && (l = +l || +c || 0, i = n[1] ? l + (n[1] + 1) * n[2] : +n[2], r && (r.unit = u, r.start = l, r.end = i)), i
                }
                var we = {};

                function xe(e) {
                    var t, n = e.ownerDocument,
                        r = e.nodeName,
                        i = we[r];
                    return i || (t = n.body.appendChild(n.createElement(r)), i = E.css(t, "display"), t.parentNode.removeChild(t), "none" === i && (i = "block"), we[r] = i, i)
                }

                function ke(e, t) {
                    for (var n, r, i = [], o = 0, a = e.length; o < a; o++)(r = e[o]).style && (n = r.style.display, t ? ("none" === n && (i[o] = se.get(r, "display") || null, i[o] || (r.style.display = "")), "" === r.style.display && ye(r) && (i[o] = xe(r))) : "none" !== n && (i[o] = "none", se.set(r, "display", n)));
                    for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
                    return e
                }
                E.fn.extend({
                    show: function () {
                        return ke(this, !0)
                    },
                    hide: function () {
                        return ke(this)
                    },
                    toggle: function (e) {
                        return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function () {
                            ye(this) ? E(this).show() : E(this).hide()
                        }))
                    }
                });
                var Te, Ce, Ee = /^(?:checkbox|radio)$/i,
                    Se = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
                    Ae = /^$|^module$|\/(?:java|ecma)script/i;
                Te = b.createDocumentFragment().appendChild(b.createElement("div")), (Ce = b.createElement("input")).setAttribute("type", "radio"), Ce.setAttribute("checked", "checked"), Ce.setAttribute("name", "t"), Te.appendChild(Ce), m.checkClone = Te.cloneNode(!0).cloneNode(!0).lastChild.checked, Te.innerHTML = "<textarea>x</textarea>", m.noCloneChecked = !!Te.cloneNode(!0).lastChild.defaultValue, Te.innerHTML = "<option></option>", m.option = !!Te.lastChild;
                var _e = {
                    thead: [1, "<table>", "</table>"],
                    col: [2, "<table><colgroup>", "</colgroup></table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: [0, "", ""]
                };

                function je(e, t) {
                    var n;
                    return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && A(e, t) ? E.merge([e], n) : n
                }

                function De(e, t) {
                    for (var n = 0, r = e.length; n < r; n++) se.set(e[n], "globalEval", !t || se.get(t[n], "globalEval"))
                }
                _e.tbody = _e.tfoot = _e.colgroup = _e.caption = _e.thead, _e.th = _e.td, m.option || (_e.optgroup = _e.option = [1, "<select multiple='multiple'>", "</select>"]);
                var Oe = /<|&#?\w+;/;

                function Ne(e, t, n, r, i) {
                    for (var o, a, s, c, u, l, d = t.createDocumentFragment(), f = [], p = 0, h = e.length; p < h; p++)
                        if ((o = e[p]) || 0 === o)
                            if ("object" === k(o)) E.merge(f, o.nodeType ? [o] : o);
                            else if (Oe.test(o)) {
                                for (a = a || d.appendChild(t.createElement("div")), s = (Se.exec(o) || ["", ""])[1].toLowerCase(), c = _e[s] || _e._default, a.innerHTML = c[1] + E.htmlPrefilter(o) + c[2], l = c[0]; l--;) a = a.lastChild;
                                E.merge(f, a.childNodes), (a = d.firstChild).textContent = ""
                            } else f.push(t.createTextNode(o));
                    for (d.textContent = "", p = 0; o = f[p++];)
                        if (r && E.inArray(o, r) > -1) i && i.push(o);
                        else if (u = me(o), a = je(d.appendChild(o), "script"), u && De(a), n)
                            for (l = 0; o = a[l++];) Ae.test(o.type || "") && n.push(o);
                    return d
                }
                var qe = /^([^.]*)(?:\.(.+)|)/;

                function Le() {
                    return !0
                }

                function Pe() {
                    return !1
                }

                function Re(e, t, n, r, i, o) {
                    var a, s;
                    if ("object" == typeof t) {
                        for (s in "string" != typeof n && (r = r || n, n = void 0), t) Re(e, s, n, r, t[s], o);
                        return e
                    }
                    if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = Pe;
                    else if (!i) return e;
                    return 1 === o && (a = i, i = function (e) {
                        return E().off(e), a.apply(this, arguments)
                    }, i.guid = a.guid || (a.guid = E.guid++)), e.each((function () {
                        E.event.add(this, t, i, r, n)
                    }))
                }

                function Ie(e, t, n) {
                    n ? (se.set(e, t, !1), E.event.add(e, t, {
                        namespace: !1,
                        handler: function (e) {
                            var n, r = se.get(this, t);
                            if (1 & e.isTrigger && this[t]) {
                                if (r) (E.event.special[t] || {}).delegateType && e.stopPropagation();
                                else if (r = s.call(arguments), se.set(this, t, r), this[t](), n = se.get(this, t), se.set(this, t, !1), r !== n) return e.stopImmediatePropagation(), e.preventDefault(), n
                            } else r && (se.set(this, t, E.event.trigger(r[0], r.slice(1), this)), e.stopPropagation(), e.isImmediatePropagationStopped = Le)
                        }
                    })) : void 0 === se.get(e, t) && E.event.add(e, t, Le)
                }
                E.event = {
                    global: {},
                    add: function (e, t, n, r, i) {
                        var o, a, s, c, u, l, d, f, p, h, g, m = se.get(e);
                        if (oe(e))
                            for (n.handler && (n = (o = n).handler, i = o.selector), i && E.find.matchesSelector(ge, i), n.guid || (n.guid = E.guid++), (c = m.events) || (c = m.events = Object.create(null)), (a = m.handle) || (a = m.handle = function (t) {
                                return void 0 !== E && E.event.triggered !== t.type ? E.event.dispatch.apply(e, arguments) : void 0
                            }), u = (t = (t || "").match(X) || [""]).length; u--;) p = g = (s = qe.exec(t[u]) || [])[1], h = (s[2] || "").split(".").sort(), p && (d = E.event.special[p] || {}, p = (i ? d.delegateType : d.bindType) || p, d = E.event.special[p] || {}, l = E.extend({
                                type: p,
                                origType: g,
                                data: r,
                                handler: n,
                                guid: n.guid,
                                selector: i,
                                needsContext: i && E.expr.match.needsContext.test(i),
                                namespace: h.join(".")
                            }, o), (f = c[p]) || ((f = c[p] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, r, h, a) || e.addEventListener && e.addEventListener(p, a)), d.add && (d.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)), i ? f.splice(f.delegateCount++, 0, l) : f.push(l), E.event.global[p] = !0)
                    },
                    remove: function (e, t, n, r, i) {
                        var o, a, s, c, u, l, d, f, p, h, g, m = se.hasData(e) && se.get(e);
                        if (m && (c = m.events)) {
                            for (u = (t = (t || "").match(X) || [""]).length; u--;)
                                if (p = g = (s = qe.exec(t[u]) || [])[1], h = (s[2] || "").split(".").sort(), p) {
                                    for (d = E.event.special[p] || {}, f = c[p = (r ? d.delegateType : d.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = f.length; o--;) l = f[o], !i && g !== l.origType || n && n.guid !== l.guid || s && !s.test(l.namespace) || r && r !== l.selector && ("**" !== r || !l.selector) || (f.splice(o, 1), l.selector && f.delegateCount--, d.remove && d.remove.call(e, l));
                                    a && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, m.handle) || E.removeEvent(e, p, m.handle), delete c[p])
                                } else
                                    for (p in c) E.event.remove(e, p + t[u], n, r, !0);
                            E.isEmptyObject(c) && se.remove(e, "handle events")
                        }
                    },
                    dispatch: function (e) {
                        var t, n, r, i, o, a, s = new Array(arguments.length),
                            c = E.event.fix(e),
                            u = (se.get(this, "events") || Object.create(null))[c.type] || [],
                            l = E.event.special[c.type] || {};
                        for (s[0] = c, t = 1; t < arguments.length; t++) s[t] = arguments[t];
                        if (c.delegateTarget = this, !l.preDispatch || !1 !== l.preDispatch.call(this, c)) {
                            for (a = E.event.handlers.call(this, c, u), t = 0;
                                (i = a[t++]) && !c.isPropagationStopped();)
                                for (c.currentTarget = i.elem, n = 0;
                                    (o = i.handlers[n++]) && !c.isImmediatePropagationStopped();) c.rnamespace && !1 !== o.namespace && !c.rnamespace.test(o.namespace) || (c.handleObj = o, c.data = o.data, void 0 !== (r = ((E.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (c.result = r) && (c.preventDefault(), c.stopPropagation()));
                            return l.postDispatch && l.postDispatch.call(this, c), c.result
                        }
                    },
                    handlers: function (e, t) {
                        var n, r, i, o, a, s = [],
                            c = t.delegateCount,
                            u = e.target;
                        if (c && u.nodeType && !("click" === e.type && e.button >= 1))
                            for (; u !== this; u = u.parentNode || this)
                                if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                                    for (o = [], a = {}, n = 0; n < c; n++) void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? E(i, this).index(u) > -1 : E.find(i, this, null, [u]).length), a[i] && o.push(r);
                                    o.length && s.push({
                                        elem: u,
                                        handlers: o
                                    })
                                }
                        return u = this, c < t.length && s.push({
                            elem: u,
                            handlers: t.slice(c)
                        }), s
                    },
                    addProp: function (e, t) {
                        Object.defineProperty(E.Event.prototype, e, {
                            enumerable: !0,
                            configurable: !0,
                            get: v(t) ? function () {
                                if (this.originalEvent) return t(this.originalEvent)
                            } : function () {
                                if (this.originalEvent) return this.originalEvent[e]
                            },
                            set: function (t) {
                                Object.defineProperty(this, e, {
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0,
                                    value: t
                                })
                            }
                        })
                    },
                    fix: function (e) {
                        return e[E.expando] ? e : new E.Event(e)
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        click: {
                            setup: function (e) {
                                var t = this || e;
                                return Ee.test(t.type) && t.click && A(t, "input") && Ie(t, "click", !0), !1
                            },
                            trigger: function (e) {
                                var t = this || e;
                                return Ee.test(t.type) && t.click && A(t, "input") && Ie(t, "click"), !0
                            },
                            _default: function (e) {
                                var t = e.target;
                                return Ee.test(t.type) && t.click && A(t, "input") && se.get(t, "click") || A(t, "a")
                            }
                        },
                        beforeunload: {
                            postDispatch: function (e) {
                                void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                            }
                        }
                    }
                }, E.removeEvent = function (e, t, n) {
                    e.removeEventListener && e.removeEventListener(t, n)
                }, E.Event = function (e, t) {
                    if (!(this instanceof E.Event)) return new E.Event(e, t);
                    e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? Le : Pe, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && E.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[E.expando] = !0
                }, E.Event.prototype = {
                    constructor: E.Event,
                    isDefaultPrevented: Pe,
                    isPropagationStopped: Pe,
                    isImmediatePropagationStopped: Pe,
                    isSimulated: !1,
                    preventDefault: function () {
                        var e = this.originalEvent;
                        this.isDefaultPrevented = Le, e && !this.isSimulated && e.preventDefault()
                    },
                    stopPropagation: function () {
                        var e = this.originalEvent;
                        this.isPropagationStopped = Le, e && !this.isSimulated && e.stopPropagation()
                    },
                    stopImmediatePropagation: function () {
                        var e = this.originalEvent;
                        this.isImmediatePropagationStopped = Le, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
                    }
                }, E.each({
                    altKey: !0,
                    bubbles: !0,
                    cancelable: !0,
                    changedTouches: !0,
                    ctrlKey: !0,
                    detail: !0,
                    eventPhase: !0,
                    metaKey: !0,
                    pageX: !0,
                    pageY: !0,
                    shiftKey: !0,
                    view: !0,
                    char: !0,
                    code: !0,
                    charCode: !0,
                    key: !0,
                    keyCode: !0,
                    button: !0,
                    buttons: !0,
                    clientX: !0,
                    clientY: !0,
                    offsetX: !0,
                    offsetY: !0,
                    pointerId: !0,
                    pointerType: !0,
                    screenX: !0,
                    screenY: !0,
                    targetTouches: !0,
                    toElement: !0,
                    touches: !0,
                    which: !0
                }, E.event.addProp), E.each({
                    focus: "focusin",
                    blur: "focusout"
                }, (function (e, t) {
                    function n(e) {
                        if (b.documentMode) {
                            var n = se.get(this, "handle"),
                                r = E.event.fix(e);
                            r.type = "focusin" === e.type ? "focus" : "blur", r.isSimulated = !0, n(e), r.target === r.currentTarget && n(r)
                        } else E.event.simulate(t, e.target, E.event.fix(e))
                    }
                    E.event.special[e] = {
                        setup: function () {
                            var r;
                            if (Ie(this, e, !0), !b.documentMode) return !1;
                            (r = se.get(this, t)) || this.addEventListener(t, n), se.set(this, t, (r || 0) + 1)
                        },
                        trigger: function () {
                            return Ie(this, e), !0
                        },
                        teardown: function () {
                            var e;
                            if (!b.documentMode) return !1;
                            (e = se.get(this, t) - 1) ? se.set(this, t, e) : (this.removeEventListener(t, n), se.remove(this, t))
                        },
                        _default: function (t) {
                            return se.get(t.target, e)
                        },
                        delegateType: t
                    }, E.event.special[t] = {
                        setup: function () {
                            var r = this.ownerDocument || this.document || this,
                                i = b.documentMode ? this : r,
                                o = se.get(i, t);
                            o || (b.documentMode ? this.addEventListener(t, n) : r.addEventListener(e, n, !0)), se.set(i, t, (o || 0) + 1)
                        },
                        teardown: function () {
                            var r = this.ownerDocument || this.document || this,
                                i = b.documentMode ? this : r,
                                o = se.get(i, t) - 1;
                            o ? se.set(i, t, o) : (b.documentMode ? this.removeEventListener(t, n) : r.removeEventListener(e, n, !0), se.remove(i, t))
                        }
                    }
                })), E.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, (function (e, t) {
                    E.event.special[e] = {
                        delegateType: t,
                        bindType: t,
                        handle: function (e) {
                            var n, r = e.relatedTarget,
                                i = e.handleObj;
                            return r && (r === this || E.contains(this, r)) || (e.type = i.origType, n = i.handler.apply(this, arguments), e.type = t), n
                        }
                    }
                })), E.fn.extend({
                    on: function (e, t, n, r) {
                        return Re(this, e, t, n, r)
                    },
                    one: function (e, t, n, r) {
                        return Re(this, e, t, n, r, 1)
                    },
                    off: function (e, t, n) {
                        var r, i;
                        if (e && e.preventDefault && e.handleObj) return r = e.handleObj, E(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                        if ("object" == typeof e) {
                            for (i in e) this.off(i, t, e[i]);
                            return this
                        }
                        return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Pe), this.each((function () {
                            E.event.remove(this, e, n, t)
                        }))
                    }
                });
                var Me = /<script|<style|<link/i,
                    He = /checked\s*(?:[^=]|=\s*.checked.)/i,
                    Fe = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

                function $e(e, t) {
                    return A(e, "table") && A(11 !== t.nodeType ? t : t.firstChild, "tr") && E(e).children("tbody")[0] || e
                }

                function Be(e) {
                    return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
                }

                function Ue(e) {
                    return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
                }

                function We(e, t) {
                    var n, r, i, o, a, s;
                    if (1 === t.nodeType) {
                        if (se.hasData(e) && (s = se.get(e).events))
                            for (i in se.remove(t, "handle events"), s)
                                for (n = 0, r = s[i].length; n < r; n++) E.event.add(t, i, s[i][n]);
                        ce.hasData(e) && (o = ce.access(e), a = E.extend({}, o), ce.set(t, a))
                    }
                }

                function ze(e, t) {
                    var n = t.nodeName.toLowerCase();
                    "input" === n && Ee.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
                }

                function Ve(e, t, n, r) {
                    t = c(t);
                    var i, o, a, s, u, l, d = 0,
                        f = e.length,
                        p = f - 1,
                        h = t[0],
                        g = v(h);
                    if (g || f > 1 && "string" == typeof h && !m.checkClone && He.test(h)) return e.each((function (i) {
                        var o = e.eq(i);
                        g && (t[0] = h.call(this, i, o.html())), Ve(o, t, n, r)
                    }));
                    if (f && (o = (i = Ne(t, e[0].ownerDocument, !1, e, r)).firstChild, 1 === i.childNodes.length && (i = o), o || r)) {
                        for (s = (a = E.map(je(i, "script"), Be)).length; d < f; d++) u = i, d !== p && (u = E.clone(u, !0, !0), s && E.merge(a, je(u, "script"))), n.call(e[d], u, d);
                        if (s)
                            for (l = a[a.length - 1].ownerDocument, E.map(a, Ue), d = 0; d < s; d++) u = a[d], Ae.test(u.type || "") && !se.access(u, "globalEval") && E.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? E._evalUrl && !u.noModule && E._evalUrl(u.src, {
                                nonce: u.nonce || u.getAttribute("nonce")
                            }, l) : x(u.textContent.replace(Fe, ""), u, l))
                    }
                    return e
                }

                function Xe(e, t, n) {
                    for (var r, i = t ? E.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || E.cleanData(je(r)), r.parentNode && (n && me(r) && De(je(r, "script")), r.parentNode.removeChild(r));
                    return e
                }
                E.extend({
                    htmlPrefilter: function (e) {
                        return e
                    },
                    clone: function (e, t, n) {
                        var r, i, o, a, s = e.cloneNode(!0),
                            c = me(e);
                        if (!(m.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || E.isXMLDoc(e)))
                            for (a = je(s), r = 0, i = (o = je(e)).length; r < i; r++) ze(o[r], a[r]);
                        if (t)
                            if (n)
                                for (o = o || je(e), a = a || je(s), r = 0, i = o.length; r < i; r++) We(o[r], a[r]);
                            else We(e, s);
                        return (a = je(s, "script")).length > 0 && De(a, !c && je(e, "script")), s
                    },
                    cleanData: function (e) {
                        for (var t, n, r, i = E.event.special, o = 0; void 0 !== (n = e[o]); o++)
                            if (oe(n)) {
                                if (t = n[se.expando]) {
                                    if (t.events)
                                        for (r in t.events) i[r] ? E.event.remove(n, r) : E.removeEvent(n, r, t.handle);
                                    n[se.expando] = void 0
                                }
                                n[ce.expando] && (n[ce.expando] = void 0)
                            }
                    }
                }), E.fn.extend({
                    detach: function (e) {
                        return Xe(this, e, !0)
                    },
                    remove: function (e) {
                        return Xe(this, e)
                    },
                    text: function (e) {
                        return ee(this, (function (e) {
                            return void 0 === e ? E.text(this) : this.empty().each((function () {
                                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                            }))
                        }), null, e, arguments.length)
                    },
                    append: function () {
                        return Ve(this, arguments, (function (e) {
                            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || $e(this, e).appendChild(e)
                        }))
                    },
                    prepend: function () {
                        return Ve(this, arguments, (function (e) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var t = $e(this, e);
                                t.insertBefore(e, t.firstChild)
                            }
                        }))
                    },
                    before: function () {
                        return Ve(this, arguments, (function (e) {
                            this.parentNode && this.parentNode.insertBefore(e, this)
                        }))
                    },
                    after: function () {
                        return Ve(this, arguments, (function (e) {
                            this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                        }))
                    },
                    empty: function () {
                        for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (E.cleanData(je(e, !1)), e.textContent = "");
                        return this
                    },
                    clone: function (e, t) {
                        return e = null != e && e, t = null == t ? e : t, this.map((function () {
                            return E.clone(this, e, t)
                        }))
                    },
                    html: function (e) {
                        return ee(this, (function (e) {
                            var t = this[0] || {},
                                n = 0,
                                r = this.length;
                            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                            if ("string" == typeof e && !Me.test(e) && !_e[(Se.exec(e) || ["", ""])[1].toLowerCase()]) {
                                e = E.htmlPrefilter(e);
                                try {
                                    for (; n < r; n++) 1 === (t = this[n] || {}).nodeType && (E.cleanData(je(t, !1)), t.innerHTML = e);
                                    t = 0
                                } catch (e) { }
                            }
                            t && this.empty().append(e)
                        }), null, e, arguments.length)
                    },
                    replaceWith: function () {
                        var e = [];
                        return Ve(this, arguments, (function (t) {
                            var n = this.parentNode;
                            E.inArray(this, e) < 0 && (E.cleanData(je(this)), n && n.replaceChild(t, this))
                        }), e)
                    }
                }), E.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, (function (e, t) {
                    E.fn[e] = function (e) {
                        for (var n, r = [], i = E(e), o = i.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), E(i[a])[t](n), u.apply(r, n.get());
                        return this.pushStack(r)
                    }
                }));
                var Ge = new RegExp("^(" + fe + ")(?!px)[a-z%]+$", "i"),
                    Ye = /^--/,
                    Ke = function (e) {
                        var t = e.ownerDocument.defaultView;
                        return t && t.opener || (t = r), t.getComputedStyle(e)
                    },
                    Qe = function (e, t, n) {
                        var r, i, o = {};
                        for (i in t) o[i] = e.style[i], e.style[i] = t[i];
                        for (i in r = n.call(e), t) e.style[i] = o[i];
                        return r
                    },
                    Je = new RegExp(he.join("|"), "i");

                function Ze(e, t, n) {
                    var r, i, o, a, s = Ye.test(t),
                        c = e.style;
                    return (n = n || Ke(e)) && (a = n.getPropertyValue(t) || n[t], s && a && (a = a.replace(N, "$1") || void 0), "" !== a || me(e) || (a = E.style(e, t)), !m.pixelBoxStyles() && Ge.test(a) && Je.test(t) && (r = c.width, i = c.minWidth, o = c.maxWidth, c.minWidth = c.maxWidth = c.width = a, a = n.width, c.width = r, c.minWidth = i, c.maxWidth = o)), void 0 !== a ? a + "" : a
                }

                function et(e, t) {
                    return {
                        get: function () {
                            if (!e()) return (this.get = t).apply(this, arguments);
                            delete this.get
                        }
                    }
                } ! function () {
                    function e() {
                        if (l) {
                            u.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", ge.appendChild(u).appendChild(l);
                            var e = r.getComputedStyle(l);
                            n = "1%" !== e.top, c = 12 === t(e.marginLeft), l.style.right = "60%", a = 36 === t(e.right), i = 36 === t(e.width), l.style.position = "absolute", o = 12 === t(l.offsetWidth / 3), ge.removeChild(u), l = null
                        }
                    }

                    function t(e) {
                        return Math.round(parseFloat(e))
                    }
                    var n, i, o, a, s, c, u = b.createElement("div"),
                        l = b.createElement("div");
                    l.style && (l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", m.clearCloneStyle = "content-box" === l.style.backgroundClip, E.extend(m, {
                        boxSizingReliable: function () {
                            return e(), i
                        },
                        pixelBoxStyles: function () {
                            return e(), a
                        },
                        pixelPosition: function () {
                            return e(), n
                        },
                        reliableMarginLeft: function () {
                            return e(), c
                        },
                        scrollboxSize: function () {
                            return e(), o
                        },
                        reliableTrDimensions: function () {
                            var e, t, n, i;
                            return null == s && (e = b.createElement("table"), t = b.createElement("tr"), n = b.createElement("div"), e.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", t.style.cssText = "box-sizing:content-box;border:1px solid", t.style.height = "1px", n.style.height = "9px", n.style.display = "block", ge.appendChild(e).appendChild(t).appendChild(n), i = r.getComputedStyle(t), s = parseInt(i.height, 10) + parseInt(i.borderTopWidth, 10) + parseInt(i.borderBottomWidth, 10) === t.offsetHeight, ge.removeChild(e)), s
                        }
                    }))
                }();
                var tt = ["Webkit", "Moz", "ms"],
                    nt = b.createElement("div").style,
                    rt = {};

                function it(e) {
                    var t = E.cssProps[e] || rt[e];
                    return t || (e in nt ? e : rt[e] = function (e) {
                        for (var t = e[0].toUpperCase() + e.slice(1), n = tt.length; n--;)
                            if ((e = tt[n] + t) in nt) return e
                    }(e) || e)
                }
                var ot = /^(none|table(?!-c[ea]).+)/,
                    at = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    st = {
                        letterSpacing: "0",
                        fontWeight: "400"
                    };

                function ct(e, t, n) {
                    var r = pe.exec(t);
                    return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
                }

                function ut(e, t, n, r, i, o) {
                    var a = "width" === t ? 1 : 0,
                        s = 0,
                        c = 0,
                        u = 0;
                    if (n === (r ? "border" : "content")) return 0;
                    for (; a < 4; a += 2) "margin" === n && (u += E.css(e, n + he[a], !0, i)), r ? ("content" === n && (c -= E.css(e, "padding" + he[a], !0, i)), "margin" !== n && (c -= E.css(e, "border" + he[a] + "Width", !0, i))) : (c += E.css(e, "padding" + he[a], !0, i), "padding" !== n ? c += E.css(e, "border" + he[a] + "Width", !0, i) : s += E.css(e, "border" + he[a] + "Width", !0, i));
                    return !r && o >= 0 && (c += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - c - s - .5)) || 0), c + u
                }

                function lt(e, t, n) {
                    var r = Ke(e),
                        i = (!m.boxSizingReliable() || n) && "border-box" === E.css(e, "boxSizing", !1, r),
                        o = i,
                        a = Ze(e, t, r),
                        s = "offset" + t[0].toUpperCase() + t.slice(1);
                    if (Ge.test(a)) {
                        if (!n) return a;
                        a = "auto"
                    }
                    return (!m.boxSizingReliable() && i || !m.reliableTrDimensions() && A(e, "tr") || "auto" === a || !parseFloat(a) && "inline" === E.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === E.css(e, "boxSizing", !1, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + ut(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
                }

                function dt(e, t, n, r, i) {
                    return new dt.prototype.init(e, t, n, r, i)
                }
                E.extend({
                    cssHooks: {
                        opacity: {
                            get: function (e, t) {
                                if (t) {
                                    var n = Ze(e, "opacity");
                                    return "" === n ? "1" : n
                                }
                            }
                        }
                    },
                    cssNumber: {
                        animationIterationCount: !0,
                        aspectRatio: !0,
                        borderImageSlice: !0,
                        columnCount: !0,
                        flexGrow: !0,
                        flexShrink: !0,
                        fontWeight: !0,
                        gridArea: !0,
                        gridColumn: !0,
                        gridColumnEnd: !0,
                        gridColumnStart: !0,
                        gridRow: !0,
                        gridRowEnd: !0,
                        gridRowStart: !0,
                        lineHeight: !0,
                        opacity: !0,
                        order: !0,
                        orphans: !0,
                        scale: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0,
                        fillOpacity: !0,
                        floodOpacity: !0,
                        stopOpacity: !0,
                        strokeMiterlimit: !0,
                        strokeOpacity: !0
                    },
                    cssProps: {},
                    style: function (e, t, n, r) {
                        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                            var i, o, a, s = ie(t),
                                c = Ye.test(t),
                                u = e.style;
                            if (c || (t = it(s)), a = E.cssHooks[t] || E.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : u[t];
                            "string" === (o = typeof n) && (i = pe.exec(n)) && i[1] && (n = be(e, t, i), o = "number"), null != n && n == n && ("number" !== o || c || (n += i && i[3] || (E.cssNumber[s] ? "" : "px")), m.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (c ? u.setProperty(t, n) : u[t] = n))
                        }
                    },
                    css: function (e, t, n, r) {
                        var i, o, a, s = ie(t);
                        return Ye.test(t) || (t = it(s)), (a = E.cssHooks[t] || E.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = Ze(e, t, r)), "normal" === i && t in st && (i = st[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
                    }
                }), E.each(["height", "width"], (function (e, t) {
                    E.cssHooks[t] = {
                        get: function (e, n, r) {
                            if (n) return !ot.test(E.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? lt(e, t, r) : Qe(e, at, (function () {
                                return lt(e, t, r)
                            }))
                        },
                        set: function (e, n, r) {
                            var i, o = Ke(e),
                                a = !m.scrollboxSize() && "absolute" === o.position,
                                s = (a || r) && "border-box" === E.css(e, "boxSizing", !1, o),
                                c = r ? ut(e, t, r, s, o) : 0;
                            return s && a && (c -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - ut(e, t, "border", !1, o) - .5)), c && (i = pe.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n, n = E.css(e, t)), ct(0, n, c)
                        }
                    }
                })), E.cssHooks.marginLeft = et(m.reliableMarginLeft, (function (e, t) {
                    if (t) return (parseFloat(Ze(e, "marginLeft")) || e.getBoundingClientRect().left - Qe(e, {
                        marginLeft: 0
                    }, (function () {
                        return e.getBoundingClientRect().left
                    }))) + "px"
                })), E.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, (function (e, t) {
                    E.cssHooks[e + t] = {
                        expand: function (n) {
                            for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++) i[e + he[r] + t] = o[r] || o[r - 2] || o[0];
                            return i
                        }
                    }, "margin" !== e && (E.cssHooks[e + t].set = ct)
                })), E.fn.extend({
                    css: function (e, t) {
                        return ee(this, (function (e, t, n) {
                            var r, i, o = {},
                                a = 0;
                            if (Array.isArray(t)) {
                                for (r = Ke(e), i = t.length; a < i; a++) o[t[a]] = E.css(e, t[a], !1, r);
                                return o
                            }
                            return void 0 !== n ? E.style(e, t, n) : E.css(e, t)
                        }), e, t, arguments.length > 1)
                    }
                }), E.Tween = dt, dt.prototype = {
                    constructor: dt,
                    init: function (e, t, n, r, i, o) {
                        this.elem = e, this.prop = n, this.easing = i || E.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (E.cssNumber[n] ? "" : "px")
                    },
                    cur: function () {
                        var e = dt.propHooks[this.prop];
                        return e && e.get ? e.get(this) : dt.propHooks._default.get(this)
                    },
                    run: function (e) {
                        var t, n = dt.propHooks[this.prop];
                        return this.options.duration ? this.pos = t = E.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : dt.propHooks._default.set(this), this
                    }
                }, dt.prototype.init.prototype = dt.prototype, dt.propHooks = {
                    _default: {
                        get: function (e) {
                            var t;
                            return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = E.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
                        },
                        set: function (e) {
                            E.fx.step[e.prop] ? E.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !E.cssHooks[e.prop] && null == e.elem.style[it(e.prop)] ? e.elem[e.prop] = e.now : E.style(e.elem, e.prop, e.now + e.unit)
                        }
                    }
                }, dt.propHooks.scrollTop = dt.propHooks.scrollLeft = {
                    set: function (e) {
                        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                    }
                }, E.easing = {
                    linear: function (e) {
                        return e
                    },
                    swing: function (e) {
                        return .5 - Math.cos(e * Math.PI) / 2
                    },
                    _default: "swing"
                }, E.fx = dt.prototype.init, E.fx.step = {};
                var ft, pt, ht = /^(?:toggle|show|hide)$/,
                    gt = /queueHooks$/;

                function mt() {
                    pt && (!1 === b.hidden && r.requestAnimationFrame ? r.requestAnimationFrame(mt) : r.setTimeout(mt, E.fx.interval), E.fx.tick())
                }

                function vt() {
                    return r.setTimeout((function () {
                        ft = void 0
                    })), ft = Date.now()
                }

                function yt(e, t) {
                    var n, r = 0,
                        i = {
                            height: e
                        };
                    for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = he[r])] = i["padding" + n] = e;
                    return t && (i.opacity = i.width = e), i
                }

                function bt(e, t, n) {
                    for (var r, i = (wt.tweeners[t] || []).concat(wt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
                        if (r = i[o].call(n, t, e)) return r
                }

                function wt(e, t, n) {
                    var r, i, o = 0,
                        a = wt.prefilters.length,
                        s = E.Deferred().always((function () {
                            delete c.elem
                        })),
                        c = function () {
                            if (i) return !1;
                            for (var t = ft || vt(), n = Math.max(0, u.startTime + u.duration - t), r = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(r);
                            return s.notifyWith(e, [u, r, n]), r < 1 && a ? n : (a || s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u]), !1)
                        },
                        u = s.promise({
                            elem: e,
                            props: E.extend({}, t),
                            opts: E.extend(!0, {
                                specialEasing: {},
                                easing: E.easing._default
                            }, n),
                            originalProperties: t,
                            originalOptions: n,
                            startTime: ft || vt(),
                            duration: n.duration,
                            tweens: [],
                            createTween: function (t, n) {
                                var r = E.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                                return u.tweens.push(r), r
                            },
                            stop: function (t) {
                                var n = 0,
                                    r = t ? u.tweens.length : 0;
                                if (i) return this;
                                for (i = !0; n < r; n++) u.tweens[n].run(1);
                                return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
                            }
                        }),
                        l = u.props;
                    for (! function (e, t) {
                        var n, r, i, o, a;
                        for (n in e)
                            if (i = t[r = ie(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = E.cssHooks[r]) && "expand" in a)
                                for (n in o = a.expand(o), delete e[r], o) n in e || (e[n] = o[n], t[n] = i);
                            else t[r] = i
                    }(l, u.opts.specialEasing); o < a; o++)
                        if (r = wt.prefilters[o].call(u, e, l, u.opts)) return v(r.stop) && (E._queueHooks(u.elem, u.opts.queue).stop = r.stop.bind(r)), r;
                    return E.map(l, bt, u), v(u.opts.start) && u.opts.start.call(e, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), E.fx.timer(E.extend(c, {
                        elem: e,
                        anim: u,
                        queue: u.opts.queue
                    })), u
                }
                E.Animation = E.extend(wt, {
                    tweeners: {
                        "*": [function (e, t) {
                            var n = this.createTween(e, t);
                            return be(n.elem, e, pe.exec(t), n), n
                        }]
                    },
                    tweener: function (e, t) {
                        v(e) ? (t = e, e = ["*"]) : e = e.match(X);
                        for (var n, r = 0, i = e.length; r < i; r++) n = e[r], wt.tweeners[n] = wt.tweeners[n] || [], wt.tweeners[n].unshift(t)
                    },
                    prefilters: [function (e, t, n) {
                        var r, i, o, a, s, c, u, l, d = "width" in t || "height" in t,
                            f = this,
                            p = {},
                            h = e.style,
                            g = e.nodeType && ye(e),
                            m = se.get(e, "fxshow");
                        for (r in n.queue || (null == (a = E._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
                            a.unqueued || s()
                        }), a.unqueued++, f.always((function () {
                            f.always((function () {
                                a.unqueued--, E.queue(e, "fx").length || a.empty.fire()
                            }))
                        }))), t)
                            if (i = t[r], ht.test(i)) {
                                if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                                    if ("show" !== i || !m || void 0 === m[r]) continue;
                                    g = !0
                                }
                                p[r] = m && m[r] || E.style(e, r)
                            }
                        if ((c = !E.isEmptyObject(t)) || !E.isEmptyObject(p))
                            for (r in d && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (u = m && m.display) && (u = se.get(e, "display")), "none" === (l = E.css(e, "display")) && (u ? l = u : (ke([e], !0), u = e.style.display || u, l = E.css(e, "display"), ke([e]))), ("inline" === l || "inline-block" === l && null != u) && "none" === E.css(e, "float") && (c || (f.done((function () {
                                h.display = u
                            })), null == u && (l = h.display, u = "none" === l ? "" : l)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", f.always((function () {
                                h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                            }))), c = !1, p) c || (m ? "hidden" in m && (g = m.hidden) : m = se.access(e, "fxshow", {
                                display: u
                            }), o && (m.hidden = !g), g && ke([e], !0), f.done((function () {
                                for (r in g || ke([e]), se.remove(e, "fxshow"), p) E.style(e, r, p[r])
                            }))), c = bt(g ? m[r] : 0, r, f), r in m || (m[r] = c.start, g && (c.end = c.start, c.start = 0))
                    }],
                    prefilter: function (e, t) {
                        t ? wt.prefilters.unshift(e) : wt.prefilters.push(e)
                    }
                }), E.speed = function (e, t, n) {
                    var r = e && "object" == typeof e ? E.extend({}, e) : {
                        complete: n || !n && t || v(e) && e,
                        duration: e,
                        easing: n && t || t && !v(t) && t
                    };
                    return E.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in E.fx.speeds ? r.duration = E.fx.speeds[r.duration] : r.duration = E.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function () {
                        v(r.old) && r.old.call(this), r.queue && E.dequeue(this, r.queue)
                    }, r
                }, E.fn.extend({
                    fadeTo: function (e, t, n, r) {
                        return this.filter(ye).css("opacity", 0).show().end().animate({
                            opacity: t
                        }, e, n, r)
                    },
                    animate: function (e, t, n, r) {
                        var i = E.isEmptyObject(e),
                            o = E.speed(t, n, r),
                            a = function () {
                                var t = wt(this, E.extend({}, e), o);
                                (i || se.get(this, "finish")) && t.stop(!0)
                            };
                        return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
                    },
                    stop: function (e, t, n) {
                        var r = function (e) {
                            var t = e.stop;
                            delete e.stop, t(n)
                        };
                        return "string" != typeof e && (n = t, t = e, e = void 0), t && this.queue(e || "fx", []), this.each((function () {
                            var t = !0,
                                i = null != e && e + "queueHooks",
                                o = E.timers,
                                a = se.get(this);
                            if (i) a[i] && a[i].stop && r(a[i]);
                            else
                                for (i in a) a[i] && a[i].stop && gt.test(i) && r(a[i]);
                            for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                            !t && n || E.dequeue(this, e)
                        }))
                    },
                    finish: function (e) {
                        return !1 !== e && (e = e || "fx"), this.each((function () {
                            var t, n = se.get(this),
                                r = n[e + "queue"],
                                i = n[e + "queueHooks"],
                                o = E.timers,
                                a = r ? r.length : 0;
                            for (n.finish = !0, E.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                            for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                            delete n.finish
                        }))
                    }
                }), E.each(["toggle", "show", "hide"], (function (e, t) {
                    var n = E.fn[t];
                    E.fn[t] = function (e, r, i) {
                        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(yt(t, !0), e, r, i)
                    }
                })), E.each({
                    slideDown: yt("show"),
                    slideUp: yt("hide"),
                    slideToggle: yt("toggle"),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, (function (e, t) {
                    E.fn[e] = function (e, n, r) {
                        return this.animate(t, e, n, r)
                    }
                })), E.timers = [], E.fx.tick = function () {
                    var e, t = 0,
                        n = E.timers;
                    for (ft = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
                    n.length || E.fx.stop(), ft = void 0
                }, E.fx.timer = function (e) {
                    E.timers.push(e), E.fx.start()
                }, E.fx.interval = 13, E.fx.start = function () {
                    pt || (pt = !0, mt())
                }, E.fx.stop = function () {
                    pt = null
                }, E.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400
                }, E.fn.delay = function (e, t) {
                    return e = E.fx && E.fx.speeds[e] || e, t = t || "fx", this.queue(t, (function (t, n) {
                        var i = r.setTimeout(t, e);
                        n.stop = function () {
                            r.clearTimeout(i)
                        }
                    }))
                },
                    function () {
                        var e = b.createElement("input"),
                            t = b.createElement("select").appendChild(b.createElement("option"));
                        e.type = "checkbox", m.checkOn = "" !== e.value, m.optSelected = t.selected, (e = b.createElement("input")).value = "t", e.type = "radio", m.radioValue = "t" === e.value
                    }();
                var xt, kt = E.expr.attrHandle;
                E.fn.extend({
                    attr: function (e, t) {
                        return ee(this, E.attr, e, t, arguments.length > 1)
                    },
                    removeAttr: function (e) {
                        return this.each((function () {
                            E.removeAttr(this, e)
                        }))
                    }
                }), E.extend({
                    attr: function (e, t, n) {
                        var r, i, o = e.nodeType;
                        if (3 !== o && 8 !== o && 2 !== o) return void 0 === e.getAttribute ? E.prop(e, t, n) : (1 === o && E.isXMLDoc(e) || (i = E.attrHooks[t.toLowerCase()] || (E.expr.match.bool.test(t) ? xt : void 0)), void 0 !== n ? null === n ? void E.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = E.find.attr(e, t)) ? void 0 : r)
                    },
                    attrHooks: {
                        type: {
                            set: function (e, t) {
                                if (!m.radioValue && "radio" === t && A(e, "input")) {
                                    var n = e.value;
                                    return e.setAttribute("type", t), n && (e.value = n), t
                                }
                            }
                        }
                    },
                    removeAttr: function (e, t) {
                        var n, r = 0,
                            i = t && t.match(X);
                        if (i && 1 === e.nodeType)
                            for (; n = i[r++];) e.removeAttribute(n)
                    }
                }), xt = {
                    set: function (e, t, n) {
                        return !1 === t ? E.removeAttr(e, n) : e.setAttribute(n, n), n
                    }
                }, E.each(E.expr.match.bool.source.match(/\w+/g), (function (e, t) {
                    var n = kt[t] || E.find.attr;
                    kt[t] = function (e, t, r) {
                        var i, o, a = t.toLowerCase();
                        return r || (o = kt[a], kt[a] = i, i = null != n(e, t, r) ? a : null, kt[a] = o), i
                    }
                }));
                var Tt = /^(?:input|select|textarea|button)$/i,
                    Ct = /^(?:a|area)$/i;

                function Et(e) {
                    return (e.match(X) || []).join(" ")
                }

                function St(e) {
                    return e.getAttribute && e.getAttribute("class") || ""
                }

                function At(e) {
                    return Array.isArray(e) ? e : "string" == typeof e && e.match(X) || []
                }
                E.fn.extend({
                    prop: function (e, t) {
                        return ee(this, E.prop, e, t, arguments.length > 1)
                    },
                    removeProp: function (e) {
                        return this.each((function () {
                            delete this[E.propFix[e] || e]
                        }))
                    }
                }), E.extend({
                    prop: function (e, t, n) {
                        var r, i, o = e.nodeType;
                        if (3 !== o && 8 !== o && 2 !== o) return 1 === o && E.isXMLDoc(e) || (t = E.propFix[t] || t, i = E.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
                    },
                    propHooks: {
                        tabIndex: {
                            get: function (e) {
                                var t = E.find.attr(e, "tabindex");
                                return t ? parseInt(t, 10) : Tt.test(e.nodeName) || Ct.test(e.nodeName) && e.href ? 0 : -1
                            }
                        }
                    },
                    propFix: {
                        for: "htmlFor",
                        class: "className"
                    }
                }), m.optSelected || (E.propHooks.selected = {
                    get: function (e) {
                        var t = e.parentNode;
                        return t && t.parentNode && t.parentNode.selectedIndex, null
                    },
                    set: function (e) {
                        var t = e.parentNode;
                        t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
                    }
                }), E.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], (function () {
                    E.propFix[this.toLowerCase()] = this
                })), E.fn.extend({
                    addClass: function (e) {
                        var t, n, r, i, o, a;
                        return v(e) ? this.each((function (t) {
                            E(this).addClass(e.call(this, t, St(this)))
                        })) : (t = At(e)).length ? this.each((function () {
                            if (r = St(this), n = 1 === this.nodeType && " " + Et(r) + " ") {
                                for (o = 0; o < t.length; o++) i = t[o], n.indexOf(" " + i + " ") < 0 && (n += i + " ");
                                a = Et(n), r !== a && this.setAttribute("class", a)
                            }
                        })) : this
                    },
                    removeClass: function (e) {
                        var t, n, r, i, o, a;
                        return v(e) ? this.each((function (t) {
                            E(this).removeClass(e.call(this, t, St(this)))
                        })) : arguments.length ? (t = At(e)).length ? this.each((function () {
                            if (r = St(this), n = 1 === this.nodeType && " " + Et(r) + " ") {
                                for (o = 0; o < t.length; o++)
                                    for (i = t[o]; n.indexOf(" " + i + " ") > -1;) n = n.replace(" " + i + " ", " ");
                                a = Et(n), r !== a && this.setAttribute("class", a)
                            }
                        })) : this : this.attr("class", "")
                    },
                    toggleClass: function (e, t) {
                        var n, r, i, o, a = typeof e,
                            s = "string" === a || Array.isArray(e);
                        return v(e) ? this.each((function (n) {
                            E(this).toggleClass(e.call(this, n, St(this), t), t)
                        })) : "boolean" == typeof t && s ? t ? this.addClass(e) : this.removeClass(e) : (n = At(e), this.each((function () {
                            if (s)
                                for (o = E(this), i = 0; i < n.length; i++) r = n[i], o.hasClass(r) ? o.removeClass(r) : o.addClass(r);
                            else void 0 !== e && "boolean" !== a || ((r = St(this)) && se.set(this, "__className__", r), this.setAttribute && this.setAttribute("class", r || !1 === e ? "" : se.get(this, "__className__") || ""))
                        })))
                    },
                    hasClass: function (e) {
                        var t, n, r = 0;
                        for (t = " " + e + " "; n = this[r++];)
                            if (1 === n.nodeType && (" " + Et(St(n)) + " ").indexOf(t) > -1) return !0;
                        return !1
                    }
                });
                var _t = /\r/g;
                E.fn.extend({
                    val: function (e) {
                        var t, n, r, i = this[0];
                        return arguments.length ? (r = v(e), this.each((function (n) {
                            var i;
                            1 === this.nodeType && (null == (i = r ? e.call(this, n, E(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = E.map(i, (function (e) {
                                return null == e ? "" : e + ""
                            }))), (t = E.valHooks[this.type] || E.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                        }))) : i ? (t = E.valHooks[i.type] || E.valHooks[i.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(_t, "") : null == n ? "" : n : void 0
                    }
                }), E.extend({
                    valHooks: {
                        option: {
                            get: function (e) {
                                var t = E.find.attr(e, "value");
                                return null != t ? t : Et(E.text(e))
                            }
                        },
                        select: {
                            get: function (e) {
                                var t, n, r, i = e.options,
                                    o = e.selectedIndex,
                                    a = "select-one" === e.type,
                                    s = a ? null : [],
                                    c = a ? o + 1 : i.length;
                                for (r = o < 0 ? c : a ? o : 0; r < c; r++)
                                    if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                                        if (t = E(n).val(), a) return t;
                                        s.push(t)
                                    }
                                return s
                            },
                            set: function (e, t) {
                                for (var n, r, i = e.options, o = E.makeArray(t), a = i.length; a--;)((r = i[a]).selected = E.inArray(E.valHooks.option.get(r), o) > -1) && (n = !0);
                                return n || (e.selectedIndex = -1), o
                            }
                        }
                    }
                }), E.each(["radio", "checkbox"], (function () {
                    E.valHooks[this] = {
                        set: function (e, t) {
                            if (Array.isArray(t)) return e.checked = E.inArray(E(e).val(), t) > -1
                        }
                    }, m.checkOn || (E.valHooks[this].get = function (e) {
                        return null === e.getAttribute("value") ? "on" : e.value
                    })
                }));
                var jt = r.location,
                    Dt = {
                        guid: Date.now()
                    },
                    Ot = /\?/;
                E.parseXML = function (e) {
                    var t, n;
                    if (!e || "string" != typeof e) return null;
                    try {
                        t = (new r.DOMParser).parseFromString(e, "text/xml")
                    } catch (e) { }
                    return n = t && t.getElementsByTagName("parsererror")[0], t && !n || E.error("Invalid XML: " + (n ? E.map(n.childNodes, (function (e) {
                        return e.textContent
                    })).join("\n") : e)), t
                };
                var Nt = /^(?:focusinfocus|focusoutblur)$/,
                    qt = function (e) {
                        e.stopPropagation()
                    };
                E.extend(E.event, {
                    trigger: function (e, t, n, i) {
                        var o, a, s, c, u, l, d, f, h = [n || b],
                            g = p.call(e, "type") ? e.type : e,
                            m = p.call(e, "namespace") ? e.namespace.split(".") : [];
                        if (a = f = s = n = n || b, 3 !== n.nodeType && 8 !== n.nodeType && !Nt.test(g + E.event.triggered) && (g.indexOf(".") > -1 && (m = g.split("."), g = m.shift(), m.sort()), u = g.indexOf(":") < 0 && "on" + g, (e = e[E.expando] ? e : new E.Event(g, "object" == typeof e && e)).isTrigger = i ? 2 : 3, e.namespace = m.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : E.makeArray(t, [e]), d = E.event.special[g] || {}, i || !d.trigger || !1 !== d.trigger.apply(n, t))) {
                            if (!i && !d.noBubble && !y(n)) {
                                for (c = d.delegateType || g, Nt.test(c + g) || (a = a.parentNode); a; a = a.parentNode) h.push(a), s = a;
                                s === (n.ownerDocument || b) && h.push(s.defaultView || s.parentWindow || r)
                            }
                            for (o = 0;
                                (a = h[o++]) && !e.isPropagationStopped();) f = a, e.type = o > 1 ? c : d.bindType || g, (l = (se.get(a, "events") || Object.create(null))[e.type] && se.get(a, "handle")) && l.apply(a, t), (l = u && a[u]) && l.apply && oe(a) && (e.result = l.apply(a, t), !1 === e.result && e.preventDefault());
                            return e.type = g, i || e.isDefaultPrevented() || d._default && !1 !== d._default.apply(h.pop(), t) || !oe(n) || u && v(n[g]) && !y(n) && ((s = n[u]) && (n[u] = null), E.event.triggered = g, e.isPropagationStopped() && f.addEventListener(g, qt), n[g](), e.isPropagationStopped() && f.removeEventListener(g, qt), E.event.triggered = void 0, s && (n[u] = s)), e.result
                        }
                    },
                    simulate: function (e, t, n) {
                        var r = E.extend(new E.Event, n, {
                            type: e,
                            isSimulated: !0
                        });
                        E.event.trigger(r, null, t)
                    }
                }), E.fn.extend({
                    trigger: function (e, t) {
                        return this.each((function () {
                            E.event.trigger(e, t, this)
                        }))
                    },
                    triggerHandler: function (e, t) {
                        var n = this[0];
                        if (n) return E.event.trigger(e, t, n, !0)
                    }
                });
                var Lt = /\[\]$/,
                    Pt = /\r?\n/g,
                    Rt = /^(?:submit|button|image|reset|file)$/i,
                    It = /^(?:input|select|textarea|keygen)/i;

                function Mt(e, t, n, r) {
                    var i;
                    if (Array.isArray(t)) E.each(t, (function (t, i) {
                        n || Lt.test(e) ? r(e, i) : Mt(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
                    }));
                    else if (n || "object" !== k(t)) r(e, t);
                    else
                        for (i in t) Mt(e + "[" + i + "]", t[i], n, r)
                }
                E.param = function (e, t) {
                    var n, r = [],
                        i = function (e, t) {
                            var n = v(t) ? t() : t;
                            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
                        };
                    if (null == e) return "";
                    if (Array.isArray(e) || e.jquery && !E.isPlainObject(e)) E.each(e, (function () {
                        i(this.name, this.value)
                    }));
                    else
                        for (n in e) Mt(n, e[n], t, i);
                    return r.join("&")
                }, E.fn.extend({
                    serialize: function () {
                        return E.param(this.serializeArray())
                    },
                    serializeArray: function () {
                        return this.map((function () {
                            var e = E.prop(this, "elements");
                            return e ? E.makeArray(e) : this
                        })).filter((function () {
                            var e = this.type;
                            return this.name && !E(this).is(":disabled") && It.test(this.nodeName) && !Rt.test(e) && (this.checked || !Ee.test(e))
                        })).map((function (e, t) {
                            var n = E(this).val();
                            return null == n ? null : Array.isArray(n) ? E.map(n, (function (e) {
                                return {
                                    name: t.name,
                                    value: e.replace(Pt, "\r\n")
                                }
                            })) : {
                                name: t.name,
                                value: n.replace(Pt, "\r\n")
                            }
                        })).get()
                    }
                });
                var Ht = /%20/g,
                    Ft = /#.*$/,
                    $t = /([?&])_=[^&]*/,
                    Bt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
                    Ut = /^(?:GET|HEAD)$/,
                    Wt = /^\/\//,
                    zt = {},
                    Vt = {},
                    Xt = "*/".concat("*"),
                    Gt = b.createElement("a");

                function Yt(e) {
                    return function (t, n) {
                        "string" != typeof t && (n = t, t = "*");
                        var r, i = 0,
                            o = t.toLowerCase().match(X) || [];
                        if (v(n))
                            for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                    }
                }

                function Kt(e, t, n, r) {
                    var i = {},
                        o = e === Vt;

                    function a(s) {
                        var c;
                        return i[s] = !0, E.each(e[s] || [], (function (e, s) {
                            var u = s(t, n, r);
                            return "string" != typeof u || o || i[u] ? o ? !(c = u) : void 0 : (t.dataTypes.unshift(u), a(u), !1)
                        })), c
                    }
                    return a(t.dataTypes[0]) || !i["*"] && a("*")
                }

                function Qt(e, t) {
                    var n, r, i = E.ajaxSettings.flatOptions || {};
                    for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
                    return r && E.extend(!0, e, r), e
                }
                Gt.href = jt.href, E.extend({
                    active: 0,
                    lastModified: {},
                    etag: {},
                    ajaxSettings: {
                        url: jt.href,
                        type: "GET",
                        isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(jt.protocol),
                        global: !0,
                        processData: !0,
                        async: !0,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        accepts: {
                            "*": Xt,
                            text: "text/plain",
                            html: "text/html",
                            xml: "application/xml, text/xml",
                            json: "application/json, text/javascript"
                        },
                        contents: {
                            xml: /\bxml\b/,
                            html: /\bhtml/,
                            json: /\bjson\b/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText",
                            json: "responseJSON"
                        },
                        converters: {
                            "* text": String,
                            "text html": !0,
                            "text json": JSON.parse,
                            "text xml": E.parseXML
                        },
                        flatOptions: {
                            url: !0,
                            context: !0
                        }
                    },
                    ajaxSetup: function (e, t) {
                        return t ? Qt(Qt(e, E.ajaxSettings), t) : Qt(E.ajaxSettings, e)
                    },
                    ajaxPrefilter: Yt(zt),
                    ajaxTransport: Yt(Vt),
                    ajax: function (e, t) {
                        "object" == typeof e && (t = e, e = void 0), t = t || {};
                        var n, i, o, a, s, c, u, l, d, f, p = E.ajaxSetup({}, t),
                            h = p.context || p,
                            g = p.context && (h.nodeType || h.jquery) ? E(h) : E.event,
                            m = E.Deferred(),
                            v = E.Callbacks("once memory"),
                            y = p.statusCode || {},
                            w = {},
                            x = {},
                            k = "canceled",
                            T = {
                                readyState: 0,
                                getResponseHeader: function (e) {
                                    var t;
                                    if (u) {
                                        if (!a)
                                            for (a = {}; t = Bt.exec(o);) a[t[1].toLowerCase() + " "] = (a[t[1].toLowerCase() + " "] || []).concat(t[2]);
                                        t = a[e.toLowerCase() + " "]
                                    }
                                    return null == t ? null : t.join(", ")
                                },
                                getAllResponseHeaders: function () {
                                    return u ? o : null
                                },
                                setRequestHeader: function (e, t) {
                                    return null == u && (e = x[e.toLowerCase()] = x[e.toLowerCase()] || e, w[e] = t), this
                                },
                                overrideMimeType: function (e) {
                                    return null == u && (p.mimeType = e), this
                                },
                                statusCode: function (e) {
                                    var t;
                                    if (e)
                                        if (u) T.always(e[T.status]);
                                        else
                                            for (t in e) y[t] = [y[t], e[t]];
                                    return this
                                },
                                abort: function (e) {
                                    var t = e || k;
                                    return n && n.abort(t), C(0, t), this
                                }
                            };
                        if (m.promise(T), p.url = ((e || p.url || jt.href) + "").replace(Wt, jt.protocol + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(X) || [""], null == p.crossDomain) {
                            c = b.createElement("a");
                            try {
                                c.href = p.url, c.href = c.href, p.crossDomain = Gt.protocol + "//" + Gt.host != c.protocol + "//" + c.host
                            } catch (e) {
                                p.crossDomain = !0
                            }
                        }
                        if (p.data && p.processData && "string" != typeof p.data && (p.data = E.param(p.data, p.traditional)), Kt(zt, p, t, T), u) return T;
                        for (d in (l = E.event && p.global) && 0 == E.active++ && E.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Ut.test(p.type), i = p.url.replace(Ft, ""), p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Ht, "+")) : (f = p.url.slice(i.length), p.data && (p.processData || "string" == typeof p.data) && (i += (Ot.test(i) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (i = i.replace($t, "$1"), f = (Ot.test(i) ? "&" : "?") + "_=" + Dt.guid++ + f), p.url = i + f), p.ifModified && (E.lastModified[i] && T.setRequestHeader("If-Modified-Since", E.lastModified[i]), E.etag[i] && T.setRequestHeader("If-None-Match", E.etag[i])), (p.data && p.hasContent && !1 !== p.contentType || t.contentType) && T.setRequestHeader("Content-Type", p.contentType), T.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Xt + "; q=0.01" : "") : p.accepts["*"]), p.headers) T.setRequestHeader(d, p.headers[d]);
                        if (p.beforeSend && (!1 === p.beforeSend.call(h, T, p) || u)) return T.abort();
                        if (k = "abort", v.add(p.complete), T.done(p.success), T.fail(p.error), n = Kt(Vt, p, t, T)) {
                            if (T.readyState = 1, l && g.trigger("ajaxSend", [T, p]), u) return T;
                            p.async && p.timeout > 0 && (s = r.setTimeout((function () {
                                T.abort("timeout")
                            }), p.timeout));
                            try {
                                u = !1, n.send(w, C)
                            } catch (e) {
                                if (u) throw e;
                                C(-1, e)
                            }
                        } else C(-1, "No Transport");

                        function C(e, t, a, c) {
                            var d, f, b, w, x, k = t;
                            u || (u = !0, s && r.clearTimeout(s), n = void 0, o = c || "", T.readyState = e > 0 ? 4 : 0, d = e >= 200 && e < 300 || 304 === e, a && (w = function (e, t, n) {
                                for (var r, i, o, a, s = e.contents, c = e.dataTypes;
                                    "*" === c[0];) c.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                                if (r)
                                    for (i in s)
                                        if (s[i] && s[i].test(r)) {
                                            c.unshift(i);
                                            break
                                        }
                                if (c[0] in n) o = c[0];
                                else {
                                    for (i in n) {
                                        if (!c[0] || e.converters[i + " " + c[0]]) {
                                            o = i;
                                            break
                                        }
                                        a || (a = i)
                                    }
                                    o = o || a
                                }
                                if (o) return o !== c[0] && c.unshift(o), n[o]
                            }(p, T, a)), !d && E.inArray("script", p.dataTypes) > -1 && E.inArray("json", p.dataTypes) < 0 && (p.converters["text script"] = function () { }), w = function (e, t, n, r) {
                                var i, o, a, s, c, u = {},
                                    l = e.dataTypes.slice();
                                if (l[1])
                                    for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
                                for (o = l.shift(); o;)
                                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !c && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), c = o, o = l.shift())
                                        if ("*" === o) o = c;
                                        else if ("*" !== c && c !== o) {
                                            if (!(a = u[c + " " + o] || u["* " + o]))
                                                for (i in u)
                                                    if ((s = i.split(" "))[1] === o && (a = u[c + " " + s[0]] || u["* " + s[0]])) {
                                                        !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0], l.unshift(s[1]));
                                                        break
                                                    }
                                            if (!0 !== a)
                                                if (a && e.throws) t = a(t);
                                                else try {
                                                    t = a(t)
                                                } catch (e) {
                                                    return {
                                                        state: "parsererror",
                                                        error: a ? e : "No conversion from " + c + " to " + o
                                                    }
                                                }
                                        }
                                return {
                                    state: "success",
                                    data: t
                                }
                            }(p, w, T, d), d ? (p.ifModified && ((x = T.getResponseHeader("Last-Modified")) && (E.lastModified[i] = x), (x = T.getResponseHeader("etag")) && (E.etag[i] = x)), 204 === e || "HEAD" === p.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = w.state, f = w.data, d = !(b = w.error))) : (b = k, !e && k || (k = "error", e < 0 && (e = 0))), T.status = e, T.statusText = (t || k) + "", d ? m.resolveWith(h, [f, k, T]) : m.rejectWith(h, [T, k, b]), T.statusCode(y), y = void 0, l && g.trigger(d ? "ajaxSuccess" : "ajaxError", [T, p, d ? f : b]), v.fireWith(h, [T, k]), l && (g.trigger("ajaxComplete", [T, p]), --E.active || E.event.trigger("ajaxStop")))
                        }
                        return T
                    },
                    getJSON: function (e, t, n) {
                        return E.get(e, t, n, "json")
                    },
                    getScript: function (e, t) {
                        return E.get(e, void 0, t, "script")
                    }
                }), E.each(["get", "post"], (function (e, t) {
                    E[t] = function (e, n, r, i) {
                        return v(n) && (i = i || r, r = n, n = void 0), E.ajax(E.extend({
                            url: e,
                            type: t,
                            dataType: i,
                            data: n,
                            success: r
                        }, E.isPlainObject(e) && e))
                    }
                })), E.ajaxPrefilter((function (e) {
                    var t;
                    for (t in e.headers) "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
                })), E._evalUrl = function (e, t, n) {
                    return E.ajax({
                        url: e,
                        type: "GET",
                        dataType: "script",
                        cache: !0,
                        async: !1,
                        global: !1,
                        converters: {
                            "text script": function () { }
                        },
                        dataFilter: function (e) {
                            E.globalEval(e, t, n)
                        }
                    })
                }, E.fn.extend({
                    wrapAll: function (e) {
                        var t;
                        return this[0] && (v(e) && (e = e.call(this[0])), t = E(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map((function () {
                            for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                            return e
                        })).append(this)), this
                    },
                    wrapInner: function (e) {
                        return v(e) ? this.each((function (t) {
                            E(this).wrapInner(e.call(this, t))
                        })) : this.each((function () {
                            var t = E(this),
                                n = t.contents();
                            n.length ? n.wrapAll(e) : t.append(e)
                        }))
                    },
                    wrap: function (e) {
                        var t = v(e);
                        return this.each((function (n) {
                            E(this).wrapAll(t ? e.call(this, n) : e)
                        }))
                    },
                    unwrap: function (e) {
                        return this.parent(e).not("body").each((function () {
                            E(this).replaceWith(this.childNodes)
                        })), this
                    }
                }), E.expr.pseudos.hidden = function (e) {
                    return !E.expr.pseudos.visible(e)
                }, E.expr.pseudos.visible = function (e) {
                    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
                }, E.ajaxSettings.xhr = function () {
                    try {
                        return new r.XMLHttpRequest
                    } catch (e) { }
                };
                var Jt = {
                    0: 200,
                    1223: 204
                },
                    Zt = E.ajaxSettings.xhr();
                m.cors = !!Zt && "withCredentials" in Zt, m.ajax = Zt = !!Zt, E.ajaxTransport((function (e) {
                    var t, n;
                    if (m.cors || Zt && !e.crossDomain) return {
                        send: function (i, o) {
                            var a, s = e.xhr();
                            if (s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                                for (a in e.xhrFields) s[a] = e.xhrFields[a];
                            for (a in e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), e.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"), i) s.setRequestHeader(a, i[a]);
                            t = function (e) {
                                return function () {
                                    t && (t = n = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Jt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                        binary: s.response
                                    } : {
                                        text: s.responseText
                                    }, s.getAllResponseHeaders()))
                                }
                            }, s.onload = t(), n = s.onerror = s.ontimeout = t("error"), void 0 !== s.onabort ? s.onabort = n : s.onreadystatechange = function () {
                                4 === s.readyState && r.setTimeout((function () {
                                    t && n()
                                }))
                            }, t = t("abort");
                            try {
                                s.send(e.hasContent && e.data || null)
                            } catch (e) {
                                if (t) throw e
                            }
                        },
                        abort: function () {
                            t && t()
                        }
                    }
                })), E.ajaxPrefilter((function (e) {
                    e.crossDomain && (e.contents.script = !1)
                })), E.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /\b(?:java|ecma)script\b/
                    },
                    converters: {
                        "text script": function (e) {
                            return E.globalEval(e), e
                        }
                    }
                }), E.ajaxPrefilter("script", (function (e) {
                    void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
                })), E.ajaxTransport("script", (function (e) {
                    var t, n;
                    if (e.crossDomain || e.scriptAttrs) return {
                        send: function (r, i) {
                            t = E("<script>").attr(e.scriptAttrs || {}).prop({
                                charset: e.scriptCharset,
                                src: e.url
                            }).on("load error", n = function (e) {
                                t.remove(), n = null, e && i("error" === e.type ? 404 : 200, e.type)
                            }), b.head.appendChild(t[0])
                        },
                        abort: function () {
                            n && n()
                        }
                    }
                }));
                var en, tn = [],
                    nn = /(=)\?(?=&|$)|\?\?/;
                E.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function () {
                        var e = tn.pop() || E.expando + "_" + Dt.guid++;
                        return this[e] = !0, e
                    }
                }), E.ajaxPrefilter("json jsonp", (function (e, t, n) {
                    var i, o, a, s = !1 !== e.jsonp && (nn.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && nn.test(e.data) && "data");
                    if (s || "jsonp" === e.dataTypes[0]) return i = e.jsonpCallback = v(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, s ? e[s] = e[s].replace(nn, "$1" + i) : !1 !== e.jsonp && (e.url += (Ot.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), e.converters["script json"] = function () {
                        return a || E.error(i + " was not called"), a[0]
                    }, e.dataTypes[0] = "json", o = r[i], r[i] = function () {
                        a = arguments
                    }, n.always((function () {
                        void 0 === o ? E(r).removeProp(i) : r[i] = o, e[i] && (e.jsonpCallback = t.jsonpCallback, tn.push(i)), a && v(o) && o(a[0]), a = o = void 0
                    })), "script"
                })), m.createHTMLDocument = ((en = b.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === en.childNodes.length), E.parseHTML = function (e, t, n) {
                    return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (m.createHTMLDocument ? ((r = (t = b.implementation.createHTMLDocument("")).createElement("base")).href = b.location.href, t.head.appendChild(r)) : t = b), o = !n && [], (i = F.exec(e)) ? [t.createElement(i[1])] : (i = Ne([e], t, o), o && o.length && E(o).remove(), E.merge([], i.childNodes)));
                    var r, i, o
                }, E.fn.load = function (e, t, n) {
                    var r, i, o, a = this,
                        s = e.indexOf(" ");
                    return s > -1 && (r = Et(e.slice(s)), e = e.slice(0, s)), v(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), a.length > 0 && E.ajax({
                        url: e,
                        type: i || "GET",
                        dataType: "html",
                        data: t
                    }).done((function (e) {
                        o = arguments, a.html(r ? E("<div>").append(E.parseHTML(e)).find(r) : e)
                    })).always(n && function (e, t) {
                        a.each((function () {
                            n.apply(this, o || [e.responseText, t, e])
                        }))
                    }), this
                }, E.expr.pseudos.animated = function (e) {
                    return E.grep(E.timers, (function (t) {
                        return e === t.elem
                    })).length
                }, E.offset = {
                    setOffset: function (e, t, n) {
                        var r, i, o, a, s, c, u = E.css(e, "position"),
                            l = E(e),
                            d = {};
                        "static" === u && (e.style.position = "relative"), s = l.offset(), o = E.css(e, "top"), c = E.css(e, "left"), ("absolute" === u || "fixed" === u) && (o + c).indexOf("auto") > -1 ? (a = (r = l.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(c) || 0), v(t) && (t = t.call(e, n, E.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + i), "using" in t ? t.using.call(e, d) : l.css(d)
                    }
                }, E.fn.extend({
                    offset: function (e) {
                        if (arguments.length) return void 0 === e ? this : this.each((function (t) {
                            E.offset.setOffset(this, e, t)
                        }));
                        var t, n, r = this[0];
                        return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                            top: t.top + n.pageYOffset,
                            left: t.left + n.pageXOffset
                        }) : {
                            top: 0,
                            left: 0
                        } : void 0
                    },
                    position: function () {
                        if (this[0]) {
                            var e, t, n, r = this[0],
                                i = {
                                    top: 0,
                                    left: 0
                                };
                            if ("fixed" === E.css(r, "position")) t = r.getBoundingClientRect();
                            else {
                                for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === E.css(e, "position");) e = e.parentNode;
                                e && e !== r && 1 === e.nodeType && ((i = E(e).offset()).top += E.css(e, "borderTopWidth", !0), i.left += E.css(e, "borderLeftWidth", !0))
                            }
                            return {
                                top: t.top - i.top - E.css(r, "marginTop", !0),
                                left: t.left - i.left - E.css(r, "marginLeft", !0)
                            }
                        }
                    },
                    offsetParent: function () {
                        return this.map((function () {
                            for (var e = this.offsetParent; e && "static" === E.css(e, "position");) e = e.offsetParent;
                            return e || ge
                        }))
                    }
                }), E.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, (function (e, t) {
                    var n = "pageYOffset" === t;
                    E.fn[e] = function (r) {
                        return ee(this, (function (e, r, i) {
                            var o;
                            if (y(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === i) return o ? o[t] : e[r];
                            o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i
                        }), e, r, arguments.length)
                    }
                })), E.each(["top", "left"], (function (e, t) {
                    E.cssHooks[t] = et(m.pixelPosition, (function (e, n) {
                        if (n) return n = Ze(e, t), Ge.test(n) ? E(e).position()[t] + "px" : n
                    }))
                })), E.each({
                    Height: "height",
                    Width: "width"
                }, (function (e, t) {
                    E.each({
                        padding: "inner" + e,
                        content: t,
                        "": "outer" + e
                    }, (function (n, r) {
                        E.fn[r] = function (i, o) {
                            var a = arguments.length && (n || "boolean" != typeof i),
                                s = n || (!0 === i || !0 === o ? "margin" : "border");
                            return ee(this, (function (t, n, i) {
                                var o;
                                return y(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? E.css(t, n, s) : E.style(t, n, i, s)
                            }), t, a ? i : void 0, a)
                        }
                    }))
                })), E.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], (function (e, t) {
                    E.fn[t] = function (e) {
                        return this.on(t, e)
                    }
                })), E.fn.extend({
                    bind: function (e, t, n) {
                        return this.on(e, null, t, n)
                    },
                    unbind: function (e, t) {
                        return this.off(e, null, t)
                    },
                    delegate: function (e, t, n, r) {
                        return this.on(t, e, n, r)
                    },
                    undelegate: function (e, t, n) {
                        return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                    },
                    hover: function (e, t) {
                        return this.on("mouseenter", e).on("mouseleave", t || e)
                    }
                }), E.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), (function (e, t) {
                    E.fn[t] = function (e, n) {
                        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                    }
                }));
                var rn = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
                E.proxy = function (e, t) {
                    var n, r, i;
                    if ("string" == typeof t && (n = e[t], t = e, e = n), v(e)) return r = s.call(arguments, 2), i = function () {
                        return e.apply(t || this, r.concat(s.call(arguments)))
                    }, i.guid = e.guid = e.guid || E.guid++, i
                }, E.holdReady = function (e) {
                    e ? E.readyWait++ : E.ready(!0)
                }, E.isArray = Array.isArray, E.parseJSON = JSON.parse, E.nodeName = A, E.isFunction = v, E.isWindow = y, E.camelCase = ie, E.type = k, E.now = Date.now, E.isNumeric = function (e) {
                    var t = E.type(e);
                    return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
                }, E.trim = function (e) {
                    return null == e ? "" : (e + "").replace(rn, "$1")
                }, void 0 === (n = function () {
                    return E
                }.apply(t, [])) || (e.exports = n);
                var on = r.jQuery,
                    an = r.$;
                return E.noConflict = function (e) {
                    return r.$ === E && (r.$ = an), e && r.jQuery === E && (r.jQuery = on), E
                }, void 0 === i && (r.jQuery = r.$ = E), E
            }))
        },
        708: function (e) {
            e.exports = (() => {
                var e = {
                    20: e => {
                        "use strict";
                        var t = "%[a-f0-9]{2}",
                            n = new RegExp(t, "gi"),
                            r = new RegExp("(" + t + ")+", "gi");

                        function i(e, t) {
                            try {
                                return decodeURIComponent(e.join(""))
                            } catch (e) { }
                            if (1 === e.length) return e;
                            t = t || 1;
                            var n = e.slice(0, t),
                                r = e.slice(t);
                            return Array.prototype.concat.call([], i(n), i(r))
                        }

                        function o(e) {
                            try {
                                return decodeURIComponent(e)
                            } catch (o) {
                                for (var t = e.match(n), r = 1; r < t.length; r++) t = (e = i(t, r).join("")).match(n);
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
                                    }, n = r.exec(e); n;) {
                                        try {
                                            t[n[0]] = decodeURIComponent(n[0])
                                        } catch (e) {
                                            var i = o(n[0]);
                                            i !== n[0] && (t[n[0]] = i)
                                        }
                                        n = r.exec(e)
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
                            for (var n = {}, r = Object.keys(e), i = Array.isArray(t), o = 0; o < r.length; o++) {
                                var a = r[o],
                                    s = e[a];
                                (i ? -1 !== t.indexOf(a) : t(a, s, e)) && (n[a] = s)
                            }
                            return n
                        }
                    },
                    563: (e, t, n) => {
                        "use strict";
                        const r = n(610),
                            i = n(20),
                            o = n(500),
                            a = n(806),
                            s = Symbol("encodeFragmentIdentifier");

                        function c(e) {
                            if ("string" != typeof e || 1 !== e.length) throw new TypeError("arrayFormatSeparator must be single character string")
                        }

                        function u(e, t) {
                            return t.encode ? t.strict ? r(e) : encodeURIComponent(e) : e
                        }

                        function l(e, t) {
                            return t.decode ? i(e) : e
                        }

                        function d(e) {
                            return Array.isArray(e) ? e.sort() : "object" == typeof e ? d(Object.keys(e)).sort(((e, t) => Number(e) - Number(t))).map((t => e[t])) : e
                        }

                        function f(e) {
                            const t = e.indexOf("#");
                            return -1 !== t && (e = e.slice(0, t)), e
                        }

                        function p(e) {
                            const t = (e = f(e)).indexOf("?");
                            return -1 === t ? "" : e.slice(t + 1)
                        }

                        function h(e, t) {
                            return t.parseNumbers && !Number.isNaN(Number(e)) && "string" == typeof e && "" !== e.trim() ? e = Number(e) : !t.parseBooleans || null === e || "true" !== e.toLowerCase() && "false" !== e.toLowerCase() || (e = "true" === e.toLowerCase()), e
                        }

                        function g(e, t) {
                            c((t = Object.assign({
                                decode: !0,
                                sort: !0,
                                arrayFormat: "none",
                                arrayFormatSeparator: ",",
                                parseNumbers: !1,
                                parseBooleans: !1
                            }, t)).arrayFormatSeparator);
                            const n = function (e) {
                                let t;
                                switch (e.arrayFormat) {
                                    case "index":
                                        return (e, n, r) => {
                                            t = /\[(\d*)\]$/.exec(e), e = e.replace(/\[\d*\]$/, ""), t ? (void 0 === r[e] && (r[e] = {}), r[e][t[1]] = n) : r[e] = n
                                        };
                                    case "bracket":
                                        return (e, n, r) => {
                                            t = /(\[\])$/.exec(e), e = e.replace(/\[\]$/, ""), t ? void 0 !== r[e] ? r[e] = [].concat(r[e], n) : r[e] = [n] : r[e] = n
                                        };
                                    case "comma":
                                    case "separator":
                                        return (t, n, r) => {
                                            const i = "string" == typeof n && n.includes(e.arrayFormatSeparator),
                                                o = "string" == typeof n && !i && l(n, e).includes(e.arrayFormatSeparator);
                                            n = o ? l(n, e) : n;
                                            const a = i || o ? n.split(e.arrayFormatSeparator).map((t => l(t, e))) : null === n ? n : l(n, e);
                                            r[t] = a
                                        };
                                    case "bracket-separator":
                                        return (t, n, r) => {
                                            const i = /(\[\])$/.test(t);
                                            if (t = t.replace(/\[\]$/, ""), !i) return void (r[t] = n ? l(n, e) : n);
                                            const o = null === n ? [] : n.split(e.arrayFormatSeparator).map((t => l(t, e)));
                                            void 0 !== r[t] ? r[t] = [].concat(r[t], o) : r[t] = o
                                        };
                                    default:
                                        return (e, t, n) => {
                                            void 0 !== n[e] ? n[e] = [].concat(n[e], t) : n[e] = t
                                        }
                                }
                            }(t),
                                r = Object.create(null);
                            if ("string" != typeof e) return r;
                            if (!(e = e.trim().replace(/^[?#&]/, ""))) return r;
                            for (const i of e.split("&")) {
                                if ("" === i) continue;
                                let [e, a] = o(t.decode ? i.replace(/\+/g, " ") : i, "=");
                                a = void 0 === a ? null : ["comma", "separator", "bracket-separator"].includes(t.arrayFormat) ? a : l(a, t), n(l(e, t), a, r)
                            }
                            for (const e of Object.keys(r)) {
                                const n = r[e];
                                if ("object" == typeof n && null !== n)
                                    for (const e of Object.keys(n)) n[e] = h(n[e], t);
                                else r[e] = h(n, t)
                            }
                            return !1 === t.sort ? r : (!0 === t.sort ? Object.keys(r).sort() : Object.keys(r).sort(t.sort)).reduce(((e, t) => {
                                const n = r[t];
                                return Boolean(n) && "object" == typeof n && !Array.isArray(n) ? e[t] = d(n) : e[t] = n, e
                            }), Object.create(null))
                        }
                        t.extract = p, t.parse = g, t.stringify = (e, t) => {
                            if (!e) return "";
                            c((t = Object.assign({
                                encode: !0,
                                strict: !0,
                                arrayFormat: "none",
                                arrayFormatSeparator: ","
                            }, t)).arrayFormatSeparator);
                            const n = n => t.skipNull && null == e[n] || t.skipEmptyString && "" === e[n],
                                r = function (e) {
                                    switch (e.arrayFormat) {
                                        case "index":
                                            return t => (n, r) => {
                                                const i = n.length;
                                                return void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? n : null === r ? [...n, [u(t, e), "[", i, "]"].join("")] : [...n, [u(t, e), "[", u(i, e), "]=", u(r, e)].join("")]
                                            };
                                        case "bracket":
                                            return t => (n, r) => void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? n : null === r ? [...n, [u(t, e), "[]"].join("")] : [...n, [u(t, e), "[]=", u(r, e)].join("")];
                                        case "comma":
                                        case "separator":
                                        case "bracket-separator":
                                            {
                                                const t = "bracket-separator" === e.arrayFormat ? "[]=" : "=";
                                                return n => (r, i) => void 0 === i || e.skipNull && null === i || e.skipEmptyString && "" === i ? r : (i = null === i ? "" : i, 0 === r.length ? [
                                                    [u(n, e), t, u(i, e)].join("")
                                                ] : [
                                                    [r, u(i, e)].join(e.arrayFormatSeparator)
                                                ])
                                            }
                                        default:
                                            return t => (n, r) => void 0 === r || e.skipNull && null === r || e.skipEmptyString && "" === r ? n : null === r ? [...n, u(t, e)] : [...n, [u(t, e), "=", u(r, e)].join("")]
                                    }
                                }(t),
                                i = {};
                            for (const t of Object.keys(e)) n(t) || (i[t] = e[t]);
                            const o = Object.keys(i);
                            return !1 !== t.sort && o.sort(t.sort), o.map((n => {
                                const i = e[n];
                                return void 0 === i ? "" : null === i ? u(n, t) : Array.isArray(i) ? 0 === i.length && "bracket-separator" === t.arrayFormat ? u(n, t) + "[]" : i.reduce(r(n), []).join("&") : u(n, t) + "=" + u(i, t)
                            })).filter((e => e.length > 0)).join("&")
                        }, t.parseUrl = (e, t) => {
                            t = Object.assign({
                                decode: !0
                            }, t);
                            const [n, r] = o(e, "#");
                            return Object.assign({
                                url: n.split("?")[0] || "",
                                query: g(p(e), t)
                            }, t && t.parseFragmentIdentifier && r ? {
                                fragmentIdentifier: l(r, t)
                            } : {})
                        }, t.stringifyUrl = (e, n) => {
                            n = Object.assign({
                                encode: !0,
                                strict: !0,
                                [s]: !0
                            }, n);
                            const r = f(e.url).split("?")[0] || "",
                                i = t.extract(e.url),
                                o = t.parse(i, {
                                    sort: !1
                                }),
                                a = Object.assign(o, e.query);
                            let c = t.stringify(a, n);
                            c && (c = `?${c}`);
                            let l = function (e) {
                                let t = "";
                                const n = e.indexOf("#");
                                return -1 !== n && (t = e.slice(n)), t
                            }(e.url);
                            return e.fragmentIdentifier && (l = `#${n[s] ? u(e.fragmentIdentifier, n) : e.fragmentIdentifier}`), `${r}${c}${l}`
                        }, t.pick = (e, n, r) => {
                            r = Object.assign({
                                parseFragmentIdentifier: !0,
                                [s]: !1
                            }, r);
                            const {
                                url: i,
                                query: o,
                                fragmentIdentifier: c
                            } = t.parseUrl(e, r);
                            return t.stringifyUrl({
                                url: i,
                                query: a(o, n),
                                fragmentIdentifier: c
                            }, r)
                        }, t.exclude = (e, n, r) => {
                            const i = Array.isArray(n) ? e => !n.includes(e) : (e, t) => !n(e, t);
                            return t.pick(e, i, r)
                        }
                    },
                    500: e => {
                        "use strict";
                        e.exports = (e, t) => {
                            if ("string" != typeof e || "string" != typeof t) throw new TypeError("Expected the arguments to be of type `string`");
                            if ("" === t) return [e];
                            const n = e.indexOf(t);
                            return -1 === n ? [e] : [e.slice(0, n), e.slice(n + t.length)]
                        }
                    },
                    610: e => {
                        "use strict";
                        e.exports = e => encodeURIComponent(e).replace(/[!'()*]/g, (e => `%${e.charCodeAt(0).toString(16).toUpperCase()}`))
                    },
                    238: function (e, t, n) {
                        var r;
                        ! function (i, o) {
                            "use strict";
                            var a = "function",
                                s = "undefined",
                                c = "object",
                                u = "string",
                                l = "model",
                                d = "name",
                                f = "type",
                                p = "vendor",
                                h = "version",
                                g = "architecture",
                                m = "console",
                                v = "mobile",
                                y = "tablet",
                                b = "smarttv",
                                w = "wearable",
                                x = "embedded",
                                k = "Amazon",
                                T = "Apple",
                                C = "ASUS",
                                E = "BlackBerry",
                                S = "Google",
                                A = "Huawei",
                                _ = "LG",
                                j = "Microsoft",
                                D = "Motorola",
                                O = "Samsung",
                                N = "Sony",
                                q = "Xiaomi",
                                L = "Zebra",
                                P = "Facebook",
                                R = function (e) {
                                    for (var t = {}, n = 0; n < e.length; n++) t[e[n].toUpperCase()] = e[n];
                                    return t
                                },
                                I = function (e, t) {
                                    return typeof e === u && -1 !== M(t).indexOf(M(e))
                                },
                                M = function (e) {
                                    return e.toLowerCase()
                                },
                                H = function (e, t) {
                                    if (typeof e === u) return e = e.replace(/^\s\s*/, "").replace(/\s\s*$/, ""), typeof t === s ? e : e.substring(0, 255)
                                },
                                F = function (e, t) {
                                    for (var n, r, i, s, u, l, d = 0; d < t.length && !u;) {
                                        var f = t[d],
                                            p = t[d + 1];
                                        for (n = r = 0; n < f.length && !u;)
                                            if (u = f[n++].exec(e))
                                                for (i = 0; i < p.length; i++) l = u[++r], typeof (s = p[i]) === c && s.length > 0 ? 2 === s.length ? typeof s[1] == a ? this[s[0]] = s[1].call(this, l) : this[s[0]] = s[1] : 3 === s.length ? typeof s[1] !== a || s[1].exec && s[1].test ? this[s[0]] = l ? l.replace(s[1], s[2]) : o : this[s[0]] = l ? s[1].call(this, l, s[2]) : o : 4 === s.length && (this[s[0]] = l ? s[3].call(this, l.replace(s[1], s[2])) : o) : this[s] = l || o;
                                        d += 2
                                    }
                                },
                                $ = function (e, t) {
                                    for (var n in t)
                                        if (typeof t[n] === c && t[n].length > 0) {
                                            for (var r = 0; r < t[n].length; r++)
                                                if (I(t[n][r], e)) return "?" === n ? o : n
                                        } else if (I(t[n], e)) return "?" === n ? o : n;
                                    return e
                                },
                                B = {
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
                                U = {
                                    browser: [
                                        [/\b(?:crmo|crios)\/([\w\.]+)/i],
                                        [h, [d, "Chrome"]],
                                        [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                                        [h, [d, "Edge"]],
                                        [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],
                                        [d, h],
                                        [/opios[\/ ]+([\w\.]+)/i],
                                        [h, [d, "Opera Mini"]],
                                        [/\bopr\/([\w\.]+)/i],
                                        [h, [d, "Opera"]],
                                        [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i, /(weibo)__([\d\.]+)/i],
                                        [d, h],
                                        [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
                                        [h, [d, "UCBrowser"]],
                                        [/\bqbcore\/([\w\.]+)/i],
                                        [h, [d, "WeChat(Win) Desktop"]],
                                        [/micromessenger\/([\w\.]+)/i],
                                        [h, [d, "WeChat"]],
                                        [/konqueror\/([\w\.]+)/i],
                                        [h, [d, "Konqueror"]],
                                        [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
                                        [h, [d, "IE"]],
                                        [/yabrowser\/([\w\.]+)/i],
                                        [h, [d, "Yandex"]],
                                        [/(avast|avg)\/([\w\.]+)/i],
                                        [
                                            [d, /(.+)/, "$1 Secure Browser"], h
                                        ],
                                        [/\bfocus\/([\w\.]+)/i],
                                        [h, [d, "Firefox Focus"]],
                                        [/\bopt\/([\w\.]+)/i],
                                        [h, [d, "Opera Touch"]],
                                        [/coc_coc\w+\/([\w\.]+)/i],
                                        [h, [d, "Coc Coc"]],
                                        [/dolfin\/([\w\.]+)/i],
                                        [h, [d, "Dolphin"]],
                                        [/coast\/([\w\.]+)/i],
                                        [h, [d, "Opera Coast"]],
                                        [/miuibrowser\/([\w\.]+)/i],
                                        [h, [d, "MIUI Browser"]],
                                        [/fxios\/([-\w\.]+)/i],
                                        [h, [d, "Firefox"]],
                                        [/\bqihu|(qi?ho?o?|360)browser/i],
                                        [
                                            [d, "360 Browser"]
                                        ],
                                        [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
                                        [
                                            [d, /(.+)/, "$1 Browser"], h
                                        ],
                                        [/(comodo_dragon)\/([\w\.]+)/i],
                                        [
                                            [d, /_/g, " "], h
                                        ],
                                        [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],
                                        [d, h],
                                        [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i],
                                        [d],
                                        [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
                                        [
                                            [d, P], h
                                        ],
                                        [/safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i],
                                        [d, h],
                                        [/\bgsa\/([\w\.]+) .*safari\//i],
                                        [h, [d, "GSA"]],
                                        [/headlesschrome(?:\/([\w\.]+)| )/i],
                                        [h, [d, "Chrome Headless"]],
                                        [/ wv\).+(chrome)\/([\w\.]+)/i],
                                        [
                                            [d, "Chrome WebView"], h
                                        ],
                                        [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
                                        [h, [d, "Android Browser"]],
                                        [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
                                        [d, h],
                                        [/version\/([\w\.]+) .*mobile\/\w+ (safari)/i],
                                        [h, [d, "Mobile Safari"]],
                                        [/version\/([\w\.]+) .*(mobile ?safari|safari)/i],
                                        [h, d],
                                        [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
                                        [d, [h, $, {
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
                                        [d, h],
                                        [/(navigator|netscape\d?)\/([-\w\.]+)/i],
                                        [
                                            [d, "Netscape"], h
                                        ],
                                        [/mobile vr; rv:([\w\.]+)\).+firefox/i],
                                        [h, [d, "Firefox Reality"]],
                                        [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i],
                                        [d, h]
                                    ],
                                    cpu: [
                                        [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
                                        [
                                            [g, "amd64"]
                                        ],
                                        [/(ia32(?=;))/i],
                                        [
                                            [g, M]
                                        ],
                                        [/((?:i[346]|x)86)[;\)]/i],
                                        [
                                            [g, "ia32"]
                                        ],
                                        [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
                                        [
                                            [g, "arm64"]
                                        ],
                                        [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                                        [
                                            [g, "armhf"]
                                        ],
                                        [/windows (ce|mobile); ppc;/i],
                                        [
                                            [g, "arm"]
                                        ],
                                        [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
                                        [
                                            [g, /ower/, "", M]
                                        ],
                                        [/(sun4\w)[;\)]/i],
                                        [
                                            [g, "sparc"]
                                        ],
                                        [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],
                                        [
                                            [g, M]
                                        ]
                                    ],
                                    device: [
                                        [/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
                                        [l, [p, O],
                                            [f, y]
                                        ],
                                        [/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i],
                                        [l, [p, O],
                                            [f, v]
                                        ],
                                        [/\((ip(?:hone|od)[\w ]*);/i],
                                        [l, [p, T],
                                            [f, v]
                                        ],
                                        [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i],
                                        [l, [p, T],
                                            [f, y]
                                        ],
                                        [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
                                        [l, [p, A],
                                            [f, y]
                                        ],
                                        [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i],
                                        [l, [p, A],
                                            [f, v]
                                        ],
                                        [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],
                                        [
                                            [l, /_/g, " "],
                                            [p, q],
                                            [f, v]
                                        ],
                                        [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],
                                        [
                                            [l, /_/g, " "],
                                            [p, q],
                                            [f, y]
                                        ],
                                        [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],
                                        [l, [p, "OPPO"],
                                            [f, v]
                                        ],
                                        [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
                                        [l, [p, "Vivo"],
                                            [f, v]
                                        ],
                                        [/\b(rmx[12]\d{3})(?: bui|;|\))/i],
                                        [l, [p, "Realme"],
                                            [f, v]
                                        ],
                                        [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],
                                        [l, [p, D],
                                            [f, v]
                                        ],
                                        [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
                                        [l, [p, D],
                                            [f, y]
                                        ],
                                        [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
                                        [l, [p, _],
                                            [f, y]
                                        ],
                                        [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i],
                                        [l, [p, _],
                                            [f, v]
                                        ],
                                        [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],
                                        [l, [p, "Lenovo"],
                                            [f, y]
                                        ],
                                        [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
                                        [
                                            [l, /_/g, " "],
                                            [p, "Nokia"],
                                            [f, v]
                                        ],
                                        [/(pixel c)\b/i],
                                        [l, [p, S],
                                            [f, y]
                                        ],
                                        [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
                                        [l, [p, S],
                                            [f, v]
                                        ],
                                        [/droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],
                                        [l, [p, N],
                                            [f, v]
                                        ],
                                        [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
                                        [
                                            [l, "Xperia Tablet"],
                                            [p, N],
                                            [f, y]
                                        ],
                                        [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],
                                        [l, [p, "OnePlus"],
                                            [f, v]
                                        ],
                                        [/(alexa)webm/i, /(kf[a-z]{2}wi)( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i],
                                        [l, [p, k],
                                            [f, y]
                                        ],
                                        [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
                                        [
                                            [l, /(.+)/g, "Fire Phone $1"],
                                            [p, k],
                                            [f, v]
                                        ],
                                        [/(playbook);[-\w\),; ]+(rim)/i],
                                        [l, p, [f, y]],
                                        [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
                                        [l, [p, E],
                                            [f, v]
                                        ],
                                        [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],
                                        [l, [p, C],
                                            [f, y]
                                        ],
                                        [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
                                        [l, [p, C],
                                            [f, v]
                                        ],
                                        [/(nexus 9)/i],
                                        [l, [p, "HTC"],
                                            [f, y]
                                        ],
                                        [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i],
                                        [p, [l, /_/g, " "],
                                            [f, v]
                                        ],
                                        [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
                                        [l, [p, "Acer"],
                                            [f, y]
                                        ],
                                        [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
                                        [l, [p, "Meizu"],
                                            [f, v]
                                        ],
                                        [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
                                        [l, [p, "Sharp"],
                                            [f, v]
                                        ],
                                        [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i],
                                        [p, l, [f, v]],
                                        [/(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i],
                                        [p, l, [f, y]],
                                        [/(surface duo)/i],
                                        [l, [p, j],
                                            [f, y]
                                        ],
                                        [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
                                        [l, [p, "Fairphone"],
                                            [f, v]
                                        ],
                                        [/(u304aa)/i],
                                        [l, [p, "AT&T"],
                                            [f, v]
                                        ],
                                        [/\bsie-(\w*)/i],
                                        [l, [p, "Siemens"],
                                            [f, v]
                                        ],
                                        [/\b(rct\w+) b/i],
                                        [l, [p, "RCA"],
                                            [f, y]
                                        ],
                                        [/\b(venue[\d ]{2,7}) b/i],
                                        [l, [p, "Dell"],
                                            [f, y]
                                        ],
                                        [/\b(q(?:mv|ta)\w+) b/i],
                                        [l, [p, "Verizon"],
                                            [f, y]
                                        ],
                                        [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
                                        [l, [p, "Barnes & Noble"],
                                            [f, y]
                                        ],
                                        [/\b(tm\d{3}\w+) b/i],
                                        [l, [p, "NuVision"],
                                            [f, y]
                                        ],
                                        [/\b(k88) b/i],
                                        [l, [p, "ZTE"],
                                            [f, y]
                                        ],
                                        [/\b(nx\d{3}j) b/i],
                                        [l, [p, "ZTE"],
                                            [f, v]
                                        ],
                                        [/\b(gen\d{3}) b.+49h/i],
                                        [l, [p, "Swiss"],
                                            [f, v]
                                        ],
                                        [/\b(zur\d{3}) b/i],
                                        [l, [p, "Swiss"],
                                            [f, y]
                                        ],
                                        [/\b((zeki)?tb.*\b) b/i],
                                        [l, [p, "Zeki"],
                                            [f, y]
                                        ],
                                        [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
                                        [
                                            [p, "Dragon Touch"], l, [f, y]
                                        ],
                                        [/\b(ns-?\w{0,9}) b/i],
                                        [l, [p, "Insignia"],
                                            [f, y]
                                        ],
                                        [/\b((nxa|next)-?\w{0,9}) b/i],
                                        [l, [p, "NextBook"],
                                            [f, y]
                                        ],
                                        [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
                                        [
                                            [p, "Voice"], l, [f, v]
                                        ],
                                        [/\b(lvtel\-)?(v1[12]) b/i],
                                        [
                                            [p, "LvTel"], l, [f, v]
                                        ],
                                        [/\b(ph-1) /i],
                                        [l, [p, "Essential"],
                                            [f, v]
                                        ],
                                        [/\b(v(100md|700na|7011|917g).*\b) b/i],
                                        [l, [p, "Envizen"],
                                            [f, y]
                                        ],
                                        [/\b(trio[-\w\. ]+) b/i],
                                        [l, [p, "MachSpeed"],
                                            [f, y]
                                        ],
                                        [/\btu_(1491) b/i],
                                        [l, [p, "Rotor"],
                                            [f, y]
                                        ],
                                        [/(shield[\w ]+) b/i],
                                        [l, [p, "Nvidia"],
                                            [f, y]
                                        ],
                                        [/(sprint) (\w+)/i],
                                        [p, l, [f, v]],
                                        [/(kin\.[onetw]{3})/i],
                                        [
                                            [l, /\./g, " "],
                                            [p, j],
                                            [f, v]
                                        ],
                                        [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                                        [l, [p, L],
                                            [f, y]
                                        ],
                                        [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
                                        [l, [p, L],
                                            [f, v]
                                        ],
                                        [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
                                        [p, l, [f, m]],
                                        [/droid.+; (shield) bui/i],
                                        [l, [p, "Nvidia"],
                                            [f, m]
                                        ],
                                        [/(playstation [345portablevi]+)/i],
                                        [l, [p, N],
                                            [f, m]
                                        ],
                                        [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
                                        [l, [p, j],
                                            [f, m]
                                        ],
                                        [/smart-tv.+(samsung)/i],
                                        [p, [f, b]],
                                        [/hbbtv.+maple;(\d+)/i],
                                        [
                                            [l, /^/, "SmartTV"],
                                            [p, O],
                                            [f, b]
                                        ],
                                        [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
                                        [
                                            [p, _],
                                            [f, b]
                                        ],
                                        [/(apple) ?tv/i],
                                        [p, [l, "Apple TV"],
                                            [f, b]
                                        ],
                                        [/crkey/i],
                                        [
                                            [l, "Chromecast"],
                                            [p, S],
                                            [f, b]
                                        ],
                                        [/droid.+aft(\w)( bui|\))/i],
                                        [l, [p, k],
                                            [f, b]
                                        ],
                                        [/\(dtv[\);].+(aquos)/i],
                                        [l, [p, "Sharp"],
                                            [f, b]
                                        ],
                                        [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i],
                                        [
                                            [p, H],
                                            [l, H],
                                            [f, b]
                                        ],
                                        [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
                                        [
                                            [f, b]
                                        ],
                                        [/((pebble))app/i],
                                        [p, l, [f, w]],
                                        [/droid.+; (glass) \d/i],
                                        [l, [p, S],
                                            [f, w]
                                        ],
                                        [/droid.+; (wt63?0{2,3})\)/i],
                                        [l, [p, L],
                                            [f, w]
                                        ],
                                        [/(quest( 2)?)/i],
                                        [l, [p, P],
                                            [f, w]
                                        ],
                                        [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
                                        [p, [f, x]],
                                        [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],
                                        [l, [f, v]],
                                        [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
                                        [l, [f, y]],
                                        [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
                                        [
                                            [f, y]
                                        ],
                                        [/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i],
                                        [
                                            [f, v]
                                        ],
                                        [/(android[-\w\. ]{0,9});.+buil/i],
                                        [l, [p, "Generic"]]
                                    ],
                                    engine: [
                                        [/windows.+ edge\/([\w\.]+)/i],
                                        [h, [d, "EdgeHTML"]],
                                        [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                                        [h, [d, "Blink"]],
                                        [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i],
                                        [d, h],
                                        [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                                        [h, d]
                                    ],
                                    os: [
                                        [/microsoft (windows) (vista|xp)/i],
                                        [d, h],
                                        [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],
                                        [d, [h, $, B]],
                                        [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
                                        [
                                            [d, "Windows"],
                                            [h, $, B]
                                        ],
                                        [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /cfnetwork\/.+darwin/i],
                                        [
                                            [h, /_/g, "."],
                                            [d, "iOS"]
                                        ],
                                        [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
                                        [
                                            [d, "Mac OS"],
                                            [h, /_/g, "."]
                                        ],
                                        [/droid ([\w\.]+)\b.+(android[- ]x86)/i],
                                        [h, d],
                                        [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i],
                                        [d, h],
                                        [/\(bb(10);/i],
                                        [h, [d, E]],
                                        [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
                                        [h, [d, "Symbian"]],
                                        [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],
                                        [h, [d, "Firefox OS"]],
                                        [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                                        [h, [d, "webOS"]],
                                        [/crkey\/([\d\.]+)/i],
                                        [h, [d, "Chromecast"]],
                                        [/(cros) [\w]+ ([\w\.]+\w)/i],
                                        [
                                            [d, "Chromium OS"], h
                                        ],
                                        [/(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i],
                                        [d, h],
                                        [/(sunos) ?([\w\.\d]*)/i],
                                        [
                                            [d, "Solaris"], h
                                        ],
                                        [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i, /(unix) ?([\w\.]*)/i],
                                        [d, h]
                                    ]
                                },
                                W = function (e, t) {
                                    if (typeof e === c && (t = e, e = o), !(this instanceof W)) return new W(e, t).getResult();
                                    var n = e || (typeof i !== s && i.navigator && i.navigator.userAgent ? i.navigator.userAgent : ""),
                                        r = t ? function (e, t) {
                                            var n = {};
                                            for (var r in e) t[r] && t[r].length % 2 == 0 ? n[r] = t[r].concat(e[r]) : n[r] = e[r];
                                            return n
                                        }(U, t) : U;
                                    return this.getBrowser = function () {
                                        var e, t = {};
                                        return t.name = o, t.version = o, F.call(t, n, r.browser), t.major = typeof (e = t.version) === u ? e.replace(/[^\d\.]/g, "").split(".")[0] : o, t
                                    }, this.getCPU = function () {
                                        var e = {};
                                        return e.architecture = o, F.call(e, n, r.cpu), e
                                    }, this.getDevice = function () {
                                        var e = {};
                                        return e.vendor = o, e.model = o, e.type = o, F.call(e, n, r.device), e
                                    }, this.getEngine = function () {
                                        var e = {};
                                        return e.name = o, e.version = o, F.call(e, n, r.engine), e
                                    }, this.getOS = function () {
                                        var e = {};
                                        return e.name = o, e.version = o, F.call(e, n, r.os), e
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
                                        return n
                                    }, this.setUA = function (e) {
                                        return n = typeof e === u && e.length > 255 ? H(e, 255) : e, this
                                    }, this.setUA(n), this
                                };
                            W.VERSION = "1.0.2", W.BROWSER = R([d, h, "major"]), W.CPU = R([g]), W.DEVICE = R([l, p, f, m, v, b, y, w, x]), W.ENGINE = W.OS = R([d, h]), typeof t !== s ? (e.exports && (t = e.exports = W), t.UAParser = W) : n.amdO ? (r = function () {
                                return W
                            }.call(t, n, t, e)) === o || (e.exports = r) : typeof i !== s && (i.UAParser = W);
                            var z = typeof i !== s && (i.jQuery || i.Zepto);
                            if (z && !z.ua) {
                                var V = new W;
                                z.ua = V.getResult(), z.ua.get = function () {
                                    return V.getUA()
                                }, z.ua.set = function (e) {
                                    V.setUA(e);
                                    var t = V.getResult();
                                    for (var n in t) z.ua[n] = t[n]
                                }
                            }
                        }("object" == typeof window ? window : this)
                    },
                    877: (e, t, n) => {
                        var r = n(570),
                            i = n(171),
                            o = i;
                        o.v1 = r, o.v4 = i, e.exports = o
                    },
                    327: e => {
                        for (var t = [], n = 0; n < 256; ++n) t[n] = (n + 256).toString(16).substr(1);
                        e.exports = function (e, n) {
                            var r = n || 0,
                                i = t;
                            return [i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]]].join("")
                        }
                    },
                    217: e => {
                        var t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
                        if (t) {
                            var n = new Uint8Array(16);
                            e.exports = function () {
                                return t(n), n
                            }
                        } else {
                            var r = new Array(16);
                            e.exports = function () {
                                for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), r[t] = e >>> ((3 & t) << 3) & 255;
                                return r
                            }
                        }
                    },
                    570: (e, t, n) => {
                        var r, i, o = n(217),
                            a = n(327),
                            s = 0,
                            c = 0;
                        e.exports = function (e, t, n) {
                            var u = t && n || 0,
                                l = t || [],
                                d = (e = e || {}).node || r,
                                f = void 0 !== e.clockseq ? e.clockseq : i;
                            if (null == d || null == f) {
                                var p = o();
                                null == d && (d = r = [1 | p[0], p[1], p[2], p[3], p[4], p[5]]), null == f && (f = i = 16383 & (p[6] << 8 | p[7]))
                            }
                            var h = void 0 !== e.msecs ? e.msecs : (new Date).getTime(),
                                g = void 0 !== e.nsecs ? e.nsecs : c + 1,
                                m = h - s + (g - c) / 1e4;
                            if (m < 0 && void 0 === e.clockseq && (f = f + 1 & 16383), (m < 0 || h > s) && void 0 === e.nsecs && (g = 0), g >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                            s = h, c = g, i = f;
                            var v = (1e4 * (268435455 & (h += 122192928e5)) + g) % 4294967296;
                            l[u++] = v >>> 24 & 255, l[u++] = v >>> 16 & 255, l[u++] = v >>> 8 & 255, l[u++] = 255 & v;
                            var y = h / 4294967296 * 1e4 & 268435455;
                            l[u++] = y >>> 8 & 255, l[u++] = 255 & y, l[u++] = y >>> 24 & 15 | 16, l[u++] = y >>> 16 & 255, l[u++] = f >>> 8 | 128, l[u++] = 255 & f;
                            for (var b = 0; b < 6; ++b) l[u + b] = d[b];
                            return t || a(l)
                        }
                    },
                    171: (e, t, n) => {
                        var r = n(217),
                            i = n(327);
                        e.exports = function (e, t, n) {
                            var o = t && n || 0;
                            "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
                            var a = (e = e || {}).random || (e.rng || r)();
                            if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, t)
                                for (var s = 0; s < 16; ++s) t[o + s] = a[s];
                            return t || i(a)
                        }
                    }
                },
                    t = {};

                function n(r) {
                    var i = t[r];
                    if (void 0 !== i) return i.exports;
                    var o = t[r] = {
                        exports: {}
                    };
                    return e[r].call(o.exports, o, o.exports, n), o.exports
                }
                n.amdO = {}, n.n = e => {
                    var t = e && e.__esModule ? () => e.default : () => e;
                    return n.d(t, {
                        a: t
                    }), t
                }, n.d = (e, t) => {
                    for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                        enumerable: !0,
                        get: t[r]
                    })
                }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
                };
                var r = {};
                return (() => {
                    "use strict";
                    n.r(r), n.d(r, {
                        Analytics: () => x,
                        default: () => k,
                        events: () => e
                    });
                    var e = {};

                    function t(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = arguments[t];
                            for (var r in n) e[r] = n[r]
                        }
                        return e
                    }
                    n.r(e), n.d(e, {
                        ATTRIBUTION_SOURCE_SELECTED: () => h,
                        BUTTON_CLICKED: () => p,
                        ELEMENT_IN_VIEW: () => g,
                        PAGE_SCROLLED: () => m,
                        PAGE_VISITED: () => f,
                        PURCHASE_EVENT: () => v,
                        VIDEO_PLAYBACK_PAUSED: () => d,
                        VIDEO_PLAYBACK_STARTED: () => l
                    });
                    var i = function e(n, r) {
                        function i(e, i, o) {
                            if ("undefined" != typeof document) {
                                "number" == typeof (o = t({}, r, o)).expires && (o.expires = new Date(Date.now() + 864e5 * o.expires)), o.expires && (o.expires = o.expires.toUTCString()), e = encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
                                var a = "";
                                for (var s in o) o[s] && (a += "; " + s, !0 !== o[s] && (a += "=" + o[s].split(";")[0]));
                                return document.cookie = e + "=" + n.write(i, e) + a
                            }
                        }
                        return Object.create({
                            set: i,
                            get: function (e) {
                                if ("undefined" != typeof document && (!arguments.length || e)) {
                                    for (var t = document.cookie ? document.cookie.split("; ") : [], r = {}, i = 0; i < t.length; i++) {
                                        var o = t[i].split("="),
                                            a = o.slice(1).join("=");
                                        try {
                                            var s = decodeURIComponent(o[0]);
                                            if (r[s] = n.read(a, s), e === s) break
                                        } catch (e) { }
                                    }
                                    return e ? r[e] : r
                                }
                            },
                            remove: function (e, n) {
                                i(e, "", t({}, n, {
                                    expires: -1
                                }))
                            },
                            withAttributes: function (n) {
                                return e(this.converter, t({}, this.attributes, n))
                            },
                            withConverter: function (n) {
                                return e(t({}, this.converter, n), this.attributes)
                            }
                        }, {
                            attributes: {
                                value: Object.freeze(r)
                            },
                            converter: {
                                value: Object.freeze(n)
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
                    const o = i;
                    var a = n(877),
                        s = n(563),
                        c = n(238),
                        u = n.n(c);
                    const l = "web_video_playback_started",
                        d = "web_video_playback_paused",
                        f = "web_page_visited",
                        p = "web_button_clicked",
                        h = "attribution_selected",
                        g = "web_element_in_view",
                        m = "web_page_scrolled",
                        v = "web_purchase_event",
                        y = {
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
                        b = {
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
                    class w {
                        constructor(e) {
                            if (this.trackReferenceSource = e => {
                                if (!this.profileId) throw new Error("profile id not found.\nRun setProfileId() before tracking the event");
                                if (!(null == e ? void 0 : e.attributionSource)) throw new Error("attributionSource must be defined");
                                if (!this._hasCookieConsent) return;
                                const {
                                    attributionSource: t,
                                    instrument: n
                                } = e, r = Object.assign({
                                    attribution_source: t,
                                    device_id: (0, a.v4)(),
                                    profile_id: this.profileId
                                }, {
                                    instrument: n
                                });
                                this._queueEvent({
                                    name: h,
                                    body: r
                                })
                            }, !e) throw new Error("[Analytics config] config object is required");
                            const t = {
                                channel: e.channel,
                                xApplicationName: e.xApplicationName
                            };
                            if (Object.values(t).some((e => void 0 === e))) {
                                const e = [];
                                for (const [n, r] of Object.entries(t)) void 0 === r && e.push(n);
                                throw new Error(`[Analytics config] mandatory argument${e.length > 1 ? "s" : ""} undefined: ${e.join(", ")}`)
                            }
                            e.baseUrl, w.initialized, this.config = Object.assign(Object.assign({}, b), e), this.eventsQueue = [], this.UAParser = new (u()), this.profileId = e.profileId, this.isLandingPage = e.isLandingPage, this.landingPageCategory = e.landingPageCategory, this._hasCookieConsent() && !this._getVisitorId() && this._setVisitorCookie(), w.initialized = !0
                        }
                        _callApi(e, t) {
                            const n = new XMLHttpRequest;
                            n.open("POST", e, !1), n.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), n.setRequestHeader("X-Application-Name", this.config.xApplicationName), n.send(JSON.stringify(t))
                        }
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
                            return o.get(e)
                        }
                        _setCookie(e, t) {
                            let n = e.options;
                            if (e.options.expires) {
                                const t = new Date;
                                n = Object.assign(Object.assign({}, n), {
                                    expires: new Date(t.setTime(t.getTime() + 60 * Number(e.options.expires) * 1e3))
                                })
                            }
                            return o.set(e.name, t, n)
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
                                    utm_campaign: n,
                                    utm_content: r,
                                    utm_medium: i,
                                    utm_term: o
                                } = e,
                                a = this.UAParser.getResult(),
                                c = this.profileId,
                                u = window.Leanplum ? window.Leanplum.getVariants().map((e => e.id)).join(",") : void 0,
                                l = this._getReferrer();
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
                                utm_campaign: n,
                                utm_content: r,
                                utm_medium: i,
                                utm_source: t,
                                utm_term: o,
                                referring_url: l,
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
                        _queueEvent(e) {
                            this.eventsQueue.push(e), this._sendQueuedEvents()
                        }
                        _sendQueuedEvents() {
                            if (!this.sendingEvents && this.eventsQueue.length && this._hasCookieConsent()) {
                                for (this.sendingEvents = !0; this.eventsQueue.length > 0;) {
                                    const e = this.eventsQueue.shift();
                                    this._callApi(`${this.config.baseUrl}/web_events/new/${e.name}`, this._prepareHttpParams(e.body))
                                }
                                this.sendingEvents = !1
                            }
                        }
                        trackPageVisit(e, t = 200) {
                            if (!e) throw new Error("pathName must be specified");
                            const n = this.redirectedFrom,
                                r = this.isLandingPage,
                                i = this.landingPageCategory,
                                o = {
                                    initial_referral: window.document.referrer,
                                    initial_referral_domain: self.origin
                                },
                                a = "2" === t.toString().charAt(0),
                                s = {
                                    success: a,
                                    error_message: a ? "" : y[t]
                                },
                                c = Object.assign(Object.assign(Object.assign({
                                    title: document.title,
                                    page: this._strSlugify(e.replace(/\//g, "-")),
                                    path: e
                                }, s), o), {
                                    redirected_from: n,
                                    is_landing_page: r,
                                    landing_page_category: i
                                });
                            this.redirectedFrom = void 0, this._queueEvent({
                                name: f,
                                body: c
                            })
                        }
                        trackPageScroll() {
                            const e = this.isLandingPage,
                                t = this.landingPageCategory,
                                n = Object.assign({
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
                            const i = e => {
                                const t = e => {
                                    r = {
                                        reached25Percent: 25 === e,
                                        reached50Percent: 50 === e,
                                        reached75Percent: 75 === e,
                                        reached100Percent: 100 === e
                                    }, 0 !== e && (n.scrolled = e, this._queueEvent({
                                        name: m,
                                        body: n
                                    }))
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
                                        t(75), n.scrolled = 75;
                                        break;
                                    case e >= 100 && !r.reached100Percent:
                                        t(100), n.scrolled = 100
                                }
                            };
                            document.addEventListener("scroll", (() => {
                                const e = (() => {
                                    const e = window.scrollY / (document.body.offsetHeight - window.innerHeight);
                                    return Math.round(100 * e)
                                })();
                                i(e)
                            }))
                        }
                        trackPurchaseEvent(e) {
                            this._queueEvent({
                                name: v,
                                body: e
                            })
                        }
                        trackClick(e) {
                            if (!this._hasCookieConsent()) return;
                            (null == e ? void 0 : e.name) && (e.name = e.name.toLowerCase()), (null == e ? void 0 : e.context) && (e.context = e.context.toLowerCase());
                            const t = this.isLandingPage,
                                n = this.landingPageCategory;
                            e = Object.assign(Object.assign({}, e), {
                                is_landing_page: t,
                                landing_page_category: n
                            }), this._queueEvent({
                                name: p,
                                body: e
                            })
                        }
                        trackElementInView(e) {
                            if (!this._hasCookieConsent()) return;
                            const t = this.isLandingPage,
                                n = this.landingPageCategory,
                                r = document.querySelector(`#${e.id}`);
                            new IntersectionObserver((r => {
                                r.forEach((r => {
                                    r.isIntersecting && (e = Object.assign(Object.assign({}, e), {
                                        is_landing_page: t,
                                        landing_page_category: n
                                    }), this._queueEvent({
                                        name: g,
                                        body: e
                                    }))
                                }))
                            }), {
                                root: null,
                                threshold: 1
                            }).observe(r)
                        }
                        trackVideoEvent(e) {
                            const t = [l, d];
                            if (!e) throw new Error("parameters must be specified");
                            const {
                                attributes: n,
                                eventType: r,
                                videoId: i,
                                videoTitle: o,
                                sessionId: s,
                                trackWordPressSection: c,
                                domElement: u
                            } = e;
                            if (!Object.values(t).includes(r)) throw new Error(`Unsupported event type. Allowed events:\n${t.join(",\n")}`);
                            if (!n) throw new Error("Attributes must be specified.");
                            if (["src", "currentTime", "totalDuration", "autoPlay", "muted"].forEach((e => {
                                if (void 0 === n[e]) throw new Error(`Needed video attribute ${e} is not defined. Please include it in "attributes".`)
                            })), !this._hasCookieConsent()) return;
                            if (c && !u) throw new Error("DOM video element must be specified to track the ACF section.");
                            const f = i || n.src;
                            this.trackedVideos || (this.trackedVideos = {});
                            let p = this.trackedVideos[f];
                            if (!p) {
                                const e = c && u.closest("[class*='section-']") && u.closest("[class*='section-']").className.match(/section-[^\s]*/i)[0] || void 0,
                                    t = o;
                                p = Object.assign({
                                    web_video_content_src: n.src,
                                    web_video_content_id: f,
                                    web_video_content_total_duration: n.totalDuration,
                                    web_video_playback_autoplay: n.autoPlay,
                                    web_video_playback_muted: n.muted,
                                    web_video_playback_session_id: s || (0, a.v4)(),
                                    web_video_playback_position: n.currentTime
                                }, {
                                    web_video_player_position: e,
                                    web_video_content_title: t
                                }), this.trackedVideos[f] = p
                            }
                            p.web_video_playback_position = n.currentTime, this._queueEvent({
                                name: r,
                                body: p
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
                    w.initialized = !1;
                    const x = w,
                        k = w
                })(), r
            })()
        }
    },
        t = {};

    function n(r) {
        var i = t[r];
        if (void 0 !== i) return i.exports;
        var o = t[r] = {
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.exports
    }
    n.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return n.d(t, {
            a: t
        }), t
    }, n.d = (e, t) => {
        for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        "use strict";
        var e = n(755),
            t = n.n(e);

        function r(e, t) {
            t || (t = window.location.href), e = e.replace(/[[]]/g, "\\$&");
            var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
            return n ? n[2] ? decodeURIComponent(n[2].replace(/\+/g, " ")) : "" : null
        }
        var i = n(755);

        function o() {
            const e = "https://boards-api.greenhouse.io/v1/boards/yousician",
                t = e + "/jobs/",
                n = `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}${location.pathname}`;
            var o = i("#offices"),
                a = i("#departments"),
                s = i("#jobs"),
                c = i("#no-match"),
                u = null,
                l = null,
                d = "All locations",
                f = "All departments",
                p = 250,
                h = {
                    office: d,
                    department: f
                };

            function g(e) {
                h.office = e.target.value, v(x(), s)
            }

            function m(e) {
                h.department = e.target.value, v(x(), s)
            }

            function v(e, t) {
                0 !== e.length ? c.finish().fadeOut(p, (function () {
                    s.finish().fadeOut(p, (function () {
                        t.html('<div class="whr-items">' + e.map(b).join("") + "</div>"), s.finish().fadeIn(p), i(".whr-title .title").click((function (e) {
                            ! function (e) {
                                var t = i(e.target),
                                    n = t.parents(".job-description");
                                if (t.hasClass("job-description") || n.length > 0) return;
                                var r = t.closest(".whr-item-container");
                                y({
                                    jobId: r.attr("job-id"),
                                    itemContainer: r
                                })
                            }(e)
                        }))
                    }))
                })) : s.finish().fadeOut(p, (function () {
                    c.finish().fadeIn(p)
                }))
            }

            function y({
                jobId: e,
                itemContainer: n = null,
                scroll: r = !1
            }) {
                var o = n;
                o || (o = i(".whr-item-container[job-id=" + e + "]"));
                var a = o.find(".job-description");
                "" == a.html() ? function (e) {
                    var n = l.find((function (t) {
                        return t.id == e
                    }));
                    if (null != n.details) {
                        var r = i.Deferred();
                        return r.resolve(n.details), r.promise()
                    }
                    return i.ajax(t + e).then((function (e) {
                        return n.details = e, e
                    }))
                }(e).then((function (t) {
                    var n = i("<p/>").html(t.content).text();
                    a.html(n), a.fadeIn(p), r && k(".whr-item-container[job-id=" + e + "]")
                })) : "block" === a.css("display") ? a.fadeOut(p) : a.fadeIn(p)
            }

            function b(e) {
                return '<div class="whr-item-container" job-id="' + e.id + '"><div class="whr-item"><h3 class="whr-title"><a onclick="javascript:return false;" href="' + n + "?job=" + e.id + "&" + function (e) {
                    if (!e) return;
                    return e.toLowerCase().replace(/\s/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/gi, "").replace(/_/gi, "-")
                }(e.title) + '"><div class="title">' + e.title + '</div><div class="department">' + e.department + '</div></a></h3><div class="whr-info"><div class="whr-location"><span>Location:</span> ' + e.location.name + '</div><a class="button -medium -filled -light applyButton" target="_blank" href="' + e.absolute_url + '#app">Apply</a></div></div><div class="job-description"></div></div>'
            }

            function w(e, t) {
                var n = e.find("select");
                t.map((function (e) {
                    n.append(new Option(e.name, e.name))
                }))
            }

            function x() {
                if (h.office === d && h.department === f) return l;
                var e = l;
                return h.office !== d && (e = e.filter((function (e) {
                    return e.location.name.match(h.office)
                }))), h.department !== f && (e = e.filter((function (e) {
                    return e.department === h.department
                }))), e
            }

            function k(e) {
                window.scroll({
                    top: i(e).offset().top - 200,
                    behavior: "smooth"
                })
            }
            i('.btn[href$="#joinTheBand"]').click((function (e) {
                e.preventDefault(), k("#job_board")
            })), i(document).ready((function () {
                var t = i("#job_board");
                t.length > 0 && function (t) {
                    setTimeout((function () {
                        var n;
                        i.ajax(e + "/offices").then((function (e) {
                            var t = e.offices.filter((function (e) {
                                return "No Office" !== e.name
                            })).map((function (e) {
                                return {
                                    name: e.name,
                                    id: e.id
                                }
                            }));
                            return t.unshift({
                                name: d,
                                id: 0
                            }), t
                        })).then((function (e) {
                            w(o, e), o.find("select").change("change", g)
                        })), (n = ["TEMPLATES", "No Department"], i.ajax(e + "/departments").then((function (e) {
                            return e.departments.filter((function (e) {
                                return -1 === n.indexOf(e.name)
                            })).reduce((function (e, t) {
                                const n = [...e.departments, {
                                    id: t.id,
                                    name: t.name
                                }];
                                let r = e.jobs;
                                return t.jobs.length && (r = e.jobs.concat(t.jobs.map((function (e) {
                                    return e.department = t.name, e
                                })))), {
                                    departments: n,
                                    jobs: r
                                }
                            }), {
                                departments: [{
                                    name: f,
                                    id: 0
                                }],
                                jobs: []
                            })
                        }))).then((function (e) {
                            u = e.departments, l = e.jobs, w(a, u), a.find("select").change("change", m), v(x(), s), i("#loading-openings").fadeOut(p), t.fadeIn();
                            var n = r("job");
                            n && y({
                                jobId: n,
                                scroll: !0
                            })
                        }))
                    }), 200)
                }(t)
            }))
        }

        function a() {
            document.querySelectorAll('a[href^="https://yousician.onelink.me"], a[href^="https://guitartuna.onelink.me"]').forEach((e => {
                const t = function (e, t) {
                    var n, i = e.match(/.*\.onelink\.me\/[^/?]*/),
                        o = "",
                        a = "?pid=";
                    n = r("af_c") ? r("af_c") : r("utm_campaign") ? r("utm_campaign") : document.getElementsByTagName("title")[0] ? document.getElementsByTagName("title")[0].innerText : "unknown";
                    var s, c = "&c=",
                        u = "&af_sub1=",
                        l = r("gclid"),
                        d = "&af_keywords=",
                        f = r("keyword");
                    r("af_pid") ? s = r("af_pid") : r("utm_source") && (s = r("utm_source"));
                    if (["twitter_int", "facebook_int", "snapchat_int", "doubleclick_int", "yahoogemini_int", "yahoojapan_int"].includes(s)) return alert("DO NOT USE NAMES OF SRNS IN af_pid or utm_source - use the names listed in Other SRNs: Add Parameter section in the landing page article\nhttps://support.appsflyer.com/hc/en-us/articles/360000677217#other-srns-add-parameter"), e;
                    if (void 0 === window.orientation && -1 === navigator.userAgent.indexOf("IEMobile")) return e;
                    if (r("af_redirect")) return t && alert("This user comes from AppsFlyer by redirection and is ready to be attributed. \nKeep direct app store links."), e;
                    return l ? (a += "google_lp", c += n, u += l, f ? (o = i + a + c + u + (d += f), t && alert("This user comes from Google AdWords - there is a keyword associated with the ad\n " + o), o) : (o = i + a + c + u, t && alert("This user comes from Google AdWords\n " + o), o)) : s ? (o = i + (a += s) + (c += n), t && alert("This user comes the SRN or custom network " + s + "\n" + o), o) : document.referrer && "" != document.referrer && document.referrer.toLowerCase().includes("facebook") ? (t && alert("This user comes from a paid Facebook ad - don't do anything. \nKeep direct app store links."), e) : (t && alert("This user comes from an unknown mobile source.\n The onelink url will stay the same " + e), e)
                }(e.href);
                e.href = t
            }))
        }
        var s = n(755);

        function c() {
            window.addEventListener("appsFlyerSDKLoaded", (function () {
                window.showSmartBanner()
            }), !1);
            let e = null;

            function t() {
                return s("#onetrust-accept-btn-handler, .save-preference-btn-handler, #accept-recommended-btn-handler")
            }
            window.performanceCookiesActivatedHandler = function () { }, window.targetingCookiesActivatedHandler = function () {
                window.loadAppsFlyerSDK && window.loadAppsFlyerSDK()
            },
                function e(t, n, r = 10) {
                    t() ? n() : r > 0 && setTimeout((function () {
                        e(t, n, r - 1)
                    }), 250)
                }((function () {
                    return e = s(".cookie-settings-footer"), e.length > 0
                }), (function () {
                    e.click((function () {
                        t().off("click"), t().click((function () {
                            window.location.reload()
                        }))
                    }))
                }))
        }
        var u = n(708);

        // function l(e) {
        //     var t = JSON.parse(e.dataset.tracking);
        //     // window.ysAnalytics.trackClick(t)
        // }
        const d = () => {
            document.querySelectorAll("[data-tracking]").forEach((function (e) {
                ! function (e) {
                    var t = JSON.parse(e.dataset.tracking),
                        n = e.id;
                    const r = {
                        id: n,
                        ...t
                    };
                    n && window.ysAnalytics.trackElementInView(r)
                }(e), e.addEventListener("auxclick", (function () {
                    l(e)
                }))
            })), (() => {
                const e = document.querySelectorAll("video");
                if (!e.length) return;
                Array.from(e).filter((e => !e.autoplay)).forEach((e => {
                    const t = e => {
                        const t = e.target;
                        return {
                            attributes: {
                                src: t.src,
                                currentTime: t.currentTime,
                                totalDuration: t.duration,
                                muted: t.muted,
                                autoPlay: !1
                            },
                            domElement: t,
                            trackWordPressSection: !0,
                            videoId: t.id
                        }
                    };
                    e.addEventListener("play", (e => window.ysAnalytics.trackVideoEvent({
                        ...t(e),
                        eventType: u.events.VIDEO_PLAYBACK_STARTED
                    }))), e.addEventListener("pause", (e => window.ysAnalytics.trackVideoEvent({
                        ...t(e),
                        eventType: u.events.VIDEO_PLAYBACK_PAUSED
                    })))
                }))
            })(), (() => {
                const e = document.querySelectorAll("iframe");
                if (!e.length) return;
                let t = Array.from(e).filter((e => (e.src && e.src.match(/youtube(-nocookie)?.com\/embed/i) || !!(e.dataset && e.dataset.src && e.dataset.src.match(/youtube(-nocookie)?.com\/embed/i))) && !e.autoplay));
                if (!t.length) return;
                const n = document.createElement("script"),
                    r = document.getElementsByTagName("script")[0];
                n.src = "https://www.youtube.com/iframe_api", n.async = !0, r.parentNode.insertBefore(n, r), window.onYouTubeIframeAPIReady = () => {
                    t.forEach((e => {
                        let t = e.src || e.dataset.src;
                        t.match(/enablejsapi=1/i) || (t = `${t}${t.match(/\?/i) ? "&" : "?"}enablejsapi=1`), e.dataset.src ? e.dataset.src = t : e.src = t, e.dataset.src && (e.src = e.dataset.src), e.id = e.src, new window.YT.Player(e.id, {
                            events: {
                                onStateChange: i
                            }
                        })
                    }))
                };
                const i = e => {
                    const t = e.data,
                        n = e.target,
                        r = {
                            currentTime: n.playerInfo.currentTime,
                            totalDuration: n.playerInfo.duration,
                            src: n.getVideoUrl(),
                            muted: n.playerInfo.muted,
                            autoPlay: !1
                        };
                    switch (t) {
                        case 1:
                            window.ysAnalytics.trackVideoEvent({
                                eventType: u.events.VIDEO_PLAYBACK_STARTED,
                                attributes: r
                            });
                            break;
                        case 2:
                        case 0:
                            window.ysAnalytics.trackVideoEvent({
                                eventType: u.events.VIDEO_PLAYBACK_PAUSED,
                                attributes: r
                            })
                    }
                }
            })(), window.ysAnalytics.trackPageScroll()
        };

        function f() {
            return document.querySelector(".search-field")
        }

        function p(e, t) {
            return Array.from(e.classList).filter((e => e == t)).length > 0
        }
        const h = () => {
            document.querySelectorAll(".-search").forEach((e => {
                e.addEventListener("click", (function () {
                    p(e, "-hidden") || function () {
                        const e = document.querySelector("#search-dialog");
                        if (!e) return;
                        e.classList.toggle("-visible");
                        const t = p(e, "-visible"),
                            n = f();
                        n && (t ? (n.focus({
                            preventScroll: !0
                        }), n.selectionStart = n.selectionEnd = n.value.length) : document.activeElement.blur())
                    }()
                }))
            }));
            const e = document.querySelector("#search-close-button");
            e && e.addEventListener("click", (function () {
                const e = f();
                e && (e.value = "")
            }))
        };
        var g = function () {
            return g = Object.assign || function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }, g.apply(this, arguments)
        };

        function m(e, t, n) {
            if (n || 2 === arguments.length)
                for (var r, i = 0, o = t.length; i < o; i++) !r && i in t || (r || (r = Array.prototype.slice.call(t, 0, i)), r[i] = t[i]);
            return e.concat(r || Array.prototype.slice.call(t))
        }

        function v(e) {
            return Array.prototype.slice.call(e)
        }

        function y(e, t) {
            var n = Math.floor(e);
            return n === t || n + 1 === t ? e : t
        }

        function b() {
            return Date.now()
        }

        function w(e, t, n) {
            if (t = "data-keen-slider-" + t, null === n) return e.removeAttribute(t);
            e.setAttribute(t, n || "")
        }

        function x(e, t) {
            return t = t || document, "function" == typeof e && (e = e(t)), Array.isArray(e) ? e : "string" == typeof e ? v(t.querySelectorAll(e)) : e instanceof HTMLElement ? [e] : e instanceof NodeList ? v(e) : []
        }

        function k(e) {
            e.raw && (e = e.raw), e.cancelable && !e.defaultPrevented && e.preventDefault()
        }

        function T(e) {
            e.raw && (e = e.raw), e.stopPropagation && e.stopPropagation()
        }

        function C() {
            var e = [];
            return {
                add: function (t, n, r, i) {
                    t.addListener ? t.addListener(r) : t.addEventListener(n, r, i), e.push([t, n, r, i])
                },
                input: function (e, t, n, r) {
                    this.add(e, t, function (e) {
                        return function (t) {
                            t.nativeEvent && (t = t.nativeEvent);
                            var n = t.changedTouches || [],
                                r = t.targetTouches || [],
                                i = t.detail && t.detail.x ? t.detail : null;
                            return e({
                                id: i ? i.identifier ? i.identifier : "i" : r[0] ? r[0] ? r[0].identifier : "e" : "d",
                                idChanged: i ? i.identifier ? i.identifier : "i" : n[0] ? n[0] ? n[0].identifier : "e" : "d",
                                raw: t,
                                x: i && i.x ? i.x : r[0] ? r[0].screenX : i ? i.x : t.pageX,
                                y: i && i.y ? i.y : r[0] ? r[0].screenY : i ? i.y : t.pageY
                            })
                        }
                    }(n), r)
                },
                purge: function () {
                    e.forEach((function (e) {
                        e[0].removeListener ? e[0].removeListener(e[2]) : e[0].removeEventListener(e[1], e[2], e[3])
                    })), e = []
                }
            }
        }

        function E(e, t, n) {
            return Math.min(Math.max(e, t), n)
        }

        function S(e) {
            return (e > 0 ? 1 : 0) - (e < 0 ? 1 : 0) || +e
        }

        function A(e) {
            var t = e.getBoundingClientRect();
            return {
                height: y(t.height, e.offsetHeight),
                width: y(t.width, e.offsetWidth)
            }
        }

        function _(e, t, n, r) {
            var i = e && e[t];
            return null == i ? n : r && "function" == typeof i ? i() : i
        }

        function j(e) {
            return Math.round(1e6 * e) / 1e6
        }

        function D(e) {
            var t, n, r, i, o, a, s, c, u, l, d, f, p, h, g = 1 / 0,
                v = [],
                y = null,
                w = 0;

            function x(e) {
                L(w + e)
            }

            function k(e) {
                var t = T(w + e).abs;
                return D(t) ? t : null
            }

            function T(e) {
                var t = Math.floor(Math.abs(j(e / n))),
                    r = j((e % n + n) % n);
                r === n && (r = 0);
                var i = S(e),
                    o = s.indexOf(m([], s, !0).reduce((function (e, t) {
                        return Math.abs(t - r) < Math.abs(e - r) ? t : e
                    }))),
                    c = o;
                return i < 0 && t++, o === a && (c = 0, t += i > 0 ? 1 : -1), {
                    abs: c + t * a * i,
                    origin: o,
                    rel: c
                }
            }

            function C(e, t, n) {
                var r;
                if (t || !N()) return A(e, n);
                if (!D(e)) return null;
                var i = T(null != n ? n : w),
                    o = i.abs,
                    s = e - i.rel,
                    c = o + s;
                r = A(c);
                var u = A(c - a * S(s));
                return (null !== u && Math.abs(u) < Math.abs(r) || null === r) && (r = u), j(r)
            }

            function A(e, t) {
                if (null == t && (t = j(w)), !D(e) || null === e) return null;
                e = Math.round(e);
                var r = T(t),
                    i = r.abs,
                    o = r.rel,
                    c = r.origin,
                    u = q(e),
                    l = (t % n + n) % n,
                    d = s[c],
                    f = Math.floor((e - (i - o)) / a) * n;
                return j(d - l - d + s[u] + f + (c === a ? n : 0))
            }

            function D(e) {
                return O(e) === e
            }

            function O(e) {
                return E(e, u, l)
            }

            function N() {
                return i.loop
            }

            function q(e) {
                return (e % a + a) % a
            }

            function L(t) {
                var n;
                n = t - w, v.push({
                    distance: n,
                    timestamp: b()
                }), v.length > 6 && (v = v.slice(-6)), w = j(t);
                var r = P().abs;
                if (r !== y) {
                    var i = null !== y;
                    y = r, i && e.emit("slideChanged")
                }
            }

            function P(s) {
                var c = s ? null : function () {
                    if (a) {
                        var e = N(),
                            t = e ? (w % n + n) % n : w,
                            s = (e ? w % n : w) - o[0][2],
                            c = 0 - (s < 0 && e ? n - Math.abs(s) : s),
                            g = 0,
                            m = T(w),
                            v = m.abs,
                            y = m.rel,
                            b = o[y][2],
                            x = o.map((function (t, r) {
                                var o = c + g;
                                (o < 0 - t[0] || o > 1) && (o += (Math.abs(o) > n - 1 && e ? n : 0) * S(-o));
                                var s = r - y,
                                    u = S(s),
                                    l = s + v;
                                e && (-1 === u && o > b && (l += a), 1 === u && o < b && (l -= a), null !== d && l < d && (o += n), null !== f && l > f && (o -= n));
                                var p = o + t[0] + t[1],
                                    h = Math.max(o >= 0 && p <= 1 ? 1 : p < 0 || o > 1 ? 0 : o < 0 ? Math.min(1, (t[0] + o) / t[0]) : (1 - o) / t[0], 0);
                                return g += t[0] + t[1], {
                                    abs: l,
                                    distance: i.rtl ? -1 * o + 1 - t[0] : o,
                                    portion: h,
                                    size: t[0]
                                }
                            }));
                        return v = O(v), y = q(v), {
                            abs: O(v),
                            length: r,
                            max: h,
                            maxIdx: l,
                            min: p,
                            minIdx: u,
                            position: w,
                            progress: e ? t / n : w / r,
                            rel: y,
                            slides: x,
                            slidesLength: n
                        }
                    }
                }();
                return t.details = c, e.emit("detailsChanged"), c
            }
            return t = {
                absToRel: q,
                add: x,
                details: null,
                distToIdx: k,
                idxToDist: C,
                init: function (t) {
                    if (function () {
                        if (i = e.options, o = (i.trackConfig || []).map((function (e) {
                            return [_(e, "size", 1), _(e, "spacing", 0), _(e, "origin", 0)]
                        })), a = o.length) {
                            n = j(o.reduce((function (e, t) {
                                return e + t[0] + t[1]
                            }), 0));
                            var t, u = a - 1;
                            r = j(n + o[0][2] - o[u][0] - o[u][2] - o[u][1]), s = o.reduce((function (e, n) {
                                if (!e) return [0];
                                var r = o[e.length - 1],
                                    i = e[e.length - 1] + (r[0] + r[2]) + r[1];
                                return i -= n[2], e[e.length - 1] > i && (i = e[e.length - 1]), i = j(i), e.push(i), (!t || t < i) && (c = e.length - 1), t = i, e
                            }), null), 0 === r && (c = 0), s.push(j(n))
                        }
                    }(), !a) return P(!0);
                    var m;
                    ! function () {
                        var t = e.options.range,
                            n = e.options.loop;
                        d = u = n ? _(n, "min", -1 / 0) : 0, f = l = n ? _(n, "max", g) : c;
                        var r = _(t, "min", null),
                            i = _(t, "max", null);
                        null !== r && (u = r), null !== i && (l = i), p = u === -1 / 0 ? u : e.track.idxToDist(u || 0, !0, 0), h = l === g ? l : C(l, !0, 0), null === i && (f = l), _(t, "align", !1) && l !== g && 0 === o[q(l)][2] && (h -= 1 - o[q(l)][0], l = k(h - w)), p = j(p), h = j(h)
                    }(), m = t, Number(m) === m ? x(A(O(t))) : P()
                },
                to: L,
                velocity: function () {
                    var e = b(),
                        t = v.reduce((function (t, n) {
                            var r = n.distance,
                                i = n.timestamp;
                            return e - i > 200 || (S(r) !== S(t.distance) && t.distance && (t = {
                                distance: 0,
                                lastTimestamp: 0,
                                time: 0
                            }), t.time && (t.distance += r), t.lastTimestamp && (t.time += i - t.lastTimestamp), t.lastTimestamp = i), t
                        }), {
                            distance: 0,
                            lastTimestamp: 0,
                            time: 0
                        });
                    return t.distance / t.time || 0
                }
            }
        }

        function O(e) {
            var t, n, r, i, o, a, s, c;

            function u(e) {
                return 2 * e
            }

            function l(e) {
                return E(e, s, c)
            }

            function d(e) {
                return 1 - Math.pow(1 - e, 3)
            }

            function f() {
                return r ? e.track.velocity() : 0
            }

            function p(e, t) {
                void 0 === t && (t = 1e3);
                var n = 147e-9 + (e = Math.abs(e)) / t;
                return {
                    dist: Math.pow(e, 2) / n,
                    dur: e / n
                }
            }

            function h() {
                var t = e.track.details;
                t && (o = t.min, a = t.max, s = t.minIdx, c = t.maxIdx)
            }

            function g() {
                e.animator.stop()
            }
            e.on("updated", h), e.on("optionsChanged", h), e.on("created", h), e.on("dragStarted", (function () {
                r = !1, g(), t = n = e.track.details.abs
            })), e.on("dragChecked", (function () {
                r = !0
            })), e.on("dragEnded", (function () {
                var r = e.options.mode;
                "snap" === r && function () {
                    var r = e.track,
                        i = e.track.details,
                        s = i.position,
                        c = S(f());
                    (s > a || s < o) && (c = 0);
                    var u = t + c;
                    0 === i.slides[r.absToRel(u)].portion && (u -= c), t !== n && (u = n), S(r.idxToDist(u, !0)) !== c && (u += c), u = l(u);
                    var d = r.idxToDist(u, !0);
                    e.animator.start([{
                        distance: d,
                        duration: 500,
                        easing: function (e) {
                            return 1 + --e * e * e * e * e
                        }
                    }])
                }(), "free" !== r && "free-snap" !== r || function () {
                    g();
                    var t = "free-snap" === e.options.mode,
                        n = e.track,
                        r = f();
                    i = S(r);
                    var s = e.track.details,
                        c = [];
                    if (r || !t) {
                        var h = p(r),
                            m = h.dist,
                            v = h.dur;
                        if (v = u(v), m *= i, t) {
                            var y = n.idxToDist(n.distToIdx(m), !0);
                            y && (m = y)
                        }
                        c.push({
                            distance: m,
                            duration: v,
                            easing: d
                        });
                        var b = s.position,
                            w = b + m;
                        if (w < o || w > a) {
                            var x = w < o ? o - b : a - b,
                                k = 0,
                                T = r;
                            if (S(x) === i) {
                                var C = Math.min(Math.abs(x) / Math.abs(m), 1),
                                    E = function (e) {
                                        return 1 - Math.pow(1 - e, 1 / 3)
                                    }(C) * v;
                                c[0].earlyExit = E, T = r * (1 - C)
                            } else c[0].earlyExit = 0, k += x;
                            var A = p(T, 100),
                                _ = A.dist * i;
                            e.options.rubberband && (c.push({
                                distance: _,
                                duration: u(A.dur),
                                easing: d
                            }), c.push({
                                distance: -_ + k,
                                duration: 500,
                                easing: d
                            }))
                        }
                        e.animator.start(c)
                    } else e.moveToIdx(l(s.abs), !0, {
                        duration: 500,
                        easing: function (e) {
                            return 1 + --e * e * e * e * e
                        }
                    })
                }()
            })), e.on("dragged", (function () {
                n = e.track.details.abs
            }))
        }

        function N(e) {
            var t, n, r, i, o, a, s, c, u, l, d, f, p, h, g, m, v, y, b = C();

            function w(t) {
                if (a && c === t.id) {
                    var p = D(t);
                    if (u) {
                        if (!j(t)) return _(t);
                        l = p, u = !1, e.emit("dragChecked")
                    }
                    if (m) return l = p;
                    k(t);
                    var h = function (t) {
                        if (v === -1 / 0 && y === 1 / 0) return t;
                        var r = e.track.details,
                            a = r.length,
                            s = r.position,
                            c = E(t, v - s, y - s);
                        if (0 === a) return 0;
                        if (!e.options.rubberband) return c;
                        if (s <= y && s >= v) return t;
                        if (s < v && n > 0 || s > y && n < 0) return t;
                        var u = (s < v ? s - v : s - y) / a,
                            l = i * a,
                            d = Math.abs(u * l),
                            f = Math.max(0, 1 - d / o * 2);
                        return f * f * t
                    }(s(l - p) / i * r);
                    n = S(h);
                    var g = e.track.details.position;
                    (g > v && g < y || g === v && n > 0 || g === y && n < 0) && T(t), d += h, !f && Math.abs(d * i) > 5 && (f = !0), e.track.add(h), l = p, e.emit("dragged")
                }
            }

            function A(t) {
                !a && e.track.details && e.track.details.length && (d = 0, a = !0, f = !1, u = !0, c = t.id, j(t), l = D(t), e.emit("dragStarted"))
            }

            function _(t) {
                a && c === t.idChanged && (a = !1, e.emit("dragEnded"))
            }

            function j(e) {
                var t = O(),
                    n = t ? e.y : e.x,
                    r = t ? e.x : e.y,
                    i = void 0 !== p && void 0 !== h && Math.abs(h - r) <= Math.abs(p - n);
                return p = n, h = r, i
            }

            function D(e) {
                return O() ? e.y : e.x
            }

            function O() {
                return e.options.vertical
            }

            function N() {
                i = e.size, o = O() ? window.innerHeight : window.innerWidth;
                var t = e.track.details;
                t && (v = t.min, y = t.max)
            }

            function q(e) {
                f && (T(e), k(e))
            }

            function L() {
                if (b.purge(), e.options.drag && !e.options.disabled) {
                    var n;
                    n = e.options.dragSpeed || 1, s = "function" == typeof n ? n : function (e) {
                        return e * n
                    }, r = e.options.rtl ? -1 : 1, N(), t = e.container,
                        function () {
                            var e = "data-keen-slider-clickable";
                            x("[".concat(e, "]:not([").concat(e, "=false])"), t).map((function (e) {
                                b.add(e, "dragstart", T), b.add(e, "mousedown", T), b.add(e, "touchstart", T)
                            }))
                        }(), b.add(t, "dragstart", (function (e) {
                            k(e)
                        })), b.add(t, "click", q, {
                            capture: !0
                        }), b.input(t, "ksDragStart", A), b.input(t, "ksDrag", w), b.input(t, "ksDragEnd", _), b.input(t, "mousedown", A), b.input(t, "mousemove", w), b.input(t, "mouseleave", _), b.input(t, "mouseup", _), b.input(t, "touchstart", A, {
                            passive: !0
                        }), b.input(t, "touchmove", w, {
                            passive: !1
                        }), b.input(t, "touchend", _), b.input(t, "touchcancel", _), b.add(window, "wheel", (function (e) {
                            a && k(e)
                        }));
                    var i = "data-keen-slider-scrollable";
                    x("[".concat(i, "]:not([").concat(i, "=false])"), e.container).map((function (e) {
                        return function (e) {
                            var t;
                            b.input(e, "touchstart", (function (e) {
                                t = D(e), m = !0, g = !0
                            }), {
                                passive: !0
                            }), b.input(e, "touchmove", (function (n) {
                                var r = O(),
                                    i = r ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth,
                                    o = t - D(n),
                                    a = r ? e.scrollTop : e.scrollLeft,
                                    s = r && "scroll" === e.style.overflowY || !r && "scroll" === e.style.overflowX;
                                if (t = D(n), (o < 0 && a > 0 || o > 0 && a < i) && g && s) return m = !0;
                                g = !1, k(n), m = !1
                            })), b.input(e, "touchend", (function () {
                                m = !1
                            }))
                        }(e)
                    }))
                }
            }
            e.on("updated", N), e.on("optionsChanged", L), e.on("created", L), e.on("destroyed", b.purge)
        }

        function q(e) {
            var t, n, r = null;

            function i(t, n, r) {
                e.animator.active ? a(t, n, r) : requestAnimationFrame((function () {
                    return a(t, n, r)
                }))
            }

            function o() {
                i(!1, !1, n)
            }

            function a(n, i, o) {
                var a = 0,
                    s = e.size,
                    l = e.track.details;
                if (l && t) {
                    var d = l.slides;
                    t.forEach((function (e, t) {
                        if (n) !r && i && c(e, null, o), u(e, null, o);
                        else {
                            if (!d[t]) return;
                            var l = d[t].size * s;
                            !r && i && c(e, l, o), u(e, d[t].distance * s - a, o), a += l
                        }
                    }))
                }
            }

            function s(t) {
                return "performance" === e.options.renderMode ? Math.round(t) : t
            }

            function c(e, t, n) {
                var r = n ? "height" : "width";
                null !== t && (t = s(t) + "px"), e.style["min-" + r] = t, e.style["max-" + r] = t
            }

            function u(e, t, n) {
                if (null !== t) {
                    t = s(t);
                    var r = n ? t : 0;
                    t = "translate3d(".concat(n ? 0 : t, "px, ").concat(r, "px, 0)")
                }
                e.style.transform = t, e.style["-webkit-transform"] = t
            }

            function l() {
                t && (a(!0, !0, n), t = null), e.on("detailsChanged", o, !0)
            }

            function d() {
                i(!1, !0, n)
            }

            function f() {
                l(), n = e.options.vertical, e.options.disabled || "custom" === e.options.renderMode || (r = "auto" === _(e.options.slides, "perView", null), e.on("detailsChanged", o), (t = e.slides).length && d())
            }
            e.on("created", f), e.on("optionsChanged", f), e.on("beforeOptionsChanged", (function () {
                l()
            })), e.on("updated", d), e.on("destroyed", l)
        }

        function L(e, t) {
            return function (n) {
                var r, i, o, a, s, c = C();

                function u(e) {
                    var t;
                    w(n.container, "reverse", "rtl" !== (t = n.container, window.getComputedStyle(t, null).getPropertyValue("direction")) || e ? null : ""), w(n.container, "v", n.options.vertical && !e ? "" : null), w(n.container, "disabled", n.options.disabled && !e ? "" : null)
                }

                function l() {
                    d() && v()
                }

                function d() {
                    var e = null;
                    if (a.forEach((function (t) {
                        t.matches && (e = t.__media)
                    })), e === r) return !1;
                    r || n.emit("beforeOptionsChanged"), r = e;
                    var t = e ? o.breakpoints[e] : o;
                    return n.options = g(g({}, o), t), u(), E(), S(), b(), !0
                }

                function f(e) {
                    var t = A(e);
                    return (n.options.vertical ? t.height : t.width) / n.size || 1
                }

                function p() {
                    return n.options.trackConfig.length
                }

                function h(e) {
                    for (var s in r = !1, o = g(g({}, t), e), c.purge(), i = n.size, a = [], o.breakpoints || []) {
                        var u = window.matchMedia(s);
                        u.__media = s, a.push(u), c.add(u, "change", l)
                    }
                    c.add(window, "orientationchange", T), c.add(window, "resize", k), d()
                }

                function m(e) {
                    n.animator.stop();
                    var t = n.track.details;
                    n.track.init(null != e ? e : t ? t.abs : 0)
                }

                function v(e) {
                    m(e), n.emit("optionsChanged")
                }

                function y(e, t) {
                    if (e) return h(e), void v(t);
                    E(), S();
                    var r = p();
                    b(), p() !== r ? v(t) : m(t), n.emit("updated")
                }

                function b() {
                    var e = n.options.slides;
                    if ("function" == typeof e) return n.options.trackConfig = e(n.size, n.slides);
                    for (var t = n.slides, r = t.length, i = "number" == typeof e ? e : _(e, "number", r, !0), o = [], a = _(e, "perView", 1, !0), s = _(e, "spacing", 0, !0) / n.size || 0, c = "auto" === a ? s : s / a, u = _(e, "origin", "auto"), l = 0, d = 0; d < i; d++) {
                        var p = "auto" === a ? f(t[d]) : 1 / a - s + c,
                            h = "center" === u ? .5 - p / 2 : "auto" === u ? 0 : u;
                        o.push({
                            origin: h,
                            size: p,
                            spacing: s
                        }), l += p
                    }
                    if (l += s * (i - 1), "auto" === u && !n.options.loop && 1 !== a) {
                        var g = 0;
                        o.map((function (e) {
                            var t = l - g;
                            return g += e.size + s, t >= 1 || (e.origin = 1 - t - (l > 1 ? 0 : 1 - l)), e
                        }))
                    }
                    n.options.trackConfig = o
                }

                function k() {
                    E();
                    var e = n.size;
                    n.options.disabled || e === i || (i = e, y())
                }

                function T() {
                    k(), setTimeout(k, 500), setTimeout(k, 2e3)
                }

                function E() {
                    var e = A(n.container);
                    n.size = (n.options.vertical ? e.height : e.width) || 1
                }

                function S() {
                    n.slides = x(n.options.selector, n.container)
                }
                n.container = (s = x(e, document)).length ? s[0] : null, n.destroy = function () {
                    c.purge(), n.emit("destroyed"), u(!0)
                }, n.prev = function () {
                    n.moveToIdx(n.track.details.abs - 1, !0)
                }, n.next = function () {
                    n.moveToIdx(n.track.details.abs + 1, !0)
                }, n.update = y, h(n.options)
            }
        }
        var P = function (e, t, n) {
            try {
                return function (e, t) {
                    var n, r = {};
                    return n = {
                        emit: function (e) {
                            r[e] && r[e].forEach((function (e) {
                                e(n)
                            }));
                            var t = n.options && n.options[e];
                            t && t(n)
                        },
                        moveToIdx: function (e, t, r) {
                            var i = n.track.idxToDist(e, t);
                            if (i) {
                                var o = n.options.defaultAnimation;
                                n.animator.start([{
                                    distance: i,
                                    duration: _(r || o, "duration", 500),
                                    easing: _(r || o, "easing", (function (e) {
                                        return 1 + --e * e * e * e * e
                                    }))
                                }])
                            }
                        },
                        on: function (e, t, n) {
                            void 0 === n && (n = !1), r[e] || (r[e] = []);
                            var i = r[e].indexOf(t);
                            i > -1 ? n && delete r[e][i] : n || r[e].push(t)
                        },
                        options: e
                    },
                        function () {
                            if (n.track = D(n), n.animator = function (e) {
                                var t, n, r, i, o, a;

                                function s(t) {
                                    a || (a = t), c(!0);
                                    var o = t - a;
                                    o > r && (o = r);
                                    var d = i[n];
                                    if (d[3] < o) return n++, s(t);
                                    var f = d[2],
                                        p = d[4],
                                        h = d[0],
                                        g = d[1] * (0, d[5])(0 === p ? 1 : (o - f) / p);
                                    if (g && e.track.to(h + g), o < r) return l();
                                    a = null, c(!1), u(null), e.emit("animationEnded")
                                }

                                function c(e) {
                                    t.active = e
                                }

                                function u(e) {
                                    t.targetIdx = e
                                }

                                function l() {
                                    var e;
                                    e = s, o = window.requestAnimationFrame(e)
                                }

                                function d() {
                                    var t;
                                    t = o, window.cancelAnimationFrame(t), c(!1), u(null), a && e.emit("animationStopped"), a = null
                                }
                                return t = {
                                    active: !1,
                                    start: function (t) {
                                        if (d(), e.track.details) {
                                            var o = 0,
                                                a = e.track.details.position;
                                            n = 0, r = 0, i = t.map((function (e) {
                                                var t, n = Number(a),
                                                    i = null !== (t = e.earlyExit) && void 0 !== t ? t : e.duration,
                                                    s = e.easing,
                                                    c = e.distance * s(i / e.duration) || 0;
                                                a += c;
                                                var u = r;
                                                return r += i, o += c, [n, e.distance, u, r, e.duration, s]
                                            })), u(e.track.distToIdx(o)), l(), e.emit("animationStarted")
                                        }
                                    },
                                    stop: d,
                                    targetIdx: null
                                }
                            }(n), t)
                                for (var e = 0, r = t; e < r.length; e++)(0, r[e])(n);
                            n.track.init(n.options.initial || 0), n.emit("created")
                        }(), n
                }(t, m([L(e, {
                    drag: !0,
                    mode: "snap",
                    renderMode: "precision",
                    rubberband: !0,
                    selector: ".keen-slider__slide"
                }), q, N, O], n || [], !0))
            } catch (e) { }
        };
        const R = () => {
            const e = ".pricingCards__plans";

            function t(e) {
                let t = document.querySelector(".pricingCards__dots");
                const n = e.track.details.rel;
                Array.from(t.children).forEach((function (e, t) {
                    t === n ? e.classList.add("-active") : e.classList.remove("-active")
                }))
            }
            null != document.querySelector(e) && new P(e, {
                slides: {
                    perView: 1.1,
                    spacing: -16
                },
                breakpoints: {
                    "(min-width: 481px)": {
                        slides: {
                            perView: () => window.innerWidth / 480,
                            spacing: -32
                        }
                    },
                    "(min-width: 950px)": {
                        slides: {
                            perView: 2,
                            spacing: -32
                        }
                    }
                },
                created: function (e) {
                    ! function (e) {
                        let t = document.querySelector(".pricingCards__dots");
                        e.track.details.slides.forEach(((n, r) => {
                            let i = document.createElement("div");
                            i.classList.add("pricingCards__dot"), i.addEventListener("click", (() => e.moveToIdx(r))), t.appendChild(i)
                        }))
                    }(e), t(e)
                },
                slideChanged(e) {
                    t(e)
                }
            })
        },
            I = () => {
                let e = document.querySelector("#campaign-banner"),
                    t = document.querySelector("#campaign-banner-close-button");
                if (e && t) return t.addEventListener("click", (() => {
                    e.classList.remove("-visible"), e.classList.add("-hidden"), sessionStorage.setItem("campaign-banner-seen", !0)
                })), sessionStorage.getItem("campaign-banner-seen") ? void 0 : (e.classList.remove("-hidden"), void e.classList.add("-visible"))
            };
        t()((function () {
            a(), d(), c(), h(),
                function () {
                    if (!document.querySelector(".heroImageCentered")) return;
                    const e = document.querySelector(".heroImageCentered__contentContainer");
                    if (!e) return;
                    if ("true" !== e.getAttribute("data-animationAllowed")) return;
                    const t = e.querySelector("video.heroImageCentered__background"),
                        n = e.querySelector(".heroImageCentered__expandBgButton");
                    if (!t || !n) return;
                    const r = {
                        minDuration: 300,
                        maxDuration: 800,
                        minHeightThreshold: 100
                    },
                        i = {
                            minDuration: 500
                        },
                        o = 60,
                        a = (e, t, n) => Math.min(Math.max(e, t), n),
                        s = () => Math.min(t.getBoundingClientRect().height, window.innerHeight - o);
                    e.setAttribute("data-animating", !1), t.addEventListener("loadeddata", (() => {
                        c(), e.addEventListener("mouseover", (() => {
                            e.hasAttribute("data-canAnimate") && u()
                        }), {
                            once: !0
                        }), window.addEventListener("resize", (() => {
                            e.hasAttribute("aria-expanded") && l(), c()
                        })), n.addEventListener("click", (() => {
                            e.hasAttribute("data-canAnimate") && (e.hasAttribute("aria-expanded") ? l() : u())
                        }))
                    }), {
                        once: !0
                    });
                    const c = () => {
                        e.removeAttribute("data-canAnimate");
                        const n = e.getBoundingClientRect();
                        t.getBoundingClientRect(), window.matchMedia("(hover: hover)") && !e.hasAttribute("aria-expanded") && s() - n.height > r.minHeightThreshold && e.setAttribute("data-canAnimate", !0), e.hasAttribute("data-canAnimate") || (e.removeAttribute("aria-expanded"), e.style.height = "auto")
                    },
                        u = () => {
                            if ("true" === e.getAttribute("data-animating")) return;
                            e.setAttribute("data-animating", !0);
                            const t = e.getBoundingClientRect().height;
                            e.style.height = `${s()}px`;
                            const o = a(e.getBoundingClientRect().height - t, r.minDuration, r.maxDuration);
                            n.style.animationDuration = `${Math.max(i.minDuration, 1.2 * o)}ms`, n.setAttribute("aria-label", "Exit Full Screen"), n.setAttribute("title", "Exit Full Screen"), e.animate([{
                                height: `${t}px`
                            }, {
                                height: `${s()}px`
                            }], {
                                duration: o,
                                easing: "ease-in-out"
                            }).finished.then((() => {
                                e.setAttribute("data-animating", !1), e.setAttribute("aria-expanded", !0)
                            }))
                        },
                        l = () => {
                            if ("true" === e.getAttribute("data-animating")) return;
                            e.setAttribute("data-animating", !0);
                            const t = e.getBoundingClientRect().height;
                            e.style.height = "auto";
                            const o = e.getBoundingClientRect().height,
                                s = a(t - e.getBoundingClientRect().height, r.minDuration, r.maxDuration);
                            n.style.animationDuration = `${Math.max(i.minDuration, 1.2 * s)}ms`, n.setAttribute("aria-label", "Go Full Screen"), n.setAttribute("title", "Go Full Screen"), e.animate([{
                                height: `${t}px`
                            }, {
                                height: `${o}px`
                            }], {
                                duration: s,
                                easing: "ease-out"
                            }).finished.then((() => {
                                e.setAttribute("data-animating", !1), e.removeAttribute("aria-expanded")
                            }))
                        }
                }(), o(),
                function () {
                    document.querySelectorAll(".sectionExpandableItems__itemTitle").forEach((t => {
                        t.onclick = t => e(t)
                    }));
                    const e = e => {
                        const t = e.target,
                            n = t.closest(".sectionExpandableItems__item");
                        (e => {
                            const r = e.getBoundingClientRect();
                            e.classList.toggle("-open");
                            const i = e.getBoundingClientRect();
                            e.animate([{
                                height: `${r.height}px`
                            }, {
                                height: `${i.height}px`
                            }], {
                                duration: 200,
                                easing: "ease-in-out",
                                iterations: 1
                            }), n.classList.toggle("-open"), t.setAttribute("aria-expanded", "false" === t.getAttribute("aria-expanded") ? "true" : "false")
                        })(n.querySelector(".sectionExpandableItems__itemContent"))
                    }
                }()
        })), (() => {
            const e = document.getElementById("site-header");
            if (!e) return;
            const t = e.querySelector(".navigation");
            let n = e.querySelectorAll("[data-mobile-menu]");

            function r(e) {
                if (e.style.height = "auto", !e.animate) return;
                const t = e.getBoundingClientRect().height;
                e.animate([{
                    height: 0
                }, {
                    height: `${t}px`
                }], {
                    duration: 200,
                    easing: "ease"
                })
            }
            n.length > 0 && (n = n[0], n.addEventListener("click", (() => {
                const e = document.getElementById("site-header").getBoundingClientRect();
                document.querySelector(".navigation__menu").style.setProperty("--offsetY", `${e.y + e.height}px`), t.toggleAttribute("data-openOnMobile"), document.querySelector("body").toggleAttribute("disabled"), document.querySelector("main").toggleAttribute("disabled"), document.querySelector("footer").toggleAttribute("disabled");
                const n = document.querySelector(".search-button");
                n && n.classList.toggle("-hidden")
            })));
            const i = e.querySelectorAll(".navigation__dropdown");
            i.forEach((e => {
                if (e.hasAttribute("data-auto-expand")) {
                    e.toggleAttribute("data-openOnMobile");
                    r(e.querySelector(".navigation__dropdown__items"))
                }
                e.addEventListener("click", (() => {
                    if (!window.matchMedia("(hover: hover)").matches || window.innerWidth < 1200) {
                        e.toggleAttribute("data-openOnMobile");
                        const t = e.querySelector(".navigation__dropdown__items");
                        if (e.hasAttribute("data-openOnMobile")) r(t);
                        else {
                            const e = t.getBoundingClientRect().height;
                            if (t.style.height = 0, !t.animate) return;
                            t.animate([{
                                height: `${e}px`
                            }, {
                                height: 0
                            }], {
                                duration: 200,
                                easing: "ease"
                            })
                        }
                    }
                }))
            }));
            const o = e.querySelectorAll("[data-hide-if-logged-in]"),
                a = e.querySelector("#logout_button"),
                s = e.querySelector("#user_profile_menu");

            function c(e) {
                for (let t = 0; t < o.length; t++) o[t].style.display = e
            }
            a && a.addEventListener("click", (function () {
                const e = new XMLHttpRequest;
                e.open("POST", `${window.apiUrl}/logout`), e.setRequestHeader("X-Application-Name", "YousicianMainSite"), e.withCredentials = !0, e.onreadystatechange = () => {
                    e.readyState === XMLHttpRequest.DONE && 200 === e.status && (s.style.display = "none", c("inline-flex"))
                }, e.send()
            }))
                ()
        })(), (() => {
            let e = document.querySelector(".navigation__logo");
            const t = new ResizeObserver((e => {
                const t = e[0];
                t.contentRect.width > 180 ? t.target.classList.add("-extended") : t.target.classList.remove("-extended")
            }));
            null !== e && t.observe(e)
        })(), R(), I()
    })()
})();
//# sourceMappingURL=main-2021.ebaab4131046730323f4.js.map