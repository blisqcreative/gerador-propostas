import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"

const NewBriefing = () => {
    let navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [clientNif, setClientNif] = useState('000 000 000');
    const [briefingID, setBriefingID] = useState('');
    const [departments, setDepartments] = useState([]);

    const [work, setWork] = useState('');
    const [clientStatus, setClientStatus] = useState('');
    const [timings, setTimings] = useState('');

    const [selectedDepartments, setSelectedDepartments] = useState([]);

    useEffect(() => {
        getClients();
        getLatestId();
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

    const getDepartments = async () => {
        const response = await fetch('http://localhost:3000/departments');
        const data = await response.json();

        if (data.length < 1) {
            alert('Não existem departamentos registados');
        } else {
            setDepartments(data);
        }
    }

    const getClients = async () => {
        const response = await fetch('http://localhost:3000/client', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        setClients(json);
    };
    const getLatestId = async () => {
        const response = await fetch('http://localhost:3000/lastDealId', {
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
        setBriefingID("BLISQ" + year_lastTwoDigits + month_twoDigits + id)
    };

    const submitDeal = async () => {
        const response = await fetch('http://localhost:3000/deal', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                inner_id: briefingID,
                clientId: clientNif,
                timings: timings,
                clientStatus: clientStatus,
                work: work,
                departmentsId: selectedDepartments,
                status: "Open",
                date: new Date()
            })
        });

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
                    <input className="ml-2" readOnly value={briefingID}/>
                </label>

                <label>Cliente
                    <select name="client" className="mt-4 ml-2" onChange={handleClient} defaultValue="DEFAULT">
                        <option value="DEFAULT" disabled>Escolher Cliente</option>

                        {clients.length > 0 && clients.map(client => (
                            <option key={client.id} value={client.nif}>{client.name}</option>))}
                    </select>
                </label>

                <label>NIF do Cliente:
                    <input className="ml-2" readOnly value={clientNif}/>
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