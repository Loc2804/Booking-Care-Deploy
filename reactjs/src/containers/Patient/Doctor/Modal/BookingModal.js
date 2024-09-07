import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import DatePicker from '../../../../components/Input/DatePicker';
import './BookingModal.scss';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import { LANGUAGES } from '../../../../utils';
import * as actions from '../../../../store/actions'
import Select from 'react-select';
import { postPatientBookingAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

class BookingModal extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            fullname:'',
            phonenumber:'',
            email:'',
            address:'',
            reason:'',
            birthday:'',
            selectedGender:'',
            doctorId:'',
            genders: [],
            timeType: '',
            isShowLoading: '',
        }
    }
    
    async componentDidMount() {
        this.props.fetchGender();
    }
    
    buildDataGender = (data) =>{
        let result = [];
        let language = this.props.language;

        if(data && data.length > 0){
            data.map((item) =>{
                let obj = {};
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                obj.value = item.keyMap;
                result.push(obj);
            })
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let language = this.props.language;
        if(prevProps.genders !== this.props.genders)
        {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }
        if(prevProps.language !== this.props.language){
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }
        if(this.props.data !== prevProps.data)
        {
            if(this.props.data && !_.isEmpty(this.props.data)){
                let doctorId = this.props.data.doctorId;
                this.setState({
                    doctorId: doctorId,
                    timeType:this.props.data.timeType,
                })
            }
        }
    }
    
    handleOnChangeInput = (event, id) =>{
        let valueInput = event.target.value;
        let copyState = {...this.state};
        copyState[id] = valueInput;
        this.setState({
            ...copyState,
        })
    }

    setStateDefault =() =>{
        this.props.closeModal();
        this.setState({
            fullname:'',
            phonenumber:'',
            email:'',
            address:'',
            reason:'',
            birthday:'',
            selectedGender:{},
        })
    }

    handleOnChangeDatePicker =(date) =>{
        this.setState({
            birthday: date[0],
        })
    }

    handleOnChangeSelect = (selectedGender) =>{
        this.setState({
            selectedGender: selectedGender,
        })
    }
    capitalizerFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    buildTimeBooking =(dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime))
        {
            let date = language === LANGUAGES.VI ? 
                    this.capitalizerFirstLetter(moment.unix(+dataTime.date/ 1000).format('dddd - DD/MM/YYYY')) :
                    this.capitalizerFirstLetter(moment.unix(+dataTime.date/ 1000).locale('en').format('dddd - MM/DD/YYYY'));
            let time = language ===LANGUAGES.VI?
                    dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            return `${time} - ${date}`
            
        }
        return <></>
    }
    buildDoctorName =(dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime))
        {
            let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            return name;
        }
        return <></>
    }
    handleConfirmBooking = async() =>{
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.data);
        let doctorName = this.buildDoctorName(this.props.data);
        this.props.openLoadingLayout();
        let res = await postPatientBookingAppointment({
            fullname:this.state.fullname,
            phonenumber:this.state.phonenumber,
            email:this.state.email,
            address:this.state.address,
            reason:this.state.reason,
            date:this.props.data.date,
            birthday:date,
            selectedGender:this.state.selectedGender.value,
            doctorId:this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName:doctorName,
        })
        if(res && res.errCode === 0)
        {
            toast.success(res.message);
            this.props.closeLoadingLayout();
            this.setStateDefault();
        }
        else
        {
            this.props.closeLoadingLayout();
            toast.error(res.message);
        }
    }
    render() {     
        let {isOpenModalBooking, data} = this.props;
        let doctorId = '';
        let {language} = this.props;
        if(data && !_.isEmpty(data))
        {
            doctorId = data.doctorId;
        }
        return (
            <Fragment> 
                <Modal
                    isOpen={isOpenModalBooking} 
                    //  toggle={() => {this.toggle()}} 
                    className='booking-modal-container'
                    size="lg"
                    centered='true'
                    //backdrop={true}
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>
                                <FormattedMessage id="booking-modal.title"/>
                            </span>
                            <span className='right' onClick={() => this.setStateDefault()}>
                                <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body container'>
                            {/* {JSON.stringify(data)} */}
                            <div className='doctor-info'>
                                <ProfileDoctor
                                    doctorId = {doctorId}
                                    isShowDescriptionDoctor= {false}
                                    dataTime = {this.props.data}
                                />
                            </div>
                            
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.fullname"/></label>
                                    <input type="text" className='form-control' 
                                        value={this.state.fullname}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullname')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.phone"/></label>
                                    <input type="text" className='form-control' 
                                        value={this.state.phonenumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.email"/></label>
                                    <input type="text" className='form-control' 
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    /> 
                                </div>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.address"/></label>
                                    <input type="text" className='form-control' 
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.reason"/></label>
                                    <input type="text" className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.birthday"/></label>
                                    <DatePicker className='form-control'
                                        onChange = {this.handleOnChangeDatePicker}
                                        value = {this.state.birthday}
                                        
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label htmlFor=""><FormattedMessage id="booking-modal.gender"/></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleOnChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn btn-primary btn-booking-confirm' onClick={() => this.handleConfirmBooking()}><FormattedMessage id="booking-modal.yes"/></button>
                            <button className='btn btn-booking-cancel' onClick={() => this.setStateDefault()}><FormattedMessage id="booking-modal.no"/></button>
                        </div>
                    </div>
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
        fetchGender : () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
