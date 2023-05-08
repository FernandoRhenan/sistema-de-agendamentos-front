import styles from './Home.module.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className={styles.home}>
      <h1>Faça o seu agendamento aqui!</h1>
      <span>
        <Link to='/register'>Cadastrar empresa</Link>
        <Link to='/login'>Entrar</Link>
      </span>
    </div>
  )
}

export default Home