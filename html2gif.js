function Html2Gif(t, e) {
    if (!(this instanceof arguments.callee)) throw Error("Constructor called as a function. Useage: new Html2Gif(element, options)");
    var r = this,
        i = new Blob([workerSrc]),
        n = window.URL.createObjectURL(i);
    r.element = t;
    (r.worker = new Worker(n)),
        (e = e || {}),
        (e.width = e.width || 320),
        (e.height = e.height || 240),
        (e.gifDelay = e.gifDelay || 200),
        (e.quality = e.quality || 10),
        (r.options = e),
        r.worker.postMessage({ cmd: "init", width: e.width, height: e.height, delay: e.gifDelay, quality: e.quality }),
        r.worker.addEventListener(
            "message",
            function (t) {
                var e = btoa(t.data),
                    i = "data:image/gif;base64," + e;
                "function" == typeof r.oncomplete && r.oncomplete(i);
            },
            !1
        );
}
!(function (t, e, r) {
    "use strict";
    function i(t, e, r) {
        var i,
            n = t.runtimeStyle && t.runtimeStyle[e],
            a = t.style;
        return (
            !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(r) &&
                /^-?\d/.test(r) &&
                ((i = a.left), n && (t.runtimeStyle.left = t.currentStyle.left), (a.left = "fontSize" === e ? "1em" : r || 0), (r = a.pixelLeft + "px"), (a.left = i), n && (t.runtimeStyle.left = n)),
            /^(thin|medium|thick)$/i.test(r) ? r : Math.round(parseFloat(r)) + "px"
        );
    }
    function n(t) {
        return parseInt(t, 10);
    }
    function a(t, e, n, a) {
        if (((t = (t || "").split(",")), (t = t[a || 0] || t[0] || "auto"), (t = d.Util.trimText(t).split(" ")), "backgroundSize" !== n || (t[0] && !t[0].match(/cover|contain|auto/)))) {
            if (((t[0] = -1 === t[0].indexOf("%") ? i(e, n + "X", t[0]) : t[0]), t[1] === r)) {
                if ("backgroundSize" === n) return (t[1] = "auto"), t;
                t[1] = t[0];
            }
            t[1] = -1 === t[1].indexOf("%") ? i(e, n + "Y", t[1]) : t[1];
        } else;
        return t;
    }
    function o(t, e, r, i, n, a) {
        var o,
            s,
            l,
            h,
            c = d.Util.getCSS(e, t, n);
        if ((1 === c.length && ((h = c[0]), (c = []), (c[0] = h), (c[1] = h)), -1 !== c[0].toString().indexOf("%"))) (l = parseFloat(c[0]) / 100), (s = r.width * l), "backgroundSize" !== t && (s -= (a || i).width * l);
        else if ("backgroundSize" === t)
            if ("auto" === c[0]) s = i.width;
            else if (/contain|cover/.test(c[0])) {
                var u = d.Util.resizeBounds(i.width, i.height, r.width, r.height, c[0]);
                (s = u.width), (o = u.height);
            } else s = parseInt(c[0], 10);
        else s = parseInt(c[0], 10);
        return (
            "auto" === c[1] ? (o = (s / i.width) * i.height) : -1 !== c[1].toString().indexOf("%") ? ((l = parseFloat(c[1]) / 100), (o = r.height * l), "backgroundSize" !== t && (o -= (a || i).height * l)) : (o = parseInt(c[1], 10)), [s, o]
        );
    }
    function s(t, e) {
        var r = [];
        return {
            storage: r,
            width: t,
            height: e,
            clip: function () {
                r.push({ type: "function", name: "clip", arguments: arguments });
            },
            translate: function () {
                r.push({ type: "function", name: "translate", arguments: arguments });
            },
            fill: function () {
                r.push({ type: "function", name: "fill", arguments: arguments });
            },
            save: function () {
                r.push({ type: "function", name: "save", arguments: arguments });
            },
            restore: function () {
                r.push({ type: "function", name: "restore", arguments: arguments });
            },
            fillRect: function () {
                r.push({ type: "function", name: "fillRect", arguments: arguments });
            },
            createPattern: function () {
                r.push({ type: "function", name: "createPattern", arguments: arguments });
            },
            drawShape: function () {
                var t = [];
                return (
                    r.push({ type: "function", name: "drawShape", arguments: t }),
                    {
                        moveTo: function () {
                            t.push({ name: "moveTo", arguments: arguments });
                        },
                        lineTo: function () {
                            t.push({ name: "lineTo", arguments: arguments });
                        },
                        arcTo: function () {
                            t.push({ name: "arcTo", arguments: arguments });
                        },
                        bezierCurveTo: function () {
                            t.push({ name: "bezierCurveTo", arguments: arguments });
                        },
                        quadraticCurveTo: function () {
                            t.push({ name: "quadraticCurveTo", arguments: arguments });
                        },
                    }
                );
            },
            drawImage: function () {
                r.push({ type: "function", name: "drawImage", arguments: arguments });
            },
            fillText: function () {
                r.push({ type: "function", name: "fillText", arguments: arguments });
            },
            setVariable: function (t, e) {
                return r.push({ type: "variable", name: t, arguments: e }), e;
            },
        };
    }
    function l(t) {
        return { zindex: t, children: [] };
    }
    var h,
        c,
        d = {};
    (d.Util = {}),
        (d.Util.log = function (e) {
            d.logging && t.console && t.console.log && t.console.log(e);
        }),
        (d.Util.trimText = (function (t) {
            return function (e) {
                return t ? t.apply(e) : ((e || "") + "").replace(/^\s+|\s+$/g, "");
            };
        })(String.prototype.trim)),
        (d.Util.asFloat = function (t) {
            return parseFloat(t);
        }),
        (function () {
            var t = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g,
                e = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
            d.Util.parseTextShadows = function (r) {
                if (!r || "none" === r) return [];
                for (var i = r.match(t), n = [], a = 0; i && a < i.length; a++) {
                    var o = i[a].match(e);
                    n.push({ color: o[0], offsetX: o[1] ? o[1].replace("px", "") : 0, offsetY: o[2] ? o[2].replace("px", "") : 0, blur: o[3] ? o[3].replace("px", "") : 0 });
                }
                return n;
            };
        })(),
        (d.Util.parseBackgroundImage = function (t) {
            var e,
                r,
                i,
                n,
                a,
                o,
                s,
                l,
                h = " \r\n	",
                c = [],
                d = 0,
                u = 0,
                f = function () {
                    e &&
                        ('"' === r.substr(0, 1) && (r = r.substr(1, r.length - 2)),
                        r && l.push(r),
                        "-" === e.substr(0, 1) && (n = e.indexOf("-", 1) + 1) > 0 && ((i = e.substr(0, n)), (e = e.substr(n))),
                        c.push({ prefix: i, method: e.toLowerCase(), value: a, args: l })),
                        (l = []),
                        (e = i = r = a = "");
                };
            f();
            for (var p = 0, g = t.length; g > p; p++)
                if (((o = t[p]), !(0 === d && h.indexOf(o) > -1))) {
                    switch (o) {
                        case '"':
                            s ? s === o && (s = null) : (s = o);
                            break;
                        case "(":
                            if (s) break;
                            if (0 === d) {
                                (d = 1), (a += o);
                                continue;
                            }
                            u++;
                            break;
                        case ")":
                            if (s) break;
                            if (1 === d) {
                                if (0 === u) {
                                    (d = 0), (a += o), f();
                                    continue;
                                }
                                u--;
                            }
                            break;
                        case ",":
                            if (s) break;
                            if (0 === d) {
                                f();
                                continue;
                            }
                            if (1 === d && 0 === u && !e.match(/^url$/i)) {
                                l.push(r), (r = ""), (a += o);
                                continue;
                            }
                    }
                    (a += o), 0 === d ? (e += o) : (r += o);
                }
            return f(), c;
        }),
        (d.Util.Bounds = function (t) {
            var e,
                r = {};
            return t.getBoundingClientRect && ((e = t.getBoundingClientRect()), (r.top = e.top), (r.bottom = e.bottom || e.top + e.height), (r.left = e.left), (r.width = t.offsetWidth), (r.height = t.offsetHeight)), r;
        }),
        (d.Util.OffsetBounds = function (t) {
            var e = t.offsetParent ? d.Util.OffsetBounds(t.offsetParent) : { top: 0, left: 0 };
            return { top: t.offsetTop + e.top, bottom: t.offsetTop + t.offsetHeight + e.top, left: t.offsetLeft + e.left, width: t.offsetWidth, height: t.offsetHeight };
        }),
        (d.Util.getCSS = function (t, r, i) {
            h !== t && (c = e.defaultView.getComputedStyle(t, null));
            var o = c[r];
            if (/^background(Size|Position)$/.test(r)) return a(o, t, r, i);
            if (/border(Top|Bottom)(Left|Right)Radius/.test(r)) {
                var s = o.split(" ");
                return s.length <= 1 && (s[1] = s[0]), s.map(n);
            }
            return o;
        }),
        (d.Util.resizeBounds = function (t, e, r, i, n) {
            var a,
                o,
                s = r / i,
                l = t / e;
            return n && "auto" !== n ? ((l > s) ^ ("contain" === n) ? ((o = i), (a = i * l)) : ((a = r), (o = r / l))) : ((a = r), (o = i)), { width: a, height: o };
        }),
        (d.Util.BackgroundPosition = function (t, e, r, i, n) {
            var a = o("backgroundPosition", t, e, r, i, n);
            return { left: a[0], top: a[1] };
        }),
        (d.Util.BackgroundSize = function (t, e, r, i) {
            var n = o("backgroundSize", t, e, r, i);
            return { width: n[0], height: n[1] };
        }),
        (d.Util.Extend = function (t, e) {
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            return e;
        }),
        (d.Util.Children = function (t) {
            var e;
            try {
                e =
                    t.nodeName && "IFRAME" === t.nodeName.toUpperCase()
                        ? t.contentDocument || t.contentWindow.document
                        : (function (t) {
                              var e = [];
                              return (
                                  null !== t &&
                                      !(function (t, e) {
                                          var i = t.length,
                                              n = 0;
                                          if ("number" == typeof e.length) for (var a = e.length; a > n; n++) t[i++] = e[n];
                                          else for (; e[n] !== r; ) t[i++] = e[n++];
                                          return (t.length = i), t;
                                      })(e, t),
                                  e
                              );
                          })(t.childNodes);
            } catch (i) {
                d.Util.log("html2canvas.Util.Children failed with exception: " + i.message), (e = []);
            }
            return e;
        }),
        (d.Util.isTransparent = function (t) {
            return "transparent" === t || "rgba(0, 0, 0, 0)" === t;
        }),
        (d.Util.Font = (function () {
            var t = {};
            return function (e, i, n) {
                if (t[e + "-" + i] !== r) return t[e + "-" + i];
                var a,
                    o,
                    s,
                    l = n.createElement("div"),
                    h = n.createElement("img"),
                    c = n.createElement("span"),
                    d = "Hidden Text";
                return (
                    (l.style.visibility = "hidden"),
                    (l.style.fontFamily = e),
                    (l.style.fontSize = i),
                    (l.style.margin = 0),
                    (l.style.padding = 0),
                    n.body.appendChild(l),
                    (h.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs="),
                    (h.width = 1),
                    (h.height = 1),
                    (h.style.margin = 0),
                    (h.style.padding = 0),
                    (h.style.verticalAlign = "baseline"),
                    (c.style.fontFamily = e),
                    (c.style.fontSize = i),
                    (c.style.margin = 0),
                    (c.style.padding = 0),
                    c.appendChild(n.createTextNode(d)),
                    l.appendChild(c),
                    l.appendChild(h),
                    (a = h.offsetTop - c.offsetTop + 1),
                    l.removeChild(c),
                    l.appendChild(n.createTextNode(d)),
                    (l.style.lineHeight = "normal"),
                    (h.style.verticalAlign = "super"),
                    (o = h.offsetTop - l.offsetTop + 1),
                    (s = { baseline: a, lineWidth: 1, middle: o }),
                    (t[e + "-" + i] = s),
                    n.body.removeChild(l),
                    s
                );
            };
        })()),
        (function () {
            function t(t) {
                return function (e) {
                    try {
                        t.addColorStop(e.stop, e.color);
                    } catch (i) {
                        r.log(["failed to add color stop: ", i, "; tried to add: ", e]);
                    }
                };
            }
            var r = d.Util,
                i = {};
            d.Generate = i;
            var n = [
                /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
                /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
                /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,
                /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
                /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
                /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,
                /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
            ];
            (i.parseGradient = function (t, e) {
                var r,
                    i,
                    a,
                    o,
                    s,
                    l,
                    h,
                    c,
                    d,
                    u,
                    f,
                    p,
                    g = n.length;
                for (i = 0; g > i && !(a = t.match(n[i])); i += 1);
                if (a)
                    switch (a[1]) {
                        case "-webkit-linear-gradient":
                        case "-o-linear-gradient":
                            if (((r = { type: "linear", x0: null, y0: null, x1: null, y1: null, colorStops: [] }), (s = a[2].match(/\w+/g))))
                                for (l = s.length, i = 0; l > i; i += 1)
                                    switch (s[i]) {
                                        case "top":
                                            (r.y0 = 0), (r.y1 = e.height);
                                            break;
                                        case "right":
                                            (r.x0 = e.width), (r.x1 = 0);
                                            break;
                                        case "bottom":
                                            (r.y0 = e.height), (r.y1 = 0);
                                            break;
                                        case "left":
                                            (r.x0 = 0), (r.x1 = e.width);
                                    }
                            if (
                                (null === r.x0 && null === r.x1 && (r.x0 = r.x1 = e.width / 2),
                                null === r.y0 && null === r.y1 && (r.y0 = r.y1 = e.height / 2),
                                (s = a[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g)))
                            )
                                for (l = s.length, h = 1 / Math.max(l - 1, 1), i = 0; l > i; i += 1)
                                    (c = s[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/)),
                                        c[2] ? ((o = parseFloat(c[2])), (o /= "%" === c[3] ? 100 : e.width)) : (o = i * h),
                                        r.colorStops.push({ color: c[1], stop: o });
                            break;
                        case "-webkit-gradient":
                            if (
                                ((r = { type: "radial" === a[2] ? "circle" : a[2], x0: 0, y0: 0, x1: 0, y1: 0, colorStops: [] }),
                                (s = a[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/)),
                                s && ((r.x0 = (s[1] * e.width) / 100), (r.y0 = (s[2] * e.height) / 100), (r.x1 = (s[3] * e.width) / 100), (r.y1 = (s[4] * e.height) / 100)),
                                (s = a[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g)))
                            )
                                for (l = s.length, i = 0; l > i; i += 1)
                                    (c = s[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/)),
                                        (o = parseFloat(c[2])),
                                        "from" === c[1] && (o = 0),
                                        "to" === c[1] && (o = 1),
                                        r.colorStops.push({ color: c[3], stop: o });
                            break;
                        case "-moz-linear-gradient":
                            if (
                                ((r = { type: "linear", x0: 0, y0: 0, x1: 0, y1: 0, colorStops: [] }),
                                (s = a[2].match(/(\d{1,3})%?\s(\d{1,3})%?/)),
                                s && ((r.x0 = (s[1] * e.width) / 100), (r.y0 = (s[2] * e.height) / 100), (r.x1 = e.width - r.x0), (r.y1 = e.height - r.y0)),
                                (s = a[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g)))
                            )
                                for (l = s.length, h = 1 / Math.max(l - 1, 1), i = 0; l > i; i += 1)
                                    (c = s[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/)),
                                        c[2] ? ((o = parseFloat(c[2])), c[3] && (o /= 100)) : (o = i * h),
                                        r.colorStops.push({ color: c[1], stop: o });
                            break;
                        case "-webkit-radial-gradient":
                        case "-moz-radial-gradient":
                        case "-o-radial-gradient":
                            if (
                                ((r = { type: "circle", x0: 0, y0: 0, x1: e.width, y1: e.height, cx: 0, cy: 0, rx: 0, ry: 0, colorStops: [] }),
                                (s = a[2].match(/(\d{1,3})%?\s(\d{1,3})%?/)),
                                s && ((r.cx = (s[1] * e.width) / 100), (r.cy = (s[2] * e.height) / 100)),
                                (s = a[3].match(/\w+/)),
                                (c = a[4].match(/[a-z\-]*/)),
                                s && c)
                            )
                                switch (c[0]) {
                                    case "farthest-corner":
                                    case "cover":
                                    case "":
                                        (d = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.cy, 2))),
                                            (u = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.y1 - r.cy, 2))),
                                            (f = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.y1 - r.cy, 2))),
                                            (p = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.cy, 2))),
                                            (r.rx = r.ry = Math.max(d, u, f, p));
                                        break;
                                    case "closest-corner":
                                        (d = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.cy, 2))),
                                            (u = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.y1 - r.cy, 2))),
                                            (f = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.y1 - r.cy, 2))),
                                            (p = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.cy, 2))),
                                            (r.rx = r.ry = Math.min(d, u, f, p));
                                        break;
                                    case "farthest-side":
                                        "circle" === s[0] ? (r.rx = r.ry = Math.max(r.cx, r.cy, r.x1 - r.cx, r.y1 - r.cy)) : ((r.type = s[0]), (r.rx = Math.max(r.cx, r.x1 - r.cx)), (r.ry = Math.max(r.cy, r.y1 - r.cy)));
                                        break;
                                    case "closest-side":
                                    case "contain":
                                        "circle" === s[0] ? (r.rx = r.ry = Math.min(r.cx, r.cy, r.x1 - r.cx, r.y1 - r.cy)) : ((r.type = s[0]), (r.rx = Math.min(r.cx, r.x1 - r.cx)), (r.ry = Math.min(r.cy, r.y1 - r.cy)));
                                }
                            if ((s = a[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g)))
                                for (l = s.length, h = 1 / Math.max(l - 1, 1), i = 0; l > i; i += 1)
                                    (c = s[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/)),
                                        c[2] ? ((o = parseFloat(c[2])), (o /= "%" === c[3] ? 100 : e.width)) : (o = i * h),
                                        r.colorStops.push({ color: c[1], stop: o });
                    }
                return r;
            }),
                (i.Gradient = function (r, i) {
                    if (0 !== i.width && 0 !== i.height) {
                        var n,
                            a,
                            o = e.createElement("canvas"),
                            s = o.getContext("2d");
                        if (((o.width = i.width), (o.height = i.height), (n = d.Generate.parseGradient(r, i))))
                            switch (n.type) {
                                case "linear":
                                    (a = s.createLinearGradient(n.x0, n.y0, n.x1, n.y1)), n.colorStops.forEach(t(a)), (s.fillStyle = a), s.fillRect(0, 0, i.width, i.height);
                                    break;
                                case "circle":
                                    (a = s.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, n.rx)), n.colorStops.forEach(t(a)), (s.fillStyle = a), s.fillRect(0, 0, i.width, i.height);
                                    break;
                                case "ellipse":
                                    var l = e.createElement("canvas"),
                                        h = l.getContext("2d"),
                                        c = Math.max(n.rx, n.ry),
                                        u = 2 * c;
                                    (l.width = l.height = u),
                                        (a = h.createRadialGradient(n.rx, n.ry, 0, n.rx, n.ry, c)),
                                        n.colorStops.forEach(t(a)),
                                        (h.fillStyle = a),
                                        h.fillRect(0, 0, u, u),
                                        (s.fillStyle = n.colorStops[n.colorStops.length - 1].color),
                                        s.fillRect(0, 0, o.width, o.height),
                                        s.drawImage(l, n.cx - n.rx, n.cy - n.ry, 2 * n.rx, 2 * n.ry);
                            }
                        return o;
                    }
                }),
                (i.ListAlpha = function (t) {
                    var e,
                        r = "";
                    do (e = t % 26), (r = String.fromCharCode(e + 64) + r), (t /= 26);
                    while (26 * t > 26);
                    return r;
                }),
                (i.ListRoman = function (t) {
                    var e,
                        r = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
                        i = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
                        n = "",
                        a = r.length;
                    if (0 >= t || t >= 4e3) return t;
                    for (e = 0; a > e; e += 1) for (; t >= i[e]; ) (t -= i[e]), (n += r[e]);
                    return n;
                });
        })(),
        (d.Parse = function (i, n) {
            function a() {
                return Math.max(Math.max(ce.body.scrollWidth, ce.documentElement.scrollWidth), Math.max(ce.body.offsetWidth, ce.documentElement.offsetWidth), Math.max(ce.body.clientWidth, ce.documentElement.clientWidth));
            }
            function o() {
                return Math.max(Math.max(ce.body.scrollHeight, ce.documentElement.scrollHeight), Math.max(ce.body.offsetHeight, ce.documentElement.offsetHeight), Math.max(ce.body.clientHeight, ce.documentElement.clientHeight));
            }
            function h(t, e) {
                var r = parseInt(ge(t, e), 10);
                return isNaN(r) ? 0 : r;
            }
            function c(t, e, r, i, n, a) {
                "transparent" !== a && (t.setVariable("fillStyle", a), t.fillRect(e, r, i, n), (he += 1));
            }
            function u(t, e, r) {
                return t.length > 0 ? e + r.toUpperCase() : void 0;
            }
            function f(t, e) {
                switch (e) {
                    case "lowercase":
                        return t.toLowerCase();
                    case "capitalize":
                        return t.replace(/(^|\s|:|-|\(|\))([a-z])/g, u);
                    case "uppercase":
                        return t.toUpperCase();
                    default:
                        return t;
                }
            }
            function p(t) {
                return /^(normal|none|0px)$/.test(t);
            }
            function g(t, e, r, i) {
                null !== t && de.trimText(t).length > 0 && (i.fillText(t, e, r), (he += 1));
            }
            function m(t, e, r, i) {
                var n = !1,
                    a = ge(e, "fontWeight"),
                    o = ge(e, "fontFamily"),
                    s = ge(e, "fontSize"),
                    l = de.parseTextShadows(ge(e, "textShadow"));
                switch (parseInt(a, 10)) {
                    case 401:
                        a = "bold";
                        break;
                    case 400:
                        a = "normal";
                }
                return (
                    t.setVariable("fillStyle", i),
                    t.setVariable("font", [ge(e, "fontStyle"), ge(e, "fontVariant"), a, s, o].join(" ")),
                    t.setVariable("textAlign", n ? "right" : "left"),
                    l.length && (t.setVariable("shadowColor", l[0].color), t.setVariable("shadowOffsetX", l[0].offsetX), t.setVariable("shadowOffsetY", l[0].offsetY), t.setVariable("shadowBlur", l[0].blur)),
                    "none" !== r ? de.Font(o, s, ce) : void 0
                );
            }
            function y(t, e, r, i, n) {
                switch (e) {
                    case "underline":
                        c(t, r.left, Math.round(r.top + i.baseline + i.lineWidth), r.width, 1, n);
                        break;
                    case "overline":
                        c(t, r.left, Math.round(r.top), r.width, 1, n);
                        break;
                    case "line-through":
                        c(t, r.left, Math.ceil(r.top + i.middle + i.lineWidth), r.width, 1, n);
                }
            }
            function w(t, e, r, i, n) {
                var a;
                if (ue.rangeBounds && !n) ("none" !== r || 0 !== de.trimText(e).length) && (a = b(e, t.node, t.textOffset)), (t.textOffset += e.length);
                else if (t.node && "string" == typeof t.node.nodeValue) {
                    var o = i ? t.node.splitText(e.length) : null;
                    (a = x(t.node, n)), (t.node = o);
                }
                return a;
            }
            function b(t, e, r) {
                var i = ce.createRange();
                return i.setStart(e, r), i.setEnd(e, r + t.length), i.getBoundingClientRect();
            }
            function x(t, e) {
                var r = t.parentNode,
                    i = ce.createElement("wrapper"),
                    n = t.cloneNode(!0);
                i.appendChild(t.cloneNode(!0)), r.replaceChild(i, t);
                var a = e ? de.OffsetBounds(i) : de.Bounds(i);
                return r.replaceChild(n, i), a;
            }
            function v(t, e, r) {
                var i,
                    a,
                    o = r.ctx,
                    s = ge(t, "color"),
                    l = ge(t, "textDecoration"),
                    h = ge(t, "textAlign"),
                    c = { node: e, textOffset: 0 };
                de.trimText(e.nodeValue).length > 0 &&
                    ((e.nodeValue = f(e.nodeValue, ge(t, "textTransform"))),
                    (h = h.replace(["-webkit-auto"], ["auto"])),
                    (a = e.nodeValue.split(!n.letterRendering && /^(left|right|justify|auto)$/.test(h) && p(ge(t, "letterSpacing")) ? /(\b| )/ : "")),
                    (i = m(o, t, l, s)),
                    n.chinese &&
                        a.forEach(function (t, e) {
                            /.*[\u4E00-\u9FA5].*$/.test(t) && ((t = t.split("")), t.unshift(e, 1), a.splice.apply(a, t));
                        }),
                    a.forEach(function (t, e) {
                        var n = w(c, t, l, e < a.length - 1, r.transform.matrix);
                        n && (g(t, n.left, n.bottom, o), y(o, l, n, i, s));
                    }));
            }
            function I(t, e) {
                var r,
                    i,
                    n = ce.createElement("boundelement");
                return (
                    (n.style.display = "inline"),
                    (r = t.style.listStyleType),
                    (t.style.listStyleType = "none"),
                    n.appendChild(ce.createTextNode(e)),
                    t.insertBefore(n, t.firstChild),
                    (i = de.Bounds(n)),
                    t.removeChild(n),
                    (t.style.listStyleType = r),
                    i
                );
            }
            function E(t) {
                var e = -1,
                    r = 1,
                    i = t.parentNode.childNodes;
                if (t.parentNode) {
                    for (; i[++e] !== t; ) 1 === i[e].nodeType && r++;
                    return r;
                }
                return -1;
            }
            function S(t, e) {
                var r,
                    i = E(t);
                switch (e) {
                    case "decimal":
                        r = i;
                        break;
                    case "decimal-leading-zero":
                        r = 1 === i.toString().length ? (i = "0" + i.toString()) : i.toString();
                        break;
                    case "upper-roman":
                        r = d.Generate.ListRoman(i);
                        break;
                    case "lower-roman":
                        r = d.Generate.ListRoman(i).toLowerCase();
                        break;
                    case "lower-alpha":
                        r = d.Generate.ListAlpha(i).toLowerCase();
                        break;
                    case "upper-alpha":
                        r = d.Generate.ListAlpha(i);
                }
                return r + ". ";
            }
            function T(t, e, r) {
                var i,
                    n,
                    a,
                    o = e.ctx,
                    s = ge(t, "listStyleType");
                if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(s)) {
                    if (((n = S(t, s)), (a = I(t, n)), m(o, t, "none", ge(t, "color")), "inside" !== ge(t, "listStylePosition"))) return;
                    o.setVariable("textAlign", "left"), (i = r.left), g(n, i, a.bottom, o);
                }
            }
            function k(t) {
                var e = i[t];
                return e && e.succeeded === !0 ? e.img : !1;
            }
            function C(t, e) {
                var r = Math.max(t.left, e.left),
                    i = Math.max(t.top, e.top),
                    n = Math.min(t.left + t.width, e.left + e.width),
                    a = Math.min(t.top + t.height, e.top + e.height);
                return { left: r, top: i, width: n - r, height: a - i };
            }
            function B(t, e, r) {
                var i,
                    n = "static" !== e.cssPosition,
                    a = n ? ge(t, "zIndex") : "auto",
                    o = ge(t, "opacity"),
                    s = "none" !== ge(t, "cssFloat");
                (e.zIndex = i = l(a)), (i.isPositioned = n), (i.isFloated = s), (i.opacity = o), (i.ownStacking = "auto" !== a || 1 > o), r && r.zIndex.children.push(e);
            }
            function M(t, e, r, i, n) {
                var a = h(e, "paddingLeft"),
                    o = h(e, "paddingTop"),
                    s = h(e, "paddingRight"),
                    l = h(e, "paddingBottom");
                H(t, r, 0, 0, r.width, r.height, i.left + a + n[3].width, i.top + o + n[0].width, i.width - (n[1].width + n[3].width + a + s), i.height - (n[0].width + n[2].width + o + l));
            }
            function R(t) {
                return ["Top", "Right", "Bottom", "Left"].map(function (e) {
                    return { width: h(t, "border" + e + "Width"), color: ge(t, "border" + e + "Color") };
                });
            }
            function F(t) {
                return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function (e) {
                    return ge(t, "border" + e + "Radius");
                });
            }
            function z(t, e, r, i) {
                var n = function (t, e, r) {
                    return { x: t.x + (e.x - t.x) * r, y: t.y + (e.y - t.y) * r };
                };
                return {
                    start: t,
                    startControl: e,
                    endControl: r,
                    end: i,
                    subdivide: function (a) {
                        var o = n(t, e, a),
                            s = n(e, r, a),
                            l = n(r, i, a),
                            h = n(o, s, a),
                            c = n(s, l, a),
                            d = n(h, c, a);
                        return [z(t, o, h, d), z(d, c, l, i)];
                    },
                    curveTo: function (t) {
                        t.push(["bezierCurve", e.x, e.y, r.x, r.y, i.x, i.y]);
                    },
                    curveToReversed: function (i) {
                        i.push(["bezierCurve", r.x, r.y, e.x, e.y, t.x, t.y]);
                    },
                };
            }
            function L(t, e, r, i, n, a, o) {
                e[0] > 0 || e[1] > 0 ? (t.push(["line", i[0].start.x, i[0].start.y]), i[0].curveTo(t), i[1].curveTo(t)) : t.push(["line", a, o]), (r[0] > 0 || r[1] > 0) && t.push(["line", n[0].start.x, n[0].start.y]);
            }
            function A(t, e, r, i, n, a, o) {
                var s = [];
                return (
                    e[0] > 0 || e[1] > 0 ? (s.push(["line", i[1].start.x, i[1].start.y]), i[1].curveTo(s)) : s.push(["line", t.c1[0], t.c1[1]]),
                    r[0] > 0 || r[1] > 0
                        ? (s.push(["line", a[0].start.x, a[0].start.y]), a[0].curveTo(s), s.push(["line", o[0].end.x, o[0].end.y]), o[0].curveToReversed(s))
                        : (s.push(["line", t.c2[0], t.c2[1]]), s.push(["line", t.c3[0], t.c3[1]])),
                    e[0] > 0 || e[1] > 0 ? (s.push(["line", n[1].end.x, n[1].end.y]), n[1].curveToReversed(s)) : s.push(["line", t.c4[0], t.c4[1]]),
                    s
                );
            }
            function O(t, e, r) {
                var i = t.left,
                    n = t.top,
                    a = t.width,
                    o = t.height,
                    s = e[0][0],
                    l = e[0][1],
                    h = e[1][0],
                    c = e[1][1],
                    d = e[2][0],
                    u = e[2][1],
                    f = e[3][0],
                    p = e[3][1],
                    g = a - h,
                    m = o - u,
                    y = a - d,
                    w = o - p;
                return {
                    topLeftOuter: we(i, n, s, l).topLeft.subdivide(0.5),
                    topLeftInner: we(i + r[3].width, n + r[0].width, Math.max(0, s - r[3].width), Math.max(0, l - r[0].width)).topLeft.subdivide(0.5),
                    topRightOuter: we(i + g, n, h, c).topRight.subdivide(0.5),
                    topRightInner: we(i + Math.min(g, a + r[3].width), n + r[0].width, g > a + r[3].width ? 0 : h - r[3].width, c - r[0].width).topRight.subdivide(0.5),
                    bottomRightOuter: we(i + y, n + m, d, u).bottomRight.subdivide(0.5),
                    bottomRightInner: we(i + Math.min(y, a + r[3].width), n + Math.min(m, o + r[0].width), Math.max(0, d - r[1].width), Math.max(0, u - r[2].width)).bottomRight.subdivide(0.5),
                    bottomLeftOuter: we(i, n + w, f, p).bottomLeft.subdivide(0.5),
                    bottomLeftInner: we(i + r[3].width, n + w, Math.max(0, f - r[3].width), Math.max(0, p - r[2].width)).bottomLeft.subdivide(0.5),
                };
            }
            function P(t, e, r, i, n) {
                var a = ge(t, "backgroundClip"),
                    o = [];
                switch (a) {
                    case "content-box":
                    case "padding-box":
                        L(o, i[0], i[1], e.topLeftInner, e.topRightInner, n.left + r[3].width, n.top + r[0].width),
                            L(o, i[1], i[2], e.topRightInner, e.bottomRightInner, n.left + n.width - r[1].width, n.top + r[0].width),
                            L(o, i[2], i[3], e.bottomRightInner, e.bottomLeftInner, n.left + n.width - r[1].width, n.top + n.height - r[2].width),
                            L(o, i[3], i[0], e.bottomLeftInner, e.topLeftInner, n.left + r[3].width, n.top + n.height - r[2].width);
                        break;
                    default:
                        L(o, i[0], i[1], e.topLeftOuter, e.topRightOuter, n.left, n.top),
                            L(o, i[1], i[2], e.topRightOuter, e.bottomRightOuter, n.left + n.width, n.top),
                            L(o, i[2], i[3], e.bottomRightOuter, e.bottomLeftOuter, n.left + n.width, n.top + n.height),
                            L(o, i[3], i[0], e.bottomLeftOuter, e.topLeftOuter, n.left, n.top + n.height);
                }
                return o;
            }
            function U(t, e, r) {
                var i,
                    n,
                    a,
                    o,
                    s,
                    l,
                    h = e.left,
                    c = e.top,
                    d = e.width,
                    u = e.height,
                    f = F(t),
                    p = O(e, f, r),
                    g = { clip: P(t, p, r, f, e), borders: [] };
                for (i = 0; 4 > i; i++)
                    if (r[i].width > 0) {
                        switch (((n = h), (a = c), (o = d), (s = u - r[2].width), i)) {
                            case 0:
                                (s = r[0].width), (l = A({ c1: [n, a], c2: [n + o, a], c3: [n + o - r[1].width, a + s], c4: [n + r[3].width, a + s] }, f[0], f[1], p.topLeftOuter, p.topLeftInner, p.topRightOuter, p.topRightInner));
                                break;
                            case 1:
                                (n = h + d - r[1].width),
                                    (o = r[1].width),
                                    (l = A({ c1: [n + o, a], c2: [n + o, a + s + r[2].width], c3: [n, a + s], c4: [n, a + r[0].width] }, f[1], f[2], p.topRightOuter, p.topRightInner, p.bottomRightOuter, p.bottomRightInner));
                                break;
                            case 2:
                                (a = a + u - r[2].width),
                                    (s = r[2].width),
                                    (l = A({ c1: [n + o, a + s], c2: [n, a + s], c3: [n + r[3].width, a], c4: [n + o - r[3].width, a] }, f[2], f[3], p.bottomRightOuter, p.bottomRightInner, p.bottomLeftOuter, p.bottomLeftInner));
                                break;
                            case 3:
                                (o = r[3].width), (l = A({ c1: [n, a + s + r[2].width], c2: [n, a], c3: [n + o, a + r[0].width], c4: [n + o, a + s] }, f[3], f[0], p.bottomLeftOuter, p.bottomLeftInner, p.topLeftOuter, p.topLeftInner));
                        }
                        g.borders.push({ args: l, color: r[i].color });
                    }
                return g;
            }
            function N(t, e) {
                var r = t.drawShape();
                return (
                    e.forEach(function (t, e) {
                        r[0 === e ? "moveTo" : t[0] + "To"].apply(null, t.slice(1));
                    }),
                    r
                );
            }
            function G(t, e, r) {
                "transparent" !== r && (t.setVariable("fillStyle", r), N(t, e), t.fill(), (he += 1));
            }
            function D(t, e, r) {
                var i,
                    n,
                    a = ce.createElement("valuewrap"),
                    o = ["lineHeight", "textAlign", "fontFamily", "color", "fontSize", "paddingLeft", "paddingTop", "width", "height", "border", "borderLeftWidth", "borderTopWidth"];
                o.forEach(function (e) {
                    try {
                        a.style[e] = ge(t, e);
                    } catch (r) {
                        de.log("html2canvas: Parse: Exception caught in renderFormValue: " + r.message);
                    }
                }),
                    (a.style.borderColor = "black"),
                    (a.style.borderStyle = "solid"),
                    (a.style.display = "block"),
                    (a.style.position = "absolute"),
                    (/^(submit|reset|button|text|password)$/.test(t.type) || "SELECT" === t.nodeName) && (a.style.lineHeight = ge(t, "height")),
                    (a.style.top = e.top + "px"),
                    (a.style.left = e.left + "px"),
                    (i = "SELECT" === t.nodeName ? (t.options[t.selectedIndex] || 0).text : t.value),
                    i || (i = t.placeholder),
                    (n = ce.createTextNode(i)),
                    a.appendChild(n),
                    pe.appendChild(a),
                    v(t, n, r),
                    pe.removeChild(a);
            }
            function H(t) {
                t.drawImage.apply(t, Array.prototype.slice.call(arguments, 1)), (he += 1);
            }
            function V(r, i) {
                var n = t.getComputedStyle(r, i);
                if (n && n.content && "none" !== n.content && "-moz-alt-content" !== n.content && "none" !== n.display) {
                    var a = n.content + "",
                        o = a.substr(0, 1);
                    o === a.substr(a.length - 1) && o.match(/'|"/) && (a = a.substr(1, a.length - 2));
                    var s = "url" === a.substr(0, 3),
                        l = e.createElement(s ? "img" : "span");
                    return (
                        (l.className = me + "-before " + me + "-after"),
                        Object.keys(n)
                            .filter(W)
                            .forEach(function (t) {
                                try {
                                    l.style[t] = n[t];
                                } catch (e) {
                                    de.log(["Tried to assign readonly property ", t, "Error:", e]);
                                }
                            }),
                        s ? (l.src = de.parseBackgroundImage(a)[0].args[0]) : (l.innerHTML = a),
                        l
                    );
                }
            }
            function W(e) {
                return isNaN(t.parseInt(e, 10));
            }
            function $(t, e) {
                var r = V(t, ":before"),
                    i = V(t, ":after");
                (r || i) &&
                    (r && ((t.className += " " + me + "-before"), t.parentNode.insertBefore(r, t), ae(r, e, !0), t.parentNode.removeChild(r), (t.className = t.className.replace(me + "-before", "").trim())),
                    i && ((t.className += " " + me + "-after"), t.appendChild(i), ae(i, e, !0), t.removeChild(i), (t.className = t.className.replace(me + "-after", "").trim())));
            }
            function q(t, e, r, i) {
                var n = Math.round(i.left + r.left),
                    a = Math.round(i.top + r.top);
                t.createPattern(e), t.translate(n, a), t.fill(), t.translate(-n, -a);
            }
            function _(t, e, r, i, n, a, o, s) {
                var l = [];
                l.push(["line", Math.round(n), Math.round(a)]),
                    l.push(["line", Math.round(n + o), Math.round(a)]),
                    l.push(["line", Math.round(n + o), Math.round(s + a)]),
                    l.push(["line", Math.round(n), Math.round(s + a)]),
                    N(t, l),
                    t.save(),
                    t.clip(),
                    q(t, e, r, i),
                    t.restore();
            }
            function j(t, e, r) {
                c(t, e.left, e.top, e.width, e.height, r);
            }
            function Z(t, e, r, i, n) {
                var a = de.BackgroundSize(t, e, i, n),
                    o = de.BackgroundPosition(t, e, i, n, a),
                    s = ge(t, "backgroundRepeat").split(",").map(de.trimText);
                switch (((i = X(i, a)), (s = s[n] || s[0]))) {
                    case "repeat-x":
                        _(r, i, o, e, e.left, e.top + o.top, 99999, i.height);
                        break;
                    case "repeat-y":
                        _(r, i, o, e, e.left + o.left, e.top, i.width, 99999);
                        break;
                    case "no-repeat":
                        _(r, i, o, e, e.left + o.left, e.top + o.top, i.width, i.height);
                        break;
                    default:
                        q(r, i, o, { top: e.top, left: e.left, width: i.width, height: i.height });
                }
            }
            function Q(t, e, r) {
                for (var i, n = ge(t, "backgroundImage"), a = de.parseBackgroundImage(n), o = a.length; o--; )
                    if (((n = a[o]), n.args && 0 !== n.args.length)) {
                        var s = "url" === n.method ? n.args[0] : n.value;
                        (i = k(s)), i ? Z(t, e, r, i, o) : de.log("html2canvas: Error loading background:", n);
                    }
            }
            function X(t, e) {
                if (t.width === e.width && t.height === e.height) return t;
                var r,
                    i = ce.createElement("canvas");
                return (i.width = e.width), (i.height = e.height), (r = i.getContext("2d")), H(r, t, 0, 0, t.width, t.height, 0, 0, e.width, e.height), i;
            }
            function Y(t, e, r) {
                return t.setVariable("globalAlpha", ge(e, "opacity") * (r ? r.opacity : 1));
            }
            function J(t) {
                return t.replace("px", "");
            }
            function K(t) {
                var e = ge(t, "transform") || ge(t, "-webkit-transform") || ge(t, "-moz-transform") || ge(t, "-ms-transform") || ge(t, "-o-transform"),
                    r = ge(t, "transform-origin") || ge(t, "-webkit-transform-origin") || ge(t, "-moz-transform-origin") || ge(t, "-ms-transform-origin") || ge(t, "-o-transform-origin") || "0px 0px";
                r = r.split(" ").map(J).map(de.asFloat);
                var i;
                if (e && "none" !== e) {
                    var n = e.match(be);
                    if (n)
                        switch (n[1]) {
                            case "matrix":
                                i = n[2].split(",").map(de.trimText).map(de.asFloat);
                        }
                }
                return { origin: r, matrix: i };
            }
            function te(t, e, r, i) {
                var l = s(e ? r.width : a(), e ? r.height : o()),
                    h = { ctx: l, opacity: Y(l, t, e), cssPosition: ge(t, "position"), borders: R(t), transform: i, clip: e && e.clip ? de.Extend({}, e.clip) : null };
                return B(t, h, e), n.useOverflow === !0 && /(hidden|scroll|auto)/.test(ge(t, "overflow")) === !0 && /(BODY)/i.test(t.nodeName) === !1 && (h.clip = h.clip ? C(h.clip, r) : r), h;
            }
            function ee(t, e, r) {
                var i = { left: e.left + t[3].width, top: e.top + t[0].width, width: e.width - (t[1].width + t[3].width), height: e.height - (t[0].width + t[2].width) };
                return r && (i = C(i, r)), i;
            }
            function re(t, e) {
                var r = e.matrix ? de.OffsetBounds(t) : de.Bounds(t);
                return (e.origin[0] += r.left), (e.origin[1] += r.top), r;
            }
            function ie(t, e, r, i) {
                var n,
                    a = K(t, e),
                    o = re(t, a),
                    s = te(t, e, o, a),
                    l = s.borders,
                    h = s.ctx,
                    c = ee(l, o, s.clip),
                    d = U(t, o, l),
                    u = fe.test(t.nodeName) ? "#efefef" : ge(t, "backgroundColor");
                switch (
                    (N(h, d.clip),
                    h.save(),
                    h.clip(),
                    c.height > 0 && c.width > 0 && !i ? (j(h, o, u), Q(t, c, h)) : i && (s.backgroundColor = u),
                    h.restore(),
                    d.borders.forEach(function (t) {
                        G(h, t.args, t.color);
                    }),
                    r || $(t, s),
                    t.nodeName)
                ) {
                    case "IMG":
                        (n = k(t.getAttribute("src"))) ? M(h, t, n, o, l) : de.log("html2canvas: Error loading <img>:" + t.getAttribute("src"));
                        break;
                    case "INPUT":
                        /^(text|url|email|submit|button|reset)$/.test(t.type) && (t.value || t.placeholder || "").length > 0 && D(t, o, s);
                        break;
                    case "TEXTAREA":
                        (t.value || t.placeholder || "").length > 0 && D(t, o, s);
                        break;
                    case "SELECT":
                        (t.options || t.placeholder || "").length > 0 && D(t, o, s);
                        break;
                    case "LI":
                        T(t, s, c);
                        break;
                    case "CANVAS":
                        M(h, t, t, o, l);
                }
                return s;
            }
            function ne(t) {
                return "none" !== ge(t, "display") && "hidden" !== ge(t, "visibility") && !t.hasAttribute("data-html2canvas-ignore");
            }
            function ae(t, e, r) {
                ne(t) && ((e = ie(t, e, r, !1) || e), fe.test(t.nodeName) || oe(t, e, r));
            }
            function oe(t, e, r) {
                de.Children(t).forEach(function (i) {
                    i.nodeType === i.ELEMENT_NODE ? ae(i, e, r) : i.nodeType === i.TEXT_NODE && v(t, i, e);
                });
            }
            function se() {
                var t = ge(e.documentElement, "backgroundColor"),
                    r = de.isTransparent(t) && le === e.body,
                    i = ie(le, null, !1, r);
                return oe(le, i), r && (t = i.backgroundColor), pe.removeChild(ye), { backgroundColor: t, stack: i };
            }
            t.scroll(0, 0);
            var le = n.elements === r ? e.body : n.elements[0],
                he = 0,
                ce = le.ownerDocument,
                de = d.Util,
                ue = de.Support(n, ce),
                fe = new RegExp("(" + n.ignoreElements + ")"),
                pe = ce.body,
                ge = de.getCSS,
                me = "___html2canvas___pseudoelement",
                ye = ce.createElement("style");
            (ye.innerHTML = "." + me + '-before:before { content: "" !important; display: none !important; }.' + me + '-after:after { content: "" !important; display: none !important; }'), pe.appendChild(ye), (i = i || {});
            var we = (function (t) {
                    return function (e, r, i, n) {
                        var a = i * t,
                            o = n * t,
                            s = e + i,
                            l = r + n;
                        return {
                            topLeft: z({ x: e, y: l }, { x: e, y: l - o }, { x: s - a, y: r }, { x: s, y: r }),
                            topRight: z({ x: e, y: r }, { x: e + a, y: r }, { x: s, y: l - o }, { x: s, y: l }),
                            bottomRight: z({ x: s, y: r }, { x: s, y: r + o }, { x: e + a, y: l }, { x: e, y: l }),
                            bottomLeft: z({ x: s, y: l }, { x: s - a, y: l }, { x: e, y: r + o }, { x: e, y: r }),
                        };
                    };
                })(4 * ((Math.sqrt(2) - 1) / 3)),
                be = /(matrix)\((.+)\)/;
            return se();
        }),
        (d.Preload = function (i) {
            function n(t) {
                (k.href = t), (k.href = k.href);
                var e = k.protocol + k.host;
                return e === g;
            }
            function a() {
                x.log("html2canvas: start: images: " + b.numLoaded + " / " + b.numTotal + " (failed: " + b.numFailed + ")"),
                    !b.firstRun && b.numLoaded >= b.numTotal && (x.log("Finished loading images: # " + b.numTotal + " (failed: " + b.numFailed + ")"), "function" == typeof i.complete && i.complete(b));
            }
            function o(e, n, o) {
                var s,
                    l,
                    h = i.proxy;
                (k.href = e),
                    (e = k.href),
                    (s = "html2canvas_" + v++),
                    (o.callbackname = s),
                    (h += h.indexOf("?") > -1 ? "&" : "?"),
                    (h += "url=" + encodeURIComponent(e) + "&callback=" + s),
                    (l = E.createElement("script")),
                    (t[s] = function (e) {
                        "error:" === e.substring(0, 6) ? ((o.succeeded = !1), b.numLoaded++, b.numFailed++, a()) : (p(n, o), (n.src = e)), (t[s] = r);
                        try {
                            delete t[s];
                        } catch (i) {}
                        l.parentNode.removeChild(l), (l = null), delete o.script, delete o.callbackname;
                    }),
                    l.setAttribute("type", "text/javascript"),
                    l.setAttribute("src", h),
                    (o.script = l),
                    t.document.body.appendChild(l);
            }
            function s(e, r) {
                var i = t.getComputedStyle(e, r),
                    n = i.content;
                "url" === n.substr(0, 3) && m.loadImage(d.Util.parseBackgroundImage(n)[0].args[0]), u(i.backgroundImage, e);
            }
            function l(t) {
                s(t, ":before"), s(t, ":after");
            }
            function h(t, e) {
                var i = d.Generate.Gradient(t, e);
                i !== r && ((b[t] = { img: i, succeeded: !0 }), b.numTotal++, b.numLoaded++, a());
            }
            function c(t) {
                return t && t.method && t.args && t.args.length > 0;
            }
            function u(t, e) {
                var i;
                d.Util.parseBackgroundImage(t)
                    .filter(c)
                    .forEach(function (t) {
                        "url" === t.method ? m.loadImage(t.args[0]) : t.method.match(/\-?gradient$/) && (i === r && (i = d.Util.Bounds(e)), h(t.value, i));
                    });
            }
            function f(t) {
                var e = !1;
                try {
                    x.Children(t).forEach(f);
                } catch (i) {}
                try {
                    e = t.nodeType;
                } catch (n) {
                    (e = !1), x.log("html2canvas: failed to access some element's nodeType - Exception: " + n.message);
                }
                if (1 === e || e === r) {
                    l(t);
                    try {
                        u(x.getCSS(t, "backgroundImage"), t);
                    } catch (i) {
                        x.log("html2canvas: failed to get background-image - Exception: " + i.message);
                    }
                    u(t);
                }
            }
            function p(e, n) {
                (e.onload = function () {
                    n.timer !== r && t.clearTimeout(n.timer), b.numLoaded++, (n.succeeded = !0), (e.onerror = e.onload = null), a();
                }),
                    (e.onerror = function () {
                        if ("anonymous" === e.crossOrigin && (t.clearTimeout(n.timer), i.proxy)) {
                            var r = e.src;
                            return (e = new Image()), (n.img = e), (e.src = r), void o(e.src, e, n);
                        }
                        b.numLoaded++, b.numFailed++, (n.succeeded = !1), (e.onerror = e.onload = null), a();
                    });
            }
            var g,
                m,
                y,
                w,
                b = { numLoaded: 0, numFailed: 0, numTotal: 0, cleanupDone: !1 },
                x = d.Util,
                v = 0,
                I = i.elements[0] || e.body,
                E = I.ownerDocument,
                S = I.getElementsByTagName("img"),
                T = S.length,
                k = E.createElement("a"),
                C = (function (t) {
                    return t.crossOrigin !== r;
                })(new Image());
            for (
                k.href = t.location.href,
                    g = k.protocol + k.host,
                    m = {
                        loadImage: function (t) {
                            var e, a;
                            t &&
                                b[t] === r &&
                                ((e = new Image()),
                                t.match(/data:image\/.*;base64,/i)
                                    ? ((e.src = t.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, "")), (a = b[t] = { img: e }), b.numTotal++, p(e, a))
                                    : n(t) || i.allowTaint === !0
                                    ? ((a = b[t] = { img: e }), b.numTotal++, p(e, a), (e.src = t))
                                    : C && !i.allowTaint && i.useCORS
                                    ? ((e.crossOrigin = "anonymous"), (a = b[t] = { img: e }), b.numTotal++, p(e, a), (e.src = t))
                                    : i.proxy && ((a = b[t] = { img: e }), b.numTotal++, o(t, e, a)));
                        },
                        cleanupDOM: function (n) {
                            var o, s;
                            if (!b.cleanupDone) {
                                x.log(n && "string" == typeof n ? "html2canvas: Cleanup because: " + n : "html2canvas: Cleanup after timeout: " + i.timeout + " ms.");
                                for (s in b)
                                    if (b.hasOwnProperty(s) && ((o = b[s]), "object" == typeof o && o.callbackname && o.succeeded === r)) {
                                        t[o.callbackname] = r;
                                        try {
                                            delete t[o.callbackname];
                                        } catch (l) {}
                                        o.script && o.script.parentNode && (o.script.setAttribute("src", "about:blank"), o.script.parentNode.removeChild(o.script)),
                                            b.numLoaded++,
                                            b.numFailed++,
                                            x.log("html2canvas: Cleaned up failed img: '" + s + "' Steps: " + b.numLoaded + " / " + b.numTotal);
                                    }
                                t.stop !== r ? t.stop() : e.execCommand !== r && e.execCommand("Stop", !1), e.close !== r && e.close(), (b.cleanupDone = !0), (n && "string" == typeof n) || a();
                            }
                        },
                        renderingDone: function () {
                            w && t.clearTimeout(w);
                        },
                    },
                    i.timeout > 0 && (w = t.setTimeout(m.cleanupDOM, i.timeout)),
                    x.log("html2canvas: Preload starts: finding background-images"),
                    b.firstRun = !0,
                    f(I),
                    x.log("html2canvas: Preload: Finding images"),
                    y = 0;
                T > y;
                y += 1
            )
                m.loadImage(S[y].getAttribute("src"));
            return (b.firstRun = !1), x.log("html2canvas: Preload: Done."), b.numTotal === b.numLoaded && a(), m;
        }),
        (d.Renderer = function (t, i) {
            function n(t) {
                function e(t) {
                    Object.keys(t)
                        .sort()
                        .forEach(function (r) {
                            var i = [],
                                a = [],
                                o = [],
                                s = [];
                            t[r].forEach(function (t) {
                                t.node.zIndex.isPositioned || t.node.zIndex.opacity < 1 ? o.push(t) : t.node.zIndex.isFloated ? a.push(t) : i.push(t);
                            }),
                                (function l(t) {
                                    t.forEach(function (t) {
                                        s.push(t), t.children && l(t.children);
                                    });
                                })(i.concat(a, o)),
                                s.forEach(function (t) {
                                    t.context ? e(t.context) : n.push(t.node);
                                });
                        });
                }
                var i,
                    n = [];
                return (
                    (i = (function (t) {
                        function e(t, i, n) {
                            var a = "auto" === i.zIndex.zindex ? 0 : Number(i.zIndex.zindex),
                                o = t,
                                s = i.zIndex.isPositioned,
                                l = i.zIndex.isFloated,
                                h = { node: i },
                                c = n;
                            i.zIndex.ownStacking ? ((o = h.context = { "!": [{ node: i, children: [] }] }), (c = r)) : (s || l) && (c = h.children = []),
                                0 === a && n ? n.push(h) : (t[a] || (t[a] = []), t[a].push(h)),
                                i.zIndex.children.forEach(function (t) {
                                    e(o, t, c);
                                });
                        }
                        var i = {};
                        return e(i, t), i;
                    })(t)),
                    e(i),
                    n
                );
            }
            function a(t) {
                var e;
                if ("string" == typeof i.renderer && d.Renderer[t] !== r) e = d.Renderer[t](i);
                else {
                    if ("function" != typeof t) throw new Error("Unknown renderer");
                    e = t(i);
                }
                if ("function" != typeof e) throw new Error("Invalid renderer defined");
                return e;
            }
            return a(i.renderer)(t, i, e, n(t.stack), d);
        }),
        (d.Util.Support = function (t, e) {
            function i() {
                var t = new Image(),
                    i = e.createElement("canvas"),
                    n = i.getContext === r ? !1 : i.getContext("2d");
                if (n === !1) return !1;
                (i.width = i.height = 10),
                    (t.src = [
                        "data:image/svg+xml,",
                        "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
                        "<foreignObject width='10' height='10'>",
                        "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
                        "sup",
                        "</div>",
                        "</foreignObject>",
                        "</svg>",
                    ].join(""));
                try {
                    n.drawImage(t, 0, 0), i.toDataURL();
                } catch (a) {
                    return !1;
                }
                return d.Util.log("html2canvas: Parse: SVG powered rendering available"), !0;
            }
            function n() {
                var t,
                    r,
                    i,
                    n,
                    a = !1;
                return (
                    e.createRange &&
                        ((t = e.createRange()),
                        t.getBoundingClientRect &&
                            ((r = e.createElement("boundtest")),
                            (r.style.height = "123px"),
                            (r.style.display = "block"),
                            e.body.appendChild(r),
                            t.selectNode(r),
                            (i = t.getBoundingClientRect()),
                            (n = i.height),
                            123 === n && (a = !0),
                            e.body.removeChild(r))),
                    a
                );
            }
            return { rangeBounds: n(), svgRendering: t.svgRendering && i() };
        }),
        (t.html2canvas = function (e, r) {
            e = e.length ? e : [e];
            var i,
                n,
                a = {
                    logging: !1,
                    elements: e,
                    background: "#fff",
                    proxy: null,
                    timeout: 0,
                    useCORS: !1,
                    allowTaint: !1,
                    svgRendering: !1,
                    ignoreElements: "IFRAME|OBJECT|PARAM",
                    useOverflow: !0,
                    letterRendering: !1,
                    chinese: !1,
                    width: null,
                    height: null,
                    taintTest: !0,
                    renderer: "Canvas",
                };
            return (
                (a = d.Util.Extend(r, a)),
                (d.logging = a.logging),
                (a.complete = function (t) {
                    ("function" != typeof a.onpreloaded || a.onpreloaded(t) !== !1) &&
                        ((i = d.Parse(t, a)), ("function" != typeof a.onparsed || a.onparsed(i) !== !1) && ((n = d.Renderer(i, a)), "function" == typeof a.onrendered && a.onrendered(n)));
                }),
                t.setTimeout(function () {
                    d.Preload(a);
                }, 0),
                {
                    render: function (t, e) {
                        return d.Renderer(t, d.Util.Extend(e, a));
                    },
                    parse: function (t, e) {
                        return d.Parse(t, d.Util.Extend(e, a));
                    },
                    preload: function (t) {
                        return d.Preload(d.Util.Extend(t, a));
                    },
                    log: d.Util.log,
                }
            );
        }),
        (t.html2canvas.log = d.Util.log),
        (t.html2canvas.Renderer = { Canvas: r }),
        (d.Renderer.Canvas = function (t) {
            function i(t, e) {
                t.beginPath(),
                    e.forEach(function (e) {
                        t[e.name].apply(t, e.arguments);
                    }),
                    t.closePath();
            }
            function n(t) {
                if (-1 === s.indexOf(t.arguments[0].src)) {
                    h.drawImage(t.arguments[0], 0, 0);
                    try {
                        h.getImageData(0, 0, 1, 1);
                    } catch (e) {
                        return (l = o.createElement("canvas")), (h = l.getContext("2d")), !1;
                    }
                    s.push(t.arguments[0].src);
                }
                return !0;
            }
            function a(e, r) {
                switch (r.type) {
                    case "variable":
                        e[r.name] = r.arguments;
                        break;
                    case "function":
                        switch (r.name) {
                            case "createPattern":
                                if (r.arguments[0].width > 0 && r.arguments[0].height > 0)
                                    try {
                                        e.fillStyle = e.createPattern(r.arguments[0], "repeat");
                                    } catch (a) {
                                        c.log("html2canvas: Renderer: Error creating pattern", a.message);
                                    }
                                break;
                            case "drawShape":
                                i(e, r.arguments);
                                break;
                            case "drawImage":
                                r.arguments[8] > 0 && r.arguments[7] > 0 && (!t.taintTest || (t.taintTest && n(r))) && e.drawImage.apply(e, r.arguments);
                                break;
                            default:
                                e[r.name].apply(e, r.arguments);
                        }
                }
            }
            t = t || {};
            var o = e,
                s = [],
                l = e.createElement("canvas"),
                h = l.getContext("2d"),
                c = d.Util,
                u = t.canvas || o.createElement("canvas");
            return function (t, e, i, n, o) {
                var s,
                    l,
                    h,
                    d = u.getContext("2d"),
                    f = t.stack;
                return (
                    (u.width = u.style.width = e.width || f.ctx.width),
                    (u.height = u.style.height = e.height || f.ctx.height),
                    (h = d.fillStyle),
                    (d.fillStyle = c.isTransparent(f.backgroundColor) && e.background !== r ? e.background : t.backgroundColor),
                    d.fillRect(0, 0, u.width, u.height),
                    (d.fillStyle = h),
                    n.forEach(function (t) {
                        (d.textBaseline = "bottom"),
                            d.save(),
                            t.transform.matrix && (d.translate(t.transform.origin[0], t.transform.origin[1]), d.transform.apply(d, t.transform.matrix), d.translate(-t.transform.origin[0], -t.transform.origin[1])),
                            t.clip && (d.beginPath(), d.rect(t.clip.left, t.clip.top, t.clip.width, t.clip.height), d.clip()),
                            t.ctx.storage &&
                                t.ctx.storage.forEach(function (t) {
                                    a(d, t);
                                }),
                            d.restore();
                    }),
                    c.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj"),
                    1 === e.elements.length && "object" == typeof e.elements[0] && "BODY" !== e.elements[0].nodeName
                        ? ((l = o.Util.Bounds(e.elements[0])),
                          (s = i.createElement("canvas")),
                          (s.width = Math.ceil(l.width)),
                          (s.height = Math.ceil(l.height)),
                          (d = s.getContext("2d")),
                          d.drawImage(u, l.left, l.top, l.width, l.height, 0, 0, l.width, l.height),
                          (u = null),
                          s)
                        : u
                );
            };
        });
})(window, document);
var workerSrc =
    'function toInt(t){return~~t}function NeuQuant(t,i){function e(){f=[],d=[],l=[],y=[],m=[];var t,i;for(t=0;netsize>t;t++)i=(t<<netbiasshift+8)/netsize,f[t]=[i,i,i],y[t]=intbias/netsize,l[t]=0}function r(){for(var t=0;netsize>t;t++)f[t][0]>>=netbiasshift,f[t][1]>>=netbiasshift,f[t][2]>>=netbiasshift,f[t][3]=t}function s(t,i,e,r,s){f[i][0]-=t*(f[i][0]-e)/initalpha,f[i][1]-=t*(f[i][1]-r)/initalpha,f[i][2]-=t*(f[i][2]-s)/initalpha}function a(t,i,e,r,s){for(var a,n,o=Math.abs(i-t),h=Math.min(i+t,netsize),p=i+1,u=i-1,c=1;h>p||u>o;)n=m[c++],h>p&&(a=f[p++],a[0]-=n*(a[0]-e)/alpharadbias,a[1]-=n*(a[1]-r)/alpharadbias,a[2]-=n*(a[2]-s)/alpharadbias),u>o&&(a=f[u--],a[0]-=n*(a[0]-e)/alpharadbias,a[1]-=n*(a[1]-r)/alpharadbias,a[2]-=n*(a[2]-s)/alpharadbias)}function n(t,i,e){var r,s,a,n,o,h=~(1<<31),p=h,u=-1,c=u;for(r=0;netsize>r;r++)s=f[r],a=Math.abs(s[0]-t)+Math.abs(s[1]-i)+Math.abs(s[2]-e),h>a&&(h=a,u=r),n=a-(l[r]>>intbiasshift-netbiasshift),p>n&&(p=n,c=r),o=y[r]>>betashift,y[r]-=o,l[r]+=o<<gammashift;return y[u]+=beta,l[u]-=betagamma,c}function o(){var t,i,e,r,s,a,n=0,o=0;for(t=0;netsize>t;t++){for(e=f[t],s=t,a=e[1],i=t+1;netsize>i;i++)r=f[i],r[1]<a&&(s=i,a=r[1]);if(r=f[s],t!=s&&(i=r[0],r[0]=e[0],e[0]=i,i=r[1],r[1]=e[1],e[1]=i,i=r[2],r[2]=e[2],e[2]=i,i=r[3],r[3]=e[3],e[3]=i),a!=n){for(d[n]=o+t>>1,i=n+1;a>i;i++)d[i]=t;n=a,o=t}}for(d[n]=o+maxnetpos>>1,i=n+1;256>i;i++)d[i]=maxnetpos}function h(t,i,e){for(var r,s,a,n=1e3,o=-1,h=d[i],p=h-1;netsize>h||p>=0;)netsize>h&&(s=f[h],a=s[1]-i,a>=n?h=netsize:(h++,0>a&&(a=-a),r=s[0]-t,0>r&&(r=-r),a+=r,n>a&&(r=s[2]-e,0>r&&(r=-r),a+=r,n>a&&(n=a,o=s[3])))),p>=0&&(s=f[p],a=i-s[1],a>=n?p=-1:(p--,0>a&&(a=-a),r=s[0]-t,0>r&&(r=-r),a+=r,n>a&&(r=s[2]-e,0>r&&(r=-r),a+=r,n>a&&(n=a,o=s[3]))));return o}function p(){var e,r=t.length,o=toInt(30+(i-1)/3),h=toInt(r/(3*i)),p=toInt(h/ncycles),u=initalpha,c=initradius,f=c>>radiusbiasshift;for(1>=f&&(f=0),e=0;f>e;e++)m[e]=toInt(u*((f*f-e*e)*radbias/(f*f)));var d;minpicturebytes>r?(i=1,d=3):d=r%prime1!==0?3*prime1:r%prime2!==0?3*prime2:r%prime3!==0?3*prime3:3*prime4;var l,y,w,b,g=0;for(e=0;h>e;)if(l=(255&t[g])<<netbiasshift,y=(255&t[g+1])<<netbiasshift,w=(255&t[g+2])<<netbiasshift,b=n(l,y,w),s(u,b,l,y,w),0!==f&&a(f,b,l,y,w),g+=d,g>=r&&(g-=r),e++,0===p&&(p=1),e%p===0)for(u-=u/o,c-=c/radiusdec,f=c>>radiusbiasshift,1>=f&&(f=0),b=0;f>b;b++)m[b]=toInt(u*((f*f-b*b)*radbias/(f*f)))}function u(){e(),p(),r(),o()}function c(){for(var t=[],i=[],e=0;netsize>e;e++)i[f[e][3]]=e;for(var r=0,s=0;netsize>s;s++){var a=i[s];t[r++]=f[a][0],t[r++]=f[a][1],t[r++]=f[a][2]}return t}var f,d,l,y,m;this.buildColormap=u,this.getColormap=c,this.lookupRGB=h}function LZWEncoder(t,i,e,r){function s(t,i){B[l++]=t,l>=254&&p(i)}function a(t){n(HSIZE),v=w+2,x=!0,f(w,t)}function n(t){for(var i=0;t>i;++i)I[i]=-1}function o(t,i){var e,r,s,o,h,p,d;for(m=t,x=!1,n_bits=m,y=u(n_bits),w=1<<t-1,b=w+1,v=w+2,l=0,o=c(),d=0,e=HSIZE;65536>e;e*=2)++d;d=8-d,p=HSIZE,n(p),f(w,i);t:for(;(r=c())!=EOF;)if(e=(r<<BITS)+o,s=r<<d^o,I[s]!==e){if(I[s]>=0){h=p-s,0===s&&(h=1);do if((s-=h)<0&&(s+=p),I[s]===e){o=E[s];continue t}while(I[s]>=0)}f(o,i),o=r,1<<BITS>v?(E[s]=v++,I[s]=e):a(i)}else o=E[s];f(o,i),f(b,i)}function h(e){e.writeByte(g),remaining=t*i,curPixel=0,o(g+1,e),e.writeByte(0)}function p(t){l>0&&(t.writeByte(l),t.writeBytes(B,0,l),l=0)}function u(t){return(1<<t)-1}function c(){if(0===remaining)return EOF;--remaining;var t=e[curPixel++];return 255&t}function f(t,i){for(d&=masks[F],F>0?d|=t<<F:d=t,F+=n_bits;F>=8;)s(255&d,i),d>>=8,F-=8;if((v>y||x)&&(x?(y=u(n_bits=m),x=!1):(++n_bits,y=n_bits==BITS?1<<BITS:u(n_bits))),t==b){for(;F>0;)s(255&d,i),d>>=8,F-=8;p(i)}}var d,l,y,m,w,b,g=Math.max(2,r),B=new Uint8Array(256),I=new Int32Array(HSIZE),E=new Int32Array(HSIZE),F=0,v=0,x=!1;this.encode=h}function ByteArray(){this.page=-1,this.pages=[],this.newPage()}function GIFEncoder(t,i){this.width=~~t,this.height=~~i,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.out=new ByteArray}module={set exports(t){module[t.name]=t}},require=function(t){return t=t.replace(/Typed/,""),t=t.match(/\\/(.*)\\./)[1],module[t]};var ncycles=100,netsize=256,maxnetpos=netsize-1,netbiasshift=4,intbiasshift=16,intbias=1<<intbiasshift,gammashift=10,gamma=1<<gammashift,betashift=10,beta=intbias>>betashift,betagamma=intbias<<gammashift-betashift,initrad=netsize>>3,radiusbiasshift=6,radiusbias=1<<radiusbiasshift,initradius=initrad*radiusbias,radiusdec=30,alphabiasshift=10,initalpha=1<<alphabiasshift,alphadec,radbiasshift=8,radbias=1<<radbiasshift,alpharadbshift=alphabiasshift+radbiasshift,alpharadbias=1<<alpharadbshift,prime1=499,prime2=491,prime3=487,prime4=503,minpicturebytes=3*prime4;module.exports=NeuQuant;var EOF=-1,BITS=12,HSIZE=5003,masks=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];module.exports=LZWEncoder;var NeuQuant=require("./TypedNeuQuant.js"),LZWEncoder=require("./LZWEncoder.js");ByteArray.pageSize=4096,ByteArray.charMap={};for(var i=0;256>i;i++)ByteArray.charMap[i]=String.fromCharCode(i);ByteArray.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(ByteArray.pageSize),this.cursor=0},ByteArray.prototype.getData=function(){for(var t="",i=0;i<this.pages.length;i++)for(var e=0;e<ByteArray.pageSize;e++)t+=ByteArray.charMap[this.pages[i][e]];return t},ByteArray.prototype.writeByte=function(t){this.cursor>=ByteArray.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=t},ByteArray.prototype.writeUTFBytes=function(t){for(var i=t.length,e=0;i>e;e++)this.writeByte(t.charCodeAt(e))},ByteArray.prototype.writeBytes=function(t,i,e){for(var r=e||t.length,s=i||0;r>s;s++)this.writeByte(t[s])},GIFEncoder.prototype.setDelay=function(t){this.delay=Math.round(t/10)},GIFEncoder.prototype.setFrameRate=function(t){this.delay=Math.round(100/t)},GIFEncoder.prototype.setDispose=function(t){t>=0&&(this.dispose=t)},GIFEncoder.prototype.setRepeat=function(t){this.repeat=t},GIFEncoder.prototype.setTransparent=function(t){this.transparent=t},GIFEncoder.prototype.addFrame=function(t){this.image=t,this.getImagePixels(),this.analyzePixels(),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.writePalette(),this.writePixels(),this.firstFrame=!1},GIFEncoder.prototype.finish=function(){this.out.writeByte(59)},GIFEncoder.prototype.setQuality=function(t){1>t&&(t=1),this.sample=t},GIFEncoder.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")},GIFEncoder.prototype.analyzePixels=function(){var t=this.pixels.length,i=t/3;this.indexedPixels=new Uint8Array(i);var e=new NeuQuant(this.pixels,this.sample);e.buildColormap(),this.colorTab=e.getColormap();for(var r=0,s=0;i>s;s++){var a=e.lookupRGB(255&this.pixels[r++],255&this.pixels[r++],255&this.pixels[r++]);this.usedEntry[a]=!0,this.indexedPixels[s]=a}this.pixels=null,this.colorDepth=8,this.palSize=7,null!==this.transparent&&(this.transIndex=this.findClosest(this.transparent))},GIFEncoder.prototype.findClosest=function(t){if(null===this.colorTab)return-1;for(var i=(16711680&t)>>16,e=(65280&t)>>8,r=255&t,s=0,a=16777216,n=this.colorTab.length,o=0;n>o;){var h=i-(255&this.colorTab[o++]),p=e-(255&this.colorTab[o++]),u=r-(255&this.colorTab[o]),c=h*h+p*p+u*u,f=parseInt(o/3);this.usedEntry[f]&&a>c&&(a=c,s=f),o++}return s},GIFEncoder.prototype.getImagePixels=function(){var t=this.width,i=this.height;this.pixels=new Uint8Array(t*i*3);for(var e=this.image,r=0,s=0;i>s;s++)for(var a=0;t>a;a++){var n=s*t*4+4*a;this.pixels[r++]=e[n],this.pixels[r++]=e[n+1],this.pixels[r++]=e[n+2]}},GIFEncoder.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4);var t,i;null===this.transparent?(t=0,i=0):(t=1,i=2),this.dispose>=0&&(i=7&dispose),i<<=2,this.out.writeByte(0|i|0|t),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},GIFEncoder.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(this.firstFrame?0:128|this.palSize)},GIFEncoder.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},GIFEncoder.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes("NETSCAPE2.0"),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},GIFEncoder.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);for(var t=768-this.colorTab.length,i=0;t>i;i++)this.out.writeByte(0)},GIFEncoder.prototype.writeShort=function(t){this.out.writeByte(255&t),this.out.writeByte(t>>8&255)},GIFEncoder.prototype.writePixels=function(){var t=new LZWEncoder(this.width,this.height,this.indexedPixels,this.colorDepth);t.encode(this.out)},GIFEncoder.prototype.stream=function(){return this.out},module.exports=GIFEncoder;var encoder,cmd={init:function(t){encoder=new GIFEncoder(t.width,t.height),encoder.setQuality(t.quality||30),encoder.setDelay(t.delay||0),encoder.setRepeat(t.repeat||0),encoder.writeHeader(),encoder.firstFrame=!0},addFrame:function(t){encoder.addFrame(t),encoder.firstFrame=!1},end:function(){self.postMessage(encoder.out.getData())}};self.addEventListener("message",function(t){var i=t.data,e=cmd[t.data.cmd];e||(e=cmd.addFrame),e(i)},!1);';
(Html2Gif.prototype.start = function (t, e) {
    var r = this;
    t > 0 &&
        e > 0 &&
        (r.timer = setInterval(function () {
            r.snap(), e--, 0 === e && r.end();
        }, t));
}),
    (Html2Gif.prototype.snap = function () {
        var t = this;
        var rect = t.element.getBoundingClientRect();
        var width = rect.right - rect.left;
        var height = rect.bottom- rect.top;
        html2canvas(document.body, {
            onrendered: function (e) {
                var r = e.getContext("2d");
                t.worker.postMessage(r.getImageData(rect.left, rect.top, width, height).data);
            },
            width: width+5000,
            height: height+5000,
        });
    }),
    (Html2Gif.prototype.end = function () {
        clearInterval(this.timer), this.worker.postMessage({ cmd: "end" });
    });
