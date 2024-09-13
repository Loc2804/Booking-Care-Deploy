import { raw } from "body-parser";
import db from "../models/index"
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email,password) =>{
    return new Promise(async(resolve,reject) => {
        try {
            let userData = {};
            let isExisted = await checkUserEmail(email);
            if(isExisted)
            {
                let user = await db.User.findOne({
                    where: {email : email},
                    attributes:['id','email', 'firstName','lastName','roleId','password'],
                    raw: true,       
                });
                if(user)
                {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check)
                    {
                        userData.errCode =0;
                        userData.errMessage = 'Login successfull';
                        delete user.password;
                        userData.user = user;
                    }
                    else
                    {
                        userData.errCode =3;
                        userData.errMessage = 'Wrong Password';
                    }
                }
                else{
                    userData.errCode = 2;
                    userData.errMessage = 'User is not existed. Maybe your Email was deleted recently!';         
                }
            }
            else{
                userData.errCode = 1;
                userData.errMessage = 'Your Email is not existed in our system. Please try other email!';
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve,reject) =>{
        try {
            let user = await db.User.findOne({
                where: {email : userEmail},
            }) 
            if(user)
                resolve(true);
            else {
                resolve(false);
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) =>{
    return new Promise(async(resolve,reject) => {
        try {
            let users = null;
            if(userId === 'ALL')
            {
                users = await db.User.findAll({
                    raw: true,
                    attributes: {
                        exclude: ['password'],                    
                    }    
                });
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    raw: true,
                    attributes: {
                        exclude: ['password'],                    
                    }  
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve,reject) =>{
        try {
            let check = await checkUserEmail(data.email);
            if(check === true)
            {
                resolve({
                    errCode:1,
                    message:'Your email is existed. Please try with another email.'
                });
                return;
            }
            let hashPasswordFromBycript = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBycript,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                roleId: data.role,
                positionId:data.position,
                image: data.avatar,
            });     
             resolve({
                errCode: 0,
                message: 'Create a new user successfull'
             })
        }catch (error) {
            reject(error);
        }
    })
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

let deleteUser = (userId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(!user)
            {
                resolve({
                    errCode:2,
                    message:'The user is not existed.'
                })
                return;
            }
            //user.destroy() -> xóa nhưng user phải là 1 instance của sequelize -> kéo db lên nodejs và xóa
            await db.User.destroy({ //dùng hàm như này -> hạn chế lỗi raw -> đi thẳng vào db và xóa
                where: {id:userId} 
            })
            resolve({
                errCode: 0,
                message:'The user is deleted',
            })
        } catch (error) {
            reject(error);
        }
    })
}

let updateUser = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender)
                resolve({
                    errCode:2,
                    message:'Missing required parameters.'
                })
            let user = await db.User.findOne({
                where : { id : data.id},
                raw: false,
            });
            if(user)
            {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.image = data.avatar,
                await user.save();
                
                resolve({
                    errCode:0,
                    message:'Update user successfull.'
                });
            }
            else{
                resolve({
                    errcode:1,
                    message:'User is not found.'
                });
            }           
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput)=>{
    return new Promise(async(resolve,reject) =>{
        try {
            let res ={};
            if(!typeInput)
            {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters.'
                })
            }
            else{
                let allcode = await db.Allcode.findAll({
                    where: {type : typeInput},
                });
                res.errCode = 0;
                res.data = allcode;
            }
            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}
let handleChangePassword = (data) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            if(!data.email || !data.current || !data.new){
                resolve({
                    errCode:1,
                    message:'Missing parameters',
                })
            }
            else{
                let isExisted = await checkUserEmail(data.email);
                if(isExisted)
                {
                    let user = await db.User.findOne({
                        where: {email : data.email},
                        attributes:['id','email','password'],
                        raw: false,       
                    });
                    if(user)
                    {
                        let check = await bcrypt.compareSync(data.current, user.password);
                        if(check)
                        {
                            let newPassword = await hashUserPassword(data.new);
                            user.password = newPassword;
                            try {
                                await db.User.update({ password: newPassword }, { where: { id: user.id } });
                                resolve({
                                    errCode: 0,
                                    message: 'Change password success.',
                                });
                            } catch (error) {
                                reject({
                                    errCode: 2,
                                    message: 'Error while saving new password.',
                                });
                            }
                            resolve({
                                errCode: 0,
                                message: 'Change password success',
                            })
                        }
                        else{
                            resolve({
                                errCode: 0,
                                message: 'Your current password is incorrect. Please check again!',
                            })
                        }
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser:updateUser,
    getAllCodeService:getAllCodeService,
    handleChangePassword:handleChangePassword,
}