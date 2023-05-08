import '../../../../public/defaultCSS/form_container.css'
import { MdKeyOff, MdKey } from 'react-icons/md'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../../axiosConfig'
import { AuthContext } from '../../../context/AuthContext'
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'
import GetTokenId from '../../../func/getTokenId'

const Login = () => {

  const navigate = useNavigate()

  const [load, setLoad] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const [cnpj, setCnpj] = useState('')
  const [password, setPassword] = useState('')

  const { setUserId, setUserName } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cnpj == '' || password == '') {
      return toast.warning('Preencha todos os campos!')
    }
    if (cnpj.length != 14) {
      return toast.warning('Complete o campo de CNPJ!')
    }
    let cleanCnpj = cnpj.replace(/[^0-9]/g, '')
    if (cleanCnpj.length != 14) {
      return toast.warning('Digite somente os número do CNPJ!')
    }
    setLoad(true)

    await api.post('/client/login', { cleanCnpj, password }).then((res) => {

      const token = res.data.data[0]
      const name = res.data.data[1]

      sessionStorage.setItem("@Auth:name", JSON.stringify(name))
      sessionStorage.setItem("@Auth:token", JSON.stringify(token))

      const { tokenId, userName } = GetTokenId()
      setUserId(tokenId)
      setUserName(userName)

      setTimeout(() => {
        navigate('/logistics')
      }, 400)

    }).catch((err) => {
      toast.error(err.response.data.message)
    })

    setLoad(false)
  }


  return (
    <div className='form_container'>
      {load && <Load />}
      <h1>Faça seu login aqui.</h1>
      <h2>Insira os dados da empresa.</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <span>CNPJ:</span>
          <input maxLength='14' type='text' name='cnpj' placeholder='Insira o CNPJ...' required onChange={(e) => { setCnpj(e.target.value) }} value={cnpj} />
        </label>
        <label>
          <span>Senha:</span>
          <span className='inputBox'>
            <input type={showKey ? 'text' : 'password'} name='confirmPassword' placeholder='Confirme sua senha...' required onChange={(e) => setPassword(e.target.value)} value={password} />
            <span className='keyIcon' onClick={() => setShowKey(!showKey)}>{showKey.key2 ? <MdKey /> : <MdKeyOff />}</span>
          </span>
        </label>
        <button className='btn'>Enviar</button>
      </form>
      <span className='spanLink'>
        <p>Esqueci minha senha.</p>
        <Link to='/recover-password-email'> Recuperar.</Link>
      </span>
      <span className='spanLink'>
        <p>Ainda não tenho cadastro.</p>
        <Link to='/register'> Quero me cadastrar.</Link>
      </span>
    </div>
  )
}

export default Login