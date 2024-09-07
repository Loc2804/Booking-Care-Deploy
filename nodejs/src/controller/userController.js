import userService from "../services/userService"

let handleLogin = async (req,res) =>{
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password)
    {
        return res.status(500).json({
        errCode : 1,
        message: 'Login Error. Let fill full infomation in the fields.',
        email: email,
        }); 
    }
    let userData = await userService.handleUserLogin(email,password);
    return res.status(200).json({
        errCode : userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {'Error' : "User is undefined"},
    }); //200: chạy bth, 500: lỗi
}

let handleGetAllUser = async(req,res) =>{
    let id = req.query.id; //ALL || id
    if(!id)
    {
        return res.status(500).json({
            errCode : 1,
            message: 'Missing required parameters.',
            users: []
            }); 
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message : 'OK',
        users
    })
}

let handleCreateNewUser = async(req,res) =>{
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleEditUser = async(req,res) =>{
    let data = req.body; 
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}
// lỗi is not a function xảy ra do để raw: true ở file config.json hoặc ở đâu đó trong hàm xóa, tương tự đối với hàm update...
let handleDeleteUser = async(req,res) =>{
    if(!req.body)
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required parameters.'
        })
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode =async(req,res) =>{
    try {
        let type = req.query.type;
        let data = await userService.getAllCodeService(type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('Get all code error: ',error);
        return res.status(200).json({
            errCode: -1,
            message:'Error from server!'
        })
    }
}
module.exports = {
    handleLogin : handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser:  handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode:getAllCode,
}