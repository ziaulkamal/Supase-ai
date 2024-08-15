const userStates = {}; // In-memory store for user states

export function getUserState(userId) {
  return userStates[userId] || null;
}

export function setUserState(userId, state) {
  userStates[userId] = state;
}

export function clearUserState(userId) {
  delete userStates[userId];
}
