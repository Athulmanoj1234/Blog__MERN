import logo from './logo.svg';
import './App.css'
import Post from './Post.js';
import Header from './Header.js';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Layout from './Layout.js';
import IndexPage from './pages/indexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PostPage from './pages/PostPage.jsx';
import { UserContextProvider } from './userContext.js';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';

function App() {
  return (
<UserContextProvider>

   <Routes>
    <Route path="/" element={<Layout />}>
     <Route index element={<IndexPage />}/> {/* indexPage route inside main path ie layout so by clicking even routed to indexPage or Loginpage then also header ie layout will be present at the top */}
     <Route path="/login" element={<LoginPage />}/> {/* same applied to this also */}
     <Route path="/register" element={<RegisterPage/>}/>
     <Route path="/create" element={<CreatePost />}/>
     <Route path="/post/:id" element={<PostPage />}/>
     <Route path="/edit/:id" element={<EditPost />}/>
     
   </Route>
  </Routes> 
 
</UserContextProvider>
  );
}

export default App;
