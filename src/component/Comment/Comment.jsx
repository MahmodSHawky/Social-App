import React, { useContext, useRef } from 'react'
import { CardHeader } from '@heroui/react';
import { CardFooter,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button, } from '@heroui/react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Image } from '@heroui/react';
import { Divider } from '@heroui/react';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDisclosure } from '@nextui-org/react';
import { FaPen } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { AuthContext } from '../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { IoIosImages } from 'react-icons/io';
import { useState } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
 

dayjs.extend(relativeTime);


export default function Comment({comment, idOfPost}) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    const commentId = comment?.commentCreator._id
    const {logedUserId} = useContext(AuthContext) // user id from login user
    

    

    function deleteMyComments(){
        return axios.delete(`https://route-posts.routemisr.com/posts/${idOfPost}/comments/${comment?._id}`,{
            headers :{Authorization :  `Bearer ${localStorage.getItem("userToken")}` }
        })
    }

    const query = useQueryClient()

    const {isPending , mutate} = useMutation({
        mutationFn: deleteMyComments,
        onSuccess: () => {
            toast.success('comment deleted successrully', {position: "top-center",autoClose: 1000 ,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,})
            query.invalidateQueries({queryKey:  ["getPostComments"]})

        },
        onError: (error) => {
    console.log(error);
    toast.error("cannot delete");
},
        onSettled : () => {}
    })




    const updateText = useRef(null)
    const updateFileInput = useRef(null)
    const [preview, setPreview] = useState(null)
    

    function returnData(){
        const formData = new FormData()

        if(updateText.current.value){
            formData.append("content", updateText.current.value)    
        }

        
        if(updateFileInput.current.files[0]){
            formData.append("image", updateFileInput.current.files[0])
        }

        return formData 
    }

    function handelImagePreview(e){
        const path = URL.createObjectURL(e.target.files[0]); // to get the path of image
        setPreview(path)
    }

    function handleRemveImage(){
        setPreview(null)
        updateFileInput.current.value = ""
    }


    function upDateMyComments(){
        return axios.put(`https://route-posts.routemisr.com/posts/${idOfPost}/comments/${comment?._id}`, returnData(),{
            headers: {Authorization :`Bearer ${localStorage.getItem("userToken")}`}
        })
    }

    const {mutate:updateMutate} = useMutation({
        mutationFn :upDateMyComments,
        onSuccess: () => {
            console.log("updated");
            query.invalidateQueries({queryKey : ["getPostComments"]})
            toast.success('comment updated successrully', {position: "top-center",autoClose: 1000 ,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});    
        },
        onError : (err) => {
            console.log(err);
            toast.error('try again', {position: "top-center",autoClose: 1000,hideProgressBar: false,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});
        }
    })

return (<>
    <CardFooter className="block pt-0">
    <CardHeader className="flex gap-3 p-0.5 items-start">

    <Image
        alt="user"
        height={25}
        radius="sm"
        src={comment.commentCreator.photo}
    />

    <div className="bg-slate-100 rounded-xl px-3 py-2 max-w-[85%]">
        <div className='flex justify-between gap-1'>
            <p className="text-sm font-semibold text-blue-950">
            {comment.commentCreator.name}
            </p>
            {commentId === logedUserId && <Dropdown>
                <DropdownTrigger>
                    <HiOutlineDotsVertical className="cursor-pointer" />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" >
                    <DropdownItem key="edit"> <div onClick={onOpen} className=" flex items-center gap-2">  Edit <FaPen />  </div> </DropdownItem>                    
                    <DropdownItem key="delete" className="text-danger" color="danger"> <div onClick={() => {mutate()}} className="flex items-center gap-2">  Delete <FaTrashCan /> </div>   </DropdownItem>
                </DropdownMenu>
            </Dropdown> }
        </div>


        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Update your comment</ModalHeader>
                <ModalBody>
                    <textarea ref={updateText} defaultValue={comment?.content}></textarea>
                    <div className='relative'>
                    { preview &&<>
                    <img
                        src={preview}
                        alt="preview"
                        className="object-cover rounded-xl max-h-64 mx-auto"
                    />
                    <IoMdCloseCircleOutline onClick={handleRemveImage} className='absolute top-2.5 end-2.5 bg-slate-900 text-white cursor-pointer size-7' />
                    </>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <label>
                        <IoIosImages className='text-blue-300 size-9 cursor-pointer' />
                        <input type="file" hidden
                        ref={updateFileInput} 
                        onChange={handelImagePreview}
                        />
                    </label>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Button color="primary" onPress={function(){
                updateMutate()
                onClose()
                }}>
                    Update
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>

        <p className="text-xs text-default-500 mt-1">
        {dayjs(comment.createdAt).fromNow()}
        
        </p>
        {comment.content && <p className="text-sm bg-slate-50 rounded-md ps-2 text-gray-800 leading-relaxed break-words">{comment.content}</p>}
        {comment.image && <img src={comment.image}/>

    }


    </div>

    </CardHeader>
    </CardFooter>

</>
    
)
}
