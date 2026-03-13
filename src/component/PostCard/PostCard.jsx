import {Card, CardHeader, CardBody, CardFooter, Divider, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,} from "@heroui/react";
import Comment from './../Comment/Comment';
import {Link, useNavigate}  from 'react-router-dom';
import axios from "axios";
import { Query, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from './../CommentCreation/CommentCreation';
import { HiOutlineDotsVertical } from "react-icons/hi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaPen } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./../Context/AuthContext";
import { Bounce, toast } from 'react-toastify';
import { IoIosImages, IoMdCloseCircleOutline } from 'react-icons/io';
import { registry } from "zod";
import {Textarea} from "@heroui/react";
import useFollow from '../../hooks/hooks/useFollow';




dayjs.extend(relativeTime);


export default function App({post, isPostDetails = false}) {
    

    const {userLogin, setuserLogin,userInfo} = useContext(AuthContext)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {body , image, topComment, createdAt, user, id } = post
    
    const { name, photo } = user ; 
    const myTopComment = topComment
    

    if(!body && !image) return

    const postId = user._id   // user id from post
    const {logedUserId} = useContext(AuthContext) // user id from login user

    const { mutate: follow, isPending:followPending } = useFollow();


//get comment
    function getAllComments(){
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments` ,{
            headers :{Authorization: `Bearer ${localStorage.getItem("userToken")}`}
        })
    
    }

    const {data , isError, isLoading, error} = useQuery({
        queryKey :["getPostComments",id],
        queryFn: getAllComments,
        enabled: isPostDetails 
    })



    
////////////////////////////////////////////////
//delete post
    function deleteMyPosts(){
        return axios.delete(`https://route-posts.routemisr.com/posts/${id}`,{
            headers :{Authorization :  `Bearer ${localStorage.getItem("userToken")}` }
        })
    }

    const query = useQueryClient()
    const navigate = useNavigate()

    const {isPending , mutate} = useMutation({
        mutationFn: deleteMyPosts,
        onSuccess: () => {
            toast.success('post deleted successrully', {position: "top-center",autoClose: 1000 ,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,})
            query.invalidateQueries({queryKey:  ["getAllPosts"]})
            navigate("/app");
        },
        onError: () => {toast.error("cannot delet")},
        onSettled : () => {}
    })



    const updateText = useRef(null)
    const updateFileInput = useRef(null)
    const [preview, setPreview] = useState(image); 
    

    function returnData(){
        const formData = new FormData()

        if(updateText.current.value){
            formData.append("body", updateText.current.value)    
        }

        
        if(updateFileInput.current.files[0]){
            formData.append("image", updateFileInput.current.files[0])
        }

        else if(preview === null){
        formData.append("image", "null")
        }

        return formData 
    }

    function handelImagePreview(e){
        const path = URL.createObjectURL(e.target.files[0]); // to get the path of image
        setPreview(path)
    }

    function handleRemveImage(){
        setPreview(null);
        updateFileInput.current.value = ""
        
    }



///////////////////////////////////////////////////////
//updata post
    function upDateMyPost(){
        return axios.put(`https://route-posts.routemisr.com/posts/${id}`, returnData(),{
            headers: {Authorization :`Bearer ${localStorage.getItem("userToken")}`}
        })
    }

    const {mutate:updateMutate} = useMutation({
        mutationFn :upDateMyPost,
        onSuccess: () => {
            console.log("updated");
            query.invalidateQueries({queryKey : ["getAllPosts"]})
            toast.success('post updated successrully', {position: "top-center",autoClose: 1000 ,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});    
        },
        onError : (err) => {
            console.log(err);
            toast.error('try again', {position: "top-center",autoClose: 1000,hideProgressBar: false,closeOnClick: false,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Bounce,});
        }
    })


///////////////////////////////////////////
//like
    function hundleLike(){
        return axios.put(`https://route-posts.routemisr.com/posts/${post?.id}/like`,{} ,{
            headers: {Authorization :`Bearer ${localStorage.getItem("userToken")}`}
        })
    }

    const{data:likeData, mutate:likeMutate} = useMutation({
        mutationFn :hundleLike,
        onSuccess: () => {
            query.invalidateQueries({queryKey : ["getAllPosts"]})
            query.invalidateQueries({queryKey : ["userposts"]})
            query.invalidateQueries({ queryKey : ["getSinglePost",id]})
        }
        
    })
///////////////////////////////
//share

    const [isModalOpen, setModalOpen] = useState(false); // state خاص بالـ modal
    const headOfShareText = useRef(null)
    function sharePost() {
        // const text = headOfShareText.current?.value;

        return axios.post(
            `https://route-posts.routemisr.com/posts/${id}/share`,
            { body: headOfShareText.current?.value },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            }
        );
    }
    
    const {data:sharedData, mutate:shareMutate} = useMutation({
        mutationFn:sharePost,
        onSuccess: () => {
        setModalOpen(false)

        if (headOfShareText.current) {
            headOfShareText.current.value = ""
        }

        query.invalidateQueries({ queryKey: ["getAllPosts"] })
    },
        onError: (err) => {
            console.error("Failed to share:", err);
            alert("Failed to share post.");
        }
    })

    
return (<>
    <Card className=" max-w-150 mx-auto mb-6">
        <CardHeader className="flex justify-between gap-3">
            <div >    
                <div className="flex gap-2">
                    {photo &&<Image
                    alt="heroui logo"
                    height={40}
                    radius="full"
                    src={photo}
                    />}
                    <div>
                        <Link to={`/app/userprofile/${postId}`} ><p className="pt-1 ext-md font-bold">{name}</p></Link>
                        <p className="text-small text-default-500">{dayjs(createdAt).fromNow()}</p>
                    </div>
                </div>
            </div>
            {logedUserId === postId &&<Dropdown>
                <DropdownTrigger>
                    <HiOutlineDotsVertical className="cursor-pointer" />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" >
                    <DropdownItem key="edit"> <div onClick={onOpen} className=" flex items-center gap-2">  Edit <FaPen />  </div> </DropdownItem>                    
                    <DropdownItem key="delete" className="text-danger" color="danger"> <div onClick={mutate} className="flex items-center gap-2">  Delete <FaTrashCan /> </div>   </DropdownItem>
                </DropdownMenu>
            </Dropdown> }
            
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Update your post</ModalHeader>
                    <ModalBody>
                        <textarea ref={updateText} defaultValue={body}></textarea>
                        <div className='relative'>
                        {preview &&<> 
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
            {logedUserId !== postId &&<>
            <button
            onClick={() => follow(postId)}
            className="text-blue-500 text-sm font-medium cursor-pointer"
            >
            {followPending ? "Loading..." : "+ Follow"}
        </button></> }    
        </CardHeader>
        <Divider />
        <CardBody>
        {post.sharedPost ? (
            <>
            {post.body && post.body.trim() !== "" && (
                <p className="mb-4 text-base leading-relaxed whitespace-pre-wrap">
                {post.body}
                </p>
            )}

            <div 
                className="border border-gray-300 rounded-xl overflow-hidden bg-white hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/app/postdetails/${post.sharedPost._id}`)}
            >
                <div className="flex items-center gap-3 px-4 py-3">
                <Avatar 
                    src={post.sharedPost.user?.photo } 
                    size="sm" 
                />
                <div>
                    <p className="font-medium text-sm">{post.sharedPost.user?.name}</p>
                    <p className="text-xs text-gray-500">
                    {dayjs(post.sharedPost.createdAt).fromNow()}
                    </p>
                </div>
                </div>
                <Divider />
                {/* محتوى البوست الأصلي */}
                <div className="p-4">
                {post.sharedPost.body && (
                    <p className="mb-3 text-base">{post.sharedPost.body}</p>
                )}

                {post.sharedPost.image && (
                    <img
                    src={post.sharedPost.image}
                    alt="original post image"
                    className="rounded-lg w-full object-cover max-h-64"
                    />
                )}
                </div>
            </div>
            </>
        ) : (
            <>
            {post.body && (
                <p className="mb-4 text-base leading-relaxed whitespace-pre-wrap">
                {post.body}
                </p>
            )}
            {post.image && (
                <img
                src={post.image}
                alt={post.body || "post image"}
                className="rounded-xl w-full object-cover max-h-96"
                />
            )}
            </>
        )}
        </CardBody>
        <Divider />
        <CardFooter>
            <div className="flex w-full justify-between">
                <div onClick={likeMutate} className= " flex-1 text-sm text-center py-2 hover:bg-slate-100 hover:rounded-sm cursor-pointer"> <p className={post?.likesCount?"text-blue-500" :"text-black"}>👍 like  {post?.likesCount}</p>  </div>
                <div className="flex-1 text-sm text-center py-2 hover:bg-slate-100 hover:rounded-sm cursor-pointer"> <Link to={`/app/postdetails/${id}`} > <p className={post?.commentsCount?"text-blue-500" :"text-black"}>💬 comment {post?.commentsCount}</p> </Link> </div>
                <div className="flex-1 text-sm text-center py-2 hover:bg-slate-100 hover:rounded-sm cursor-pointer">  <p onClick={() => setModalOpen(true)} className={post?.sharesCount?"text-blue-500" :"text-black"}> 🔄 share  {post?.sharesCount}</p></div>
                <Modal isOpen={isModalOpen} onOpenChange={(open) => setModalOpen(open)}     // تتحكم في state المودال
                >
                    <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex gap-2">
                            <Avatar size="md" src={userInfo.photo} />
                            <p className="m-1">{userInfo.name}</p>
                        </ModalHeader>
                        <ModalBody>
                            <Textarea ref={headOfShareText}  placeholder="Enter your description" />
                        </ModalBody>
                        <ModalFooter>
                            
                            <Button color="danger" variant="light" onPress={onClose}>
                            Close
                            </Button>
                            <Button color="primary" onPress={function(){

                        onClose()
                        shareMutate()
                        }}>
                            share
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                    </ModalContent>
                </Modal>
            </div>

        </CardFooter>
        

        <CommentCreation postId={id} queryKey={ isPostDetails ? ["getPostComments"] : ["getAllPosts"]}/>  
        
        {isPostDetails === false && myTopComment && ( <Comment idOfPost = {id}  comment={myTopComment} /> )}
        {isPostDetails && data?.data.data.comments.map((currentComment) => <Comment idOfPost = {id} key={currentComment._id} comment={currentComment} />) }
        
    </Card>
</>);
}
