
export interface Track {
    id: string;
    trackTitle: string;
    artist: string;
    duration?: number;
    link?: string;
}

export interface ApiResponse {
    content: Track[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}



// Add these interfaces at the top of the file
export interface Artist {
    id: string;
    name: string;
    // Add other artist properties you expect from the API
}

export const ARTIST_IDS = {
    BRUNO_MARS: 'a46a685c-dfd6-48b8-811c-1dd953622918',
    GREEN_DAY: '3c5b96e0-f07a-43f7-b452-be73fa62aa37',
    TAYLOR_SWIFT: 'c7b330b5-a62e-420c-bf02-943ca6bb8746'
};

    // Add other track properties you expect from the API

export async function searchArtists(artist: string): Promise<ApiResponse> {
    try {
        const url = new URL("https://api.reccobeats.com/v1/artist/search");
        url.searchParams.append("searchText", artist);
        url.searchParams.append("size", "10");

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error('Error searching artists:', error);
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function getArtistsTrack(artistID: string): Promise<ApiResponse> {
    try {
        const url = new URL(`https://api.reccobeats.com/v1/artist/${artistID}/track`);
        url.searchParams.append("size", "10");

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
