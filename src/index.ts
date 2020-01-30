export class Neo4j {
    url:string;

    constructor(url?: string){
        this.url = url || 'https://golightly-neo4j-api.herokuapp.com';
    }
}
