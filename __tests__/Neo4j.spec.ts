import { FetchMock } from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

import { Neo4j } from '../src/index';

describe('Neo4j', () => {
  describe('Initialization', () => {
    describe('baseUrl instance variable', () => {
      it('is assigned to default url if empty initialization', () => {
        const expected: Neo4j = new Neo4j();
    
        expect(expected.baseUrl).toEqual('https://golightly-neo4j-api.herokuapp.com');
      });
      it('is assigned to url class is initilized with', () => {
        const expected: Neo4j = new Neo4j('https://example.com');
  
        expect(expected.baseUrl).toEqual('https://example.com');
      });
    });
    describe('establishConnectionUrl instance variable', () => {
      it('is assigned to baseUrl/users/establish_connection', () => {
        const expected: Neo4j = new Neo4j();
    
        expect(expected.establishConnectionUrl).toEqual(`${expected.baseUrl}/users/establish_connection`)
      });
    });
    describe('establishReferralUrl', () => {
      it('is assigned to baseUrl/users/establish_referral', () => {
        const expected: Neo4j = new Neo4j('fooboo.com');
    
        expect(expected.establishReferralUrl).toEqual(`${expected.baseUrl}/users/establish_referral`)
      });
    });
  });

  describe('Creating connection or referral associations b/w two users', () => {
    let neo4j: Neo4j;
    let usersParams: userConnectData;
    beforeEach(() => {
      jest.clearAllMocks();
      neo4j = new Neo4j();
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
      it('returns status 200 on success', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        
        const status = await neo4j.createConnectionEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(status).toEqual(200);
      });
      it('returns undefined on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
  
        const status = await neo4j.createConnectionEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(status).toBe(undefined);
        expect(status).not.toBe(true);
      })
    })
    describe('#createReferralEdges()', () => {
      it('returns status 200 on success', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        
        const status = await neo4j.createReferralEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(status).toEqual(200);
      });
      it('returns undefined on failure', async () => {
        fetchMock.mockReject(new Error('fake error message'));
  
        const status = await neo4j.createReferralEdges(usersParams);
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(status).toBe(undefined);
        expect(status).not.toBe(true);
      })
    })
  });

  describe('Retrieving mutual connections b/w two users', () => {
    let neo4j: Neo4j;
    beforeEach(() => {
      jest.clearAllMocks();
      neo4j = new Neo4j();
    });
    describe('#retrieveMutualConnections()', () => {
      it('returns a message object if params are equal', async () => {
        const result = await neo4j.retrieveMutualConnections('uuidOne', 'uuidOne');

        expect(result).toEqual({ message: 'No mutual connections exist for these users' })
      });
      it('returns an array of golightly_uuid objets on success when mutual connections exist', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([{ golightly_uuid: '789-cool' }, { golightly_uuid: '001-xyz' }]));
        const uuidOne: string = '123-foo';
        const uuidTwo: string = '456-boo';

        const result = await neo4j.retrieveMutualConnections(uuidOne, uuidTwo);
        expect(result).toEqual([{golightly_uuid: '789-cool'}, {golightly_uuid: '001-xyz'}]);
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
});
