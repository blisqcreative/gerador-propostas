export const TaskCheckBox = ({product, handleCheck, handleStateChange, setHoursDiffState}) => {


    const increment = () => {
        setHoursDiffState(1)
    }
    const decrement = () => {
        setHoursDiffState(-1)
    }

    return (
        <div>
            <label>
                <input type="checkbox" className="mr-2" checked={product.state.checked}
                       onChange={handleCheck}/>
                {product.data.productname}
            </label>
            {product.state.checked &&
                <div className="flex gap-2">
                    <div className="flex flex-row h-10 rounded-lg relative bg-transparent mt-1 items-center">
                        <textarea className="w-full h-full p-2 text-gray-700 outline-none resize-none border-2 border-gray-400"
                                  placeholder="Descrição da tarefa"
                                  cols="30" rows="10"
                                  defaultValue={product.state.description}
                                  onChange={(e) => handleStateChange("description", e.target.value)}
                                  />
                        <label className="text-lg">Horas:</label>
                            <button onClick={decrement}
                                className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span className="m-auto text-2xl font-thin">−</span>
                        </button>

                        <input type="number"
                               className="h-full outline-none focus:outline-none text-center bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                               name="custom-input-number" value={product.state.hours} onChange={(e) => handleStateChange("hours", e.target.value)}/>

                        <button onClick={increment}
                                className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span className="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>}
        </div>
    )
}