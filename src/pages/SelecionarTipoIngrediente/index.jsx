import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function SelecionarTipoIngrediente() {
  const navigate = useNavigate();

  const handleSelect = (tipo) => {
    localStorage.setItem('tipoIngrediente', tipo);
    navigate('/cadIngredientes');
  };

  return (
    <div className="selecionar-tipo-container">
      <div className="selecionar-tipo-content">
        <h1>Qual o tipo de ingrediente?</h1>
        <div className="tipo-ingrediente-buttons">
          <button
            className="tipo-ingrediente-button"
            onClick={() => handleSelect('comida')}
          >
            Comida (g)
          </button>
          <button
            className="tipo-ingrediente-button"
            onClick={() => handleSelect('liquido')}
          >
            Líquido (ml)
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelecionarTipoIngrediente;