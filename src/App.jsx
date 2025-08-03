import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Rewards from './components/Rewards'; // Importamos el nuevo componente

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/rewards" element={<Rewards />} /> {/* Nueva ruta */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;