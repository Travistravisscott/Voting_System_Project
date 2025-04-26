import nodemail from "nodemailer";
import { MongoClient } from "mongodb";
import {} from 'dotenv/config'

console.log(process.env.PORT)
const main = (gmail,otp) => {
  const transporter = nodemail.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: process.env.PORT,
    secure: process.env.SECURE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mail = {
    from: "fk4460467@gmail.com",
    to: gmail,
    subject: "Verify To Vote",
    text: `Enter this code ${otp} to Login into Voting terminal`,
  };

  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent" + info.response);
    }
  });
}  


export default main;
