import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import MessagesDashboard from './pages/MessagesDashboard'

const API_BASE = 'http://localhost:5000/api/auth'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const endpoint = isLogin ? '/login' : '/register'
    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, { email, password })
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <Router>
      <div className="App">
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/messages" className="nav-link">Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <header className="App-header">
              {user ? (
                <>
                  <h1>Welcome, {user.email}!</h1>
                  <p>You are successfully logged in.</p>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
              ) : (
                <>
                  <h1>{isLogin ? 'Login' : 'Register'}</h1>
                  <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
                  </form>
                  <p className="toggle-auth">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? ' Register here' : ' Login here'}
                    </span>
                  </p>
                </>
              )}
            </header>
          } />
          
          <Route path="/messages" element={<MessagesDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
