import { Avatar,  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter,    Button,  useDisclosure, } from '@heroui/react'
import { Query, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoIosImages } from "react-icons/io";
import { Bounce, toast } from 'react-toastify';
import { AuthContext } from '../Context/AuthContext';



export default function () {

    const {userInfo} = useContext(AuthContext)
    

    const [isUpLoaded, setisUpLoaded] = useState(false)

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const textInput = useRef(null); // to select text input 
    const imageInput = useRef(null); // to select image 

    const query = useQueryClient()

    const {data, isPending, error, mutate} = useMutation({
        mutationFn: creatPost,
        onSuccess: () => {
            setisUpLoaded(false)
            console.log("success");
            query.invalidateQueries({queryKey : ["getAllPosts"]})
            query.invalidateQueries({queryKey : ["userposts"]})
            toast.success('post created successrully', {position: "top-center",autoClose: 1000 ,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});
            // textInput.current.value =""
            // imageInput.current.value =""
        },
        onError : () => {
            toast.error('🦄 Wow so easy!', {position: "top-center",autoClose: 1000,hideProgressBar: false,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});
        }
    })

    function returnData(){
        const formData = new FormData()

        if(textInput.current.value){
            formData.append("body", textInput.current.value)    
        }

        if(imageInput.current.files[0]){
            formData.append("image", imageInput.current.files[0])
        }
        return formData 
    }

    function creatPost(){
        return axios.post(`https://route-posts.routemisr.com/posts`, returnData() ,{
            headers: {Authorization :`Bearer ${localStorage.getItem("userToken")}`}
        } )
    }

    function handelImagePreview(e){
        const path = URL.createObjectURL(e.target.files[0]); // to get the path of image
        setisUpLoaded(path)
    }

    function handleRemveImage(){
        setisUpLoaded(false);
        imageInput.current.value = ""
    }

    return (
        <div className='max-w-150 mx-auto mb-6 bg bg-slate-100 p-2 rounded-sm'>
            <div className='flex gap-2'>
                <Avatar size="md" src={userInfo?.photo} />
                <input onClick={onOpen} type="text" className='w-full bg-slate-300 rounded-sm' placeholder='What is your mind.?' readOnly />
            </div>
            <div className='modal'>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Create your post</ModalHeader>
                    <ModalBody>
                        <textarea ref={textInput} className='w-full bg-slate-100 rounded-sm p-2' name="" id="" placeholder='write here'></textarea>
                        {isUpLoaded && <>
                        <div className='relative'>
                            <img
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src={isUpLoaded}
                            />
                            <IoMdCloseCircleOutline onClick={handleRemveImage} className='absolute top-2.5 end-2.5 bg-slate-900 text-white cursor-pointer size-7' />
                        </div>
                        </>}
                    </ModalBody>
                    <ModalFooter className='flex items-center'>
                        <label>
                            <IoIosImages className='text-blue-300 size-9 cursor-pointer' />
                            <input ref={imageInput} onChange={handelImagePreview}  type="file" hidden/>
                        </label>
                        <Button color="primary" onPress={function(){
                            onClose() 
                            mutate()
                            }}>
                        Create
                        </Button>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
                </Modal>
            </div>                
        </div>
    )
}
