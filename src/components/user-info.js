import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/context";
import { useHistory, Link } from 'react-router-dom';
import { auth, updateEmail, sendEmailVerification, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, db, doc, updateDoc, setDoc, storage, ref, uploadBytes, getDownloadURL } from '../config/firebase';
import CameraIcon from '@mui/icons-material/CameraAlt';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from 'react-toastify';

function UserInfo(props) {

    const history = useHistory();
    const { state } = useContext(GlobalContext);
    const [crrUser, handleCrrUser] = useState({});
    const [crrEmail, handleCrrEmail] = useState("");
    const [crrPassword, handleCrrPassword] = useState("");
    const [btnDisable, handleBtnDisability] = useState(true);
    const [btnAccess, handleBtnAccess] = useState({ opacity: "0.6" });
    const [showLoader, setShowLoader] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [loaderText, handleLoaderText] = useState("");

    useEffect(async () => {
        let dataFetcher = () => {
            handleCrrUser(state.authUser);
            handleCrrEmail(state.authUser.email);
            handleCrrPassword(state.authUser.password);
        }

        if (state.authUser.uid == undefined) {
            let detectData = setInterval(() => {
                if (state.authUser.uid != undefined) {
                    clearInterval(detectData);
                    dataFetcher();
                }
            }, 1000);
        } else {
            dataFetcher();
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

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

    return (
        <div className="user-profile feeds">
            <div className='loader' hidden={showLoader}>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
                <h6>{loaderText}</h6>
            </div>

            <div className='header' onClick={() => { document.getElementsByClassName('user-profile')[0].scrollTop = 0 }}>
                <h4>{props.scrName}</h4>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path></g></svg>
                </div>
            </div>

            {(() => {
                if (crrUser.uid != undefined) {
                    return (
                        <div className="user-info">

                            {/* Change avatar */}

                            <div>
                                <h4>Profile picture</h4>
                                <div className="user-avatar" onClick={() => {
                                    document.getElementById("imageUpload").click();
                                }}>
                                    <img src={crrUser.avatar} id="profileImg" alt="avatar" />
                                    <div className="middle"><CameraIcon /></div>
                                </div>
                                <input type="file" accept='image/*' id="imageUpload" onChange={(e) => {
                                    if (e.target.files[0] != undefined) {
                                        document.getElementById("profileImg").src = URL.createObjectURL(e.target.files[0]);
                                        handleBtnDisability(false);
                                        handleBtnAccess({ opacity: "1" });
                                    }
                                }} />

                                <button id="saveAvatar" disabled={btnDisable} style={btnAccess} onClick={() => {
                                    handleLoaderText("updating your profile picture...");
                                    setShowLoader(false);
                                    handleBtnDisability(true);
                                    handleBtnAccess({ opacity: "0.6" });
                                    let selectedImg = document.getElementById("imageUpload").files[0];
                                    let imageRef = ref(storage, `images/avatars/${crrUser.uid}`)
                                    uploadBytes(imageRef, selectedImg).then(async () => {
                                        await getDownloadURL(imageRef)
                                            .then(async (url) => {
                                                let dataRef = doc(db, "users", crrUser.uid);
                                                state.authUser.avatar = url;
                                                await setDoc(dataRef, {
                                                    avatar: url
                                                }, { merge: true });
                                                setShowLoader(true);
                                                toast.success("Profile picture was updated successfuly!");
                                            })
                                    });
                                }}>Update</button>

                            </div>

                            {/* Username */}

                            <div className="username">
                                <h4>Username</h4>
                                <h6>{crrUser.username}</h6>
                                <p>*username is generated by application and must be unique, you can't change it.</p>
                            </div>

                            {/* Email changer */}

                            <div>
                                <h4>Email address</h4>
                                <h6>{crrEmail}</h6>
                                <Link to="#" onClick={handleClickOpen}>Change email</Link>
                            </div>

                            {/* Password changer */}

                            <div>
                                <h4>Password</h4>
                                <h6 style={{ marginBottom: 15 }}>{crrPassword.replace(/./g, '*')}</h6>
                                <Link to="#" onClick={handleClickOpen1}>Change password</Link>
                            </div>
                        </div>
                    )
                }
                return null;
            })()}

            {/* Email change dialog */}

            <div>
                <Dialog className="changing-dialog" open={open} onClose={handleClose}>
                    <DialogTitle>Change your email</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To change your email address, please enter your correct password first.
                        </DialogContentText>
                        <RedditTextField
                            type="password"
                            label="Password"
                            variant="filled"
                            style={{ marginTop: 20 }}
                            id="checkPassword"
                        />
                        <RedditTextField
                            type="email"
                            label="New email address"
                            variant="filled"
                            style={{ marginTop: 20 }}
                            id="newEmail"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button className="cancelBtn" onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => {
                            let checkPassword = document.getElementById("checkPassword");
                            let newEmail = document.getElementById("newEmail");

                            if (checkPassword.value == "") {
                                toast.error("Please enter your correct password first to proceed.");
                            } else if (newEmail.value == "") {
                                toast.error("Please enter the new email address.");
                            } else if (newEmail.value == crrEmail) {
                                toast.error("This is your current email address. Please try another one.");
                            } else {
                                const credential = EmailAuthProvider.credential(crrEmail, checkPassword.value);
                                reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                                    updateEmail(auth.currentUser, newEmail.value)
                                        .then(async () => {
                                            handleClose();
                                            handleLoaderText("updating your email address...");
                                            setShowLoader(false);

                                            await updateDoc(doc(db, "users", crrUser.uid), {
                                                email: newEmail.value
                                            });

                                            await sendEmailVerification(auth.currentUser)

                                            handleCrrEmail(newEmail.value);
                                            state.authUser.email = newEmail.value;
                                            setShowLoader(true);
                                            toast.success("Email address was updated successfuly!");
                                        })
                                        .catch((error) => {
                                            toast.error(error.message);
                                        });
                                }).catch((error) => {
                                    if (checkPassword.value != crrPassword) {
                                        toast.error("Password is incorrrect. Please enter correct password to proceed.");
                                    } else {
                                        toast.error(error.message);
                                    }
                                });
                            }
                        }}>Update</Button>
                    </DialogActions>
                </Dialog>
            </div>

            {/* Password change dialog */}

            <div>
                <Dialog className="changing-dialog" open={open1} onClose={handleClose1}>
                    <DialogTitle>Change your password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To change your password, please enter your current password first.
                        </DialogContentText>
                        <RedditTextField
                            type="password"
                            label="Current password"
                            variant="filled"
                            style={{ marginTop: 20 }}
                            id="currentPassword"
                        />
                        <RedditTextField
                            type="password"
                            label="New password"
                            variant="filled"
                            style={{ marginTop: 20 }}
                            id="newPassword"
                        />
                        <RedditTextField
                            type="password"
                            label="Confirm new password"
                            variant="filled"
                            style={{ marginTop: 20 }}
                            id="confirmPassword"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button className="cancelBtn" onClick={handleClose1}>Cancel</Button>
                        <Button onClick={() => {
                            let currentPassword = document.getElementById("currentPassword");
                            let newPassword = document.getElementById("newPassword");
                            let confirmPassword = document.getElementById("confirmPassword");

                            if (currentPassword.value == "") {
                                toast.error("Please enter your current password first to proceed.");
                            } else if (newPassword.value == "") {
                                toast.error("Please enter the new password.");
                            } else if (confirmPassword.value == "") {
                                toast.error("Please confirm the new password.");
                            } else if (newPassword.value != confirmPassword.value) {
                                toast.error("Confirmation password didn't match.");
                            } else if (newPassword.value == crrPassword) {
                                toast.error("New password is your current password. Please try another one.");
                            } else {
                                const credential = EmailAuthProvider.credential(crrEmail, currentPassword.value);
                                reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                                    updatePassword(auth.currentUser, newPassword.value)
                                        .then(async () => {
                                            handleClose1();
                                            handleLoaderText("updating your password...");
                                            setShowLoader(false);

                                            await updateDoc(doc(db, "users", crrUser.uid), {
                                                password: newPassword.value
                                            });

                                            handleCrrPassword(newPassword.value);
                                            setShowLoader(true);

                                            await signOut(auth).then(() => {
                                                history.push("/");
                                            }).catch((error) => {
                                                toast.error(error.message);
                                            });
                                        })
                                        .catch((error) => {
                                            toast.error(error.message);
                                        });
                                }).catch((error) => {
                                    if (currentPassword.value != crrPassword) {
                                         toast.error("Current password is incorrrect. Please enter correct password to proceed.");
                                    } else {
                                        toast.error(error.message);
                                    }
                                });
                            }
                        }}>Update</Button>
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
    )
}

export default UserInfo;