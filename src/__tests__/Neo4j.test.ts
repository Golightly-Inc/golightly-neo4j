import { Neo4j } from '../index';

describe('Neo4j', () => {
  it('is constructed with our default url if no url param passed in', () => {
    const expected: Neo4j = new Neo4j();

    expect(expected.url).toEqual('https://golightly-neo4j-api.herokuapp.com')
  })
});
