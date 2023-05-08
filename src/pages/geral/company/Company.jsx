// Estilização
import styles from './Company.module.css'
import { MdKeyOff, MdKey } from 'react-icons/md'
//
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { api } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import Load from '../../../components/load/Load'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'


const Company = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const { setUserId, setUserName } = useContext(AuthContext)

    const [user, setUser] = useState({})
    const [load, setLoad] = useState(true)

    const [showKey, setShowKey] = useState({ key1: false, key2: false, key3: false })

    const [name, setName] = useState('')
    const [social, setSocial] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    useEffect(() => {
        let abortController
        (async () => {
            abortController = new AbortController()
            let signal = abortController.signal
            await api.get(`/client/get-user/${id}`, { signal }).then((res) => {
                const { name, social, email, phone, cnpj } = res.data.data
                setName(name)
                setSocial(social)
                setCnpj(cnpj)
                setPhone(phone)
                setEmail(email)
                setUser(res.data.data)
            }).catch((err) => {
                if (err.response.status == 401) {
                    alert('Sua sessão expirou.')
                    sessionStorage.clear()
                    setUserId('')
                    setUserName('')
                    navigate('/login')
                } else {
                    toast.error(err.response.data.message)
                }
            })
        })()
        setLoad(false)
        return () => {
            abortController.abort()
        }
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (phone == user.phone && email == user.email) {
            toast.warning('Para atualizar seus dados você primeiro precisa modificar algum campo!')
            return
        }
        if (!phone || !email) {
            return toast.warning('Preencha todos os campos!')
        }

        if (phone.length != 14) {
            return toast.warning('Complete o campo de telefone!')
        }

        setLoad(true)

        await api.patch('/client/update-user', {
            phone, email, id
        }).then((res) => {
            setUser(res.data.data)
            toast.success(res.data.message)
        }).catch((err) => {
            if (err.response.status == 401) {
                alert('Sua sessão expirou.')
                sessionStorage.clear()
                setUserId('')
                setUserName('')
                navigate('/login')
            } else {
                toast.error(err.response.data.message)
            }
        })
        setLoad(false)
    }

    const handleChangePass = async (e) => {
        e.preventDefault()
        if (!password && !newPassword && !confirmNewPassword) {
            return toast.warning('Preencha todos os campos')
        }
        if (password == newPassword || password == confirmNewPassword) {
            return toast.warning('A nova senha deve ser diferente da antiga!')
        }
        if (newPassword.length < 6) {
            return toast.warning('A senha deve conter no mínimo 6 caracteres!')
        }
        if (newPassword != confirmNewPassword) {
            return toast.warning('Confirmação de senha não aprovada!')
        }

        setLoad(true)

        await api.patch('/client/change-password', { password, newPassword, confirmNewPassword, id }).then((res) => {
            toast.success(res.data.message)
            setPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        }).catch((err) => {
            if (err.response.status == 401) {
                alert('Sua sessão expirou.')
                sessionStorage.clear()
                setUserId('')
                setUserName('')
                navigate('/login')
            } else {
                toast.error(err.response.data.message)
            }
        })

        setLoad(false)
    }

    const handleDelete = async (e) => {
        if (confirm('Você irá excluir permanentemente sua conta.') == true) {
            setLoad(true)
            await api.delete(`/client/delete-user/${id}`).then(() => {
                setUserId('')
                setUserName('')
                sessionStorage.clear()
                navigate('/')
            }).catch((err) => {
                if (err.response.status == 401) {
                    alert('Sua sessão expirou.')
                    sessionStorage.clear()
                    setUserId('')
                    setUserName('')
                    navigate('/login')
                } else {
                    toast.error(err.response.data.message)
                }
            })
            setLoad(false)
        }
    }

    const formatPhone = (e) => {
        let value = e.target.value
        let lastCharacter = e.target.value.slice(-1).charCodeAt()
        if (lastCharacter >= 48 && lastCharacter <= 57) {
            const valueLength = value.length
            if (valueLength == 1) {
                value = '(' + value
                setPhone(value)
            } else if (valueLength == 3) {
                value += ')'
                setPhone(value)
            } else if (valueLength == 9) {
                value += '-'
                setPhone(value)
            } else {
                setPhone(value)
            }
        }
    }

    return (
        <div className={styles.company}>
            <span className={styles.bg}>
                {load && <Load />}
                {user &&
                    <div className={styles.company_container}>
                        <div className={styles.box1}>
                            <span className={styles.textData}>Seus dados</span>
                            <ul>
                                <li>
                                    <span>Nome: </span>
                                    <span className={styles.data}>{user.name}</span>
                                </li>
                                <li>
                                    <span>Razão social: </span>
                                    <span className={styles.data}>{user.social}</span>
                                </li>
                                <li>
                                    <span>CNPJ: </span>
                                    <span className={styles.data}>{user.cnpj}</span>
                                </li>
                                <li>
                                    <span>Telefone: </span>
                                    <span className={styles.data}>{user.phone}</span>
                                </li>
                                <li>
                                    <span>E-mail: </span>
                                    <span className={styles.data}>{user.email}</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.box2}>
                            <span className={styles.textData}>Editar</span>
                            <form onSubmit={handleUpdate}>
                                <label>
                                    <span>Telefone: </span>
                                    <input type='text' required onChange={(e) => formatPhone(e)} onKeyDown={(e) => {
                                        if (e.code == 'Backspace' || e.code == 'Delete') { setPhone(phone.substring(0, phone.length - 1)) }
                                    }} value={phone} maxLength='14' />
                                </label>
                                <label>
                                    <span>E-mail: </span>
                                    <input required type='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                </label>
                                <button>Atualizar</button>
                            </form>
                        </div>
                    </div>
                }
                <div className={styles.dangerZone}>
                    <h2>Zona de perigo! <FaExclamationTriangle /></h2>
                    <div className={styles.changePassword}>
                        <span className={styles.text}>Trocar de senha:</span>
                        <form onSubmit={handleChangePass}>
                            <label>
                                <span>Digite sua senha atual:</span>
                                <span className={styles.inputBox}>
                                    <input type={showKey.key1 ? 'text' : 'password'} name='password' placeholder='Insira sua senha...' required onChange={(e) => setPassword(e.target.value)} value={password} />
                                    <span className={styles.keyIcon} onClick={() => setShowKey({ key1: !showKey.key1, key2: showKey.key2, key3: showKey.key3 })}>{showKey.key1 ? <MdKey /> : <MdKeyOff />}</span>
                                </span>
                            </label>
                            <label>
                                <span>Digite sua nova senha:</span>
                                <span className={styles.inputBox}>
                                    <input type={showKey.key2 ? 'text' : 'password'} name='password' placeholder='Insira sua senha...' required onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                                    <span className={styles.keyIcon} onClick={() => setShowKey({ key1: showKey.key1, key2: !showKey.key2, key3: showKey.key3})}>{showKey.key2 ? <MdKey /> : <MdKeyOff />}</span>
                                </span>
                            </label>
                            <label>
                                <span>Confirme sua nova senha:</span>
                                <span className={styles.inputBox}>
                                    <input type={showKey.key3 ? 'text' : 'password'} name='password' placeholder='Insira sua senha...' required onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} />
                                    <span className={styles.keyIcon} onClick={() => setShowKey({ key1: showKey.key1, key2: showKey.key2, key3: !showKey.key3 })}>{showKey.key3 ? <MdKey /> : <MdKeyOff />}</span>
                                </span>
                            </label>
                            <button>Trocar</button>
                        </form>
                    </div>
                    <span className={styles.text}>Excluir conta:</span>
                    <button onClick={handleDelete} className={styles.deleteButton}>Quero excluir minha conta</button>
                </div>

            </span>
        </div>

    )
}

export default Company