import React, { Component } from 'react';
import { FormattedMessage,injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss'
import * as actions from "../../../store/actions";
// import { getAllUsers } from '../../services/userService';
// import ModalUser from './ModalUser';
// import { createNewUserService, deleteUserService, editUserService } from '../../services/userService';
// import { emitter } from '../../utils/emitter';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';


const mdParser = new MarkdownIt(/* Markdown-it options */);


function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            userRedux: [],
        }
    }

    componentDidMount(){
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if(prevProps.listUsers !== this.props.listUsers)
        {
            this.setState({
                userRedux: this.props.listUsers,
            })
        }
    }
    handleDeleteUser = (item)=>{
        this.props.deleteUserRedux(item.id); 
    }
    handleEditUser = (user) =>{
        console.log('Check user:' , user);
        this.props.handleEditUserFromParent(user);
    }
    render() {
        const {intl} = this.props;
        let arrUsers = this.state.userRedux;
        return (
            <>
                <div className='users-table my-4'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th><FormattedMessage id="manage-user.firstname"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.lastname"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.address"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.gender"></FormattedMessage></th>
                                <th><FormattedMessage id="manage-user.action"></FormattedMessage></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            arrUsers && arrUsers.map((item,index) =>{
                                return( 
                                    <tr key={index}>  
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>{item.gender === 'M'? 
                                                intl.formatMessage({ id: 'manage-user.male' }): item.gender === 'F'? intl.formatMessage({ id: 'manage-user.female' }) : intl.formatMessage({ id: 'manage-user.other' }) }
                                        </td>
                                        <td>
                                            <button className="btn-edit"
                                                onClick={()=> this.handleEditUser(item)}>
                                                <i className="fas fa-pencil-alt btn-edit"></i>
                                            </button>
                                            <button className="btn-delete"
                                                onClick={()=> this.handleDeleteUser(item)}>
                                                <i className="fas fa-trash btn-delete"></i>
                                            </button>
                                        </td> 
                                    </tr>
                                 )
                            })
                        } 
                        </tbody>
                    </table>
                </div>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUserRedux: (userId) => dispatch(actions.deleteUser(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TableManageUser));
