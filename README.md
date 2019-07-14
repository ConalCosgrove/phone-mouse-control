# Phone Mouse Controller

Web server that allows control of computer's mouse from a phone on the same wifi network.

## Setup

- Clone this repo
- Run ```npm install```
- Then ```npm start```
- On a phone connected to the same wifi network, visit the address printed out on the console.

## The Tech

- [ExpressJS server](https://expressjs.com/) to serve the web page
- [SocketIO](https://socket.io/) to send movement data from phone to computer
