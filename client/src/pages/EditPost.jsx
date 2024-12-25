import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { useParams } from "react-router-dom";
import axios from 'axios';




export default function EditPost(){

    const [title, setTitle] = useState('');
   const [summary, setSummary] = useState('');
   const [content, setContent] = useState('');
   const [files, setFiles] = useState('');
   const [postInfo, setPostInfo] = useState('');
   const [redirect, setRedirect] = useState(false);
   
  const {id} = useParams();
  
  useEffect(()=>{
     axios.get(`https://blog-mern-backend-ayjw.onrender.com/post/${id}`)
     .then(response=>{
      const postInfo = response.data;
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);

     })

  },[id])


 async function updatedPost(e){
    e.preventDefault();
    const data = new FormData(); //FormData() is a built in class to send form elements programmiutically or mannually rather than json objects
         data.set('title', title); //we are sending title only not as json title 
         data.set('summary', summary);
         data.set('content', content);
         data.set('id', id);
         if (files?.[0]) {
         data.set('files', files[0]); //it is because even though when multiple files are selected we need to send only one file ie first file ie we provide index.
      }
          const response =  await axios.put('https://blog-mern-backend-ayjw.onrender.com/post', data, {withCredentials: true})
 
         if(response.status === 200){
            setRedirect(true);
         
      }
   }


    if(redirect){
        return <Navigate to ={'/post/' + id} />
     }
    
  return(
    <div>
     <form onSubmit={updatedPost}>
        <input type="title"
         placeholder={"title"} 
         value={title} onChange={ev=> setTitle(ev.target.value)}/>
        
        <input type="summary"
         placeholder={"summary"}
          value={summary} onChange={ev=> setSummary(ev.target.value)}/>

        <input type="file" onChange={ev=> setFiles(ev.target.files)}/>
       
           <Editor value={content} onChange={setContent}/>
        <button style={{marginTop: '5px'}}>update post</button>
         </form>
    </div>
 )
}
