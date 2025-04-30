export async function searchArtists(artist:string) {
    const url = new URL("https://api.reccobeats.com/v1/artist/search");
    url.searchParams.append("searchText", artist ); // Add the search text parameter
    url.searchParams.append("size", "10"); // Add the size parameter
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
} 
export async function getArtistsTrack(artistID:string) {
    const url = new URL(`https://api.reccobeats.com/v1/artist/${artistID}/tracks`);
    url.searchParams.append("size", "10"); // Add the size parameter
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;

} 

// 		bruno mars	"id": "a46a685c-dfd6-48b8-811c-1dd953622918",



// green day id: 3c5b96e0-f07a-43f7-b452-be73fa62aa37

// miley id a4707ae0-7c9d-40d7-a2bc-c7010d5bd693 

// taylor swift id: c7b330b5-a62e-420c-bf02-943ca6bb8746