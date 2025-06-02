import React, { useState, useEffect } from 'react';
import './style.css';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const CadastroIngredientes = () => {
  const [form, setForm] = useState({
    nome: '',
    idade_6_10: '',
    idade_11_15: '',
    idade_16_18: '',
    idade_19_30: '',
    idade_30_31: ''
  });

  const [nextId, setNextId] = useState(101); // Inicia a sequência em 101

  useEffect(() => {
    const db = getDatabase();
    const ingredientesRef = ref(db, 'ingredientes');
    
    onValue(ingredientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Encontra o maior ID numérico existente
        const ids = Object.values(data)
          .map(ing => ing.id)
          .filter(id => typeof id === 'number');
        
        const maxId = ids.length > 0 ? Math.max(...ids) : 100;
        setNextId(maxId + 1);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const tipoIngrediente = localStorage.getItem('tipoIngrediente') || 'comida';
  const unidade = tipoIngrediente === 'liquido' ? 'ml' : 'gramas';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    
    
    const novoIngredienteRef = ref(db, `ingredientes/${nextId}`);
    
    try {
      await set(novoIngredienteRef, {
        id: nextId,
        nome: form.nome,
        idade_6_10: parseFloat(form.idade_6_10) * 1000 || 0,
        idade_11_15: parseFloat(form.idade_11_15) * 1000 || 0,
        idade_16_18: parseFloat(form.idade_16_18) * 1000 || 0,
        idade_19_30: parseFloat(form.idade_19_30) * 1000 || 0,
        idade_30_31: parseFloat(form.idade_30_31) * 1000 || 0,
        data_cadastro: new Date().toISOString(),
        unidade 
      });

      alert(`Ingrediente cadastrado com sucesso! ID: ${nextId}`);
      setForm({
        nome: '',
        idade_6_10: '',
        idade_11_15: '',
        idade_16_18: '',
        idade_19_30: '',
        idade_30_31: ''
      });
      
      setNextId(prevId => prevId + 1);
    } catch (error) {
      console.error("Erro ao cadastrar ingrediente:", error);
      alert("Ocorreu um erro ao cadastrar o ingrediente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Cadastro de Ingredientes</h1>
      <p className="info-text">
        (Todos os valores devem ser informados em {unidade})
      </p>
      <label>
        Nome do Alimento:
        <input 
          type="text" 
          name="nome" 
          value={form.nome} 
          onChange={handleChange} 
          required 
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? 'Leite' : 'Arroz integral'}`}
        />
      </label>
      <label>
        {unidade.charAt(0).toUpperCase() + unidade.slice(1)} per capita (6-10 anos):
        <input 
          type="number" 
          name="idade_6_10" 
          value={form.idade_6_10} 
          onChange={handleChange} 
          step="any"
          min="0"
          required
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? '150' : '150'}`}
        />
      </label>
      <label>
        {unidade.charAt(0).toUpperCase() + unidade.slice(1)} per capita (11-15 anos):
        <input 
          type="number" 
          name="idade_11_15" 
          value={form.idade_11_15} 
          onChange={handleChange} 
          step="any"
          min="0"
          required
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? '200' : '200'}`}
        />
      </label>
      <label>
        {unidade.charAt(0).toUpperCase() + unidade.slice(1)} per capita (16-18 anos):
        <input 
          type="number" 
          name="idade_16_18" 
          value={form.idade_16_18} 
          onChange={handleChange} 
          step="any"
          min="0"
          required
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? '250' : '250'}`}
        />
      </label>
      <label>
        {unidade.charAt(0).toUpperCase() + unidade.slice(1)} per capita (19-30 anos):
        <input 
          type="number" 
          name="idade_19_30" 
          value={form.idade_19_30} 
          onChange={handleChange} 
          step="any"
          min="0"
          required
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? '300' : '300'}`}
        />
      </label>
      <label>
        {unidade.charAt(0).toUpperCase() + unidade.slice(1)} per capita (30-31 anos):
        <input 
          type="number" 
          name="idade_30_31" 
          value={form.idade_30_31} 
          onChange={handleChange} 
          step="any"
          min="0"
          required
          placeholder={`Ex: ${tipoIngrediente === 'liquido' ? '280' : '280'}`}
        />
      </label>
      <button type="submit">Cadastrar Ingrediente</button>
    </form>
  );
};

export default CadastroIngredientes;