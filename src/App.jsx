import "./App.css";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "./contexts/ThemeProvider.jsx";


function App() {
    return <ThemeProvider>
        <Outlet/>
    </ThemeProvider>
}

export default App;
