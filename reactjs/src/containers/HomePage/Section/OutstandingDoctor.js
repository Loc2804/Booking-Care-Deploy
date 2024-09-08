import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import {LANGUAGES} from '../../../utils'
import { Buffer } from 'buffer';

class OutstandingDoctor extends Component {
    
    constructor(props)
    {
        super(props);
        this.state = {
            arrDoctor: [],
        }
    }

    componentDidMount()
    {
        this.props.loadTopDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.topDoctor !== this.props.topDoctor)
        {
            this.setState({
                arrDoctor: this.props.topDoctor,
            })
        }
    }

    handleViewDetailDoctor = (doctor) =>{
        console.log(doctor);
        if(this.props.history)
        {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        } 
    }
    render() {
       let arrDoctors = this.state.arrDoctor;
       let {language} = this.props;
        return (
            <div className='section-share section-outstandingdoctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><b> <FormattedMessage id="outstandingdoctor.outstandingdoctor"></FormattedMessage></b></span>
                        <button className='btn-section'><b> <FormattedMessage id="outstandingdoctor.find"></FormattedMessage></b></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length >0 
                                && arrDoctors.map((item,index) => { 
                                    let  imgBase64 = '';
                                    if(item.image)
                                    {
                                        imgBase64 = Buffer.from(item.image,'base64').toString('binary');
                                            
                                    }
                                    let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`;
                                    return(
                                        <div className='section-customize'
                                            onClick={() => {this.handleViewDetailDoctor(item)}}
                                        >
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image section-outstandingdoctor-bg' 
                                                        style={{backgroundImage: `url(${imgBase64})`}}
                                                    >
                                                    </div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div>{language === LANGUAGES.VI? nameVi : nameEn}</div>
                                                    <div><FormattedMessage id="outstandingdoctor.muscle-bone"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctor: state.admin.topDoctor,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => { // -> giúp sử dụng this.props.hàm bên trong mapDispatch
    return {
        loadTopDoctors: () => dispatch(actions.getTopDoctor()),
        
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
