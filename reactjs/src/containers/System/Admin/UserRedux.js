import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {getAllCodeService} from "../../../services/userService"
import { LANGUAGES,CRUD_ACTIONS, CommonUtils} from '../../../utils';
import * as actions from "../../../store/actions";
import './UserReudx.scss'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
import { toast } from 'react-toastify';

class UserRedux extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            userEditId:'',
            genderArr: [],
            positionArr :[],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            //user info
            email:'',
            password: '',
            firstName: '',
            lastName: '',
            address:'',
            phonenumber:'',
            gender: '' ,
            role: '',
            position : '',
            avatar:'',
            action:'',
        }
    }

    async componentDidMount() {
        this.props.fetchGenderStart(); // this.props.dispatch(actions.fetchGenderStart());
        this.props.fetchPositionStart();
        this.props.fetchRoleStart();
        // try {
        //     let res = await getAllCodeService('gender');
        //     if(res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data,
        //         })
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    }

    //always run -> nên luôn phải có điều kiện kiểm tra sự thay đổi
    componentDidUpdate(prevProps, prevState, snapshot)
    {
        //render -> didUpdate
        // hiện tại và quá khứ (so sánh)
        // [] -> [3] -> didUpdate
        if(prevProps.genderRedux !== this.props.genderRedux)
        {
            this.setState({
                genderArr : this.props.genderRedux,
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux)
        {
            this.setState({
                positionArr : this.props.positionRedux,
            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux)
        {
            this.setState({
                roleArr : this.props.roleRedux,
            })
        }
        if(prevProps.listUsers !== this.props.listUsers)
        {
            this.setState({
                email:'',
                password: '',
                firstName: '',
                lastName: '',
                address:'',
                phonenumber:'',
                gender: '' ,
                role: '',
                position : '',
                avatar:'',
                previewImgURL: '',
                action:CRUD_ACTIONS.CREATE,
            });
        }
    }

    handleOnChangImage = async(event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file)
        {
            let base64 = await CommonUtils.getBase64(file);
            const objectURL = URL.createObjectURL(file); //api của html -> tạo url xem ảnh trên gg
            this.setState({
                previewImgURL: objectURL,
                avatar: base64,
            })
        }
    }

    openPrivewImage = () =>{
        if(!this.state.previewImgURL) return;

        this.setState({
            isOpen:true,
        })
    }

    handleOnChangeInput = (event,id) =>{
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }
    checkValidateInput = () =>{
        let isValid = true;
        let arrInput =['email', 'password', 'firstName', 'lastName', 'phonenumber','address',  'gender', 'role', 'position', 'avatar'];
        for(let i=0; i<arrInput.length; i++)
        {
            if(!this.state[arrInput[i]]) //this.state['email'] === this.state.email
            {
                isValid = false;
                alert('You should fill this field before save: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () =>{
        let {action} = this.state; // let action = this.state.action
        if(action === CRUD_ACTIONS.CREATE)
        {
            //fire redux create
            if(this.checkValidateInput())
                {
                    this.props.createNewUser({
                        email: this.state.email,
                        password: this.state.password,
                        firstName:this.state.firstName,
                        lastName: this.state.lastName,
                        address: this.state.address,
                        phonenumber: this.state.phonenumber,
                        gender: this.state.gender,
                        role:this.state.role,
                        position:this.state.position,
                        avatar: this.state.avatar,
                    });
                    
                }
            else return;
        }
        if(action === CRUD_ACTIONS.EDIT)
        {
            //fire redux edit
            if(this.checkValidateInput())
            {
                this.props.editUserRedux({
                    id: this.state.userEditId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName:this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phonenumber: this.state.phonenumber,
                    gender: this.state.gender,
                    roleId:this.state.role,
                    positionId:this.state.position,
                    avatar:this.state.avatar,
                })
                console.log('Check after update' , this.state);
            }
        }
        
    }
    handleEditUserFromParent = (user)=>{
        let imgBase64 = '';
        if(user.image)
        {
            imgBase64 = new Buffer(user.image,'base64').toString('binary');
        }
        

        this.setState({
            email:user.email,
            password: 'nothing...',
            firstName: user.firstName,
            lastName: user.lastName,
            address:user.address,
            phonenumber:user.phonenumber,
            gender: user.gender ,
            role: user.roleId,
            position : user.positionId,
            avatar:imgBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
            previewImgURL: imgBase64,
        });
    }
    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let postions = this.state.positionArr;
        let roles = this.state.roleArr;
        
        // let isLoadingGender = this.props.isLoadingGender;
        // let genders = this.props.genderRedux; ?tại sao không dùng cái này

        let {email, password, firstName, lastName,address,  phonenumber,gender,role,position,avatar } = this.state;
        return (
            <div className='user-redux-container'>
                <div className='title'>
                    REDUX WITH NGUYỄN LỘC
                </div>
                
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add"/></div>
                            <div className='col-6'>
                                <label htmlFor="">Email</label>
                                <input type="email" className='form-control' placeholder='abc@gmail.com'
                                    value={email}
                                    onChange={(event) => {this.handleOnChangeInput(event,"email")}}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false} 
                                />
                            </div>
                            <div className='col-6'>
                                <label htmlFor=""><FormattedMessage id="manage-user.password"/></label>
                                <input type="password" className='form-control'  placeholder='Enter password'
                                    value={password}
                                    onChange={(event) => {this.handleOnChangeInput(event,"password")}}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false} 
                                />
                            </div>         
                            <div className='col-6'>
                                <label htmlFor=""><FormattedMessage id="manage-user.firstname"/></label>
                                <input type="text" className='form-control'   placeholder='John'
                                    value={firstName}
                                    onChange={(event) => {this.handleOnChangeInput(event,"firstName")}}/>
                            </div>
                            <div className='col-6'>
                                <label htmlFor=""><FormattedMessage id="manage-user.lastname"/></label>
                                <input type="text" className='form-control'  placeholder='Smith'
                                    value={lastName}
                                     onChange={(event) => {this.handleOnChangeInput(event,"lastName")}}/>
                            </div>
                            <div className='col-3'>
                                <label htmlFor=""><FormattedMessage id="manage-user.phone"/></label>
                                <input type="text" className='form-control'   placeholder='091******759'
                                    value={phonenumber}
                                    onChange={(event) => {this.handleOnChangeInput(event,"phonenumber")}}/>
                            </div>
                            <div className='col-6'>
                                <label htmlFor=""><FormattedMessage id="manage-user.address"/></label>
                                <input type="text" className='form-control'  placeholder='Au Co, Da Nang'
                                    value={address}
                                     onChange={(event) => {this.handleOnChangeInput(event,"address")}}/>
                            </div>
                            <div className='col-3'>
                                <label htmlFor=""><FormattedMessage id="manage-user.gender"/></label>
                                <select name="" className='form-control'  
                                     value={this.state.gender} 
                                    onChange={(event) => {this.handleOnChangeInput(event,"gender")}}>
                                    <option disabled selected hidden value="">Choose...</option>
                                    {genders && genders.length >0 
                                        && genders.map((item,index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor=""><FormattedMessage id="manage-user.role"/></label>
                                <select name="" className='form-control'
                                    value={this.state.role} 
                                    onChange={(event) => {this.handleOnChangeInput(event,'role')}}>
                                    <option disabled selected hidden value="">Choose...</option>
                                    {roles && roles.length >0 
                                        && roles.map((item,index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor=""><FormattedMessage id="manage-user.position"/></label>
                                <select name="" className='form-control' 
                                    value={this.state.position} 
                                    onChange={(event) => {this.handleOnChangeInput(event,'position')}}>
                                    <option disabled selected hidden value="">Choose...</option>
                                    {postions && postions.length >0 
                                        && postions.map((item,index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor=""><FormattedMessage id="manage-user.image"/></label>
                                <div className='preview-img-container'>
                                    <input type="file" id="previewImg" hidden
                                        onChange={(event) => {this.handleOnChangImage(event)}}    
                                    />
                                    <label htmlFor="previewImg" className='label-upload'><FormattedMessage id="manage-user.upload"/> <i className="fas fa-upload"></i></label>
                                    <div className='preview-image' style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                                        onClick={() => {this.openPrivewImage()}}
                                    >  
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                                    onClick={() => {this.handleSaveUser()}}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id="manage-user.save"/>  : <FormattedMessage id="modal.add"/>}       
                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser
                                   handleEditUserFromParent = {this.handleEditUserFromParent}
                                   action = {this.state.action}
                                />    
                            </div>       
                        </div>             
                    </div>
                </div>           
                {this.state.isOpen === true && 
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}     
                    />
                }
            </div>
            
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux : state.admin.genders,
        isLoadingGender : state.admin.isLoadingGender,
        positionRedux : state.admin.positions,
        roleRedux : state.admin.roles,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data)),
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
