import axios from 'axios';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  link?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export const ARTIST_IDS = {
  BRUNO_MARS: 'a46a685c-dfd6-48b8-811c-1dd953622918',
  GREEN_DAY: '3c5b96e0-f07a-43f7-b452-be73fa62aa37',
  TAYLOR_SWIFT: 'c7b330b5-a62e-420c-bf02-943ca6bb8746'
} as const;

export async function getArtistTracks(artistId: string): Promise<ApiResponse<Track[]>> {
  try {
    const response = await axios.get(`https://api.reccobeats.com/v1/artist/${artistId}/track`, {
      params: { size: 50 },
      headers: { 'Accept': 'application/json' },
      timeout: 5000
    });

    console.log('Full API Response:', response); // Debug log

    // Extract the actual tracks data based on the API's response structure
    let tracksData = response.data.content;
    console.log('Raw Tracks Data:', tracksData);
    console.log('tracking data ID', tracksData[0].id)
    // Debug log
    // If the API returns an object with a 'data' property
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Try common response structures
      if (Array.isArray(response.data.tracks)) {
        tracksData = response.data.tracks;
      } else if (Array.isArray(response.data.items)) {
        tracksData = response.data.items;
      } else if (Array.isArray(response.data.data)) {
        tracksData = response.data.data;
      } else {
        // If we can't find an array, try to use the object values
        tracksData = Object.values(response.data.content);
      }
    }
    console.log('testing data property', response.data.content)
    // Final check if we have an array
    if (!Array.isArray(tracksData)) {
      throw new Error(`Expected array but got ${typeof tracksData}`);
    }

    // Transform the tracks to our format
    const tracks = tracksData.map((item: any) => ({
      id: item.id, 
    //   || Math.random().toString(36).substr(2, 9),
      title: item.trackTitle || item.name || 'Unknown Track',
      artist: item.artist || item.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
      duration: item.durationMs || 0,
      link: item.external_urls?.spotify || item.preview_url || item.href || `#${item.id}` 
    }));
    console.log('Transformed Tracks:', tracks);
    console.log('')
    return { 
      data: tracks,
      status: response.status 
    };
  } catch (error: any) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    return {
      error: error.response?.data?.message || 
             error.response?.data?.error || 
             error.message || 
             'Failed to fetch tracks',
      status: error.response?.status || 500
    };
  }
}

// OPTION 2



// // export async function searchArtists(artist:string) {
// //     const url = new URL("https://api.reccobeats.com/v1/artist/search");
// //     url.searchParams.append("searchText", artist ); // Add the search text parameter
// //     url.searchParams.append("size", "10"); // Add the size parameter
// //     const response = await fetch(url);
// //     if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //     }
// //     const data = await response.json();
// //     return data;
// // } 
// // export async function getArtistsTrack(artistID:string) {
// //     const url = new URL(`https://api.reccobeats.com/v1/artist/${artistID}/tracks`);
// //     url.searchParams.append("size", "10"); // Add the size parameter
// //     const response = await fetch(url);
// //     if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //     }
// //     const data = await response.json();
// //     return data;

// // } 

// // Add these interfaces at the top of the file
// export interface Artist {
//     id: string;
//     name: string;
//     // Add other artist properties you expect from the API
//   }
  
//   export interface Track {
//     id: string;
//     title: string;
//     artist: string;
//     duration?: number;
//     // Add other track properties you expect from the API
//   }
  
//   export interface ApiResponse<T> {
//     data: T;
//     error?: string;
//   }
  
//   export async function searchArtists(artist: string): Promise<ApiResponse<Artist[]>> {
//     try {
//       const url = new URL("https://api.reccobeats.com/v1/artist/search");
//       url.searchParams.append("searchText", artist);
//       url.searchParams.append("size", "10");
      
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return { data };
//     } catch (error) {
//       console.error('Error searching artists:', error);
//       return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
//     }
//   }
  
//   export async function getArtistsTrack(artistID: string): Promise<ApiResponse<Track[]>> {
//     try {
//       const url = new URL(`https://api.reccobeats.com/v1/artist/${artistID}/tracks`);
//       url.searchParams.append("size", "10");
      
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return { data };
//     } catch (error) {
//       console.error('Error fetching artist tracks:', error);
//       return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
//     }
//   }

// 		bruno mars	"id": "a46a685c-dfd6-48b8-811c-1dd953622918",



// green day id: 3c5b96e0-f07a-43f7-b452-be73fa62aa37


// taylor swift id: c7b330b5-a62e-420c-bf02-943ca6bb8746