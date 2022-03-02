import {useRef, useState} from "react"


export const TaskCheckBox = (task) => {
    const [checked, setChecked] = useState(false);
    const [hours, setHours] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [sellPrice, setSellPrice] = useState(0);
    const refInput = useRef(null);

    const handleChange = (e) => {
        setChecked(e.target.checked);
    }
    const handleHours = (e) => {
        setHours(e.target.value);
    }g
    const handleCostPrice = (e) => {
        setCostPrice(e.target.value);
    }
    const handleSellPrice = (e) => {
        setSellPrice(e.target.value);
    }
    const increment = () => {
        refInput.current.value = parseInt(refInput.current.value) + 1;
    }
    const decrement = () => {
        refInput.current.value = parseInt(refInput.current.value) - 1;
    }

    return (
        <div>
            <label>
                <input type="checkbox" className="mr-2" value={task.title}
                       onChange={(e) => handleChange(e)}/>
                {task.title}
            </label>
            {checked &&
                <div className="flex gap-2">
                    <div className="flex flex-row h-10 rounded-lg relative bg-transparent mt-1 items-center">
                        <label className="text-lg">Horas:</label>
                            <button onClick={decrement}
                                className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span className="m-auto text-2xl font-thin">−</span>
                        </button>

                        <input type="number" ref={refInput}
                               className="h-full outline-none focus:outline-none text-center bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                               name="custom-input-number" defaultValue={0} onChange={handleHours}/>

                        <button onClick={increment}
                                className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span className="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                    <label className="mr-2 flex">Preço Custo: <input placeholder="0.00" className="py-2 px-2 h-full w-min outline-none focus:outline-none bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" onChange={handleCostPrice} type="text"/></label>
                    <label className="mr-2 flex">Preço Venda: <input placeholder="0.00" className="py-2 px-2 h-full w-min outline-none focus:outline-none bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" onChange={handleSellPrice} type="text"/></label>
                </div>}
        </div>
    )
}