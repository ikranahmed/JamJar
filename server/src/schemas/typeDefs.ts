const typeDefs = `
  type User {
    username: String!
    email: String!
    playlists: [Playlist]
  }

  type Playlist {
    name: String!
    songs: [Song]
    user: User!
  }

  type Song {
    title: String!
    artist: String!
    duration: Int
    link: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    user(username: String!): User
    me: User
    playlists: [Playlist]
    playlist(playlistId: ID!): Playlist
  }

  type Mutation {
    addUser(input: AddUserInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addPlaylist(input: PlaylistInput!): Playlist
    removePlaylist(playlistName: String!): Playlist
    addSong(playlistName: String!, songInput: SongInput!): Song
    removeSong(playlistName: String!, songInput: SongInput!): Song
  }

  input AddUserInput {
    username: String!
    email: String!
    password: String!
  }

  input PlaylistInput {
  name: String!
  songs: [SongInput]
  }

  input SongInput {
    title: String!
    artist: String!
    duration: Int
    link: String
  }
`;
export default typeDefs;