import styles from './SellerSchedules.module.css'
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { api } from '../../../axiosConfig';
import { toast } from 'react-toastify'
import Load from '../../../components/load/Load'

const SellerSchedules = () => {

  const navigate = useNavigate()
  const { userId, setUserId, setUserName } = useContext(AuthContext)
  const [load, setLoad] = useState(true)
  const [allSchedules, setAllSchedules] = useState([])

  useEffect(() => {
    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      let onlySchedules = []
      await api.get(`/client/get-all-seller-schedules/${userId}`, { signal }).then((res) => {
        let scheduleArray = res.data.data

        scheduleArray.forEach(item => {
          if (item.sellerSchedule != null) {
            onlySchedules.push(item)
          }
        })
        setAllSchedules(onlySchedules)

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
    })();
    setLoad(false)
    return () => {
      abortController.abort()
    }
  }, []);

  const handleDelete = async (e) => {
    const id = e.target.id
    if (confirm('Você irá exclui o agendamento.') == true) {
      setLoad(true)
      await api.delete(`/client/delete-seller-schedule/${id}`).then((res) => {

        const newArray = allSchedules.filter((item) => {
          return item.sellerSchedule.id != id
        })

        setAllSchedules(newArray)

        toast.success(res.data.message)
      }).catch((err) => {
        toast.error(err.response.data.message)
      })
      setLoad(false)
    }
  }

  return (
    <div className={styles.sellerSchedules}>
      <span className={styles.bg}>
        {load && <Load />}
        <h1 style={{textAlign: 'center', marginTop: '50px'}}>Seus agendamentos de visitas</h1>
          {allSchedules && allSchedules.length == 0 && <h1 style={{marginTop: '30px'}}>Nenhum agendamento...</h1>}
        <ul>

          {allSchedules && allSchedules.map((item) => (
            <li key={item.sellerSchedule.id}>
              <div className={styles.scheduleBox}>
                <span className={styles.name}>{item.name}</span>
                <span>
                  <span>Dia: </span><span><b>{item.sellerSchedule.day}</b></span>
                </span>
                <span>
                  <span>Data: </span><span><b>{item.sellerSchedule.date}</b></span>
                </span>
                <span>
                  <span>Hora: </span><span><b>{item.sellerSchedule.time}</b></span>
                </span>
              </div>
              <div>
                <button id={item.sellerSchedule.id} onClick={handleDelete} className={styles.hoverDelete}>Cancelar</button>
              </div>
            </li>
          ))}
        </ul>
      </span>
    </div>
  )
}

export default SellerSchedules