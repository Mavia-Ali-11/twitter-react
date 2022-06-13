import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/context';
import { Link } from 'react-router-dom';
import { db, doc, addDoc, setDoc, getDoc, updateDoc, collection, onSnapshot, query, orderBy, deleteField, increment, storage, ref, uploadBytes, getDownloadURL, arrayUnion } from '../config/firebase';
import Picker from 'emoji-picker-react';
import CircularStatic from '../components/tweet-length';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';

function Feeds(props) {

    const { state } = useContext(GlobalContext);
    const [tweet, handleTweet] = useState("");
    const [fetchedTweets, handleFetchedTweets] = useState([]);
    const [fetchedReactions, handleFetchedReactions] = useState([]);
    const [fetchedUsers, handleFetchedUsers] = useState([]);
    const [isDisbaled, handleDisability] = useState(true);
    const [btnAccess, handleBtnAccess] = useState(0.5);
    const [postImages, handlePostImages] = useState([]);
    const [imgInpAccess, handleImgInpAccess] = useState(1);
    const [imgInpPointer, handleImgInpPointer] = useState("auto");
    const [imgInpDisable, handleImgInpDisability] = useState(false);
    const [showEmojis, setShowEmojis] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [imagesStack, handleImagesStack] = useState([]);
    const [currentImage, handleCurrentImage] = useState("");
    const [slideNavPrev, handleSlideNavPrev] = useState({});
    const [slideNavNext, handleSlideNavNext] = useState({});

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const onEmojiClick = (event, emojiObject) => {
        if (tweet.length < "280") {
            handleTweet(tweet + emojiObject.emoji);
        }
        handleDisability(false);
        handleBtnAccess(1);
    };

    window.addEventListener('click', function(event){
        var emojiBtn = document.getElementById("emojiBtn");
        var emojiPanel = document.getElementById("emojiPanel");
        if (event.target.closest("#emojiBtn") != emojiBtn && event.target.closest("#emojiPanel") != emojiPanel){
            if (showEmojis == false) {
                setShowEmojis(true);
            }
        }
    });

    useEffect(async () => {
        let usersClone = fetchedUsers.slice(0);
        const qu = query(collection(db, "users"));
        onSnapshot(qu, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type == "added") {
                    let userData = change.doc.data();
                    usersClone.push(userData);
                }
            });
            handleFetchedUsers(usersClone);
        });

        let tweetsClone = fetchedTweets.slice(0);
        let dataFetcher = async () => {
            const q = query(collection(db, "tweets"), orderBy("tweet_counter"));
            onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type == "added" && props.scrName != "My tweets") {
                        let tweetData = change.doc.data();
                        tweetData.tweet_id = change.doc.id;
                        tweetsClone.push(tweetData);
                    } else if (change.type == "added" && change.doc.data().uid == state.authUser.uid) {
                        let tweetData = change.doc.data();
                        tweetData.tweet_id = change.doc.id;
                        tweetsClone.push(tweetData);
                    } else if (change.type == "modified") {
                        let tweetData = change.doc.data();
                        tweetData.tweet_id = change.doc.id;
                        tweetsClone.push(tweetData);
                    }
                });
                handleFetchedTweets(tweetsClone);
            });

            let tweetsReactionsClone = fetchedReactions.slice(0);
            const qr = query(collection(db, "reactions"));
            onSnapshot(qr, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type == "added") {
                        let tweetsReaction = change.doc.data();
                        tweetsReaction.tweet_id = change.doc.id;
                        tweetsReactionsClone.push(tweetsReaction);
                    }
                });
                handleFetchedReactions(tweetsReactionsClone);
            });
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

    let decider = (likedData, id) => {
        let thisTweet = fetchedReactions.find(element => element.tweet_id == id);
        if (likedData.includes(true) && thisTweet != undefined) {
            return (
                <div className="reactions">
                    <div>
                        <div className="comment">
                            <div className="com-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
                            </div>
                            <span className="com-count">0</span>
                        </div>
                    </div>
                    <div>
                        <div className="retweet">
                            <div className="rt-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
                            </div>
                            <span className="rt-count">0</span>
                        </div>
                    </div>
                    <div>
                        <div className="likes liked" id={"m" + id} onClick={() => {
                            let tweetID = document.getElementById("m" + id);
                            let likesCount = document.querySelectorAll("#m" + id + " .like-count")[0];
                            if (tweetID.classList.contains("liked")) {
                                deleteReaction(id);
                                tweetID.classList.remove("liked");
                                likesCount.innerHTML = Number(likesCount.innerHTML) - 1;
                            } else {
                                addLike(id);
                                tweetID.classList.add("liked");
                                likesCount.innerHTML = Number(likesCount.innerHTML) + 1;
                            }
                        }}>
                            <div className="like-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>
                            </div>
                            <span className="like-count">{thisTweet.likes_count}</span>
                        </div>
                    </div>
                    <div>
                        <div className="share">
                            <div className="share-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (thisTweet != undefined) {
            return (
                <div className="reactions">
                    <div>
                        <div className="comment">
                            <div className="com-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
                            </div>
                            <span className="com-count">0</span>
                        </div>
                    </div>
                    <div>
                        <div className="retweet">
                            <div className="rt-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
                            </div>
                            <span className="rt-count">0</span>
                        </div>
                    </div>
                    <div>
                        <div className="likes" id={"m" + id} onClick={() => {
                            let tweetID = document.getElementById("m" + id);
                            let likesCount = document.querySelectorAll("#m" + id + " .like-count")[0];
                            if (tweetID.classList.contains("liked")) {
                                deleteReaction(id);
                                tweetID.classList.remove("liked");
                                likesCount.innerHTML = Number(likesCount.innerHTML) - 1;
                            } else {
                                addLike(id);
                                tweetID.classList.add("liked");
                                likesCount.innerHTML = Number(likesCount.innerHTML) + 1;
                            }
                        }}>
                            <div className="like-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>
                            </div>
                            <span className="like-count">{thisTweet.likes_count}</span>
                        </div>
                    </div>
                    <div>
                        <div className="share">
                            <div className="share-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    let addLike = (id) => {
        setDoc(doc(db, "reactions", id), {
            [state.authUser.uid]: "liked",
            likes_count: increment(1),
        }, { merge: true });
    }

    let deleteReaction = (id) => {
        updateDoc(doc(db, 'reactions', id), {
            [state.authUser.uid]: deleteField(),
            likes_count: increment(-1)
        });
    }

    let displayImages = (postImgs) => {
        let images = [];
        if (postImgs.length > 0) {
            postImgs.map((img) => {
                images.push(img);
            });
            {
                if (images.length == 1) {
                    return (
                        <div className='posters' style={{ minHeight: "343px" }} >
                            <div style={{ backgroundImage: `url(${images[0]})`, maxHeight: "670px", borderRadius: "16px" }}
                                onClick={(e) => targetedPost(e, "0")}>
                                <img src={images[0]} />
                            </div>
                        </div>
                    )
                } else if (images.length == 2) {
                    return (
                        <div className='posters' style={{ minHeight: "280px" }}>
                            <div style={{ backgroundImage: `url(${images[0]})`, maxHeight: "280px", margin: "0 2px 0 0", borderRadius: "16px 0 0 16px" }}
                                onClick={(e) => targetedPost(e, "0")}>
                                <img src={images[0]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[1]})`, maxHeight: "280px", borderRadius: "0 16px 16px 0" }}
                                onClick={(e) => targetedPost(e, "1")}>
                                <img src={images[1]} />
                            </div>
                        </div>
                    )
                } else if (images.length == 3) {
                    return (
                        <div className='posters' style={{ minHeight: "302px" }}>
                            <div style={{ backgroundImage: `url(${images[0]})`, maxHeight: "150px", margin: "0 2px 2px 0", borderRadius: "16px 0 0 0" }}
                                onClick={(e) => targetedPost(e, "0")}>
                                <img src={images[0]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[1]})`, maxHeight: "150px", margin: "0 0 2px 0", borderRadius: "0 16px 0 0" }}
                                onClick={(e) => targetedPost(e, "1")}>
                                <img src={images[1]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[2]})`, maxHeight: "150px", borderRadius: "0 0 16px 16px" }}
                                onClick={(e) => targetedPost(e, "2")}>
                                <img src={images[2]} />
                            </div>
                        </div>
                    )
                } else if (images.length == 4) {
                    return (
                        <div className='posters' style={{ minHeight: "302px" }}>
                            <div style={{ backgroundImage: `url(${images[0]})`, maxHeight: "150px", margin: "0 2px 2px 0", borderRadius: "16px 0 0 0" }}
                                onClick={(e) => targetedPost(e, "0")}>
                                <img src={images[0]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[1]})`, maxHeight: "150px", margin: "0 0 2px 0", borderRadius: "0 16px 0 0" }}
                                onClick={(e) => targetedPost(e, "1")}>
                                <img src={images[1]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[2]})`, maxHeight: "150px", margin: "0 2px 0 0", borderRadius: "0 0 0 16px" }}
                                onClick={(e) => targetedPost(e, "2")}>
                                <img src={images[2]} />
                            </div>
                            <div style={{ backgroundImage: `url(${images[3]})`, maxHeight: "150px", borderRadius: "0 0 16px 0" }}
                                onClick={(e) => targetedPost(e, "3")}>
                                <img src={images[3]} />
                            </div>
                        </div>
                    )
                }
            }
        }
    }

    let targetedPost = async (e, i) => {
        let selectedImages = imagesStack.slice(0);
        let clickedImage = e.target.parentNode.children;
        for (var x = 0; x < clickedImage.length; x++) {
            selectedImages.push(clickedImage[x].style.backgroundImage.slice(5, -2));
        };
        handleImagesStack(selectedImages);

        await showLightbox(e, i);
    }

    let showLightbox = (e, i) => {
        var lightbox = document.getElementById("lightbox");
        var modalImg = document.getElementById("modal-img");
        modalImg.src = e.target.parentNode.children[i].style.backgroundImage.slice(5, -2);
        lightbox.style.animationName = "slidein";
        lightbox.style.display = "block";

        trackSliderNavBtn(e, i);
        handleCurrentImage(i);
    }

    let trackSliderNavBtn = (e, i) => {
        let clikedImg = e.target.parentNode.children.length;
        if (i == (clikedImg - 1) && i != 0) {
            handleSlideNavNext({ visibility: "hidden", pointerEvents: "none" });
            handleSlideNavPrev({ visibility: "visible", pointerEvents: "auto" });
        } else if (i == 0 && clikedImg > 1) {
            handleSlideNavPrev({ visibility: "hidden", pointerEvents: "none" });
            handleSlideNavNext({ visibility: "visible", pointerEvents: "auto" });
        } else if (i == 0) {
            handleSlideNavPrev({ visibility: "hidden", pointerEvents: "none" });
            handleSlideNavNext({ visibility: "hidden", pointerEvents: "none" });;
        } else {
            handleSlideNavPrev({ visibility: "visible", pointerEvents: "auto" });
            handleSlideNavNext({ visibility: "visible", pointerEvents: "auto" });
        }
    }

    return (
        <div className='feeds'>
            <div className='loader' hidden={showLoader}>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
                <h6>publishing your tweet...</h6>
            </div>

            <div className='header' onClick={() => { document.getElementsByClassName('feeds')[0].scrollTop = 0 }}>
                <h4>{props.scrName}</h4>
                <div>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path></g></svg>
                </div>
            </div>

            <div className='tweet-maker'>
                <div className='avatar-feed'>
                    <Link to="/profile"><img src={state.authUser.avatar} /></Link>
                </div>

                <div className='tweet-input'>
                    <div>
                        <textarea
                            placeholder="What's happening?"
                            rows="1" cols="35"
                            value={tweet}
                            onChange={(e) => {
                                e.target.style.height = "5px";
                                e.target.style.height = (e.target.scrollHeight) + 1 + "px";

                                if (e.target.value.length != 0 && e.target.value.trim().length != 0 && e.target.value.length <= 280) {
                                    handleTweet(e.target.value);
                                    handleDisability(false);
                                    handleBtnAccess(1);
                                } else if ((e.target.value.length == 0 || e.target.value.trim().length == 0)) {
                                    handleTweet(e.target.value);
                                    if (postImages.length == 0) {
                                        handleBtnAccess(0.5);
                                        handleDisability(true);
                                    }
                                }
                            }} />

                        <div id="post-imgs"></div>
                    </div>

                    <div className="tweet-extras">
                        <div>
                            <div title="Media" style={{ pointerEvents: imgInpPointer, opacity: imgInpAccess }} onClick={() => {
                                document.getElementById("post-imgs-inp").click();
                            }}>
                                <svg viewBox="0 0 24 24" aria-hidden="true" ><g><path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path><circle cx="8.868" cy="8.309" r="1.542"></circle></g></svg>
                                <input type="file" ccept="audio/*,video/*,image/*" id="post-imgs-inp" multiple disabled={imgInpDisable} onChange={(e) => {

                                    if (postImages.length == 0 && e.target.files.length > 4) {
                                        toast.error("You can upload a maximum of 4 media files");
                                    } else if (postImages.length == 1 && e.target.files.length > 3) {
                                        toast.error("You can upload a maximum of 4 media files");
                                    } else if (postImages.length == 2 && e.target.files.length > 2) {
                                        toast.error("You can upload a maximum of 4 media files");
                                    } else if (postImages.length == 3 && e.target.files.length > 1) {
                                        toast.error("You can upload a maximum of 4 media files");
                                    } else {
                                        let filesClone = postImages.slice(0);
                                        let postImgs = document.getElementById("post-imgs");

                                        for (var x = 0; x < e.target.files.length; x++) {
                                            let uniqueRand = Math.floor((Math.random() * 100000000) * (Math.random() * 100000000));
                                            filesClone.push({ [uniqueRand]: e.target.files[x] });

                                            postImgs.innerHTML +=
                                                `<div id="pi${uniqueRand}" style="background-image: url(${URL.createObjectURL(e.target.files[x])})">
                                                    <img src="${URL.createObjectURL(e.target.files[x])}" />
                                                    <div class="del-icon" id="${uniqueRand}">
                                                        <svg id="${uniqueRand}" viewBox="0 0 24 24" aria-hidden="true"><g id="${uniqueRand}"><path id="${uniqueRand}" d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>
                                                    </div>
                                                </div>`

                                            let allPostImgs = document.querySelectorAll("#post-imgs > div");
                                            let delIcon = document.getElementsByClassName("del-icon");
                                            if (allPostImgs.length == 1) {
                                                for (var i = 0; i < allPostImgs.length; i++) {
                                                    allPostImgs[i].style.maxHeight = "670px";
                                                    delIcon[i].onclick = (e) => {
                                                        document.getElementById("pi" + e.target.id).remove();
                                                        for (var j = 0; j < filesClone.length; j++) {
                                                            if (e.target.id in filesClone[j]) {
                                                                filesClone.splice(j, 1);
                                                                handleAcessOfInput();
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (allPostImgs.length == 2) {
                                                for (var i = 0; i < allPostImgs.length; i++) {
                                                    allPostImgs[i].style.maxHeight = "280px";
                                                    delIcon[i].onclick = (e) => {
                                                        document.getElementById("pi" + e.target.id).remove();
                                                        for (var j = 0; j < filesClone.length; j++) {
                                                            if (e.target.id in filesClone[j]) {
                                                                filesClone.splice(j, 1);
                                                                handleAcessOfInput();
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (allPostImgs.length > 2) {
                                                for (var i = 0; i < allPostImgs.length; i++) {
                                                    allPostImgs[i].style.maxHeight = "150px";
                                                    delIcon[i].onclick = (e) => {
                                                        document.getElementById("pi" + e.target.id).remove();
                                                        for (var j = 0; j < filesClone.length; j++) {
                                                            if (e.target.id in filesClone[j]) {
                                                                filesClone.splice(j, 1);
                                                                handleAcessOfInput();
                                                            }
                                                        }
                                                    }
                                                }
                                                if (allPostImgs.length == 4) {
                                                    handleImgInpAccess(0.5);
                                                    handleImgInpPointer("none");
                                                    handleImgInpDisability(true);
                                                }
                                            }
                                        }

                                        handlePostImages(filesClone);
                                        handleDisability(false);
                                        handleBtnAccess(1);

                                        let handleAcessOfInput = () => {
                                            document.getElementById("post-imgs-inp").value = null;
                                            let checkText = document.getElementsByTagName("textarea");
                                            if (filesClone.length == 0 && checkText[0].innerHTML.length == 0) {
                                                handleBtnAccess(0.5);
                                                handleDisability(true);
                                            } else if (filesClone.length < 4) {
                                                handleImgInpAccess(1);
                                                handleImgInpPointer("auto");
                                                handleImgInpDisability(false);
                                            }
                                        }
                                    }
                                }} />
                            </div>

                            <div title="GIF">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path><path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path></g></svg>
                            </div>

                            <div title="Poll">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"></path></g></svg>
                            </div>

                            <span id='emojiPanel' hidden={showEmojis}>
                                <Picker onEmojiClick={onEmojiClick} />
                            </span>

                            <div id='emojiBtn' title="Emoji" onClick={() => {
                                setShowEmojis(!showEmojis);
                                document.getElementsByClassName("emoji-search")[0].setAttribute("placeholder", "Search emoji");
                            }}>
                                <svg className='emojiBtn' viewBox="0 0 24 24" aria-hidden="true"><g className='emojiBtn'><path className='emojiBtn' d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path><path className='emojiBtn' d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z"></path><circle className='emojiBtn' cx="14.738" cy="9.458" r="1.478"></circle><circle className='emojiBtn' cx="9.262" cy="9.458" r="1.478"></circle></g></svg>
                            </div>

                            <div title="Schedule">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z"></path><path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"></path><path d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"></path><path d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"></path></g></svg>
                            </div>

                            <div title="Location">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 14.315c-2.088 0-3.787-1.698-3.787-3.786S9.913 6.74 12 6.74s3.787 1.7 3.787 3.787-1.7 3.785-3.787 3.785zm0-6.073c-1.26 0-2.287 1.026-2.287 2.287S10.74 12.814 12 12.814s2.287-1.025 2.287-2.286S13.26 8.24 12 8.24z"></path><path d="M20.692 10.69C20.692 5.9 16.792 2 12 2s-8.692 3.9-8.692 8.69c0 1.902.603 3.708 1.743 5.223l.003-.002.007.015c1.628 2.07 6.278 5.757 6.475 5.912.138.11.302.163.465.163.163 0 .327-.053.465-.162.197-.155 4.847-3.84 6.475-5.912l.007-.014.002.002c1.14-1.516 1.742-3.32 1.742-5.223zM12 20.29c-1.224-.99-4.52-3.715-5.756-5.285-.94-1.25-1.436-2.742-1.436-4.312C4.808 6.727 8.035 3.5 12 3.5s7.192 3.226 7.192 7.19c0 1.57-.497 3.062-1.436 4.313-1.236 1.57-4.532 4.294-5.756 5.285z"></path></g></svg>
                            </div>
                        </div>

                        <div className="tweetValidator">
                            <div>
                                {(() => {
                                    if (tweet.length > 0) {
                                        return (<CircularStatic chars={tweet} />);
                                    }
                                })()}
                            </div>

                            {(() => {
                                if (tweet.length > 0) {
                                    return (<div className='seperator'></div>);
                                }
                            })()}

                            <div>
                                <button onClick={
                                    async () => {

                                        setShowLoader(false);
                                        handleDisability(true);
                                        handleBtnAccess(0.5);

                                        const tweetsCounter = await getDoc(doc(db, "tweets_counter", "home_count"));

                                        let dt = new Date();
                                        let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        let date = (months[dt.getMonth()]) + " " + dt.getDate() + ", " + dt.getFullYear();
                                        let time = dt.getHours() + ":" + dt.getMinutes();

                                        let publishTweet = async (imgsArr) => {
                                            let docRef = await addDoc(collection(db, "tweets"), {
                                                tweet_time: time,
                                                tweet_date: date,
                                                tweet_text: tweet,
                                                posts_images: imgsArr,
                                                uid: state.authUser.uid,
                                                tweet_counter: tweetsCounter.data().counter,
                                            });

                                            await setDoc(doc(db, "reactions", docRef.id), {
                                                likes_count: 0,
                                            });
                                        }

                                        if (postImages.length > 0) {
                                            let holdImages = [];
                                            let uniqueness = new Date().getTime();
                                            let imageDir = `images/posts-images/${state.authUser.uid}/${uniqueness}/`;
                                            for (var i = 0; i <= postImages.length; i++) {
                                                if (i < postImages.length) {
                                                    let postImg = postImages[i][Object.keys(postImages[i])[0]];
                                                    let imageRef = ref(storage, `${imageDir} ${postImg.name}`)
                                                    await uploadBytes(imageRef, postImg).then(async () => {
                                                        await getDownloadURL(imageRef)
                                                            .then(async (url) => {
                                                                holdImages.push(url);
                                                            })
                                                    });
                                                } else if (i == postImages.length) {
                                                    publishTweet(holdImages);
                                                }
                                            }
                                        } else {
                                            publishTweet([]);
                                        }

                                        await setDoc(doc(db, "tweets_counter", "home_count"), {
                                            counter: tweetsCounter.data().counter + 1
                                        });

                                        handleTweet("");
                                        handlePostImages([]);
                                        handleImgInpAccess(1);
                                        handleImgInpPointer("auto");
                                        handleImgInpDisability(false);
                                        document.getElementById("post-imgs").innerHTML = "";
                                        document.getElementsByTagName("textarea")[0].style.height = "47px";
                                        setShowLoader(true);
                                        toast.success("Your tweet has been published.");
                                    }
                                } disabled={isDisbaled} style={{ opacity: btnAccess }}>Tweet</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="all-tweets posts">
                {
                    fetchedTweets.map((tweet, index) => {
                        let likedData = [];
                        let userObj = fetchedUsers.find(obj => obj.uid == tweet.uid);
                        return (
                            <div key={index}>
                                <div className="post-data">
                                    <div>
                                        <img src={userObj.avatar} />
                                    </div>

                                    <div>
                                        <div className='tweet-meta'>
                                            <div>
                                                <h6>{userObj.username}</h6>
                                                <p>{"@" + userObj.email.slice(0, userObj.email.indexOf("@"))}</p>
                                                <span>.</span>

                                                {(() => {
                                                    let dt = new Date();
                                                    let date = (months[dt.getMonth()]) + " " + dt.getDate() + ", " + dt.getFullYear();
                                                    if (tweet.tweet_date == date) {
                                                        return (<p>{tweet.tweet_time}</p>)
                                                    } else if (tweet.tweet_date.slice(tweet.tweet_date.indexOf(",") + 2) == dt.getFullYear()) {
                                                        return (<p>{tweet.tweet_date.slice(0, tweet.tweet_date.indexOf(","))}</p>)
                                                    } else {
                                                        return (<p>{tweet.tweet_date}</p>)
                                                    }
                                                })()}
                                            </div>
                                            <div>
                                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="MoreHorizIcon"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                            </div>
                                        </div>

                                        <div className="text">
                                            <p>{tweet.tweet_text}</p>
                                        </div>

                                        {displayImages(tweet.posts_images)}

                                        {fetchedReactions.map((reaction) => {
                                            if (tweet.tweet_id == reaction.tweet_id && reaction[state.authUser.uid] == "liked") {
                                                likedData.push(true);
                                            } else {
                                                likedData.push(false);
                                            }
                                        })}
                                        {decider(likedData, tweet.tweet_id)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <>
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

                <div id="lightbox">
                    <div>
                        <div className="close" onClick={() => {
                            document.getElementById("lightbox").style.animationName = "slideback";
                            handleImagesStack([]);
                            handleSlideNavPrev({ visibility: "hidden" });
                            handleSlideNavNext({ visibility: "hidden" });
                        }}>
                            <CloseIcon />
                        </div>

                        <div style={slideNavPrev} onClick={async () => {
                            if (Number(currentImage) - 1 == 0) {
                                handleSlideNavPrev({ visibility: "hidden", pointerEvents: "none" });
                                handleSlideNavNext({ visibility: "visible", pointerEvents: "auto" });
                            } else {
                                handleSlideNavNext({ visibility: "visible", pointerEvents: "auto" });
                            }
                            var modalImg = document.getElementById("modal-img");
                            modalImg.style.animationName = "prevright";
                            await setTimeout(() => {
                                modalImg.style.animationName = "prevleft";
                                modalImg.src = imagesStack[Number(currentImage) - 1];
                                handleCurrentImage(Number(currentImage) - 1);
                            }, 250);
                        }}>
                            <ArrowBackIosNewIcon />
                        </div>

                        <img id="modal-img" />

                        <div style={slideNavNext} onClick={async () => {
                            if (Number(currentImage) + 1 == imagesStack.length - 1) {
                                handleSlideNavNext({ visibility: "hidden", pointerEvents: "none" });
                                handleSlideNavPrev({ visibility: "visible", pointerEvents: "auto" });
                            } else {
                                handleSlideNavPrev({ visibility: "visible", pointerEvents: "auto" });
                            }
                            var modalImg = document.getElementById("modal-img");
                            modalImg.style.animationName = "nextleft";
                            await setTimeout(() => {
                                modalImg.style.animationName = "nextright";
                                modalImg.src = imagesStack[Number(currentImage) + 1];
                                handleCurrentImage(Number(currentImage) + 1);
                            }, 250);
                        }}>
                            <ArrowForwardIosIcon />
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

export default Feeds;