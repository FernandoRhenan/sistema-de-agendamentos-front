import styles from './Load.module.css'
import { CiDeliveryTruck } from 'react-icons/ci'
import { IoReloadCircleOutline } from 'react-icons/io5'


const Load = () => {
    return (
        <div className={styles.load_container}>
            <div>
                <span className={styles.truck}><CiDeliveryTruck /></span>
                <span className={styles.load}><IoReloadCircleOutline /></span>
                <p>Aguarde...</p>
            </div>
        </div>
    )
}

export default Load