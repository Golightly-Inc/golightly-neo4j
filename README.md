# golightly-neo4j

This is the offical javascript client for Golightly's Neo4j server. It's a lightweight API exposing a few handy methods 
for interacting with the golightly-neo4j-api app.

## Motivation
As of Q1 2020, Golightly currently has four applications in production:
1. golightly-react-js: app for main site
2. golightly_mobile: mobile app
3. golightly-backend-api: backend server for mobile app. Derived from golightly-react-js
4. golightly-neo4j-api: rails app for users' connections data

Apps 1-3 all communicate and interact with app 4. Thus, it became necessary for us to encapsulate all 
Neo4j data interaction methods in order to avoid bugs, issues, etc. that could arise from duplication and incorrect use of the HTTP methods provided by the Neo4j rails app. One standardized API can now be easily used across all applications without the risk of exposing underlying methods.

## Setup
1. Install the package
yarn add golightly-neo4j or npm install golightly-neo4j

2. Import the module in config.js for golightly-backend-api and golightly-react-js or index.js for golightly_mobile
import { Neo4j } from 'golightly-neo4j';

3. Initialize and export the client by passing in an instance of fetch and the NEO_4J_URL as stored in the .env file.
export const neo4jClient = new Neo4j(fetch, process.env.NEO_4J_URL);

## Usage
Five methods are publically exposed on any instance of Neo4j:

1. neo4jClient.createNewUser(newUserParams: NewUserData) : Promise<Response>): Promise<...>
This method takes an argument of the shape
user: {
  golightly_uuid: string
  referred_by: string
}
and makes a http post request to the /create_user endpoint of our Neo4j rails server.
