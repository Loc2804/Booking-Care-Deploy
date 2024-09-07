import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { postVerifyBookingAppointment } from '../../services/userService';
 import './VerifyEmail.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';

class VerifyEmail extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            statusVerify:false,
            errCode:0,
        }
    }
    
    async componentDidMount() {
        if(this.props.location && this.props.location.search){
            const urlParams = new URLSearchParams(this.props.location.search);
            const token = urlParams.get('token');
            const doctorId = urlParams.get('doctorId');
            let res = await postVerifyBookingAppointment({
                doctorId:doctorId,
                token:token,
            })
            if(res && res.errCode === 0){
                this.setState({
                    statusVerify:true,
                    errCode : res.errCode,
                })
            }else{
                this.setState({
                    statusVerify:true,
                    errCode : res && res.errCode ? res.errCode : -1,
                })
            }
        }
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }



    render() {     
        let {statusVerify,errCode} = this.state;
        return (
            <Fragment>
                <HomeHeader/> 
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div className='info-booking'>
                            Loading data...
                        </div>
                        :
                        <div>
                            {+errCode === 0 ?
                                <div className='info-booking'>
                                   <FormattedMessage id="verify-email.confirm"/>
                                </div>
                                :
                                <div className='info-booking'>
                                    <FormattedMessage id="verify-email.failed"/>
                                </div>
                            }
                        </div>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
