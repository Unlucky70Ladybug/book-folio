import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/home/home'
import SignUpPage from './pages/auth/signup/signup'
import LoginPage from './pages/auth/login/login'
import Header from './pages/components/layouts/header/header'
import Footer from './pages/components/layouts/footer/footer'
import { AuthProvider } from './pages/providers/auth-provides'
import NotificationBar from './pages/components/notification-bar'
import { NotificationProvider } from './pages/providers/notification-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Header />
          <NotificationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Footer />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
