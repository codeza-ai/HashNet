import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url';

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
// This is because we have set the type as module in package.json
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/assets');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

// ROUTES WITH FILES
import {register} from './controllers/auth.js';
// This is a seperate controller because of the file upload
app.post('/auth/register', upload.single('picture'), register);
import {createPost} from './controllers/posts.js';
app.post('/posts', verifyToken, upload.single('image'), createPost);


// ROUTES
import authRoutes from './routes/auth.js';
app.use('/auth', authRoutes);
import userRoutes from './routes/users.js';
app.use('/users', userRoutes);
import postRoutes from './routes/posts.js';
app.use('/posts', postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT, ()=> console.log(`Server is running on port: ${PORT}`));
}).catch((error)=>{
    console.log(`${error} did not connect`);
});
