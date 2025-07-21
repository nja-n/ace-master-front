import { protocol, socket, server } from "./serverURL";

// export const game = "wss://aetheracemaster-production.up.railway.app/game";
// export const saveUser = "https://aetheracemaster-production.up.railway.app/cards/savePlayer";
// export const getTimeRemains = "http://localhost:8080/cards/SESSION_ID/remaining-time";

export const game = `${socket}://${server}/game`;
export const saveUser = `${protocol}://${server}/cards/savePlayer`;
export const getTimeRemains = `${protocol}://${server}/public/SESSION_ID/remaining-time`;
export const gameAi = `${socket}://${server}/game-ai`;

export const versionHistory = `${protocol}://${server}/version/history`;
export const createUniqueRoom = `${protocol}://${server}/cards/create-room`;
export const validateUniqueRoom = `${protocol}://${server}/cards/validate-room`;

// export const loadCoinBalance = `${protocol}://${server}/cards/load-coin-balance`;

export const fetchUser = `${protocol}://${server}/fetch-user`;

export const sendOtp = `${protocol}://${server}/auth/send-otp`;
export const verifyOtp = `${protocol}://${server}/auth/verify-otp`;
export const signUp = `${protocol}://${server}/auth/sign-up`;
export const userByToken = `${protocol}://${server}/user-by-token`;