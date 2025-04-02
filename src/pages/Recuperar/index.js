import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import './style.css';

const firebaseConfig = {
  apiKey: "AIzaSyCLEL9RdqRoop0n2Dc2c0bqzsKagv4ZaCU",
  authDomain: "tanamedida-2e7a3.firebaseapp.com",
  databaseURL: "https://tanamedida-2e7a3-default-rtdb.firebaseio.com",
  projectId: "tanamedida-2e7a3",
  storageBucket: "tanamedida-2e7a3.firebasestorage.app",
  messagingSenderId: "490709823146",
  appId: "1:490709823146:web:a3c389cab4954757f5aad3",
  measurementId: "G-QP4XP50HGR"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('recover-page');
    return () => {
      document.body.classList.remove('recover-page');
    };
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError("Por favor, insira um email válido.");
      return;
    }

    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailExists = Object.values(users).some(user => user.email === email);

        if (emailExists) {
          // Envia a solicitação para o backend
          const response = await fetch('http://localhost:5000/send-reset-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, resetLink: 'http://localhost:3000/resetar' }),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage("Um email de recuperação foi enviado. Verifique sua caixa de entrada.");
          } else {
            setError(data.error || "Erro ao enviar email.");
          }
        } else {
          setError("Este e-mail não está registrado em nosso sistema.");
        }
      } else {
        setError("Nenhum usuário encontrado no sistema.");
      }
    } catch (err) {
      setError(`Erro ao verificar email: ${err.message}`);
      console.error("Erro Firebase:", err);
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handlePasswordReset}>
        <h1>Recuperar Senha</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Email</button>
        <div className="button-group">
          <button type="button" className="small-button" onClick={() => navigate('/')}>Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default RecuperarSenha;
