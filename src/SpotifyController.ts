export default class SpotifyController {

  // Spotify API endpoints
  private static readonly DEVICES: string = "https://api.spotify.com/v1/me/player/devices";
  private static readonly PLAY: string = "https://api.spotify.com/v1/me/player/play";
  private static readonly PAUSE: string = "https://api.spotify.com/v1/me/player/pause";
  private static readonly NEXT: string = "https://api.spotify.com/v1/me/player/next";
  private static readonly PREVIOUS: string = "https://api.spotify.com/v1/me/player/previous";
  private static readonly CURRENTLYPLAYING: string = "https://api.spotify.com/v1/me/player/currently-playing";
  private static readonly SEARCH: string = "https://api.spotify.com/v1/search";
  // some other endpoints I haven't used yet
  // private static readonly PLAYLISTS: string = "https://api.spotify.com/v1/me/playlists";
  // private static readonly PLAYER: string = "https://api.spotify.com/v1/me/player";
  // private static readonly TRACKS: string = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
  // private static readonly SHUFFLE: string = "https://api.spotify.com/v1/me/player/shuffle";    
  // private static readonly TOKEN = "https://accounts.spotify.com/api/token";

  private access_token: string;
  private refresh_token: string;
  private expire_time: number;
  private refreshTimeout: number | undefined;
  public auth_code: string;
  public redirect_uri: string;

  constructor(
    auth_code: string,
    redirect_uri: string,
    callback?: (err?: any) => void,
  ) {
    this.auth_code = auth_code;
    this.redirect_uri = redirect_uri;
    this.expire_time = 3600; // default expiration time of spotify api
    this.refreshTimeout = undefined;

    //try to get from sessionStorage
    this.access_token = sessionStorage.getItem("access_token") || "";
    this.refresh_token = sessionStorage.getItem("refresh_token") || "";
    if (this.redirect_uri) {
      if (this.auth_code) {
        this.requestAuthorization() // authorize with given athCode
          .then(
            (err: any) => {
              if (callback) {
                if (err) {
                  callback(err);
                } else {
                  callback();
                }
              }
            }
          )
      } else {
        //if no auth_code provided, try to use tokens from session storage
        if (this.access_token && this.refresh_token) {
          this.refreshAccessToken()
            // try refresh token to make sure it's not expired and renew the timer 
            .then(
              (err: any) => {
                if (callback) {
                  if (err) {
                    callback(new Error(err));
                  } else {
                    callback();
                  }
                }
              }
            )
        } else {
          if (callback) {
            callback(new Error("No auth code provided && No token in sessionStorage"));
          }
        }
      }
    }
  }

  private requestAuthorization: () => Promise<Error | undefined> = async () => {
    // this mode requires the server running to serve /auth endpoint
    const response = await fetch('/auth', {
      headers: {
        "code": this.auth_code,
        "redirect_uri": this.redirect_uri
      }
    });

    if (response.ok) {
      const data = await response.json();
      this.access_token = data.access_token ? data.access_token : this.access_token;
      this.refresh_token = data.refresh_token ? data.refresh_token : this.refresh_token;
      this.expire_time = data.expires_in ? data.expires_in : this.expire_time;
      sessionStorage.setItem("access_token", this.access_token);
      sessionStorage.setItem("refresh_token", this.refresh_token);

      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = setTimeout(() => {
        this.refreshAccessToken();
      }, this.expire_time * 1000);
    } else {
      return new Error('Authorization request failed');
    }
  }


  private refreshAccessToken: () => Promise<Error | undefined> = async () => {
    const response = await fetch('/refresh', {
      headers: {
        "refresh_token": this.refresh_token
      }
    });
    if (response.ok) {
      const data = await response.json();
      this.access_token = data.access_token ? data.access_token : this.access_token;
      this.refresh_token = data.refresh_token ? data.refresh_token : this.refresh_token;
      this.expire_time = data.expires_in ? data.expires_in : this.expire_time;
      sessionStorage.setItem("access_token", this.access_token);
      sessionStorage.setItem("refresh_token", this.refresh_token);
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = setTimeout(() => {
        this.refreshAccessToken();
      }, this.expire_time * 1000);
    } else {
      return new Error("Refresh request failed");
    }
  }

  private callSpotifyApi(
    method: string,
    url: string,
    body: string,
    responseHandler?: (res: any) => void
  ) {
    fetch(
      url,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.access_token
        },
        ...(body != '' && { body })
      }
    )
      .then(
        response => {
          if (response.status == 401) {
            //token expired, try refresh token once
            this.refreshAccessToken();
          }
          if (responseHandler) {
            responseHandler(response); // pass the response to handler
          }
        }
      )
  }
  public getDevices = (callback: (devices: Array<any>, err?: any) => void) => {
    if (this.access_token) {
      const method = 'GET';
      this.callSpotifyApi(method, SpotifyController.DEVICES, '', (response) => {
        if (response.ok) {
          response.json()
            .then((data: any) => {
              const devices = data.devices.map((device: any) => ({
                id: device.id,
                name: device.name,
                type: device.type,
              }));
              callback(devices);
            })
            .catch((error: Error) => {
              callback([], error);
            });
        } else {
          callback([{}], new Error('Failed to get devices'));
        }
      });
    } else {
      callback([{}], new Error('Access token not available'));
    }
  };

  public play = (uri: string, deviceId?: string | null) => {
    if (this.access_token) {
      let url = SpotifyController.PLAY;
      if (deviceId) {
        url += "?device_id=" + deviceId;
      }
      const method = 'PUT';
      const body = { uris: [uri] };
      this.callSpotifyApi(method, url, JSON.stringify(body));
    } else {
      console.error('Access token not available');
    }
  }
  public resume = (deviceId?: string | null) => {
    if (this.access_token) {
      let url = SpotifyController.PLAY;
      if (deviceId) {
        url += "?device_id=" + deviceId;
      }
      const method = 'PUT';
      this.callSpotifyApi(method, url, '');
    } else {
      console.error('Access token not available');
    }
  }
  public pause = (deviceId?: string | null) => {
    if (this.access_token) {
      let url = SpotifyController.PAUSE;
      if (deviceId) {
        url += "?device_id=" + deviceId;
      }
      const method = 'PUT';
      this.callSpotifyApi(method, url, '');
    } else {
      console.error('Access token not available');
    }
  }
  public next = (deviceId?: string | null) => {
    if (this.access_token) {
      let url = SpotifyController.NEXT;
      if (deviceId) {
        url += "?device_id=" + deviceId;
      }
      const method = 'POST';
      this.callSpotifyApi(method, url, '');
    } else {
      console.error('Access token not available');
    }
  }

  public previous = (deviceId?: string | null) => {
    if (this.access_token) {
      let url = SpotifyController.PREVIOUS;
      if (deviceId) {
        url += "?device_id=" + deviceId;
      }
      const method = 'POST';
      this.callSpotifyApi(method, url, '');
    } else {
      console.error('Access token not available');
    }
  }
  public search = (
    // this only search for tracks
    searchQuery: string,
    callback: (results: Array<[string, string, string]>, err?: any) => void
  ) => {
    if (this.access_token) {
      const url = `${SpotifyController.SEARCH}?q=${searchQuery}&type=track&limit=50`;
      const method = 'GET';

      this.callSpotifyApi(method, url, '', (response) => {
        if (response.ok) {
          response.json()
            .then((data: any) => {
              const tracks = data.tracks.items.map((item: any) => [item.name, item.uri, item.album.images[0].url]);
              callback(tracks);
            })
            .catch((error: Error) => {
              callback([], error);
            });
        } else {
          callback([], new Error('Search request failed'));
        }
      });
    } else {
      callback([], new Error('Access token not available'));
    }
  };

  public getCurrentSong = (callback: (song: { name: string, uri: string, imageUrl: string, artists: Array<string> } | null, err?: any) => void) => {
    if (this.access_token) {
      const method = "GET";
      this.callSpotifyApi(method, SpotifyController.CURRENTLYPLAYING, "", (response) => {
        if (response.ok) {
          response.json()
            .then((data: any) => {
              if (data.item) {
                const artists = data.item.artists.map((artist: any) => artist.name);
                //get artists's name
                const song = {
                  name: data.item.name,
                  uri: data.item.uri,
                  imageUrl: data.item.album?.images[0]?.url,
                  artists: artists
                };
                callback(song);
              } else {
                callback(null);
              }
            })
            .catch((error: Error) => {
              callback(null, error);
            });
        } else {
          callback(null, new Error("Failed to get currently playing song"));
        }
      });
    } else {
      callback(null, new Error("Access token not available"));
    }
  };

}
