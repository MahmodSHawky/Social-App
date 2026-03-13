import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FriendCard from "../FriendCard/FriendCard";


export default function SuggestedFriends(){

    function getSuggestFriends(){
        return axios.get(
        "https://route-posts.routemisr.com/users/suggestions?limit=10",
        {
            headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        }
        )
    }

    const {data,isLoading} = useQuery({
        queryKey:["getSuggestFriends"],
        queryFn:getSuggestFriends
    })

    if(isLoading) return 

    const friends = data?.data?.data?.suggestions
    

    return(
        <div className="bg-white shadow rounded-xl p-4">

        <h3 className="font-bold mb-4">
            Suggested Friends
        </h3>

        <div className="space-y-3">

            {friends.map((friend)=>(
            <FriendCard
                key={friend._id}
                name={friend.name}
                username={friend.username}
                followers={friend.followersCount}
                photo={friend.photo}
                userId={friend._id}
            />
            ))}

        </div>

    </div>
  )
}