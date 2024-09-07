import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../containers/System/UserManage';
// import UserRedux from '../containers/System/Admin/UserRedux';
// import Header from '../containers/Header/Header';
// import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInfoDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import LoadingOverlay from 'react-loading-overlay';
import LikeAndShare from '../SocialPlugin/LikeAndShare'
import Comment from '../SocialPlugin/Comment'

class DetailDoctor extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDetailDoctorId: -1,
            isShowLoading: false,
        }
    }
    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            this.setState({
                currentDetailDoctorId: id,
            })
            let res = await getDetailInfoDoctor(id);
            
            if(res && res.errCode === 0)
            {
                this.setState({
                    detailDoctor: res.data,
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    showLoadingLayout = () =>{
        this.setState({
            isShowLoading:true,
        })
    }
    closeLoadingLayout = () =>{
        this.setState({
            isShowLoading:false,
        })
    }
    render() {     
        let { detailDoctor} = this.state; // detailDoctor = this.state.detailDoctor
        let language = this.props.language;
        let nameVi = '';
        let nameEn = '';
        if(detailDoctor && detailDoctor.positionData)
        {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
        }
        return (
            <LoadingOverlay
            active={this.state.isShowLoading}
            spinner
            text=''
            >
                <Fragment> 
                <HomeHeader isShowBanner = {false}/>
                <div className='doctor-detail-container'>
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
                                {detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule
                                doctorId={this.state.currentDetailDoctorId}
                                closeLoadingLayout = {this.closeLoadingLayout}
                                openLoadingLayout = {this.showLoadingLayout}
                            />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfo
                                doctorId={this.state.currentDetailDoctorId}
                            />
                        </div>
                    </div>
                    <div className='detail-info-doctor'>
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML 
                            &&  
                            <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}></div>
                        }
                    </div>
                    <div className='comment-doctor'>

                    </div>
                </div>
                </Fragment>
            </LoadingOverlay>
            
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

export default connect(mapStateToProps, mapDispatchToProps)( DetailDoctor);
