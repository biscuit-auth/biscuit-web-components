var Module = void 0 !== Module ? Module : {}
var TreeSitter = function() {
  var e, t = "object" == typeof window ? { currentScript: window.document.currentScript } : null;

  class Parser {
    constructor () {
      this.initialize();
    }

    initialize () {
      throw new Error("cannot construct a Parser before calling `init()`");
    }

    static init (r) {
      return e || (Module = Object.assign({}, Module, r), e = new Promise(e => {
        var r, n = {};
        for (r in Module) Module.hasOwnProperty(r) && (n[r] = Module[r]);
        var o, s, _ = [], a = "./this.program", i = function(e, t) {
          throw t;
        }, u = !1, l = !1;
        u = "object" == typeof window, l = "function" == typeof importScripts, o = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, s = !u && !o && !l;
        var d, c, m, f, p, h = "";
        o ? (h = l ? require("path").dirname(h) + "/" : __dirname + "/", d = function(e, t) {
          return f || (f = require("fs")), p || (p = require("path")), e = p.normalize(e), f.readFileSync(e, t ? null : "utf8");
        }, m = function(e) {
          var t = d(e, !0);
          return t.buffer || (t = new Uint8Array(t)), k(t.buffer), t;
        }, process.argv.length > 1 && (a = process.argv[1].replace(/\\/g, "/")), _ = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), i = function(e) {
          process.exit(e);
        }, Module.inspect = function() {
          return "[Emscripten Module object]";
        }) : s ? ("undefined" != typeof read && (d = function(e) {
          return read(e);
        }), m = function(e) {
          var t;
          return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (k("object" == typeof (t = read(e, "binary"))), t);
        }, "undefined" != typeof scriptArgs ? _ = scriptArgs : void 0 !== arguments && (_ = arguments), "function" == typeof quit && (i = function(e) {
          quit(e);
        }), "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (u || l) && (l ? h = self.location.href : void 0 !== t && t.currentScript && (h = t.currentScript.src), h = 0 !== h.indexOf("blob:") ? h.substr(0, h.lastIndexOf("/") + 1) : "", d = function(e) {
          var t = new XMLHttpRequest;
          return t.open("GET", e, !1), t.send(null), t.responseText;
        }, l && (m = function(e) {
          var t = new XMLHttpRequest;
          return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
        }), c = function(e, t, r) {
          var n = new XMLHttpRequest;
          n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function() {
            200 == n.status || 0 == n.status && n.response ? t(n.response) : r();
          }, n.onerror = r, n.send(null);
        });
        Module.print || console.log.bind(console);
        var g = Module.printErr || console.warn.bind(console);
        for (r in n) n.hasOwnProperty(r) && (Module[r] = n[r]);
        n = null, Module.arguments && (_ = Module.arguments), Module.thisProgram && (a = Module.thisProgram), Module.quit && (i = Module.quit);
        var w = 16;
        var M, y = [];

        function b (e, t) {
          if (!M) {
            M = new WeakMap;
            for (var r = 0; r < K.length; r++) {
              var n = K.get(r);
              n && M.set(n, r);
            }
          }
          if (M.has(e)) {
            return M.get(e);
          }
          var o = function() {
            if (y.length) {
              return y.pop();
            }
            try {
              K.grow(1);
            }
            catch (e) {
              if (!(e instanceof RangeError)) {
                throw e;
              }
              throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
            }
            return K.length - 1;
          }();
          try {
            K.set(o, e);
          }
          catch (r) {
            if (!(r instanceof TypeError)) {
              throw r;
            }
            var s = function(e, t) {
              if ("function" == typeof WebAssembly.Function) {
                for (var r = { i: "i32", j: "i64", f: "f32", d: "f64" }, n = {
                  parameters: [],
                  results: "v" == t[0] ? [] : [r[t[0]]]
                }, o = 1; o < t.length; ++o) n.parameters.push(r[t[o]]);
                return new WebAssembly.Function(n, e);
              }
              var s = [1, 0, 1, 96], _ = t.slice(0, 1), a = t.slice(1), i = { i: 127, j: 126, f: 125, d: 124 };
              for (s.push(a.length), o = 0; o < a.length; ++o) s.push(i[a[o]]);
              "v" == _ ? s.push(0) : s = s.concat([1, i[_]]), s[1] = s.length - 2;
              var u = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(s, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])),
                l = new WebAssembly.Module(u);
              return new WebAssembly.Instance(l, { e: { f: e } }).exports.f;
            }(e, t);
            K.set(o, s);
          }
          return M.set(e, o), o;
        }

        var v, E = function(e) {
          e;
        }, S = Module.dynamicLibraries || [];
        Module.wasmBinary && (v = Module.wasmBinary);
        var I, A = Module.noExitRuntime || !0;

        function x (e, t, r, n) {
          switch ("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"), r) {
            case"i1":
            case"i8":
              q[e >> 0] = t;
              break;
            case"i16":
              R[e >> 1] = t;
              break;
            case"i32":
              W[e >> 2] = t;
              break;
            case"i64":
              ie = [t >>> 0, (ae = t, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[e >> 2] = ie[0], W[e + 4 >> 2] = ie[1];
              break;
            case"float":
              L[e >> 2] = t;
              break;
            case"double":
              O[e >> 3] = t;
              break;
            default:
              se("invalid type for setValue: " + r);
          }
        }

        function N (e, t, r) {
          switch ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t) {
            case"i1":
            case"i8":
              return q[e >> 0];
            case"i16":
              return R[e >> 1];
            case"i32":
            case"i64":
              return W[e >> 2];
            case"float":
              return L[e >> 2];
            case"double":
              return O[e >> 3];
            default:
              se("invalid type for getValue: " + t);
          }
          return null;
        }

        "object" != typeof WebAssembly && se("no native wasm support detected");
        var P = !1;

        function k (e, t) {
          e || se("Assertion failed: " + t);
        }

        var F = 1;
        var C, q, T, R, W, L, O, j = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

        function $ (e, t, r) {
          for (var n = t + r, o = t; e[o] && !(o >= n);) ++o;
          if (o - t > 16 && e.subarray && j) {
            return j.decode(e.subarray(t, o));
          }
          for (var s = ""; t < o;) {
            var _ = e[t++];
            if (128 & _) {
              var a = 63 & e[t++];
              if (192 != (224 & _)) {
                var i = 63 & e[t++];
                if ((_ = 224 == (240 & _) ? (15 & _) << 12 | a << 6 | i : (7 & _) << 18 | a << 12 | i << 6 | 63 & e[t++]) < 65536) {
                  s += String.fromCharCode(_);
                }
                else {
                  var u = _ - 65536;
                  s += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u);
                }
              }
              else {
                s += String.fromCharCode((31 & _) << 6 | a);
              }
            }
            else {
              s += String.fromCharCode(_);
            }
          }
          return s;
        }

        function Z (e, t) {
          return e ? $(T, e, t) : "";
        }

        function D (e, t, r, n) {
          if (!(n > 0)) {
            return 0;
          }
          for (var o = r, s = r + n - 1, _ = 0; _ < e.length; ++_) {
            var a = e.charCodeAt(_);
            if (a >= 55296 && a <= 57343) {
              a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++_);
            }
            if (a <= 127) {
              if (r >= s) {
                break;
              }
              t[r++] = a;
            }
            else if (a <= 2047) {
              if (r + 1 >= s) {
                break;
              }
              t[r++] = 192 | a >> 6, t[r++] = 128 | 63 & a;
            }
            else if (a <= 65535) {
              if (r + 2 >= s) {
                break;
              }
              t[r++] = 224 | a >> 12, t[r++] = 128 | a >> 6 & 63, t[r++] = 128 | 63 & a;
            }
            else {
              if (r + 3 >= s) {
                break;
              }
              t[r++] = 240 | a >> 18, t[r++] = 128 | a >> 12 & 63, t[r++] = 128 | a >> 6 & 63, t[r++] = 128 | 63 & a;
            }
          }
          return t[r] = 0, r - o;
        }

        function z (e, t, r) {
          return D(e, T, t, r);
        }

        function U (e) {
          for (var t = 0, r = 0; r < e.length; ++r) {
            var n = e.charCodeAt(r);
            n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++r)), n <= 127 ? ++t : t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4;
          }
          return t;
        }

        function H (e) {
          var t = U(e) + 1, r = Be(t);
          return D(e, q, r, t), r;
        }

        function G (e) {
          C = e, Module.HEAP8 = q = new Int8Array(e), Module.HEAP16 = R = new Int16Array(e), Module.HEAP32 = W = new Int32Array(e), Module.HEAPU8 = T = new Uint8Array(e), Module.HEAPU16 = new Uint16Array(e), Module.HEAPU32 = new Uint32Array(e), Module.HEAPF32 = L = new Float32Array(e), Module.HEAPF64 = O = new Float64Array(e);
        }

        var B = Module.INITIAL_MEMORY || 33554432;
        (I = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({
          initial: B / 65536,
          maximum: 32768
        })) && (C = I.buffer), B = C.byteLength, G(C);
        var K = new WebAssembly.Table({ initial: 20, element: "anyfunc" }), V = [], X = [], Q = [], J = [], Y = !1;
        var ee = 0, te = null, re = null;

        function ne (e) {
          ee++, Module.monitorRunDependencies && Module.monitorRunDependencies(ee);
        }

        function oe (e) {
          if (ee--, Module.monitorRunDependencies && Module.monitorRunDependencies(ee), 0 == ee && (null !== te && (clearInterval(te), te = null), re)) {
            var t = re;
            re = null, t();
          }
        }

        function se (e) {
          throw Module.onAbort && Module.onAbort(e), g(e += ""), P = !0, 1, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e);
        }

        Module.preloadedImages = {}, Module.preloadedAudios = {}, Module.preloadedWasm = {};
        var _e, ae, ie, ue = "data:application/octet-stream;base64,";

        function le (e) {
          return e.startsWith(ue);
        }

        function de (e) {
          return e.startsWith("file://");
        }

        function ce (e) {
          try {
            if (e == _e && v) {
              return new Uint8Array(v);
            }
            if (m) {
              return m(e);
            }
            throw"both async and sync fetching of the wasm failed";
          }
          catch (e) {
            se(e);
          }
        }

        le(_e = "tree-sitter.wasm") || (_e = function(e) {
          return Module.locateFile ? Module.locateFile(e, h) : h + e;
        }(_e));
        var me = {}, fe = {
          get: function(e, t) {
            return me[t] || (me[t] = new WebAssembly.Global({ value: "i32", mutable: !0 })), me[t];
          }
        };

        function pe (e) {
          for (; e.length > 0;) {
            var t = e.shift();
            if ("function" != typeof t) {
              var r = t.func;
              "number" == typeof r ? void 0 === t.arg ? K.get(r)() : K.get(r)(t.arg) : r(void 0 === t.arg ? null : t.arg);
            }
            else {
              t(Module);
            }
          }
        }

        function he (e) {
          var t = 0;

          function r () {
            for (var r = 0, n = 1; ;) {
              var o = e[t++];
              if (r += (127 & o) * n, n *= 128, !(128 & o)) {
                break;
              }
            }
            return r;
          }

          if (e instanceof WebAssembly.Module) {
            var n = WebAssembly.Module.customSections(e, "dylink");
            k(0 != n.length, "need dylink section"), e = new Int8Array(n[0]);
          }
          else {
            k(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0], "need to see wasm magic number"), k(0 === e[8], "need the dylink section to be first"), t = 9, r(), k(6 === e[t]), k(e[++t] === "d".charCodeAt(0)), k(e[++t] === "y".charCodeAt(0)), k(e[++t] === "l".charCodeAt(0)), k(e[++t] === "i".charCodeAt(0)), k(e[++t] === "n".charCodeAt(0)), k(e[++t] === "k".charCodeAt(0)), t++;
          }
          var o = {};
          o.memorySize = r(), o.memoryAlign = r(), o.tableSize = r(), o.tableAlign = r();
          var s = r();
          o.neededDynlibs = [];
          for (var _ = 0; _ < s; ++_) {
            var a = r(), i = e.subarray(t, t + a);
            t += a;
            var u = $(i, 0);
            o.neededDynlibs.push(u);
          }
          return o;
        }

        var ge = 0;

        function we () {
          return A || ge > 0;
        }

        function Me (e) {
          return 0 == e.indexOf("dynCall_") || ["stackAlloc", "stackSave", "stackRestore"].includes(e) ? e : "_" + e;
        }

        function ye (e, t) {
          for (var r in e) if (e.hasOwnProperty(r)) {
            De.hasOwnProperty(r) || (De[r] = e[r]);
            var n = Me(r);
            Module.hasOwnProperty(n) || (Module[n] = e[r]);
          }
        }

        var be = { nextHandle: 1, loadedLibs: {}, loadedLibNames: {} };

        function ve (e, t, r) {
          return e.includes("j") ? function(e, t, r) {
            var n = Module["dynCall_" + e];
            return r && r.length ? n.apply(null, [t].concat(r)) : n.call(null, t);
          }(e, t, r) : K.get(t).apply(null, r);
        }

        var Ee = 5251072;

        function Se (e) {
          return ["__cpp_exception", "__wasm_apply_data_relocs", "__dso_handle", "__set_stack_limits"].includes(e);
        }

        function Ie (e, t) {
          var r = {};
          for (var n in e) {
            var o = e[n];
            "object" == typeof o && (o = o.value), "number" == typeof o && (o += t), r[n] = o;
          }
          return function(e) {
            for (var t in e) if (!Se(t)) {
              var r = !1, n = e[t];
              t.startsWith("orig$") && (t = t.split("$")[1], r = !0), me[t] || (me[t] = new WebAssembly.Global({
                value: "i32",
                mutable: !0
              })), (r || 0 == me[t].value) && ("function" == typeof n ? me[t].value = b(n) : "number" == typeof n ? me[t].value = n : g("unhandled export type for `" + t + "`: " + typeof n));
            }
          }(r), r;
        }

        function Ae (e, t) {
          var r, n;
          return t && (r = De["orig$" + e]), r || (r = De[e]), r || (r = Module[Me(e)]), !r && e.startsWith("invoke_") && (n = e.split("_")[1], r = function() {
            var e = He();
            try {
              return ve(n, arguments[0], Array.prototype.slice.call(arguments, 1));
            }
            catch (t) {
              if (Ge(e), t !== t + 0 && "longjmp" !== t) {
                throw t;
              }
              Ke(1, 0);
            }
          }), r;
        }

        function xe (e, t) {
          var r = he(e);

          function n () {
            var n = Math.pow(2, r.memoryAlign);
            n = Math.max(n, w);
            var o, s, _, a = (o = function(e) {
              if (Y) {
                return ze(e);
              }
              var t = Ee, r = t + e + 15 & -16;
              return Ee = r, me.__heap_base.value = r, t;
            }(r.memorySize + n), (s = n) || (s = w), Math.ceil(o / s) * s), i = K.length;
            K.grow(r.tableSize);
            for (var u = a; u < a + r.memorySize; u++) q[u] = 0;
            for (u = i; u < i + r.tableSize; u++) K.set(u, null);
            var l = new Proxy({}, {
              get: function(e, t) {
                switch (t) {
                  case"__memory_base":
                    return a;
                  case"__table_base":
                    return i;
                }
                if (t in De) {
                  return De[t];
                }
                var r;
                t in e || (e[t] = function() {
                  return r || (r = function(e) {
                    var t = Ae(e, !1);
                    return t || (t = _[e]), t;
                  }(t)), r.apply(null, arguments);
                });
                return e[t];
              }
            }), d = { "GOT.mem": new Proxy({}, fe), "GOT.func": new Proxy({}, fe), env: l, wasi_snapshot_preview1: l };

            function c (e) {
              for (var n = 0; n < r.tableSize; n++) {
                var o = K.get(i + n);
                o && M.set(o, i + n);
              }
              _ = Ie(e.exports, a), t.allowUndefined || Pe();
              var s = _.__wasm_call_ctors;
              return s || (s = _.__post_instantiate), s && (Y ? s() : X.push(s)), _;
            }

            if (t.loadAsync) {
              if (e instanceof WebAssembly.Module) {
                var m = new WebAssembly.Instance(e, d);
                return Promise.resolve(c(m));
              }
              return WebAssembly.instantiate(e, d).then(function(e) {
                return c(e.instance);
              });
            }
            var f = e instanceof WebAssembly.Module ? e : new WebAssembly.Module(e);
            return c(m = new WebAssembly.Instance(f, d));
          }

          return t.loadAsync ? r.neededDynlibs.reduce(function(e, r) {
            return e.then(function() {
              return Ne(r, t);
            });
          }, Promise.resolve()).then(function() {
            return n();
          }) : (r.neededDynlibs.forEach(function(e) {
            Ne(e, t);
          }), n());
        }

        function Ne (e, t) {
          "__main__" != e || be.loadedLibNames[e] || (be.loadedLibs[-1] = {
            refcount: 1 / 0,
            name: "__main__",
            module: Module.asm,
            global: !0
          }, be.loadedLibNames.__main__ = -1), t = t || { global: !0, nodelete: !0 };
          var r, n = be.loadedLibNames[e];
          if (n) {
            return r = be.loadedLibs[n], t.global && !r.global && (r.global = !0, "loading" !== r.module && ye(r.module)), t.nodelete && r.refcount !== 1 / 0 && (r.refcount = 1 / 0), r.refcount++, t.loadAsync ? Promise.resolve(n) : n;
          }

          function o (e) {
            if (t.fs) {
              var r = t.fs.readFile(e, { encoding: "binary" });
              return r instanceof Uint8Array || (r = new Uint8Array(r)), t.loadAsync ? Promise.resolve(r) : r;
            }
            return t.loadAsync ? (n = e, fetch(n, { credentials: "same-origin" }).then(function(e) {
              if (!e.ok) {
                throw"failed to load binary file at '" + n + "'";
              }
              return e.arrayBuffer();
            }).then(function(e) {
              return new Uint8Array(e);
            })) : m(e);
            var n;
          }

          function s () {
            if (void 0 !== Module.preloadedWasm && void 0 !== Module.preloadedWasm[e]) {
              var r = Module.preloadedWasm[e];
              return t.loadAsync ? Promise.resolve(r) : r;
            }
            return t.loadAsync ? o(e).then(function(e) {
              return xe(e, t);
            }) : xe(o(e), t);
          }

          function _ (e) {
            r.global && ye(e), r.module = e;
          }

          return n = be.nextHandle++, r = {
            refcount: t.nodelete ? 1 / 0 : 1,
            name: e,
            module: "loading",
            global: t.global
          }, be.loadedLibNames[e] = n, be.loadedLibs[n] = r, t.loadAsync ? s().then(function(e) {
            return _(e), n;
          }) : (_(s()), n);
        }

        function Pe () {
          for (var e in me) if (0 == me[e].value) {
            var t = Ae(e, !0);
            "function" == typeof t ? me[e].value = b(t, t.sig) : "number" == typeof t ? me[e].value = t : k(!1, "bad export type for `" + e + "`: " + typeof t);
          }
        }

        Module.___heap_base = Ee;
        var ke, Fe = new WebAssembly.Global({ value: "i32", mutable: !0 }, 5251072);

        function Ce () {
          se();
        }

        Module._abort = Ce, Ce.sig = "v", ke = o ? function() {
          var e = process.hrtime();
          return 1e3 * e[0] + e[1] / 1e6;
        } : "undefined" != typeof dateNow ? dateNow : function() {
          return performance.now();
        };
        var qe = !0;

        function Te (e, t) {
          var r, n;
          if (0 === e) {
            r = Date.now();
          }
          else {
            if (1 !== e && 4 !== e || !qe) {
              return n = 28, W[Ue() >> 2] = n, -1;
            }
            r = ke();
          }
          return W[t >> 2] = r / 1e3 | 0, W[t + 4 >> 2] = r % 1e3 * 1e3 * 1e3 | 0, 0;
        }

        function Re (e) {
          try {
            return I.grow(e - C.byteLength + 65535 >>> 16), G(I.buffer), 1;
          }
          catch (e) {
          }
        }

        function We (e) {
          Je(e);
        }

        Te.sig = "iii", We.sig = "vi";
        var Le = {
          mappings: {}, DEFAULT_POLLMASK: 5, umask: 511, calculateAt: function(e, t, r) {
            if ("/" === t[0]) {
              return t;
            }
            var n;
            if (-100 === e) {
              n = FS.cwd();
            }
            else {
              var o = FS.getStream(e);
              if (!o) {
                throw new FS.ErrnoError(8);
              }
              n = o.path;
            }
            if (0 == t.length) {
              if (!r) {
                throw new FS.ErrnoError(44);
              }
              return n;
            }
            return PATH.join2(n, t);
          }, doStat: function(e, t, r) {
            try {
              var n = e(t);
            }
            catch (e) {
              if (e && e.node && PATH.normalize(t) !== PATH.normalize(FS.getPath(e.node))) {
                return -54;
              }
              throw e;
            }
            return W[r >> 2] = n.dev, W[r + 4 >> 2] = 0, W[r + 8 >> 2] = n.ino, W[r + 12 >> 2] = n.mode, W[r + 16 >> 2] = n.nlink, W[r + 20 >> 2] = n.uid, W[r + 24 >> 2] = n.gid, W[r + 28 >> 2] = n.rdev, W[r + 32 >> 2] = 0, ie = [n.size >>> 0, (ae = n.size, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[r + 40 >> 2] = ie[0], W[r + 44 >> 2] = ie[1], W[r + 48 >> 2] = 4096, W[r + 52 >> 2] = n.blocks, W[r + 56 >> 2] = n.atime.getTime() / 1e3 | 0, W[r + 60 >> 2] = 0, W[r + 64 >> 2] = n.mtime.getTime() / 1e3 | 0, W[r + 68 >> 2] = 0, W[r + 72 >> 2] = n.ctime.getTime() / 1e3 | 0, W[r + 76 >> 2] = 0, ie = [n.ino >>> 0, (ae = n.ino, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[r + 80 >> 2] = ie[0], W[r + 84 >> 2] = ie[1], 0;
          }, doMsync: function(e, t, r, n, o) {
            var s = T.slice(e, e + r);
            FS.msync(t, s, o, r, n);
          }, doMkdir: function(e, t) {
            return "/" === (e = PATH.normalize(e))[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, t, 0), 0;
          }, doMknod: function(e, t, r) {
            switch (61440 & t) {
              case 32768:
              case 8192:
              case 24576:
              case 4096:
              case 49152:
                break;
              default:
                return -28;
            }
            return FS.mknod(e, t, r), 0;
          }, doReadlink: function(e, t, r) {
            if (r <= 0) {
              return -28;
            }
            var n = FS.readlink(e), o = Math.min(r, U(n)), s = q[t + o];
            return z(n, t, r + 1), q[t + o] = s, o;
          }, doAccess: function(e, t) {
            if (-8 & t) {
              return -28;
            }
            var r;
            if (!(r = FS.lookupPath(e, { follow: !0 }).node)) {
              return -44;
            }
            var n = "";
            return 4 & t && (n += "r"), 2 & t && (n += "w"), 1 & t && (n += "x"), n && FS.nodePermissions(r, n) ? -2 : 0;
          }, doDup: function(e, t, r) {
            var n = FS.getStream(r);
            return n && FS.close(n), FS.open(e, t, 0, r, r).fd;
          }, doReadv: function(e, t, r, n) {
            for (var o = 0, s = 0; s < r; s++) {
              var _ = W[t + 8 * s >> 2], a = W[t + (8 * s + 4) >> 2], i = FS.read(e, q, _, a, n);
              if (i < 0) {
                return -1;
              }
              if (o += i, i < a) {
                break;
              }
            }
            return o;
          }, doWritev: function(e, t, r, n) {
            for (var o = 0, s = 0; s < r; s++) {
              var _ = W[t + 8 * s >> 2], a = W[t + (8 * s + 4) >> 2], i = FS.write(e, q, _, a, n);
              if (i < 0) {
                return -1;
              }
              o += i;
            }
            return o;
          }, varargs: void 0, get: function() {
            return Le.varargs += 4, W[Le.varargs - 4 >> 2];
          }, getStr: function(e) {
            return Z(e);
          }, getStreamFromFD: function(e) {
            var t = FS.getStream(e);
            if (!t) {
              throw new FS.ErrnoError(8);
            }
            return t;
          }, get64: function(e, t) {
            return e;
          }
        };

        function Oe (e) {
          try {
            var t = Le.getStreamFromFD(e);
            return FS.close(t), 0;
          }
          catch (e) {
            return "undefined" != typeof FS && e instanceof FS.ErrnoError || se(e), e.errno;
          }
        }

        function je (e, t, r, n) {
          try {
            var o = Le.getStreamFromFD(e), s = Le.doWritev(o, t, r);
            return W[n >> 2] = s, 0;
          }
          catch (e) {
            return "undefined" != typeof FS && e instanceof FS.ErrnoError || se(e), e.errno;
          }
        }

        function $e (e) {
          E(e);
        }

        Oe.sig = "ii", je.sig = "iiiii", $e.sig = "vi";
        var Ze, De = {
          __heap_base: Ee,
          __indirect_function_table: K,
          __memory_base: 1024,
          __stack_pointer: Fe,
          __table_base: 1,
          abort: Ce,
          clock_gettime: Te,
          emscripten_memcpy_big: function(e, t, r) {
            T.copyWithin(e, t, t + r);
          },
          emscripten_resize_heap: function(e) {
            var t, r, n = T.length;
            if ((e >>>= 0) > 2147483648) {
              return !1;
            }
            for (var o = 1; o <= 4; o *= 2) {
              var s = n * (1 + .2 / o);
              if (s = Math.min(s, e + 100663296), Re(Math.min(2147483648, ((t = Math.max(e, s)) % (r = 65536) > 0 && (t += r - t % r), t)))) {
                return !0;
              }
            }
            return !1;
          },
          exit: We,
          fd_close: Oe,
          fd_seek: function(e, t, r, n, o) {
            try {
              var s = Le.getStreamFromFD(e), _ = 4294967296 * r + (t >>> 0);
              return _ <= -9007199254740992 || _ >= 9007199254740992 ? -61 : (FS.llseek(s, _, n), ie = [s.position >>> 0, (ae = s.position, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[o >> 2] = ie[0], W[o + 4 >> 2] = ie[1], s.getdents && 0 === _ && 0 === n && (s.getdents = null), 0);
            }
            catch (e) {
              return "undefined" != typeof FS && e instanceof FS.ErrnoError || se(e), e.errno;
            }
          },
          fd_write: je,
          memory: I,
          setTempRet0: $e,
          tree_sitter_log_callback: function(e, t) {
            if (pt) {
              const r = Z(t);
              pt(r, 0 !== e);
            }
          },
          tree_sitter_parse_callback: function(e, t, r, n, o) {
            var s = ft(t, { row: r, column: n });
            "string" == typeof s ? (x(o, s.length, "i32"), function(e, t, r) {
              if (void 0 === r && (r = 2147483647), r < 2) {
                return 0;
              }
              for (var n = (r -= 2) < 2 * e.length ? r / 2 : e.length, o = 0; o < n; ++o) {
                var s = e.charCodeAt(o);
                R[t >> 1] = s, t += 2;
              }
              R[t >> 1] = 0;
            }(s, e, 10240)) : x(o, 0, "i32");
          }
        }, ze = (function() {
          var e = { env: De, wasi_snapshot_preview1: De, "GOT.mem": new Proxy(De, fe), "GOT.func": new Proxy(De, fe) };

          function t (e, t) {
            var r = e.exports;
            r = Ie(r, 1024), Module.asm = r;
            var n, o = he(t);
            o.neededDynlibs && (S = o.neededDynlibs.concat(S)), ye(r), n = Module.asm.__wasm_call_ctors, X.unshift(n), oe();
          }

          function r (e) {
            t(e.instance, e.module);
          }

          function n (t) {
            return function() {
              if (!v && (u || l)) {
                if ("function" == typeof fetch && !de(_e)) {
                  return fetch(_e, { credentials: "same-origin" }).then(function(e) {
                    if (!e.ok) {
                      throw"failed to load wasm binary file at '" + _e + "'";
                    }
                    return e.arrayBuffer();
                  }).catch(function() {
                    return ce(_e);
                  });
                }
                if (c) {
                  return new Promise(function(e, t) {
                    c(_e, function(t) {
                      e(new Uint8Array(t));
                    }, t);
                  });
                }
              }
              return Promise.resolve().then(function() {
                return ce(_e);
              });
            }().then(function(t) {
              return WebAssembly.instantiate(t, e);
            }).then(t, function(e) {
              g("failed to asynchronously prepare wasm: " + e), se(e);
            });
          }

          if (ne(), Module.instantiateWasm) {
            try {
              return Module.instantiateWasm(e, t);
            }
            catch (e) {
              return g("Module.instantiateWasm callback failed with error: " + e), !1;
            }
          }
          v || "function" != typeof WebAssembly.instantiateStreaming || le(_e) || de(_e) || "function" != typeof fetch ? n(r) : fetch(_e, { credentials: "same-origin" }).then(function(t) {
            return WebAssembly.instantiateStreaming(t, e).then(r, function(e) {
              return g("wasm streaming compile failed: " + e), g("falling back to ArrayBuffer instantiation"), n(r);
            });
          });
        }(), Module.___wasm_call_ctors = function() {
          return (Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments);
        }, Module._malloc = function() {
          return (ze = Module._malloc = Module.asm.malloc).apply(null, arguments);
        }), Ue = (Module._calloc = function() {
          return (Module._calloc = Module.asm.calloc).apply(null, arguments);
        }, Module._realloc = function() {
          return (Module._realloc = Module.asm.realloc).apply(null, arguments);
        }, Module._free = function() {
          return (Module._free = Module.asm.free).apply(null, arguments);
        }, Module._ts_language_symbol_count = function() {
          return (Module._ts_language_symbol_count = Module.asm.ts_language_symbol_count).apply(null, arguments);
        }, Module._ts_language_version = function() {
          return (Module._ts_language_version = Module.asm.ts_language_version).apply(null, arguments);
        }, Module._ts_language_field_count = function() {
          return (Module._ts_language_field_count = Module.asm.ts_language_field_count).apply(null, arguments);
        }, Module._ts_language_symbol_name = function() {
          return (Module._ts_language_symbol_name = Module.asm.ts_language_symbol_name).apply(null, arguments);
        }, Module._ts_language_symbol_for_name = function() {
          return (Module._ts_language_symbol_for_name = Module.asm.ts_language_symbol_for_name).apply(null, arguments);
        }, Module._ts_language_symbol_type = function() {
          return (Module._ts_language_symbol_type = Module.asm.ts_language_symbol_type).apply(null, arguments);
        }, Module._ts_language_field_name_for_id = function() {
          return (Module._ts_language_field_name_for_id = Module.asm.ts_language_field_name_for_id).apply(null, arguments);
        }, Module._memcpy = function() {
          return (Module._memcpy = Module.asm.memcpy).apply(null, arguments);
        }, Module._ts_parser_delete = function() {
          return (Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(null, arguments);
        }, Module._ts_parser_reset = function() {
          return (Module._ts_parser_reset = Module.asm.ts_parser_reset).apply(null, arguments);
        }, Module._ts_parser_set_language = function() {
          return (Module._ts_parser_set_language = Module.asm.ts_parser_set_language).apply(null, arguments);
        }, Module._ts_parser_timeout_micros = function() {
          return (Module._ts_parser_timeout_micros = Module.asm.ts_parser_timeout_micros).apply(null, arguments);
        }, Module._ts_parser_set_timeout_micros = function() {
          return (Module._ts_parser_set_timeout_micros = Module.asm.ts_parser_set_timeout_micros).apply(null, arguments);
        }, Module._memmove = function() {
          return (Module._memmove = Module.asm.memmove).apply(null, arguments);
        }, Module._memcmp = function() {
          return (Module._memcmp = Module.asm.memcmp).apply(null, arguments);
        }, Module._ts_query_new = function() {
          return (Module._ts_query_new = Module.asm.ts_query_new).apply(null, arguments);
        }, Module._ts_query_delete = function() {
          return (Module._ts_query_delete = Module.asm.ts_query_delete).apply(null, arguments);
        }, Module._iswspace = function() {
          return (Module._iswspace = Module.asm.iswspace).apply(null, arguments);
        }, Module._iswalnum = function() {
          return (Module._iswalnum = Module.asm.iswalnum).apply(null, arguments);
        }, Module._ts_query_pattern_count = function() {
          return (Module._ts_query_pattern_count = Module.asm.ts_query_pattern_count).apply(null, arguments);
        }, Module._ts_query_capture_count = function() {
          return (Module._ts_query_capture_count = Module.asm.ts_query_capture_count).apply(null, arguments);
        }, Module._ts_query_string_count = function() {
          return (Module._ts_query_string_count = Module.asm.ts_query_string_count).apply(null, arguments);
        }, Module._ts_query_capture_name_for_id = function() {
          return (Module._ts_query_capture_name_for_id = Module.asm.ts_query_capture_name_for_id).apply(null, arguments);
        }, Module._ts_query_string_value_for_id = function() {
          return (Module._ts_query_string_value_for_id = Module.asm.ts_query_string_value_for_id).apply(null, arguments);
        }, Module._ts_query_predicates_for_pattern = function() {
          return (Module._ts_query_predicates_for_pattern = Module.asm.ts_query_predicates_for_pattern).apply(null, arguments);
        }, Module._ts_tree_copy = function() {
          return (Module._ts_tree_copy = Module.asm.ts_tree_copy).apply(null, arguments);
        }, Module._ts_tree_delete = function() {
          return (Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(null, arguments);
        }, Module._ts_init = function() {
          return (Module._ts_init = Module.asm.ts_init).apply(null, arguments);
        }, Module._ts_parser_new_wasm = function() {
          return (Module._ts_parser_new_wasm = Module.asm.ts_parser_new_wasm).apply(null, arguments);
        }, Module._ts_parser_enable_logger_wasm = function() {
          return (Module._ts_parser_enable_logger_wasm = Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
        }, Module._ts_parser_parse_wasm = function() {
          return (Module._ts_parser_parse_wasm = Module.asm.ts_parser_parse_wasm).apply(null, arguments);
        }, Module._ts_language_type_is_named_wasm = function() {
          return (Module._ts_language_type_is_named_wasm = Module.asm.ts_language_type_is_named_wasm).apply(null, arguments);
        }, Module._ts_language_type_is_visible_wasm = function() {
          return (Module._ts_language_type_is_visible_wasm = Module.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
        }, Module._ts_tree_root_node_wasm = function() {
          return (Module._ts_tree_root_node_wasm = Module.asm.ts_tree_root_node_wasm).apply(null, arguments);
        }, Module._ts_tree_edit_wasm = function() {
          return (Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(null, arguments);
        }, Module._ts_tree_get_changed_ranges_wasm = function() {
          return (Module._ts_tree_get_changed_ranges_wasm = Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_new_wasm = function() {
          return (Module._ts_tree_cursor_new_wasm = Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_delete_wasm = function() {
          return (Module._ts_tree_cursor_delete_wasm = Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_reset_wasm = function() {
          return (Module._ts_tree_cursor_reset_wasm = Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_goto_first_child_wasm = function() {
          return (Module._ts_tree_cursor_goto_first_child_wasm = Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_goto_next_sibling_wasm = function() {
          return (Module._ts_tree_cursor_goto_next_sibling_wasm = Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_goto_parent_wasm = function() {
          return (Module._ts_tree_cursor_goto_parent_wasm = Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_node_type_id_wasm = function() {
          return (Module._ts_tree_cursor_current_node_type_id_wasm = Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_node_is_named_wasm = function() {
          return (Module._ts_tree_cursor_current_node_is_named_wasm = Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_node_is_missing_wasm = function() {
          return (Module._ts_tree_cursor_current_node_is_missing_wasm = Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_node_id_wasm = function() {
          return (Module._ts_tree_cursor_current_node_id_wasm = Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_start_position_wasm = function() {
          return (Module._ts_tree_cursor_start_position_wasm = Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_end_position_wasm = function() {
          return (Module._ts_tree_cursor_end_position_wasm = Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_start_index_wasm = function() {
          return (Module._ts_tree_cursor_start_index_wasm = Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_end_index_wasm = function() {
          return (Module._ts_tree_cursor_end_index_wasm = Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_field_id_wasm = function() {
          return (Module._ts_tree_cursor_current_field_id_wasm = Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments);
        }, Module._ts_tree_cursor_current_node_wasm = function() {
          return (Module._ts_tree_cursor_current_node_wasm = Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
        }, Module._ts_node_symbol_wasm = function() {
          return (Module._ts_node_symbol_wasm = Module.asm.ts_node_symbol_wasm).apply(null, arguments);
        }, Module._ts_node_child_count_wasm = function() {
          return (Module._ts_node_child_count_wasm = Module.asm.ts_node_child_count_wasm).apply(null, arguments);
        }, Module._ts_node_named_child_count_wasm = function() {
          return (Module._ts_node_named_child_count_wasm = Module.asm.ts_node_named_child_count_wasm).apply(null, arguments);
        }, Module._ts_node_child_wasm = function() {
          return (Module._ts_node_child_wasm = Module.asm.ts_node_child_wasm).apply(null, arguments);
        }, Module._ts_node_named_child_wasm = function() {
          return (Module._ts_node_named_child_wasm = Module.asm.ts_node_named_child_wasm).apply(null, arguments);
        }, Module._ts_node_child_by_field_id_wasm = function() {
          return (Module._ts_node_child_by_field_id_wasm = Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
        }, Module._ts_node_next_sibling_wasm = function() {
          return (Module._ts_node_next_sibling_wasm = Module.asm.ts_node_next_sibling_wasm).apply(null, arguments);
        }, Module._ts_node_prev_sibling_wasm = function() {
          return (Module._ts_node_prev_sibling_wasm = Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
        }, Module._ts_node_next_named_sibling_wasm = function() {
          return (Module._ts_node_next_named_sibling_wasm = Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
        }, Module._ts_node_prev_named_sibling_wasm = function() {
          return (Module._ts_node_prev_named_sibling_wasm = Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
        }, Module._ts_node_parent_wasm = function() {
          return (Module._ts_node_parent_wasm = Module.asm.ts_node_parent_wasm).apply(null, arguments);
        }, Module._ts_node_descendant_for_index_wasm = function() {
          return (Module._ts_node_descendant_for_index_wasm = Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
        }, Module._ts_node_named_descendant_for_index_wasm = function() {
          return (Module._ts_node_named_descendant_for_index_wasm = Module.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments);
        }, Module._ts_node_descendant_for_position_wasm = function() {
          return (Module._ts_node_descendant_for_position_wasm = Module.asm.ts_node_descendant_for_position_wasm).apply(null, arguments);
        }, Module._ts_node_named_descendant_for_position_wasm = function() {
          return (Module._ts_node_named_descendant_for_position_wasm = Module.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments);
        }, Module._ts_node_start_point_wasm = function() {
          return (Module._ts_node_start_point_wasm = Module.asm.ts_node_start_point_wasm).apply(null, arguments);
        }, Module._ts_node_end_point_wasm = function() {
          return (Module._ts_node_end_point_wasm = Module.asm.ts_node_end_point_wasm).apply(null, arguments);
        }, Module._ts_node_start_index_wasm = function() {
          return (Module._ts_node_start_index_wasm = Module.asm.ts_node_start_index_wasm).apply(null, arguments);
        }, Module._ts_node_end_index_wasm = function() {
          return (Module._ts_node_end_index_wasm = Module.asm.ts_node_end_index_wasm).apply(null, arguments);
        }, Module._ts_node_to_string_wasm = function() {
          return (Module._ts_node_to_string_wasm = Module.asm.ts_node_to_string_wasm).apply(null, arguments);
        }, Module._ts_node_children_wasm = function() {
          return (Module._ts_node_children_wasm = Module.asm.ts_node_children_wasm).apply(null, arguments);
        }, Module._ts_node_named_children_wasm = function() {
          return (Module._ts_node_named_children_wasm = Module.asm.ts_node_named_children_wasm).apply(null, arguments);
        }, Module._ts_node_descendants_of_type_wasm = function() {
          return (Module._ts_node_descendants_of_type_wasm = Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
        }, Module._ts_node_is_named_wasm = function() {
          return (Module._ts_node_is_named_wasm = Module.asm.ts_node_is_named_wasm).apply(null, arguments);
        }, Module._ts_node_has_changes_wasm = function() {
          return (Module._ts_node_has_changes_wasm = Module.asm.ts_node_has_changes_wasm).apply(null, arguments);
        }, Module._ts_node_has_error_wasm = function() {
          return (Module._ts_node_has_error_wasm = Module.asm.ts_node_has_error_wasm).apply(null, arguments);
        }, Module._ts_node_is_missing_wasm = function() {
          return (Module._ts_node_is_missing_wasm = Module.asm.ts_node_is_missing_wasm).apply(null, arguments);
        }, Module._ts_query_matches_wasm = function() {
          return (Module._ts_query_matches_wasm = Module.asm.ts_query_matches_wasm).apply(null, arguments);
        }, Module._ts_query_captures_wasm = function() {
          return (Module._ts_query_captures_wasm = Module.asm.ts_query_captures_wasm).apply(null, arguments);
        }, Module._iswdigit = function() {
          return (Module._iswdigit = Module.asm.iswdigit).apply(null, arguments);
        }, Module._iswalpha = function() {
          return (Module._iswalpha = Module.asm.iswalpha).apply(null, arguments);
        }, Module._iswlower = function() {
          return (Module._iswlower = Module.asm.iswlower).apply(null, arguments);
        }, Module._towupper = function() {
          return (Module._towupper = Module.asm.towupper).apply(null, arguments);
        }, Module.___errno_location = function() {
          return (Ue = Module.___errno_location = Module.asm.__errno_location).apply(null, arguments);
        }), He = (Module._memchr = function() {
          return (Module._memchr = Module.asm.memchr).apply(null, arguments);
        }, Module._strlen = function() {
          return (Module._strlen = Module.asm.strlen).apply(null, arguments);
        }, Module.stackSave = function() {
          return (He = Module.stackSave = Module.asm.stackSave).apply(null, arguments);
        }), Ge = Module.stackRestore = function() {
          return (Ge = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments);
        }, Be = Module.stackAlloc = function() {
          return (Be = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments);
        }, Ke = Module._setThrew = function() {
          return (Ke = Module._setThrew = Module.asm.setThrew).apply(null, arguments);
        };
        Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
          return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
          return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
          return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
          return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments);
        }, Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
          return (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
          return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
          return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments);
        }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
          return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments);
        }, Module.__Znwm = function() {
          return (Module.__Znwm = Module.asm._Znwm).apply(null, arguments);
        }, Module.__ZdlPv = function() {
          return (Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments);
        }, Module.dynCall_jiji = function() {
          return (Module.dynCall_jiji = Module.asm.dynCall_jiji).apply(null, arguments);
        }, Module._orig$ts_parser_timeout_micros = function() {
          return (Module._orig$ts_parser_timeout_micros = Module.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
        }, Module._orig$ts_parser_set_timeout_micros = function() {
          return (Module._orig$ts_parser_set_timeout_micros = Module.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
        };

        function Ve (e) {
          this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e;
        }

        Module.allocate = function(e, t) {
          var r;
          return r = t == F ? Be(e.length) : ze(e.length), e.subarray || e.slice ? T.set(e, r) : T.set(new Uint8Array(e), r), r;
        };
        re = function e () {
          Ze || Qe(), Ze || (re = e);
        };
        var Xe = !1;

        function Qe (e) {
          function t () {
            Ze || (Ze = !0, Module.calledRun = !0, P || (Y = !0, pe(X), pe(Q), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Ye && function(e) {
              var t = Module._main;
              if (t) {
                var r = (e = e || []).length + 1, n = Be(4 * (r + 1));
                W[n >> 2] = H(a);
                for (var o = 1; o < r; o++) W[(n >> 2) + o] = H(e[o - 1]);
                W[(n >> 2) + r] = 0;
                try {
                  Je(t(r, n), !0);
                }
                catch (e) {
                  if (e instanceof Ve) {
                    return;
                  }
                  if ("unwind" == e) {
                    return;
                  }
                  var s = e;
                  e && "object" == typeof e && e.stack && (s = [e, e.stack]), g("exception thrown: " + s), i(1, e);
                } finally {
                  !0;
                }
              }
            }(e), function() {
              if (Module.postRun) {
                for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) e = Module.postRun.shift(), J.unshift(e);
              }
              var e;
              pe(J);
            }()));
          }

          e = e || _, ee > 0 || !Xe && (function() {
            if (S.length) {
              if (!m) {
                return ne(), void S.reduce(function(e, t) {
                  return e.then(function() {
                    return Ne(t, { loadAsync: !0, global: !0, nodelete: !0, allowUndefined: !0 });
                  });
                }, Promise.resolve()).then(function() {
                  oe(), Pe();
                });
              }
              S.forEach(function(e) {
                Ne(e, { global: !0, nodelete: !0, allowUndefined: !0 });
              }), Pe();
            }
            else {
              Pe();
            }
          }(), Xe = !0, ee > 0) || (!function() {
            if (Module.preRun) {
              for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) e = Module.preRun.shift(), V.unshift(e);
            }
            var e;
            pe(V);
          }(), ee > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
            setTimeout(function() {
              Module.setStatus("");
            }, 1), t();
          }, 1)) : t()));
        }

        function Je (e, t) {
          e, t && we() && 0 === e || (we() || (!0, Module.onExit && Module.onExit(e), P = !0), i(e, new Ve(e)));
        }

        if (Module.run = Qe, Module.preInit) {
          for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
        }
        var Ye = !0;
        Module.noInitialRun && (Ye = !1), Qe();
        const et = Module, tt = {}, rt = 4, nt = 5 * rt, ot = 2 * rt, st = 2 * rt + 2 * ot, _t = { row: 0, column: 0 },
          at = /[\w-.]*/g, it = 1, ut = 2, lt = /^_?tree_sitter_\w+/;
        var dt, ct, mt, ft, pt;

        class ParserImpl {
          static init () {
            mt = et._ts_init(), dt = N(mt, "i32"), ct = N(mt + rt, "i32");
          }

          initialize () {
            et._ts_parser_new_wasm(), this[0] = N(mt, "i32"), this[1] = N(mt + rt, "i32");
          }

          delete () {
            et._ts_parser_delete(this[0]), et._free(this[1]), this[0] = 0, this[1] = 0;
          }

          setLanguage (e) {
            let t;
            if (e) {
              if (e.constructor !== Language) {
                throw new Error("Argument must be a Language");
              }
              {
                t = e[0];
                const r = et._ts_language_version(t);
                if (r < ct || dt < r) {
                  throw new Error(`Incompatible language version ${r}. ` + `Compatibility range ${ct} through ${dt}.`);
                }
              }
            }
            else {
              t = 0, e = null;
            }
            return this.language = e, et._ts_parser_set_language(this[0], t), this;
          }

          getLanguage () {
            return this.language;
          }

          parse (e, t, r) {
            if ("string" == typeof e) {
              ft = ((t, r, n) => e.slice(t, n));
            }
            else {
              if ("function" != typeof e) {
                throw new Error("Argument must be a string or a function");
              }
              ft = e;
            }
            this.logCallback ? (pt = this.logCallback, et._ts_parser_enable_logger_wasm(this[0], 1)) : (pt = null, et._ts_parser_enable_logger_wasm(this[0], 0));
            let n = 0, o = 0;
            if (r && r.includedRanges) {
              n = r.includedRanges.length;
              let e = o = et._calloc(n, st);
              for (let t = 0; t < n; t++) At(e, r.includedRanges[t]), e += st;
            }
            const s = et._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, o, n);
            if (!s) {
              throw ft = null, pt = null, new Error("Parsing failed");
            }
            const _ = new Tree(tt, s, this.language, ft);
            return ft = null, pt = null, _;
          }

          reset () {
            et._ts_parser_reset(this[0]);
          }

          setTimeoutMicros (e) {
            et._ts_parser_set_timeout_micros(this[0], e);
          }

          getTimeoutMicros () {
            return et._ts_parser_timeout_micros(this[0]);
          }

          setLogger (e) {
            if (e) {
              if ("function" != typeof e) {
                throw new Error("Logger callback must be a function");
              }
            }
            else {
              e = null;
            }
            return this.logCallback = e, this;
          }

          getLogger () {
            return this.logCallback;
          }
        }

        class Tree {
          constructor (e, t, r, n) {
            wt(e), this[0] = t, this.language = r, this.textCallback = n;
          }

          copy () {
            const e = et._ts_tree_copy(this[0]);
            return new Tree(tt, e, this.language, this.textCallback);
          }

          delete () {
            et._ts_tree_delete(this[0]), this[0] = 0;
          }

          edit (e) {
            !function(e) {
              let t = mt;
              St(t, e.startPosition), St(t += ot, e.oldEndPosition), St(t += ot, e.newEndPosition), x(t += ot, e.startIndex, "i32"), x(t += rt, e.oldEndIndex, "i32"), x(t += rt, e.newEndIndex, "i32"), t += rt;
            }(e), et._ts_tree_edit_wasm(this[0]);
          }

          get rootNode () {
            return et._ts_tree_root_node_wasm(this[0]), bt(this);
          }

          getLanguage () {
            return this.language;
          }

          walk () {
            return this.rootNode.walk();
          }

          getChangedRanges (e) {
            if (e.constructor !== Tree) {
              throw new TypeError("Argument must be a Tree");
            }
            et._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
            const t = N(mt, "i32"), r = N(mt + rt, "i32"), n = new Array(t);
            if (t > 0) {
              let e = r;
              for (let r = 0; r < t; r++) n[r] = xt(e), e += st;
              et._free(r);
            }
            return n;
          }
        }

        class Node {
          constructor (e, t) {
            wt(e), this.tree = t;
          }

          get typeId () {
            return yt(this), et._ts_node_symbol_wasm(this.tree[0]);
          }

          get type () {
            return this.tree.language.types[this.typeId] || "ERROR";
          }

          get endPosition () {
            return yt(this), et._ts_node_end_point_wasm(this.tree[0]), It(mt);
          }

          get endIndex () {
            return yt(this), et._ts_node_end_index_wasm(this.tree[0]);
          }

          get text () {
            return ht(this.tree, this.startIndex, this.endIndex);
          }

          isNamed () {
            return yt(this), 1 === et._ts_node_is_named_wasm(this.tree[0]);
          }

          hasError () {
            return yt(this), 1 === et._ts_node_has_error_wasm(this.tree[0]);
          }

          hasChanges () {
            return yt(this), 1 === et._ts_node_has_changes_wasm(this.tree[0]);
          }

          isMissing () {
            return yt(this), 1 === et._ts_node_is_missing_wasm(this.tree[0]);
          }

          equals (e) {
            return this.id === e.id;
          }

          child (e) {
            return yt(this), et._ts_node_child_wasm(this.tree[0], e), bt(this.tree);
          }

          namedChild (e) {
            return yt(this), et._ts_node_named_child_wasm(this.tree[0], e), bt(this.tree);
          }

          childForFieldId (e) {
            return yt(this), et._ts_node_child_by_field_id_wasm(this.tree[0], e), bt(this.tree);
          }

          childForFieldName (e) {
            const t = this.tree.language.fields.indexOf(e);
            if (-1 !== t) {
              return this.childForFieldId(t);
            }
          }

          get childCount () {
            return yt(this), et._ts_node_child_count_wasm(this.tree[0]);
          }

          get namedChildCount () {
            return yt(this), et._ts_node_named_child_count_wasm(this.tree[0]);
          }

          get firstChild () {
            return this.child(0);
          }

          get firstNamedChild () {
            return this.namedChild(0);
          }

          get lastChild () {
            return this.child(this.childCount - 1);
          }

          get lastNamedChild () {
            return this.namedChild(this.namedChildCount - 1);
          }

          get children () {
            if (!this._children) {
              yt(this), et._ts_node_children_wasm(this.tree[0]);
              const e = N(mt, "i32"), t = N(mt + rt, "i32");
              if (this._children = new Array(e), e > 0) {
                let r = t;
                for (let t = 0; t < e; t++) this._children[t] = bt(this.tree, r), r += nt;
                et._free(t);
              }
            }
            return this._children;
          }

          get namedChildren () {
            if (!this._namedChildren) {
              yt(this), et._ts_node_named_children_wasm(this.tree[0]);
              const e = N(mt, "i32"), t = N(mt + rt, "i32");
              if (this._namedChildren = new Array(e), e > 0) {
                let r = t;
                for (let t = 0; t < e; t++) this._namedChildren[t] = bt(this.tree, r), r += nt;
                et._free(t);
              }
            }
            return this._namedChildren;
          }

          descendantsOfType (e, t, r) {
            Array.isArray(e) || (e = [e]), t || (t = _t), r || (r = _t);
            const n = [], o = this.tree.language.types;
            for (let t = 0, r = o.length; t < r; t++) e.includes(o[t]) && n.push(t);
            const s = et._malloc(rt * n.length);
            for (let e = 0, t = n.length; e < t; e++) x(s + e * rt, n[e], "i32");
            yt(this), et._ts_node_descendants_of_type_wasm(this.tree[0], s, n.length, t.row, t.column, r.row, r.column);
            const _ = N(mt, "i32"), a = N(mt + rt, "i32"), i = new Array(_);
            if (_ > 0) {
              let e = a;
              for (let t = 0; t < _; t++) i[t] = bt(this.tree, e), e += nt;
            }
            return et._free(a), et._free(s), i;
          }

          get nextSibling () {
            return yt(this), et._ts_node_next_sibling_wasm(this.tree[0]), bt(this.tree);
          }

          get previousSibling () {
            return yt(this), et._ts_node_prev_sibling_wasm(this.tree[0]), bt(this.tree);
          }

          get nextNamedSibling () {
            return yt(this), et._ts_node_next_named_sibling_wasm(this.tree[0]), bt(this.tree);
          }

          get previousNamedSibling () {
            return yt(this), et._ts_node_prev_named_sibling_wasm(this.tree[0]), bt(this.tree);
          }

          get parent () {
            return yt(this), et._ts_node_parent_wasm(this.tree[0]), bt(this.tree);
          }

          descendantForIndex (e, t = e) {
            if ("number" != typeof e || "number" != typeof t) {
              throw new Error("Arguments must be numbers");
            }
            yt(this);
            let r = mt + nt;
            return x(r, e, "i32"), x(r + rt, t, "i32"), et._ts_node_descendant_for_index_wasm(this.tree[0]), bt(this.tree);
          }

          namedDescendantForIndex (e, t = e) {
            if ("number" != typeof e || "number" != typeof t) {
              throw new Error("Arguments must be numbers");
            }
            yt(this);
            let r = mt + nt;
            return x(r, e, "i32"), x(r + rt, t, "i32"), et._ts_node_named_descendant_for_index_wasm(this.tree[0]), bt(this.tree);
          }

          descendantForPosition (e, t = e) {
            if (!Mt(e) || !Mt(t)) {
              throw new Error("Arguments must be {row, column} objects");
            }
            yt(this);
            let r = mt + nt;
            return St(r, e), St(r + ot, t), et._ts_node_descendant_for_position_wasm(this.tree[0]), bt(this.tree);
          }

          namedDescendantForPosition (e, t = e) {
            if (!Mt(e) || !Mt(t)) {
              throw new Error("Arguments must be {row, column} objects");
            }
            yt(this);
            let r = mt + nt;
            return St(r, e), St(r + ot, t), et._ts_node_named_descendant_for_position_wasm(this.tree[0]), bt(this.tree);
          }

          walk () {
            return yt(this), et._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(tt, this.tree);
          }

          toString () {
            yt(this);
            const e = et._ts_node_to_string_wasm(this.tree[0]), t = function(e) {
              for (var t = ""; ;) {
                var r = T[e++ >> 0];
                if (!r) {
                  return t;
                }
                t += String.fromCharCode(r);
              }
            }(e);
            return et._free(e), t;
          }
        }

        class TreeCursor {
          constructor (e, t) {
            wt(e), this.tree = t, Et(this);
          }

          delete () {
            vt(this), et._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
          }

          reset (e) {
            yt(e), vt(this, mt + nt), et._ts_tree_cursor_reset_wasm(this.tree[0]), Et(this);
          }

          get nodeType () {
            return this.tree.language.types[this.nodeTypeId] || "ERROR";
          }

          get nodeTypeId () {
            return vt(this), et._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
          }

          get nodeId () {
            return vt(this), et._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
          }

          get nodeIsNamed () {
            return vt(this), 1 === et._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]);
          }

          get nodeIsMissing () {
            return vt(this), 1 === et._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]);
          }

          get nodeText () {
            vt(this);
            const e = et._ts_tree_cursor_start_index_wasm(this.tree[0]),
              t = et._ts_tree_cursor_end_index_wasm(this.tree[0]);
            return ht(this.tree, e, t);
          }

          get startPosition () {
            return vt(this), et._ts_tree_cursor_start_position_wasm(this.tree[0]), It(mt);
          }

          get endPosition () {
            return vt(this), et._ts_tree_cursor_end_position_wasm(this.tree[0]), It(mt);
          }

          get startIndex () {
            return vt(this), et._ts_tree_cursor_start_index_wasm(this.tree[0]);
          }

          get endIndex () {
            return vt(this), et._ts_tree_cursor_end_index_wasm(this.tree[0]);
          }

          currentNode () {
            return vt(this), et._ts_tree_cursor_current_node_wasm(this.tree[0]), bt(this.tree);
          }

          currentFieldId () {
            return vt(this), et._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
          }

          currentFieldName () {
            return this.tree.language.fields[this.currentFieldId()];
          }

          gotoFirstChild () {
            vt(this);
            const e = et._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
            return Et(this), 1 === e;
          }

          gotoNextSibling () {
            vt(this);
            const e = et._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
            return Et(this), 1 === e;
          }

          gotoParent () {
            vt(this);
            const e = et._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
            return Et(this), 1 === e;
          }
        }

        class Language {
          constructor (e, t) {
            wt(e), this[0] = t, this.types = new Array(et._ts_language_symbol_count(this[0]));
            for (let e = 0, t = this.types.length; e < t; e++) et._ts_language_symbol_type(this[0], e) < 2 && (this.types[e] = Z(et._ts_language_symbol_name(this[0], e)));
            this.fields = new Array(et._ts_language_field_count(this[0]) + 1);
            for (let e = 0, t = this.fields.length; e < t; e++) {
              const t = et._ts_language_field_name_for_id(this[0], e);
              this.fields[e] = 0 !== t ? Z(t) : null;
            }
          }

          get version () {
            return et._ts_language_version(this[0]);
          }

          get fieldCount () {
            return this.fields.length - 1;
          }

          fieldIdForName (e) {
            const t = this.fields.indexOf(e);
            return -1 !== t ? t : null;
          }

          fieldNameForId (e) {
            return this.fields[e] || null;
          }

          idForNodeType (e, t) {
            const r = U(e), n = et._malloc(r + 1);
            z(e, n, r + 1);
            const o = et._ts_language_symbol_for_name(this[0], n, r, t);
            return et._free(n), o || null;
          }

          get nodeTypeCount () {
            return et._ts_language_symbol_count(this[0]);
          }

          nodeTypeForId (e) {
            const t = et._ts_language_symbol_name(this[0], e);
            return t ? Z(t) : null;
          }

          nodeTypeIsNamed (e) {
            return !!et._ts_language_type_is_named_wasm(this[0], e);
          }

          nodeTypeIsVisible (e) {
            return !!et._ts_language_type_is_visible_wasm(this[0], e);
          }

          query (e) {
            const t = U(e), r = et._malloc(t + 1);
            z(e, r, t + 1);
            const n = et._ts_query_new(this[0], r, t, mt, mt + rt);
            if (!n) {
              const t = N(mt + rt, "i32"), n = Z(r, N(mt, "i32")).length, o = e.substr(n, 100).split("\n")[0];
              let s, _ = o.match(at)[0];
              switch (t) {
                case 2:
                  s = new RangeError(`Bad node name '${_}'`);
                  break;
                case 3:
                  s = new RangeError(`Bad field name '${_}'`);
                  break;
                case 4:
                  s = new RangeError(`Bad capture name @${_}`);
                  break;
                case 5:
                  s = new TypeError(`Bad pattern structure at offset ${n}: '${o}'...`), _ = "";
                  break;
                default:
                  s = new SyntaxError(`Bad syntax at offset ${n}: '${o}'...`), _ = "";
              }
              throw s.index = n, s.length = _.length, et._free(r), s;
            }
            const o = et._ts_query_string_count(n), s = et._ts_query_capture_count(n),
              _ = et._ts_query_pattern_count(n), a = new Array(s), i = new Array(o);
            for (let e = 0; e < s; e++) {
              const t = et._ts_query_capture_name_for_id(n, e, mt), r = N(mt, "i32");
              a[e] = Z(t, r);
            }
            for (let e = 0; e < o; e++) {
              const t = et._ts_query_string_value_for_id(n, e, mt), r = N(mt, "i32");
              i[e] = Z(t, r);
            }
            const u = new Array(_), l = new Array(_), d = new Array(_), c = new Array(_), m = new Array(_);
            for (let e = 0; e < _; e++) {
              const t = et._ts_query_predicates_for_pattern(n, e, mt), r = N(mt, "i32");
              c[e] = [], m[e] = [];
              const o = [];
              let s = t;
              for (let t = 0; t < r; t++) {
                const t = N(s, "i32"), r = N(s += rt, "i32");
                if (s += rt, t === it) {
                  o.push({
                    type: "capture",
                    name: a[r]
                  });
                }
                else if (t === ut) {
                  o.push({ type: "string", value: i[r] });
                }
                else if (o.length > 0) {
                  if ("string" !== o[0].type) {
                    throw new Error("Predicates must begin with a literal value");
                  }
                  const t = o[0].value;
                  let r = !0;
                  switch (t) {
                    case"not-eq?":
                      r = !1;
                    case"eq?":
                      if (3 !== o.length) {
                        throw new Error(`Wrong number of arguments to \`#eq?\` predicate. Expected 2, got ${o.length - 1}`);
                      }
                      if ("capture" !== o[1].type) {
                        throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${o[1].value}"`);
                      }
                      if ("capture" === o[2].type) {
                        const t = o[1].name, n = o[2].name;
                        m[e].push(function(e) {
                          let o, s;
                          for (const r of e) r.name === t && (o = r.node), r.name === n && (s = r.node);
                          return void 0 === o || void 0 === s || o.text === s.text === r;
                        });
                      }
                      else {
                        const t = o[1].name, n = o[2].value;
                        m[e].push(function(e) {
                          for (const o of e) if (o.name === t) {
                            return o.node.text === n === r;
                          }
                          return !0;
                        });
                      }
                      break;
                    case"not-match?":
                      r = !1;
                    case"match?":
                      if (3 !== o.length) {
                        throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${o.length - 1}.`);
                      }
                      if ("capture" !== o[1].type) {
                        throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${o[1].value}".`);
                      }
                      if ("string" !== o[2].type) {
                        throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${o[2].value}.`);
                      }
                      const n = o[1].name, s = new RegExp(o[2].value);
                      m[e].push(function(e) {
                        for (const t of e) if (t.name === n) {
                          return s.test(t.node.text) === r;
                        }
                        return !0;
                      });
                      break;
                    case"set!":
                      if (o.length < 2 || o.length > 3) {
                        throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                      }
                      if (o.some(e => "string" !== e.type)) {
                        throw new Error("Arguments to `#set!` predicate must be a strings.\".");
                      }
                      u[e] || (u[e] = {}), u[e][o[1].value] = o[2] ? o[2].value : null;
                      break;
                    case"is?":
                    case"is-not?":
                      if (o.length < 2 || o.length > 3) {
                        throw new Error(`Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                      }
                      if (o.some(e => "string" !== e.type)) {
                        throw new Error(`Arguments to \`#${t}\` predicate must be a strings.".`);
                      }
                      const _ = "is?" === t ? l : d;
                      _[e] || (_[e] = {}), _[e][o[1].value] = o[2] ? o[2].value : null;
                      break;
                    default:
                      c[e].push({ operator: t, operands: o.slice(1) });
                  }
                  o.length = 0;
                }
              }
              Object.freeze(u[e]), Object.freeze(l[e]), Object.freeze(d[e]);
            }
            return et._free(r), new Query(tt, n, a, m, c, Object.freeze(u), Object.freeze(l), Object.freeze(d));
          }

          static load (e) {
            let t;
            if (e instanceof Uint8Array) {
              t = Promise.resolve(e);
            }
            else {
              const r = e;
              if ("undefined" != typeof process && process.versions && process.versions.node) {
                const e = require("fs");
                t = Promise.resolve(e.readFileSync(r));
              }
              else {
                t = fetch(r).then(e => e.arrayBuffer().then(t => {
                  if (e.ok) {
                    return new Uint8Array(t);
                  }
                  {
                    const r = new TextDecoder("utf-8").decode(t);
                    throw new Error(`Language.load failed with status ${e.status}.\n\n${r}`);
                  }
                }));
              }
            }
            const r = "function" == typeof loadSideModule ? loadSideModule : xe;
            return t.then(e => r(e, { loadAsync: !0 })).then(e => {
              const t = Object.keys(e), r = t.find(e => lt.test(e) && !e.includes("external_scanner_"));
              r || console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(t, null, 2)}`);
              const n = e[r]();
              return new Language(tt, n);
            });
          }
        }

        class Query {
          constructor (e, t, r, n, o, s, _, a) {
            wt(e), this[0] = t, this.captureNames = r, this.textPredicates = n, this.predicates = o, this.setProperties = s, this.assertedProperties = _, this.refutedProperties = a, this.exceededMatchLimit = !1;
          }

          delete () {
            et._ts_query_delete(this[0]), this[0] = 0;
          }

          matches (e, t, r, n) {
            t || (t = _t), r || (r = _t), n || (n = {});
            let o = n.matchLimit;
            if (void 0 === o) {
              o = 0;
            }
            else if ("number" != typeof o) {
              throw new Error("Arguments must be numbers");
            }
            yt(e), et._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, r.row, r.column, o);
            const s = N(mt, "i32"), _ = N(mt + rt, "i32"), a = N(mt + 2 * rt, "i32"), i = new Array(s);
            this.exceededMatchLimit = !!a;
            let u = 0, l = _;
            for (let t = 0; t < s; t++) {
              const r = N(l, "i32"), n = N(l += rt, "i32");
              l += rt;
              const o = new Array(n);
              if (l = gt(this, e.tree, l, o), this.textPredicates[r].every(e => e(o))) {
                i[u++] = { pattern: r, captures: o };
                const e = this.setProperties[r];
                e && (i[t].setProperties = e);
                const n = this.assertedProperties[r];
                n && (i[t].assertedProperties = n);
                const s = this.refutedProperties[r];
                s && (i[t].refutedProperties = s);
              }
            }
            return i.length = u, et._free(_), i;
          }

          captures (e, t, r, n) {
            t || (t = _t), r || (r = _t), n || (n = {});
            let o = n.matchLimit;
            if (void 0 === o) {
              o = 0;
            }
            else if ("number" != typeof o) {
              throw new Error("Arguments must be numbers");
            }
            yt(e), et._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, r.row, r.column, o);
            const s = N(mt, "i32"), _ = N(mt + rt, "i32"), a = N(mt + 2 * rt, "i32"), i = [];
            this.exceededMatchLimit = !!a;
            const u = [];
            let l = _;
            for (let t = 0; t < s; t++) {
              const t = N(l, "i32"), r = N(l += rt, "i32"), n = N(l += rt, "i32");
              if (l += rt, u.length = r, l = gt(this, e.tree, l, u), this.textPredicates[t].every(e => e(u))) {
                const e = u[n], r = this.setProperties[t];
                r && (e.setProperties = r);
                const o = this.assertedProperties[t];
                o && (e.assertedProperties = o);
                const s = this.refutedProperties[t];
                s && (e.refutedProperties = s), i.push(e)
              }
            }
            return et._free(_), i
          }

          predicatesForPattern (e) {
            return this.predicates[e]
          }

          didExceedMatchLimit () {
            return this.exceededMatchLimit
          }
        }

        function ht (e, t, r) {
          const n = r - t;
          let o = e.textCallback(t, null, r);
          for (t += o.length; t < r;) {
            const n = e.textCallback(t, null, r);
            if (!(n && n.length > 0)) {
              break;
            }
            t += n.length, o += n
          }
          return t > r && (o = o.slice(0, n)), o
        }

        function gt (e, t, r, n) {
          for (let o = 0, s = n.length; o < s; o++) {
            const s = N(r, "i32"), _ = bt(t, r += rt);
            r += nt, n[o] = { name: e.captureNames[s], node: _ }
          }
          return r
        }

        function wt (e) {
          if (e !== tt) {
            throw new Error("Illegal constructor")
          }
        }

        function Mt (e) {
          return e && "number" == typeof e.row && "number" == typeof e.column
        }

        function yt (e) {
          let t = mt;
          x(t, e.id, "i32"), x(t += rt, e.startIndex, "i32"), x(t += rt, e.startPosition.row, "i32"), x(t += rt, e.startPosition.column, "i32"), x(t += rt, e[0], "i32")
        }

        function bt (e, t = mt) {
          const r = N(t, "i32");
          if (0 === r) {
            return null;
          }
          const n = N(t += rt, "i32"), o = N(t += rt, "i32"), s = N(t += rt, "i32"), _ = N(t += rt, "i32"),
            a = new Node(tt, e);
          return a.id = r, a.startIndex = n, a.startPosition = { row: o, column: s }, a[0] = _, a
        }

        function vt (e, t = mt) {
          x(t + 0 * rt, e[0], "i32"), x(t + 1 * rt, e[1], "i32"), x(t + 2 * rt, e[2], "i32")
        }

        function Et (e) {
          e[0] = N(mt + 0 * rt, "i32"), e[1] = N(mt + 1 * rt, "i32"), e[2] = N(mt + 2 * rt, "i32")
        }

        function St (e, t) {
          x(e, t.row, "i32"), x(e + rt, t.column, "i32")
        }

        function It (e) {
          return { row: N(e, "i32"), column: N(e + rt, "i32") }
        }

        function At (e, t) {
          St(e, t.startPosition), St(e += ot, t.endPosition), x(e += ot, t.startIndex, "i32"), x(e += rt, t.endIndex, "i32"), e += rt
        }

        function xt (e) {
          const t = {};
          return t.startPosition = It(e), e += ot, t.endPosition = It(e), e += ot, t.startIndex = N(e, "i32"), e += rt, t.endIndex = N(e, "i32"), t
        }

        for (const e of Object.getOwnPropertyNames(ParserImpl.prototype)) Object.defineProperty(Parser.prototype, e, {
          value: ParserImpl.prototype[e],
          enumerable: !1,
          writable: !1
        });
        Parser.Language = Language, Module.onRuntimeInitialized = (() => {
          ParserImpl.init(), e()
        })
      }))
    }
  }

  return Parser
}();

await TreeSitter.init({
  locateFile(scriptName, scriptDirectory) {
    console.log(scriptName, scriptDirectory);
    return "/assets/tree-sitter.wasm";
  }  
});

export const Parser = TreeSitter;
export const Language = TreeSitter.Language;
