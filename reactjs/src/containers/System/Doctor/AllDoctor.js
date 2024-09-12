import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {CRUD_ACTIONS, LANGUAGES}  from '../../../utils';
import  {CommonUtils} from '../../../utils';
import { postNewdoctor , getAllDoctorService} from '../../../services/userService';
import { toast } from 'react-toastify';
// import { getDetaildoctorById, getAllDoctor} from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllDoctor.scss';


class AllDoctor extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            doctor: [],
        }
    }
    
    async componentDidMount() {
        if(this.props.match && this.props.match.params){
            let res = await getAllDoctorService();
            if(res && res.errCode === 0 )
            {
                this.setState({
                    doctor: res.data,
                })
            }
            
        }
        
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    handleClickEachdoctor = (item) => {
        if(this.props.history)
        {
            this.props.history.push(`/detail-doctor/${item.id}`);
        } 
    }
    render() {     
        let language = this.props.language;
        let data = this.state.doctor;
        console.log(this.state.doctor);
        return (
            <div className='doctor-container'> 
                <HomeHeader/>
                <div className='all-doctor-container'>
                    <div className='title-doctor'>
                        {language === LANGUAGES.VI ? 'TẤT CẢ BÁC SĨ' : 'ALL DOCTORS'}
                    </div>
                    {data && data.length > 0 &&
                        data.map((item,index) =>{
                            return(
                                <div className='one-doctor' key={index} onClick={() => this.handleClickEachdoctor(item)}>
                                    <div className='img-doctor'
                                        style={{backgroundImage: `url(${item.image})`}}>
                                    </div>  
                                    <div className='name-doctor'>
                                        {language === LANGUAGES.VI ? `${item.firstName} ${item.lastName}` : `${item.lastName} ${item.firstName} `}
                                    </div>
                                </div>
                            )
                        })
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

export default connect(mapStateToProps, mapDispatchToProps)(AllDoctor);
