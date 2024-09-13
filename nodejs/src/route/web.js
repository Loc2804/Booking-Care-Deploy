import express from "express"
import homeController from "../controller/homeController";
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
import patientController from "../controller/patientController"
import specialtyController from "../controller/specialtyController";
import clinicController from "../controller/clinicController";
let router = express.Router();

let initWebRoutes = (app) =>{
    router.get('/', homeController.getHomePage);
    router.get('/hoidanit', (req,res) => {
        return res.render('homePage.ejs');
    });
    router.post('/post-crud', homeController.postCRUD);
    router.get('/crud', homeController.getCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.put('/api/change-password', userController.handleChangePassword);
    //rest api 
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient', doctorController.getListPatient);
    router.post('/api/send-remedy', doctorController.sendRemedy);

    router.post('/api/patient-book-appointment', patientController.postBookingAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookingAppointment);

    router.post('/api/create-new-specialty',specialtyController.createNewSpecialty);
    router.get('/api/get-all-specialty',specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id',specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic',clinicController.createNewClinic);
    router.get('/api/get-all-clinic',clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id',clinicController.getDetailClinicById);


    return app.use("/",router);
}

module.exports = initWebRoutes; 