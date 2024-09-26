import axios from 'axios';
import { useState } from 'react'
import '../App.css'

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function register(ev) {
        ev.preventDefault();
    
       const response = await axios.post('http://localhost:4003/register', { username, password });
       console.log(response.data);

       if(response.status === 200){
        console.log("form registration is successful");
       }else{
        console.log("form  registration is failed");
       }
       if(username.length && password.length < 4){
        alert("please enter more than four characters")
       }else{
        console.log("form data have been saved")
       }
       }
       
    return(
        <div>
            <form action="" className="register" onSubmit={register}>
                <h1>Register</h1>
                <input type="text" placeholder="username" value={username} onChange={(ev)=> setUsername(ev.target.value)}/>{/*in setUsername value which are entering in each submit entering will change and go to username */}
                <input type="text" placeholder="password" value={password} onChange={(ev)=> setPassword(ev.target.value)}/>
                <button>Register</button>
            </form>
       </div>
      )
}

