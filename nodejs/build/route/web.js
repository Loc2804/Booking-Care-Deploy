"use strict";

var _express = _interopRequireDefault(require("express"));
var _homeController = _interopRequireDefault(require("../controller/homeController"));
var _userController = _interopRequireDefault(require("../controller/userController"));
var _doctorController = _interopRequireDefault(require("../controller/doctorController"));
var _patientController = _interopRequireDefault(require("../controller/patientController"));
var _specialtyController = _interopRequireDefault(require("../controller/specialtyController"));
var _clinicController = _interopRequireDefault(require("../controller/clinicController"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  router.get('/', _homeController["default"].getHomePage);
  router.get('/hoidanit', function (req, res) {
    return res.render('homePage.ejs');
  });
  router.post('/post-crud', _homeController["default"].postCRUD);
  router.get('/crud', _homeController["default"].getCRUD);
  router.get('/get-crud', _homeController["default"].displayGetCRUD);
  router.get('/edit-crud', _homeController["default"].getEditCRUD);
  router.post('/put-crud', _homeController["default"].putCRUD);
  router.get('/delete-crud', _homeController["default"].deleteCRUD);
  router.post('/api/login', _userController["default"].handleLogin);
  router.get('/api/get-all-users', _userController["default"].handleGetAllUser);
  router.post('/api/create-new-user', _userController["default"].handleCreateNewUser);
  router.put('/api/edit-user', _userController["default"].handleEditUser);
  router["delete"]('/api/delete-user', _userController["default"].handleDeleteUser);
  //rest api 
  router.get('/api/allcode', _userController["default"].getAllCode);
  router.get('/api/top-doctor-home', _doctorController["default"].getTopDoctorHome);
  router.get('/api/get-all-doctors', _doctorController["default"].getAllDoctors);
  router.post('/api/save-info-doctor', _doctorController["default"].postInfoDoctor);
  router.get('/api/get-detail-doctor-by-id', _doctorController["default"].getDetailDoctorById);
  router.post('/api/bulk-create-schedule', _doctorController["default"].bulkCreateSchedule);
  router.get('/api/get-schedule-doctor-by-date', _doctorController["default"].getScheduleDoctorByDate);
  router.get('/api/get-extra-info-doctor-by-id', _doctorController["default"].getExtraInfoDoctorById);
  router.get('/api/get-profile-doctor-by-id', _doctorController["default"].getProfileDoctorById);
  router.get('/api/get-list-patient', _doctorController["default"].getListPatient);
  router.post('/api/send-remedy', _doctorController["default"].sendRemedy);
  router.post('/api/patient-book-appointment', _patientController["default"].postBookingAppointment);
  router.post('/api/verify-book-appointment', _patientController["default"].postVerifyBookingAppointment);
  router.post('/api/create-new-specialty', _specialtyController["default"].createNewSpecialty);
  router.get('/api/get-all-specialty', _specialtyController["default"].getAllSpecialty);
  router.get('/api/get-detail-specialty-by-id', _specialtyController["default"].getDetailSpecialtyById);
  router.post('/api/create-new-clinic', _clinicController["default"].createNewClinic);
  router.get('/api/get-all-clinic', _clinicController["default"].getAllClinic);
  router.get('/api/get-detail-clinic-by-id', _clinicController["default"].getDetailClinicById);
  return app.use("/", router);
};
module.exports = initWebRoutes;