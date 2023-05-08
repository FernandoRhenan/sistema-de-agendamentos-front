import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './ConfirmEmail.module.css'
import { api } from '../../../axiosConfig'
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import GetTokenId from '../../../func/getTokenId'


const ConfirmEmail = () => {

  const navigate = useNavigate()

  const { id, email } = useParams()
  const [code, setCode] = useState('')

  const [load, setLoad] = useState(false)

  const { setUserId, setUserName } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoad(true)

    await api.get(`/client/verify-code/${id}/${code}`).then(async (res) => {

      const token = res.data.data[0]
      const userId = res.data.data[1]
      const name = res.data.data[2]


      await api.patch('/client/confirmAccount', { userId }).then().catch((err) => {
        toast.error(err.response.data.message)

        navigate(`/confirm-email/${userId}`)
        return
      })

      sessionStorage.setItem("@Auth:name", JSON.stringify(name))
      sessionStorage.setItem("@Auth:token", JSON.stringify(token))

      const { tokenId, userName } = GetTokenId()
      setUserId(tokenId)
      setUserName(userName)

      setTimeout(() => {
        navigate('/logistics')
      }, 200)

    }).catch((err) => {
      toast.error(err.response.data.message)
    })

    setCode('')
    setLoad(false)

  }

  const reSendEmail = async () => {
    setLoad(true)
    await api.patch('/client/re-send-auth-code', { email, id }).then((res) => {
      toast.success(res.data.message)
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
    setLoad(false)
  }

  return (
    <div className={styles.confirmEmail}>
      {load && <Load />}
      <div className={styles.formArea}>
        <h1>A empresa foi registrada!</h1>
        <p>Enviamos um e-mail com o seu código de acesso para sua caixa de entrada.</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span><b>Insira seu código abaixo:</b></span>
            <input type='text' required onChange={(e) => setCode(e.target.value)} value={code} />
          </label>
          <button className='btn'>Verificar</button>
        </form>
        <p>Caso não tenha encotrado o seu e-mail, não se esqueça de verificar seu spam!</p>

        <button onClick={reSendEmail} className='btn-long'>Reenviar e-mail</button>
      </div>
    </div>
  )
}

export default ConfirmEmail