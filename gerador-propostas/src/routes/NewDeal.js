import {useEffect, useState} from "react"

function NewDeal() {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("all");

    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(async () => {
        await getTypes();
        await getServices();
        await getTasks();
        await getClients();
    }, []);
    const getTypes = async () => {
        const response = await fetch('http://localhost:3000/types', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setTypes(json);
    };
    const getClients = async () => {
        const response = await fetch('http://localhost:3000/client', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setClients(json);
    };
    const getServices = async () => {
        const response = await fetch('http://localhost:3000/services', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setServices(json);
    };
    const getTasks = async () => {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setTasks(json);
    };
    const handleService = (event) => {
        setSelectedService(event.target.value);
    };
    const handleType = (e) => {
        const {value} = e.target;
        setSelectedType(value);
    };
    const handleClient = (e) => {
        const {value} = e.target;
        setSelectedClient(value);
    };
    const handleBox = (e) => {
        const {value} = e.target;
        console.log("nome:", value);

        if(e.target.checked){
            setSelectedTasks(prev => [...prev,value]);
        }else{
            setSelectedTasks(prev => prev.filter(item => item !== value));
        }
    };
    return (<div>
        <h1 className="text-3xl text-center">Nova Proposta</h1>
        <label htmlFor="type">Tipo:</label>
        <select name="type" className="mt-4 ml-2" onChange={handleType} defaultValue="DEFAULT">
            <option value="DEFAULT" disabled>Tipo</option>
            {types.map(type => (<option key={type.id} value={type.name}>{type.name}</option>))}
        </select>
        <label htmlFor="client" >Client:</label>
        <select name="client" className="mt-4 ml-2" onChange={handleClient} defaultValue="DEFAULT">
            <option value="DEFAULT" disabled>Cliente</option>
            {clients.map(client => (<option key={client.id} value={client.id}>{client.name}</option>))}
        </select>
        <div className="mt-4">
            <span className="text-2xl block">Tarefas</span>
            <label>Serviços</label>
            <select name="service" className="mt-4 ml-2" onChange={handleService} defaultValue="all">
                <option value="all">Todos</option>
                {services.map(service => (<option key={service.id} value={service.id}>{service.name}</option>))}
            </select>
            <div className="grid-cols-2 grid">
                <div className="mt-4">
                    {selectedService === "all" ? (tasks.map(task => (<div key={task.id} className="flex items-center">
                        <label>
                            <input type="checkbox" className="mr-2" value={task.title} onChange={handleBox}/>
                            {task.title}
                        </label>
                    </div>))) : (tasks.filter(task => task.serviceId === parseInt(selectedService)).map(task => (
                        <div key={task.id} className="flex items-center">
                            <label>
                                <input type="checkbox" className="mr-2" value={task.title} onChange={handleBox}/>
                                {task.title}
                            </label>
                        </div>)))}
                </div>
                <div className="mt-4">
                    <p>Tasks selecionadas</p>
                    <div className="">
                        {selectedTasks && selectedTasks.map((task, index) => (<div key={index} className="flex items-center">
                            <label>{task}</label>
                        </div>))}
                    </div>
                </div>
            </div>
        </div>

    </div>)
}

export default NewDeal;