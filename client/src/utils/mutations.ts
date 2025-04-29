// import { gql } from '@apollo/client';

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

// export const GET_PLAYLIST = gql`
//   query GetPlaylist($playlistId: ID!) {
//     playlist(playlistId: $playlistId) {
//       _id
//       name
//       songs {
//         _id
//         title
//         artist
//         duration
//         link
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

// export const CREATE_PLAYLIST = gql`
//   mutation CreatePlaylist($name: String!) {
//     createPlaylist(name: $name) {
//       _id
//       name
//     }
//   }
// `;