"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "./src/pages/_document.tsx":
/*!*********************************!*\
  !*** ./src/pages/_document.tsx ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyDocument)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/document */ \"./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/server/create-instance */ \"@emotion/server/create-instance\");\n/* harmony import */ var _emotion_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/css */ \"@emotion/css\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__, _emotion_css__WEBPACK_IMPORTED_MODULE_4__]);\n([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__, _emotion_css__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nconst { extractCritical } = (0,_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(_emotion_css__WEBPACK_IMPORTED_MODULE_4__.cache);\nclass MyDocument extends (next_document__WEBPACK_IMPORTED_MODULE_2___default()) {\n    static async getInitialProps(ctx) {\n        const initialProps = await next_document__WEBPACK_IMPORTED_MODULE_2___default().getInitialProps(ctx);\n        const styles = extractCritical(initialProps.html);\n        return {\n            ...initialProps,\n            styles: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                children: [\n                    initialProps.styles,\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"style\", {\n                        \"data-emotion-css\": styles.ids.join(' '),\n                        dangerouslySetInnerHTML: {\n                            __html: styles.css\n                        }\n                    }, void 0, false, {\n                        fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                        lineNumber: 24,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true)\n        };\n    }\n    render() {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Html, {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Head, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"stylesheet\",\n                            href: \"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 41,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"stylesheet\",\n                            href: \"https://fonts.googleapis.com/icon?family=Material+Icons\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 45,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"icon\",\n                            type: \"image/x-icon\",\n                            href: \"/favicon.ico\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 49,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"preconnect\",\n                            href: \"https://fonts.googleapis.com\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 50,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            rel: \"preconnect\",\n                            href: \"https://fonts.gstatic.com\",\n                            crossOrigin: \"anonymous\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 51,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                            href: \"https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Mulish:wght@200;300;400;500;600;700;800;900&display=swap\",\n                            rel: \"stylesheet\"\n                        }, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 56,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                    lineNumber: 36,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                    className: \"dark:bg-gray-800\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Main, {}, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 62,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.NextScript, {}, void 0, false, {\n                            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                            lineNumber: 63,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n                    lineNumber: 61,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/omars.dev/dev/vuedale/marouf-report/marouf-dashboard/src/pages/_document.tsx\",\n            lineNumber: 35,\n            columnNumber: 7\n        }, this);\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2RvY3VtZW50LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBT1I7QUFDMkM7QUFDL0I7QUFHbEMsTUFBTSxFQUFDUSxlQUFlLEVBQUMsR0FBR0YsMkVBQW1CQSxDQUFDQywrQ0FBS0E7QUFFcEMsTUFBTUUsbUJBQW1CUixzREFBUUE7SUFDOUMsYUFBYVMsZ0JBQWdCQyxHQUFvQixFQUFFO1FBQ2pELE1BQU1DLGVBQWUsTUFBTVgsb0VBQXdCLENBQUNVO1FBQ3BELE1BQU1FLFNBQVNMLGdCQUFnQkksYUFBYUUsSUFBSTtRQUNoRCxPQUFPO1lBQ0wsR0FBR0YsWUFBWTtZQUNmQyxzQkFDRTs7b0JBQ0dELGFBQWFDLE1BQU07a0NBQ3BCLDhEQUFDRTt3QkFDQ0Msb0JBQWtCSCxPQUFPSSxHQUFHLENBQUNDLElBQUksQ0FBQzt3QkFDbENDLHlCQUF5Qjs0QkFBQ0MsUUFBUVAsT0FBT1EsR0FBRzt3QkFBQTs7Ozs7Ozs7UUFJcEQ7SUFDRjtJQUVBQyxTQUFTO1FBQ1AscUJBQ0UsOERBQUNwQiwrQ0FBSUE7OzhCQUNILDhEQUFDQywrQ0FBSUE7O3NDQUtILDhEQUFDb0I7NEJBQ0NDLEtBQUk7NEJBQ0pDLE1BQUs7Ozs7OztzQ0FFUCw4REFBQ0Y7NEJBQ0NDLEtBQUk7NEJBQ0pDLE1BQUs7Ozs7OztzQ0FFUCw4REFBQ0Y7NEJBQUtDLEtBQUk7NEJBQU9FLE1BQUs7NEJBQWVELE1BQUs7Ozs7OztzQ0FDMUMsOERBQUNGOzRCQUFLQyxLQUFJOzRCQUFhQyxNQUFLOzs7Ozs7c0NBQzVCLDhEQUFDRjs0QkFDQ0MsS0FBSTs0QkFDSkMsTUFBSzs0QkFDTEUsYUFBWTs7Ozs7O3NDQUVkLDhEQUFDSjs0QkFDQ0UsTUFBSzs0QkFDTEQsS0FBSTs7Ozs7Ozs7Ozs7OzhCQUdSLDhEQUFDSTtvQkFBS0MsV0FBVTs7c0NBQ2QsOERBQUN6QiwrQ0FBSUE7Ozs7O3NDQUNMLDhEQUFDQyxxREFBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSW5CO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXJzaV9jbXMvLi9zcmMvcGFnZXMvX2RvY3VtZW50LnRzeD8xODhlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IERvY3VtZW50LCB7XG4gIEh0bWwsXG4gIEhlYWQsXG4gIE1haW4sXG4gIE5leHRTY3JpcHQsXG4gIERvY3VtZW50Q29udGV4dCxcbn0gZnJvbSAnbmV4dC9kb2N1bWVudCdcbmltcG9ydCBjcmVhdGVFbW90aW9uU2VydmVyIGZyb20gJ0BlbW90aW9uL3NlcnZlci9jcmVhdGUtaW5zdGFuY2UnXG5pbXBvcnQge2NhY2hlfSBmcm9tICdAZW1vdGlvbi9jc3MnXG5pbXBvcnQge2NyZWF0ZVRoZW1lfSBmcm9tICdAbXVpL21hdGVyaWFsJ1xuXG5jb25zdCB7ZXh0cmFjdENyaXRpY2FsfSA9IGNyZWF0ZUVtb3Rpb25TZXJ2ZXIoY2FjaGUpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15RG9jdW1lbnQgZXh0ZW5kcyBEb2N1bWVudCB7XG4gIHN0YXRpYyBhc3luYyBnZXRJbml0aWFsUHJvcHMoY3R4OiBEb2N1bWVudENvbnRleHQpIHtcbiAgICBjb25zdCBpbml0aWFsUHJvcHMgPSBhd2FpdCBEb2N1bWVudC5nZXRJbml0aWFsUHJvcHMoY3R4KVxuICAgIGNvbnN0IHN0eWxlcyA9IGV4dHJhY3RDcml0aWNhbChpbml0aWFsUHJvcHMuaHRtbClcbiAgICByZXR1cm4ge1xuICAgICAgLi4uaW5pdGlhbFByb3BzLFxuICAgICAgc3R5bGVzOiAoXG4gICAgICAgIDw+XG4gICAgICAgICAge2luaXRpYWxQcm9wcy5zdHlsZXN9XG4gICAgICAgICAgPHN0eWxlXG4gICAgICAgICAgICBkYXRhLWVtb3Rpb24tY3NzPXtzdHlsZXMuaWRzLmpvaW4oJyAnKX1cbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBzdHlsZXMuY3NzfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8Lz5cbiAgICAgICksXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SHRtbD5cbiAgICAgICAgPEhlYWQ+XG4gICAgICAgICAgey8qIDxsaW5rXG4gICAgICAgICAgICByZWw9XCJpY29uXCJcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2Vtb2ppcGVkaWEtdXMuczMuZHVhbHN0YWNrLnVzLXdlc3QtMS5hbWF6b25hd3MuY29tL3RodW1icy8yNDAvYXBwbGUvMjcxL2Nsb3VkLXdpdGgtbGlnaHRuaW5nLWFuZC1yYWluXzI2YzgtZmUwZi5wbmdcIlxuICAgICAgICAgIC8+ICovfVxuICAgICAgICAgIDxsaW5rXG4gICAgICAgICAgICByZWw9XCJzdHlsZXNoZWV0XCJcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjMwMCw0MDAsNTAwLDcwMCZkaXNwbGF5PXN3YXBcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxpbmtcbiAgICAgICAgICAgIHJlbD1cInN0eWxlc2hlZXRcIlxuICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vaWNvbj9mYW1pbHk9TWF0ZXJpYWwrSWNvbnNcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIHR5cGU9XCJpbWFnZS94LWljb25cIiBocmVmPVwiL2Zhdmljb24uaWNvXCIgLz5cbiAgICAgICAgICA8bGluayByZWw9XCJwcmVjb25uZWN0XCIgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb21cIiAvPlxuICAgICAgICAgIDxsaW5rXG4gICAgICAgICAgICByZWw9XCJwcmVjb25uZWN0XCJcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2ZvbnRzLmdzdGF0aWMuY29tXCJcbiAgICAgICAgICAgIGNyb3NzT3JpZ2luPSdhbm9ueW1vdXMnXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8bGlua1xuICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QWxtYXJhaTp3Z2h0QDMwMDs0MDA7NzAwOzgwMCZmYW1pbHk9TXVsaXNoOndnaHRAMjAwOzMwMDs0MDA7NTAwOzYwMDs3MDA7ODAwOzkwMCZkaXNwbGF5PXN3YXBcIlxuICAgICAgICAgICAgcmVsPVwic3R5bGVzaGVldFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9IZWFkPlxuICAgICAgICA8Ym9keSBjbGFzc05hbWU9XCJkYXJrOmJnLWdyYXktODAwXCI+XG4gICAgICAgICAgPE1haW4gLz5cbiAgICAgICAgICA8TmV4dFNjcmlwdCAvPlxuICAgICAgICA8L2JvZHk+XG4gICAgICA8L0h0bWw+XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJEb2N1bWVudCIsIkh0bWwiLCJIZWFkIiwiTWFpbiIsIk5leHRTY3JpcHQiLCJjcmVhdGVFbW90aW9uU2VydmVyIiwiY2FjaGUiLCJleHRyYWN0Q3JpdGljYWwiLCJNeURvY3VtZW50IiwiZ2V0SW5pdGlhbFByb3BzIiwiY3R4IiwiaW5pdGlhbFByb3BzIiwic3R5bGVzIiwiaHRtbCIsInN0eWxlIiwiZGF0YS1lbW90aW9uLWNzcyIsImlkcyIsImpvaW4iLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImNzcyIsInJlbmRlciIsImxpbmsiLCJyZWwiLCJocmVmIiwidHlwZSIsImNyb3NzT3JpZ2luIiwiYm9keSIsImNsYXNzTmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_document.tsx\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "@emotion/css":
/*!*******************************!*\
  !*** external "@emotion/css" ***!
  \*******************************/
/***/ ((module) => {

module.exports = import("@emotion/css");;

/***/ }),

/***/ "@emotion/server/create-instance":
/*!**************************************************!*\
  !*** external "@emotion/server/create-instance" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = import("@emotion/server/create-instance");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_document.tsx")));
module.exports = __webpack_exports__;

})();