import '../../../../public/defaultCSS/form_container.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Load from '../../../components/load/Load'
import { api } from '../../../axiosConfig'
import { toast } from 'react-toastify'

const RecoverPassword = () => {

    const { token } = useParams()
    const [load, setLoad] = useState(false)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newPassword || !confirmPassword) {
            return toast.warning('Preencha todos os campos!')
        }
        if (newPassword != confirmPassword) {
            return toast.warning('Confirmação de senha não aprovada!')
        }
        if (!token) {
            return toast.error('Solicitação bloqueada!')
        }
        if (newPassword.length < 6) {
            return toast.warning('A senha deve conter no mínimo 6 caracteres!')
        }

        setLoad(true)

        let [part1, part2, part3] = [token.split('~')[0], token.split('~')[1], token.split('~')[2]]

        let formatedToken = part1 + "." + part2 + "." + part3

        await api.patch('/client/update-password', {
            newPassword, confirmPassword
        }, {
            headers: {
                Authorization: `Bearer ${formatedToken}`
            },
        }).then((res) => {
            toast.success(res.data.message)
            navigate('/login')
        }).catch((err) => {
            toast.error(err.response.data.message)
        })
        setLoad(false)
    }

    return (
        <div className='form_container'>
            {load && <Load />}
            <h1 style={{ marginBottom: '80px' }}>Alteração de senha</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Digite sua nova senha:</span>
                    <input type='password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                </label>
                <label>
                    <span>Confirme sua nova senha:</span>
                    <input type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                </label>
                <button className='btn'>Confirmar</button>
            </form>
        </div>
    )
}

export default RecoverPassword