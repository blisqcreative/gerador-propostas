import {useEffect, useState} from "react"
import moment from "moment"
import 'moment/locale/pt'
import {useNavigate} from "react-router-dom"




const ListDeals = () => {
    let navigate = useNavigate();
    const [deals, setDeals] = useState([]);

    const getDeals = async () => {
        let id = JSON.parse(localStorage.getItem('session')).department;
        const response = await fetch('http://188.166.144.172:4000/deals/department/'+id);

        const data = await response.json();

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
            <div className="container justify-center grid grid-cols-5 mx-auto">
                <p className="font-bold text-lg">Referência da Proposta</p>
                <p className="font-bold text-lg">Cliente</p>
                <p className="font-bold text-lg">Status da Proposta</p>
                <p className="font-bold text-lg">Departamentos</p>
                <p className="font-bold text-lg">Data de Criação</p>

            </div>
            {deals.map((deal, index) => (
                <div key={index} className="container justify-center grid grid-cols-5 mx-auto" onClick={() => navigate(`/deals/${deal.id}`)}>
                    <p>{deal.inner_id}</p>
                    <p>{deal.client.name}</p>
                    <p>{deal.status}</p>
                    <div className="flex gap-2">
                        {deal.departments.map((department, index) => (
                            <p key={index}>{department.initials}</p>
                        ))}
                    </div>
                    <p>{moment(deal.date).locale("pt").format("LLLL")}</p>

                </div>
            ))}



        </div>
    );
}

export default ListDeals;