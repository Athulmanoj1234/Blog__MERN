import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext }  from "../userContext";
import { formatISO9075 } from "date-fns";


export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null); // Initialize as null, not an empty string
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();
    console.log(id);
    const {userInfo} = useContext(UserContext);
    console.log(userInfo);
    
    useEffect(() => {
        if (id) {
          axios.get(`http://localhost:4003/post/${id}`)
            .then(response => {
              setPostInfo(response.data);
              console.log(response.data);
              
            })
            .catch(error => {
              console.error('Error fetching post:', error);
            });
        } else {
          console.error('Post ID is undefined');
        }
      }, [id, userInfo]);  // Add userInfo to the dependency array to trigger a re-render if userInfo changes
      
    if (!postInfo) return '';

   async function deletePost(e){
        e.preventDefault();
      await axios.delete(`http://localhost:4003/delete/${id}`,{withCredentials:true})
       setRedirect(true);
      }
      if(redirect == true){
        return <Navigate to={'/'}/>
      }
        
        return (
            <div className="post-page">
                <h1>{postInfo.title}</h1>

                <time>{formatISO9075(new Date(postInfo.createdAt) )}</time>
                 <div className="author">By @{postInfo.author.username}</div>
                 {userInfo.id == postInfo.author._id && (
                   
                   <div className="edit-row">
                    <Link className="edit-button" to={`/edit/${postInfo._id}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                   </svg>
                       edit this post
                       </Link>
                   </div>
                 )}
                <div className="image">
                <img src={`http://localhost:4003/${postInfo.cover}`} alt=""/> {/**we use link of localhost becaluse only image image is displayed in src tag */}
            </div>
            
            <div dangerouslySetInnerHTML={{__html: postInfo.content}}></div> {/**this dangerouslySetInnerHTML is used to escape the html tags ie postINfo.content is in present alonged with <p> tag we need to escape it and we are telling the react that by using this react prop the content is safe  */}
                { userInfo.id === postInfo.author._id && (
                <div className="delete-post">
                  
                <form onSubmit={deletePost}>
                  <button className="delete-button" >delete this post</button>
                </form>
                  </div>
)}
                </div>
                
        )
    
}
