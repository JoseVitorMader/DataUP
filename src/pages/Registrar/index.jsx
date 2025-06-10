import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import './style.css';
import { db } from '../../firebase.js';

const Cadastro = () => {
  const [nomeEscola, setNomeEscola] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSed, setIsSed] = useState(false);
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

    if (!nomeEscola.trim()) {
      setError("Informe o nome da escola.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Verifica se a escola já existe
      const escolasRef = ref(db, 'escolas');
      const snapshotEscolas = await get(escolasRef);
      let escolaExists = false;
      if (snapshotEscolas.exists()) {
        const escolas = snapshotEscolas.val();
        escolaExists = Object.values(escolas).some(
          escola => escola.nome.trim().toLowerCase() === nomeEscola.trim().toLowerCase()
        );
      }
      if (escolaExists) {
        setError("Esta escola já está cadastrada.");
        return;
      }

      // Verifica se o e-mail já existe
      const usersRef = ref(db, 'users');
      const snapshotUsers = await get(usersRef);
      if (snapshotUsers.exists()) {
        const users = snapshotUsers.val();
        const emailExists = Object.values(users).some(
          user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (emailExists) {
          setError("Este e-mail já está cadastrado.");
          return;
        }
      }

      // Cria a escola e o usuário ADM
      const idEscola = Date.now().toString();
      await set(ref(db, 'escolas/' + idEscola), {
        nome: nomeEscola.trim(),
        isSed: isSed // Salva se é SED
      });

      const userId = idEscola + '_adm';
      await set(ref(db, 'users/' + userId), {
        email: email.trim().toLowerCase(),
        senha: password.trim(),
        ADM: true,
        ADMMASTER: false,
        idEscola: idEscola
      });

      navigate('/');
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Erro ao cadastrar escola.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleRegister}>
      <h1>Cadastro de Escola</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Nome da Escola"
        value={nomeEscola}
        onChange={(e) => setNomeEscola(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email do responsável"
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
      <div className="custom-radio-group">
        <label className="custom-radio-label">
          <input
            type="radio"
            name="sed"
            value="true"
            checked={isSed === true}
            onChange={() => setIsSed(true)}
          />
          Escola da SED
        </label>
        <label className="custom-radio-label">
          <input
            type="radio"
            name="sed"
            value="false"
            checked={isSed === false}
            onChange={() => setIsSed(false)}
          />
          Escola NÃO SED
        </label>
      </div>
      <button type="submit">Cadastrar Escola</button>
      <button type="button" className="small-button" onClick={() => navigate('/login')}>Voltar</button>
    </form>
  );
};

export default Cadastro;