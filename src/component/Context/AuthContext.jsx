import { createContext ,useEffect,useState} from "react";
import {jwtDecode} from "jwt-decode"
import { useQuery } from '@tanstack/react-query';
import  axios  from 'axios';


export const AuthContext = createContext();

export default function AuthContextProvider({children}){

const [userLogin, setuserLogin] = useState(null)

const [logedUserId, setlogedUserId] = useState(null)

useEffect ( () => {
    if (localStorage.getItem("userToken")) { 
        setuserLogin(localStorage.getItem("userToken")) 
    } }, [])

useEffect ( () => {
    if (localStorage.getItem("userToken")){
        const {user} = jwtDecode(localStorage.getItem("userToken"))
        setlogedUserId(user)
        
    }
},[userLogin])


function getMyProfile(){
    return axios.get(`https://route-posts.routemisr.com/users/profile-data` ,{
        headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
    })
    
  }


const [userInfo, setUserInfo] = useState(null)

const {data} = useQuery({
  queryKey:["getProfile"],
  queryFn:getMyProfile,
  enabled: !!userLogin,
})

useEffect(()=>{
  if(data){
    setUserInfo(data?.data?.data?.user)
  }
},[data])

    return <> <AuthContext.Provider value={{
    userLogin,
    setuserLogin,
    logedUserId,
    setlogedUserId,
    userInfo
    }}>
        {children}
    </AuthContext.Provider>
    </> 
}