import {useEffect, useState} from "react"
import moment from "moment"
import {Link} from "react-router-dom"

export const ListLeads = () => {


    const [leads, setLeads] = useState([]);
    const getLeads = async () => {
        const response = await fetch('http://188.166.144.172:4000/leads', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        console.log(json);
        setLeads(json);
    }
    useEffect(() => {
        getLeads();
    }, []);

    return (
        <div>
            <h1>Lista de Leads</h1>
            <div className="container justify-center grid grid-cols-6 mx-auto">
                <p className="font-bold text-lg">Referência da Lead</p>
                <p className="font-bold text-lg">Nome da Lead</p>
                <p className="font-bold text-lg">Cliente</p>
                <p className="font-bold text-lg">Email de Contacto</p>
                <p className="font-bold text-lg">Data de Criação</p>
                <p className="font-bold text-lg"></p>


            </div>
            {leads.map((lead, index) => (
                <div key={index} className="container justify-center grid grid-cols-6 mx-auto">
                    <p>{lead.inner_id}</p>
                    <p>{lead.name}</p>
                    <p>{lead.client ? lead.client.name : "Sem cliente associado"}</p>
                    <p>{lead.client ? lead.client.email : "Sem cliente associado"}</p>
                    <p>{moment(lead.date).locale("pt").format("LLLL")}</p>
                    <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          to={`/newDeal/${lead.inner_id}`}>Criar Briefing
                    </Link>

                </div>
            ))}


        </div>
    );
}