import React from 'react';
import Sidebar from "../components/sidebar";
import Widgets from "../components/widgets";
import Feeds from "../components/feeds";

function Home() {
    return (
        <div className="mainParent">
                <Sidebar scrIndex="0" scrName="Home" />
            <div>
                <Feeds scrName="Home" />
                <Widgets scrName="Home"  />
            </div>
        </div>
    )
}

export default Home;