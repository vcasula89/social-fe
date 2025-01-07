import "./App.css";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "./contexts/ThemeProvider.jsx";
import VisualizationPost from "./components/VisualizationPostComponent/VisualizationPost.jsx";


function App() {
    return <ThemeProvider>
        
         <Outlet/>
    </ThemeProvider>
}

export default App;
