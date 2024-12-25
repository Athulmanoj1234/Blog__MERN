import { useContext, useEffect, useState } from 'react'
import '../App.css'
import Post from "../Post.js";
import axios from 'axios'
import { use } from 'react';
import { UserContext } from '../userContext.js';



export default function IndexPage(){
    const [post, setPost] = useState([]); //post is the state variable, which is initialized to an empty string.setPost is the function used to update the post state.
    const {userInfo} = useContext(UserContext)

    useEffect(() =>{
      axios.get('http://localhost:4003/post').then(response =>{
      const posts = response.data;  
      console.log(posts);
      setPost(posts)
      
    }) },[])  //The empty array [] tells React to run this effect only once, after the first render (when the component is mounted). Without it, the effect would run after every render, which could lead to infinite requests.

    
        
       return(
        <>
        {post.length > 0 && post.map(eachpost => (
       
          <Post {...eachpost} username={userInfo?.username} />
        
      ))}
    </>
)};

          
