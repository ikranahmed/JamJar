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

