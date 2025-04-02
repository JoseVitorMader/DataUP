import { Link } from 'react-router-dom';
import './style.css';

function Header() {
    return (
        <header>
            <div className="logo-title">
                <img src="/favicon.ico" alt="Logo" className="favicon" />
                <h2>Tá Na Medida</h2>
            </div>

            <div className='menu'>
                <Link to="/home">Home |</Link>
                <Link to="/sobre">Sobre |</Link>
                <Link to="/contato">Contato</Link>
            </div>
        </header>
    );
}

export default Header;
