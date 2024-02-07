import { useState } from "react"
import { BottomWarning } from "../components/BottomWarming"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/Subheading"
import axios from 'axios';

export const SignUp = () => {
   const [UserName ,setUserName] = useState('');
   const [Password ,setPassword] = useState('');
   const [FirstName ,setFirstName] = useState('');
   const [LastName ,setLastName] = useState('');

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={e=>{
          setFirstName(e.target.value);
        }} placeholder="Pranav" label={"First Name"} />
        <InputBox 
        onChange={e=>{
          setLastName(e.target.value);
        }} placeholder="Desai" label={"Last Name"} />
        <InputBox onChange={e=>{
          setUserName(e.target.value);
        }} placeholder="dpranav7745@gmail.com" label={"Email"} />
        <InputBox  onChange={e=>{
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async()=>{
            const response =await axios.post('http://localhost:3000/api/v1/user/signup',{
              FirstName,
              LastName,
              UserName,
              Password,
             })
             localStorage.setItem("token",response.data.jwt);
            //  storing the jwt token in the localstorage 
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}