import React, { Component } from 'react';
import { FormattedMessage,injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from "../../../store/actions";
// import { getAllUsers } from '../../services/userService';
// import ModalUser from './ModalUser';
// import { createNewUserService, deleteUserService, editUserService } from '../../services/userService';
// import { emitter } from '../../utils/emitter';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {CRUD_ACTIONS, LANGUAGES}  from '../../../utils';

import Select from 'react-select';
import { getAllSpecialty, getDetailInfoDoctor } from '../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            //save to Markdown table
            contentHTML: '',
            contentMarkdown:'',
            selectedDoctor: '',
            description:'',
            allDoctor: [],
            hasOldData: false,

            //save to Doctor_info table
            listPrice : [],
            listProvince: [],
            listPayment: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice :'',
            selectedPayment:'',
            selectedProvince:'',
            selectedClinic:'',
            selectedSpecialty:'',

            nameClinic :'',
            addressClinic : '',
            note:'',
        }
    }

    componentDidMount(){
        this.props.fetchAllDoctorsRedux();
        this.props.getDoctorPrice(); 
        this.props.getDoctorProvince();
        this.props.getDoctorPayment();
        this.props.getAllSpecialty();
        this.props.getAllClinic();
    }

    buildDataInputSelect = (data) =>{
        let result = [];
        let {language} = this.props; //let language = this.props.language
        if(data && data.length > 0)
        {
            data.map((item,index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    buildDataInputSelectDoctor = (data, type) =>{
        let result = [];
        let {language} = this.props; //let language = this.props.language
        if(data && data.length > 0)
        {
            if(type === 'price')
            {
                data.map((item,index) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.valueVi + ' VNĐ' : item.valueEn + ' USD';
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            else if(type === 'specialty'){
                data.map((item,index) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.nameVi : item.nameEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            else if(type === 'clinic'){
                data.map((item,index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
            else{
                data.map((item,index) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
        }
        return result;
    }
    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if(prevProps.allDoctor !== this.props.allDoctor)
        {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
            this.setState({
                allDoctor: dataSelect,
            })
        }
        if(prevProps.language !== this.props.language)
        {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
            let dataSelectPayment = this.buildDataInputSelectDoctor(this.props.listPayment,'payment');
            let dataSelectPrice = this.buildDataInputSelectDoctor(this.props.listPrice,'price');
            let dataSelectProvince = this.buildDataInputSelectDoctor(this.props.listProvince,'province');
            let dataSpecialty =  this.buildDataInputSelectDoctor(this.props.listSpecialty,'specialty');
            let dataClinic = this.buildDataInputSelectDoctor(this.props.listClinic,'clinic');
            this.setState({
                allDoctor: dataSelect,
                listPayment: dataSelectPayment,
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listSpecialty: dataSpecialty,
                listClinic:dataClinic,
            })

        }
        if(prevProps.listPayment !== this.props.listPayment || prevProps.listPrice !== this.props.listPrice 
            || prevProps.listProvince !== this.props.listProvince 
            ||  prevProps.listSpecialty !== this.props.listSpecialty
            ||  prevProps.listClinic !== this.props.listClinic
        )
        {
            let dataSelectPayment = this.buildDataInputSelectDoctor(this.props.listPayment,'payment');
            let dataSelectPrice = this.buildDataInputSelectDoctor(this.props.listPrice, 'price');
            let dataSelectProvince = this.buildDataInputSelectDoctor(this.props.listProvince,'province');
            let dataSpecialty =  this.buildDataInputSelectDoctor(this.props.listSpecialty,'specialty');
            let dataClinic = this.buildDataInputSelectDoctor(this.props.listClinic,'clinic');
            this.setState({
                listPayment: dataSelectPayment,
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listSpecialty: dataSpecialty,
                listClinic:dataClinic,
            })
        }
    }

   

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown:text
        });
    }
    
    handleSaveContentMarkdown = () =>{
        let hasOldData = this.state.hasOldData;
        this.props.saveDetailInfoDoctorRedux({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice :this.state.selectedPrice.value,
            selectedPayment:this.state.selectedPayment.value,
            selectedProvince:this.state.selectedProvince.value,
            selectedSpecialty:this.state.selectedSpecialty.value,
            selectedClinic: this.state.selectedClinic.value,
            nameClinic :this.state.nameClinic,
            addressClinic : this.state.addressClinic,
            note:this.state.note,
        });
    }


    handleChange = async(selectedDoctor) => {
        this.setState({ selectedDoctor });
        let res = await getDetailInfoDoctor(selectedDoctor.value);
        let language = this.props.language;
        let listPayment = this.state.listPayment;
        let listPrice = this.state.listPrice;
        let listProvince= this.state.listProvince;
        let listSpecialty = this.state.listSpecialty;
        let listClinic = this.state.listClinic;
        
        if(res && res.errCode === 0 && res.data.Markdown)
        {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic ='', note ='',
            paymentId = '', provinceId = '', priceId = '';
            let selectedPayment = '',  selectedPrice = '', selectedProvince = '', selectedClinic= '', selectedSpecialty= '';
            let clinicId = '', specialtyId = '';
            if(res.data.Doctor_infor)
            {
                addressClinic = res.data.Doctor_infor.addressClinic;
                nameClinic = res.data.Doctor_infor.nameClinic;
                note = res.data.Doctor_infor.note;
                paymentId =  res.data.Doctor_infor.paymentId;  
                priceId =  res.data.Doctor_infor.priceId;  
                provinceId =  res.data.Doctor_infor.provinceId;  
                clinicId =res.data.Doctor_infor.clinicId;  
                specialtyId = res.data.Doctor_infor.specialtyId;

                 selectedPayment = listPayment.find(item => {
                    if(item.value === paymentId) return item && item.value === paymentId;
                })
                 selectedPrice= listPrice.find(item => {
                    if(item.value ===  priceId) return item && item.value === priceId;
                })
                  selectedProvince = listProvince.find(item => {
                    if(item.value === provinceId) return item && item.value === provinceId;
                })

                selectedSpecialty = listSpecialty.find(item => {
                    if(item.value ===  specialtyId) return item && item.value === specialtyId;
                })   

                selectedClinic = listClinic.find(item => {
                    if(item.value ===  clinicId) return item && item.value === clinicId;
                })   
                
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice : selectedPrice,
                selectedProvince:selectedProvince ,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            })
        }
        else{
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                nameClinic: '',
                addressClinic: '',
                note: '',
                selectedPrice :'',
                selectedPayment:'',
                selectedProvince:'',
                selectedClinic:'',
                selectedSpecialty:'',
            })
        }
    };

    handleChangeSelectDoctorInfo = async (selectedOption, name) =>{
        let stateName = name.name;
        let stateCopy = {...this.state};
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        })

    }

    handleOnChangeText =(event, name)=>{
        let stateCopy = {...this.state};
        stateCopy[name] = event.target.value;

        this.setState({
            ...stateCopy,
        })
    }
    render() {
        const {intl} = this.props; 
        let allDoctors = this.state.allDoctor;
        let hasOldData = this.state.hasOldData;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                   <FormattedMessage id="admin.manage-doctor.title"/>
                </div>
                <div className='more-info'>
                    <div className='content-left form-group'>
                        <label htmlFor="" className=''><FormattedMessage id="admin.manage-doctor.choose-doctor"/>:</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.choose-doctor"/>}
                            value={this.state.selectedDoctor}
                            onChange={this.handleChange}
                            options={allDoctors}
                        />
                    </div>
                    <div className='content-right form-group'>
                        <label htmlFor="" className=''><FormattedMessage id="admin.manage-doctor.introduction"/>:</label>
                        <textarea className='form-control' rows={4} 
                            onChange={(event) => this.handleOnChangeText(event,'description')}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                
                <div className='doctor-extra-info row'>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.choose-price"/>}</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.choose-price"/>}
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPrice}
                            name = "selectedPrice"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.payment"/>}</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.payment"/>}
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPayment}
                            name = "selectedPayment"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.province"/>}</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.province"/>}
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listProvince}
                            name = "selectedProvince"
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.specailty"/>}</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.specailty"/>}
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listSpecialty}
                            name = "selectedSpecialty"
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.clinic"/>}</label>
                        <Select
                            placeholder ={<FormattedMessage id="admin.manage-doctor.clinic"/>}
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listClinic}
                            name = "selectedClinic"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>
                            {<FormattedMessage id="admin.manage-doctor.name"/>}
                        </label>
                        <input type="text" className='form-control' onChange={(event) => this.handleOnChangeText(event,'nameClinic')}  value={this.state.nameClinic}/>
                    </div>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.address"/>}</label>
                        <input type="text" className='form-control' onChange={(event) => this.handleOnChangeText(event,'addressClinic')}  value={this.state.addressClinic}/>
                    </div>
                    <div className='col-4 form-group'>
                        <label htmlFor="" className=''>{<FormattedMessage id="admin.manage-doctor.note"/>}</label>
                        <input type="text" className='form-control' onChange={(event) => this.handleOnChangeText(event,'note')}  value={this.state.note}/>
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} 
                        // truyền props xuống thằng con nên ko cần arrow function đối với event onChange
                        onChange={this.handleEditorChange} 
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button className={hasOldData === true ? 'save-content-doctor': 'create-content-doctor'}
                    onClick={() => {this.handleSaveContentMarkdown()}}
                >
                    {hasOldData === true ? <span><FormattedMessage id="admin.manage-doctor.save"/></span>: <span><FormattedMessage id="admin.manage-doctor.create"/></span>}    
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctor: state.admin.allDoctor,

        listPayment: state.admin.listPayment,
        listPrice: state.admin.listPrice,
        listProvince: state.admin.listProvince,
        listSpecialty: state.admin.listSpecialty,
        listClinic:  state.admin.listClinic,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        saveDetailInfoDoctorRedux: (data) =>dispatch(actions.saveDetailInfoDoctor(data)),

        getDoctorPrice: () => dispatch(actions.getDoctorPrice()),
        getDoctorPayment: () => dispatch(actions.getDoctorPayment()),
        getDoctorProvince: () => dispatch(actions.getDoctorProvince()),
        getAllSpecialty: () =>dispatch(actions.getAllSpecialtyStart()),
        getAllClinic: () =>dispatch(actions.getAllClinicStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageDoctor));
