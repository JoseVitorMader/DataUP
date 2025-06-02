import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { ref, get, set } from 'firebase/database';
import './style.css';
import { db } from '../../firebase.js';

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
      // Verifica se o e-mail já existe
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailExists = Object.values(users).some(
          user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (emailExists) {
          setError("Este e-mail já está cadastrado.");
          return;
        }
      }

      const userId = Date.now().toString();
      await set(ref(db, 'users/' + userId), {
        email: email.trim().toLowerCase(),
        senha: password.trim(),
        ADM: false 
      });

      navigate('/');
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Erro ao cadastrar usuário.");
    }
  };
  
  return (
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
        <button type="button" className="small-button" onClick={() => navigate('/login')}>Voltar</button>
      </form>
  );
};

export default Cadastro;