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
  const [faixas, setFaixas] = useState({
    idade_6_10: 0,
    idade_11_15: 0,
    idade_16_18: 0,
    idade_19_30: 0,
    idade_30_31: 0,
  });

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

  const handleFaixaChange = (e) => {
    setFaixas({ ...faixas, [e.target.name]: Number(e.target.value) });
  };

  const calcularTotalIngrediente = (ingrediente) => {
    const dados = ingredientes[ingrediente.id];
    if (!dados) return 0;
    // Se os valores estão em miligramas, descomente a linha abaixo e comente a de cima:
    return (
    (faixas.idade_6_10 * ((dados.idade_6_10 || 0) / 1000)) +
    (faixas.idade_11_15 * ((dados.idade_11_15 || 0) / 1000)) +
    (faixas.idade_16_18 * ((dados.idade_16_18 || 0) / 1000)) +
    (faixas.idade_19_30 * ((dados.idade_19_30 || 0) / 1000)) +
    (faixas.idade_30_31 * ((dados.idade_30_31 || 0) / 1000))
    );
    // return (
    //   (faixas.idade_6_10 * (dados.idade_6_10 || 0)) +
    //   (faixas.idade_11_15 * (dados.idade_11_15 || 0)) +
    //   (faixas.idade_16_18 * (dados.idade_16_18 || 0)) +
    //   (faixas.idade_19_30 * (dados.idade_19_30 || 0)) +
    //   (faixas.idade_30_31 * (dados.idade_30_31 || 0))
    // );
  };

  function formatarQuantidadeGramas(quantidade) {
    if (quantidade >= 1000) {
      return `${(quantidade / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} Kg`;
    }
    return `${quantidade} g`;
  }

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
              src={receitaSelecionada.imagem}
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
          <h3>Informe a quantidade de pessoas por faixa etária:</h3>
          <form className="form-faixas">
            <label>
              6-10 anos:
              <input type="number" name="idade_6_10" min="0" value={faixas.idade_6_10} onChange={handleFaixaChange} />
            </label>
            <label>
              11-15 anos:
              <input type="number" name="idade_11_15" min="0" value={faixas.idade_11_15} onChange={handleFaixaChange} />
            </label>
            <label>
              16-18 anos:
              <input type="number" name="idade_16_18" min="0" value={faixas.idade_16_18} onChange={handleFaixaChange} />
            </label>
            <label>
              19-30 anos:
              <input type="number" name="idade_19_30" min="0" value={faixas.idade_19_30} onChange={handleFaixaChange} />
            </label>
            <label>
              30-31 anos:
              <input type="number" name="idade_30_31" min="0" value={faixas.idade_30_31} onChange={handleFaixaChange} />
            </label>
          </form>
          <h3>Ingredientes (quantidade total):</h3>
          <ul>
            {Object.values(receitaSelecionada.ingredientes).map(ingrediente => (
              <li key={ingrediente.id}>
                {obterNomeIngrediente(ingrediente.id)}: {formatarQuantidadeGramas(calcularTotalIngrediente(ingrediente))}
              </li>
            ))}
          </ul>
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