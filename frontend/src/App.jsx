import React from 'react';
import {Routes,Route} from "react-router"
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../authSlice';
import { useEffect } from 'react';
import { Navigate } from 'react-router';
import AdminPanel from '../src/components/AdminPanel';
import ProblemPage from './pages/ProblemPage';
import AdminDashboard from './pages/AdminDashboard';
import UpdateList from './components/updatelist';
import UpdatePanel from './components/updatePane';
import AdminUpload from './components/AdminUpload';
import AdminDelete from './components/AdminDelete';
import AdminVideo from './components/AdminVideo';
import Profile from './pages/profile';
import BattleRoom from './pages/BattleRoom';
export default function App(){
  const {isAuthenticated,user} = useSelector((state)=>state.auth);
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[isAuthenticated]);
  return(
    <Routes>
      <Route path="/" element={isAuthenticated ?<Home></Home>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<SignUp></SignUp>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      <Route 
        path="/admin" 
        element={
          user?.role === 'admin' ?
            // <AdminPanel />
            <AdminDashboard/> : 
            <Navigate to="/" />
        }
        ></Route>
        <Route path="/admin/create" element={
          user?.role === 'admin' ?
            // <AdminPanel />
            <AdminPanel/> : 
            <Navigate to="/" />
        } />
        <Route path="/admin/update" element={<UpdateList />} />
        <Route path="/admin/update/:id" element={<UpdatePanel/>} />
        <Route path="/admin/delete" element={<UpdateList/>} />
        <Route 
            path="/profile" 
            element={
              
                <Profile />
            } 
          />
         <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemid" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      {/* <Route path="/room/:roomId" element={<Battle />} /> */}
      <Route path="/room/:roomId" element={<BattleRoom />} />
    </Routes>
)
}