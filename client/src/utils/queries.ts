import { gql } from '@apollo/client';

export const GET_PLAYLISTS = gql`
  query Playlists {
  playlists {
    id
    name
    songs {
      _id
      title
      artist
      duration
      link
    }
  }
}
`;

export const GET_PLAYLIST = gql`
  query getPlaylist($playlistId: ID!) {
    playlist(playlistId: $playlistId) {
      id
      name
      songs {
        artist
        duration
        id
        link
        title
      }
    }
  }
`;



// 
