import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
          <Toaster />
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
