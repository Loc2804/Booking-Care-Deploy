import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import './RemedyModal.scss';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
import {CommonUtils} from '../../../utils';

class RemedyModal extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            email:'',
            imgBase64:'',
            description:'',
        }
        this.fileInputRef = React.createRef();
    }
    
    async componentDidMount() {
        if(this.props.data){
            this.setState({
                email : this.props.data.email,
            })
        }
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.data !== this.props.data){
            this.setState({
                email : this.props.data.email,
            })
        }
        
    }
    toggle = () =>{
        this.props.closeModal();
        this.setState({
            imgBase64: '',
        })
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = '';
        }
    }
    handleSendEmail = () =>{
        this.props.sendRemedy(this.state);
    }
    handleOnChangeFile =  async (event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file)
        {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64,
            })
        }

    }
    handleOnChangeEmail=(event) =>{
        this.setState({
            email: event.target.value,
        })
    }
    handleOnChangeDescription = (event) => {
        this.setState({
            description: event.target.value,
        })
    }
    render() {     
        let {isOpenModalRemedy, data} = this.props;
        let doctorId = '';
        let {language} = this.props;
        if(data && !_.isEmpty(data))
        {
            doctorId = data.doctorId;
        }
        return (
            <Fragment> 
                <Modal
                    isOpen={isOpenModalRemedy} 
                    toggle={() => {this.toggle()}} 
                    className='remedy-modal-container'
                    size="lg"
                    centered
                    //backdrop={true}
                >
                    <ModalHeader toggle={this.toggle}>{language === LANGUAGES.VI ? 'Gửi hóa đơn khám bệnh':'Send email for patient'}</ModalHeader>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label htmlFor="">{language === LANGUAGES.VI ? 'Email bệnh nhân':`Patient's email`}</label>
                                <input type="email" value={data.email} className='form-control' disabled
                                     onChange={(event) => this.handleOnChangeEmail(event)}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label htmlFor="">{language === LANGUAGES.VI ? 'File hóa đơn':`Bill file`}</label>
                                <input type="file" className='form-control-file'
                                    onChange={(event) => this.handleOnChangeFile(event)}
                                    ref={this.fileInputRef}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label htmlFor="">{language === LANGUAGES.VI ? 'Chi tiết':`Description`}</label>
                                <input type="email" value={this.state.description} className='form-control' 
                                     onChange={(event) => this.handleOnChangeDescription(event)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendEmail()}>{language === LANGUAGES.VI ? 'Xác nhận':'Confirm'}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>{language === LANGUAGES.VI ? 'Hủy bỏ':'Cancel'}</Button>
                    </ModalFooter>
                </Modal> 
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
        genders : state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
