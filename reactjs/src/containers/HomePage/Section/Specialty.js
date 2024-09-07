import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Specialty.scss'
import { FormattedMessage, injectIntl } from 'react-intl';
import Slider from 'react-slick';
import {getAllSpecialty} from '../../../services/userService'
import specialtyImg from "../../../assets/specialty/150322-z5375466237591689132201a679526eaab9274b8cd39a9.jpg"
import { LANGUAGES,CRUD_ACTIONS, CommonUtils} from '../../../utils';
import { withRouter } from 'react-router-dom';

class Specialty extends Component {
    
    constructor(props){
        super(props);
        this.state={
            dataSpecialty:[],
        }
    }
    async componentDidMount(){
        let res = await getAllSpecialty();
        if(res && res.errCode === 0){
            this.setState({
                dataSpecialty: res.data ? res.data : [],
            })
        }
    }

   async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.language !== this.props.language){
            let res = await getAllSpecialty();
            if(res && res.errCode === 0){
                this.setState({
                    dataSpecialty: res.data ? res.data : [],
                })
            }
        }
    }
    handleViewDetailSpecialty = (specialty) =>{
        if(this.props.history)
        {
            this.props.history.push(`/detail-specialty/${specialty.id}`);
        } 
    }
    showAllSpecialty = () =>{
        if(this.props.history)
        {
            this.props.history.push(`/all-specialty/${'ALL'}`);
        } 
    }

    render() {
       let dataSpecialty = this.state.dataSpecialty;
       let {language} = this.props;
        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><b> <FormattedMessage id="section-specialty.title-specialty"></FormattedMessage></b></span>
                        <button className='btn-section'
                            onClick={() => this.showAllSpecialty()}
                        >
                            <b> <FormattedMessage id="section-specialty.more"></FormattedMessage></b>
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length>0 &&
                                dataSpecialty.map((item, index) => {
                                    return(
                                        <div className='section-customize' key={index}
                                            onClick={() => {this.handleViewDetailSpecialty(item)}}
                                        >
                                            <div className='bg-image section-specialty-bg' 
                                                style={{backgroundImage: `url(${item.image})`}}
                                            ></div>
                                            <div className='specialty-name'>{language === LANGUAGES.VI? item.nameVi: item.nameEn}</div>
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
        language : state.app.language,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => { // -> giúp sử dụng this.props.hàm bên trong mapDispatch
    return {
        
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
