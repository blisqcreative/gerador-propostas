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
        setDeal(data);

    }
    const getProducts = async () => {
        const response = await fetch(`${server}/deal/${id}/products`);
        const data = await response.json();
        setProducts(data);
    }

    const updateHours = (productId, event) => {
        const newProducts = [...products]
        const productIndex = newProducts.findIndex(product => product.product.id == productId);
        newProducts[productIndex].hourRate = parseInt(event.target.value);
        newProducts[productIndex].sellPrice = parseInt(event.target.value) * newProducts[productIndex].hours;
        newProducts[productIndex].adjustedSellPrice = parseInt(event.target.value) * newProducts[productIndex].hours;
        setProducts(newProducts);
    }
    const updateAdjustPrice = (productId, event) => {
        const newProducts = [...products]
        const productIndex = newProducts.findIndex(product => product.product.id == productId);

        newProducts[productIndex].adjustedSellPrice = parseInt(event.target.value);
        setProducts(newProducts);
    }

    useEffect(() => {
        getDeal();
        getProducts();
    }, []);

    const updateProducts = async () => {
        console.log(products)
        let res = await fetch(`${server}/deal/${id}/updateProducts`, {
            method: "POST",
            body: JSON.stringify(products),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (res.ok) {
            console.log("updated")
        }
    }

    return (
        <>
        <h1 className="text-center font-bold text-2xl mb-4">Dashboard de Controlo de Rates</h1>
        <div className="grid grid-cols-9 gap-4 w-11/12 mx-auto">
            <p className="font-bold">Produto</p>
            <p className="font-bold">Descrição</p>
            <p className="font-bold">Quantidade</p>
            <p className="font-bold">Preço hora</p>
            <p className="font-bold">Custo</p>
            <p className="font-bold">Preço Venda</p>
            <p className="font-bold">venda Ajustada</p>
            <p className="font-bold">Net Margin</p>
            <p className="font-bold">Net Margin %</p>
        </div>
        {products.map((product, index) => (
            <div key={index} className="grid grid-cols-9 gap-4 w-11/12 mx-auto">
                <p>{product.product.name}</p>
                <p>{product.description}</p>
                <p>{product.hours}</p>
                <input type="number" className="" value={product.hourRate} onChange={(e) => updateHours(product.product.id, e)}/>
                <p>{product.cost}</p>
                <input type="number" className="" value={product.sellPrice} readOnly />
                <input type="number" className="" value={product.adjustedSellPrice} onChange={(e) => updateAdjustPrice(product.product.id, e)} />
                <p>{product.netMargin}</p>
                <p>{product.netMarginPercentage}</p>
            </div>
        ))}
            <div className={"flex justify-center mt-4"}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={updateProducts}>
                Atualizar Preços
            </button>
            </div>
        </>
    )
}