Spotify Web API Integration
===========================

A full-stack React application that integrates with the Spotify Web API
to provide some of their commonly used features

Prerequisites
-------------

To run this project, you need to have the following:

-   Node.js installed on your machine.
-   A Premium Spotify account.


Installation
------------
The module SpotifyController_PKCE in src/SpotifyController_PKCE.ts can be reused as a standalone module which can handle the Authoriztion code with PKCE and some other itergration with Spotify API inside the client-side application  

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

Create a `.env` file in the project root directory and provide the
following configuration variables:

    SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
    SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
    PORT=YOUR_SERVER_PORT

Replace `YOUR_SPOTIFY_CLIENT_ID` and `YOUR_SPOTIFY_CLIENT_SECRET` with
your actual Spotify client ID and client secret obtained from your
Spotify Developer account. Replace `YOUR_SERVER_PORT` with the desired
port number for your local server (e.g., 3000).  

Replace the constant clientId in src/App.tsx with your client id or make a config file to import it from
![image](https://github.com/tranquochuy645/spotify-web-api-consumer/assets/119860259/62705616-9f77-4fd3-87bd-5b8df1576f6e)


Usage
-----

To build and run the application, execute the following command in the project
directory:

    npm b-start

Or just start:
    
    npm start
    

Authorization Methods
---------------------

This project provides two authorization methods: PKCE (Proof Key for
Code Exchange) and the traditional authorization flow:

-   PKCE Authorization Flow: This flow is designed for client-side
    applications and enhances security by using a code challenge and
    verifier. It mitigates the risks associated with storing client
    secrets on the client-side. Learn more about the [PKCE Authorization
    Flow](https://tools.ietf.org/html/rfc7636).
-   Traditional Authorization Flow: This flow is commonly used for
    server-side and native applications. It involves exchanging the
    authorization code for access and refresh tokens using the client
    secret. Refer to the [Spotify Web API Authorization
    Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)
    for more information.

### Result
![image](https://github.com/tranquochuy645/spotify-web-api-consumer/assets/119860259/22f9fec6-9fa4-44f4-b485-751fff9cd813)
