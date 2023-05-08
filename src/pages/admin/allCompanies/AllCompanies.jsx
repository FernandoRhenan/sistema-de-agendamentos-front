import styles from './AllCompanies.module.css'
import { useEffect, useState } from 'react'
import { api } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import Load from '../../../components/load/Load'

const AllCompanies = () => {

  const [users, setUsers] = useState([])
  const [load, setLoad] = useState(true)

  useEffect(() => {
    let abortController
    (async () => {
      abortController = new AbortController()
      let signal = abortController.signal
      await api.get('/admin/apr-all-users', { signal }).then((res) => {
        setUsers(res.data.data)
      }).catch((err) => {
        toast.error(err.response.data.message)
      })

    })()
    setLoad(false)
    return () => {
      abortController.abort()
    }
  }, [])

  const handleDelete = async (e) => {
    if (confirm('Você irá excluir para sempre esta empresa do sistema!') == true) {
      setLoad(true)
      let id = e.target.id
      await api.delete(`/admin/apr-delete-user/${id}`).then((res) => {
        let newArray = users.filter((item) => {
          return item.id != id
        })
        setUsers(newArray)
        toast.success(res.data.message)

      }).catch((err) => {
        toast.error(err.response.data.message)
      })
      setLoad(false)
    }
  }

  return (
    <div className={styles.allCompanies}>
      {load && <Load />}
      <span className={styles.n_companies}>Número de empresas cadastradas: {users.length}</span>
      <ul>
        {users && users.map((item, i) => (
          <li key={i}>
            <span>Nome: <b>{item.name}</b></span>
            <span>Razão social: <b>{item.social}</b></span>
            <span>CNPJ: <b>{item.cnpj}</b></span>
            <span>E-mail: <b>{item.email}</b></span>
            <span>Telefone: <b>{item.phone}</b></span>
            <span><button id={item.id} onClick={handleDelete}>Excluir</button></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllCompanies