import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import { Navigate } from "react-router-dom";
import moment from "moment"

const AddTaskToDeal = () => {

    let params = useParams();
    const [deal, setDeal] = useState();
    const getDeal = async () => {
        const response = await fetch(`http://localhost:3000/deal/${params.id}`);
        const data = await response.json();
        setDeal(data);
    }
    useEffect(() => {
        getDeal();
    }, []);

    return deal ? (
                <div className="w-11/12 mx-auto">
                    <h1 className="text-3xl text-center">Adicionar Tarefas/Produtos à Proposta</h1>
                    <p>Cliente: {deal.client.name}</p>
                    <p>Proposta: {deal.inner_id}</p>
                    <p>Data de Criação: {moment(deal.date).locale("pt").format("LL")}</p>
                    <div className="flex justify-between mt-10">
                        <label className="font-bold mb-4">Situação Atual:
                            <textarea name="description" id="description" cols="30" rows="10" readOnly
                                      className="resize-none block border-2 p-4" value={deal.clientStatus}
                                      placeholder="Porque nos procurou o cliente? Apresentação da proposta a desenvolver (peça, ação, campanha)."/>
                        </label>
                        <label className="font-bold mb-4">Peças a Desenvolver:
                            <textarea name="description" id="description" cols="30" rows="10" readOnly
                                      className="resize-none block border-2 p-4" value={deal.work}
                                      placeholder="Como vamos comunicar? Em que meios ou canais?"/>
                        </label>
                        <label className="font-bold mb-4">Timings:
                            <textarea name="description" id="description" cols="30" rows="10" readOnly
                                      className="resize-none block border-2 p-4" value={deal.timings}
                                      placeholder="Prazo de execução, lançamento."/>
                        </label>

                    </div>
                </div>
    ) : (<p>Loading...</p>)


}

export default AddTaskToDeal;
