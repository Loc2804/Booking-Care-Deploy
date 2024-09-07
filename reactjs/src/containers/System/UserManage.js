import React, { Component } from 'react';
import { FormattedMessage,injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import './UserManager.scss'
import { getAllUsers } from '../../services/userService';
import ModalUser from './ModalUser';
import ConfirmModal from '../../components/ConfirmModal';
import { createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import { emitter } from '../../utils/emitter';
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUserFromDB();
    }

    //các function để handle event -> dùng arrow function -> rườm rà
    handleAddNewUser =()=>{
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal =()=>{
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
            
        })
    }
    toggleUserEditModal =() =>{
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    getAllUserFromDB = async() =>{
        let response = await getAllUsers('ALL');
        if(response && response.errCode ===0)
        {
            this.setState({
                arrUsers : response.users,
            })
        }
    }

    createNewUser = async(data)=>{
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !==0)
            {
                alert(response.message);
            }
            else
            {
    
                await this.getAllUserFromDB();
                this.setState({
                    isOpenModalUser:false,
                })
                // fire event -> cha phát event -> dùng hàm emit
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    handleDeleteUser = async(item)=>{
        try {
            let response = await deleteUserService(item.id)
            if(response && response.errCode === 0)
            {
                await this.getAllUserFromDB();  
                alert(response.message);  
            }
            else
                alert(response.message);
            
        } catch (error) {
            console.log(error);
        }
    }

    handleEditUser = (user) =>{
        this.setState({
            isOpenModalEditUser:true,
            userEdit : user,
        })
    }

    doEditUser = async(user) =>{
        let res = await editUserService(user);
        try {
            if(res && res.errCode ===0)
                {
                    await this.getAllUserFromDB();
                    
                    this.setState({
                        isOpenModalEditUser:false,
                    })
                }
                else
                    alert(res.errCode +': '+ res.message);
        } catch (error) {
            console.log(error);
        }
        
    }

    render() {
        let arrUsers = this.state.arrUsers;
        const { intl } = this.props;
        return (
            <div className="users-center">
                <ModalUser
                    isOpen ={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser = {this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen ={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        editUser = {this.doEditUser}
                        currentUser ={this.state.userEdit}
                    />
                }
               <div className='title text-center'>
                    <FormattedMessage id="manage-user.title"></FormattedMessage>
               </div>
               <div className='mx-2'>
                    <button className='btn btn-primary px-3' onClick={()=>this.handleAddNewUser()}>
                        <i className="fas fa-plus m-2"></i>
                        <FormattedMessage id="manage-user.add"></FormattedMessage>
                    </button>
               </div>
               <div className='users-table mt-4 mx-2'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th><FormattedMessage id="manage-user.firstname"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.lastname"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.address"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.gender"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.action"></FormattedMessage></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            arrUsers && arrUsers.map((item,index) =>{
                                return(
                                    <tr>  
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>{item.gender === 'F'? intl.formatMessage({ id: 'manage-user.female' }) : intl.formatMessage({ id: 'manage-user.male' })}</td>
                                        <td>
                                            <button className="btn-edit"
                                                onClick={()=> this.handleEditUser(item)}>
                                                <i className="fas fa-pencil-alt btn-edit"></i>
                                            </button>
                                            <button className="btn-delete" 
                                                onClick={()=> this.handleDeleteUser(item)}>
                                                <i className="fas fa-trash btn-delete"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
               </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserManage));
