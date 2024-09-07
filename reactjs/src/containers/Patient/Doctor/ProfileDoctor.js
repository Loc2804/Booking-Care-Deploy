import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import DatePicker from '../../../components/Input/DatePicker';
import './ProfileDoctor.scss';
import { FormattedMessage } from 'react-intl';
import { getProfileDoctorById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';

class ProfileDoctor extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            dataProfile : {},
        }
    }
    
    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile:data,
        })
    }
    
    getInforDoctor = async(id) =>{
        let result = {};
        if(id)
        {
            let res = await getProfileDoctorById(id);
            if(res && res.errCode === 0){
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.doctorId !== prevProps.doctorId)
        {
            // this.getInforDoctor(this.props.doctorId);
        }
    }

    capitalizerFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderTimeBooking =(dataTime)=>{
        let {language} = this.props;
        if(dataTime && !_.isEmpty(dataTime))
        {
            let date = language === LANGUAGES.VI ? 
                    this.capitalizerFirstLetter(moment.unix(+dataTime.date/ 1000).format('dddd - DD/MM/YYYY')) :
                    this.capitalizerFirstLetter(moment.unix(+dataTime.date/ 1000).locale('en').format('dddd - MM/DD/YYYY'));
            let time = language ===LANGUAGES.VI?
                    dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            return(
                <>
                    <div><b>{time}:</b> {date}</div>
                    <div><FormattedMessage id="booking-modal.free"/></div>
                </>
            )
        }
        return <></>
    }
    render() {     
        let detailDoctor = this.state.dataProfile;
        let language = this.props.language;
        let nameVi = '';
        let nameEn = '';
        let isShowDescriptionDoctor = this.props.isShowDescriptionDoctor;
        let dataTime = this.props.dataTime;
        if(detailDoctor && detailDoctor.positionData)
        {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
        }
        return (
            <Fragment>
                <div className='profile-doctor-container'>
                    <div className='intro-doctor'>
                        <div className='content-left' style={{backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : '' } )`}}>

                        </div>
                        
                        <div className='content-right'>
                            <div className='up'> 
                                {
                                    language === LANGUAGES.VI ? nameVi : nameEn
                                }
                               
                            </div>
                            <div className='down'>
                                {isShowDescriptionDoctor === true ?
                                    <>
                                        {detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                            <span>
                                                {detailDoctor.Markdown.description}
                                            </span>
                                        }   
                                    </>
                                    : <> {this.renderTimeBooking(dataTime)} </>
                                }
                                {detailDoctor.Doctor_infor && detailDoctor.Doctor_infor.addressClinic && detailDoctor.Doctor_infor.nameClinic &&
                                    <span>
                                        <br />
                                        <b>{detailDoctor.Doctor_infor.nameClinic}:</b>
                                        &nbsp;
                                        {detailDoctor.Doctor_infor.addressClinic}
                                    </span>    
                                 }
                                 <div className='price'>
                                    <b><FormattedMessage id ="manage-schedule.fee"/>: </b>
                                    {detailDoctor && detailDoctor.Doctor_infor ? 
                                    language === LANGUAGES.VI ? <NumberFormat className= "currency" value={detailDoctor.Doctor_infor.priceData.valueVi} displayType='text' thousandSeparator={true} suffix={'VND'}/> 
                                    :  <NumberFormat className= "currency" value={detailDoctor.Doctor_infor.priceData.valueEn} displayType='text' thousandSeparator={true} suffix={'$'}/> 
                                    : ''}
                                </div>
                            </div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
