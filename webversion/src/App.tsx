import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CharacterProvider } from './contexts/CharacterContext';
import Home from './pages/home/home';
import Login from './pages/auth/login/login';
import Register from './pages/auth/register/register';
import Profile from './pages/profile/profile';
import Notes from './pages/notes/notes';
import BackstoryPage from './pages/backstory/backstory';
import Combat from './pages/combat/combat';
import Skills from './pages/skills/skills';
import Proficiencies from './pages/proficiencies/proficiencies';
import Group from './pages/group/group';
import Attributes from './pages/attributes/attributes';
import CharacterCreation from './pages/characterCreation/characterCreation';
import { ModalExample } from './components/modal';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CharacterProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:characterId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/backstory" element={<ProtectedRoute><BackstoryPage /></ProtectedRoute>} />
              <Route path="/combat" element={<ProtectedRoute><Combat /></ProtectedRoute>} />
              <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
              <Route path="/proficiencies" element={<ProtectedRoute><Proficiencies /></ProtectedRoute>} />
              <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
              <Route path="/attributes" element={<ProtectedRoute><Attributes /></ProtectedRoute>} />
              <Route path="/create-character" element={<ProtectedRoute><CharacterCreation /></ProtectedRoute>} />
              <Route path="/modal-example" element={<ModalExample />} />
            </Routes>
          </Router>
        </CharacterProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
