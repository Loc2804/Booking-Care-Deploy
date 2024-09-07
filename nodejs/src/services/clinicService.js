import { raw } from "body-parser"
import db from "../models/index"
import { where } from "sequelize"
require('dotenv').config();
import _, { includes, reject } from 'lodash';

let createNewClinic = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.imgBase64 || !data.name || !data.address || !data.contentHTML || !data.contentMarkdown){
                resolve({
                    errCode:1,
                    message:'Missing parameters!'
                })
            }
            else{
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image:data.imgBase64,
                    descriptionHTML: data.contentHTML,
                    descriptionMarkdown : data.contentMarkdown,
                })
                resolve({
                    errCode:0,
                    message:'Create clinic successfull'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllClinic = () =>{
    return new Promise(async(resolve,reject) =>{
        try {
            let data = await db.Clinic.findAll();
            if(data && data.length > 0){
                data.map((item) =>{
                    item.image = new Buffer(item.image,'base64').toString('binary');
                    return item;
                })
                resolve({
                    errCode:0,
                    message:'Get data clinics success.',
                    data:data,
                })
            }
            else{
                resolve({
                    errCode:1,
                    message:'Get data clinics failed.'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let  getDetailClinicById = (id) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!id){
                resolve({
                    errCode:1,
                    message:'Missing parameters!'
                })
            }
            else{
                let data = await db.Clinic.findOne({
                    where: {id : id},
                    attributes:['name', 'address' ,'descriptionHTML', 'descriptionMarkdown']
                })
                if(data){
                    let doctorClinic = await db.Doctor_infor.findAll({
                        where : {
                            clinicId : id,
                        },
                        attributes:['doctorId','provinceId']
                    })
                    data.doctorClinic = doctorClinic;

                    resolve({
                        data:data,
                        errCode:0,
                    })
                }
                else{
                    resolve({
                        data:{},
                        errCode:1,
                        message:'Failed.'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports ={
    createNewClinic:createNewClinic,
    getAllClinic: getAllClinic,

    getDetailClinicById:getDetailClinicById,
}