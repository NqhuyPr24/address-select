import { Toaster } from "react-hot-toast"
import Main from "./components/Main"

function App() {
  
  return (
    <>
      <Main/>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
    </>
  )
}

export default App
