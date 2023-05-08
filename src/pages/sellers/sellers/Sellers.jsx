import { api } from '../../../axiosConfig'
import styles from './Sellers.module.css'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { toast } from 'react-toastify'
import { FaUserPlus, FaUserEdit, FaTimes } from 'react-icons/fa'
import formatPhone from '../../../func/formatPhone'
import Load from '../../../components/load/Load'
import UseGetAllSellers from '../../../hooks/UseGetAllSellers'

const Sellers = () => {

  const { userId } = useContext(AuthContext)

  const [sellers, setSellers] = useState([])
  const [toggle, setToggle] = useState(false)
  const [editToggle, setEditToggle] = useState(false)
  const [load, setLoad] = useState(true)
  const [id, setId] = useState('')

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      const { sellers, errorMessage } = await UseGetAllSellers(userId, signal)
      if (sellers) {
        setSellers(sellers)
      }
      if (errorMessage) {
        toast.error(errorMessage)
      }
    })()
    setLoad(false)

    return () => {
      abortController.abort()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !cpf || !email || !phone) {
      return toast.warning('Preencha todos os campos!')
    }
    if (cpf.length != 11) {
      return toast.warning('Complete o CPF!')
    }

    let cleanCpf = cpf.replace(/[^0-9]/g, '')
    if (cleanCpf.length != 11) {
      return toast.warning('Digite somente os números do CPF!')
    }

    setLoad(true)
    let cancel = false
    await api.get(`/client/how-many-sellers/${userId}`).then((res) => {
      const count = res.data.data
      if (count >= 6) {
        toast.warning('Número limite de cadastros atingido! (6)')
        setToggle(false)
        setName('')
        setCpf('')
        setEmail('')
        setPhone('')
        cancel = true
      }
    }).catch((err) => {
      return toast.error(err.response.data.message)
    })

    if (cancel == false) {
      await api.post('/client/register-seller', {
        name, cpf, email, phone
      }).then((res) => {
        let { name, cpf, email, phone } = res.data.data
        let newSeller = [...sellers, { name, cpf, email, phone }]
        setSellers(newSeller)
        toast.success('Cadastro feito com sucesso!')
        setName('')
        setCpf('')
        setEmail('')
        setPhone('')
        setToggle(false)

      }).catch((err) => {
        toast.error(err.response.data.message)
      })
    }
    setLoad(false)

  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!email || !phone) {
      return toast.warning('Preencha todos os campos!')
    }

    setLoad(true)
    await api.patch('/client/update-seller', {
      email, phone, id
    }).then((res) => {
      toast.success('Edição feita com sucesso!')
      setEmail('')
      setPhone('')
      setEditToggle(false)

    }).catch((err) => {
      toast.error(err.response.data.message)
    })
    setLoad(false)

  }

  const handleDelete = async (e) => {
    if (confirm("Você irá excluir esse registro!") == true) {
      const id = e.target.id
      setLoad(true)
      await api.delete(`/client/delete-seller/${id}`).then((res) => {
        const newArray = sellers.filter((item) => {
          return item.id != id
        })
        setSellers(newArray)
        toast.success('Registro excluido com sucesso!')
      }).catch((err) => {
        toast.error(err.response.data.message)
      })
      setLoad(false)
    }
  }

  return (
    <div className={styles.sellers}>
      <span className={styles.bg}>
        {sellers && sellers.length == 0 && <h1 className={styles.h1sellers}>Nenhum vendedor(a) cadastrado(a).</h1>}
        <div className={styles.sellers_container}>
          <ul>
            {sellers && sellers.map((item, i) => (
              <li key={i} id={item.id}>
                <span>
                  <span>Nome: </span><span><b>{item.name}</b></span>
                </span>
                <span>
                  <span>CPF: </span><span><b>{item.cpf}</b></span>
                </span>
                <span>
                  <span>E-mail: </span><span><b>{item.email}</b></span>
                </span>
                <span>
                  <span>Celular: </span><span><b>{item.phone}</b></span>
                </span>
                <div className={styles.buttonArea}>
                  <button onClick={() => {
                    setEditToggle(true)
                    setEmail(item.email)
                    setPhone(item.phone)
                    setId(item.id)
                  }} className={styles.editBtn}>Editar</button>
                  <button id={item.id} onClick={handleDelete} className={styles.deleteBtn}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>

        </div>
        <div onClick={() => setToggle(true)} className={styles.registerNewSeller}>
          <span>Cadastrar novo(a) vendedor(a)<span className={styles.icon}><FaUserPlus /></span></span>
        </div>

        {editToggle &&
          <div className={styles.updateContainer}>
            <div className={styles.updateBox}>
              <span className={styles.closeIcon}><FaTimes onClick={() => setEditToggle(false)} /></span>
              <form onSubmit={handleUpdate}>
                <label>
                  <span>E-mail ativo:</span>
                  <input type='email' required onChange={(e) => { setEmail(e.target.value) }} value={email} placeholder='Insira o e-mail...' />
                </label>
                <label>
                  <span>Número de celular:</span>
                  <input autoComplete='off' type='text' name='phone' placeholder='Insira o celular...' required onChange={(e) => {
                    let { value } = formatPhone(e, phone)
                    setPhone(value)
                  }} onKeyDown={(e) => {
                    if (e.code == 'Backspace' || e.code == 'Delete') { setPhone(phone.substring(0, phone.length - 1)) }
                  }} value={phone} maxLength='14' />
                </label>
                <button style={{ marginTop: '15px' }} className='btn'>Editar</button>
              </form>
            </div>
          </div>}


        {toggle &&
          <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
              <span className={styles.closeIcon}><FaTimes onClick={() => setToggle(false)} /></span>
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Nome completo:</span>
                  <input type='text' required onChange={(e) => { setName(e.target.value) }} value={name} placeholder='Insira o nome...' />
                </label>
                <label>
                  <span>CPF:</span>
                  <span className='small_text'>Somente números</span>
                  <input type='text' required onChange={(e) => { setCpf(e.target.value) }} value={cpf} maxLength={11} placeholder='Insira o CPF...' />
                </label>
                <label>
                  <span>E-mail ativo:</span>
                  <input type='email' required onChange={(e) => { setEmail(e.target.value) }} value={email} placeholder='Insira o e-mail...' />
                </label>
                <label>
                  <span>Número de celular:</span>
                  <input autoComplete='off' type='text' name='phone' placeholder='Insira o celular...' required onChange={(e) => {
                    let { value } = formatPhone(e, phone)
                    setPhone(value)
                  }} onKeyDown={(e) => {
                    if (e.code == 'Backspace' || e.code == 'Delete') { setPhone(phone.substring(0, phone.length - 1)) }
                  }} value={phone} maxLength='14' />
                </label>
                <button style={{ marginTop: '15px' }} className='btn'>Cadastrar</button>
              </form>
            </div>
          </div>}
        {load && <Load />}
      </span>
    </div>
  )
}

export default Sellers