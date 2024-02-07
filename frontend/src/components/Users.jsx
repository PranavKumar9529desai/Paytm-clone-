import { useEffect, useState } from "react"
import { Button } from "./Button"
import {useNavigate , useSearchParams} from 'react-router-dom';
import axios from 'axios';

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState([]);
    var timerid ;     
    const token = localStorage.getItem("token");
    // geting the token from the localstorage

    const debouncing = (fun,delay)=>{
       clearTimeout(timerid);   
    // clearing the previous timer 
       timerid=setTimeout(fun,delay);
    //    seting up new timer id 
    }
     
    const fetchData =  ()=>{
        axios.get("http://localhost:3000/api/v1/user/bulk/?filter="+filter,{
          headers : {
              Authorization : `bearer ${token}`
          }
      })
        .then(response=>{
          console.log(response.data.users);
          setUsers(response.data.users)
        })
    }
    useEffect(()=>{debouncing(fetchData,500)},[filter]);
    // useffect must have a callback funcion inside the brackets

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e)=>{
                setFilter(e.target.value);
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map((user,i) => <User user={user} index={i}/>)}
        </div>
    </>
}

function User({user , index}) {
    const navigate = useNavigate();
    const [Serchparms] = useSearchParams();
    return <div className="flex justify-between" id={index} >   
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.FirstName[0].toUpperCase()}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div >
                    {user.FirstName} {user.LastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={()=>{
              navigate("/send?id="+user._id+"&name="+user.FirstName)
              console.log(Serchparms.get('name'));
              console.log(Serchparms.entries());
              }} label={"Send Money"} />
        </div>
    </div>
}