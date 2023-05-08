// Estilização
import styles from './ClientNavBar.module.css'
// Hooks
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
// Icones
import { FaBars } from 'react-icons/fa'
// Componentes
import Slider from '../slider/Slider'

const ClientNavBar = () => {

  const { userName } = useContext(AuthContext)
  const [name, setName] = useState('')
  useEffect(() => {
    setName(userName)
  }, [userName])

  const [toggle, setToggle] = useState(true)

  return (
    <div className={styles.clientNavBar}>
      {name ? <span>{name}</span> : <p>Carregando...</p>}

      <span><FaBars className={styles.iconMenu} style={toggle ? { transform: 'rotateZ(90deg)' } : { transform: 'rotateZ(0deg)' }} onClick={() => { setToggle(!toggle) }} /></span>
      <Slider toggle={toggle} />
    </div>
  )
}

export default ClientNavBar