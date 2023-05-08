// Estilização
import styles from './formSchedule.module.css'
// Hooks
import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
// Funções
import checkSchedule from '../../../func/checkSchedule'
import setDateLimits from '../../../func/setDateLimits'
import dateForecast from '../../../func/dateForecast'
// Requisições
import { api } from '../../../axiosConfig'
// Roteamento
import { useNavigate } from 'react-router-dom'
// Componentes
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'

const NewSchedule = () => {

  const navigate = useNavigate()

  const { userId, setUserId, setUserName } = useContext(AuthContext)

  const [avaibleTime, setAvaibleTime] = useState([])
  const { minDate, maxDate } = setDateLimits()
  console.log(minDate)
  console.log(maxDate)
  const [load, setLoad] = useState(false)

  const [date, setDate] = useState('')
  const [date1, setDate1] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [boxQnt, setBoxQnt] = useState('')
  const [loadValue, setLoadValue] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (date) {

      setLoad(true)

      const formatedDate = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`
      const { formatedDate1, weekday } = dateForecast(formatedDate)

      setDate1(formatedDate1)

      var { avaibleTime } = await checkSchedule(formatedDate1, weekday)

      setDay(weekday)
      setAvaibleTime(avaibleTime)

      setLoad(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (time == '') { return toast.warning('Selecione um horário!') }
    setLoad(true)
    await api.post('/client/new-schedule', {
      date: date1, day, time, boxQnt, loadValue, userId
    }).then((res) => {
      setLoad(false)
      navigate('/logistics/schedules')
      toast.success(res.data.message)


    }).catch((err) => {
      setLoad(false)
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
  }

  return (
    <div className={styles.newSchedule}>
      <span className={styles.bg}>
        {load && <Load />}
        <h1>Agendamento exporádico</h1>
        <div className={styles.newSchedule_container}>
          <form className={styles.verifyForm} onSubmit={handleVerify}>
            <label>
              <input onChange={(e) => {
                setDate(e.target.value)
                setAvaibleTime([])
              }} onKeyDown={(e) => { e.preventDefault() }} required type='date' min={minDate} max={maxDate} />
            </label>
            <button>Verificar disponibilidade</button>
          </form>

          {avaibleTime && avaibleTime.length != 0 &&
            <form onSubmit={handleSubmit}>
              <span className={styles.mainForm}>
                <label>
                  <span>Horarios disponíveis:</span>
                  <select value={time} required onChange={(e) => { setTime(e.target.value) }}>
                    <option value=''>Horários</option>
                    {avaibleTime && avaibleTime.map((time, i) => (
                      <option key={i} value={time}>{time}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Volumes da entrega:</span>
                  <input type='text' placeholder='Quantidade de caixas...' onChange={(e) => { setBoxQnt(e.target.value) }} />
                </label>
                <label>
                  <span>Valor da carga</span>
                  <input type='text' placeholder='Valor total da carga...' onChange={(e) => { setLoadValue(e.target.value) }} />
                </label>
              </span>
              <span className={styles.confirmationArea}>
                {date && day && time && <span className={styles.text}>Sua entrega será agendada para {day}, dia {date1}, ás {time}.</span>}
                <button>Agendar</button>
              </span>
            </form>
          }
        </div>
      </span>
    </div >
  )
}

export default NewSchedule