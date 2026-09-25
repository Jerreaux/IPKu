import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'
import Login from './Login.tsx'
import InputNilai from './InputNilai.tsx'
import Profile from './Profile.tsx'
import Simulation from './Simulation.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/input" element={<InputNilai />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/simulation" element={<Simulation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
