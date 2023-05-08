import styles from './AllSchedules.module.css'
import { api } from "../../../axiosConfig"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import Load from '../../../components/load/Load'

const AllSchedules = () => {

  const [allSchedules, setAllSchedules] = useState([])
  const [dateToday, setDateToday] = useState('')
  const [load, setLoad] = useState(true)

  useEffect(() => {

    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      await api.get('/admin/apr-all-schedules', { signal }).then((res) => {
        let array = []
        for (let i = 0; i < res.data.data.length; i++) {

          const data = res.data.data

          if (data[i].fixedSchedule != null) {
            array.push({ ...array, schedule: data[i].fixedSchedule, name: data[i].name })
          }
          if (data[i].schedule != null) {
            array.push({ ...array, schedule: data[i].schedule, name: data[i].name })
          }
        }

        array.sort((a, b) => {
          let ADay
          let AMonth
          let AYear
          let AHour = a.schedule.time.split(':')[0]
          let AMin = a.schedule.time.split(':')[1]
          let BDay
          let BMonth
          let BYear
          let BHour = b.schedule.time.split(':')[0]
          let BMin = b.schedule.time.split(':')[1]

          if (a.schedule.date) {
            ADay = a.schedule.date.split('-')[0]
            AMonth = a.schedule.date.split('-')[1]
            AYear = a.schedule.date.split('-')[2]
          } else {
            ADay = a.schedule.currentDelivery.split('-')[0]
            AMonth = a.schedule.currentDelivery.split('-')[1]
            AYear = a.schedule.currentDelivery.split('-')[2]
          }
          if (b.schedule.date) {
            BDay = b.schedule.date.split('-')[0]
            BMonth = b.schedule.date.split('-')[1]
            BYear = b.schedule.date.split('-')[2]
          } else {
            BDay = b.schedule.currentDelivery.split('-')[0]
            BMonth = b.schedule.currentDelivery.split('-')[1]
            BYear = b.schedule.currentDelivery.split('-')[2]
          }

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
        console.log(array)

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
    <div style={{ overflow: 'hidden' }} className={styles.allSchedules}>
      {load && <Load />}
      <div className={styles.screenDisplay}>
        <div className={styles.list}>
          <h1>Hoje</h1>
          {allSchedules && allSchedules.length == 0 && <p >Nenhum agendamento...</p>}
          <ul>
            {allSchedules && allSchedules.map((item) => {
              if (item.schedule && item.schedule.date == dateToday) {
                return (
                  <li key={item.schedule.userId} className={styles.scheduleBox}>
                  <div id={item.schedule.userId}>
                    <span className={styles.name}>{item.name.length >= 16 ? item.name.slice(0, 16) + "..." : item.name}</span>
                    <span>Hora: <b>{item.schedule.time}</b></span>
                    <span>Dia: <b>{item.schedule.day}</b></span>
                    <span>Data: <b>{item.schedule.currentDelivery || item.schedule.date}</b></span>
                    <span className={styles.key}>{item.schedule.frequency ? item.schedule.frequency : 'Exporádico'}</span>
                  </div>
                </li>
                )
              }
            })}
          </ul>
          <h1>Todos os agendamentos</h1>
          {allSchedules && allSchedules.length == 0 && <p>Nenhum agendamento...</p>}
          <ul>
            {allSchedules && allSchedules.map((item) => {
              if (item.schedule && item.schedule.date != dateToday) {
                return (
                  <li key={item.schedule.userId} className={styles.scheduleBox}>
                    <div id={item.schedule.userId}>
                      <span className={styles.name}>{item.name.length >= 16 ? item.name.slice(0, 16) + "..." : item.name}</span>
                      <span>Hora: <b>{item.schedule.time}</b></span>
                      <span>Dia: <b>{item.schedule.day}</b></span>
                      <span>Data: <b>{item.schedule.currentDelivery || item.schedule.date}</b></span>
                      <span className={styles.key}>{item.schedule.frequency ? item.schedule.frequency : 'Exporádico'}</span>
                    </div>
                  </li>
                )
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AllSchedules