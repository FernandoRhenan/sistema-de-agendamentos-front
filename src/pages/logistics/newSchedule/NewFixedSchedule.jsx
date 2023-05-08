import styles from './formSchedule.module.css'
// Hooks
import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
// Roteamento
import { useNavigate } from 'react-router-dom'
// Funções
import checkFixedSchedule from '../../../func/checkFixedSchedule'
import setDateLimits from '../../../func/setDateLimits'
import dateForecast from '../../../func/dateForecast'
// Requisições
import { api } from '../../../axiosConfig'
// Componentes
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'


const NewFixedSchedule = () => {

  const navigate = useNavigate()

  const { userId, setUserId, setUserName } = useContext(AuthContext)

  const [avaibleTime, setAvaibleTime] = useState([])
  const { minDate, maxDate } = setDateLimits()
  const [load, setLoad] = useState(false)

  const [date, setDate] = useState('')
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [date3, setDate3] = useState('')
  const [frequency, setFrequency] = useState('semanal')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()

    if (date) {

      setLoad(true)

      const formatedDate = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`
      const { formatedDate1, formatedDate2, formatedDate3, weekday } = dateForecast(formatedDate)
      setDate1(formatedDate1)
      setDate2(formatedDate2)
      setDate3(formatedDate3)

      var { avaibleTime } = await checkFixedSchedule(formatedDate1, formatedDate2, formatedDate3, weekday)
      setDay(weekday)
      setAvaibleTime(avaibleTime)
      setLoad(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (time == '') {
      return toast.warning('Selecione um horário!')
    } else {

      setLoad(true)

      api.post('/client/new-fixed-schedule', {
        time, day, frequency, currentDelivery: date1, nextDelivery: date2, nextNextDelivery: date3, userId
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
  }

  return (
    <div className={styles.newSchedule}>
      <span className={styles.bg}>
        {load && <Load />}

        <h1>Agendamento fixo</h1>
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
                  <span>Frequência das entregas:</span>
                  <select value={frequency} onChange={(e) => { setFrequency(e.target.value) }}>
                    <option value='semanal'>Semanal</option>
                    <option value='quinzenal'>Quinzenal</option>
                  </select>
                </label>

              </span>
              <span className={styles.confirmationArea}>
                {date && day && time && <span className={styles.text}>Suas entregas serão {frequency.replace(/.$/, '')}is, nas {day.split('-')[0]}s-{day.split('-')[1]}s ás {time}. A primeira entrega será agendada para o dia {date1}.</span>}
                <button>Agendar</button>
              </span>
            </form>
          }
        </div>
      </span>

    </div >
  )
}

export default NewFixedSchedule