import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, signOut } from '../config/firebase';

function Navbar() {

    const history = useHistory();

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/my-tweets">My tweets</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/"  onClick={() => {
                    signOut(auth).then(() => {
                        history.push("/");
                      }).catch((error) => {
                          console.log(error.message);
                      });
                }}>Sign out</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;