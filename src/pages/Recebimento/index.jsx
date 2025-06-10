import React, { useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase.js';
import './style.css';

function CadastrarRecebimento() {
  const [quantidade, setQuantidade] = useState('');
  const [produto, setProduto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Recupera o idEscola da sessão do usuário logado
  const session = JSON.parse(localStorage.getItem('userSession'));
  const idEscola = session?.idEscola;

  const calcularTotal = () => {
    const qtd = parseFloat(quantidade.replace(',', '.')) || 0;
    const valor = parseFloat(valorUnitario.replace(',', '.')) || 0;
    return (qtd * valor).toFixed(2);
  };

  const verificarEAdicionarIngrediente = async (nomeProduto) => {
    try {
      const ingredientesRef = ref(db, 'ingredientes');
      const snapshot = await new Promise((resolve, reject) => {
        onValue(ingredientesRef, resolve, reject, { onlyOnce: true });
      });

      let ingredienteExiste = false;
      if (snapshot.exists()) {
        const ingredientes = snapshot.val();
        ingredienteExiste = Object.values(ingredientes).some(
          ing => ing.nome.toLowerCase() === nomeProduto.toLowerCase()
        );
      }

      if (!ingredienteExiste) {
        let nextId = 101;
        if (snapshot.exists()) {
          const ids = Object.keys(snapshot.val()).map(Number);
          nextId = Math.max(...ids) + 1;
        }

        await set(ref(db, `ingredientes/${nextId}`), {
          id: nextId.toString(),
          nome: nomeProduto,
          idEscola: idEscola // Adiciona o id da escola ao ingrediente
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao verificar/adicionar ingrediente:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idEscola) {
      setError("Não foi possível identificar a escola. Faça login novamente.");
      return;
    }

    try {
      const ingredienteAdicionado = await verificarEAdicionarIngrediente(produto);

      const recebimentosRef = ref(db, 'recebimentos');
      const snapshot = await new Promise((resolve, reject) => {
        onValue(recebimentosRef, resolve, reject, { onlyOnce: true });
      });

      let count = 1;
      if (snapshot.exists()) {
        const data = snapshot.val();
        count = Object.keys(data).length + 1;
      }

      const recebimento = {
        codigo,
        produto,
        quantidade,
        valorUnitario,
        valorTotal: calcularTotal(),
        idEscola: idEscola // Adiciona o id da escola ao recebimento
      };

      await set(ref(db, `recebimentos/re${count}`), recebimento);

      let successMessage = `Recebimento re${count} cadastrado com sucesso!`;
      if (ingredienteAdicionado) {
        successMessage += ` O ingrediente "${produto}" foi adicionado ao estoque.`;
      }

      setSuccess(successMessage);

      setQuantidade('');
      setProduto('');
      setCodigo('');
      setValorUnitario('');
    } catch (err) {
      console.error("Erro ao cadastrar recebimento:", err);
      setError("Erro ao cadastrar recebimento.");
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastrar Recebimento</h1>
      <form onSubmit={handleSubmit} className="form-recebimento">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <input
          type="text"
          placeholder="Quantidade (KG)"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="R$ Unitário"
          value={valorUnitario}
          onChange={(e) => setValorUnitario(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="R$ Total"
          value={calcularTotal()}
          readOnly
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastrarRecebimento;