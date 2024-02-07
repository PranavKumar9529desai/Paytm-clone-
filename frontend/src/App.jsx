import {BrowserRouter , Routes , Route ,useNavigate } from 'react-router-dom';
import {Dashboard} from './Routes/Dashboard';
import {SignUp} from './Routes/SignUp';
import {SignIn} from './Routes/SignIn';
import {Send} from './Routes/Send';
function App() {

  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/dashboard'   element={<Dashboard/>} />
        <Route path='/signin'    element={<SignIn/>} />
        <Route path='/signup'   element={<SignUp/>} />
        <Route path='/send'   element={<Send/>} />
      </Routes>
    </BrowserRouter>
</>)}

export default App


