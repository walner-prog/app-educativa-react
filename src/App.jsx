import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Rewards from './components/Rewards';
import PlanBasic from './components/PlanBasic';
import PricingPage from './components/pricing';
import { SignIn, SignUp } from '@clerk/clerk-react';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/plan-basic" element={<PlanBasic />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
