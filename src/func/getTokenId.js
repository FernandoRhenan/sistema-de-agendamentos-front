import { api } from "../axiosConfig"

const getTokenId = () => {
    const dataStorageToken = sessionStorage.getItem('@Auth:token')
    const dataStorageAdminToken = sessionStorage.getItem('@Admin:token')
    const dataStorageName = sessionStorage.getItem('@Auth:name')

    let tokenId = ''
    let userName = ''
    let adminTokenId = ''

    if (dataStorageToken && dataStorageName) {

        api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(dataStorageToken)}`

        const partialToken = dataStorageToken.split(".")[1]
        const dataToken = JSON.parse(window.atob(partialToken))
        tokenId = dataToken.userId
        userName = JSON.parse(dataStorageName)

    } else {
        tokenId = ''
        userName = ''
    }

    if(dataStorageAdminToken){
        api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(dataStorageAdminToken)}`

        const partialAdminToken = dataStorageAdminToken.split(".")[1]
        const dataAdminToken = JSON.parse(window.atob(partialAdminToken))
        adminTokenId = dataAdminToken.userId
    }else{
        adminTokenId = ''
    }

    return { tokenId, userName, adminTokenId }
}

export default getTokenId