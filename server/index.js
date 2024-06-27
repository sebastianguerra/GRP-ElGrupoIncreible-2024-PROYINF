import express from 'express';

const app = express();
const port = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/register', () => {});

app.post('/login', () => {});

app.get('/me', () => {});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
