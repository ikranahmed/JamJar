const typeDefs = `
  type User {
     _id: ID!
    username: String!
    email: String!
    playlists: [Playlist]
  }

  type Playlist {
    id: ID!
    name: String!
    songs: [Song]
    user: User!
  }

  type Song {
    _id: ID!
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
    songs: [Song]
    song(title: String!): Song
    playlists: [Playlist]
    playlist(playlistId: ID!): Playlist
  }

  type Mutation {
    addUser(input: AddUserInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addPlaylist(input: PlaylistInput!): Playlist
    removePlaylist(id: ID!): Playlist
    addSong(playlistName: String!, songInput: SongInput!): Playlist
    removeSong(playlistName: String!, songInput: SongInput!): Playlist
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