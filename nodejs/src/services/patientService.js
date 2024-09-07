import { raw } from "body-parser"
import db from "../models/index"
import { where } from "sequelize"
require('dotenv').config();
import _, { includes, reject } from 'lodash';
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) =>{
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

let postBookingAppointment = (data) =>{
    return new Promise(async(resolve,reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullname ){
                resolve({
                    errCode :1 , 
                    message: 'Missing parameters.'
                })
            }
            else{
                let token = uuidv4();
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        phonenumber: data.phonenumber,
                        email: data.email,
                        firstName : data.fullname,
                        gender: data.selectedGender,
                        roleId:'R3',
                        address: data.address,
                    }
                }) //return array gồm user và biến true/false -> lấy data = user[0]
                
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId:data.doctorId, 
                        timeType: data.timeType,
                        date: data.date,
                    }
                })
                if(user && user[0] ){
                    if(!appointment)
                    {
                        await db.Booking.create({    
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId : user[0].id,
                            date: data.date, 
                            timeType: data.timeType,     
                            token: token,      
                            note : data.reason,
                        })
                        await emailService.sendSimpleEmail({
                            email: data.email,
                            patientName: data.fullname,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink:buildUrlEmail(data.doctorId,token),
                        }); 
                        resolve({
                            errCode: 0,
                            message:'Create an appointment successfull. Please check your email to confirm this appointment!',
                        })
                    }
                    else{
                        resolve({
                            errCode: 2,
                            message:'This appointment was booked before!',
                        })
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookingAppointment = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.token || !data.doctorId){
                resolve({
                    errCode:1,
                    message:'Missing parameters!'
                })
            }
            else{
                let appointment = await db.Booking.findOne({
                    where:{ 
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId : 'S1',
                    },
                    raw: false,
                })
                if(appointment){
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode:0,
                        message:'You have confirmed the appointment success.',
                    })
                }
                else{
                    resolve({
                        errCode:2,
                        message:'This appointment is confirmed before or is not existed.',
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookingAppointment:postBookingAppointment,
    postVerifyBookingAppointment:postVerifyBookingAppointment,
}