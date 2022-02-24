import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react"

function App() {
  const [services, setServices] = useState([])
  useEffect(() => {
      const res = fetch('http://localhost:3000/services', {
      method: 'GET',
    }).then(response => response.json()).catch(error => console.error(error));
    res.then(data => setServices(data))
  })
  return (
    <div className="App">
      {services.map(service => (

          <h1 key={service.id}>{service.name}</h1>
      ))}
    </div>
  );
}

export default App;
