import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import './ManagePatient.scss';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatient ,sendRemedyForPatient} from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            currentDate :moment(new Date()).startOf('day').valueOf(),
            listPatient: [],
            isOpenModalRemedy: false,
            dataModal:{},
            timeType:'',
            date: '',
            name: '',
            isShowLoading: false,
        }
    }
    
    async componentDidMount() {
        await this.getDataPatient();
    }
    getDataPatient = async() =>{
        let user = this.props.user;
        let currentDate = this.state.currentDate;
        let formattedDate = new Date(currentDate).getTime();
        let res = await getAllPatient({
            id: user.id,
            date : formattedDate,
        })
        if(res && res.errCode === 0){
            this.setState({
                listPatient : res.data,
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }
    handleOnChangeDatePicker =async(date) =>{
        this.setState({
            currentDate : date[0],
        }, async() =>{
            await this.getDataPatient();
        })
        
    }

    confirmBooking = (item) =>{
        let name ='';
        if(item && item.patientData.lastName){
            name = `${item.patientData.firstName}${item.patientData.lastName}`;
        }
        else {
            name = `${item.patientData.firstName}`;
        }
        let data = {
            doctorId : item.doctorId,
            patientId : item.patientId,
            email: item.patientData.email,
            timeType : item.timeType,
            date: item.date,
            name : name,
        }
        this.setState({
            isOpenModalRemedy: true,
            dataModal : data,
        })

    }
    closeModalRemedy = () =>{
        this.setState({
            isOpenModalRemedy: false,
            dataModal : {},
        })
    }

    sendRemedy = async(data) =>{
        let {dataModal} = this.state;
        this.setState({
            isShowLoading:true,
        })
        let res = await sendRemedyForPatient({
            email : data.email,
            img : data.imgBase64,
            doctorId : dataModal.doctorId,
            patientId:dataModal.patientId,
            timeType:dataModal.timeType,
            date:dataModal.date,
            language : this.props.language,
            name: dataModal.name,
            description: data.description,
        })
        if(res && res.errCode === 0){
            this.closeModalRemedy();
            toast.success(res.message);
            this.setState({
                isShowLoading:false,
            })
            await this.getDataPatient();
        }
        else{
            toast.error(res.message);
            this.setState({
                isShowLoading:false,
            })
        }
    }
    render() {     
        let language = this.props.language;
        let {listPatient} = this.state;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text=''
                >
                    <RemedyModal
                    isOpenModalRemedy = {this.state.isOpenModalRemedy}
                    closeModal = {this.closeModalRemedy}
                    data = {this.state.dataModal}
                    sendRemedy = {this.sendRemedy}
                />
                <div className='manage-patient-container'>
               
                    <div className='m-p-title'>
                        QUẢN LÍ LỊCH HẸN KHÁM BỆNH 
                    </div>
                    <div className='m-p-body container-fluid'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label htmlFor="">Chọn ngày khám</label>
                                <DatePicker className='form-control'
                                    onChange = {this.handleOnChangeDatePicker}
                                    value = {this.state.currentDate}
                                    minDate = {new Date().setHours(0, 0, 0, 0)}
                                />
                            </div>
                            <div className='col-12'>
                                <label htmlFor="">Kết quả hiển thị:</label>
                                <table className='table table-striped table-hover table-bordered text-center'>
                                    <thead>
                                        <tr>
                                            <th>{language === LANGUAGES.VI ? 'STT' : 'SLOT'}</th>
                                            <th>Email</th>
                                            <th>{language === LANGUAGES.VI ? 'Họ và tên' : 'Full name'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Số điện thoại' : 'Phone number'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Lí do khám' : 'Reason'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Thời gian khám' : 'Time'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Địa chỉ' : 'Address'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Giới tính' : 'Gender'}</th>
                                            <th>{language === LANGUAGES.VI ? 'Hành động' : 'Action'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listPatient && listPatient.length > 0 ?
                                            listPatient.map((item,index) =>{
                                                return(
                                                    <tr key={index}>
                                                        <td>{index +1}</td>
                                                        <td>{item.patientData.email}</td>
                                                        <td>{item.patientData.firstName} {item.patientData.lastName}</td>
                                                        <td>{item.patientData.phonenumber}</td>
                                                        <td>{item.note}</td>
                                                        <td>{language === LANGUAGES.VI ?item.timeTypeDataBooking.valueVi: item.timeTypeDataBooking.valueEn}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{language === LANGUAGES.VI ?item.patientData.genderData.valueVi : item.patientData.genderData.valueEn}</td>
                                                        <td>
                                                            <button className='btn btn-primary btn-confirm'
                                                                onClick={() => this.confirmBooking(item)}
                                                            >
                                                                {language === LANGUAGES.VI ? 'Xác nhận' : 'Confirm'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>No data</td>
                                                    <td>
                                                        No data
                                                    </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>    
                    </div>
                </div>
                </LoadingOverlay>
                
                
            </>
            

        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
