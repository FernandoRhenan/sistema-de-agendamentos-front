import { useState, useContext } from 'react'
import styles from './LoginAdmin.module.css'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../axiosConfig'
import Load from '../../..//components/load/Load'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../context/AuthContext'
import getTokenId from '../../../func/getTokenId'

const LoginAdmin = () => {

    const { setAdminId } = useContext(AuthContext)

    const navigate = useNavigate()

    const [load, setLoad] = useState(false)

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !password) {
            toast.error('Preencha todos os campos!')
            return
        }
        setLoad(true)

        await api.post('/admin/apr-login', { name, password }).then((res) => {
            const token = res.data.data

            sessionStorage.setItem("@Admin:token", JSON.stringify(token))

            const { adminTokenId } = getTokenId()

            setAdminId(adminTokenId)

            setTimeout(() => {
                navigate('/apr-admin/all-schedules')
            }, 400)

        }).catch((err) => {
            toast.error(err.response.data.message)

        })

        setLoad(false)
    }

    return (
        <div className={styles.login}>
            {load && <Load />}

            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
                    <input type='text' placeholder='Insira o nome...' onChange={(e) => { setName(e.target.value) }} value={name} />
                </label>
                <label>
                    <span>Senha:</span>
                    <input type='password' placeholder='Insira a senha...' onChange={(e) => { setPassword(e.target.value) }} value={password} />
                </label>
                <button className='btn'>Entrar</button>
            </form>
        </div>
    )
}

export default LoginAdmin