import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { db } from '../../firebase.js';
import './style.css';




function Receitas() {
  const [receitas, setReceitas] = useState([]);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "receitas"));
        if (snapshot.exists()) {
          setReceitas(Object.values(snapshot.val()));
        }

        const ingredientesSnapshot = await get(child(dbRef, "ingredientes"));
        if (ingredientesSnapshot.exists()) {
          setIngredientes(ingredientesSnapshot.val());
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const obterNomeIngrediente = (idIngrediente) => {
    return ingredientes[idIngrediente]?.nome || "Ingrediente desconhecido";
  };

  const categorias = ["Todas", ...new Set(receitas.map(receita => receita.categoria))];

  const receitasFiltradas = receitas.filter(receita => {
    const matchesSearch = receita.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoriaAtiva === "Todas" || receita.categoria === categoriaAtiva;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1>RECEITAS</h1>
      
      {!receitaSelecionada && (
        <div className="filtros-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar receitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="categorias">
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={`botao-categoria ${categoria === categoriaAtiva ? 'ativo' : ''}`}
                onClick={() => setCategoriaAtiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {receitaSelecionada ? (
        <div className="receita-detalhes">
          <h2>{receitaSelecionada.titulo}</h2>
          {receitaSelecionada.imagem && (
            <img 
              src={
                receitaSelecionada.imagem.startsWith("http") 
                  ? receitaSelecionada.imagem 
                  : `https://${receitaSelecionada.imagem}`
              }
              alt={receitaSelecionada.titulo} 
              onError={(e) => e.target.style.display = 'none'}
              className="imagem-receita"
            />
          )}
          <p><strong>Categoria:</strong> {receitaSelecionada.categoria}</p>
          <p><strong>Tempo de Preparo:</strong> {receitaSelecionada.tempo_preparo} minutos</p>
          <p><strong>Rendimento:</strong> {receitaSelecionada.rendimento}</p>
          <h3>Ingredientes:</h3>
          <ul>
            {Object.values(receitaSelecionada.ingredientes).map(ingrediente => (
              <li key={ingrediente.id}>
                {obterNomeIngrediente(ingrediente.id)}: {ingrediente.quantidade}
              </li>
            ))}
          </ul>
          <h3>Passos de Preparo:</h3>
          <ol>
            {Object.values(receitaSelecionada.passos).map((passo, index) => (
              <li key={index}>{passo}</li>
            ))}
          </ol>
          <button className="botao-voltar" onClick={() => setReceitaSelecionada(null)}>Voltar</button>
        </div>
      ) : (
        <div className="grid-container">
          {loading ? (
            <p className="loading">Carregando receitas...</p>
          ) : receitasFiltradas.length > 0 ? (
            <div className="grid">
              {receitasFiltradas.map((receita) => (
                <button
                  key={receita.id}
                  className="botao-receita"
                  onClick={() => setReceitaSelecionada(receita)}
                >
                  {receita.titulo}
                  <span className="categoria-badge">{receita.categoria}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="nenhuma-receita">Nenhuma receita encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Receitas;