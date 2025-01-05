import "./App.css";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "./contexts/ThemeProvider.jsx";
import HomePage from "./components/Layout/HomePage/HomePage.jsx";


function App() {
    return <ThemeProvider>
          <HomePage />      
        <Outlet/>
    </ThemeProvider>
}

export default App;
