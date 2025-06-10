import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update } from 'firebase/database';
import { db } from '../../firebase'; 
import './style.css';

const ResetarSenha = () => {
  const [email, setEmail] = useState('');
  const [escola, setEscola] = useState('');
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

    if (!email || !novaSenha || !escola) {
      setError("Por favor, insira o nome da escola, um email válido e uma nova senha.");
      return;
    }

    try {
      // Busca o id da escola pelo nome
      const escolasRef = ref(db, 'escolas');
      const snapshotEscolas = await get(escolasRef);
      let idEscola = null;
      if (snapshotEscolas.exists()) {
        const escolas = snapshotEscolas.val();
        for (const [key, value] of Object.entries(escolas)) {
          if (value.nome.trim().toLowerCase() === escola.trim().toLowerCase()) {
            idEscola = key;
            break;
          }
        }
      }
      if (!idEscola) {
        setError("Escola não encontrada.");
        return;
      }

      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find(
          key => users[key].email === email && users[key].idEscola === idEscola
        );

        if (userKey) {
          await update(ref(db, `users/${userKey}`), { senha: novaSenha });
          setMessage("Senha redefinida com sucesso!");
        } else {
          setError("Este e-mail não está registrado para esta escola.");
        }
      } else {
        setError("Nenhum usuário encontrado no sistema.");
      }
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError(`Erro ao redefinir senha: ${err.message}`);
    }
  };

  return (
      <form className="login-form" onSubmit={handlePasswordReset}>
        <h1>Redefinir Senha</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Nome da Escola"
          value={escola}
          onChange={(e) => setEscola(e.target.value)}
          required
        />
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
          <button type="button" className="small-button" onClick={() => navigate('/login')}>Voltar</button>
        </div>
      </form>
  );
};

export default ResetarSenha;
