import { useEffect, useState } from 'react'
import './App.css'
import SpotifyController from './SpotifyController';


const AUTHORIZE = "https://accounts.spotify.com/authorize";

const redirect_uri = window.location.origin;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientId, setClientId] = useState("");
  const [controller, setController] = useState<SpotifyController | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<[string, string, string]> | null>(null)
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [devices, setDevices] = useState<Array<any> | null>([]);
  const [currentSong, setCurrentSong] = useState<{ name: string, uri: string, imageUrl: string, artists: Array<string> } | null>(null);
  const getCode = () => {
    // this function get the auth code from url bar
    let queryString = window.location.search;
    if (queryString.length > 0) {
      // if there is query string
      let urlParams = new URLSearchParams(queryString);
      let code = urlParams.get('code');
      if (code && redirect_uri) {
        setController(new SpotifyController(code, redirect_uri, checkLoginState));
      }
      window.history.pushState("", "", window.location.origin); // remove query string
    } else {
      setController(new SpotifyController("", redirect_uri, checkLoginState)); // initialize without auth code
    }
  }
  const checkLoginState = (err?: any) => {
    if (err) {
      setIsLoggedIn(false);
      console.error(err);
    } else {
      setIsLoggedIn(true);
    }
  }
  const fetchClientId = async () => {
    try {
      const response = await fetch('/clientid');
      if (response.ok) {
        response.json()
          .then(
            (data) => {
              setClientId(data.client_id);
            }
          );

      } else {
        console.error('Failed to fetch client ID');
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogin = () => {
    let url = AUTHORIZE;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // redirect user to Spotify login page
  };

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
    console.log(results);
    if (err) {
      console.error(err)
    }
  }
  console.log(selectedResult);
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

  useEffect(() => {
    // this block executes once
    getCode();
    if (clientId == "") {
      fetchClientId();
    }
  }, [])
  let itv: any;
  useEffect(() => {
    if (controller) {
      clearInterval(itv);
      itv = setInterval(
        () => {
          checkDevices();
          checkCurrentSong();
        }, 1000);
    }
    else {
      clearInterval(itv);
    }
    return () => {
      clearInterval(itv);
    };
  }
    , [controller]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  return (
    <>
      <section id="left-aside">
        {
          !isLoggedIn ?
            <button onClick={handleLogin}>
              Login with Spotify
            </button>
            :
            <button onClick={handleLogout}>
              Logout
            </button>
        }
        <select>
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
                onClick={() => setSelectedResult(uri)}
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
          <button onClick={controller?.resume}>
            <span role="img" aria-label="Resume">&#9658;</span>
          </button>
          <button onClick={controller?.pause}>
            <span role="img" aria-label="Pause">&#10074;&#10074;</span>
          </button>
          <button onClick={controller?.next}>
            <span role="img" aria-label="Next">&#9654;&#9654;</span>
          </button>
          <button onClick={controller?.previous}>
            <span role="img" aria-label="Previous">&#9664;&#9664;</span>
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
    </>
  );

}

export default App
