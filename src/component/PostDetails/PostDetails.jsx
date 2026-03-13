import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import Louder from './../Louder/Louder';
import PostCard from './../PostCard/PostCard'
import { Helmet } from 'react-helmet';



export default function PostDetails() {

    const {id} = useParams()

    function getPostDetails(){
        return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })

    }
    

    const {data , isError, isFetched, isLoading} = useQuery({
queryKey : ["getSinglePost",id],
queryFn : getPostDetails,
})

if(isLoading) {
return <Louder/>
}

// console.log(data?.data.data.post);


if(isError){
return <h1>Error, Please try again lster</h1>
}


    return <>

        <Helmet>
            <title>post details</title>
        </Helmet>

        <PostCard post={data?.data.data.post} isPostDetails={true}/>


    

</>

}
