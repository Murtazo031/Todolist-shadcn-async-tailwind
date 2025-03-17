import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Todolist from './todolist'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Todolist/>
  </StrictMode>,
)
