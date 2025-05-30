import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function HomePage() {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleUserSelection = (type) => {
    setUserType(type);
    if (type === 'funcionario') {
      localStorage.setItem('tipoUsuario', 'funcionario');
      navigate('/login');
    } else {
      localStorage.setItem('tipoUsuario', 'estudante');
      navigate('/cardapios');
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Bem-vindo(a)!</h1>
        <p className="welcome-subtitle">Para começar, nos diga quem está acessando?</p>
        
        <div className="user-type-buttons">
          <button 
            className="user-type-button"
            onClick={() => handleUserSelection('estudante')}
          >
            Sou Estudante
          </button>
          
          <button 
            className="user-type-button"
            onClick={() => handleUserSelection('funcionario')}
          >
            Sou Funcionário
          </button>
        </div>
        
        <div className="footer">
          <p className="footer-text">Desenvolvido por DataUp © 2025</p>
          <div className="divider"></div>
          <p className="tagline">Tá Na Medida, o portal dos estudantes da Rede Estadual de Ensino para acesso aos recursos Alimentares</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;