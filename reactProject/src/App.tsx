import routes from './router'
import NavBar from './navbar'
import SideBar from './sidebar'
import './app.css'

function App() {

    const router = routes()
    const navbar = NavBar()
    const sidebar = SideBar()

    const renderHTML = (
        <div>
            <div className='col-md-2 d-inline-block align-top vh-100 sidebar-custom'>
                { navbar }
                { sidebar }
            </div>
            <div className='col-md-10 d-inline-block vh-100'>{ router }</div>
        </div>
    );

    return renderHTML;
}

export default App;
