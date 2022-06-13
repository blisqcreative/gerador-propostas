import {useEffect, useState} from "react"
import moment from "moment"
import 'moment/locale/pt'
import {Link, useNavigate} from "react-router-dom"
import {server} from "../utils/server"


const ListDeals = () => {
    let navigate = useNavigate();
    const [deals, setDeals] = useState([]);

    const loggedUser = JSON.parse(localStorage.getItem("session"));
    const user = loggedUser.id;

    const getDeals = async () => {
        let id = JSON.parse(localStorage.getItem('session')).department;
        const user = JSON.parse(localStorage.getItem('session')).id;
        let response;
        if (parseInt(user) !== 2) {
            response = await fetch(`${server}/deal/department/` + id);
        } else {
            response = await fetch(`${server}/deal/`);
        }
        const data = await response.json();
        console.log(data);

        if (data.length < 1) {
            alert('Não existem deals registados');
        } else {
            setDeals(data);
        }
    }
    useEffect(() => {
        getDeals();

    }, []);


    return (
        <div>
            <h1>ListDeals</h1>
            <div className="container justify-center grid grid-cols-6 mx-auto">
                <p className="font-bold text-lg">Referência da Proposta</p>
                <p className="font-bold text-lg">Cliente</p>
                <p className="font-bold text-lg">Status da Proposta</p>
                <p className="font-bold text-lg">Departamentos</p>
                <p className="font-bold text-lg">Data de Criação</p>
                {user == 2 ? <p className="font-bold text-lg">Ações</p> : null}

            </div>
            {deals.map((deal, index) => (
                <div key={index} className="container justify-center grid grid-cols-6 mx-auto">
                    <p>{deal.inner_id}</p>
                    <p>{deal.client ? deal.client.name : "Sem cliente Associado"}</p>
                    <p>{deal.status}</p>
                    <div className="flex gap-2">
                        {deal.departments.map((department, index) => (
                            <p className={department.status === false ? "text-red-500" : "text-green-500"}
                               key={index}>{department.initials}</p>
                        ))}
                    </div>

                    <p>{moment(deal.date).locale("pt").format("LLLL")}</p>
                    <div className="flex gap-2">
                        {parseInt(user) === 2 ?
                            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                  to={`/dashboard/${deal.id}`}>Rates</Link> : null}
                        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              to={`/deals/${deal.id}`}>Ver</Link>
                    </div>


                </div>
            ))}


        </div>
    );
}

export default ListDeals;