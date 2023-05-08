import { api } from "../axiosConfig"

const UseDeleteSchedule = async (id, type) => {

    let message
    let error

    if (type == 'fixo') {
        await api.delete(`/client/delete-fixed-schedule/${id}`).then((res) => {
            message = res.data.message
        }).catch((err) => {
            message = err.response.data.message
            error = true
        })
    } else {
        await api.delete(`/client/delete-schedule/${id}`).then((res) => {
            message = res.data.message
        }).catch((err) => {
            message = err.response.data.message
            error = true
        })
    }

    return { message, error }

}

export default UseDeleteSchedule