import {useEffect, useState} from "react"
import {Link} from "react-router-dom"

function Home() {
    const [services, setServices] = useState([])
    const [serviceId, setServiceId] = useState(0)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')

    useEffect(() => {
        ;(async () => {
            try {
                const res = await fetch('http://localhost:3000/services', {
                    method: 'GET',
                })
                const json = await res.json()
                setServices(json)
            } catch (e) {
                console.error(e)
            }
        })();
    }, [])

    const handleChange = (event) => {
        setServiceId(event.target.value)
    }
    const handleName = (event) => {
        setTaskName(event.target.value)
    }
    const handleDescription = (event) => {
        setTaskDescription(event.target.value)
    }
    const addTask = async (id, taskName, taskDesc) => {
        console.log({
            "serviceId": id,
            "title": `${taskName}`,
            "description": `${taskDesc}`
        })
        const res = await fetch('http://localhost:3000/task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "serviceId": id,
                "title": `${taskName}`,
                "description": `${taskDesc}`
            })
        })
        if (res.status !== 201) {
            console.log('error: ', res)
        }
    }


    return (
        <div>
            <h1 className="text-center">Gerador de Propostas</h1>
            <div className="container justify-center flex mx-auto">
                <Link to="/newDeal" className="rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out"
                        onClick={null}  >
                    Criar Nova Proposta</Link>
                <Link to="/newType" className={`rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out`}
                        onClick={null}  >
                   Criar Novo Tipo</Link>
                <Link to="/newService" className={`rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out`}
                        onClick={null}  >
                    Criar Novo Serviço</Link>
                <Link to="/newClient" className={`rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out`}
                        onClick={null}  >
                    Criar Novo Cliente</Link>
                <Link to="/newTask" className={`rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out`}
                        onClick={null}  >
                    Criar Nova Tarefa</Link>
            </div>
        </div>
    );
}

export default Home;
