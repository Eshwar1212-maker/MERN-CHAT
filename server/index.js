
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Message = require('./models/Message');
const ws = require('ws');
const fs = require('fs');
const { S3Client } = require('@aws-sdk/client-s3')

const app = express();


//Middleware and configurations
const morgan = require('morgan')
const bcryptSalt = bcrypt.genSaltSync(10);
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'https://mern-chat-ten.vercel.app/',
    credentials: true
}));
dotenv.config();
mongoose.set('strictQuery', true);

//Commecting to MongoDb
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Server is running and connected to database'))
    .catch((err) => console.error(err));

const jwtSecret = process.env.JWT_SECRET;

const uploadToS3 = async (path, originalFileName, mimetype) => {
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKey: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });
    console.log({ path, originalFileName, mimetype })
}

//Routes
async function getUserDataFromRequest(req, res) {
    return new Promise((res, rej) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                res(userData);
            });
        } else {
            rej('No token')
        }
    })
}
app.get('/messages/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    console.log({ userId, ourUserId });
    const messages = await Message.find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    res.json(messages);
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
});
app.get('/people', async (req, res) => {
    const users = await User.find({}, { '_id': 1, username: 1 });
    res.json(users)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                    id: foundUser._id,
                });
            });
        }
    }
});
app.post('/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username,
            password: hashedPassword,
        });
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }
});
const server = app.listen(8080);


const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, req) => {

    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username })),
            }));
        });
    }
    connection.isAlive = true;
    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
            console.log('dead');
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    });

    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1]
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
        connection.on('message', async (message, isBinary) => {
            const messageData = JSON.parse(message.toString());
            const { recipient, text, file } = messageData;
            let filename = null;

            if (file) {
                const parts = file.name.split('.')
                const ext = parts[parts.length - 1]
                filename = Date.now() + '.' + ext;
                const path = __dirname + '/uploads/' + filename
                const bufferData = new Buffer(file.data.split(',')[1], 'base64');
                fs.writeFile(path, bufferData, () => {
                    console.log('File saved ' + path);
                })
            }
            if (recipient && (text || file)) {
                const messageDoc = await Message.create({
                    sender: connection.userId,
                    recipient,
                    text,
                    file: file ? filename : null,
                });
                console.log('Created message');

                [...wss.clients]
                    .filter(e => e.userId === recipient)
                    .forEach((c) => c.send(JSON.stringify({
                        text,
                        sender: connection.userId,
                        recipient, _id: messageDoc._id,
                        file: file ? filename : null,
                        _id: messageDoc._id,
                    })));
            }
        })
    }

    //Notify everyone about online people when someone connects 
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {
                online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
            }
        ))
    })
})

