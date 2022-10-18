import React from 'react';
import {useNavigate} from "react-router-dom"
import { useState } from 'react';

function Home() {
    const navigate = useNavigate();
    const [createUserName, setCreateUsername] = useState('');
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [loginUserName, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // async function images() {
    //     const response = await fetch('http://127.0.0.1:5000/images', {
    //         method: 'POST',
    //         body: JSON.stringify(),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
        
    // }

    async function login() {
        let account = {
            username: loginUserName,
            password: loginPassword
        }
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data.success);
        if (data.success === true) {
            navigate("/loggedin", {state:{user: loginUserName}});
        } else {
            console.log("Du kunde tyvärr inte logga in!")
        }
    }

    async function createAccount() {
        let account = {
            username: createUserName,
            email: createEmail,
            password: createPassword
        }
        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(`Ditt konto har skapats, välkommen ${account.username}.`);
        window.location.reload(false);
    }

    return (
        <>
            <section id="create-account">
                <h1>Bröllopsparet</h1>
                <h3>Skapa konto</h3>
                <input onChange={(e) => {setCreateUsername(e.target.value)}} type="text" id="username" placeholder="Användarnamn" className="form__input"></input>
                <input onChange={(e) => {setCreateEmail(e.target.value)}} type="text" id="email" placeholder="E-post" className="form__input"></input>
                <input onChange={(e) => {setCreatePassword(e.target.value)}} type="password" id="password" placeholder="Lösenord" className="form__input"></input>
                <button id="create-button" onClick={createAccount} className="form__button">Skapa konto</button>
            </section>

            <section id="log-in">
                <h3>Logga in</h3>
                <input onChange={(e) => {setLoginUsername(e.target.value)}} type="text" id="login-username" placeholder="Fyll i användarnamn..." className="form__input"></input>
                <input onChange={(e) => {setLoginPassword(e.target.value)}}  type="password" id="login-password" placeholder="Fyll i lösenord..." className="form__input"></input>
                <button id="login-button" onClick={login} className="form__button">Logga in</button>
            </section>
        </>
    );
}

export default Home;
