import { protocol, socket, server } from "./serverURL";

const preProtocol = `${protocol}://${server}/`;
export const pre = preProtocol;

export const game = `${socket}://${server}/game`;
export const saveUser = `${protocol}://${server}/cards/savePlayer`;
export const getTimeRemains = `${protocol}://${server}/public/SESSION_ID/remaining-time`;
export const gameAi = `${socket}://${server}/game-ai`;

export const versionHistory = `${protocol}://${server}/version/history`;
export const createUniqueRoom = `${protocol}://${server}/cards/create-room`;
export const validateUniqueRoom = `${protocol}://${server}/cards/validate-room`;

// export const loadCoinBalance = `${protocol}://${server}/cards/load-coin-balance`;

// export const fetchUser = `${protocol}://${server}/fetch-user`;

export const sendOtp = `${protocol}://${server}/auth/send-otp`;
export const verifyOtp = `${protocol}://${server}/auth/verify-otp`;
export const signUp = `${protocol}://${server}/auth/sign-up`;
export const userByToken = `${protocol}://${server}/user-by-token`;
export const firebaseAuth = `${protocol}://${server}/auth/firebase`;

export const terms = `${protocol}://${server}/public/terms-pdf`;

export const feedback = `${protocol}://${server}/feedback`;

export const fetchDailyTasks = `${protocol}://${server}/tasks/daily`;
export const claimDailyTask = `${protocol}://${server}/tasks/daily/claim`;

export const fetchAchievements = `${protocol}://${server}/profile/fetch-achievements`;