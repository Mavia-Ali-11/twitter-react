import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/context";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Link } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { db, collection, query, where, getDocs, limit } from '../config/firebase';

import news1 from "../images/news-1.jpg";
import news2 from "../images/news-2.jpg";
import trophy from "../images/trophy.png";
import profile1 from "../images/babar-azam.jpg";
import profile2 from "../images/feroze-khan.jpg";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            '&:focus': {
                border: "1px solid #1d9bf0"
            },
        },
    },
}));


function Widgets(props) {

    const { state } = useContext(GlobalContext);
    const [allUsers, handleAllUsers] = useState([]);

    useEffect(async () => {
        let dataFetcher = async () => {
            let allUsersClone = allUsers.slice(0);
            const q = query(collection(db, "users"), where("uid", "!=", state.authUser.uid), limit(6));
            const querySnapshot = await getDocs(q);
            await querySnapshot.forEach((doc) => {
                allUsersClone.push(doc.data());
            });
            handleAllUsers(allUsersClone);
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

    return (
        <div className="widgets">
            <div>
                <Search className="searchBar">
                    <SearchIconWrapper>
                        <svg viewBox="0 0 24 24" aria-hidden="true" id="searchIcon">
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                        </svg>
                    </SearchIconWrapper>
                    <StyledInputBase onFocus={() => {
                        document.getElementById("searchIcon").style.fill = "#1d9bf0"
                    }}
                        onBlur={() => {
                            document.getElementById("searchIcon").style.fill = "#536471"
                        }}
                        placeholder="Search Twitter"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            </div>

            <div>
                {(() => {
                    if (props.scrName != "Profile") {
                        return (
                            <div className="widget">
                                <h4>What's happening</h4>

                                <div className="news">
                                    <div>
                                        <span>Cricket&nbsp; · &nbsp;LIVE</span>
                                        <p>
                                            New Zealand spinner Ajaz Patel makes history after picking all 10 wickets in a single Test inning&nbsp;
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#D99E82" d="M35.538 26.679s1.328 2.214-2.658 6.201c-3.987 3.986-6.201 2.658-6.201 2.658L7.185 16.046s.977-2.748 3.544-5.316c2.568-2.567 5.316-3.544 5.316-3.544l19.493 19.493z" /><path fill="#C1694F" d="M13.388 9.844c.979.979 4.522 6.109 3.544 7.088-.979.978-6.109-2.565-7.088-3.544l-8.86-8.86C.006 3.549.006 1.963.984.984c.979-.978 2.565-.978 3.544 0l8.86 8.86z" /><path fill="#292F33" d="M.983 4.528L4.528.984 9.844 6.3 6.3 9.844z" /><circle fill="#BE1931" cx="19" cy="31" r="5" /><path fill="#662113" d="M19 36c-.552 0-1-.447-1-1v-8c0-.553.448-1 1-1 .553 0 1 .447 1 1v8c0 .553-.447 1-1 1z" /></svg>
                                        </p>
                                        <span>Trending with <Link to="#">Ajaz Patel</Link></span>
                                    </div>
                                    <div>
                                        <img src={news1} />
                                    </div>
                                </div>

                                <div className="news trend">
                                    <div>
                                        <span>Politics&nbsp; · &nbsp;Trending</span>
                                        <p style={{ lineHeight: "14px" }}>Pakistan</p>
                                        <span>118K Tweets</span>
                                    </div>
                                    <div>
                                        <MoreHorizIcon />
                                    </div>
                                </div>

                                <div className="news trend">
                                    <div>
                                        <span>Trending in New Zealand</span>
                                        <p style={{ lineHeight: "14px" }}>Neon</p>
                                        <span>24.4K Tweets</span>
                                    </div>
                                    <div>
                                        <MoreHorizIcon />
                                    </div>
                                </div>

                                <div className="news">
                                    <div>
                                        <span><span>Auto racing</span>&nbsp; · &nbsp;Yesterday</span>
                                        <p>Chaz Mostert and Lee Holdsworth win the 2021 Bathurst 1000</p>
                                        <span>Trending with <Link to="#">#bathurst1000</Link><img src={trophy} style={{ width: "18px", marginTop: "-7px" }} /></span>
                                    </div>
                                    <div>
                                        <img src={news2} />
                                    </div>
                                </div>

                                <div className="news trend">
                                    <div>
                                        <span>Trending in Actors</span>
                                        <p style={{ lineHeight: "14px" }}>Jennifer Lawrence</p>
                                        <span>9,833 Tweets</span>
                                    </div>
                                    <div>
                                        <MoreHorizIcon />
                                    </div>
                                </div>

                                <div className="news show-more">
                                    <Link to="#">Show more</Link>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="widget">
                                <h4>People you might now</h4>

                                <div className="profiles">

                                    {
                                        allUsers.map((user, index) => {
                                            return (
                                                <div key={index}>
                                                    <div>
                                                        <img src={user.avatar} />
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p>{user.username}</p>
                                                            <span>{"@" + user.email.slice(0, user.email.indexOf("@"))}</span>
                                                        </div>
                                                        <div>
                                                            <button>Follow</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    <div className="news show-more">
                                        <Link to="#">Show more</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })()}

                <div className="widget">
                    <h4>Who to follow</h4>

                    <div className="profiles">
                        <div>
                            <div>
                                <img src={profile1} />
                            </div>
                            <div>
                                <div>
                                    <p>
                                        Babar Azam
                                        <svg viewBox="0 0 24 24" aria-label="Verified account">
                                            <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g>
                                        </svg>
                                    </p>
                                    <span>@babarazam258</span>
                                </div>
                                <div>
                                    <button>Follow</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div>
                                <img src={profile2} />
                            </div>
                            <div>
                                <div>
                                    <p>
                                        Feroze Khan
                                        <svg viewBox="0 0 24 24" aria-label="Verified account">
                                            <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g>
                                        </svg>
                                    </p>
                                    <span>@ferozekhaan</span>
                                </div>
                                <div>
                                    <button>Follow</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="news show-more">
                        <Link to="#">Show more</Link>
                    </div>
                </div>

                <div className='footer'>
                    <div><p>Terms of Service</p></div>
                    <div><p>Privacy Policy</p></div>
                    <div><p>Cookie Policy</p></div>
                    <div><p>Ads info</p></div>
                    <div><p>More</p> <span>...</span></div>
                    <div><p>&copy; {new Date().getFullYear()} Twitter, Inc.</p></div>
                </div>

            </div>
        </div>
    )
}

export default Widgets;