import { raw } from "body-parser"
import db from "../models/index"
import { where } from "sequelize"
require('dotenv').config();
import _, { includes, reject } from 'lodash';
import emailService from "./emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: {roleId: 'R2'},
                order: [['createdAt','DESC']],
                attributes: {
                    exclude: ['password'],                    
                },             
                include:[
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw:true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data:users,
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () =>{
    return new Promise(async(resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image'],                    
                },             
            })
            resolve({
                errCode : 0,
                data: doctors,
            })
        } catch (error) {
            reject(error);
        }
    })
}

let checkData = (data) =>{
    let arr = ['doctorId','selectedProvince','selectedPayment','nameClinic','addressClinic','selectedSpecialty']
    let isValid = true;
    let element = '';
    for(let i = 0; i< arr.length;i++){
        if(!data[arr[i]]){
            isValid = false;
            element = arr[i];
        }
    }
    return({
        isValid:isValid,
        element:element,
    })
}

let saveDetailInfoDoctor = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            let obj = checkData(data);
            if(obj.isValid === false)
            {
                resolve({
                    errCode : 1,
                    message: `Missing parameter : ${obj.element} `,
                })
            }
            else{

                // DOCTOR_INFOR TABLE
                let doctorInfo = await db.Doctor_infor.findOne({
                    where: {doctorId : data.doctorId},
                    raw : false,
                })
                if(doctorInfo)
                {
                    //update
                    doctorInfo.doctorId = data.doctorId;
                    doctorInfo.priceId = data.selectedPrice;
                    doctorInfo.provinceId = data.selectedProvince;
                    doctorInfo.paymentId = data.selectedPayment;
                    doctorInfo.nameClinic = data.nameClinic;
                    doctorInfo.addressClinic = data.addressClinic;
                    doctorInfo.specialtyId = data.selectedSpecialty;
                    doctorInfo.clinicId = data.selectedClinic;
                    doctorInfo.note = data.note;
                    await doctorInfo.save();
                    resolve({
                        errCode: 0,
                        message: 'Update successfull',
                    })
                }
                else{
                    //create
                    await db.Doctor_infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        nameClinic :data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                        specialtyId: data.selectedSpecialty,
                        clinicId : data.selectedClinic,
                    })
                    resolve({
                        errCode: 0,
                        message: 'Create successfull',
                    })
                }
                //MARKDOWN
                if(data.action === 'CREATE')
                {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                    resolve({
                        errCode: 0,
                        message: 'Create info doctor success.',
                    })
                }
                if(data.action === 'EDIT'){
                    let detail = await db.Markdown.findOne({
                        where: {doctorId: data.doctorId},
                        raw:false,
                    })
                    
                    if(detail)
                    {
                        detail.contentHTML = data.contentHTML;
                        detail.contentMarkdown = data.contentMarkdown;
                        detail.description = data.description;
                        detail.updateAt = new Date();
                        await detail.save();

                        resolve({
                            errCode: 0,
                            message: 'Save info doctor success.',
                        })
                    }
                    else{
                        resolve({
                            errCode: 2,
                            message: 'Doctor detail is not found.',
                        })
                    }
                    
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctorById = (id) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!id)
            {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters',
                })
            }
            else{
                let data = await db.User.findOne({
                    where:{
                        id : id
                    },
                    attributes: {
                        exclude: ['password'],                    
                    },             
                    include:[
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                    ],
                    raw:false,
                    nest:true, 
                })
                if(!data)
                {
                    resolve({
                        data: {},
                        errCode: 2,
                        message:'User is not existed.'
                    })
                }
                else{
                    if(data.image)
                    {
                        data.image = new Buffer(data.image,'base64').toString('binary');
                        resolve({
                            data: data,
                            errCode: 0,
                            message:'Get detail success.'
                        })
                    }
                    else{
                        resolve({
                            data: {},
                            errCode: 3,
                            message:'Error from image!'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let bulkCreateScheduleService = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date)
            {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters.',
                })
            }
            else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length >0)
                {
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                    let existing = await db.Schedule.findAll({
                        where: {doctorId: data.doctorId, date: data.date},
                        attributes: ['timeType','date','doctorId','maxNumber']
                    })

                    //convert date
                    // if(existing && existing.length > 0){
                    //     existing = existing.map(item =>{
                    //         item.date = new Date(item.date).getTime();
                    //         return item;
                    //     })
                    // }

                    let toCreate = _.differenceWith(schedule,existing,(a,b) =>{
                        return a.timeType === b.timeType && +a.date === +b.date;
                    });
                    if(toCreate && toCreate.length > 0)
                    {
                        await db.Schedule.bulkCreate(toCreate);
                    }
                    resolve({
                        errCode : 0,
                        message: 'Successfull'
                    })
                }
                else{
                    resolve({
                        errCode : 2,
                        message: 'Failed',
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
} 

let getScheduleDoctor = (doctorId, date) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            if(!doctorId || !date)
            {
                resolve({
                    errCode :1,
                    message: 'Missing required parameters!',
                })
            }
            else{
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date : date,
                    },
                    include: [
                        {model: db.User, as: 'doctorData', attributes:['firstName', 'lastName']},
                        {model: db.Allcode, as: 'timeTypeData', attributes:['valueVi', 'valueEn']}
                    ],
                    raw: false,
                    nest: true,
                })
                if(!data)
                {
                    resolve({
                        data: [],
                        errCode : 2,
                        message: 'Data is empty',
                    })
                }
                else{
                    resolve({
                        data: data,
                        errCode: 0,
                        message: 'Successfull'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraInfoDoctorById = (id) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            if(!id)
            {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters.'
                })
            }
            else{
                let data = await db.Doctor_infor.findOne({
                    where : {doctorId : id},
                    raw:false,
                    nest:true,
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                    ]
                    
                })
                if(!data) data = {};
                else{
                    resolve({
                        data: data,
                        errCode: 0,
                        message: 'Get extra info successfull'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getProfileDoctorById = (id) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!id)
            {
                resolve({
                    errCode:1,
                    message:'Missing parameter!',
                })
            }
            else{
                let data = await db.User.findOne({
                    where:{
                        id : id,
                    },
                    attributes: {
                        exclude: ['password'],                    
                    },             
                    include:[
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                    ],
                    raw:false,
                    nest:true, 
                })
                
                if(!data)
                {
                    resolve({
                        data: {},
                        errCode: 4,
                        message:'Get profile failed.'
                    })
                }
                else{
                    if(data.image)
                    {
                        data.image = new Buffer(data.image,'base64').toString('binary');
                        resolve({
                            data: data,
                            errCode: 0,
                            message:'Get profile success.'
                        })
                    }
                    else{
                        resolve({
                            data: {},
                            errCode: 3,
                            message:'Error from image.'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getListPatient = (id, date) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!id || !date) {
                resolve({
                    errCode:1,
                    message:'Missing parameter!',
                })
            }
            else{
                let data = await db.Booking.findAll({
                    where:{
                        doctorId: id,
                        statusId: 'S2',
                        date:date,
                    },
                    include:[
                        {
                            model: db.User, as: 'patientData', 
                            attributes: ['email', 'firstName', 'lastName','phonenumber','address', 'gender'],
                            include:[
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                            ]
                        },
                        {model: db.Allcode, as: 'timeTypeDataBooking', attributes:['valueVi', 'valueEn']},
                    ],
                    raw:false,
                    nest:true,
                })
                resolve({
                    data:data,
                    errCode : 0,
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let sendRemedy = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.email || !data.patientId || !data.doctorId || !data.img || !data.timeType || !data.date){
                resolve({
                    errCode : 1,
                    message:'Missing parameters.'
                })
            }
            else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId : data.patientId,
                        timeType: data.timeType,
                        statusId : 'S2',
                        date:data.date,
                    },
                    raw:false,
                })
                if(appointment){
                    appointment.statusId = 'S3';
                    await appointment.save();
                    await emailService.sendAttachment(data),
                    await db.History.create({
                        doctorId: data.doctorId,
                        patientId : data.patientId,
                        description: data.description,
                        file: data.img,
                    })
                    resolve({
                    errCode : 0,
                    message: 'Send email successfull',
                    })
                }
                
                
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    saveDetailInfoDoctor:saveDetailInfoDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateScheduleService:bulkCreateScheduleService,
    getScheduleDoctor:getScheduleDoctor,
    getExtraInfoDoctorById:getExtraInfoDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    getListPatient:getListPatient,
    sendRemedy:sendRemedy,
}