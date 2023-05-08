import { api } from "../axiosConfig"

const UseGetAllSellers = async (userId, signal) => {

    let sellers = []
    let errorMessage = ''

    await api.get(`/client/get-all-sellers/${userId}`, { signal }).then((res) => {
        sellers = res.data.data
    }).catch((err) => {
        errorMessage = err.response.data.message
    })

    return {sellers, errorMessage}

}

export default UseGetAllSellers