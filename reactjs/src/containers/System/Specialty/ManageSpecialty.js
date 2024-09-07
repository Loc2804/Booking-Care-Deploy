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

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            nameVi:'',
            nameEn:'',
            imgBase64:'',
            contentHTML: '',
            contentMarkdown:'',
        }
        this.fileInputRef = React.createRef();
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown:text
        });
    }

    handleOnChangeInput = (event,name) =>{
        let copyState = {...this.state};
        copyState[name] = event.target.value;
        this.setState({
            ...copyState,
        })
    }
    handleOnChangImage = async(event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file)
        {
            let base64 = await CommonUtils.getBase64(file);
            //const objectURL = URL.createObjectURL(file); //api của html -> tạo url xem ảnh trên gg
            this.setState({
                imgBase64: base64,
            })
        }

    }
    setDefaultState =() =>{
        this.setState({
            nameVi: '',
            nameEn:'',
            contentHTML: '',
            contentMarkdown: '',
            imgBase64: ''
        })
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = '';
        }
    }
    handleSaveSpecialty = async() =>{
        let res = await postNewSpecialty({
            nameVi: this.state.nameVi,
            nameEn:this.state.nameEn,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            imgBase64: this.state.imgBase64
        })
        if(res && res.errCode === 0){
            toast.success(res.message);
            this.setDefaultState();
        }
        else{
            toast.error(res.message);
        }
    }
    render() {     
        
        return (
            <div className='manage-specialty-container'> 
                <div className='ms-title'>Quản lí chuyên khoa</div>

                <div className='add-new-specialty row mt-3'>
                    <div className='col-4 form-group'>
                        <label htmlFor="">Tên chuyên khoa (tiếng Việt)</label>
                        <input type="text" className='form-control' value={this.state.nameVi} onChange={(event)=>this.handleOnChangeInput(event,'nameVi')} />
                    </div>

                    <div className='col-4 form-group'>
                        <label htmlFor="">Tên chuyên khoa (tiếng Anh)</label>
                        <input type="text" className='form-control' value={this.state.nameEn} onChange={(event)=>this.handleOnChangeInput(event,'nameEn')} />
                    </div>

                    <div className='col-4 form-group'>
                        <label htmlFor="">Ảnh chuyên khoa</label>
                        <input type="file" className='form-control-file' onChange={(event) => {this.handleOnChangImage(event)}}  ref={this.fileInputRef}/>
                    </div>

                    <div className='col-12'>
                        <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} 
                            // truyền props xuống thằng con nên ko cần arrow function đối với event onChange
                            onChange={this.handleEditorChange} 
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn btn-primary btn-save-specialty mt-3' onClick={()=>this.handleSaveSpecialty()}>Add new</button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
