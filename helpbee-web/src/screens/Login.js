import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase';
import '../styles/login-form.css';
import { useSelector, useDispatch } from 'react-redux';
import { userAuth, userType, userUID } from '../redux/actions/userDataAction';
import { useNavigate } from 'react-router-dom';
import { getUserType } from '../api/get';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('warning');

    const uid = useSelector((store) => store.user.uid);
    const authObj = useSelector((store) => store.user.auth)

    useEffect(() => {
        if (uid === "" && authObj === null && sessionStorage.getItem("auth") !== null) {
            let temp = JSON.parse(sessionStorage.getItem("auth"));
            dispatch(userAuth(temp));
            dispatch(userUID(temp.uid))
            dispatch(userType(temp.type))
            navigate("/")
        }
    }, [])

    const handleChange = (e, input) => {
        let value = e.target.value;
        input === 'email' ? setEmail(value) : setPassword(value);
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const validateEmail = () => {
        //eslint-disable-next-line
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return reg.test(email);
    }

    const handleLogin = () => {
        if (validateEmail(email)) {

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    login(user);
                })
                .catch(err => {
                    setAlertMsg("Invalid email or password");
                    setAlertType('error')
                    console.log(err)
                });
        }
        else {
            return false;
        }
    }

    const login = async (user) => {

        const response = await getUserType(user.uid)
        if (response.data.userType !== 'normal') {
            sessionStorage.setItem("auth", JSON.stringify(user));
            sessionStorage.setItem("userType", response.data.userType)
            dispatch(userAuth(user));
            dispatch(userUID(user.uid));
            dispatch(userType(response.data.userType))
            setEmail("");
            setPassword("");
            navigate("/")
        }
        else {
            auth
                .signOut()
                .then(() => {
                    setEmail("");
                    setPassword("");
                    setAlertType('warning')
                    setAlertMsg("Ups... it seems that you do NOT have permission to log in to this page!")
                })
                .catch(err => alert(err.message))
        }

    }



    return (
        <div>
            {alertMsg !== "" ?
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity={alertType} onClose={() => setAlertMsg("")}>{alertMsg}</Alert>
                </Stack>
                : null}

            <div className='container'>


                <div id="login">
                    <img className={'login_logo'} src={require('../img/logo.jpg')} alt="logo" width={280} height={280} />
                    <div className="login-form" >
                        <span className="fa fa-user"></span>
                        <input
                            autoFocus
                            maxLength="25"
                            onChange={(e) => handleChange(e, 'email')}
                            placeholder="Email"
                            type="email"
                            value={email}
                            required
                            onKeyDown={handleKeyDown}
                        />
                        <span className="fa fa-lock"></span>
                        <input
                            autoComplete="off"
                            maxLength="8"
                            onChange={(val) => handleChange(val, 'password')}
                            placeholder="Password"
                            type="password"
                            value={password}
                            required
                            onKeyDown={handleKeyDown}
                        />
                        <button value="Log in" onClick={handleLogin}> Log in </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login