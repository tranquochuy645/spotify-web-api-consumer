Spotify Web API Integration
===========================

A pure client-side React application that integrates with the Spotify Web API
to provide a range of popular functionalities.  

This app use Authorization code PKCE flow which is designed for client-side applications and enhances security by using a code challenge and verifier. It mitigates the risks associated with storing client secrets on the client-side. Learn more about the [Spotify PKCE Authorization Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow).  
    
Prerequisites
-------------

To run this project, you need to have a premium Spotify account.


Installation
------------
The module ["SpotifyController_PKCE"](https://github.com/tranquochuy645/spotify-web-api-consumer/blob/main/src/lib/spotifyController/index.ts) in "src/lib/spotifyController/index.ts" can be reused as a standalone module, which can handle Authorization code PKCE and some other itergration with Spotify API inside a client-side application.  

Or you can install the full project following these instructions below

1.  Clone the repository:

```
    git clone https://github.com/tranquochuy645/spotify-web-api-consumer
```

2.  Navigate to the project directory:


```
    cd spotify-web-api-consumer
```
3.  Install the dependencies:



```
    npm install
```

Spotify Developer Account Setup
-------------------------------

Before running the application, you need to set up your Spotify
Developer account and obtain your client ID and client secret. Follow
their instructions: [Spotify Web API
Documentation](https://developer.spotify.com/documentation/web-api).

Configuration
-------------

Create a `config.ts` file in the `src` directory and export your
client id:  

![image](https://github.com/tranquochuy645/spotify-web-api-consumer/assets/119860259/0e839356-1478-43ae-9b8b-b33242e9d24e)  

Replace the string with your actual Spotify client ID obtained from your Spotify Developer account.  

Usage
-----

Run the project in dev mode:

    npm run dev

Result
-----
![image](https://github.com/tranquochuy645/spotify-web-api-consumer/assets/119860259/4fb4b9ff-c703-45b8-91eb-36366b045472)

