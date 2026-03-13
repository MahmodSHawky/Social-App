import React, { useContext, useEffect } from "react";
import Profile from "./../Profile/Profile";
import axios from "axios";
import { useState } from "react";
import PostCard from "./../PostCard/PostCard";
import Louder from "./../Louder/Louder";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import { Helmet } from "react-helmet";
import SuggestedFriendsDropdown from "../SuggestedFriendsDropdown/SuggestedFriendsDropdown";


export default function Home() {
  // const [allPosts, setallPosts] = useState(null);
  // const [isLouding, setisLouding] = useState(true)
  // const [isError, setisError] = useState(false)

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      params: { sort: "-createdAt" },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    // .then( (res) => {
    //   console.log(res.data.data.posts);
    //   setallPosts(res.data.data.posts)
    // })
    // .catch ( (err) => {
    //   console.log("errorrrrrrrrrr");
    //   setisError(true)
    // })
    // .finally( ()=> {
    //   setisLouding(false)
    // })
  }

  // useEffect( () => {
  //   getAllPosts()
  // },[])
  //     هتعوضهم tanstack كل اللي انا عملتلهم كومنت دول

  const { data, isError, isFetched, isLoading } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <Louder />;
  }

  if (isError) {
    return <h1>Error, Please try again lster</h1>;
  }

  return (
    <>
      <Helmet>
        <title>home page</title>
      </Helmet>

      <PostCreation />
      <div className="lg:hidden mb-4">
        <SuggestedFriendsDropdown />
      </div>
      {data?.data.data.posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
