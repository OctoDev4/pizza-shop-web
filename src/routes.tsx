import { createBrowserRouter } from 'react-router-dom'


import { NotFound } from './pages/404'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { Orders } from './pages/app/orders/orders'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import {AppLayout} from "@/_layouts/app.tsx";
import {AuthLayout} from "@/_layouts/auth.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },


            {
                path: '/orders',
                element: <Orders />,
            },
        ],
    },

    // rota auth

    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/sign-in',
                element: <SignIn />,
            },
            {
                path: '/sign-up',
                element: <SignUp />,
            },
        ],
    },


])