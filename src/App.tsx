import { useEffect, useState } from 'react'
import PlaybackSDK from './PlaybackSDK';
import SpotifyController from './SpotifyController';
import SpotifyController_PKCE from './SpotifyController_PKCE';
import clientId from './clientId';
// import your client id or declare it right here
// const clientId = "abcdefghijklmnopqrstuvwxyz";

const AUTHORIZE = "https://accounts.spotify.com/authorize";

const redirect_uri = window.location.origin;

function App() {

  // An alternative is Authorization code PKCE flow which doesn't require client secret can be implemented without a server
  // Their documentation: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

  // traditional Authorization code flow  ( require a server, example code in server.js) //
  const handleLogin = () => {
    let url = AUTHORIZE;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // redirect user to Spotify login page
  };
  // traditional Authorization code flow //

  // Authorization code PKCE flow //
  const generateRandomString = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  const generateCodeChallenge = async (codeVerifier: string) => {
    function base64encode(string: any) {
      const unint8array = new Uint8Array(string);
      const numberArray = [...unint8array]
      return btoa(String.fromCharCode.apply(null, numberArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
  }
  const handleLoginPKCE = () => {
    let codeVerifier = generateRandomString(128);
    sessionStorage.setItem('code_verifier', codeVerifier);
    generateCodeChallenge(codeVerifier).then(
      codeChallenge => {
        let url = AUTHORIZE;
        url += "?client_id=" + clientId;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
        url += "&code_challenge_method=S256";
        url += "&code_challenge=" + codeChallenge;
        window.location.href = url; // redirect user to Spotify login page
      }
    )

  }
  // Authorization code PKCE flow //


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [controller, setController] = useState<SpotifyController | SpotifyController_PKCE | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<[string, string, string]> | null>(null)
  const [devices, setDevices] = useState<Array<any> | null>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<{ name: string, uri: string, imageUrl: string, artists: Array<string> } | null>(null);


  const getCode = () => {
    // this function get the auth code from url bar
    let queryString = window.location.search;
    const code_verifier = sessionStorage.getItem("code_verifier") || "";
    let code = "";
    if (queryString.length > 0) {
      // if there is query string
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code') || "";
      window.history.pushState("", "", window.location.origin); // remove query string
    }
    if (code_verifier) {
      setController(
        new SpotifyController_PKCE
          (
            code,
            redirect_uri,
            clientId,
            code_verifier,
            checkLoginState
          )
      );
    } else {
      setController(new SpotifyController(code, redirect_uri, checkLoginState));
    }
  }
  const checkLoginState = (err: Error | undefined) => {
    if (err) {
      setController(null);
      setIsLoggedIn(false);
      sessionStorage.clear();
      console.error(err);
    } else {
      setIsLoggedIn(true);
    }
  }

  // Event handlers
  const handleLogout = () => {
    sessionStorage.clear(); // clear session storage
    setController(null); // free up controller instance for garbage collector
    setIsLoggedIn(false);
  }

  const handleSearch = () => {
    // Handle the search functionality here
    if (controller && searchQuery) {
      controller.search(searchQuery, handleSearchResults)
    }
  }
  const handleSearchResults = (results: Array<[string, string, string]> | null, err?: any) => {
    setSearchResults(results)
    if (err) {
      console.error(err)
    }
  }

  const checkDevices = () => {
    controller?.getDevices(
      (devices: Array<any> | null, err?: any) => {
        setDevices(devices);
        if (err) {
          console.error(err);
        }
      });
  }
  const checkCurrentSong = () => {
    controller?.getCurrentSong(
      (song: { name: string, uri: string, imageUrl: string, artists: Array<string> } | null, err?: any) => {
        setCurrentSong(song);
        if (err) {
          console.error(err);
        }
      }
    )
  }


  let itv: number;
  useEffect(() => {
    if (isLoggedIn&&controller) {
      clearInterval(itv);
      itv = setInterval(
        () => {
          checkDevices();
          checkCurrentSong();
        }, 3000);
    }
    else {
      clearInterval(itv);
    }
    return () => {
      clearInterval(itv);
    };
  }
    , [isLoggedIn]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);



  useEffect(() => {
    // this block executes once
    getCode();
  }, [])
  return (
    <>
      <section id="left-aside">
        {
          !isLoggedIn ?
            <>
              <button onClick={handleLogin}>
                Login
              </button>
              <button onClick={handleLoginPKCE}>
                Login PKCE
              </button>
            </>
            :
            <button onClick={handleLogout}>
              Logout
            </button>
        }
        <select onChange={(e) => { setSelectedDevice(e.target.value) }}>
          <option value="" disabled selected>Select a device</option>
          {devices?.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </section>
      <section id="search-container">
        <div id="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
        </div>
        {searchResults && (
          <ul >
            {searchResults.map(([name, uri, imageUrl]) => (
              <li
                className="search-result-li"
                key={uri}
                value={uri}
                onClick={() => controller?.play(uri, selectedDevice)}
              > <img className='search-result-img'
                src={imageUrl} />
                <span>&nbsp;&nbsp;{name}</span>

              </li>
            ))}
          </ul>
        )}
      </section>
      <section id='playback-controller'>
        <div id="playback-btn-container">
          <button onClick={() => controller?.resume(selectedDevice)}>
            <span role="img" aria-label="Resume">&#9658;</span>
          </button>
          <button onClick={() => controller?.pause(selectedDevice)}>
            <span role="img" aria-label="Pause">&#10074;&#10074;</span>
          </button>
          <button onClick={() => controller?.next(selectedDevice)}>
            <span role="img" aria-label="Next">&#9664;&#9664;</span>
          </button>
          <button onClick={() => controller?.previous(selectedDevice)}>
            <span role="img" aria-label="Previous">&#9654;&#9654;</span>
          </button>
        </div>
        {currentSong && (
          <div id="current-song">
            <h3>{currentSong.name} <br />
              {currentSong.artists}</h3>
            <img src={currentSong.imageUrl} alt="Album Cover" />
          </div>
        )}
      </section>
      {controller&&isLoggedIn ? <PlaybackSDK /> : null}
    </>
  );

}

export default App
