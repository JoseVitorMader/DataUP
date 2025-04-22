import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
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

const ResetarSenha = () => {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('reset-page');
    return () => {
      document.body.classList.remove('reset-page');
    };
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !novaSenha) {
      setError("Por favor, insira um email válido e uma nova senha.");
      return;
    }

    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find(key => users[key].email === email);

        if (userKey) {
          // Atualiza a senha do usuário diretamente no Realtime Database
          await update(ref(database, `users/${userKey}`), { senha: novaSenha });
          setMessage("Senha redefinida com sucesso!");
        } else {
          setError("Este e-mail não está registrado em nosso sistema.");
        }
      } else {
        setError("Nenhum usuário encontrado no sistema.");
      }
    } catch (err) {
      setError(`Erro ao redefinir senha: ${err.message}`);
      console.error("Erro Firebase:", err);
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handlePasswordReset}>
        <h1>Redefinir Senha</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Digite a nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />
        <button type="submit">Redefinir Senha</button>
        <div className="button-group">
          <button type="button" className="small-button" onClick={() => navigate('/')}>Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default ResetarSenha;
