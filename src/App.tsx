import './App.scss';
import { BsCurrencyExchange } from 'react-icons/bs';

function App() {
  return (
    <div className="App">
      <div className="main-container">
        <div className="heading">
          <h1>Consersor de valores</h1>
          <h6>Dolar: R$5,00</h6>
        </div>
        <div className="main-panel">
          <div className="currency-panel">
            <select name="" id="">
              <option value="tes">tes</option>
              <option value="tes">tes2</option>
            </select>
            <input type="text" />
          </div>
          <BsCurrencyExchange className="exchange-icon" />
          <div className="currency-panel">
            <select name="" id="">
              <option value="tes">tes</option>
            </select>
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
