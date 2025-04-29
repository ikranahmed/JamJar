import { gql } from '@apollo/client';

export const GET_PLAYLISTS = gql`
  query getPlaylists {
    playlists {
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

export const QUERY_MATCHUPS = gql`
  query matchups($_id: String) {
    matchups(_id: $_id) {
      _id
      tech1
      tech2
      tech1_votes
      tech2_votes
    }
  }
`;

// 
