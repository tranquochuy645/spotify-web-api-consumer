
// This srcipt serve the client-side app and authorization requests

import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app);

const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // this is only stored on the server
const client_id = process.env.SPOTIFY_CLIENT_ID;
const port = process.env.PORT || 3000;

// All the calls to Spotify web API will be made by the client side app directly
// except authorization requests and refresh token requests 
// because this require client secret key


const TOKEN = "https://accounts.spotify.com/api/token"; // spotify API token endpoint

app.get(
    '/auth',
    express.json(),
    (req, res) => {
        let code = req.headers.code;
        let redirect_uri = req.headers.redirect_uri;
        let body = "grant_type=authorization_code";
        body += "&code=" + code;
        body += "&redirect_uri=" + encodeURI(redirect_uri);
        body += "&client_id=" + client_id;
        body += "&client_secret=" + client_secret;
        fetch(
            // get access token and refresh token from Spotify API
            TOKEN,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
                },
                body: body
            }
        ).then(
            (response) => {
                if (response.ok) {
                    response.json().then(
                        (data) => {
                            console.log(data);
                            res.json(data);
                            // literally passing the response from Spotify API to the client
                        }
                    )
                } else {
                    response.json().then(
                        (data) => {
                            console.log(data);
                            res.status(400).json(data);
                            // literally passing the response from Spotify API to the client but with error status
                        }
                    )
                }
            }

        )
    }
)
app.get(
    '/refresh',
    express.json(),
    (req, res) => {
        let body = "grant_type=refresh_token";
        body += "&refresh_token=" + req.headers.refresh_token;
        body += "&client_id=" + client_id;
        fetch(TOKEN,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
                },
                body: body
            }
        ).then(
            (response) => {
                if (response.ok) {
                    response.json().then(
                        (data) => {
                            console.log(data);
                            res.json(data);
                            // literally passing the response from Spotify API to the client
                        }
                    )
                } else {
                    response.json().then(
                        (data) => {
                            console.log(data);
                            res.status(400).json(data);
                            // literally passing the response from Spotify API to the client but with error status
                        }
                    )
                }
            }
        )
    }
)

// Serve static assets (e.g., CSS, JavaScript)
app.use(express.static('dist'));

// Start the server
server.listen(port)
