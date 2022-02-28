import {useState} from "react"
import {useNavigate} from "react-router-dom"

export const NewClient = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [nif, setNif] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZipCode] = useState('');
    const [person, setPerson] = useState('');
    const [state, setState] = useState('');
    const [nifExists, setNifExists] = useState(false);

    const handleNif = async (e) => {
        setNifExists(false);
        setNif(e.target.value);
        console.log(nif.length);
        if (nif.length === 8) {
            const res = await fetch("http://localhost:3000/client/" + nif);

            if (res.status !== 400) {
                setNifExists(true);
            }
        }
    }

    const handleForm = async (event) => {
        event.preventDefault();
        const data = {
            name,
            email,
            phone,
            nif,
            address,
            city,
            zip,
            person,
            state
        }
        let a = JSON.stringify(data);
        console.log(a);
        const res = await fetch("http://localhost:3000/client",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (res.status === 201) {
            alert("Cliente criado com sucesso!");
            navigate('/home');
        } else {
            alert("Erro ao criar cliente!");
        }
    }

    return (

        <div>
            <h1>Novo Cliente</h1>
            <form className="block border" onSubmit={handleForm}>
                <div className="container mx-auto">
                    <label htmlFor="name">Nome da Empresa: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="name" placeholder="Nome
          do Cliente" value={name} onChange={e => setName(e.target.value)}/>
                    <label htmlFor="email">Email: </label>
                    <input type="email"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="email" placeholder="Email
            do Cliente" value={email} onChange={e => setEmail(e.target.value)}/>
                    <label htmlFor="phone">Telefone: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="phone" placeholder="Telefone
            do Cliente" value={phone} onChange={e => setPhone(e.target.value)}/>
                    <label htmlFor="zip">Código Postal: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="zip" placeholder="Código Postal
            do Cliente" value={zip} onChange={e => setZipCode(e.target.value)}/>
                    <label htmlFor="nif">NIF: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="nif" placeholder="NIF
            do Cliente" value={nif} onChange={handleNif}/>
                    {nifExists && <p className="text-red-500">NIF já existe</p>}
                    <label htmlFor="address">Morada: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="address" placeholder="Morada
            do Cliente" value={address} onChange={e => setAddress(e.target.value)}/>
                    <label htmlFor="city">Cidade: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="city" placeholder="Cidade
            do Cliente" value={city} onChange={e => setCity(e.target.value)}/>
                    <label htmlFor="person">Pessoa Responsável: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="person" placeholder="Pessoa
            do Cliente" value={person} onChange={e => setPerson(e.target.value)}/>
                    <label htmlFor="state">Conselho: </label>
                    <input type="text"
                           className="shadow appearance-none border border-blue-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="state" placeholder="Estado
            do Cliente" value={state} onChange={e => setState(e.target.value)}/>
                    <button type="submit"
                            className="rounded bg-purple-500 p-2 text-white mx-2 hover:bg-purple-500 hover:scale-110">Submit
                    </button>
                </div>

            </form>

        </div>
    );
}