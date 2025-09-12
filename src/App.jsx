import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeTemplate from "./my_templates/HomeTemplate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeTemplate />}>
          <Route index element={<Home />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
