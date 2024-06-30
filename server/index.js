import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { createUser, findUser, verifyUser } from './database.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log('register', username, password);
  if (findUser(username)) {
    res.status(400).send('User already exists');
  } else {
    createUser(username, password);
    res.send('User registered');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('login', username, password);
  if (verifyUser(username, password)) {
    res.json({ token: 'very real token' });
  } else {
    res.status(401).send('Login failed');
  }
});

app.get('/me', (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token || token !== "Bearer very real token") {
    res.status(401).send('Unauthorized');
    return;
  }
  res.json({
    username: 'asdf',
  })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
