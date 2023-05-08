// Estilização
import styles from '../../logistics/newSchedule/formSchedule.module.css'
// Hooks
import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import UseGetAllSellers from '../../../hooks/UseGetAllSellers'
// Funções
import checkBuyerSchedule from '../../../func/checkBuyerSchedule'
import setDateLimits from '../../../func/setDateLimits'
import dateForecast from '../../../func/dateForecast'
// Requisições
import { api } from '../../../axiosConfig'
// Roteamento
import { useNavigate } from 'react-router-dom'
// Componentes
import Load from '../../../components/load/Load'
import { toast } from 'react-toastify'

const SellerNewSchedule = () => {
  const navigate = useNavigate()

  const { userId, setUserId, setUserName } = useContext(AuthContext)

  const [avaibleTime, setAvaibleTime] = useState([])
  const { minDate, maxDate } = setDateLimits()
  const [load, setLoad] = useState(false)

  const [date, setDate] = useState('')
  const [date1, setDate1] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [seller, setSeller] = useState('')
  const [sellers, setSellers] = useState([])


  const handleVerify = async (e) => {
    e.preventDefault()
    let abortController
    if (date) {

      setLoad(true)

      const formatedDate = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`
      const { formatedDate1, weekday } = dateForecast(formatedDate)

      setDate1(formatedDate1)

      var { avaibleTime } = await checkBuyerSchedule(formatedDate1)

      setDay(weekday)
      setAvaibleTime(avaibleTime)
      // Buscar todos os vendedores cadastrados na empresa.
      abortController = new AbortController()
      let signal = abortController.signal
      const { sellers, errorMessage } = await UseGetAllSellers(userId, signal)
      if (sellers) {
        setSellers(sellers)
      }
      if (errorMessage) {
        toast.error(errorMessage)
      }
      setLoad(false)
    }
    return () => {
      abortController.abort()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (time == '') { return toast.warning('Selecione um horário!') }
    if (seller == '') { return toast.warning('Selecione um(a) vendedor(a)!') }
    setLoad(true)
    await api.post('/client/new-seller-schedule', {
      date: date1, day, time, sellerId: seller
    }).then((res) => {
      setLoad(false)
      navigate('/sales/schedules')
      toast.success(res.data.message)

    }).catch((err) => {
      setLoad(false)
      if (err.response.status == 401) {
        alert('Sua sessão expirou.')
        sessionStorage.clear()
        setUserId('')
        setUserName('')
        navigate('/login')
      }else {
        toast.error(err.response.data.message)
      }
    })
  }

  return (
    <div className={styles.newSchedule}>
      <span className={styles.bg}>
        {load && <Load />}

        <h1>Agendamento de horário</h1>
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

          {avaibleTime && sellers && avaibleTime.length != 0 && sellers.length != 0 &&

            <form onSubmit={handleSubmit}>
              <span className={styles.mainForm}>
                <label>
                  <span>Horarios disponíveis:</span>
                  <select value={time} required onChange={(e) => { setTime(e.target.value) }}>
                    <option value=''></option>
                    {avaibleTime && avaibleTime.map((time, i) => (
                      <option key={i} value={time}>{time}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Selecione o vendedor(a):</span>
                  <select value={seller} required onChange={(e) => { setSeller(e.target.value) }}>
                    <option value=''></option>
                    {sellers && sellers.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>

              </span>
              <span className={styles.confirmationArea}>
                {date && day && time && <span className={styles.text}>A visita será agendada para o dia {date1} na {day[0].toLocaleUpperCase() + day.substring(1)} ás {time}.</span>}
                <button>Confirmar</button>
              </span>
            </form>
          }
        </div>
      </span>

    </div >
  )
}

export default SellerNewSchedule