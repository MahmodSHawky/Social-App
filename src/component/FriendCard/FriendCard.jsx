
import React from 'react'
import useFollow from '../../hooks/hooks/useFollow';
import { Link } from 'react-router-dom';




export default function FriendCard({name,username,followers,photo,userId}){

    const { mutate: follow, isPending } = useFollow();

    return(
        <div className="flex items-center justify-between shadow-lg p-3 rounded-lg">

        <div className="flex gap-3 items-center">

            <img
            src={photo}
            className="w-10 h-10 rounded-full object-cover"
            />

            <div>

            <Link to={`/app/userprofile/${userId}`} ><p className="font-semibold text-sm">
                {name}
            </p></Link>

            {/* <p className="text-gray-500 text-xs">
                @{username}
            </p> */}

            <span className="text-xs text-gray-400">
                {followers} followers
            </span>

            </div>

        </div>

        <button
            onClick={() => follow(userId )}
            className="text-blue-500 text-sm font-medium cursor-pointer"
            >
            {isPending ? "Loading..." : "+ Follow"}
        </button>

        </div>
    )
}