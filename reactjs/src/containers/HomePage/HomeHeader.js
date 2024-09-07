import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss'
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router-dom';
class HomeHeader extends Component {
    changeLanguage =(language) =>{
        //fire redux events: actions
       this.props.changeLanguageAppRedux(language);
    }
    returnHome = () =>{
        if(this.props.history)
        {
            this.props.history.push(`/home`);
        } 
    }
    render() {
        const { intl } = this.props;
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={() => {this.returnHome()}}></div>
                        </div>

                        <div className='center-content'>
                            <div className='child-content'>
                                <div className='child-title'><b> <FormattedMessage id="homeheader.specialty"></FormattedMessage></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor"></FormattedMessage></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-title'><b><FormattedMessage id="homeheader.health-facility"></FormattedMessage></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room"></FormattedMessage></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-title'><b><FormattedMessage id="homeheader.doctor"></FormattedMessage></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-doctor"></FormattedMessage></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-title'><b><FormattedMessage id="homeheader.fee"></FormattedMessage></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.check-health"></FormattedMessage></div>
                            </div>
                        </div>

                        <div className='right-content'>
                            <div className='support'>
                                <i className="fas fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support"></FormattedMessage>
                            </div>
                            <div className= {language === LANGUAGES.VI ?'language-vi active' :'language-vi' }> 
                                <span onClick={()=>{this.changeLanguage(LANGUAGES.VI)}}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ?'language-en active' :'language-en' }>
                                <span onClick={()=>{this.changeLanguage(LANGUAGES.EN)}}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'>
                                <FormattedMessage id="banner.platform"></FormattedMessage>
                            </div>

                            <div className='title2'>
                                <FormattedMessage id="banner.title2"></FormattedMessage>
                            </div>

                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type="text" placeholder={intl.formatMessage({ id: 'banner.find' })} />
                            </div>
                        </div>
                        
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child1'></div>
                                    <div className="text-child"> <FormattedMessage id="banner.child1"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child2'></div>
                                    <div className="text-child"><FormattedMessage id="banner.child2"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child3'></div>
                                    <div className="text-child"><FormattedMessage id="banner.child3"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child4'></div>
                                    <div className="text-child"><FormattedMessage id="banner.child4"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child5'></div>
                                    <div className="text-child"><FormattedMessage id="banner.child5"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child6'></div>
                                    <div className="text-child"><FormattedMessage id="banner.child6"></FormattedMessage></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => { // -> giúp sử dụng this.props.hàm bên trong mapDispatch
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));
