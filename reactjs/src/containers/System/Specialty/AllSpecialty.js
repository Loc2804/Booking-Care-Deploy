import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './ManageSpecialty.scss';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {CRUD_ACTIONS, LANGUAGES}  from '../../../utils';
import  {CommonUtils} from '../../../utils';
import { postNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';
import { getDetailSpecialtyById, getAllSpecialty} from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllSpecialty.scss';


class AllSpecialty extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            dataDetailSpecialty:{}
        }
    }
    
    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getAllSpecialty();
            if(res && res.errCode === 0 )
            {
                this.setState({
                    dataDetailSpecialty: res.data,
                })
            }
            
        }
        
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    handleClickEachSpecialty = (item) => {
        if(this.props.history)
            {
                this.props.history.push(`/detail-specialty/${item.id}`);
            } 
    }
    render() {     
        let language = this.props.language;
        let data = this.state.dataDetailSpecialty;
        console.log(this.state.dataDetailSpecialty);
        return (
            <div className='specialty-container'> 
                <HomeHeader/>
                <div className='all-specialty-container'>
                    <div className='title-specialty'>
                        {language === LANGUAGES.VI ? 'CHUYÊN KHOA KHÁM' : 'SPECIALTIES'}
                    </div>
                    {data && data.length > 0 &&
                        data.map((item,index) =>{
                            return(
                                <div className='one-specialty' key={index} onClick={() => this.handleClickEachSpecialty(item)}>
                                    <div className='img-specialty'
                                        style={{backgroundImage: `url(${item.image})`}}>
                                    </div>  
                                    <div className='name-specialty'>
                                        {language === LANGUAGES.VI ? item.nameVi : item.nameEn}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);
