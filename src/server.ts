import * as express from 'express';
import {DataSource} from "typeorm"
import config from './config/config';
import Logging from "./library/Logging";
import { Employe } from "./models/Employe";
import { User } from "./models/User";
import { createUserRouter } from './routes/user';
import { createEmployeRouter } from './routes/employe';
import{file} from './routes/file'


const { PDFDocument } = require('pdf-lib');
const fs = require('fs');




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

    for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
      const splitDoc = await PDFDocument.create();
      const [copiedPage] = await splitDoc.copyPages(pdfDoc, [pageNumber]);

      splitDoc.addPage(copiedPage);

      const splitPDFPath = `paix/${pageNumber + 1}.pdf`;
      const splitPDFBytes = await splitDoc.save();

      fs.writeFileSync(splitPDFPath, splitPDFBytes);
      console.log(`Page ${pageNumber + 1} saved to ${splitPDFPath}`);
    }
    console.log('PDF split successfully.');
    res.send('PDF split successfully.');
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
          month = req.body.month; 
          year = req.body.year; 
          checksum = raw.toString('hex');
          const fileName = `${month}_${year}_${checksum}${path.extname(file.originalname)}`;
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


       