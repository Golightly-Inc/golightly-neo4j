declare global {
  interface UserConnectData {
    users: {
      user_one: {
        golightly_uuid: string
      },
      user_two: {
        golightly_uuid: string
      }
    }
  }

  type Neo4jResponseObjType = {
    golightly_uuid: string
  }

  type Neo4jResponseMessageType = {
    message: string
  }
}

export class Neo4j {
  baseUrl: string;
  establishConnectionUrl: string;
  establishReferralUrl: string;
  fetchFunc: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)

  constructor(baseUrl?: string, fetchFunc?: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)) {
    this.baseUrl = baseUrl || 'https://golightly-neo4j-api.herokuapp.com';
    this.establishConnectionUrl = `${this.baseUrl}/users/establish_connection`;
    this.establishReferralUrl = `${this.baseUrl}/users/establish_referral`;
    this.fetchFunc = fetchFunc || fetch
  }  

  async createConnectionEdges(usersParams: UserConnectData) {
    return await createConnectionOrReferral(this.establishConnectionUrl, usersParams, this.fetchFunc)
  }

  async createReferralEdges(usersParams: UserConnectData) {
    return await createConnectionOrReferral(this.establishReferralUrl, usersParams, this.fetchFunc)
  }

  async retrieveMutualConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No mutual connections exist for these users' };
    }
    const URL = `${this.baseUrl}/mutual_connections?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    return await getNeo4jNodes(URL, this.fetchFunc);
  }

  async retrieveShortestPathConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No connections exist for these users' };
    }
    const URL = `${this.baseUrl}/shortest_path?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    return await getNeo4jNodes(URL, this.fetchFunc);
  }
}

async function createConnectionOrReferral(url: string, usersParams: UserConnectData, fetchFunc: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)) {
  let result: number | undefined;
  try {
    const resp = await fetchFunc(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersParams),
    });
    const { status } = resp;
    result  = status;
  } catch (error) {
    // Log error here
  }
  return result;
}

async function getNeo4jNodes(url: string, fetchFunc: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)) {
  let result: Neo4jResponseObjType[] | Neo4jResponseMessageType;
  try {
    const resp = await fetchFunc(url);
    result = await resp.json();
  } catch (error) {
    // Log error here
    const { message } = error;
    result = { message };
  }
  return result;
}
