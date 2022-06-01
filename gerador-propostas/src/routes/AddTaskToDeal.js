import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import moment from "moment"
import {TaskCheckBox} from "../components/TaskCheckBox"
import {server} from "../utils/server.js"

const AddTaskToDeal = () => {

    let params = useParams();
    const [deal, setDeal] = useState();

    const [products, setProducts] = useState([]);
    const getDeal = async () => {
        const response = await fetch(`${server}/deal/${params.id}`);
        const data = await response.json();
        setDeal(data);
    }

    const getProductsByDepartment = async (department) => {
        const response = await fetch(`${server}/products/department/${department}`);
        const data = await response.json();

        setProducts(data.map(product => ({
            state: {
                id: product.id,
                description: product.description,
                hours: "0",
                checked: false,
            },
            data: product
        })));
    }


    const handleCheck = (idx) => {
        setProducts(prevState => {
            const newState = [...prevState]
            newState[idx].state.checked = !prevState[idx].state.checked
            return newState
        })
    }

    const handleStateChange = (idx) => (name, value) => {
        setProducts(prevState => {
            const newState = [...prevState]
            newState[idx].state[name] = value
            return newState
        })
    }

    const setHoursDiffState = (idx) => (diff) => {
        setProducts(prevState => {
            const newState = [...prevState]
            newState[idx].state.hours = (parseInt(newState[idx].state.hours) + diff).toString()
            return newState
        })
    }


    const sendProducts = async () => {
        const finalProducts = products
            .filter(product => product.state.checked)
            .map(product => product.state)
            .map(({description, hours, id}) => ({
                description,
                hours,
                id
            }))

        const response = await fetch(`${server}/deal/task/${params.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalProducts)
        });
        const data = await response.text()
        console.log(data)
    }


    useEffect(() => {
        getDeal()
        getProductsByDepartment(JSON.parse(localStorage.getItem("session")).department)
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

            <div className="">
                <label className="font-bold mb-4">Tarefas/Produtos:
                    {products.map((product, idx) => (
                        <TaskCheckBox key={product.data.id} product={product} handleCheck={() => handleCheck(idx)}
                                      handleStateChange={handleStateChange(idx)} setHoursDiffState={setHoursDiffState(idx)}/>
                    ))}
                </label>


            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                    onClick={() => {
                        sendProducts()
                    }}>
                Adicionar Produtos
            </button>
        </div>
    ) : (<p>Loading...</p>)
}

/*
     {
        task.id
        task.description
        task.hours
        deal.id,

 */

export default AddTaskToDeal;
