import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import LoginForm from "./components/LoginFormComponent/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RegistrationForm from "./components/RegistrationFormComponent/RegistrationForm";
import {Provider} from "react-redux";
import {persistor, store} from "./store/store"
import {PersistGate} from "redux-persist/integration/react";

import AuthLayout from "./components/AuthLayout/AuthLayout.jsx";
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import RecoveryPasswordPage from "./components/RecoveryPasswordPage/RecoveryPasswordPage.jsx";
import NewPasswordForm from "./components/NewPasswordForm/NewPasswordForm.jsx";




const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                element: <AuthLayout/>,
                children: [
                    {
                        path: 'login',
                        element: <LoginForm/>
                    },
                    {
                        path: 'registration',
                        element: <RegistrationForm/>
                    },
                    {
                        path: 'recovery-password',
                        element: <RecoveryPasswordPage/>
                    },
                    {
                        path: 'form-recovery-password/:token',
                        element: <NewPasswordForm/>
                    },
                ]
            },
            {
                element: <MainLayout/>,
                children: [
                    {
                        index: true,
                        element: <HomePage/>
                    }
                ]
            }

        ]
    }
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
