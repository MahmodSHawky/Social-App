import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // دي بستخمجها علشان اجمع الداتا في اوبجكت وابعتها للباك اند
import * as zod from "zod";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from './../Context/AuthContext';


const schema = zod
  .object({

    email: zod
      .email("invalid email")
      .regex(
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        "please inter correct email",
      )
      .nonempty("email is required"),

    password: zod
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password should contain at least 1 special char ,1 number, min length is 8",
      )
      .nonempty("password is required"),
  })

export default function Login() {

  // useEffect( () => {                            // دي بنعملها علشان لو هو عامل لوجين وموجود في الهوم 
  // Navigate("/login")
  // localStorage.removeItem("userToken");         //  ورجع للوجين نخليه يعمل تسجيل دخول من الاو
  // setuserLogin(null)
  // },[])


  const Navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const {userLogin, setuserLogin} = useContext(AuthContext)


  const form = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, touchedFields },
  } = form;

  //handleSubmit ==> validation هنحل مشاكل ال

  // const {name, onChange, onBur, ref} = register("name")

  function handleLogin(values) {
    setisLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        
        if (res.data.message === "signed in successfully") {
          localStorage.setItem("userToken", res.data.data.token)
          setuserLogin(res.data.data.token)
          Navigate("/app");
        }
      })
      .catch((err) => {
        setapiError(err.response.data.message);
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-5xl font-bold ">Login Now</h1>
        {apiError && (
          <p className="bg-red-700 text-white font-bold p-2 m-2 rounded-sm w-[300px] mx-auto">
            {apiError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(
            handleLogin /*  هنا الفانكشن الللي ببعتها لما بنادي عليها فوق بتستقبل فيها الاوبجت اللي جمعته علشان ابعته */,
          )}
          className="max-w-md mx-auto my-7"
        >
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              id="email"
              {...register(
                "email",
                //    , {
                //   pattern : {value : /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/ ,
                //   message : "invalid email"},
                //   required : {value :true , message : "email is required" }
                // }
              )}
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your email
            </label>
            {errors.email && touchedFields.email && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              {...register(
                "password",
                //   , {
                //   pattern : { value : /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/ ,
                //   message :"week password" ,
                //   required : {value : true , message : "required input"}
                //   }
                // }
              )}
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your password
            </label>
            {errors.password && touchedFields.password && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                {errors.password?.message}
              </p>
            )}
          </div>
          

          <button
            disabled={isLoading}
            type="submit"
            className="text-white disabled:bg-red-700 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 w-[80%] cursor-pointer"
          >
            {isLoading ? "loading....." : "login"}
          </button>
        </form>
      </div>
    </>
  );
}




