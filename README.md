# golightly-neo4j

This is the offical javascript client for Golightly's Neo4j server. It is lightweight API exposing a few handy methods 
for interacting with the golightly-neo4j-api app.

## Motivation
As of Q1 2020, Golightly currently has four applications in production:
1. golightly-react-js: app for main site
2. golightly_mobile: mobile app
3. golightly-backend-api: backend server for mobile app. Derived from golightly-react-js
4. golightly-neo4j-api: rails app for user connections data

Apps 1-3 all communicate and interact with app 4. Thus, it became necessary for us to abstract and isolate all 
Neo4j data interaction methods in order to avoid bugs, issues, etc. when dealing with connections.
