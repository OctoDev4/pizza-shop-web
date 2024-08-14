import { Outlet } from "react-router-dom";
import { Header } from "@/components/header.tsx";

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col antialiased">
            <Header />
            <div className="flex-1 flex flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
            <footer className="flex items-center justify-center p-4 bg-gray-800 text-white">
                ooo
            </footer>
        </div>
    );
}
