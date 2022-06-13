import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, db, doc, updateDoc } from "../config/firebase";

import TwitterIcon from '@mui/icons-material/Twitter';
import { alpha, styled } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

function SignIn() {

  const history = useHistory();
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [sendToEmail, handleSendToEmail] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <h2>Welcome back</h2>
          </div>
          <div>
            <h4>Login to Twitter.</h4>
            <div>
              <RedditTextField
                type="email"
                label="Email address"
                variant="filled"
                style={{ marginTop: 20 }}
                value={email} onChange={(e) => {
                  handleEmail(e.target.value);
                }}
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
                  if (email != "" && password != "") {
                    signInWithEmailAndPassword(auth, email, password)
                      .then(async (userCredential) => {
                        await updateDoc(doc(db, "users", userCredential.user.uid), {
                          password: password
                        });
                        handleEmail("");
                        handlePassword("");
                        toast.success("Sign in successfully.");
                        setTimeout(() => {
                          history.push("/home");
                        }, 1000);
                      })
                      .catch((error) => {
                        toast.error(error.message);
                      });
                  } else if (email == "") {
                    toast.error("Email address is required to sign in.");
                  } else if (password == "") {
                    toast.error("Password is required to sign in.");
                  }
                }
              }>Sign in</Button>

              <Button variant="contained" id="forgotPassword" 
              onClick={()=>{
                handleClickOpen();
                handleSendToEmail(email);
              }}>Forgot password</Button>
          </div>
          <p id="tc"></p>
        </div>
        <div>
          <h6>Not have an account?</h6>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Button variant="outlined" id="gotoBtn">
              Sign up</Button>
          </Link>
        </div>

        <div>
          <Dialog className="changing-dialog" open={open} onClose={handleClose}>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your application associated email address where you will recieve a link to reset the password.
              </DialogContentText>
              <RedditTextField
                type="email"
                label="Email address"
                variant="filled"
                style={{ marginTop: 20 }}
                value={sendToEmail} onChange={(e) => { handleSendToEmail(e.target.value) }}
              />
            </DialogContent>
            <DialogActions>
              <Button className="cancelBtn" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => {
                if (sendToEmail == "") {
                  toast.error("Please enter your application associated email address to proceed.");
                } else {
                  const auth = getAuth();
                  sendPasswordResetEmail(auth, sendToEmail)
                    .then(async () => {
                      handleClose();
                      handleSendToEmail("");
                      toast.success("Password reset link was sent to your email. Follow the instructions there.");
                    })
                    .catch((error) => {
                      toast.error(error.message);
                    });
                }
              }}>Send</Button>
            </DialogActions>
          </Dialog>
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
    </div >
  )
}

export default SignIn;