import { createContext, useState } from 'react'
import getTokenId from '../func/getTokenId'

export const AuthContext = createContext()

function AuthProvider({ children }) {

    const { tokenId, userName: name, adminTokenId } = getTokenId()

    const [userId, setUserId] = useState(tokenId)
    const [userName, setUserName] = useState(name)
    const [adminId, setAdminId] = useState(adminTokenId)


    return (
        <AuthContext.Provider value={{ userId, setUserId, userName, setUserName, adminId, setAdminId }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider