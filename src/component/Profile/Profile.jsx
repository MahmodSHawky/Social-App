import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProfileInfo from './../ProfileInfo/ProfileInfo';
import PostCreation from './../PostCreation/PostCreation';
import PostCard from './../PostCard/PostCard';
import  {AuthContext}  from './../Context/AuthContext';


export default function Profile() {


  const {userInfo} = useContext(AuthContext)
  





  function getUserPosts(){
    return axios.get(`https://route-posts.routemisr.com/users/${userInfo?.id}/posts` ,{
        headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
    })
  }  
    
  const{data:userposts} = useQuery({
      queryKey: ["userposts"],
      queryFn:getUserPosts
  })

  


    
  return ( <>
    <Helmet>
      <title>profile page</title>
    </Helmet>

    <ProfileInfo  />
    < PostCreation />
    {userposts?.data?.data?.posts.map( (post) => (
          <PostCard key={post.id} post={post}/>
        ))}



 </> )
}
