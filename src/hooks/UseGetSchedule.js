import { api } from "../axiosConfig"

const UseGetSchedule = async (id) => {

    let data
    let message
    let error

    await api.get(`/client/get-schedule/${id}`).then((res) => {
        data = res.data.data
    }).catch((err) => {
        message = err.response.data.message
        error = true
    })

    return { message, error, data }

}

export default UseGetSchedule