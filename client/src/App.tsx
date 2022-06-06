import { Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      Welcome to your React App
      <Routes>
        <Route path="/" element={<div>This is home signup</div>} />
        <Route path="/login" element={<div>Welcome to login </div>} />
      </Routes>
    </div>
  );
}

export default App;
