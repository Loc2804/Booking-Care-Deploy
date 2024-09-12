import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {CRUD_ACTIONS, LANGUAGES}  from '../../../utils';
import  {CommonUtils} from '../../../utils';
import { postNewclinic , getAllClinic } from '../../../services/userService';
import { toast } from 'react-toastify';

import HomeHeader from '../../HomePage/HomeHeader';
import './AllClinic.scss';


class AllClinic extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            clinic: [],
        }
    }
    
    async componentDidMount() {
        if(this.props.match && this.props.match.params){
            let res = await getAllClinic();
            if(res && res.errCode === 0 )
            {
                this.setState({
                    clinic: res.data,
                })
            }
            
        }
        
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    handleClickEachclinic = (item) => {
        if(this.props.history)
        {
            this.props.history.push(`/detail-clinic/${item.id}`);
        } 
    }
    render() {     
        let language = this.props.language;
        let data = this.state.clinic;
        console.log(this.state.clinic);
        return (
            <div className='clinic-container'> 
                <HomeHeader/>
                <div className='all-clinic-container'>
                    <div className='title-clinic'>
                        {language === LANGUAGES.VI ? 'CÁC CƠ SỞ Y TẾ' : 'ALL POPULAR CLINICS'}
                    </div>
                    {data && data.length > 0 &&
                        data.map((item,index) =>{
                            return(
                                <div className='one-clinic' key={index} onClick={() => this.handleClickEachclinic(item)}>
                                    <div className='img-clinic'
                                        style={{backgroundImage: `url(${item.image})`}}>
                                    </div>  
                                    <div className='name-clinic'>
                                        {item.name}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);
