import { Card, CardBody } from "@nextui-org/react";
import { useContext, useRef, useState } from "react";
import { AuthContext } from './../Context/AuthContext';
import { useMutation } from "@tanstack/react-query";
import { FaCamera } from "react-icons/fa";
import axios from "axios";

export default function ProfileInfo() {


    const {userInfo} = useContext(AuthContext)

    const [isUpLoaded, setisUpLoaded] = useState(false)

    const imageInput = useRef(null); // to select image 
    
    
    function returnData(){
        const formData = new FormData()


        if(imageInput.current.files[0]){
            formData.append("photo", imageInput.current.files[0])
        }
        return formData 
    }


    function upLoudProfile(){
        return axios.put(`https://route-posts.routemisr.com/users/upload-photo`, returnData() ,{
                headers: {Authorization :`Bearer ${localStorage.getItem("userToken")}`}
            } )
    }


    const { mutate, isPending } = useMutation({
        mutationFn: upLoudProfile,
    
        onSuccess: () => {
            setisUpLoaded(false)
        }
    });

    function handelImagePreview(e){
        const path = URL.createObjectURL(e.target.files[0]); // to get the path of image
        setisUpLoaded(path)
    }

    function handleRemveImage(){
        setisUpLoaded(false);
        imageInput.current.value = ""
    }



    if (!userInfo) return null;

    

    const {
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
    } = userInfo;

    return (





        <Card className="max-w-3xl mx-auto shadow-lg">
        <CardBody className="p-0">
            
            {/* Info */}
            <div className="px-6 pb-6 -mt-10">

            {/* Cover */}
            <div className="relative"> <img src={cover && "https://via.placeholder.com/900x250"} alt="cover" className="w-full h-52 object-cover" /></div>
            
            {/* Profile + Name */}
            <div className="flex items-center gap-6">

                {/* Profile Photo */}
                <div className="relative w-fit">
                { photo && <img
                    src={photo}
                    alt="profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />}

                <label className="absolute bottom-0 right-3 cursor-pointer bg-white rounded-full p-1 shadow">
                    <FaCamera className="text-black size-4" />
                    <input
                    ref={imageInput}
                    onChange={handelImagePreview}
                    type="file"
                    hidden
                    />
                </label>
                </div>

                {/* Name */}
                <div>
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-gray-500">@{username}</p>
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
    );
}