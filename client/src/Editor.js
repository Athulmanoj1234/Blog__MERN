import ReactQuill from "react-quill"

export default function Editor({value, onChange}){   


    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ]
      };
    
    const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list','bullet', 'indent', 
        'link', 'image'];

   return(
        <div>
        <ReactQuill
        formats={formats} modules={modules}
        value={value}
        theme={'snow'}
         onChange={onChange}/> {/*this modules and formats are used to add optionsin the textarea like to upload content in image  */}
           {/* in reat quill e.target.value doesnot work in onChange attribute unline standarad tags like <input> etc in html*/}
        </div>
    )
}