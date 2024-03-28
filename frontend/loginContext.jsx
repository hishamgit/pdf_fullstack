import {createContext, useState} from 'react'
export const loginContext=createContext()

 function LoginStatus({children}){
    const [loginStatus,setLoginStatus]=useState(false); 
     const [user, setUser] = useState("");
    return(
        <loginContext.Provider value={{loginStatus,setLoginStatus,user,setUser}}>
            {children}
        </loginContext.Provider>
    )
}
export default LoginStatus;