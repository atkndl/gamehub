/**
 * Liar's Bar (Blöf) - Authoritative Server Game Logic
 * 
 * Rules:
 * - 20-Card Custom Deck: 6 Kings (K), 6 Queens (Q), 6 Aces (A), 2 Jokers (JOKER)
 * - 2 to 4 Players
 * - 5 cards dealt to each player at round start
 * - Table target card randomly set (K, Q, or A)
 * - Current player plays 1-3 cards face down
 * - Next player can play or challenge ("YALANCI!")
 * - On challenge, cards reveal:
 *   - If all cards match target or Joker -> Challenger gets bomb penalty
 *   - If at least 1 card mismatches -> Bluffer gets bomb penalty
 * - Bomb defusal: 6 wires (5 safe, 1 explosive). Safe wire gives survival but reduces remaining wire pool.
 * - Explosive wire causes elimination. Last alive player wins!
 */

export const WIRE_COLORS = ['red', 'blue', 'yellow', 'green', 'purple', 'white'];
export const TARGET_TYPES = ['K', 'Q', 'A'];

export class LiarsBarSession {
  constructor(roomCode, players, config = {}) {
    this.roomCode = roomCode;
    this.config = config;
    this.status = 'round_start'; // 'round_start' | 'waiting_play' | 'revealing' | 'bomb_defusal' | 'game_over'
    
    // Initialize player states
    this.players = players.map(p => {
      // Pick 1 secret explosive wire out of 6
      const explosiveWireIndex = Math.floor(Math.random() * 6);
      return {
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isAlive: true,
        hand: [],
        bombWires: WIRE_COLORS.map((color, idx) => ({
          id: idx,
          color,
          cut: false,
          isExplosive: idx === explosiveWireIndex
        })),
        cutsCount: 0,
        eliminatedRank: null
      };
    });

    this.tableTarget = 'K';
    this.turnIndex = 0;
    this.currentTurnPlayerId = this.players[0]?.id;
    this.playedPile = []; // Array of plays: [{ playerId, playerName, cardCount, claimedType, actualCards, timestamp }]
    this.lastPlay = null;
    this.lastReveal = null;
    this.penalizedPlayerId = null;
    this.winner = null;
    this.roundNumber = 0;
    this.history = [];

    // Start first round
    this.startNewRound();
  }

  getAlivePlayers() {
    return this.players.filter(p => p.isAlive);
  }

  /**
   * Generates and shuffles a fresh 20-card deck
   */
  generateDeck() {
    const deck = [];
    let idCounter = 1;

    // 6 Kings
    for (let i = 0; i < 6; i++) {
      deck.push({ id: `k_${idCounter++}`, type: 'K', label: 'Papaz' });
    }
    // 6 Queens
    for (let i = 0; i < 6; i++) {
      deck.push({ id: `q_${idCounter++}`, type: 'Q', label: 'Kız' });
    }
    // 6 Aces
    for (let i = 0; i < 6; i++) {
      deck.push({ id: `a_${idCounter++}`, type: 'A', label: 'As' });
    }
    // 2 Jokers
    deck.push({ id: `joker_1`, type: 'JOKER', label: 'Joker' });
    deck.push({ id: `joker_2`, type: 'JOKER', label: 'Joker' });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  /**
   * Starts a new round: deals 5 cards to all alive players and picks table target
   */
  startNewRound() {
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length <= 1) {
      this.status = 'game_over';
      this.winner = alivePlayers[0] || null;
      return;
    }

    this.roundNumber++;
    this.playedPile = [];
    this.lastPlay = null;
    this.lastReveal = null;
    this.penalizedPlayerId = null;

    // Pick table target card randomly (K, Q, or A)
    this.tableTarget = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)];

    // Generate fresh 20-card deck
    const deck = this.generateDeck();

    // Deal 5 cards to each alive player
    alivePlayers.forEach(p => {
      p.hand = deck.splice(0, 5);
    });

    // Determine whose turn it is: rotate to next alive player from last round or start with first
    if (!this.currentTurnPlayerId || !this.players.find(p => p.id === this.currentTurnPlayerId)?.isAlive) {
      this.currentTurnPlayerId = alivePlayers[0].id;
    }

    this.status = 'waiting_play';
  }

  /**
   * Advances turn to the next alive player
   */
  advanceTurn() {
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length <= 1) {
      this.status = 'game_over';
      this.winner = alivePlayers[0] || null;
      return;
    }

    const currentIndex = alivePlayers.findIndex(p => p.id === this.currentTurnPlayerId);
    const nextIndex = (currentIndex + 1) % alivePlayers.length;
    this.currentTurnPlayerId = alivePlayers[nextIndex].id;
  }

  /**
   * Current player plays 1-3 cards face down
   */
  playCards(socketId, cardIds) {
    if (this.status !== 'waiting_play') {
      return { error: 'Şu anda kart oynanamaz.' };
    }

    if (this.currentTurnPlayerId !== socketId) {
      return { error: 'Sıra sizde değil.' };
    }

    if (!Array.isArray(cardIds) || cardIds.length < 1 || cardIds.length > 3) {
      return { error: 'Lütfen 1, 2 veya 3 kart seçin.' };
    }

    const player = this.players.find(p => p.id === socketId);
    if (!player || !player.isAlive) {
      return { error: 'Oyuncu oyunda değil.' };
    }

    // Verify player actually holds these cards
    const heldCardIds = new Set(player.hand.map(c => c.id));
    const allHeld = cardIds.every(id => heldCardIds.has(id));
    if (!allHeld) {
      return { error: 'Elinizde olmayan kartları oynayamazsınız.' };
    }

    // Extract actual cards from hand
    const playedCards = player.hand.filter(c => cardIds.includes(c.id));
    player.hand = player.hand.filter(c => !cardIds.includes(c.id));

    // Create play record
    const playRecord = {
      playerId: player.id,
      playerName: player.name,
      cardCount: playedCards.length,
      claimedType: this.tableTarget,
      actualCards: playedCards, // Kept secret until reveal!
      timestamp: Date.now()
    };

    this.playedPile.push(playRecord);
    this.lastPlay = playRecord;

    // Check if player has 0 cards left
    // If so, the next player is forced to challenge
    const handEmpty = player.hand.length === 0;

    // Advance turn to next alive player
    this.advanceTurn();

    return {
      success: true,
      playRecord: {
        playerId: player.id,
        playerName: player.name,
        cardCount: playedCards.length,
        claimedType: this.tableTarget,
        timestamp: playRecord.timestamp,
        playerHandCount: player.hand.length,
        mustChallenge: handEmpty
      }
    };
  }

  /**
   * Next player challenges the previous move: "YALANCI!"
   */
  challenge(socketId) {
    if (this.status !== 'waiting_play') {
      return { error: 'Şu anda itiraz edilemez.' };
    }

    if (this.currentTurnPlayerId !== socketId) {
      return { error: 'Sıra sizde değil.' };
    }

    if (!this.lastPlay) {
      return { error: 'Henüz masaya kart atılmadı, itiraz edemezsiniz.' };
    }

    const challenger = this.players.find(p => p.id === socketId);
    const targetPlayer = this.players.find(p => p.id === this.lastPlay.playerId);

    if (!challenger || !targetPlayer) {
      return { error: 'Oyuncu bulunamadı.' };
    }

    // Evaluate the last played cards against tableTarget:
    // Every card must be either tableTarget OR JOKER.
    const actualCards = this.lastPlay.actualCards || [];
    const isBluff = actualCards.some(card => card.type !== this.tableTarget && card.type !== 'JOKER');

    let penalizedPlayer = null;
    let resultMessage = '';

    if (isBluff) {
      // Bluffer caught! Target player gets bomb penalty
      penalizedPlayer = targetPlayer;
      resultMessage = `BLÖF YAKALANDI! ${targetPlayer.name} masaya sahte kart attı!`;
    } else {
      // Truth told! Challenger gets bomb penalty
      penalizedPlayer = challenger;
      resultMessage = `DOĞRU HAMLE! ${targetPlayer.name} kartlarında dürüsttü. ${challenger.name} yanıldı!`;
    }

    this.status = 'revealing';
    this.penalizedPlayerId = penalizedPlayer.id;

    const revealData = {
      challengerId: challenger.id,
      challengerName: challenger.name,
      targetPlayerId: targetPlayer.id,
      targetPlayerName: targetPlayer.name,
      tableTarget: this.tableTarget,
      claimedCount: this.lastPlay.cardCount,
      cards: actualCards, // Now made public to everyone!
      isBluff,
      penalizedPlayerId: penalizedPlayer.id,
      penalizedPlayerName: penalizedPlayer.name,
      message: resultMessage
    };

    this.lastReveal = revealData;
    this.history.push(revealData);

    return {
      success: true,
      revealData
    };
  }

  /**
   * Transition from reveal to bomb defusal phase
   */
  proceedToBomb() {
    if (this.status !== 'revealing' || !this.penalizedPlayerId) {
      return { error: 'Bomba aşamasına geçilemez.' };
    }

    this.status = 'bomb_defusal';
    return { success: true, penalizedPlayerId: this.penalizedPlayerId };
  }

  /**
   * Penalized player cuts one of their bomb wires
   */
  cutWire(socketId, wireId) {
    if (this.status !== 'bomb_defusal') {
      return { error: 'Şu anda bomba kesme aşamasında değilsiniz.' };
    }

    if (this.penalizedPlayerId !== socketId) {
      return { error: 'Bomba kesme sırası sizde değil.' };
    }

    const player = this.players.find(p => p.id === socketId);
    if (!player || !player.isAlive) {
      return { error: 'Cezalı oyuncu bulunamadı.' };
    }

    const wire = player.bombWires.find(w => w.id === wireId);
    if (!wire) {
      return { error: 'Geçersiz kablo numarası.' };
    }

    if (wire.cut) {
      return { error: 'Bu kablo zaten daha önce kesildi!' };
    }

    // Cut the wire!
    wire.cut = true;
    player.cutsCount++;

    const isExplosion = Boolean(wire.isExplosive);

    if (isExplosion) {
      // BOOM! Player eliminated!
      player.isAlive = false;
      const aliveRemaining = this.getAlivePlayers();
      player.eliminatedRank = aliveRemaining.length + 1;

      // Note: We keep status as 'bomb_defusal' so players can experience
      // the full 5-second explosion animation before transitioning to 'game_over'.
      if (aliveRemaining.length <= 1) {
        this.winner = aliveRemaining[0] || null;
      }
    }

    const result = {
      playerId: player.id,
      playerName: player.name,
      wireId,
      wireColor: wire.color,
      isExplosion,
      isAlive: player.isAlive,
      gameOver: Boolean(this.winner),
      winner: this.winner ? { id: this.winner.id, name: this.winner.name, avatar: this.winner.avatar } : null
    };

    return {
      success: true,
      result
    };
  }

  /**
   * After bomb phase resolves, start next round (if game not over)
   */
  proceedAfterBomb() {
    if (this.status === 'game_over') {
      return { gameOver: true, winner: this.winner };
    }

    this.startNewRound();
    return { nextRound: true };
  }

  /**
   * Returns authoritative public state sanitized for a specific player:
   * (Does NOT expose other players' hands or secret bomb wire values!)
   */
  getClientState(socketId) {
    const alivePlayers = this.getAlivePlayers();
    const self = this.players.find(p => p.id === socketId);

    return {
      status: this.status,
      roundNumber: this.roundNumber,
      tableTarget: this.tableTarget,
      currentTurnPlayerId: this.currentTurnPlayerId,
      isMyTurn: this.currentTurnPlayerId === socketId,
      myHand: self?.hand || [],
      totalTableCards: this.playedPile.reduce((sum, p) => sum + p.cardCount, 0),
      lastPlay: this.lastPlay ? {
        playerId: this.lastPlay.playerId,
        playerName: this.lastPlay.playerName,
        cardCount: this.lastPlay.cardCount,
        claimedType: this.lastPlay.claimedType,
        timestamp: this.lastPlay.timestamp
      } : null,
      lastReveal: this.lastReveal,
      penalizedPlayerId: this.penalizedPlayerId,
      winner: this.winner ? { id: this.winner.id, name: this.winner.name, avatar: this.winner.avatar } : null,
      players: this.players.map(p => {
        const isSelf = p.id === socketId;
        const uncutCount = p.bombWires.filter(w => !w.cut).length;
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          isAlive: p.isAlive,
          cardCount: p.hand.length,
          // Only show actual hand to the player themselves
          hand: isSelf ? p.hand : [],
          // Public wire status (cut or not, but NEVER expose isExplosive!)
          wires: p.bombWires.map(w => ({
            id: w.id,
            color: w.color,
            cut: w.cut
          })),
          cutsCount: p.cutsCount,
          uncutCount,
          survivalOdds: uncutCount > 0 ? `${uncutCount - 1}/${uncutCount}` : '0/1',
          eliminatedRank: p.eliminatedRank
        };
      })
    };
  }
}
