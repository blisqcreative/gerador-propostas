import {useEffect, useState} from "react"
import {TaskCheckBox} from "../components/TaskCheckBox"

function NewDeal() {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("all");

    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [idTasks, setIdTasks] = useState([]);

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
    const handleBox = (e, taskId) => {
        const {value} = e.target;

        if (e.target.checked) {
            setSelectedTasks(prev => [...prev, value]);
            setIdTasks(prev => [...prev, taskId]);

        } else {
            setSelectedTasks(prev => prev.filter(item => item !== value));
            setIdTasks(prev => prev.filter(item => item !== taskId));
        }
    };

    const addDeal = () => {
        const data = {
            typeId: selectedType,
            clientId: selectedClient,
            tasksId: idTasks
        };
        fetch('http://localhost:3000/deal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(data => {
            })
            .catch(err => console.log(err));
    };


    return (<div>
        <h1 className="text-3xl text-center">Nova Proposta</h1>
        <label htmlFor="type">Tipo:</label>
        <select name="type" className="mt-4 ml-2" onChange={handleType} defaultValue="DEFAULT">
            <option value="DEFAULT" disabled>Tipo</option>
            {types.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))}
        </select>
        <label htmlFor="client">Client:</label>
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
                        <TaskCheckBox {...task} onChange={(e) => handleBox(e, task.id)}/>
                    </div>))) : (tasks.filter(task => task.serviceId === parseInt(selectedService)).map(task => (
                        <div key={task.id} className="flex items-center">
                            <TaskCheckBox {...task} onChange={(e) => handleBox(e, task.id)} />
                        </div>)))}
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold">Tasks selecionadas</p>
                    <div className="">
                        {selectedTasks && selectedTasks.map((task, index) => (
                            <div key={index} className="flex items-center">
                                <label>{task}</label>
                            </div>))}
                    </div>
                </div>
            </div>
            <button onClick={addDeal} className="mt-4 bg-blue-500 text-white p-2 rounded-lg">Criar Proposta</button>
        </div>

    </div>)
}

export default NewDeal;