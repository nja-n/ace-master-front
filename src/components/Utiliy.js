export const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const proTips = [
    "💡 Pro Tip: First player to place all cards wins the game!",
    "💡 Pro Tip: If you’re the last with cards in a multiplayer game, you lose!",
    "💡 Pro Tip: Ace (A) is the highest card; 2 is the lowest.",
    "💡 Pro Tip: Card order is: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A.",
    "💡 Pro Tip: Match the symbol (♠♥♣♦) of the last card played if you can.",
    "💡 Pro Tip: No matching suit? Play a bigger card to cut the previous play.",
    "💡 Pro Tip: A higher card cuts the previous card—use them wisely!",
    "💡 Pro Tip: The highest card on the table takes all cut cards!",
    "💡 Pro Tip: Holding high cards? Use them to control the round.",
    "💡 Pro Tip: Don’t waste your Aces early—save them for tough rounds.",
    "💡 Pro Tip: Playing a Joker at the right time can flip the game!",
    "💡 Pro Tip: Strategic card dumping early can mislead opponents.",
    "💡 Pro Tip: Keep track of suits already played to predict moves.",
    "💡 Pro Tip: Burn low cards when it’s safe, keep high for power plays.",
    "💡 Pro Tip: Watch opponents’ expressions—every move tells a story.",
    "💡 Pro Tip: Winning early rounds helps you control the table.",
    "💡 Pro Tip: Mind the symbols—use suit changes to break streaks.",
    "💡 Pro Tip: Don't always lead with strong cards—bluffing works too!",
    "💡 Pro Tip: If you can’t win a round, play your lowest card.",
    "💡 Pro Tip: In a close game, saving a single high card can win it!",
    "💡 Pro Tip: Observe patterns—opponents often repeat behaviors.",
    "💡 Pro Tip: Disrupt chains by throwing unexpected suits.",
    "💡 Pro Tip: Use card memory—track what’s been played already.",
    "💡 Pro Tip: Getting rid of middle cards (6-10) early gives control.",
    "💡 Pro Tip: Coins can be used for power-ups and special moves—spend wisely!",
    "💡 Pro Tip: Winning streaks increase your coin multiplier.",
    "💡 Pro Tip: Daily login rewards give you bonus coins—don’t miss out!",
    "💡 Pro Tip: Play smart, not just fast—timing beats speed in the long run.",
    "💡 Pro Tip: In doubt? Pass your turn and protect your big cards.",
];
export const getRandomProTip = () => {
    const randomIndex = Math.floor(Math.random() * proTips.length);
    return proTips[randomIndex];
};