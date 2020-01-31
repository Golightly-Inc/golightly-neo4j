declare global {
  interface userConnectData {
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

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'https://golightly-neo4j-api.herokuapp.com';
    this.establishConnectionUrl = `${this.baseUrl}/users/establish_connection`;
    this.establishReferralUrl = `${this.baseUrl}/users/establish_referral`;
  }  

  async createConnectionEdges(usersParams: userConnectData) {
    return await createConnectionOrReferral(this.establishConnectionUrl, usersParams)
  }

  async createReferralEdges(usersParams: userConnectData) {
    return await createConnectionOrReferral(this.establishReferralUrl, usersParams)
  }

  async retrieveMutualConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No mutual connections exist for these users' };
    }
    const URL = `${this.baseUrl}/mutual_connections?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    return await getNeo4jNodes(URL);
  }

  async retrieveShortestPathConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No connections exist for these users' };
    }
    const URL = `${this.baseUrl}/shortest_path?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    return await getNeo4jNodes(URL);
  }
}

async function createConnectionOrReferral(url: string, usersParams: userConnectData) {
  let result: Number | undefined;
  try {
    const resp = await fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersParams),
      credentials: 'include'
    });
    const { status } = resp;
    result  = status;
  } catch (error) {
    //Log error here
  }
  return result;
}

async function getNeo4jNodes(url: string) {
  let result: Array<Neo4jResponseObjType> | Neo4jResponseMessageType;
  try {
    const resp = await fetch(url);
    result = await resp.json();
  } catch (error) {
    //Log error here
    const { message } = error;
    result = { message };
  }
  return result;
}
