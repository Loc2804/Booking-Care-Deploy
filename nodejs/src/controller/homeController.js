import db from '../models/index'
import  CRUDService from '../services/CRUDService';

let getHomePage = async(req, res) =>{
    try {
        let data = await db.User.findAll();
        console.log('---------------');
        //console.log(data);
        console.log('---------------');
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }     
}

let  getCRUD = (req,res)=>{
    res.render('crud.ejs');
}

let postCRUD = async(req, res) =>{
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);   
    return res.send('post crud from server');
}

let displayGetCRUD = async(req,res) =>{
    let data = await CRUDService.getAllUser();
    // console.log('---------------------');
    // console.log(data);
    // console.log('---------------------');
    return res.render('displayCRUD.ejs',{
        dataTable: data,
    });
}
let getEditCRUD = async(req,res) =>{
    let userId = req.query.id;
    if(userId)
    {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs',{
            userData: userData,
        });
    }
    else
    {
        return res.send("User not found!");
    }
}

let putCRUD = async(req,res) =>{
    let data = req.body; 
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable : allUser,
    });
}

// lỗi is not a function xảy ra do để raw: true ở file config.json hoặc ở đâu đó trong hàm xóa
let deleteCRUD = async(req,res) =>{
    let id = req.query.id; 
    let userData = await CRUDService.deleteUserById(id);
    return res.render('displayCRUD.ejs', {
        dataTable : userData,
    });
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD:deleteCRUD,
}