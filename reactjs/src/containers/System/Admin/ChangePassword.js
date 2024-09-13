import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import * as actions from "../../../store/actions";
import './ChangePassword.scss';
import { FormattedMessage } from 'react-intl';
import {LANGUAGES} from  '../../../utils';
import { handleSaveChangePassword } from '../../../services/userService';
import { toast } from 'react-toastify';

class ChangePassword extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            current: '',
            new : '',
            again: '',
            isShowPassword : false,
        }
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }
    handleOnChangeSelect = (event, id) =>{
        let copyState = this.state;
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }
    clearInput = () =>{
        this.setState({
            current: '',
            new : '',
            again: '',
            isShowPassword : false,
        })
    }
    handleChangePassword = async() =>{
        let {userInfo} = this.props;
        let current = this.state.current;
        let newPassword = this.state.new;
        let again = this.state.again;
        if(current === newPassword){
            toast.error('Your current password and your new passowrd is equal. Please choose your new passowrd !');
            return;
        }
        else{
            if(newPassword === again){
                let res = await handleSaveChangePassword({
                    email : userInfo.email,
                    new : newPassword,
                    current: current,
                })
                if(res && res.errCode === 0){
                    toast.success(res.message);
                    this.clearInput();
                    alert('After 10 seconds you will logout because your password was changed ! Please sign in again !');
                    setTimeout(() =>{
                        this.props.logOut();
                    },10000);
                }
            }
            else{
                toast.error('Check your password and your again password ! They are not equal !');
            }
        }
    }
    handleShowHidePassword = () =>{
        this.setState({
            isShowPassword : !this.state.isShowPassword,
        })
    }
    render() {     
        let {userInfo, language} = this.props;
        return (
            <Fragment> 
                <div className='container change-password-container'>
                    <div className='row change-password-content'>
                        <div className='col-7 form-group'>
                            <label htmlFor="">{language === LANGUAGES.VI ? 'Mật khẩu hiện tại' : 'Current Password'}</label>
                            <div className='custom-input-password'>
                                <input 
                                    type={this.state.isShowPassword === true ? 'text' : 'password'} className='form-control' onChange={(event) => this.handleOnChangeSelect(event,'current')} 
                                    value = {this.state.current}
                                />
                                <span onClick={() => {this.handleShowHidePassword()}}> 
                                    <i className= {this.state.isShowPassword? 'far fa-eye' : 'far fa-eye-slash'}></i> 
                                </span>
                            </div>  
                        </div>
                        <div className='col-7 form-group'>
                            <label htmlFor="">{language === LANGUAGES.VI ? 'Mật khẩu mới' : 'New Password'}</label>
                            <div className='custom-input-password'>
                                <input type={this.state.isShowPassword === true ? 'text' : 'password'} className='form-control' 
                                    onChange={(event) => this.handleOnChangeSelect(event,'new')}
                                    value = {this.state.new}
                                />
                                <span onClick={() => {this.handleShowHidePassword()}}> 
                                    <i className= {this.state.isShowPassword? 'far fa-eye' : 'far fa-eye-slash'}></i> 
                                </span>
                            </div>
                        </div>
                        <div className='col-7 form-group'>
                            <label htmlFor="">{language === LANGUAGES.VI ? 'Nhập lại mật khẩu mới' : 'New Password Again'}</label>
                            <div className='custom-input-password'>
                                <input  type={this.state.isShowPassword === true ? 'text' : 'password'} className='form-control' 
                                    onChange={(event) => this.handleOnChangeSelect(event,'again')}
                                    value = {this.state.again}
                                />
                                <span onClick={() => {this.handleShowHidePassword()}}> 
                                    <i className= {this.state.isShowPassword? 'far fa-eye' : 'far fa-eye-slash'}></i> 
                                </span>
                            </div>
                            
                        </div>
                        <div className='col-12 button-submit'>
                            <button className='btn btn-primary' onClick={() => this.handleChangePassword()}>{language === LANGUAGES.VI ? 'Xác nhận' : 'Submit'}</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
        userInfo : state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logOut : () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
