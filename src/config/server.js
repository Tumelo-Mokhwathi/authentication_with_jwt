const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

app.use(cors());

const jsonParser = bodyParser.json();

const BASE_URL = 'http://localhost:3000';
const SECRET_KEY = 'the_secret_key';

async function getUsers(res) {
  const response = await axios({
    url: `${BASE_URL}/users`,
    method: 'get',
  });
  try {
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

app.get('/users', async (req, res) => {
  getUsers(res);
});

app.post('/create-user', jsonParser, async (req, res) => {
  const {
    name, surname, email, phone, username, password, active,
  } = req.body;

  try {
    const response = await axios({
      data: {
        name,
        surname,
        email,
        phone,
        username,
        password,
        active,
      },
      url: `${BASE_URL}/users`,
      method: 'post',
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios({
      data: req.body,
      url: `${BASE_URL}/users/${id}`,
      method: 'delete',
    });

    res.status(200).json({ result: 'Deleted Successfully!' });
    console.log(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/update-user/:id', jsonParser, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios({
      data: req.body,
      url: `${BASE_URL}/users/${id}`,
      method: 'put',
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/login', jsonParser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const jsonString = fs.readFileSync('./src/database/db.json');
    const response = JSON.parse(jsonString);

    const payload = response.users.find((r) => r.email === email && r.password === password);

    if (req.body || payload) {
      const token = jwt.sign({ payload }, SECRET_KEY);

      res.status(200).json({
        token,
        email: payload.email,
        password: payload.password,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
