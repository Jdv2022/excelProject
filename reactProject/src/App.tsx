import routes from './router'

function App() {

    const router = routes()

    const renderHTML = (
        <div>
            { router }
        </div>
    );

    return renderHTML;
}

export default App;
