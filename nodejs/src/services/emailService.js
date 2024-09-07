require('dotenv').config();

const nodemailer = require("nodemailer");
let sendSimpleEmail = async(dataSend) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      
    const info = await transporter.sendMail({
        from: '" NGUYEN TAN LOC 👻" <nguyenloc02082004@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh" : "Booking informations", // Subject line
        html: getBodyEmail(dataSend),
    });  
}

let getBodyEmail = (dataSend) =>{
    let result = '';
    if(dataSend.language === 'vi'){
        result = `
            <h3>Xin chào ${dataSend.patientName} !</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care.</p>
            <p>Thông tin đặt lịch khám bệnh :</p>
            <div> <b>Thời gian: ${dataSend.time} </b></div>
            <div> <b>Bác sĩ: ${dataSend.doctorName} </b></div>
            <p>
                Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên dưới để xác nhận
                và hoàn tất thủ tục đặt lịch khám bệnh.
            </p>
            <div> <a href=${dataSend.redirectLink} target="_blank"> Nhấn vào đây </a> </div>
            <div>  <b>Vui lòng không trả lời email này !</b></div>
            <div>Xin chân thành cảm ơn.</div>
        `; // html body
    }
    if(dataSend.language === 'en'){
        result = `
            <h3>Hi ${dataSend.patientName} !</h3>
            <p>This message is sent to you because of your booking in Booking Care app </p>
            <p>Booking informations :</p>
            <div> <b>Time - Date: ${dataSend.time} </b></div>
            <div> <b>Doctor: ${dataSend.doctorName} </b></div>
            <p>
                If all the informations are exactly, let click this link to confirm you was
                booked appointment before.
            </p>
            <div> <a href=${dataSend.redirectLink} target="_blank"> Click here </a> </div>
            <div>  <b>Please don't reply this message !</b></div>
            <div>Sincerely thanks!</div>
        `; // html body
    }
    return result;
}

let sendAttachment = async(dataSend) =>{
    return new Promise(async(resolve,reject) => {
        try {
            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.EMAIL_APP,
              pass: process.env.EMAIL_APP_PASSWORD,
            },
          });
          
        const info = await transporter.sendMail({
            from: '" NGUYEN TAN LOC 👻" <nguyenloc02082004@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: dataSend.language === 'vi' ? "Kết quả khám bệnh" : "Result", // Subject line
            html: getBodyEmailAttachment(dataSend),
            attachments: [
                {
                    filename: 'Đơn thuốc(description).png',
                    content: dataSend.img.split("base64,")[1],
                    encoding: 'base64',
                }
            ],
        }); 
        resolve();
        } catch (error) {
            reject(error);
        }
    }) 
}

let getBodyEmailAttachment =(dataSend) =>{
let result = '';
    if(dataSend.language === 'vi'){
        result = `
            <h3>Xin chào ${dataSend.name} !</h3>
            <p>Bạn nhận được email này vì đã hoàn tất thủ tục khám bệnh.</p>
            <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
            <p><b>Vui lòng không trả lời lại email này !</b></p>
            <div>Xin chân thành cảm ơn.</div>
        `; // html body
    }
    if(dataSend.language === 'en'){
        result = `
            <h3>Hi ${dataSend.name} !</h3>
            <p>This message is sent to you because of your successfull in seeing doctor. </p>
            <p>Your prescription info/bill is in attachment file image. </p>
            <div>  <b>Please don't reply this message !</b></div>
            <div>Sincerely thanks!</div>
        `; // html body
    }
    return result;
}
module.exports ={
    sendSimpleEmail:sendSimpleEmail,
    sendAttachment:sendAttachment,
}

