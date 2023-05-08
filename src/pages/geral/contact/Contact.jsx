import styles from './Contact.module.css'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const Contact = () => {
    return (
        <div className={styles.contact}>

            <h1>Logo</h1>
            <h2>Entre em contato conosco</h2>
            <ul>
                <li>
                    <span>WhatsApp: </span>
                    <span className={styles.value}>=numero=</span>
                </li>
                <li>
                    <span>Telefone: </span>
                    <span className={styles.value}>=numero=</span>
                </li>
                <li>
                    <span>E-mail: </span>
                    <span className={styles.value}>=email=</span>
                </li>
                <li>
                    <span>Instagram: </span>
                    <span className={styles.value}>=Instgram=</span>
                </li>
            </ul>

            <h2>Contato rápido</h2>
            <div className={styles.fastContact}>
                <a href='#'><FaWhatsapp style={{ backgroundColor: "#25D366" }} /></a>
                <a href='#'><FaInstagram style={{ background: "linear-gradient(to top right, #FCAF45, #833AB4)" }} /></a>
            </div>
        </div>
    )
}

export default Contact