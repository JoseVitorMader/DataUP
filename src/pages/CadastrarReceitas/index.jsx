import React, { useState, useEffect } from 'react';
import { ref, set, push, onValue } from 'firebase/database';
import { db } from '../../firebase';
import './style.css';

const CadastroReceitas = () => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Prato Principal');
  const [tempoPreparo, setTempoPreparo] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [imagem, setImagem] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showIngredientesPopup, setShowIngredientesPopup] = useState(false);
  const [showPassosPopup, setShowPassosPopup] = useState(false);

  const [ingredientes, setIngredientes] = useState([]);
  const [currentIngrediente, setCurrentIngrediente] = useState({ id: '' });
  const [listaIngredientes, setListaIngredientes] = useState([]);

  const [passos, setPassos] = useState([]);
  const [currentPasso, setCurrentPasso] = useState('');

  useEffect(() => {
    const ingredientesRef = ref(db, 'ingredientes');
    onValue(ingredientesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ingredientesArray = Object.keys(data).map(key => ({
          id: key,
          nome: data[key].nome
        }));
        setListaIngredientes(ingredientesArray);
      }
    });
  }, []);

  const handleAddIngrediente = () => {
    if (!currentIngrediente.id) {
      setError("Selecione um ingrediente");
      return;
    }

    const ingredienteSelecionado = listaIngredientes.find(
      ing => ing.id === currentIngrediente.id
    );

    setIngredientes([...ingredientes, {
      id: currentIngrediente.id,
      nome: ingredienteSelecionado.nome
    }]);

    setCurrentIngrediente({ id: '' });
    setError('');
  };

  const handleAddPasso = () => {
    if (!currentPasso) {
      setError("Digite o passo da receita");
      return;
    }

    setPassos([...passos, currentPasso]);
    setCurrentPasso('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!titulo || !categoria || !tempoPreparo || !rendimento) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (ingredientes.length === 0) {
      setError("Adicione pelo menos um ingrediente");
      return;
    }

    if (passos.length === 0) {
      setError("Adicione pelo menos um passo");
      return;
    }

    try {
      const ingredientesFormatados = {};
      ingredientes.forEach((ing, index) => {
        ingredientesFormatados[`i${index + 1}`] = {
          id: ing.id
        };
      });

      const passosFormatados = {};
      passos.forEach((passo, index) => {
        passosFormatados[`p${index + 1}`] = passo;
      });

      const novaReceitaRef = push(ref(db, 'receitas'));
      const novaReceitaId = novaReceitaRef.key;

      await set(novaReceitaRef, {
        id: novaReceitaId,
        titulo,
        categoria,
        tempo_preparo: tempoPreparo,
        rendimento,
        imagem: imagem || null,
        ingredientes: ingredientesFormatados,
        passos: passosFormatados
      });

      setSuccess("Receita cadastrada com sucesso!");

      setTitulo('');
      setCategoria('Prato Principal');
      setTempoPreparo('');
      setRendimento('');
      setImagem('');
      setIngredientes([]);
      setPassos([]);
    } catch (err) {
      console.error("Erro ao cadastrar receita:", err);
      setError("Erro ao cadastrar receita.");
    }
  };

 
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cadastro-receitas-container">
      <h1>Cadastrar Nova Receita</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form-receita">
        {/* Formulário principal */}
        <div className="form-group">
          <label>Título*</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria*</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="Prato Principal">Prato Principal</option>
            <option value="Sobremesa">Sobremesa</option>
            <option value="Acompanhamento">Acompanhamento</option>
            <option value="Salada">Salada</option>
            <option value="Lanche">Lanche</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tempo de Preparo (minutos)*</label>
          <input
            type="number"
            value={tempoPreparo}
            onChange={(e) => setTempoPreparo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Rendimento*</label>
          <input
            type="text"
            value={rendimento}
            onChange={(e) => setRendimento(e.target.value)}
            placeholder="Ex: 4 porções"
            required
          />
        </div>

        <div className="form-group">
          <label>Imagem (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
          />
          {imagem && (
            <img src={imagem} alt="Pré-visualização" className="imagem-preview" />
          )}
        </div>

        <div className="form-group ingredientes-container">
          <label>Ingredientes*</label>
          <button
            type="button"
            onClick={() => setShowIngredientesPopup(true)}
            className="add-button"
          >
            Adicionar Ingredientes
          </button>

          <ul className="ingredientes-list">
            {ingredientes.map((ing, index) => (
              <li key={index}>
                {ing.nome} - {ing.quantidade}
                <button
                  type="button"
                  onClick={() => setIngredientes(ingredientes.filter((_, i) => i !== index))}
                  className="remove-button"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {showIngredientesPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Adicionar 
                <br />
                Ingrediente</h2>
              <div className="popup-form-group">
                <label>Ingrediente</label>
                <select
                  value={currentIngrediente.id}
                  onChange={(e) => setCurrentIngrediente({ id: e.target.value })}
                >
                  <option value="">Selecione um ingrediente</option>
                  {listaIngredientes.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.nome} (ID: {ing.id})</option>
                  ))}
                </select>
              </div>
              {error && <p className="error">{error}</p>}
              <div className="popup-buttons">
                <button type="button" onClick={handleAddIngrediente} className="add-button">Adicionar</button>
                <button type="button" onClick={() => { setShowIngredientesPopup(false); setError(''); }} className="cancel-button">Concluído</button>
              </div>
            </div>
          </div>
        )}

        <div className="form-group passos-container">
          <label>Modo de Preparo*</label>
          <div className="passo-input-group">
            <input
              type="text"
              value={currentPasso}
              onChange={(e) => setCurrentPasso(e.target.value)}
              placeholder="Descreva o passo"
            />
            <button type="button" onClick={handleAddPasso} className="add-button">Adicionar Passo</button>
          </div>
          <ul className="passos-list">
            {passos.map((passo, index) => (
              <li key={index}>{passo}
              <button
                  type="button"
                  onClick={() => setPassos(passos.filter((_, i) => i !== index))}
                  className="remove-button"
                >
                  Remover
                </button></li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-button">Cadastrar Receita</button>
      </form>
    </div>
  );
};

export default CadastroReceitas;
