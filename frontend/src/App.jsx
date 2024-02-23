import {BrowserRouter , Routes , Route ,useNavigate ,Outlet ,Navigate } from 'react-router-dom';
import {Dashboard} from './Routes/Dashboard';
import {SignUp} from './Routes/SignUp';
import {SignIn} from './Routes/SignIn';
import {Send} from './Routes/Send';

function App() {
  const PrivatesRoutes = ()=>{
    let token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to='/signin' />
  }

  return (
  <>
    <BrowserRouter>
      <Routes>
         <Route element={<PrivatesRoutes/>}>
          <Route path='/dashboard'   element={<Dashboard/>} />
          <Route path='/send'   element={<Send/>} />
        </Route>

        <Route path='/signin'    element={<SignIn/>} />
        <Route path='/signup'   element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
</>)}

export default App


