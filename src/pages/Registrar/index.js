import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
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
const db = getDatabase(app);

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('register-page');
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const userId = Date.now().toString();
      set(ref(db, 'users/' + userId), {
        email: email.trim().toLowerCase(),
        senha: password.trim()
      });

      navigate('/'); // Redireciona para a tela de login após o cadastro
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleRegister}>
        <h1>Registro</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
        <button type="button" className="small-button" onClick={() => navigate('/')}>Voltar</button>
      </form>
    </div>
  );
};

export default Cadastro;