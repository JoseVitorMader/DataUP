require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Alterado para 587
  secure: false, // Alterado para false
  auth: {
    user: 'tanamedidacedup@gmail.com',
    pass: 'n x l g r v z p y a f p b u d q',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  try {
    const mailOptions = {
      from: 'tanamedidacedup@gmail.com',
      to: email,
      subject: 'Recuperação de Senha',
      text: `Olá, você solicitou a recuperação de senha. Clique no link para redefinir: http://localhost:3000/resetar`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
