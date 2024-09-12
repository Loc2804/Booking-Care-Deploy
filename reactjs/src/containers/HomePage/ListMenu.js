import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './ListMenu.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';

class ListMenu extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            
        }
    }
    
    async componentDidMount() {
    
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }
    closeList = () =>{
        this.props.closeList();
    }
    returnHome = () =>{
        this.props.closeList();
    }
    render() {     
        let language = this.props.language;
        return (
            <Fragment> 
                {this.props.isOpenList ?
                    <div className='container-fluid content'>
                        <div className='body'>
                            <div className='list-info'>
                                <span onClick={() => this.closeList()}>
                                    <i class="fas fa-long-arrow-alt-left"></i>
                                    {language === LANGUAGES.VI ? 'Quay lại' : 'Back'}
                                </span>
                                <div className='all-menu'>
                                    <div className='menu-1 menu' onClick={() => this.returnHome()}>
                                        {language === LANGUAGES.VI ? 'Trang chủ' : 'Home'}
                                    </div>
                                    <div className='menu-2 menu'>
                                        {language === LANGUAGES.VI ? 'Liên hệ với chúng tôi' : 'Contact us for collaboration'}
                                    </div>
                                    <div className='menu-3 menu'>
                                        {language === LANGUAGES.VI ? 'Tuyển dụng' : 'Recruitment'}
                                    </div>
                                    <div className='menu-4 menu'>
                                        {language === LANGUAGES.VI ? 'Câu hỏi cho chúng tôi' : 'Questions'}
                                    </div>
                                    <div className='menu-5 menu'>
                                        {language === LANGUAGES.VI ? 'Đánh giá' : 'Rating'}
                                    </div>
                                </div>
                                <div className='contact'>
                                    <a href="https://www.google.com/intl/vi/gmail/about/" target='_blank'><i className="fas fa-envelope gmail"></i></a>
                                    <a href="https://www.facebook.com/" target='_blank'><i className="fab fa-facebook-square face"></i></a>
                                    <a href="https://www.reddit.com/" target='_blank'><i className="fab fa-reddit reddit"></i></a>
                                    <a href="https://www.instagram.com/" target='_blank'><i className="fab fa-instagram insta"></i></a>
                                    <a href="https://web.telegram.org/" target='_blank'><i className="fab fa-telegram tele"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    ''
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);
