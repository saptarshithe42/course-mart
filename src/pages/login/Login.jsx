import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'

// styles 
import './Login.css'


export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)

    navigate("/")
    // navigate(-1)
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label>
        <span>Email:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>

      <label>
        <span>Password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>

      <div>
        {!isPending && <button className="btn btn-outline-success">Login</button>}
        {isPending && <button className="btn btn-outline-success" disabled>loading</button>}
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  )
}
