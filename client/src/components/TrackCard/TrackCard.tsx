// import { FaPlay } from 'react-icons/fa';
// const playTrack = (link?: string) => {
//     if (link?.startsWith('http')) {
//         window.open(link, '_blank');
//     }
// };

// const TrackCard = ({ track, showDelete }: { track: any, showDelete: Boolean }) => {
//     return (
//         <>
//             <div className="song-info">
//                 <span className="song-title">{track.trackTitle}</span>
//                 <span className="song-artist">{track.artist}</span>
//                 {track.duration && (
//                     <span className="song-duration">
//                         {new Date(track.duration).toISOString().substr(14, 5)}
//                     </span>
//                 )}
//             </div>
//             <button
//                 className="play-btn"
//                 onClick={() => playTrack(track.link)}
//                 aria-label={`Play ${track.trackTitle}`}
//             >
//                 <FaPlay />
//             </button>
//             {showDelete && (
//                 <button
//                     className="remove-btn"
//                     onClick={() => console.log(`Remove ${track.trackTitle}`)}
//                     aria-label={`Remove ${track.trackTitle}`}
//                 >
//                     <span className="remove-icon">X</span>
//                 </button>
//             )}
//         </>
//     );
// }

// export default TrackCard;