import React, { useState, useEffect } from "react";

function Brainrot() {
    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const SEARCH_QUERY = "brainrot shorts";

    useEffect(() => {
        fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&videoDuration=short&q=${encodeURIComponent(
            SEARCH_QUERY
        )}&key=${API_KEY}`
        )
    }); 

    return(
        <><p>Brainrot component for people</p>
        <p>Short videos will go here later</p></>

    );
}

export default Brainrot;