import React, { useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase.js'; // ✅ Firebase centralizado
import './style.css';

function CadastrarRecebimento() {
  const [quantidade, setQuantidade] = useState('');
  const [produto, setProduto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calcularTotal = () => {
    const qtd = parseFloat(quantidade.replace(',', '.')) || 0;
    const valor = parseFloat(valorUnitario.replace(',', '.')) || 0;
    return (qtd * valor).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const snapshot = await new Promise((resolve, reject) => {
        const recebimentosRef = ref(db, 'recebimentos');
        onValue(recebimentosRef, resolve, reject, { onlyOnce: true });
      });

      let count = 1;
      if (snapshot.exists()) {
        const data = snapshot.val();
        count = Object.keys(data).length + 1;
      }

      const total = calcularTotal();
      const recebimento = {
        quantidade,
        produto,
        codigo,
        valorUnitario,
        valorTotal: total
      };

      await set(ref(db, `recebimentos/re${count}`), recebimento);
      setSuccess(`Recebimento re${count} cadastrado com sucesso!`);

      // Limpa os campos
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
