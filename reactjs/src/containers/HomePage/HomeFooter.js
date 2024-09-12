import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES } from '../../utils';


class HomeFooter extends Component {
    
    render() {
        let language = this.props.language;
        return (
            <div className='home-footer'>
                <p>2024 Nguyễn Tấn Lộc &copy;.
                {language === LANGUAGES.VI ? 'Để có thông tin thêm hãy tới đường link sau !': ' More infomation, please visit my channel. '}
                <a target='_blank' href="https://www.youtube.com/watch?v=fnjBtIe54Tc&list=RDfnjBtIe54Tc&start_radio=1">&#8594; {language === LANGUAGES.VI ? 'Nhấn vào đây !' : 'Click here !'}	&#8592;</a>
                </p>
            </div>
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
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
