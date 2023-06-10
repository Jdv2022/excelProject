import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashBoard from './dashBoard'

interface AppRouterProps {
    onData: (data: any) => void;
}

export default function AppRouter({ onData }: AppRouterProps) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashBoard onData={onData}/>} />
            </Routes>
        </BrowserRouter>
    );
}
