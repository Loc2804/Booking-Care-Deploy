"use strict";

var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _viewEngine = _interopRequireDefault(require("./config/viewEngine"));
var _web = _interopRequireDefault(require("./route/web"));
var _connectDB = _interopRequireDefault(require("./config/connectDB"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
require('dotenv').config();
var app = (0, _express["default"])();
var corsOptions = {
  origin: 'http://localhost:3000',
  // Thay đổi thành URL của client của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Các phương thức HTTP mà bạn cho phép
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Các header mà bạn cho phép
  credentials: true // Cho phép thông tin xác thực
};
app.use((0, _cors["default"])(corsOptions));
//config

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(_bodyParser["default"].json({
  limit: '50mb'
}));
app.use(_bodyParser["default"].urlencoded({
  limit: '50mb',
  extended: true
}));
(0, _viewEngine["default"])(app);
(0, _web["default"])(app);
(0, _connectDB["default"])();
var port = process.env.PORT;
app.listen(port, function () {
  //callback function
  console.log("backend node js is running on the port: " + port);
});