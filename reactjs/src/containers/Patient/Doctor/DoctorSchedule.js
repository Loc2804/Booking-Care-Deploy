import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../containers/System/UserManage';
// import UserRedux from '../containers/System/Admin/UserRedux';
// import Header from '../containers/Header/Header';
// import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss';
import { getDetailInfoDoctor, getScheduleDoctorByDate } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import Select from 'react-select';
import localiztion from 'moment/locale/vi';
import moment, { lang } from 'moment';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class DoctorSchedule extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            allDays : [],
            allAvailableTime : [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        }
    }
    capitalizerFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    async componentDidMount() {
        let {language} = this.props;
        let allDays = this.setArrDate(language);
        if(allDays && allDays.length > 0)
        {
            this.setState({
                allDays: allDays,
            })
        }
        if(this.props.doctorId){
            let res = await getScheduleDoctorByDate(this.props.doctorId,allDays[0].value);
            this.setState({
                allAvailableTime : res.data ? res.data :[],
            })
        }
    
        
        
    }
    setArrDate = (lang) =>{
        let arrDate = [];
        for(let i=0;i<7;i++)
        {
            let obj = {};
            if(lang === LANGUAGES.VI)
            {
                let labelVi =  moment(new Date()).add(i,'days').format('dddd - DD/MM');
                obj.label = this.capitalizerFirstLetter(labelVi);
            }
            else{
                obj.label = moment(new Date()).add(i,'days').locale('en').format('ddd - DD/MM');
            }
            obj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            arrDate.push(obj);
        }
        return arrDate;
    }
    

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language)
        {
            let allDays = this.setArrDate(this.props.language);
            this.setState({
                allDays: allDays,
            })
        }
        if(this.props.doctorId !== prevProps.doctorId)
        {
            let res = await getScheduleDoctorByDate(this.props.doctorId,this.state.allDays[0].value);
            this.setState({
                allAvailableTime : res.data ? res.data :[],
            })
        }
        
    }

    handleOnChangeSelect = async(event) =>{
        if(this.props.doctorId && this.props.doctorId !== -1){
            let doctorId = this.props.doctorId;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId,date);

            if(res && res.errCode === 0)
            {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                })
            }
        }
    }

    handleClickScheduleTime = (time) =>{
        this.setState({
            isOpenModalBooking:true,
            dataScheduleTimeModal: time,
        })
    }

    closeModalBooking =() =>{
        this.setState({
            isOpenModalBooking:false,
        })
    }
    render() {     
        let {language} = this.props;
        let allDays = this.state.allDays;
        let allAvailableTime = this.state.allAvailableTime;
        return (
            <Fragment> 
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0
                                && allDays.map((item,index) =>{
                                    return (
                                        <option value={item.value} label={item.label} key={index}></option>     
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i class="fas fa-calendar-alt"><span className=''><b><FormattedMessage id="manage-schedule.schedule"/></b></span></i>     
                        </div>
                        <div className='time-content'>
                            
                            {allAvailableTime && allAvailableTime.length > 0 ?
                            <>
                                <div className='time-content-btns'>
                                    { allAvailableTime.map((item,index) =>{
                                        let timeDislay = language === LANGUAGES.VI? item.timeTypeData.valueVi: item.timeTypeData.valueEn
                                            return(
                                                <button key={index} className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                    onClick ={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDislay}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                                
                                <div className='book-free-title'>
                                    <span>
                                        <FormattedMessage id="manage-schedule.choose"/> 
                                        <i class="far fa-hand-pointer"></i> 
                                        <FormattedMessage id="manage-schedule.book-free"/> 
                                    </span>
                                </div>
                            </>
                                : <div className='no-schedule-announce'><FormattedMessage id="manage-schedule.announce"/></div>
                            }
                           
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModalBooking = {this.state.isOpenModalBooking}
                    closeModal = {this.closeModalBooking}
                    data = {this.state.dataScheduleTimeModal}
                    closeLoadingLayout ={this.props.closeLoadingLayout}
                    openLoadingLayout ={this.props.openLoadingLayout}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
