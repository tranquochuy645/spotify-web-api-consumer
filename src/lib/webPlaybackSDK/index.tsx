import { useEffect, useState } from 'react'
function PlaybackSDK() {
    const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
    useEffect(
        () => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK',
                    getOAuthToken: cb => { cb(token); },
                    volume: 1
                });
                setPlayer(player);
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                });
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });
                player.connect();

            };
        }
        return () => {
            // Disconnect the player when the component unmounts
            player?.disconnect();
        };
    }, []);
    return(
        <div></div>
    )
}
export default PlaybackSDK