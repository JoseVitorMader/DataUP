import { Link } from 'react-router-dom';
import './style.css';

function Recebimento() {
    return (
      <div>
        <h1>Bem vindo a pagina HOME</h1>
        <br/> <br/>
        <div class="corpo">
          <p>teste para ver se fununceia</p>
          <div className="link">
          <Link to="/sobre"><button>Sobre</button></Link> <br/>
          <Link to="/contato"><button>Contato</button></Link>
          </div>
        </div>
      </div>
    );
  }
  
  export default Recebimento;