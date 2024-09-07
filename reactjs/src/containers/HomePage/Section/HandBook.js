import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Slider from 'react-slick';

import specialtyImg from "../../../assets/specialty/150322-z5375466237591689132201a679526eaab9274b8cd39a9.jpg"
class HandBook extends Component {
    
    render() {
       
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><b> <FormattedMessage id="handbook.handbook"></FormattedMessage></b></span>
                        <button className='btn-section'><b> <FormattedMessage id="handbook.all"></FormattedMessage></b></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 1</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image  section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 2</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 3</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 4</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 5</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 6</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 7</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 8</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage>9</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook-bg' ></div>
                                <div><FormattedMessage id="section-specialty.muscle-bone"></FormattedMessage> 10</div>
                            </div>
                        </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
