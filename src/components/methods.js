import { protocol, socket, server } from "./serverURL";

// export const game = "wss://aetheracemaster-production.up.railway.app/game";
// export const saveUser = "https://aetheracemaster-production.up.railway.app/cards/savePlayer";
// export const getTimeRemains = "http://localhost:8080/cards/SESSION_ID/remaining-time";

export const game = `${socket}://${server}/game`;
export const saveUser = `${protocol}://${server}/cards/savePlayer`;
export const getTimeRemains = `${protocol}://${server}/cards/SESSION_ID/remaining-time`;

export const versionHistory = `${protocol}://${server}/version/history`;
export const createUniqueRoom = `${protocol}://${server}/cards/create-room`;
export const validateUniqueRoom = `${protocol}://${server}/cards/validate-room`;