// Estilizacão
import '../../../../public/defaultCSS/form_container.css'
import { MdKeyOff, MdKey } from 'react-icons/md'
// Hooks
import { useState } from 'react'
// Requisições
import { api } from '../../../axiosConfig'
// Funções
import formatPhone from '../../../func/formatPhone'
// Roteamento
import { Link, useNavigate } from 'react-router-dom'
// Componentes
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'


const Register = () => {

  const navigate = useNavigate()

  const [load, setLoad] = useState(false)
  const [checkedCnpj, setCheckedCnpj] = useState(false)

  const [showKey, setShowKey] = useState({key1: false, key2: false})

  const [cnpj, setCnpj] = useState('')
  const [name, setName] = useState('')
  const [social, setSocial] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cnpj || !name || !social || !email || !phone || !password || !confirmPassword) {
      return toast.warning('Preencha todos os campos!')
    }
    if (phone.length != 14) {
      return toast.warning('Complete o campo de telefone!')
    }
    if (cnpj.length != 18) {
      return toast.warning('Complete o campo de CNPJ!')
    }

    if (password.length < 6) {
      return toast.warning('A senha deve conter no mínimo 6 caracteres!')
    }

    setLoad(true)

    await api.post('client/register', {
      cnpj, name, social, email, phone, password, confirmPassword
    }).then((res) => {
      const id = res.data.data[0]
      const email = res.data.data[1]

      navigate(`/confirm-email/${id}/${email}`)
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
    setLoad(false)
  }

  const checkCnpj = async (e) => {
    e.preventDefault()
    if (cnpj.length != 14) {
      return toast.warning('Complete o campo de CNPJ!')
    }
    let cleanCnpj = cnpj.replace(/[^0-9]/g, '')
    if (cleanCnpj.length != 14) {
      return toast.warning('Digite somente os números do CNPJ!')
    }

    setLoad(true)

    await api.get(`/client/check-cnpj/${cleanCnpj}`).then((res) => {
      if (res.data.data.status == 'ERROR') {
        toast.error(res.data.data.message)
      } else {
        setSocial(res.data.data.nome)
        setName(res.data.data.fantasia)
        setEmail(res.data.data.email)
        setCnpj(res.data.data.cnpj)
        setCheckedCnpj(true)
      }
    }).catch((err) => {
      console.log(err)
      toast.error(err.response.data.message)
    })

    setLoad(false)
  }

  return (
    <div className='form_container'>
      {load && <Load />}

      <h1>Página de cadastro de empresas.</h1>
      <h2>Insira os dados da empresa que deseja cadastrar em nosso sistema.</h2>

      {!checkedCnpj && <form onSubmit={checkCnpj}>
        <label>
          <span>CNPJ:</span>
          <span className='small_text'>Somente números</span>
          <input maxLength='14' type='text' name='cnpj' placeholder='Insira o CNPJ...' required onChange={(e) => setCnpj(e.target.value)} value={cnpj} />
        </label>
        <button className='btn'>Verificar</button>
      </form>
      }
      {checkedCnpj && <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input type='text' name='name' placeholder='Insira o nome fantasia...' required onChange={(e) => setName(e.target.value)} value={name} />
        </label>
        <label>
          <span>Razão social:</span>
          <input type='text' name='social' placeholder='Insira a razão social...' required onChange={(e) => setSocial(e.target.value)} value={social} />
        </label>
        <label>
          <span>E-mail:</span>
          <span className='small_text'>Insira um email ativo e acessível</span>
          <input type='email' name='email' placeholder='Insira o email...' required onChange={(e) => setEmail(e.target.value)} value={email} />
        </label>
        <label>
          <span>Telefone:</span>
          <input autoComplete='off' type='text' name='phone' placeholder='Insira o telefone...' required onChange={(e) => {
            let { value } = formatPhone(e, phone)
            setPhone(value)
          }} onKeyDown={(e) => {
            if (e.code == 'Backspace' || e.code == 'Delete') { setPhone(phone.substring(0, phone.length - 1)) }
          }} value={phone} maxLength='14' />
        </label>
        <label>
          <span>Senha:</span>
          <span className='inputBox'>
            <input type={showKey.key1 ?'text' : 'password'} name='password' placeholder='Insira sua senha...' required onChange={(e) => setPassword(e.target.value)} value={password} />
            <span className='keyIcon' onClick={() => setShowKey({key1: !showKey.key1, key2: showKey.key2})}>{showKey.key1 ? <MdKey /> : <MdKeyOff />}</span>
          </span>
        </label>
        <label>
          <span>Confirmação de senha:</span>
          <span className='inputBox'>
            <input type={showKey.key2 ?'text' : 'password'} name='confirmPassword' placeholder='Confirme sua senha...' required onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
            <span className='keyIcon' onClick={() => setShowKey({key2: !showKey.key2, key1: showKey.key1})}>{showKey.key2 ? <MdKey /> : <MdKeyOff />}</span>
          </span>
        </label>
        <span className='obs'>OBS: Certifique-se de que todos os dados são corretos e válidos.</span>
        <button className='btn'>Cadastrar</button>
      </form>
      }
      <span className='spanLink'>
        <p>Já tem cadastro?</p>
        <Link to='/login'> Fazer Login</Link>
      </span>
    </div>
  )
}

export default Register