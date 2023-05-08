import styles from './Slider.module.css'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { FaThLarge, FaCalendarCheck, FaCalendarDay, FaRegBuilding, FaSignOutAlt, FaPhone, FaDolly, FaUserClock, FaUsers } from 'react-icons/fa'

const Slider = ({ toggle }) => {

  const [currentArea, setCurrentArea] = useState('logistics')

  const { setUserId, setUserName, userId } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('sales')) {
      setCurrentArea('sales')
    }
    if (location.pathname.includes('logistics')) {
      setCurrentArea('logistics')
    }
  }, [])

  const handleLeave = (e) => {
    e.preventDefault()
    setUserId('')
    setUserName('')
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <div style={toggle ? { left: 'calc(100% - 350px)' } : { left: 'calc(100% + 15px)' }} className={styles.slider}>

      <div className={styles.area_container}>
        <NavLink onClick={() => setCurrentArea('logistics')} to='/logistics'
          className={({ isActive }) =>
            isActive ? styles.activedArea : styles.disabledArea
          }>Logística</NavLink>

        <NavLink onClick={() => setCurrentArea('sales')} to='/sales'
          className={({ isActive }) =>
            isActive ? styles.activedArea : styles.disabledArea
          }
        >Vendas</NavLink>
      </div>

      {
        currentArea === 'logistics' &&
        <ul className={styles.sliderNav}>
          <li><NavLink to='/logistics/schedules'><FaThLarge className={styles.icon} />Meu agendamento</NavLink></li>
          <li><NavLink to='/logistics/new-schedule'><FaCalendarDay className={styles.icon} />Novo agendamento</NavLink></li>
          <li><NavLink to='/logistics/new-fixed-schedule'><FaCalendarCheck className={styles.icon} />Novo agendamento fixo</NavLink></li>
          <li><NavLink to='/logistics/workdays'><FaDolly className={styles.icon} />Dias hábeis</NavLink></li>
        </ul>
      }

      {
        currentArea === 'sales' &&
        <ul className={styles.sliderNav}>
          <li><NavLink to='/sales/schedules'><FaThLarge className={styles.icon} />Meus agendamentos</NavLink></li>
          <li><NavLink to='/sales/new-schedule'><FaCalendarDay className={styles.icon} />Novo agendamento</NavLink></li>
          <li><NavLink to='/sales/sellers'><FaUsers className={styles.icon} />Vendedores</NavLink></li>
          <li><NavLink to='/sales/workdays'><FaUserClock className={styles.icon} />Dias hábeis</NavLink></li>
        </ul>
      }

      <ul className={styles.sliderNavGeral}>
        <li><NavLink to={`/company/${userId}`}><FaRegBuilding className={styles.icon} />Minha empresa</NavLink></li>
        <li><NavLink to='/contact'><FaPhone className={styles.icon} />Entre em contato</NavLink></li>
        <li><button onClick={handleLeave}>Sair<FaSignOutAlt className={styles.leaveIcon} /></button></li>
      </ul>
    </div >
  )
}

export default Slider