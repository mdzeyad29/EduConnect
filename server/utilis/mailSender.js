const nodemailer = require("nodemailer");

// const mailSender = async (email,title,body) =>{
//     try{

//         // transporter
//       // let transport = nodemailer.createTransport({
//       //    host:process.env.MAIL_HOST,
//       //    auth:{
//       //       user:process.env.MAIL_USER,
//       //       pass:process.env.MAIL_PASS,
//       //    }
//       // })
//       const transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'gretchen54@ethereal.email',
//             pass: 'HfUZxyExh1jVK1WAcj'
//         }
//     });
//       let info = await transporter.sendMail({
//         from:`EduCOnnect || SoftEngineer-Mohd Zeyad`,
//         to:`${email}`,
//         subject:`${title}`,
//         html:`${body}`
//       })
//       console.log("this is the info of send mail",info);
//       return info;
//     }catch(error){
// console.log("Issue in Send mail",error);
//     }
// }

//2nd way
const mailSender = async (email, title, body) => {
  try{
          let transporter = nodemailer.createTransport({
              host:process.env.MAIL_HOST,
              auth:{
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASS,
              }
          })


          let info = await transporter.sendMail({
              from: 'EduConnect',
              to:`${email}`,
              subject: `${title}`,
              html: `${body}`,
          })
          console.log(info);
          return info;
  }
  catch(error) {
      console.log(error.message);
  }
}

module.exports = mailSender;