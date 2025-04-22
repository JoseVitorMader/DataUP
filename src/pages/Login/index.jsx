import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "users"));

      if (snapshot.exists()) {
        const users = snapshot.val();
        let userFound = null;

        Object.keys(users).forEach((key) => {
          const user = users[key];
          if (user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
              user.senha.trim() === password.trim()) {
            userFound = user;
          }
        });

        if (userFound) {
          localStorage.setItem('isADM', userFound.ADM ? 'true' : 'false');
          navigate('/home'); 
        } else {
          setError("Email ou senha inválidos.");
        }
      } else {
        setError("Nenhum usuário encontrado.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao acessar o banco de dados.");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Tá Na Medida!</h1>
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
        <button type="submit">Entrar</button>
        <div className="button-group">
          <button type="button" className="small-button cadastro-button" onClick={() => navigate('/cadastro')}>Cadastrar</button>
          <button type="button" className="small-button recuperar-button" onClick={() => navigate('/recuperar')}>Recuperar Senha</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
