import React from 'react'
import { image, Input } from '@heroui/react';
import { IoIosSend } from "react-icons/io";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { IoMdImages } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImSpinner9 } from "react-icons/im";



export default function CommentCreation({postId , queryKey}) {

    const form = useForm({
        defaultValues :{
            content : "",
            image :""
        }
    })

    const quary = useQueryClient()

    const {register, handleSubmit , reset} = form

    const formData = new FormData()

    const {data , isPending , mutate  } = useMutation({
        mutationFn : createComment, 
        onSuccess : ()=> {
            reset()          // to reset values
            quary.invalidateQueries({queryKey : queryKey})  // to udate comennts 
        },
        onError : () => {},
        onSettled : () => {}
    })


    function createComment(){ 
        return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,formData,{
                headers :{
                    Authorization : `Bearer ${localStorage.getItem("userToken")}`
                }
            })
        }

    function handelCreateComment(values){

        // console.log(values.body);
        // console.log(values.image);
        
        if(!values.body && !values.image[0]) return

        if (values.body){
        formData.append("content", values.body)
        }

        if (values.image[0]){
        formData.append("image", values.image[0])        
        } 
        
        mutate()  //send request
    }



return (
<>
    <div className='w-[90%] mx-auto cursor-pointer my-1'>
        <form onSubmit={handleSubmit(handelCreateComment)}>
            <Input
            {...register("body")}
            labelPlacement="outside"
            placeholder="Enter your comment"
            endContent={ <>
                <label htmlFor="file">
            <div className='bg-slate-300 text-white p-1 flex justify-center items-center rounded-sm cursor-pointer'>
                <IoMdImages />
            </div>
            </label>
            <input {...register("image")} id='file' type='file' hidden/>
            <button disabled={isPending} type='submit' className='disabled:cursor-not-allowed bg-slate-300 text-white p-1 ms-2 flex justify-center items-center rounded-sm cursor-pointer'>
                {isPending ? <ImSpinner9 className='animate-spin' /> :  <IoIosSend />}
            </button>
            </>}
            type="text"
        />
        
        </form>
    </div>
</>
)
}
