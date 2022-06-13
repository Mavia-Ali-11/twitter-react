import React from 'react';
import Sidebar from "../components/sidebar";
import Widgets from "../components/widgets";
import Feeds from "../components/feeds";

function MyTweets() {
    return (
        <div className="mainParent">
                <Sidebar scrIndex="1" scrName="My tweets" />
            <div>
                <Feeds scrName="My tweets" />
                <Widgets scrName="My tweets" />
            </div>
        </div>
    )
}

export default MyTweets;