
import React, { useState } from "react";
import { useForm } from "react-hook-form"; // دي بستخمجها علشان اجمع الداتا في اوبجكت وابعتها للباك اند
import * as zod from "zod";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const schema = zod
  .object({
    name: zod
      .string()
      .min(3, "min length is 3 char")
      .max(10, "max length is 10 char")
      .nonempty("name is required"),

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

    rePassword: zod.string().nonempty("password is required"),

    dateOfBirth: zod.string().refine((dateValue) => {
      const userDate = new Date(dateValue);
      const currentDate = new Date();
      return currentDate.getFullYear() - userDate.getFullYear() >= 10;
    }, "invalide date"),

    gender: zod.enum(["male", "female"]),
  })
  .refine(
    (object) => {
      if (object.password === object.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { error: "password & confirmation not matched!", path: ["rePassword"] },
  );

export default function Register() {
  const Navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
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

  function handlRerister(values) {
    setisLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        if (res.data.message === "account created") {
          Navigate("/login");
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
        <h1 className="text-5xl font-bold ">Register Now</h1>
        {apiError && (
          <p className="bg-red-700 text-white font-bold p-2 m-2 rounded-sm w-[200px] mx-auto">
            {apiError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(
            handlRerister /*  هنا الفانكشن الللي ببعتها لما بنادي عليها فوق بتستقبل فيها الاوبجت اللي جمعته علشان ابعته */,
          )}
          className="max-w-md mx-auto my-7"
        >
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register(
                "name",
                //   , {
                //   required : {value : true , message:"name input is required" },
                //   minLength : {value : 3 , message : "min length is 3 char"},
                //   maxLength :  {value : 5 , message : "max length is 5 char"}
                // }
              )}
              type="text"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your name
            </label>
            {errors.name && touchedFields.name && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                {errors.name?.message}
              </p>
            )}
          </div>
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
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              {...register(
                "rePassword",
                //   ,{
                //   validate : function (rePasswordValue){
                //     if(rePasswordValue === getValues("password")){
                //       return true
                //     }else{
                //       return "not confirm"
                //     }
                //   }
                // }
              )}
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your confirm password
            </label>
            {errors.rePassword && touchedFields.rePassword && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                {errors.rePassword?.message}
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="date"
              {...register(
                "dateOfBirth",
                //     , {
                //   valueAsDate : true,
                //   validate : function(value){
                //     const userDate = value.getFullYear();
                //     const currentDate = new Date().getFullYear()
                //     if(currentDate - userDate >= 18) {
                //       return true;
                //     } else {
                //       return "invalide date to accept"
                //     }

                //   }
                // }
              )}
              id="date"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="date"
              className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your date
            </label>
            {errors.dateOfBirth && touchedFields.dateOfBirth && (
              <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                {errors.dateOfBirth?.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center mb-4">
              <input
                id="male"
                type="radio"
                name="male"
                value="male"
                {...register(
                  "gender",
                  //   ,{
                  //   pattern :{value : /^(male|female)$/ , message : "is not"}
                  // }
                )}
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
              />
              <label
                htmlFor="male"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                male
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="female"
                type="radio"
                {...register(
                  "gender",
                  //   ,{
                  // pattern :{value : /^(male|female)$/ , message : "is not"}
                  // }
                )}
                name="gender"
                value="female"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
              />
              <label
                htmlFor="female"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                female
              </label>
              {errors.gender && (
                <p className="bg-slate-200 text-red-500 p-1 m-2 rounded-sm">
                  {errors.gender?.message}
                </p>
              )}
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="text-white disabled:bg-red-700 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 w-[80%] cursor-pointer"
          >
            {isLoading ? "loading....." : "register"}
          </button>
        </form>
      </div>
    </>
  );
}
