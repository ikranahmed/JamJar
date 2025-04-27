const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    playlists: [Playlist]
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Playlist {
    _id: ID!
    title: String!
    description: String
    tags: [String]
    isPublic: Boolean
    createdBy: User!
    songs: [Song]
  }

  type Song {
    _id: ID!
    title: String!
    artist: String
    link: String!
  }

  type Query {
    me: User
    getUserPlaylists: [Playlist]
    getPlaylistById(playlistId: ID!): Playlist
    getPublicPlaylists: [Playlist]
    searchPlaylists(tag: String!): [Playlist]
  }

  type Mutation {
    # Auth
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth

    # Playlist management
    addPlaylist(title: String!, description: String, tags: [String], isPublic: Boolean): Playlist
    updatePlaylist(playlistId: ID!, title: String, description: String, tags: [String], isPublic: Boolean): Playlist
    deletePlaylist(playlistId: ID!): Playlist

    # Song management
    addSong(playlistId: ID!, title: String!, artist: String, link: String!): Playlist
    removeSong(playlistId: ID!, songId: ID!): Playlist

  }
`;
export default typeDefs;