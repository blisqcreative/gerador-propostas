import {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {server} from "../utils/server"

function Home() {
    const [serviceId, setServiceId] = useState(0)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [nextLeadID, setNextLeadID] = useState("")

    const getLatestId = async () => {
        const response = await fetch(`${server}/lastLeadId`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        let id = 1;
        if (response.status === 200) {
            id = await response.json();
        }
        const date = new Date()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const year_lastTwoDigits = year.toString().substr(-2)
        let month_twoDigits;
        if (month < 10) {
            month_twoDigits = '0' + month
        } else {
            month_twoDigits = month
        }
        setNextLeadID("BLISQ" + year_lastTwoDigits + month_twoDigits + (id+1))
    };


    useEffect(() => {
        getLatestId();
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
        const res = await fetch(`${server}/task/`, {
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
            <h2 className="text-center">ID da Pr??xima Lead: {nextLeadID}</h2>
            <div className="container justify-center flex mx-auto">
                <Link to="/newDeal"
                      className="rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out">
                    Criar Nova Proposta</Link>
                <Link to="/deals"
                      className="rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out">Listar
                    Propostas</Link>
                <Link to="/leads"
                        className="rounded border bg-purple-500 text-white p-2 m-2 hover:bg-purple-600 transition duration-500 ease-in-out">Listar
                    Leads</Link>
            </div>
        </div>
    );
}

export default Home;
