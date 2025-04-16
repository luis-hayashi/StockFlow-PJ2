import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logo from '../../assets/namelogo.png'
import api from '../../services/api'

function Login() {

const inputEmail = useRef()
const inputPassword = useRef()
const navigate = useNavigate()

useEffect(() => {
  const token = localStorage.getItem('token')

  if (token) {
    // Verifica se o token ainda é válido
    api.get('/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      navigate('/') // redireciona se estiver autenticado
    })
    .catch(() => {
      localStorage.removeItem('token') // token inválido, remove
    })
  }
}, [])

  async function loginUsers() {
    try {
      const response = await api.post('/login', {
        email: inputEmail.current.value,
        password: inputPassword.current.value
      })

      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (error) {
      alert('Login inválido')
    }
  }
  
  return (
    <div className="body">
      <div className="header">
        <div className="imagebox">
          <img src={logo}/>
        </div>
      </div>
      <div className="container">
        <div className="contentbox">
          <form>
            <h1>Login</h1>
            <input name="email" type='email' ref={inputEmail} placeholder='Email'/>
            <input name="password" type='password' ref={inputPassword} placeholder='Senha'/>
            <button type='button' onClick={loginUsers}>Login</button>
            <a href="/register">Não tem uma conta? Clique aqui.</a>
          </form>
        </div>
      </div>   
    </div>
  )
}

export default Login