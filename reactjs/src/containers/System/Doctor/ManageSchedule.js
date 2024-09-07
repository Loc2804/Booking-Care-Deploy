import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../../Header/Header';
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES , dateFormat} from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import FormattedDate from '../../../components/Formating/FormattedDate'
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props)
    {
        
        super(props);
        this.state = {
            allDoctors: [],
            selectedDoctor:'',
            currentDate: '',
            time: [],
        }
    }
    buildDataInputSelect = (data) =>{
        let result = [];
        let {language} = this.props; //let language = this.props.language
        if(data && data.length > 0)
        {
            data.map((item,index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }
    componentDidMount(){
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllTimeRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if(prevProps.allDoctor !== this.props.allDoctor)
        {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
            this.setState({
                allDoctors: dataSelect,
            })
        }
        if(prevProps.language !== this.props.language)
        {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
            this.setState({
                allDoctors: dataSelect,
            })
        }
        if(prevProps.time !== this.props.time)
        {
            let data = this.props.time;
            if(data && data.length >0)
            {
                data.map(item => {
                    item.isSelected = false;
                    return item;
                })

                // tương tự như trên
                // let data = data.map(item =>({...item, isSelected: false}));
            }
            this.setState({
                time: data,
            })
        }
    }

    handleOnChangeSelect = async(selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });
    };

    handleOnChangeDatePicker =(date) =>{
        this.setState({
            currentDate : date[0],
        })
    }

    handleClickBtnTime = (timeItem) =>
    {
        let time = this.state.time;
        if(time && time.length > 0)
        {
            time = time.map(item => {
                if(item.id === timeItem.id)
                {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
            this.setState({
                time: time,
            })
        }
    }

    handleSaveSchedule = async() =>{
        let {time, selectedDoctor, currentDate} = this.state;
        let result = [];
        if(!selectedDoctor && _.isEmpty(selectedDoctor))
        {
            toast.error('Invalid selected doctor. Choose doctor!');
            return;
        }
        if(!currentDate){
            toast.error('Invalid date. Choose your date!');
            return;
        }   
        // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        // let formattedDate = moment(currentDate).unix();
        let formattedDate = new Date(currentDate).getTime();

        if(time && time.length > 0)
        {
            let selectedTime = time.filter(item => item.isSelected === true);
            if(selectedTime && selectedTime.length > 0)
            {
                selectedTime.map(item => {
                    let object ={};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                })
            }
            else{
                toast.error('Invalid selected time. Choose your time!');
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: '' + formattedDate,
        });
        if(res.errCode === 0) toast.success(res.message);
        else toast.error(res.message);
        console.log('Check result:' , res.message);
    }

    render() {     
        let {allDoctors} = this.state;
        let time = this.state.time;
        let {language} = this.props;
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title"/>
                </div>
                <div className='container mt-3'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label htmlFor=""> <FormattedMessage id="manage-schedule.choose-doctor"/></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleOnChangeSelect}
                                options={allDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label htmlFor=""> <FormattedMessage id="manage-schedule.choose-date"/></label>
                            <DatePicker className='form-control'
                                onChange = {this.handleOnChangeDatePicker}
                                value = {this.state.currentDate}
                                minDate = {new Date().setHours(0, 0, 0, 0)}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {time && time.length > 0 &&
                                time.map((item,index) =>{
                                    return(
                                        <button className={item.isSelected === true ? 'btn btn-schedule active': 'btn btn-schedule'} key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary mt-3' onClick={() => this.handleSaveSchedule()}>
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctor: state.admin.allDoctor,
        time : state.admin.time,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllTimeRedux: () => dispatch(actions.fetchTimeStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
