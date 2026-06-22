# Exam #N: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`
  - Home page of the application.
  - Displays the game description, instructions, and navigation menu.

- Route `/map`
  - Displays the metro network map.
  - Shows all stations and metro lines (M1, M2, M3, M4) to help players memorize the network before starting a game.

- Route `/play`
  - Main game page.
  - Displays a random starting station and destination station.
  - Allows players to select stations to build a route before the timer expires.
  - Shows game information such as remaining time, coins, and selected route.

- Route `/ranking`
  - Displays the leaderboard.
  - Shows players ordered by their best score.

- Route `/login`
  - Authentication page.
  - Allows users to log in using their username and password.

## API Server

## API Server

- POST `/api/sessions`
  - request parameters { "usernme"  , "password"}
  - request body: `{ "username": "Anthony", "password": "password" }`
  - response body: authenticated user object `{ "id": 1, "username": "Anthony" }`

- GET `/api/sessions/current`
  - request parameters: none
  - response body: current authenticated user object

- DELETE `/api/sessions/current`
  - request parameters: none
  - response body: logout confirmation

- GET `/api/network`
  - request parameters: none
  - response body: list of stations, lines, and segments
  - protected: yes

- GET `/api/events`
  - request parameters: none
  - response body: list of possible game events
  - protected: yes

- GET `/api/ranking`
  - request parameters: none
  - response body: best score for each registered user

- POST `/api/games/start`
  - request parameters: none
  - response body: created game with id, start station, and destination station
  - protected: yes

- POST `/api/games/:id/submit`
  - request parameter: `id` = game id
  - request body: `{ "route": [9, 10, 11, 12] }`
  - response body: route validity, final score, and execution steps
  - protected: yes

## Database Tables

- Table users - contains registered users, usernames, password hashes and salts.
- Table stations - contains all metro stations available in the game.
- Table lines - contains metro lines and their associated colors.
- Table segments - contains the connections between stations and the metro line to which each connection belongs.
- Table events - contains random game events and their corresponding score effects.
- Table games - contains all games played by users, including the owner, start station, destination station, status, score, and timestamps.

## Main React Components

- `App` (in `App.jsx`)
  - Main application component.
  - Handles user authentication, page navigation, and rendering of the different application views (Home, Map, Play, Ranking).

- `LoginForm` (in `LoginForm.jsx`)
  - Provides the user authentication interface.
  - Collects username and password and performs login requests.

- `GamePage` (in `GamePage.jsx`)
  - Implements the main gameplay logic.
  - Starts new games, manages the timer, handles station selection, route submission, and displays game results.

- `MetroMap` (in `MetroMap.jsx`)
  - Interactive metro map used during gameplay.
  - Displays stations and allows players to build a route by selecting stations.

- `NetworkView` (in `NetworkView.jsx`)
  - Displays the complete metro network.
  - Shows all stations and metro lines to help players memorize the network before playing.

- `NetworkMap` (in `NetworkMap.jsx`)
  - Visual representation of the metro network.
  - Displays stations and colored metro lines corresponding to the different routes.

- `RankingPage` (in `RankingPage.jsx`)
  - Displays the leaderboard.
  - Retrieves and shows players ordered by their best scores.
## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

  - User: Anthony  , password: password.
  - User: Maria  , password: password.
  - User: Luca  , password: password. 

## Use of AI Tools
AI assistance "ChatGpt" was used for clarification on some concepts related to authentication, session management, cookies, and secure user-game association. The tool helped clarify how to prevent unauthorized users from accessing or modifying games belonging to other users. The final implementation and integration were completed by me with some help by the LLM. 

Additionaly, assistance from "CHATGPT" was also used to assist with frontend visual design and user interface improvements, including selecting colors, styling components, enhancing page layouts, and refining the overall look and feel of the application. 

