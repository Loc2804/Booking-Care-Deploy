import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './DetailClinic.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { getDetailClinicById } from '../../../services/userService';
import _ from 'lodash';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById,getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { Link } from 'react-router-dom';

class DetailClinic extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            arrDoctorId :[],
            dataDetailClinic: {},
            arrProvince:[],
            isExpanded : false,
        }
    }
    
    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;

            let res = await  getDetailClinicById({
                id:id,
            });
            
            let resProvince = await getAllCodeService('PROVINCE');
            if(res && res.errCode === 0 && resProvince && resProvince.errCode ===0)
            {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.doctorClinic;
                    if(arr && arr.length > 0){
                        arr.map(item =>{
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }
              
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                    arrProvince : resProvince.data,
                })
            }
        }
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }
    compareProvinceAndDoctorId  = (doctorId) =>{
        let language = this.props.language;
        let arrDetail = this.state.dataDetailClinic?.doctorClinic; // Optional chaining to prevent undefined error
        if (!arrDetail || arrDetail.length === 0) {
            console.error("No doctor specialties found or dataDetailSpecialty is undefined.");
            return {}; 
        }

        let detail = {};

        for (let i = 0; i < arrDetail.length; i++) {
            if (doctorId === arrDetail[i].doctorId) {
                detail = arrDetail[i];
            }
        }
        let arrProvince = this.state.arrProvince;
        if(arrProvince && arrProvince.length >0){
            for(let i = 0 ; i< arrProvince.length ; i++){
                if(detail.provinceId === arrProvince[i].keyMap){
                    detail['provinceName'] = language === LANGUAGES.VI ? arrProvince[i].valueVi : arrProvince[i].valueEn;
                    break;
                }
            }
        }
        return detail;
    }

    showMoreText = () =>{
        this.setState({
            isExpanded : !this.state.isExpanded,
        })
    }
    render() {     
        let {arrDoctorId, dataDetailClinic ,arrProvince} = this.state;
        let name = '';
        let {language} = this.props;
        console.log(arrProvince);
        return (
            <div className='detail-clinic-container'> 
                <HomeHeader/>
                <div className='description-clinic'>
                    { dataDetailClinic &&  dataDetailClinic.descriptionHTML
                        &&  
                        <div className='info-clinic'>
                            <div className='name-clinic text-center'>{dataDetailClinic.name}</div>
                            <div dangerouslySetInnerHTML={
                                {__html: this.state.isExpanded === true ? 
                                    dataDetailClinic.descriptionHTML 
                                    :  dataDetailClinic.descriptionHTML.substring(0,445) + '...'
                                }}>
                            </div>
                        </div>
                    }
                    <span onClick={() => this.showMoreText()}>
                        {this.state.isExpanded === true?
                            <FormattedMessage id="detail-specialty.hide"/> : <FormattedMessage id="detail-specialty.more"/> 
                        }
                    </span>
                </div>
                <div className='detail-clinic-body'>
                    <div className='search-sp-doctor'>
                            
                    </div>
                    <div className='render-doctor'>
                        
                        {arrDoctorId && arrDoctorId.length >0 &&
                            arrDoctorId.map((item,index) =>{
                            name = this.compareProvinceAndDoctorId(item);
                            return(
                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor
                                                doctorId={item}
                                                key={item}
                                                isShowDescriptionDoctor= {true}
                                                // dataTime = {this.props.data}
                                            />
                                        </div>
                                        <div className='more-info'>
                                            <Link to ={`/detail-doctor/${item}`}>{language === LANGUAGES.VI ? 'Chi tiết' : 'Detail'}</Link>
                                            <span className='province-info'>
                                                <i class="fas fa-map-marker-alt"></i>
                                                {name.provinceName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='dt-content-right'>   
                                        <div className='up'>
                                            <DoctorSchedule
                                                doctorId={item} 
                                                key={item}
                                            />
                                        </div>
                                        <div className='down'>
                                            <DoctorExtraInfo
                                                doctorId = {item} 
                                                key={item}
                                            />
                                        </div> 
                                    </div>
                                </div>
                            )
                            })
                        }
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
        language : state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
