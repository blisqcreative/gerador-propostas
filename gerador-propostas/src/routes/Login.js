import {useState} from "react"
import {Redirect} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');


    const handleLogin = async () => {
        setError(false);

        const res = await fetch('http://188.166.144.172:4000/login', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        if(res.status !== 200) {
            const data = await res.text();
            setError(true);
            setMessage(data);
            return;
        }
        const data = await res.json();
        console.log(data);
        let string = JSON.stringify(data);
        localStorage.setItem('session', string);
        navigate('/home');
    }

        return (
            <div className="flex items-center justify-center w-full m-auto h-screen bg-gray-800">
                <div>
                    <h1 className="text-3xl text-white mb-5">Gerador de Propostas - Blisq</h1>
                    <label className={'block text-white text-sm font-bold mb-2'}>
                        E-mail
                    </label>
                    <input
                        className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className={'block text-white text-sm font-bold mb-2'}>
                        Password
                    </label>
                    <input
                        className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className={'text-red-500 text-sm font-bold mb-2'}>{message}</p>}
                    <button
                        className={'bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                </div>

            </div>
        )
    }

    export default Login;