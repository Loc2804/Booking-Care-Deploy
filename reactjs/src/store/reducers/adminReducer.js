import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctor: [],
    allDoctor:[],
    time: [],

    listPrice: [],
    listProvince: [],
    listPayment: [],
    listSpecialty:[],
    listClinic:[],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = {...state};
            copyState.isLoadingGender = true;
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.genders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            state.isLoadingPosition = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.isLoadingPosition = false;
            state.positions = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingRole = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.isLoadingRole = false;
            state.roles= [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users= [];
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctor = action.data;
            return {
                ...state,
        }
        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.topDoctor= [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctor = action.data;
            return {
                ...state,
        }
        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.allDoctor= [];
            return {
                ...state,
            }
        case actionTypes.FETCH_TIME_SUCCESS:
            state.time = action.data;
            return {
                ...state,
        }
        case actionTypes.FETCH_TIME_FAILED:
            state.time= [];
            return {
                ...state,
            }

        case actionTypes.GET_DOCTOR_PRICE_SUCCESS:
            state.listPrice = action.data;

            return {
                ...state,
        }
        case actionTypes.GET_DOCTOR_PRICE_FAILED:
            state.listPrice= [];
            return {
                ...state,
            }

        case actionTypes.GET_DOCTOR_PAYMENT_SUCCESS:
            state.listPayment = action.data;

            return {
                ...state,    
            }
        case actionTypes.GET_DOCTOR_PAYMENT_FAILED:
            state.listPayment= [];
            return {
                ...state,
            }

        case actionTypes.GET_DOCTOR_PROVINCE_SUCCESS:
            state.listProvince = action.data;

            return {
                ...state,
         }
        case actionTypes.GET_DOCTOR_PROVINCE_FAILED:
            state.listProvince= [];
            return {
                ...state,
            }
                
        case actionTypes.GET_SPECIALTY_SUCCESS:
            state.listSpecialty = action.data;

            return {
                ...state,
            }
        case actionTypes.GET_SPECIALTY_FAILED:
            state.listSpecialty= [];
            return {
                ...state,
            }

        case actionTypes.GET_CLINIC_SUCCESS:
        state.listClinic = action.data;

        return {
            ...state,
        }
        case actionTypes.GET_CLINIC_FAILED:
            state.listClinic= [];
            return {
                ...state,
            }
                
        default:
            return state;
    }
}

export default adminReducer;