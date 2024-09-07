import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicalFacility.scss'
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
class MedicalFacility extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataClinic : [],
        }
    }
    async componentDidMount(){
        let res = await getAllClinic();
        if(res && res.errCode === 0){
            this.setState({
                dataClinic : res.data,
            })
        }
    }
    handleViewDetailClinic = (item) =>{
        if(this.props.history)
            {
                this.props.history.push(`/detail-clinic/${item.id}`);
            } 
    }
    render() {
        let {dataClinic} = this.state;
        return (
            <div className='section-share section-medical-faclity'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><b> <FormattedMessage id="section-medical-faclity.title-medical"></FormattedMessage></b></span>
                        <button className='btn-section'><b> <FormattedMessage id="section-medical-faclity.more"></FormattedMessage></b></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataClinic && dataClinic.length > 0 
                                && dataClinic.map((item,index) => {
                                    return (
                                        <div className='section-customize'
                                            key={index}
                                            onClick={() => {this.handleViewDetailClinic(item)}}
                                        >
                                            <div className='bg-image section-medical-facility-bg'
                                                style={{backgroundImage: `url(${item.image})`}}
                                            >
                                            </div>
                                            <div>{item.name}</div>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
