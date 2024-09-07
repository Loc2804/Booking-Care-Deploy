import React, { Component } from 'react';
import { FormattedMessage,injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';

class ModalEditUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id:'',
            email:'',
            password: '',
            firstName: '',
            lastName: '',
            address:'',
            phonenumber:'',
            gender:'',
            roleId:'',
        }
    }

    componentDidMount() {   
        let user = this.props.currentUser; // === let {user = this.props}
        if(user && !_.isEmpty(user))
        {
            this.setState({
                id:user.id,
                email:user.email,
                password:'nothingtoshare',
                firstName: user.firstName,
                lastName: user.lastName,
                address:user.address,
                phonenumber:user.phonenumber,
                gender:user.gender,
                roleId:user.roleId,
            })
        }
    }

    toggle = ()=>{
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id)=>{
        //good code -> modify thông qua biến trung gian
        let copyState = { ...this.state}; //copy lại nguyên state ở trên
        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () =>{
        let isValid = true;
        let arrInput =['email', 'password', 'firstName', 'lastName', 'address', 'phonenumber'];
        for(let i=0; i<arrInput.length; i++)
        {
            if(!this.state[arrInput[i]]) //this.state['email'] === this.state.email
            {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () =>{
        let isValid = this.checkValidateInput();
        if(isValid === true)
        {
            //call api
            this.props.editUser(this.state); //con sử dụng hàm của cha
        }
    }

    render() {
        const { intl } = this.props;
        return (
            <div> 
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={() => {this.toggle()}} 
                className='modal-user-container'
                size="lg"
                centered='true'
            >
              <ModalHeader toggle={() => {this.toggle()}}><FormattedMessage id="modal.edit"></FormattedMessage></ModalHeader>
              <ModalBody>
              <div class="container">
                <div class="row">    
                    <div class="form-group col-6">
                        <label for="inputEmail4">Email</label>
                        <input type="email" 
                            class="form-control" 
                            id="email" 
                            placeholder="Email" 
                            name="email"
                            onChange={(event)=>{this.handleOnChangeInput(event,"email")}}
                            value={this.state.email}
                            disabled='true'
                        />
                    </div>
                    <div class="form-group col-6">
                        <label for="inputPassword4"><FormattedMessage id="manage-user.password"></FormattedMessage></label>
                        <input type="password" 
                            class="form-control" 
                            id="password" 
                            placeholder="Password" 
                            name="password"
                            onChange={(event)=>{this.handleOnChangeInput(event,"password" )}}
                            value={this.state.password}
                            disabled='true'
                        />
                    </div>
                </div>

                <div class="row"> 
                    <div class="form-group col-6">
                        <label for="inputFirstName"><FormattedMessage id="manage-user.firstname"></FormattedMessage></label>
                        <input type="text" 
                        class="form-control"
                            id="firstName" 
                            placeholder="First Name" 
                            name="firstName"
                            onChange={(event)=>{this.handleOnChangeInput(event,"firstName")}}
                            value={this.state.firstName}
                        />
                    </div>
                    <div class="form-group col-6">
                        <label for="inputLastName"><FormattedMessage id="manage-user.lastname"></FormattedMessage></label>
                        <input type="text" 
                        class="form-control"
                            id="lastName" 
                            placeholder="Last Name" 
                            name="lastName"
                            onChange={(event)=>{this.handleOnChangeInput(event,"lastName")}}
                            value={this.state.lastName}
                        />
                    </div>
                </div>

                <label for="inputAddress"><FormattedMessage id="manage-user.address"></FormattedMessage></label>
                <input type="text" 
                    class="form-control" 
                    id="inputAddress" 
                    placeholder="1234 Main St" 
                    name="address"
                    onChange={(event)=>{this.handleOnChangeInput(event,"address")}}
                    value={this.state.address}
                />
                <div class="row"> 
                    <div class="form-group col-4">
                        <label for="inputPhoneNumber"><FormattedMessage id="manage-user.phone"></FormattedMessage></label>
                        <input type="text" 
                            class="form-control"
                            id="phonenumber" 
                            placeholder="0914xxxxxx" 
                            name="phonenumber"
                            onChange={(event)=>{this.handleOnChangeInput(event,"phonenumber")}}    
                            value={this.state.phonenumber}
                        />
                    </div>
                    <div class="form-group col-4">
                        <label for="inputState"><FormattedMessage id="manage-user.gender"></FormattedMessage></label>
                        <select id="gender" class="form-control" name="gender" value={this.state.gender}
                            onChange={(event)=>{this.handleOnChangeInput(event,"gender")}}
                        >
                            <option value="1">{intl.formatMessage({ id: 'manage-user.male' })}</option>
                            <option value="0">{intl.formatMessage({ id: 'manage-user.female' })}</option>
                        </select>
                    </div>
                    <div class="form-group col-4">
                        <label for="inputZip"><FormattedMessage id="modal.role"></FormattedMessage></label>
                        <select id="roleId" class="form-control" name="roleID" value={this.state.roleId}
                            onChange={(event)=>{this.handleOnChangeInput(event,"roleId")}}
                        >
                            <option value="R1">{intl.formatMessage({ id: 'modal.admin' })}</option>
                            <option value="R2">{intl.formatMessage({ id: 'modal.doctor' })}</option>
                            <option value="R3">{intl.formatMessage({ id: 'modal.patient' })}</option>
                        </select>
                    </div> 
                </div>
              </div>
              </ModalBody>
              <ModalFooter>
                <Button className='btn-save-changes' color="primary" onClick={() => this.handleSaveUser()}><FormattedMessage id="modal.save"></FormattedMessage></Button>
                <Button className='btn-cancel' color="secondary" onClick={() => {this.toggle()}}><FormattedMessage id="modal.cancel"></FormattedMessage></Button>
              </ModalFooter>
            </Modal>
          </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ModalEditUser));


