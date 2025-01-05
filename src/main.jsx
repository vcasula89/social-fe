import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import LoginForm from "./components/Auth/LoginFormComponent/LoginForm.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute/ProtectedRoute.jsx";
import RegistrationForm from "./components/Auth/RegistrationFormComponent/RegistrationForm.jsx";
import {Provider} from "react-redux";
import {persistor, store} from "./store/store"
import {PersistGate} from "redux-persist/integration/react";
import AuthLayout from "./components/Layout/AuthLayout/AuthLayout.jsx";
import MainLayout from "./components/Layout/MainLayout/MainLayout.jsx";
import HomePage from './components/Layout/HomePage/HomePage.jsx';
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <LoginForm /> },
                    { path: 'registration', element: <RegistrationForm /> },
                ],
            },
            {
                element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
                children: [
                    { path: 'home', element: <HomePage /> },
                    /* qui bisogna inserire il feed*/ 
                ],
            },
        ],
    },
]);
    

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <RouterProvider router={router}/>
            </PersistGate>
        </Provider>
    </StrictMode>,
)
