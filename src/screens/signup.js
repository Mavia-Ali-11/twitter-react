import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../config/firebase";
import { db, setDoc, doc } from '../config/firebase';

import TwitterIcon from '@mui/icons-material/Twitter';
import { alpha, styled } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const RedditTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: '1px solid #eee',
        overflow: 'hidden',
        borderRadius: 4,
        width: 350,
        maxWidth: "100%",
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: `${alpha("#1d9bf0", 0.25)} 0 0 0 2px`,
            borderColor: "#1d9bf0",
        },
    },
}));

function SignUp() {

    const history = useHistory();
    const [username, handleUsername] = useState("");
    const [email, handleEmail] = useState("");
    const [password, handlePassword] = useState("");

    return (
        <div className="container-fluid signin">
            <div className="row">
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="r-jwli3a r-4qtqp9 r-yyyyoo r-rxcuwo r-1777fci r-m327ed r-dnmrzs r-494qqr r-bnwqim r-1plcrui r-lrvibr"><g>
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                    </g></svg>
                </div>

                <div>
                    <div>
                        <TwitterIcon />
                    </div>
                    <div>
                        <h2>Happening now</h2>
                    </div>
                    <div>
                        <h4>Join Twitter today.</h4>
                        <div>
                            <RedditTextField
                                type="text"
                                label="Username"
                                variant="filled"
                                style={{ marginTop: 20 }}
                                value={username} onChange={(e) => { handleUsername(e.target.value) }}
                            />
                        </div>
                        <div>
                            <RedditTextField
                                type="email"
                                label="Email address"
                                variant="filled"
                                style={{ marginTop: 20 }}
                                value={email} onChange={(e) => { handleEmail(e.target.value) }}
                            />
                        </div>
                        <div>
                            <RedditTextField
                                type="password"
                                
                                label="Password"
                                variant="filled"
                                style={{ marginTop: 20 }}
                                value={password} onChange={(e) => { handlePassword(e.target.value) }}
                            />
                        </div>
                        <div>
                            <Button variant="contained" id="authBtn" onClick={
                                () => {
                                    if (username != "" && email != "" && password != "") {
                                        createUserWithEmailAndPassword(auth, email, password)
                                            .then(async (userCredential) => {

                                                await setDoc(doc(db, "users", userCredential.user.uid), {
                                                    uid: userCredential.user.uid,
                                                    username: username,
                                                    email: email,
                                                    password: password,
                                                    avatar: "https://firebasestorage.googleapis.com/v0/b/react-firebase-4ea86.appspot.com/o/images%2Favatars%2Fdefault-avatar.jpg?alt=media&token=d15fcd1f-ff5c-4cd5-a2b4-bc254b5e7c33"
                                                });

                                                handleUsername("");
                                                handleEmail("");
                                                handlePassword("");
                                                toast.success("Sign up successful.");
                                                setTimeout(() => {
                                                    history.push("/home");
                                                }, 1000)
                                            })
                                            .catch((error) => {
                                                toast.error(error.message);
                                            });
                                    } else if (username == "") {
                                        toast.error("Username can't be empty.");
                                    } else if (email == "") {
                                        toast.error("Email address can't be empty.");
                                    } else if (password == "") {
                                        toast.error("Password can't be empty.");
                                    }
                                }
                            }>Sign up</Button>
                        </div>
                        <p id="tc">By signing up, you agree to the <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link>, including <Link to="/">Cookie Use</Link>.</p>
                    </div>

                    <div>
                        <h6>Already have an account?</h6>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button variant="outlined" id="gotoBtn">
                                Sign in</Button>
                        </Link>
                    </div>

                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark" />
                </div>
            </div>
        </div>
    )
}

export default SignUp;