import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase'; 
import emailjs from '@emailjs/browser';
import './style.css';

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
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const emailExists = Object.values(users).some(user => user.email === email);

        if (emailExists) {
          await emailjs.send(
            'service_6srk4ni',     
            'template_ge9r3dr',    
            {
              to_email: email,    
              reset_link: 'https://tanamedida.onrender.com/resetar' 
            },
            'TpykPSwk5qN8sLLfN'     
          );

          setMessage("Um email de recuperação foi enviado. Verifique sua caixa de entrada.");
        } else {
          setError("Este e-mail não está registrado em nosso sistema.");
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
