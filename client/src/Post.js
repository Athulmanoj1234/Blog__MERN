import { Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import {formatISO9075} from 'date-fns';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { useState } from 'react';

export default function Post({title, summary, content, createdAt, author, cover, _id, username, likes}){

  const [likedStatus, setLiked] = useState();

  const sumOfLikes = likes.reduce((sum, a) => {
    return sum + a }, 0
  )
    
 async function isLiked(){
    
    if(username){ 
      setLiked(true);
      const liked = 1;
      axios.post('http://localhost:4003/likes', {username, liked, _id, likedStatus});
    }else{
      alert('login and continue');
    }
  
  }



    return(
        <div className="post">
        <div className="image">
          <Link to= {`post/${_id}`}>
         <img src={'http://localhost:4003/'+cover} alt=""/>
         </Link>
        </div>
        <div className="texts">
          <Link to = {`post/${_id}`}>
          <h2>{title}</h2>
          </Link>
       
         <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time> 
         </p>
         <p className="summary">{summary}</p>
         <button style={{color: 'black', background: '#F5F5F5', marginLeft: '0.4rem', padding: 0, width: 0, marginTop: '1rem'}} onClick={isLiked}>{!likedStatus ? <AiOutlineLike /> : <AiFillLike/>}</button>
         <p style={{color: 'black', marginLeft: '0.4rem', marginTop: '-0.1rem'}}>{sumOfLikes}</p>
        </div>
      </div>
      
    )
}