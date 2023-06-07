import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashBoard from './dashBoard'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashBoard />} />
            </Routes>
        </BrowserRouter>
    );
}
