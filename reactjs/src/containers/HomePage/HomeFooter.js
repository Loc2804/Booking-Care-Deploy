import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';



class HomeFooter extends Component {
    
    render() {
       
        return (
            <div className='home-footer'>
                <p>2024 Nguyễn Tấn Lộc &copy;.
                    More infomation, please visit my channel. 
                    <a target='_blank' href="https://www.youtube.com/watch?v=fnjBtIe54Tc&list=RDfnjBtIe54Tc&start_radio=1">&#8594; Click here !	&#8592;</a>
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
