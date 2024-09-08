import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService,  getAllUsers, deleteUserService, editUserService, 
    getTopDoctorHomeService, 
    getAllDoctorService,saveDetailDoctor, getAllSpecialty,getAllClinic } from '../../services/userService';
import { toast } from 'react-toastify';

export const fetchGenderStart = () => {
    return async(dispatch, getState) =>{
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START,
            })
            let res =  await getAllCodeService('GENDER');
            if(res && res.errCode === 0)
            {
                dispatch(fetchGenderSuccess(res.data));
            }
            else{
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('Fetch gender start: ',error);
        }
    }
}

export const fetchPositionStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('POSITION');
            if(res && res.errCode === 0)
            {
                dispatch(fetchPositionSuccess(res.data));
            }
            else{
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('Fetch position start: ',error);
        }
    }
}
    
export const fetchRoleStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('ROLE');
            if(res && res.errCode === 0)
            {
                dispatch(fetchRoleSuccess(res.data));
            }
            else{
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('Fetch role start: ',error);
        }
    }
}

export const createNewUser = (data) => {
    return async(dispatch, getState) =>{
        try {
            let res =  await createNewUserService(data) ;
            if(res && res.errCode === 0)
            {
                toast.success("Create a new user success !");
                dispatch(createUserSuccess());
                dispatch(fetchAllUserStart());
            }
            else{
                toast.error("Create a new user failed: " + res.message );
                dispatch(createUserFailed());
            }
        } catch (error) {
            toast.error("Create a new user failed :", error);
            dispatch(createUserFailed());
            console.log('Create user: ',error);
        }
    }
}


export const deleteUser = (userId) => {
    return async(dispatch, getState) =>{
        try {
            let res =  await deleteUserService(userId) ;
            if(res && res.errCode === 0)
            {
                toast.success("Delete a user success !");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart());
            }
            else{
                toast.error("Delete a user failed !");
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            toast.error("Delete a user failed !");
            dispatch(deleteUserFailed());
            console.log('Delete user: ',error);
        }
    }
}

export const editUser = (data) => {
    return async(dispatch, getState) =>{
        try {
            let res =  await editUserService(data) ;
            console.log(res);
            if(res && res.errCode === 0)
            {
                toast.success("Edit a user success !");
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());
            }
            else{
                toast.error("Edit a user failed: "+ res.message );
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error("Edit a user failed !");
            dispatch(editUserFailed());
            console.log('Edit user: ',error);
        }
    }
}

export const fetchAllUserStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllUsers("ALL") ;
            // let res_doctor = await getTopDoctorHomeService('');
            if(res && res.errCode === 0)
            {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            }
            else{
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('Get all users failed: ',error);
        }
    }
}
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// })

//LOAD GENDER
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
})

//LOAD POSITION
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
})

//LOAD ROLE
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
})

//SAVE USER
export const createUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const createUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

//FETCH USERS
export const fetchAllUsersSuccess = (userData) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    data: userData,
})

export const  fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED,
})

//DELETE USER
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})

//EDIT USER
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
})

export const getTopDoctor = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getTopDoctorHomeService('') ;
            // let res_doctor = await getTopDoctorHomeService('');
            if(res && res.errCode === 0)
            {            
                dispatch(fetchTopDoctorSuccess(res.data));
            }
            else{
                dispatch(fetchTopDoctorFailed());
            }
        } catch (error) {
            dispatch(fetchTopDoctorFailed());
            console.log('Get top doctors failed: ',error);
        }
    }
}

export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    data: data,
})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
})

export const fetchAllDoctors = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllDoctorService() ;
            if(res && res.errCode === 0)
            {
                dispatch(fetchAllDoctorSuccess(res.data));
            }
            else{
                dispatch(fetchAllDoctorFailed());
            }
        } catch (error) {
            dispatch(fetchAllDoctorFailed());
            console.log('Get all doctors failed: ',error);
        }
    }
}

export const fetchAllDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
    data: data,
})

export const fetchAllDoctorFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
})

export const saveDetailInfoDoctor = (data) => {
    return async(dispatch, getState) =>{
        try {
            let res =  await saveDetailDoctor(data);
            if(res && res.errCode === 0)
            {
                dispatch(saveDetailSuccess());
                toast.success(res.message);
            }
            else{
                dispatch(saveDetailFailed());
                toast.error("Save detail info failed: " + res.message);
            }
        } catch (error) {
            dispatch(saveDetailFailed());
            toast.error("Save detail info failed !");
            console.log('Save detail doctor failed: ',error);
        }
    }
}

export const saveDetailSuccess = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
})

export const saveDetailFailed = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
})

export const fetchTimeStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('TIME');
            if(res && res.errCode === 0)
            {
                dispatch(fetchTimeSuccess(res.data));
            }
            else{
                dispatch(fetchTimeFailed());
            }
        } catch (error) {
            dispatch(fetchTimeFailed());
            console.log('Fetch time start: ',error);
        }
    }
}

export const fetchTimeSuccess = (data) => ({
    type: actionTypes.FETCH_TIME_SUCCESS,
    data: data,
})

export const fetchTimeFailed = () => ({
    type: actionTypes.FETCH_TIME_FAILED,
})

export const getDoctorPrice = () =>{
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('PRICE');
            if(res && res.errCode === 0)
            {
                dispatch(getDoctorPriceSuccess(res.data));
            }
            else{
                dispatch(getDoctorPriceFailed());
            }
        } catch (error) {
            dispatch(getDoctorPriceFailed());
            console.log('Get price start: ',error);
        }
    }
}

export const getDoctorPriceSuccess = (data) => ({
    type: actionTypes.GET_DOCTOR_PRICE_SUCCESS,
    data:data,
})

export const getDoctorPriceFailed = () => ({
    type: actionTypes.GET_DOCTOR_PRICE_FAILED,
})

export const getDoctorProvince = () =>{
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('PROVINCE');
            if(res && res.errCode === 0)
            {
                dispatch(getDoctorProvinceSuccess(res.data));
            }
            else{
                dispatch(getDoctorProvinceFailed());
            }
        } catch (error) {
            dispatch(getDoctorProvinceFailed());
            console.log('Get province start: ',error);
        }
    }
}

export const getDoctorProvinceSuccess = (data) => ({
    type: actionTypes.GET_DOCTOR_PROVINCE_SUCCESS,
    data:data,
})

export const getDoctorProvinceFailed = () => ({
    type: actionTypes.GET_DOCTOR_PROVINCE_FAILED,
})


export const getDoctorPayment = () =>{
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllCodeService('PAYMENT');
            if(res && res.errCode === 0)
            {
                dispatch(getDoctorPaymentSuccess(res.data));
            }
            else{
                dispatch(getDoctorPaymentFailed());
            }
        } catch (error) {
            dispatch(getDoctorPaymentFailed());
            console.log('Get payment failed: ',error);
        }
    }
}

export const getDoctorPaymentSuccess = (data) => ({
    type: actionTypes.GET_DOCTOR_PAYMENT_SUCCESS,
    data:data,
})

export const getDoctorPaymentFailed = () => ({
    type: actionTypes.GET_DOCTOR_PAYMENT_FAILED,
})

export const getAllSpecialtyStart = () =>{
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllSpecialty();
            if(res && res.errCode === 0)
            {
                dispatch(getAllSpecialtySuccess(res.data));
            }
            else{
                dispatch(getAllSpecialtyFailed());
            }
        } catch (error) {
            dispatch(getAllSpecialtyFailed());
            console.log('Get specialty failed: ',error);
        }
    }
}

export const getAllSpecialtySuccess = (data) => ({
    type: actionTypes.GET_SPECIALTY_SUCCESS,
    data:data,
})

export const getAllSpecialtyFailed = () => ({
    type: actionTypes.GET_SPECIALTY_FAILED,
})

export const getAllClinicStart = () =>{
    return async(dispatch, getState) =>{
        try {
            let res =  await getAllClinic();
            if(res && res.errCode === 0)
            {
                dispatch(getAllClinicSuccess(res.data));
            }
            else{
                dispatch(getAllClinicFailed());
            }
        } catch (error) {
            dispatch(getAllClinicFailed());
            console.log('Get clinic failed: ',error);
        }
    }
}

export const getAllClinicSuccess = (data) => ({
    type: actionTypes.GET_CLINIC_SUCCESS,
    data:data,
})

export const getAllClinicFailed = () => ({
    type: actionTypes.GET_CLINIC_FAILED,
})
