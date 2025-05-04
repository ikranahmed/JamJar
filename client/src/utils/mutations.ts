import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
 mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      email
      _id
      username
    }
  }
}
`;

export const ADD_USER = gql`
mutation AddUser($input: AddUserInput!) {
  addUser(input: $input) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;
// export const GET_MY_PLAYLISTS = gql`
//   query GetMyPlaylists {
//     me {
//       _id
//       username
//       playlists {
//         _id
//         name
//         songCount
//         createdAt
//       }
//     }
//   }
// `;



// export const REMOVE_SONG_FROM_PLAYLIST = gql`
//   mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
//     removeSongFromPlaylist(playlistId: $playlistId, songId: $songId) {
//       _id
//       name
//       songs {
//         _id
//         title
//       }
//     }
//   }
// `;

export const CREATE_PLAYLIST = gql`
 mutation AddPlaylist($input: PlaylistInput!) {
  addPlaylist(input: $input) {
    name
    songs {
      title
      artist
      duration
      link
    }
    user {
      username
    }
  }
}
`;

export const REMOVE_PLAYLIST = gql`
mutation RemovePlaylist($removePlaylistId: ID!) {
  removePlaylist(id: $removePlaylistId) {
    id
    name
  }
}`