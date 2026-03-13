import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useFollow(){

  const queryClient = useQueryClient();

  function followUser(userId){
    return axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,{},
        {
            headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
        }
        )
    }

  return useMutation({
    mutationFn: followUser,

    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey:["getSuggestFriends"]}),
        queryClient.invalidateQueries({ queryKey: ["getUserProfile"] }),
        queryClient.invalidateQueries({ queryKey: ["getProfile"] })

    }
  })
}