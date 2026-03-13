import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import PostCard from './../PostCard/PostCard';
import { Card, CardBody } from "@nextui-org/react";
import Louder from '../Louder/Louder';
import useFollow from '../../hooks/hooks/useFollow';


export default function UserProfile() {
    const {postId} = useParams()  // id of user who created post
    const { mutate: follow, isPending } = useFollow();

    function getUserPosts(){
    return axios.get(`https://route-posts.routemisr.com/users/${postId}/posts` ,{
        headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
    })
    }  
        
    const{data:userposts} = useQuery({
        queryKey: ["userposts"],
        queryFn:getUserPosts
    })

        function getUserInfo(){
            return axios.get(`https://route-posts.routemisr.com/users/${postId}/profile` ,{
            headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
        })
        }  
            
        const{data} = useQuery({
            queryKey: ["userProfile", postId],          // ← مهم جدًا
            queryFn: getUserInfo,
            enabled: !!postId,                           // اختياري لكن مفيد
        })

        const user = data?.data?.data?.user;

        if (!user) {
            return <Louder />;
          };  
        


        const {
        _id,
        name,
        username,
        email,
        dateOfBirth,
        gender,
        photo,
        cover,
        followersCount,
        followingCount,
        bookmarksCount,
        createdAt,
} = user;







  return (<>

    <Card className="mb-4 max-w-3xl mx-auto shadow-lg">
            <CardBody className="p-0">

                <div className="px-6 pb-6 -mt-10">
    
                <div className="relative"> <img src={cover && "https://via.placeholder.com/900x250"} alt="cover" className="w-full h-52 object-cover" /></div>
                
                <div className="flex items-center gap-6">
    
                    <div className="relative w-fit">
                    { photo && <img
                        src={photo}
                        alt="profile"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />}
                    </div>
    
                    <div>
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-gray-500">@{username}</p>
                    </div>
                    
                    <div className='ml-auto'>
                    <button
                        onClick={() => follow(_id )}
                        className="text-blue-500 text-sm font-medium cursor-pointer"
                        >
                        {isPending ? "Loading..." : "+ Follow"}
                    </button>
                    </div>
    
                </div>
    
                {/* About */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
    
                    <div className="space-y-2 text-sm">
                    <p>
                        <span className="font-semibold">Date of Birth:</span>{" "}
                        {new Date(dateOfBirth).toLocaleDateString()}
                    </p>
    
                    <p>
                        <span className="font-semibold">Gender:</span> {gender}
                    </p>
    
                    <p>
                        <span className="font-semibold">Joined:</span>{" "}
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                    </div>
                </div>
    
                {/* Stats */}
                <div className="flex gap-8 mt-6">
                    <div>
                    <p className="font-bold text-lg">{followersCount}</p>
                    <p className="text-gray-500 text-sm">Followers</p>
                    </div>
    
                    <div>
                    <p className="font-bold text-lg">{followingCount}</p>
                    <p className="text-gray-500 text-sm">Following</p>
                    </div>
    
                    <div>
                    <p className="font-bold text-lg">{bookmarksCount}</p>
                    <p className="text-gray-500 text-sm">Bookmarks</p>
                    </div>
                </div>
    
                </div>
            </CardBody>
            </Card>

    {userposts?.data?.data?.posts.map( (post) => (
            <PostCard key={post.id} post={post}/>
            ))}
  </>)
}
