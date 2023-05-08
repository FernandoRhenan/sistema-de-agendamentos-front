import { api } from '../../../axiosConfig'
import styles from './RecoverPassEmail.module.css'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Load from '../../../components/load/Load'

const RecoverPassEmail = () => {

    const [email, setEmail] = useState('')
    const [load, setLoad] = useState(false)

    const handleSendEmail = async (e) => {
        e.preventDefault()
        if (email != '') {
            setLoad(true)

            let id = '';
          
            await api.get(`/client/get-user-by-email/${email}`).then((res) => {
                id = res.data.data
            }).catch((err) => {
                return toast.error(err.response.data.message)
            })

            if (!id) {
                setLoad(false)
                return toast.error('E-mail não encontrado!')
            }

            await api.patch(`/client/recover-password-email/${id}/${email}`).then((res) => {
                toast.success('Foi enviado um e-mail para sua caixa de entrada!')
                setEmail('')
            }).catch((err) => {
                toast.error(err.response.data.message)
            })

            setLoad(false)
        } else {
            toast.warning('Preencha o campo de e-mail!')
        }
    }

    return (
        <div className={styles.recoverPassword}>
            {load && <Load />}
            <h1>Recuperação de senha</h1>
            <form onSubmit={handleSendEmail}>
                <label>
                    <span>Digite seu e-mail que está cadastrado no sistema.</span>
                    <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                </label>
                <button style={{marginTop: '40px'}} className='btn'>Enviar</button>
            </form>

        </div>
    )
}

export default RecoverPassEmail