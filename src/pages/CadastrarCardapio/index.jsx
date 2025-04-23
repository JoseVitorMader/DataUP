import React from 'react';
import './style.css'; // Importando o arquivo CSS

const CadastroCardapio = () => {
    return (
        <form>
            <label>
                Escola:
                <input type="text" name="Escola" />
            </label>
            <br />
            <label>
                Nome:
                <input type="text" name="Nome" required />
            </label>
            <br />
            <input type="url" name="webpage" />
        </form>
    );
};

export default CadastroCardapio;
