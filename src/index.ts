declare global {

  interface NewUserData {
    user: {
      golightly_uuid: string
      referred_by: string
    }
  }

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

  type fetchFuncType = ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>);
}

export class Neo4j {
  fetchFunc: fetchFuncType;
  baseUrl: string;
  establishConnectionUrl: string;
  establishReferralUrl: string;
  createNewUserUrl: string;

  constructor(fetchFunc: fetchFuncType, baseUrl?: string) {
    this.fetchFunc = fetchFunc;
    this.baseUrl = baseUrl || 'https://golightly-neo4j-api.herokuapp.com';
    this.createNewUserUrl = `${this.baseUrl}/create_user`;
    this.establishConnectionUrl = `${this.baseUrl}/users/establish_connection`;
    this.establishReferralUrl = `${this.baseUrl}/users/establish_referral`;
  }

  async createNewUser(newUserParams: NewUserData) {
    return await postToNeo4jServer(this.createNewUserUrl, newUserParams, this.fetchFunc);
  }

  async createConnectionEdges(usersParams: UserConnectData) {
    return await postToNeo4jServer(this.establishConnectionUrl, usersParams, this.fetchFunc);
  }

  async createReferralEdges(usersParams: UserConnectData) {
    return await postToNeo4jServer(this.establishReferralUrl, usersParams, this.fetchFunc);
  }

  async retrieveMutualConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No mutual connections exist for these users' };
    }
    const URL = `${this.baseUrl}/mutual_connections?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    const resp = await getNeo4jNodes(URL, this.fetchFunc);
    if ((resp as Neo4jResponseObjType[]) && (resp as Neo4jResponseObjType[]).length >0) {
      return (resp as Neo4jResponseObjType[]).map(mc => mc.golightly_uuid);
    }
    return resp
  }

  async retrieveShortestPathConnections(uuidOne: string, uuidTwo: string) {
    if (uuidOne === uuidTwo) {
      return { message: 'No connections exist for these users' };
    }
    const URL = `${this.baseUrl}/shortest_path?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}`;
    const resp = await getNeo4jNodes(URL, this.fetchFunc);
    if ((resp as Neo4jResponseObjType[]) && (resp as Neo4jResponseObjType[]).length >0) {
      return (resp as Neo4jResponseObjType[]).map(c => c.golightly_uuid).filter(id => id !== uuidOne && id !== uuidTwo);
    }
    return resp
  }
}

async function postToNeo4jServer(url: string, params: NewUserData | UserConnectData, fetchFunc: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)) {
  let result: number | undefined;
  try {
    const resp = await fetchFunc(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
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
