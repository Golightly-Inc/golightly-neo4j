import { FetchMock } from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

import { Neo4j } from '../src/index';

describe('Neo4j', () => {
  describe('Initialization', () => {
    describe('fetchFunc', () => {
      it('is assigned to function as defined by user', () => { 
        const expected: Neo4j = new Neo4j(fetchMock);

        expect(expected.fetchFunc).toEqual(fetchMock);
      })
    });
    describe('baseUrl instance variable', () => {
      it('is assigned to default url if empty initialization', () => {
        const expected: Neo4j = new Neo4j(fetchMock);
    
        expect(expected.baseUrl).toEqual('https://golightly-neo4j-api.herokuapp.com');
      });
      it('is assigned to url class is initilized with', () => {
        const expected: Neo4j = new Neo4j(fetchMock, 'https://example.com');
  
        expect(expected.baseUrl).toEqual('https://example.com');
      });
    });
    describe('createNewUserUrl instance variable', () => {
      it('is assigned to baseUrl/create_user', () => {
        const expected: Neo4j = new Neo4j(fetchMock);
    
        expect(expected.createNewUserUrl).toEqual(`${expected.baseUrl}/create_user`)
      });
    });
    describe('establishConnectionUrl instance variable', () => {
      it('is assigned to baseUrl/users/establish_connection', () => {
        const expected: Neo4j = new Neo4j(fetchMock);
    
        expect(expected.establishConnectionUrl).toEqual(`${expected.baseUrl}/users/establish_connection`)
      });
    });
    describe('establishReferralUrl', () => {
      it('is assigned to baseUrl/users/establish_referral', () => {
        const expected: Neo4j = new Neo4j(fetchMock, 'fooboo.com');
    
        expect(expected.establishReferralUrl).toEqual(`${expected.baseUrl}/users/establish_referral`)
      });
    });
  });

  describe('Creating new user', () => {
    describe('#createNewUser()', () => {
      let neo4j: Neo4j;
      let newUserParams: NewUserData;
      beforeEach(() => {
        jest.clearAllMocks();
        neo4j = new Neo4j(fetchMock);
        newUserParams = {
          user: {
            golightly_uuid: '456-boo',
            referred_by: '123-foo'
          }
        }
      });
      it('makes one request to baseUrl/create_user', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.createNewUser(newUserParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual(`${neo4j.baseUrl}/create_user`)
      });
      it('returns status 200 on success', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.createNewUser(newUserParams);
        expect(status).toEqual(200);
      });
      it('returns undefined on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
  
        const status = await neo4j.createNewUser(newUserParams);
        expect(status).toBe(undefined);
        expect(status).not.toBe(true);
      })
    });
  })

  describe('Creating connection or referral associations b/w two users', () => {
    let neo4j: Neo4j;
    let usersParams: UserConnectData;
    beforeEach(() => {
      jest.clearAllMocks();
      neo4j = new Neo4j(fetchMock);
      usersParams = {
        users: {
          user_one: {
            golightly_uuid: 'foo'
          },
          user_two: {
            golightly_uuid: 'boo'
          }
        }
      }
    });
    describe('#createConnectionEdges()', () => {
      it('makes one request to /users/establish_connection', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.createConnectionEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual(`${neo4j.baseUrl}/users/establish_connection`)
      });
      it('returns status 200 on success', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.createConnectionEdges(usersParams);
        expect(status).toEqual(200);
      });
      it('returns undefined on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
  
        const status = await neo4j.createConnectionEdges(usersParams);
        expect(status).toBe(undefined);
        expect(status).not.toBe(true);
      })
    })
    describe('#createReferralEdges()', () => {
      it('makes one request to baseUrl/users/establish_referral', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.createReferralEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual(`${neo4j.baseUrl}/users/establish_referral`)
      });
      it('returns status 200 on success', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        
        const status = await neo4j.createReferralEdges(usersParams);
        expect(status).toEqual(200);
      });
      it('returns undefined on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
  
        const status = await neo4j.createReferralEdges(usersParams);
        expect(status).toBe(undefined);
        expect(status).not.toBe(true);
      })
    })
  });

  describe('Retrieving mutual connections b/w two users', () => {
    let neo4j: Neo4j;
    beforeEach(() => {
      jest.clearAllMocks();
      neo4j = new Neo4j(fetchMock);
    });
    describe('#retrieveMutualConnections()', () => {
      it('returns a message object if params are equal', async () => {
        const result = await neo4j.retrieveMutualConnections('uuidOne', 'uuidOne');

        expect(result).toEqual({ message: 'No mutual connections exist for these users' })
      });
      it('makes one request to baseUrl/mutual_connections?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.retrieveMutualConnections('string1', 'string2');
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual(`${neo4j.baseUrl}/mutual_connections?golightly_uuid_one=string1&golightly_uuid_two=string2`)
      });
      it('returns an array of golightly_uuids on success when mutual connections exist', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ golightly_uuid: '789-cool' }, { golightly_uuid: '001-xyz' }]));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '456-boo';

        const result = await neo4j.retrieveMutualConnections(uuidOne, uuidTwo);
        expect(result).toEqual(['789-cool', '001-xyz']);
      });
      it('returns a message object on success when no mutual connections exist', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'No mutual connections exist for these users' }));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '457-boo';

        const result = await neo4j.retrieveMutualConnections(uuidOne, uuidTwo);
        expect(result).toEqual({ message: 'No mutual connections exist for these users' });
      });
      it('returns a message object on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '457-boo';

        const result = await neo4j.retrieveMutualConnections(uuidOne, uuidTwo);
        expect(result).toEqual({ message: 'fake error message' });
      });
    });
  })

  describe('Retriveing shortest path connections b/w two users', () => {
    describe('#retrieveShortestPathConnections', () => {
      let neo4j: Neo4j;
      beforeEach(() => {
        jest.clearAllMocks();
        neo4j = new Neo4j(fetchMock);
      });
      it('returns a message object if params are equal', async () => {
        const result = await neo4j.retrieveShortestPathConnections('uuidOne', 'uuidOne');

        expect(result).toEqual({ message: 'No connections exist for these users' })
      });
      it('makes one request to baseUrl/shortest_path?golightly_uuid_one=${uuidOne}&golightly_uuid_two=${uuidTwo}', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const status = await neo4j.retrieveShortestPathConnections('string1', 'string2');
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual(`${neo4j.baseUrl}/shortest_path?golightly_uuid_one=string1&golightly_uuid_two=string2`)
      });
      it('returns an array of golightly_uuids on success when connections exist b/w', async () => {
        const nodes = [
          { golightly_uuid: '123-foo' }, 
          { golightly_uuid: '000-ooo' }, 
          { golightly_uuid: '001-coo' }, 
          { golightly_uuid: '456-boo' }
        ]
        fetchMock.mockResponseOnce(JSON.stringify(nodes));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '456-boo';

        const result = await neo4j.retrieveShortestPathConnections(uuidOne, uuidTwo);
        expect(result).toEqual(['000-ooo', '001-coo']);
      });
      it('returns a message object on success when no mutual connections exist', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'No connections exist for these users' }));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '457-boo';

        const result = await neo4j.retrieveShortestPathConnections(uuidOne, uuidTwo);
        expect(result).toEqual({ message: 'No connections exist for these users' });
      });
      it('returns a message object on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '457-boo';

        const result = await neo4j.retrieveShortestPathConnections(uuidOne, uuidTwo);
        expect(result).toEqual({ message: 'fake error message' });
      });
    })
  })
});
