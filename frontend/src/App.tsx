import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";

export default function App() {
  return (
    <>
     <Login />

     <Toaster position="bottom-right" reverseOrder={false} />
    </>
  )
}