import { stringify } from "react-auth-wrapper/helpers";
import axios from "../axios"

const handleLoginApi = (userEmail,userPassword) =>{
    return axios.post('/api/login', {
        email:userEmail,
        password: userPassword
    } );
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) =>{
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) =>{
    return axios.delete('/api/delete-user', 
        {
            data: {
                id: userId,
            }
        }
    )
}

const editUserService = (data) =>{
    return axios.put('/api/edit-user', data);
}

const getAllCodeService = (inputType) =>{
    return axios.get(`/api/allcode?type=${inputType}` );
}

const getTopDoctorHomeService = (limit) =>{
    return axios.get(`api/top-doctor-home?limit=${limit}`);
}

const getAllDoctorService = () =>{
    return axios.get('/api/get-all-doctors');
}

const saveDetailDoctor = (data) =>{
    return axios.post('/api/save-info-doctor', data)
}

const getDetailInfoDoctor = (id) =>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}

const saveBulkScheduleDoctor = (data) =>{
    return axios.post('/api/bulk-create-schedule',data);
}

const getScheduleDoctorByDate = (doctorId, date) =>{
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraDoctorInfoById = (doctorId) =>{
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) =>{
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookingAppointment = (data) =>{
    return axios.post(`/api/patient-book-appointment`,data)
}

const postVerifyBookingAppointment = (data) =>{
    return axios.post(`/api/verify-book-appointment`,data)
}

const postNewSpecialty = (data) =>{
    return axios.post(`/api/create-new-specialty`,data)
}

const getAllSpecialty= () =>{
    return axios.get(`/api/get-all-specialty`);
}

const getDetailSpecialtyById= (data) =>{
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const postNewClinic= (data) =>{
    return axios.post(`/api/create-new-clinic`,data)
}

const getAllClinic= () =>{
    return axios.get(`/api/get-all-clinic`);
}

const getDetailClinicById= (data) =>{
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
}

const getAllPatient= (data) =>{
    return axios.get(`/api/get-list-patient?id=${data.id}&date=${data.date}`);
}

const sendRemedyForPatient= (data) =>{
    return axios.post(`/api/send-remedy`,data)
}
export {handleLoginApi , getAllUsers , createNewUserService ,deleteUserService,
    editUserService, getAllCodeService,  getTopDoctorHomeService,  getAllDoctorService,
    saveDetailDoctor, getDetailInfoDoctor,saveBulkScheduleDoctor, getScheduleDoctorByDate,
    getExtraDoctorInfoById,getProfileDoctorById,postPatientBookingAppointment,postVerifyBookingAppointment,
    postNewSpecialty,getAllSpecialty,getDetailSpecialtyById, postNewClinic, getAllClinic,getDetailClinicById,
    getAllPatient,sendRemedyForPatient
};