import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child, set } from 'firebase/database';
import { db } from '../../firebase.js';
import './style.css';

const SESSION_KEY = 'userSession';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [escola, setEscola] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  // Checa sessão ao carregar a tela
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session && session.expiry > Date.now()) {
      // Sessão válida, redireciona para home
      navigate('/home');
    } else {
      // Remove sessão expirada
      localStorage.removeItem(SESSION_KEY);
    }
  }, [navigate]);

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
          // Checa escola, email e senha
          if (
            user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
            user.senha.trim() === password.trim() &&
            user.idEscola &&
            escola.trim().toLowerCase() === getEscolaNomeById(user.idEscola, db)
          ) {
            userFound = { ...user, key };
          }
        });

        if (userFound) {
          // Busca se a escola é da SED
          const escolaSnap = await get(child(ref(db), `escolas/${userFound.idEscola}`));
          const isSed = escolaSnap.exists() && escolaSnap.val().isSed === true;

          // Salva sessão com expiração de 2h e info SED
          const sessionData = {
            idEscola: userFound.idEscola,
            email: userFound.email,
            isADM: userFound.ADM ? 'true' : 'false',
            isADMMASTER: userFound.ADMMASTER ? 'true' : 'false',
            tipoUsuario: userFound.tipoUsuario || 'funcionario',
            key: userFound.key,
            isSed: isSed ? 'true' : 'false',
            expiry: Date.now() + 2 * 60 * 60 * 1000 // 2 horas
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
          localStorage.setItem('isADM', userFound.ADM ? 'true' : 'false');
          localStorage.setItem('isADMMASTER', userFound.ADMMASTER ? 'true' : 'false');
          localStorage.setItem('tipoUsuario', userFound.tipoUsuario || 'funcionario');
          localStorage.setItem('isSed', isSed ? 'true' : 'false');

          // Opcional: salva login ativo no banco (para auditoria)
          await set(ref(db, `activeSessions/${userFound.key}`), {
            email: userFound.email,
            idEscola: userFound.idEscola,
            loginAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          });

          navigate('/home');
        } else {
          setError("Email, senha ou escola inválidos.");
        }
      } else {
        setError("Nenhum usuário encontrado.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao acessar o banco de dados.");
    }
  };

  // Função auxiliar para buscar nome da escola pelo id (sincrona, pois você pode manter um cache ou buscar antes)
  function getEscolaNomeById(idEscola, dbInstance) {
    // Aqui você pode implementar um cache ou buscar do localStorage.
    // Para simplificação, vamos assumir que o nome digitado é o id (caso use o id como nome).
    // O ideal é buscar o nome da escola pelo id no banco e comparar.
    return escola.trim().toLowerCase();
  }

  // Logout automático após 2h
  useEffect(() => {
    const interval = setInterval(() => {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session && session.expiry <= Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        navigate('/login');
      }
    }, 60 * 1000); // Checa a cada minuto

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h1>Tá Na Medida!</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Escola"
        value={escola}
        onChange={(e) => setEscola(e.target.value)}
        required
      />
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
  );
};

export default Login;
