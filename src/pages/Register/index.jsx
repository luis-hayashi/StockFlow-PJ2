import { useEffect, useState, useRef } from 'react'
import './style.css'
import logo from '../../assets/namelogo.png'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Register() {

const navigate = useNavigate()
const inputName = useRef()
const inputEmail = useRef()
const inputPassword = useRef()
const inputDocument = useRef()

  async function createUsers() {
    await api.post('/users', {
      name: inputName.current.value,
      email: inputEmail.current.value,
      password: inputPassword.current.value,
      document: inputDocument.current.value
    })

    alert("Conta criada com sucesso, " + inputName.current.value + "!")
    navigate('/login')
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
            <h1>Registre-se</h1>
            <input name="name" type='text' ref={inputName} placeholder='Nome'/>
            <input name="email" type='email' ref={inputEmail} placeholder='Email'/>
            <input name="password" type='password' ref={inputPassword} placeholder='Senha'/>
            <input name="document" type='text' ref={inputDocument} placeholder='RG ou CPF'/>
            <button type='button' onClick={createUsers}>Registrar</button>
            <a href="/login">Tem uma conta? Entre por aqui.</a>
          </form>
        </div>
      </div>   
    </div>
  )
}

export default Register