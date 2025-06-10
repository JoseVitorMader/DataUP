import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase'; 
import emailjs from '@emailjs/browser';
import './style.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [escola, setEscola] = useState('');
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
    if (!escola) {
      setError("Por favor, insira o nome da escola.");
      return;
    }

    try {
      // Verifica se a escola existe
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

      // Verifica se o usuário existe na escola
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailExists = Object.values(users).some(
          user => user.email === email && user.idEscola === idEscola
        );

        if (emailExists) {
          await emailjs.send(
            'service_6srk4ni',     
            'template_ge9r3dr',    
            {
              to_email: email,    
              reset_link: 'https://tanamedida.vercel.app/resetar' 
            },
            'TpykPSwk5qN8sLLfN'     
          );

          setMessage("Um email de recuperação foi enviado. Verifique sua caixa de entrada.");
        } else {
          setError("Este e-mail não está registrado para esta escola.");
        }
      } else {
        setError("Nenhum usuário encontrado no sistema.");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao enviar email.");
    }
  };

  return (
      <form className="login-form" onSubmit={handlePasswordReset}>
        <h1>Recuperar Senha</h1>
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
        <button type="submit">Enviar Email</button>
        <div className="button-group">
          <button type="button" className="small-button" onClick={() => navigate('/login')}>Voltar</button>
        </div>
      </form>
  );
};

export default RecuperarSenha;
