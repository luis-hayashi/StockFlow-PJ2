import './style.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      navigate('/login') // ou setIsAuthenticated(false)
    } else {
      // Opcional: valida o token com o backend
      api.get('/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        setIsAuthenticated(true)
      }).catch(() => {
        localStorage.removeItem('token')
        navigate('/login')
      })
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token') // remove o token
    navigate('/login') // redireciona
  }

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem('token')
  
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      console.log(response.data) // dados do usuário autenticado
    }
  
    fetchUserData()
  }, [])

  if (!isAuthenticated) return <p>Carregando...</p>

  return (
    <button onClick={handleLogout}>
    Sair
  </button>
  )
}

export default Home