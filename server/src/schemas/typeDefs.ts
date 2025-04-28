const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    playlists: [Playlist]
  }

  type Playlist {
    id: ID!
    name: String!
    songs: [Song!]!
    user: User!
  }

  type Song {
    // id: ID!
    name: String!
    artist: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    user(username: String!): User
    me: User
  }

  type Mutation {
    addUser(input: AddUserInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addPlaylist(name: String!): Playlist
    removePlaylist(playlistName: String!): Playlist
    addSong(playlistName: String!, songInput: SongInput!): Song
    removeSong(playlistName: String!, songInput: SongInput!): Song
  }

  input AddUserInput {
    username: String!
    email: String!
    password: String!
  }

  input SongInput {
    name: String!
    artist: String!
  }
`;
export default typeDefs;