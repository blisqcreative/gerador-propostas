import {useParams} from "react-router-dom"
import {server} from "../utils/server"
import {useEffect, useState} from "react"

export const Dashboard = () => {
    const id = useParams().id;
    const [deal, setDeal] = useState();
    const [products, setProducts] = useState([]);

    const getDeal = async () => {
        console.log("here")
        const response = await fetch(`${server}/deal/${id}`);
        const data = await response.json();
        console.log(data);
        setDeal(data);

    }
    const getProducts = async () => {
        const response = await fetch(`${server}/deal/${id}/products`);
        const data = await response.json();
        setProducts(data);
        console.log(data);
    }

    useEffect(() => {
        getDeal();
        getProducts();
    }, []);

    return (
        <>
        <h1 className="text-center font-bold text-2xl mb-4">Dashboard de Controlo de Rates</h1>
        <div className="grid grid-cols-6 gap-4 w-11/12 mx-auto">
            <p className="font-bold">Produto</p>
            <p className="font-bold">Descrição</p>
            <p className="font-bold">Quantidade</p>
            <p className="font-bold">Preço hora</p>
            <p className="font-bold">Preço total</p>
            <p className="font-bold">Preço Ajustado</p>
        </div>
        {products.map((product, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 w-11/12 mx-auto">
                <p>{product.product.name}</p>
                <p>{product.description}</p>
                <p>{product.hours}</p>
                <input type="number" className="" defaultValue={product.hourRate}/>
                <input type="number" className="" defaultValue={product.sellPrice} />
                <input type="number" className="" defaultValue={product.adjustedSellPrice} />
            </div>
        ))}
        </>
    )
}