import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage.tsx'
import Terminal from './Pages/Terminal.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App />} />
    <Route path="/terminal" element={<Terminal />}/>
    <Route path="*" element={<NoPage />} />
    {/* <Route path="/access" element={<div>Access Page</div>} /> */}
   </Routes>
  </BrowserRouter>
)
