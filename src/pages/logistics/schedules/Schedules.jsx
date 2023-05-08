// Estilização
import styles from './Schedules.module.css'
// Hooks
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import UseDeleteSchedule from '../../../hooks/UseDeleteSchedule'
// Roteamento
import { useNavigate } from 'react-router-dom'
// Requisições
import { api } from '../../../axiosConfig'
// Componentes
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'

const Schedules = () => {

  const navigate = useNavigate()

  const { userId, setUserId, setUserName } = useContext(AuthContext)

  const [load, setLoad] = useState(true)
  const [schedules, setSchedules] = useState(null)
  const [fixedSchedules, setFixedSchedules] = useState(null)


  useEffect(() => {
    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      await api.get(`/client/schedules/${userId}`, { signal }).then((res) => {
        setSchedules(res.data.data.schedules)
        setFixedSchedules(res.data.data.fixedSchedules)

      }).catch((err) => {
        console.log(err)
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
    })();
    setLoad(false)
    return () => {
      abortController.abort()
    }
  }, []);

  const handleDelete = async (e) => {
    if (confirm('Você irá excluir o agendamento.') == true) {

      const id = e.target.id.split('-')[0]
      const type = e.target.id.split('-')[1]
      setLoad(true)
      const { message, error } = await UseDeleteSchedule(id, type)
      if (error) {
        toast.error(message)
        return
      } else {
        toast.success(message)
      }

      setFixedSchedules(null)
      setSchedules(null)
      setLoad(false)
    }
  }

  return (
    <div className={styles.schedules}>
      <span className={styles.bg}>
        {load && <Load />}
        <h1 style={{textAlign: 'center', marginTop: '50px'}}>Seu agendamento de entrega</h1>
        {schedules == null && fixedSchedules == null && <h1 style={{marginTop: '30px', textAlign:'center'}}>Nenhum agendamento...</h1>}
        <ul>
          {schedules &&
            <li key={schedules.id}>
              <div className={styles.scheduleBox}>
                <span className={styles.day}>{schedules.day}</span>
                <span className={styles.date}>{schedules.date}</span>
                <span className={styles.time}>Hora: <b>{schedules.time}</b></span>
                <span className={styles.boxQnt}>Volumes: <b>{schedules.boxQnt}</b></span>
                <span className={styles.loadValue}>Valor da nota: <b>{schedules.loadValue && "R$" + schedules.loadValue}</b></span>
              </div>
              <div>
                <button id={schedules.id + "-exporadico"} onClick={handleDelete} className={styles.hoverDelete}>Cancelar</button>
              </div>
            </li>
          }
        </ul>

        <ul>
          {fixedSchedules &&
            <li key={fixedSchedules.id}>
              <div className={styles.scheduleBox}>
                <span className={styles.day}>{fixedSchedules.day}</span>
                <span className={styles.frequency}>{fixedSchedules.frequency}</span>
                <span className={styles.time}>Hora: <b>{fixedSchedules.time}</b></span>
                {fixedSchedules.frequency == 'semanal' ? <>
                  <span className={styles.currentDelivery}>Proxima entrega: <b>{fixedSchedules.currentDelivery}</b></span>
                </> : <>
                  <span className={styles.currentDelivery}>Proxima entrega: <b>{fixedSchedules.currentDelivery}</b></span>
                  <span>Entregas futuras: <b>{fixedSchedules.nextDelivery}</b> e <b>{fixedSchedules.nextNextDelivery}</b></span>
                  </>}
                </div>
                <div>
                  <button id={fixedSchedules.id + "-fixo"} onClick={handleDelete} className={styles.hoverDelete}>Cancelar</button>
                </div>
            </li>
          }
        </ul>
      </span>
    </div >
  )
}

export default Schedules