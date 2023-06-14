Spotify Web API Integration
===========================

A full-stack React application that integrates with the Spotify Web API
to provide various features such as authentication, song search,
playback control, and displaying the currently playing song.

Prerequisites
-------------

To run this project, you need to have the following:

-   Node.js installed on your machine.
-   A Premium Spotify account.

Installation
------------

1.  Clone the repository:

```{=html}
<!-- -->
```
    git clone https://github.com/tranquochuy645/spotify-web-api-consumer

2.  Navigate to the project directory:

```{=html}
<!-- -->
```
    cd spotify-web-api-consumer

3.  Install the dependencies:

```{=html}
<!-- -->
```
    npm install

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

Usage
-----

To run the application, execute the following command in the project
directory:

    npm start

Authorization Methods
---------------------

This project provides two authorization methods: PKCE (Proof Key for
Code Exchange) and the traditional authorization flow. Here\'s a brief
overview of their differences:

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

Refer to the project documentation for more detailed information on
implementing these authorization methods.
