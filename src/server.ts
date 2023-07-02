import * as express from 'express';
import {DataSource} from "typeorm"
import config from './config/config';
import Logging from "./library/Logging";
import { Employe } from "./models/Employe";
import { User } from "./models/User";
import { createUserRouter } from './routes/user';
import { createEmployeRouter } from './routes/employe';
import { getRepository } from "typeorm";
import{file} from './routes/file'


const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const nodemailer = require('nodemailer');




const multer =require("multer")
import * as crypto from "crypto";
import * as path from "path";
import { File } from './models/File';
const app = express();


const upload = multer({ dest: 'uploads/' });


app.post('/api/pdfsplit', upload.single('pdfFile'),async (req, res) => {
  try {
    const pdfPath = req.file.path
    const pdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    
    const employeEmails = await Employe.find({ select: ["email"] });
    const emailList = employeEmails.map(employe => employe.email);
    const attachments = [];

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'logtari.yassine31@gmail.com', // replace with your Gmail address
        pass: 'ramdvqzmvifsrgfk', // replace with your Gmail password
      },
    });
    for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
      const splitDoc = await PDFDocument.create();
      const [copiedPage] = await splitDoc.copyPages(pdfDoc, [pageNumber]);

      splitDoc.addPage(copiedPage);

      const splitPDFBytes = await splitDoc.save();

      const mailOptions = {
        from: 'logtari.yassine31@gmail.com',
        to: emailList[pageNumber],
        subject: `Split PDF Page ${pageNumber + 1}`,
        text: `Please find the split PDF page ${pageNumber + 1} attached.`,
        attachments: [
          {
            filename: `Page ${pageNumber + 1}.pdf`,
            content: splitPDFBytes,
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log(`Email sent for page ${pageNumber + 1}:`, info.response);
        }
      });
    }

    res.send('Emails sent successfully.');
  } catch (error) {
    console.log('Error splitting PDF:', error);
    res.status(500).send('Error splitting PDF');
  }
});


//upload file function

const uploadfile = () => {
    let checksum = '';
    let month='';
    let year='';
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'files');
      },
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, raw) => {
          if (err) return cb(err);
          checksum = raw.toString('hex');
          const fileName = `${req.body.month}_${req.body.year}_${raw.toString('hex')}${path.extname(file.originalname)}`;
          cb(null, fileName);
        });
      },
    });

    const upload = multer({ storage: storage });

    app.post('/api/upload', upload.single('file'), async (req, res) => {
      try {
        const file = req.file;
        const { month, year } = req.body; 

        const newFile = new File();
        newFile.month = month;
        newFile.year = year;
        newFile.checksumpdf = checksum; 
        newFile.file = file.originalname;
        await newFile.save();

        res.status(200).json('File has been uploaded');
      } catch (error) {
        console.log(error);
        res.status(500).json('Error uploading file');
      }
    });
  };

  uploadfile();

const AppDataSource = new DataSource({
    
            type:"postgres",
            host:config.host,
            port:parseInt(config.port),
            username:config.user,
            password:config.password,
            database:config.database,
            entities:[Employe,User,File],
            synchronize:true
        })
        Logging.info("Connected to Postgres")

        app.use(express.json())
        app.use(createUserRouter)
        app.use(createEmployeRouter)
        app.use(file)
        app.listen(config.serverport,()=> {
            Logging.info(`Now running on port ${config.serverport}`)
        })


        AppDataSource.initialize()
        .then(() => {
            
        })
        .catch((error) => Logging.error(error))


       