import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Intake from './pages/Intake';
import Session from './pages/Session';
import Summary from './pages/Summary';
import Clinician from './pages/Clinician';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Intake />} />
            <Route path="/session" element={<Session />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/clinician" element={<Clinician />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
