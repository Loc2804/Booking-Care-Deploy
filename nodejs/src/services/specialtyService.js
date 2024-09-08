import { raw } from "body-parser"
import db from "../models/index"
import { where } from "sequelize"
require('dotenv').config();
import _, { includes, reject } from 'lodash';
import { Buffer } from 'buffer';

let createNewSpecialty = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.imgBase64 || !data.nameVi  || !data.nameEn || !data.contentHTML || !data.contentMarkdown){
                resolve({
                    errCode:1,
                    message:'Missing parameters!'
                })
            }
            else{
                await db.Specialty.create({
                    nameVi:data.nameVi,
                    nameEn:data.nameEn,
                    image:data.imgBase64,
                    descriptionHTML: data.contentHTML,
                    descriptionMarkdown : data.contentMarkdown,
                })
                resolve({
                    errCode:0,
                    message:'Create specialty successfull'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllSpecialty = () =>{
    return new Promise(async(resolve,reject) =>{
        try {
            let data = await db.Specialty.findAll();
            if(data && data.length > 0){
                data.map((item) =>{
                    item.image = Buffer.from(item.image,'base64').toString('binary');
                    return item;
                })
                resolve({
                    errCode:0,
                    message:'Get data specialties success.',
                    data:data,
                })
            }
            else{
                resolve({
                    errCode:1,
                    message:'Get data specialties failed.'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailSpecialtyById = (id,location)=>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!id || !location){
                resolve({
                    errCode:1,
                    message:'Missing parameters!'
                })
            }
            else{
                let data = await db.Specialty.findOne({
                    where: {id : id},
                    attributes:['descriptionHTML', 'descriptionMarkdown']
                })
                if(data){
                    let doctorSpecialty = [];
                    if(location === 'ALL'){
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where : {specialtyId : id},
                            attributes:['doctorId', 'provinceId']
                        })
                        data.doctorSpecialty = doctorSpecialty;
                    }
                    else{
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where : {
                                specialtyId : id,
                                provinceId : location,
                            },
                            attributes:['doctorId', 'provinceId']
                        })
                        data.doctorSpecialty = doctorSpecialty;
                    }
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
module.exports = {
    createNewSpecialty:createNewSpecialty,
    getAllSpecialty:getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById,
}