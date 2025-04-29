import casual from 'casual';

export const mocks = {
    // User: () => ({
    //     id: casual.uuid,
    //     username: casual.username,
    //     email: casual.email,
    //     playlists: () => [
    //         {
    //             id: casual.uuid,
    //             name: casual.title,
    //             songs: () => [
    //                 {
    //                     id: casual.uuid,
    //                     title: casual.title,
    //                     artist: casual.color_name,
    //                     duration: casual.integer(1, 300),
    //                     link: casual.url
    //                 }
    //             ]
    //         }
    //     ]
    // }),
    // Playlist: () => ({
    //     id: casual.uuid,
    //     name: casual.title,
    //     songs: [],
    //     user: () => ({ username: casual.username })
    // }),
    Song: () => ({
        id: casual.uuid,
        title: casual.title,
        artist: casual.color_name,
        duration: casual.integer(60000, 60000 * 5),
        link: () => {
            const songs = [
                'https://open.spotify.com/track/5IZXB5IKAD2qlvTPJYDCFB?si=758ffb783d034cf7',
                'https://open.spotify.com/track/0FIDCNYYjNvPVimz5icugS?si=eeb90b95f56f4eba',
                'https://open.spotify.com/track/0Z2Z1X2w2v3c3z3z3z3z3z?si=1234567890abcdef',
                'https://open.spotify.com/track/6AI3ezQ4o3HUoP6Dhudph3?si=32ab89ee7a884b5c'
            ];
            return songs[Math.floor(Math.random() * songs.length)];
        }
    }),
    Query: () => ({
        user: () => ({
            id: casual.uuid,
            username: casual.username,
            email: casual.email
        }),
        me: () => ({
            id: casual.uuid,
            username: casual.username,
            email: casual.email
        }),
        playlists: () => {
            const playlists = [];
            const numPlaylists = casual.integer(1, 5);
            for (let i = 0; i <= numPlaylists; i++) {
                playlists.push({
                    id: casual.uuid,
                    name: casual.title,
                });
            }
            return playlists;
        },
        playlist: () => ({
            id: casual.uuid,
            name: casual.title,
        })
    }),
};