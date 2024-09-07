"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var configViewEngine = function configViewEngine(app) {
  //arrow function
  app.use(_express["default"]["static"]("./src/public"));
  app.set("view engine", "ejs"); //jsp for if else... 
  app.set("views", "./src/views");
};
module.exports = configViewEngine;