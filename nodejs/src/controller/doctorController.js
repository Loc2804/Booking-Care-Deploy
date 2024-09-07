import doctorService from "../services/doctorService"

let getTopDoctorHome = async(req,res) =>{
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async(req,res) =>{
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let postInfoDoctor = async(req,res) =>{
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getDetailDoctorById = async(req,res) =>{
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let bulkCreateSchedule = async(req,res)=>{
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getScheduleDoctorByDate = async(req,res) =>{
    try {
        let info = await doctorService.getScheduleDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getExtraInfoDoctorById = async(req,res) =>{
    try{
        let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    }
    catch(error)
    {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getProfileDoctorById = async(req,res) =>{
    try{
        let info = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    }
    catch(error)
    {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let getListPatient = async(req,res) => {
    try{
        let info = await doctorService.getListPatient(req.query.id, req.query.date);
        return res.status(200).json(info);
    }
    catch(error)
    {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}

let sendRemedy = async(req,res) =>{
    try{
        let info = await doctorService.sendRemedy(req.body);
        return res.status(200).json(info);
    }
    catch(error)
    {
        console.log(error);
        return res.status(200).json({
            errCode : -1,
            message: 'Error from server...'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    postInfoDoctor:postInfoDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleDoctorByDate:getScheduleDoctorByDate,
    getExtraInfoDoctorById:getExtraInfoDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    getListPatient:getListPatient,
    sendRemedy:sendRemedy,
}