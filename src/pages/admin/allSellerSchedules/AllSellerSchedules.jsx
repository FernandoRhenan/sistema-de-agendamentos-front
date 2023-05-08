import { useEffect, useState } from 'react'
import styles from './AllSellerScheudules.module.css'
import { api } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import Load from '../../../components/load/Load'

const AllSellerSchedules = () => {

  const [allSchedules, setAllSchedules] = useState([])
  const [load, setLoad] = useState(true)
  const [dateToday, setDateToday] = useState('')

  useEffect(() => {
    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      await api.get('/admin/apr-get-all-seller-schedules', { signal }).then((res) => {
        let array = []
        for (let i = 0; i < res.data.data.length; i++) {
          const data = res.data.data

          if (data[i].sellerSchedule != null) {
            array.push({ ...array, schedule: data[i].sellerSchedule, name: data[i].name, company: data[i].mainCompany })
          }
        }
        array.sort((a, b) => {
          let ADay = a.schedule.date.split('-')[0]
          let AMonth = a.schedule.date.split('-')[1]
          let AYear = a.schedule.date.split('-')[2]
          let AHour = a.schedule.time.split(':')[0]
          let AMin = a.schedule.time.split(':')[1]
          let BDay = b.schedule.date.split('-')[0]
          let BMonth = b.schedule.date.split('-')[1]
          let BYear = b.schedule.date.split('-')[2]
          let BHour = b.schedule.time.split(':')[0]
          let BMin = b.schedule.time.split(':')[1]

          if (AYear > BYear) return +1
          if (AYear < BYear) return -1
          if (AYear == BYear && AMonth > BMonth) return +1
          if (AYear == BYear && AMonth < BMonth) return -1
          if (AYear == BYear && AMonth == BMonth && ADay > BDay) return +1
          if (AYear == BYear && AMonth == BMonth && ADay < BDay) return -1
          if (AYear == BYear && AMonth == BMonth && ADay == BDay && AHour > BHour) return +1
          if (AYear == BYear && AMonth == BMonth && ADay == BDay && AHour < BHour) return -1
          if (AYear == BYear && AMonth == BMonth && ADay == BDay && AHour == BHour && AMin > BMin) return +1
          if (AYear == BYear && AMonth == BMonth && ADay == BDay && AHour == BHour && AMin < BMin) return -1
        })

        setAllSchedules(array)
      }).catch((err) => {
        toast.err(err.response.data.message)
      })
    })()

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let dateNow = `${convertToString(day)}-${convertToString(month)}-${year}`

    setDateToday(dateNow.toString())

    setLoad(false)

    return () => {
      abortController.abort()
    }
  }, [])

  function convertToString(num) {
    const strNum = num.toString()
    if (strNum.length == 1) {
      return `0${strNum}`
    } else {
      return strNum
    }
  }

  return (
    <div className={styles.allSellerSchedules}>
      {load && <Load />}
      <div className={styles.screenDisplay}>
        <div className={styles.list}>
          <h1>Hoje</h1>
          {allSchedules && allSchedules.length == 0 && <p >Nenhum agendamento...</p>}
          <ul>
            {allSchedules && allSchedules.map((item, i) => (
              <li key={i} >
                {item.schedule.date == dateToday &&
                  <div id={item.schedule.id} className={styles.scheduleBox}>
                    <span className={styles.name}>{item.name.length >= 16 ? item.name.slice(0, 16) + "..." : item.name}</span>
                    <span><span className={styles.key}>Hora: </span><span className={styles.value}>{item.schedule.time}</span></span>
                    <span><span className={styles.key}>Dia: </span><span className={styles.value}>{item.schedule.day}</span></span>
                    <span><span className={styles.key}>Data: </span><span className={styles.value}>{item.schedule.date}</span></span>
                  </div>
                }
              </li>
            ))}
          </ul>
          <h1>Todos os agendamentos</h1>
          {allSchedules && allSchedules.length == 0 && <p>Nenhum agendamento...</p>}
          <ul>
            {allSchedules && allSchedules.map((item, i) => {

              if (item.schedule.date != dateToday) {
                return (<li key={i} >
                  <div id={item.schedule.id} className={styles.scheduleBox}>
                    <span className={styles.name}>{item.name}</span>
                    <span><span className={styles.key}>Empresa: </span><span className={styles.value}>{item.company.length >= 18 ? item.company.slice(0, 18) + "..." : item.company}</span></span>
                    <span><span className={styles.key}>Hora: </span><span className={styles.value}>{item.schedule.time}</span></span>
                    <span><span className={styles.key}>Dia: </span><span className={styles.value}>{item.schedule.day}</span></span>
                    <span><span className={styles.key}>Data: </span><span className={styles.value}>{item.schedule.date}</span></span>
                  </div>
                </li>)
              }


            })}
          </ul>
          <ul>
            {allSchedules && allSchedules.map((item, i) => {

              <li key={i} >
                <div id={item.schedule.id} className={styles.scheduleBox}>
                  <span className={styles.name}>{item.name.length >= 16 ? item.name.slice(0, 16) + "..." : item.name}</span>
                  <span><span className={styles.key}>Hora: </span><span className={styles.value}>{item.schedule.time}</span></span>
                  <span><span className={styles.key}>Dia: </span><span className={styles.value}>{item.schedule.day}</span></span>
                  <span><span className={styles.key}>Data: </span><span className={styles.value}>{item.schedule.date}</span></span>
                </div>
              </li>
            })}
          </ul>
        </div>
      </div>

    </div>
  )
}

export default AllSellerSchedules