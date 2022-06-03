import {useEffect, useState} from "react"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {server} from "../utils/server"

const NewBriefing = () => {

    const location = useLocation()
    let navigate = useNavigate();
    let { id } = useParams();

    const [clientNif, setClientNif] = useState(0);
    const [client, setClient] = useState({});
    const [clientName, setClientName] = useState('Nome do Cliente');
    const [briefingID, setBriefingID] = useState(id);
    const [departments, setDepartments] = useState([]);

    const [work, setWork] = useState('');
    const [clientStatus, setClientStatus] = useState('');
    const [timings, setTimings] = useState('');

    const [selectedDepartments, setSelectedDepartments] = useState([]);

    useEffect(() => {
        getLead(id);

        getDepartments();
    }, []);

    const handleClient = (e) => {
        setClientNif(e.target.value);
    }
    const handleDepartments = (e) => {
        if (e.target.checked) {
            setSelectedDepartments([...selectedDepartments, e.target.value]);
        } else {
            setSelectedDepartments(selectedDepartments.filter(department => department !== e.target.value));
        }
    }
    const handleWork = (e) => {
        setWork(e.target.value);
    }
    const handleClientStatus = (e) => {
        setClientStatus(e.target.value);
    }
    const handleTimings = (e) => {
        setTimings(e.target.value);
    }
    const getLead = async (id) => {
        const response = await fetch(`${server}/lead/` + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json()
        let newClient = data.client
        setClient(newClient);

        setClientNif(data.client.nif);
        setClientName(data.client.name);

    }
    const getDepartments = async () => {
        const response = await fetch(`${server}/departments`);
        const data = await response.json();

        if (data.length < 1) {
            alert('Não existem departamentos registados');
        } else {
            setDepartments(data);
        }
    }


    const submitDeal = async () => {
        const response = await fetch(`${server}/deal`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                inner_id: briefingID,
                client: client,
                timings: timings,
                clientStatus: clientStatus,
                work: work,
                departmentsId: selectedDepartments,
                status: "Open",
                date: new Date()
            })
        });
        const data = await response.json();
        console.log(data);

        if (response.status === 201) {
            console.log('Deal created');
            navigate("/home");
        } else {
            alert('Erro ao criar proposta');
        }
    };

    return (
        <div className="w-11/12 mx-auto">
            <h1 className="text-center text-2xl">Novo Briefing</h1>
            <div className="flex justify-between">
                <label>Referência da Proposta:
                    <input className="ml-1" readOnly value={briefingID}/>
                </label>

                <label>Cliente:
                    <input className="ml-1" readOnly value={clientName}/>
                </label>

                <label>NIF do Cliente:
                    <input className="ml-1" readOnly value={clientNif}/>
                </label>
            </div>

            <div className="flex justify-between mt-10">
                <label className="font-bold mb-4">Situação Atual:
                    <textarea name="description" id="description" cols="30" rows="10"
                              className="resize-none block border-2 p-4" value={clientStatus}
                              onChange={handleClientStatus}
                              placeholder="Porque nos procurou o cliente? Apresentação da proposta a desenvolver (peça, ação, campanha)."/>
                </label>
                <label className="font-bold mb-4">Peças a Desenvolver:
                    <textarea name="description" id="description" cols="30" rows="10"
                              className="resize-none block border-2 p-4" value={work} onChange={handleWork}
                              placeholder="Como vamos comunicar? Em que meios ou canais?"/>
                </label>
                <label className="font-bold mb-4">Timings:
                    <textarea name="description" id="description" cols="30" rows="10"
                              className="resize-none block border-2 p-4" value={timings} onChange={handleTimings}
                              placeholder="Prazo de execução, lançamento."/>
                </label>

            </div>
            <div className="mt-10">
                <label className="font-bold mb-4">Departamentos: </label>
                <div className="gap-y-4 flex flex-col">
                    {departments.map((department, index) => (


                        <label key={index}><input type="checkbox" name="department" value={department.id}
                                                  onChange={handleDepartments}/>{department.name}</label>

                    ))}
                </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right"
                    onClick={submitDeal}>
                Criar Briefing
            </button>
        </div>
    )
}

export default NewBriefing;