import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userFound = Object.values(users).find(
          user => user.email === email && user.senha === password
        );

        if (userFound) {
          localStorage.setItem('userEmail', userFound.email);
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