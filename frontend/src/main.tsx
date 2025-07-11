import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage.tsx'
import Login from './Pages/Login.tsx'
import Desktop from './Pages/Desktop.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App />} />
    <Route path="/terminal" element={<Desktop />}/>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<NoPage />} />
    {/* <Route path="/access" element={<div>Access Page</div>} /> */}
   </Routes>
  </BrowserRouter>
)
