import mongoose, { Schema } from 'mongoose'

const postShcema = new mongoose.Schema({
        title: String,
        summary: String,
        content: String,
        cover: String,
        author: {type: Schema.Types.ObjectId, ref: 'users'} //This means the author field will store an ObjectId, which is a unique identifier for another document (in this case, a User document).
      //objestId is grabbed from document user  
    },
{
        timestamps: true
})

const models = new mongoose.model('post', postShcema);
export default models;