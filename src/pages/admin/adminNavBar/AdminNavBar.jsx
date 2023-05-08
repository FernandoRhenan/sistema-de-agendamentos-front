import { NavLink, useNavigate } from 'react-router-dom'
import styles from './AdminNavBar.module.css'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'

const AdminNavBar = () => {
    const { setAdminId } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLeave = () => {
        setAdminId('')
        sessionStorage.clear()
        navigate('/')
    }

    return (
        <div className={styles.adminNavBar}>
            <div>
                <span>Logo</span>
                <span className={styles.leave} onClick={handleLeave}>Sair</span>
            </div>
            <nav>
                <NavLink to={'/apr-admin/all-schedules'}>Agenda de recebimento</NavLink>
                <NavLink to={'/apr-admin/all-sellers-schedules'}>Agenda de visita</NavLink>
                <NavLink to={'/apr-admin/all-companies'}>Empresas</NavLink>
                <NavLink to={'/apr-admin/all-sellers'}>Vendedores</NavLink>
            </nav>
        </div>
    )
}

export default AdminNavBar