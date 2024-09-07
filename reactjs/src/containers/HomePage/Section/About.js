import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';



class About extends Component {
    
    render() {
       
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    <FormattedMessage id="about.about"></FormattedMessage>
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                    <iframe width="100%" height="430px" src="https://www.youtube.com/embed/fnjBtIe54Tc?list=RDfnjBtIe54Tc" title="24K.RIGHT - PHÙ HỘ CHO CON [feat. B RAY, HUỲNH CÔNG HIẾU, HIPZ] | OFFICIAL MUSIC VIDEO" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>                    </div>
                    <div className='content-right'>
                        <p>  <FormattedMessage id="about.detail"></FormattedMessage></p>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => { // -> giúp sử dụng this.props.hàm bên trong mapDispatch
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
