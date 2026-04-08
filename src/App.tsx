import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar/NavBar';
import { PatientView, ProviderView, VoiceInput } from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<PatientView />} />
          <Route path="/provider" element={<ProviderView />} />
          <Route path="/voice" element={<VoiceInput />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;