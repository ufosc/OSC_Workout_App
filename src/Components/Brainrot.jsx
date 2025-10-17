import React, { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const SEARCH_QUERY = "brainrot shorts";

// Backup Brainrot Shorts 
const backups = [
    "cCT3xvpsdBQ",
    "Ayy8vG9EMFY",
    "CwawqpDLidQ"
]


function Brainrot() {
    const[shortIDs, setShortIDs] = useState([]);

    useEffect(() => {
        setShortIDs([]);
        const fetchShorts = async () => {
            try {
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=7&type=video&videoDuration=short&q=${encodeURIComponent(
                    SEARCH_QUERY
                    )}&key=${API_KEY}`;
                const results = await fetch (url);
                
                // Waits for a result and stores the video IDs
                const searchResults = await results.json();
                const brainrotIDs = searchResults.items.map((item) => item.id.videoId);
                setShortIDs(brainrotIDs);
            }
            catch (error) {
                // Occurs if the API is unable to find shorts.
                console.error("Brainrot Acquisition Failed. Time to touch some grass!", error)
                setShortIDs(backups);
            }
        };
        fetchShorts();
    }, []); 

    return(
        <div>
            <h2>Brainrot</h2>
            {shortIDs.map((id) => (
                <iframe
                    width="500"
                    height="700"
                    src={`https://www.youtube.com/embed/${id}`}
                />
            ))}
        </div>

    );
}

export default Brainrot;