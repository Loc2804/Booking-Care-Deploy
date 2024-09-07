import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './DetailSpecialty.scss';
import { FormattedMessage } from 'react-intl';
import Header from '../../Header/Header';
import HomeHeader from '../../HomePage/HomeHeader';
import { withRouter } from 'react-router-dom';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById,getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import { Link } from 'react-router-dom';

class DetailSpecialty extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            arrDoctorId:[],
            dataDetailSpecialty:{},
            arrProvince:[],
            isExpanded : false,
        }
    }
    
    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;

            let res = await getDetailSpecialtyById({
                id:id,
                location:'ALL',
            });
            
            let resProvince = await getAllCodeService('PROVINCE');

            if(res && res.errCode === 0 && resProvince && resProvince.errCode ===0)
            {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.doctorSpecialty;
                    if(arr && arr.length > 0){
                        arr.map(item =>{
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }
                let dataProvince = resProvince.data;
                let result = [];
                if(dataProvince && dataProvince.length >0){
                    dataProvince.unshift({
                        keyMap: 'ALL',
                        valueEn: 'All',
                        valueVi:'Toàn quốc',
                        type:'PROVINCE'
                    })
                    result = dataProvince;
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    arrProvince: result,
                })
            }
        }
    }
    
    getDataDetailSpecialty = async() =>{
        
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleOnChangeSelect = async(event) =>{
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id:id,
                location:location,
            });
            
            if(res && res.errCode === 0 )
            {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.doctorSpecialty;
                    if(arr && arr.length > 0){
                        arr.map(item =>{
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    compareProvinceAndDoctorId  = (doctorId) =>{
        let language = this.props.language;
        let arrDetail = this.state.dataDetailSpecialty?.doctorSpecialty; // Optional chaining to prevent undefined error
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
        let {arrDoctorId, dataDetailSpecialty , arrProvince} = this.state;
        
        let name = '';
        let language = this.props.language;
        return (
            <div className='detail-specialty-container'> 
                <HomeHeader/>
                <div className='description-specialty'>
                    {dataDetailSpecialty && dataDetailSpecialty.descriptionHTML
                        &&  
                        <div dangerouslySetInnerHTML={
                            {__html: this.state.isExpanded === true ? 
                                dataDetailSpecialty.descriptionHTML 
                                : dataDetailSpecialty.descriptionHTML.substring(0,350) + '...'
                            }}>
                        </div>
                    }
                    <span onClick={() => this.showMoreText()}>
                        {this.state.isExpanded === true?
                            <FormattedMessage id="detail-specialty.hide"/> : <FormattedMessage id="detail-specialty.more"/> 
                        }
                    </span>
                </div>
                <div className='detail-specialty-body'>
                    <div className='search-sp-doctor'>
                            <select name="" id="" onChange={(event) => this.handleOnChangeSelect(event)}>
                                {arrProvince && arrProvince.length > 0
                                    && arrProvince.map((item,index) =>{
                                        return(
                                            <option value={item.keyMap} key={index}>{language === LANGUAGES.VI ? item.valueVi: item.valueEn}</option>  
                                        )
                                    })
                                }
                            </select>
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
                                            <Link to ={`/detail-doctor/${item}`}>{language === LANGUAGES.VI ? 'Xem thêm' : 'More'}</Link>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
