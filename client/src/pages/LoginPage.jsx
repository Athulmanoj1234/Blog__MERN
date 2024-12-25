import { useContext, useState } from 'react';
import axios from 'axios'
import '../App.css'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';


export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)

   async function login(ev){
        ev.preventDefault();
        
    const response = await axios.post('https://blog-mern-backend-ayjw.onrender.com/login',
         {username, password},
         {withCredentials: true});
    console.log(response.data);

    if(response.status === 200){
        const userInfo = response.data;
          setUserInfo(userInfo) 
            setRedirect(true) 
           
    }
    else{
        alert("wrong credentials")
    }
}
       if(redirect == true){
          return <Navigate to ={'/'} />
       }
    
       return(
        <div>
            <form action="" className="login" onSubmit={login} >
                <h1>login</h1>
                <input type="text" placeholder="username" value={username} onChange={(ev) =>setUsername(ev.target.value)} />
                <input type="text" placeholder="password" value={password} onChange={(ev) =>setPassword(ev.target.value)} />
                <button>Login</button>
            </form>
        </div>
    )
}
