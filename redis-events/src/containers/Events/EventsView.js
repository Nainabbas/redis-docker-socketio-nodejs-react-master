import React, {useState, useEffect} from "react";
import {socket} from '../../config'
import Events from "../../components/Events/events";
import searchIcon from "../../assets/images/searchIcon.svg";
import "./EventsView.css";


let events = [];
const EventsView = () => {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loadEvents, setLoadEvents] = useState(true);

    useEffect(() => {
        getEvents()
        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        // eslint-disable-next-line
    }, []);


    const getEvents = () => {
        socket.on("FromAPI", (data) => {
            data = JSON.parse(data);
            let newData = events;
            newData.unshift(data);
            events = [...newData];
            if (searchKeyword) {
                if ((data.type.toLowerCase().indexOf(searchKeyword) !== -1 || (data.event && data.event.toLowerCase().indexOf(searchKeyword) !== -1))) {
                    setFilteredEvents([...newData]);
                }
            } else {
                setFilteredEvents([...newData]);
            }
        });
    }
    const liveEvents = () => {
        setLoadEvents(true);
        socket.connect();
    };

    const pauseEvents = () => {
        setLoadEvents(false)
        socket.disconnect();
    };

    const searchEventHandler = (keyword) => {
        keyword = keyword.toLowerCase();
        setSearchKeyword(keyword)
        let filterEvents = filterByEventOrType(keyword);
        setFilteredEvents([...filterEvents])
    };


    const filterByEventOrType = (keyword) => {
        return events.filter(each => each.type.toLowerCase().indexOf(keyword) !== -1 || (each.event && each.event.toLowerCase().indexOf(keyword) !== -1))
    }

    return (
        <div className="wrapper">
            {/* LOAD OR STOP THE EVENTS */}
            <div className="header">
                <div className="flex">
                    <div className="flex w-10">
                        <button className={loadEvents ? "active" : "Inactive"} id="headerButtonInactive"
                                onClick={liveEvents}>Live
                        </button>
                        <button className={!loadEvents ? "active" : "Inactive"} id="headerButtonActive"
                                onClick={pauseEvents}>Pause
                        </button>
                    </div>
                    <div id="searchDiv" className="w-86">
                        <img id="searchIcon" src={searchIcon} alt="Search icon"/>
                        <input type="text" defaultValue={searchKeyword ? searchKeyword : ""} onChange={(event) => {
                            searchEventHandler(event.target.value)
                        }} placeholder="Type to search"/>
                    </div>
                </div>
            </div>
            {filteredEvents && filteredEvents.length ? <Events events={filteredEvents}/> : <p>No events Found</p>}
        </div>
    );
};

export default EventsView;
