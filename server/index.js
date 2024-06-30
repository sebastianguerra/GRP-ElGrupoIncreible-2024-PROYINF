import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT ?? 3000;

const users = {};

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    res.status(400).send('User already exists');
  } else {
    users[username] = password;
    res.send('User registered');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    res.send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});

app.get('/me', (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
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
