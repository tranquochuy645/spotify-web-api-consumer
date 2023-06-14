# Spotify Web API Integration

 This project demonstrates how to integrate the Spotify Web API into a React application.  


## Prerequisites

To run this project, you need to have the following:  
Node.js installed on your machine.  
A Premium Spotify account.  

## Installation
###    Clone the repository:

```shell

git clone https://github.com/tranquochuy645/spotify-web-api-consumer

```

###   Navigate to the project directory:

```shell

cd spotify-web-api-consumer

```
###   Install the dependencies:

```shell

npm install

```

## Spotify Developer Account Setup

Before running the application, you need to set up your Spotify Developer account and obtain your client ID and client secret.  
Follow their instructions:  https://developer.spotify.com/documentation/web-api  

## Usage
To run the application, execute the following command in the project directory:  

```shell

npm start

```

## Authorization Methods

This project provides two authorization methods: PKCE (Proof Key for Code Exchange) and the traditional authorization flow. Here's a brief overview of their differences:  

    PKCE Authorization Flow: This flow is designed for client-side applications and enhances security by using a code challenge and verifier.
    Traditional Authorization Flow: This flow is commonly used for server-side and native applications and relies on a client secret for token exchange.

Refer to the project documentation for more detailed information on implementing these authorization methods.  