
import 'react-quill/dist/quill.snow.css'; 
import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";



export default function CreatePost(){
  
   
   const [title, setTitle] = useState('');
   const [summary, setSummary] = useState('');
   const [content, setContent] = useState('');
   const [files, setFiles] = useState('');
   const [redirect, setRedirect] = useState(false);

  async function createNewPost(e){
        e.preventDefault();
    
        const data = new FormData(); //FormData() is a built in class to send form elements programmiutically or mannually rather than json objects
         data.set('title', title); //we are sending title only not as json title 
         data.set('summary', summary);
         data.set('content', content);
         data.set('files', files[0]); //it is because even though when multiple files are selected we need to send only one file ie first file ie we provide index.
        
         e.preventDefault();
         const response = await axios.post('https://blog-mern-backend-ayjw.onrender.com/post', data, {withCredentials: true}); //we are providing fo a request to send form data to the client.
                                                               //we should avoid curly braces ie wrapping data beacuse while sending as axios data we should as FormData ie data and should avoid as sending in object wrapped indise curly braces.
         console.log(response.data);

  
         if(response.status === 200){
          setRedirect(true);
         }else{
          response.json("wrong creditionals");
         }
        }

         if(redirect == true){
            return <Navigate to ={'/'}/>
         }
        
      return(
        <div>
         <form onSubmit={createNewPost}>
            <input type="title"
             placeholder={"title"} 
             value={title} onChange={ev=> setTitle(ev.target.value)}/>
            
            <input type="summary"
             placeholder={"summary"}
              value={summary} onChange={ev=> setSummary(ev.target.value)}/>

            <input type="file" onChange={ev=> setFiles(ev.target.files)}/>
           
           <Editor value={content} onChange={setContent} />   {/*we have passed reactquill to this file named CreatePost */}
       
            <button style={{marginTop: '5px'}}>Create Post</button>
             </form>
        </div>
     )
}
