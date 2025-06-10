import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import './style.css';

function HomePage() {
  const [userType, setUserType] = useState(null);
  const [escolas, setEscolas] = useState([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca as escolas cadastradas no banco
    const escolasRef = ref(db, 'escolas');
    onValue(escolasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // data: { idEscola: { nome: ... }, ... }
        const lista = Object.entries(data).map(([id, value]) => ({
          id,
          nome: value.nome
        }));
        setEscolas(lista);
      }
    });
  }, []);

  const handleUserSelection = (type) => {
    setUserType(type);
    if (type === 'funcionario') {
      localStorage.setItem('tipoUsuario', 'funcionario');
      navigate('/login');
    }
    // Para estudante, mostra o select de escola
  };

  const handleAlunoContinuar = () => {
    if (!escolaSelecionada) return;
    const sessionData = {
      idEscola: escolaSelecionada,
      tipoUsuario: 'estudante',
      expiry: Date.now() + 2 * 60 * 60 * 1000 // 2 horas de validade, se quiser
    };
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('tipoUsuario', 'estudante');
    localStorage.setItem('idEscola', escolaSelecionada);
    navigate('/cardapios');
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

        {userType === 'estudante' && (
          <div style={{ marginTop: 30 }}>
            <label htmlFor="escola-select" style={{ fontWeight: 'bold' }}>Selecione sua escola:</label>
            <select
              id="escola-select"
              value={escolaSelecionada}
              onChange={e => setEscolaSelecionada(e.target.value)}
              style={{ margin: '10px 0', padding: '10px', borderRadius: '6px', fontSize: '1rem' }}
            >
              <option value="">Selecione...</option>
              {escolas.map(escola => (
                <option key={escola.id} value={escola.id}>{escola.nome}</option>
              ))}
            </select>
            <button
              className="user-type-button"
              style={{ marginTop: 10 }}
              onClick={handleAlunoContinuar}
              disabled={!escolaSelecionada}
            >
              Continuar
            </button>
          </div>
        )}

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