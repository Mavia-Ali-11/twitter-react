import Routes from './config/routes'
import ContextProvider from './context/context';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <ContextProvider>
      <Routes />
    </ContextProvider>
  )
}

export default App;
