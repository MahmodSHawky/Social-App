import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Louder from "../Louder/Louder";

export default function Notifications() {

  function getNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  // console.log(data?.data?.data);
  
  const notifications = data?.data?.data?.notifications || []

  if (isLoading) return <Louder/>

  return (
    <div className="space-y-3">

      {notifications?.map((notification) => {

        const { actor, entity, createdAt, isRead, _id } = notification;

        return (
          <div
            key={_id}
            className={`flex items-start gap-4 p-4 rounded-xl border 
            ${!isRead ? "bg-blue-50 border-blue-200" : "bg-white"}`}
          >

            <img
              src={actor?.photo}
              alt={actor?.name}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">

              <p className="text-sm">
                <span className="font-semibold">{actor?.name}</span>{" "}
                liked your post
              </p>

              <p className="text-gray-600 text-sm mt-1">
                {entity?.body}
              </p>

              <button className="text-blue-500 text-xs mt-2">
                ✔ Mark as read
              </button>

            </div>

            <div className="flex flex-col items-end text-xs text-gray-500 gap-2">

              <span>
                {new Date(createdAt).toLocaleTimeString()}
              </span>

              {!isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}