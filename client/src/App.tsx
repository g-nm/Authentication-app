import { Route, Routes } from 'react-router-dom';
import './App.css';
import Credentials from './Components/Credentials/Credentials';
import { Action } from './types';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Credentials />} />
        <Route path="/login" element={<Credentials action={Action.LOGIN} />} />
      </Routes>
    </div>
  );
}

export default App;
