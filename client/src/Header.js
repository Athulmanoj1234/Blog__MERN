import { useState,useEffect, useContext } from 'react';
import './App.css'
import {Link} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './userContext';



export default function Header(){
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    axios.get('http://localhost:4003/profile', {
      withCredentials: true // ensure credentials are included
    })
    .then(response => {
      const userInfo = response.data;
      setUserInfo(userInfo);
      console.log(userInfo.username);
    })
    .catch(error => {
      console.error('Error fetching profile:', error.response?.data || error.message);
    });
  }, []);
  
   function logout(){
       axios.post('http://localhost:4003/logout', {withCredentials: true}); //this axios request request for post certaibn creditiontionals from the backend which includes token which is specified in the backend index.js file
         setUserInfo(null); //we have declared a if stattement that if userName null page will return to login and regsiter page so in logout function after we click on a tag when username goes to null by setUsername(null) page will go to login and register 
      }
      const username = userInfo?.username;
    
   
   return(
    <header>
      <Link to="/" className="logo">My Blog</Link>
      <nav>
        {username && (
          <>
          <Link to = {'/create'}>create new post</Link>
          <a onClick={logout}>Logout</a> 
          </>
          )}
          {!username && (
            <>
             <Link to="/login">Login</Link> {/*link tag is used as another way of using a tag to avoid refresh in react*/}
             <Link to="/register">Regsiter</Link>
            </>
          )}


        
        </nav>
        </header>
      
    )
}
