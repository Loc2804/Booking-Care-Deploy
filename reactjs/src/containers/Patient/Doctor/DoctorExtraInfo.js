import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../containers/System/UserManage';
// import UserRedux from '../containers/System/Admin/UserRedux';
// import Header from '../containers/Header/Header';
// import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorExtraInfo.scss';
import { getDetailInfoDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import { getExtraDoctorInfoById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfo extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo : {},
        }
    }
    async componentDidMount() {
        if(this.props.doctorId){
            let res = await getExtraDoctorInfoById(this.props.doctorId);
            if(res && res.errCode === 0)
            {
                this.setState({
                    extraInfo: res.data,
                })
            } 
        }
         
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let {language} = this.props
        if(prevProps.language !== this.props.language)
        {

        }
        if(this.props.doctorId !== prevProps.doctorId)
        {
            let res = await getExtraDoctorInfoById(this.props.doctorId);
            if(res && res.errCode === 0)
            {
                this.setState({
                    extraInfo: res.data,
                })
            }  
        }
    }

    handleOpenDetail = (status) =>{
        this.setState({
            isShowDetailInfo: status,
        })
    }
    render() {     
        let { isShowDetailInfo, extraInfo} = this.state;
        let {language} = this.props;
        return (
           <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'><FormattedMessage id ="manage-schedule.title-info"/></div>
                    <div className='name-clinic'>
                    {language === LANGUAGES.VI ? 'Tên phòng khám: ' : `{Clinic's name: `}
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic: ''}
                    </div>
                    <div className='detail-address'>
                        {language === LANGUAGES.VI ? 'Địa chỉ: ' : 'Address: '}
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic: ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfo === false && 
                        <div className='open-price'>
                            <FormattedMessage id ="manage-schedule.fee_special"/>:
                            {   extraInfo && extraInfo.priceData ? 
                                language === LANGUAGES.VI ? 
                                <NumberFormat className= "currency" value={extraInfo.priceData.valueVi} displayType='text' thousandSeparator={true} suffix={'VND'}/> 
                                :  <NumberFormat className= "currency" value={extraInfo.priceData.valueEn} displayType='text' thousandSeparator={true} suffix={'$'}/>
                                : ''                           
                            }
                            <span className= 'task' onClick={() => this.handleOpenDetail(true)}><FormattedMessage id ="manage-schedule.open-detail"/></span>
                        </div>
                    }
                    {isShowDetailInfo === true && 
                        <Fragment>
                            <div className='title-price'><FormattedMessage id ="manage-schedule.fee_special"/> </div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <span className='left'>
                                    <FormattedMessage id ="manage-schedule.fee"/>:
                                    </span>
                                    <span className='right'>
                                    {   extraInfo && extraInfo.priceData ? 
                                        language === LANGUAGES.VI ? 
                                        <NumberFormat className= "currency" value={extraInfo.priceData.valueVi} displayType='text' thousandSeparator={true} suffix={'VND'}/> 
                                        :  <NumberFormat className= "currency" value={extraInfo.priceData.valueEn} displayType='text' thousandSeparator={true} suffix={'$'}/>
                                        : ''                           
                                    }
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfo && extraInfo.note ? extraInfo.note: ''}
                                </div>
                            </div>
                            <div  className='payment'>
                                <FormattedMessage id ="manage-schedule.paid"/>
                                    {   extraInfo && extraInfo.paymentData ? 
                                        language === LANGUAGES.VI ? 
                                        extraInfo.paymentData.valueVi : extraInfo.paymentData.valueEn 
                                        : ''                           
                                    }
                            </div>
                            <div className='hide-price task'>
                                <span className= 'task' onClick={() => this.handleOpenDetail(false)}> <FormattedMessage id ="manage-schedule.close-detail"/></span>
                            </div>
                            
                        </Fragment>
                    }
                    

                    
                </div>
           </div>
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

export default connect(mapStateToProps, mapDispatchToProps)( DoctorExtraInfo);
