import bcrypt from 'bcryptjs'
import db from '../models/index';
import { raw } from 'body-parser';

var salt = bcrypt.genSaltSync(10);
let createNewUser = async(data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            let hashPasswordFromBycript = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBycript,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender ==="1" ? true : false,
                roleId: data.roleId,
            });
            resolve('Create new User successfull');
        } catch (error) {
            reject(error);
        }
    });
}
let hashUserPassword = (password)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = async() =>{
    return new Promise(async(resolve,reject) =>{
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserInfoById = async(userId) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where : { id : userId},
                raw: true,
            });
            if(user)
            {
                resolve(user);
            }
            else{
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData = async(data)=>{
    return new Promise(async(resolve,reject) =>{
        try {
            let user = await db.User.findOne({
                where : { id : data.id},
                raw:false
            });
            if(user)
            {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
            }
            else{
                resolve();
            }           
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUserById = (id) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : { id : id},
            });
            if(user)
            {
                await db.User.destroy({ //dùng hàm như này -> hạn chế lỗi raw -> đi thẳng vào db và xóa
                    where: {id:id} 
                })
                let data = db.User.findAll();
                resolve(data);
            }
            else
            {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
}
module.exports ={
    createNewUser: createNewUser,
    getAllUser:  getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData:updateUserData,
    deleteUserById : deleteUserById,
}

