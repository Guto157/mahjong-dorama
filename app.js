
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';

const seasons = [
  { number: '01', name: 'Amor em Seul', emoji: '🌸', color: '#A94F70' },
  { number: '02', name: 'Segredos do Palácio', emoji: '👑', color: '#A88745' },
  { number: '03', name: 'O Segredo', emoji: '🌙', color: '#66578D' },
  { number: '04', name: 'Nosso Primeiro Amor', emoji: '💗', color: '#C16F83' },
  { number: '05', name: 'Outro Mundo', emoji: '✨', color: '#547C83' },
];

const symbols = [
  '🌸', '🦋', '🌙', '🎎', '🍵', '💎', '🎐',
  '❤️', '🌺', '⭐', '🐉', '🎀', '🌷', '🏮',
];

function createBoard() {
  const positions = [];

  // Camada inferior: 24 peças
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      positions.push({ row, col, layer: 0 });
    }
  }

  // Camada superior: 4 peças sobrepostas
  for (let row = 1; row <= 2; row++) {
    for (let col = 2; col <= 3; col++) {
      positions.push({ row, col, layer: 1 });
    }
  }

  const values = [...symbols, ...symbols];

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  return positions.map((position, index) => ({
    id: index,
    symbol: values[index],
    ...position,
  }));
}

function isFree(tile, board) {
  const covered = board.some(
    item =>
      item.row === tile.row &&
      item.col === tile.col &&
      item.layer > tile.layer
  );

  if (covered) return false;

  const leftBlocked = board.some(
    item =>
      item.row === tile.row &&
      item.col === tile.col - 1 &&
      item.layer === tile.layer
  );

  const rightBlocked = board.some(
    item =>
      item.row === tile.row &&
      item.col === tile.col + 1 &&
      item.layer === tile.layer
  );

  return !leftBlocked || !rightBlocked;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tiles, setTiles] = useState(createBoard);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('Encontre os pares iguais!');
  const [won, setWon] = useState(false);

  function selectTile(tile) {
    if (!isFree(tile, tiles) || won) return;

    if (selected === null) {
      setSelected(tile.id);
      setMessage('Agora escolha outra peça igual.');
      return;
    }

    if (selected === tile.id) {
      setSelected(null);
      setMessage('Peça desmarcada.');
      return;
    }

    const first = tiles.find(item => item.id === selected);

    if (first && first.symbol === tile.symbol) {
      const remaining = tiles.filter(
        item => item.id !== first.id && item.id !== tile.id
      );

      setTiles(remaining);
      setSelected(null);
      setMoves(m => m + 1);

      if (remaining.length === 0) {
        setWon(true);
        setMessage('🎉 Parabéns! Você venceu a fase!');
      } else {
        setMessage('✨ Par encontrado! Continue!');
      }
    } else {
      setSelected(tile.id);
      setMoves(m => m + 1);
      setMessage('Não são iguais. Tente outra combinação!');
    }
  }

  function newGame() {
    setTiles(createBoard());
    setSelected(null);
    setMoves(0);
    setWon(false);
    setMessage('Encontre os pares iguais!');
  }

  function shuffleBoard() {
    const values = tiles.map(tile => tile.symbol);

    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    setTiles(
      tiles.map((tile, index) => ({
        ...tile,
        symbol: values[index],
      }))
    );

    setSelected(null);
    setMessage('Peças embaralhadas!');
  }

  function openGame() {
    newGame();
    setScreen('game');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17131F" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>MAHJONG</Text>
        <Text style={styles.logoSubtitle}>D O R A M A</Text>

        {screen === 'home' && (
          <>
            <View style={styles.profile}>
              <Text style={styles.avatar}>🌷</Text>
              <View>
                <Text style={styles.playerName}>JOGADOR</Text>
                <Text style={styles.playerLevel}>Nível 1 · Iniciante</Text>
              </View>
              <View style={styles.coins}>
                <Text style={styles.coinText}>🪙 0</Text>
              </View>
            </View>

            <View style={styles.hero}>
              <Text style={styles.heroTag}>
                SUA PRÓXIMA HISTÓRIA COMEÇA AQUI
              </Text>
              <Text style={styles.heroEmoji}>🌸 🀄 🌸</Text>
              <Text style={styles.heroTitle}>
                Cada peça conta uma história.
              </Text>
              <Text style={styles.heroDescription}>
                Combine as peças, desbloqueie episódios e viva
                histórias inspiradas no universo dos doramas.
              </Text>
              <Pressable
                style={styles.playButton}
                onPress={() => setScreen('seasons')}
              >
                <Text style={styles.playText}>COMEÇAR A JOGAR ›</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>SUA JORNADA</Text>

            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Fases</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Estrelas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>TEMPORADAS</Text>

            {seasons.map(season => (
              <Pressable
                key={season.number}
                style={styles.seasonCard}
                onPress={() => setScreen('seasons')}
              >
                <View
                  style={[
                    styles.seasonIcon,
                    { backgroundColor: season.color },
                  ]}
                >
                  <Text style={styles.seasonEmoji}>{season.emoji}</Text>
                </View>
                <View style={styles.seasonInfo}>
                  <Text style={styles.seasonNumber}>
                    TEMPORADA {season.number}
                  </Text>
                  <Text style={styles.seasonName}>{season.name}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}
          </>
        )}

        {screen === 'seasons' && (
          <>
            <Text style={styles.sectionTitle}>ESCOLHA SUA TEMPORADA</Text>
            <Text style={styles.heroDescription}>
              Selecione uma história para começar sua jornada.
            </Text>

            {seasons.map(season => (
              <Pressable
                key={season.number}
                style={styles.seasonCard}
                onPress={openGame}
              >
                <View
                  style={[
                    styles.seasonIcon,
                    { backgroundColor: season.color },
                  ]}
                >
                  <Text style={styles.seasonEmoji}>{season.emoji}</Text>
                </View>
                <View style={styles.seasonInfo}>
                  <Text style={styles.seasonNumber}>
                    TEMPORADA {season.number}
                  </Text>
                  <Text style={styles.seasonName}>{season.name}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.backButton}
              onPress={() => setScreen('home')}
            >
              <Text style={styles.backText}>VOLTAR AO INÍCIO</Text>
            </Pressable>
          </>
        )}

        {screen === 'game' && (
          <>
            <View style={styles.gameHeader}>
              <Text style={styles.sectionTitle}>FASE 01</Text>
              <Text style={styles.moves}>MOVIMENTOS: {moves}</Text>
            </View>

            <Text style={styles.gameMessage}>{message}</Text>

            <View style={styles.board}>
              {Array.from({ length: 4 }, (_, row) => (
                <View key={row} style={styles.boardRow}>
                  {Array.from({ length: 6 }, (_, col) => {
                    const cellTiles = tiles
                      .filter(
                        tile => tile.row === row && tile.col === col
                      )
                      .sort((a, b) => a.layer - b.layer);

                    return (
                      <View key={`${row}-${col}`} style={styles.cell}>
                        {cellTiles.map(tile => {
                          const free = isFree(tile, tiles);
                          const active = selected === tile.id;

                          return (
                            <Pressable
                              key={tile.id}
                              onPress={() => selectTile(tile)}
                              disabled={!free || won}
                              style={[
                                styles.tile,
                                {
                                  top: tile.layer === 0 ? 38 : 0,
                                  left: tile.layer === 0 ? 0 : 6,
                                  zIndex: tile.layer + 1,
                                },
                                !free && styles.blockedTile,
                                active && styles.selectedTile,
                              ]}
                            >
                              <Text style={styles.tileSymbol}>
                                {tile.symbol}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.gameInfo}>
              <Text style={styles.remaining}>
                Peças restantes: {tiles.length}
              </Text>
              <Text style={styles.gameHint}>
                Uma peça fica livre quando não tem outra por cima
                e pelo menos um dos lados está desocupado.
              </Text>
            </View>

            {won && (
              <View style={styles.winBox}>
                <Text style={styles.winTitle}>VOCÊ VENCEU! 🎉</Text>
                <Text style={styles.heroDescription}>
                  Sua primeira partida foi concluída!
                </Text>
                <Pressable style={styles.playButton} onPress={newGame}>
                  <Text style={styles.playText}>JOGAR NOVAMENTE</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              style={styles.secondaryButton}
              onPress={shuffleBoard}
            >
              <Text style={styles.secondaryText}>
                🔀 EMBARALHAR PEÇAS
              </Text>
            </Pressable>

            <Pressable
              style={styles.backButton}
              onPress={() => setScreen('seasons')}
            >
              <Text style={styles.backText}>VOLTAR ÀS TEMPORADAS</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.footer}>
          MAHJONG DORAMA · UMA HISTÓRIA A CADA PARTIDA
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17131F',
  },
  content: {
    padding: 22,
    paddingTop: 38,
    paddingBottom: 50,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    color: '#F5DDAE',
    fontSize: 35,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 5,
  },
  logoSubtitle: {
    color: '#D69AAB',
    textAlign: 'center',
    letterSpacing: 9,
    fontSize: 13,
    marginTop: 3,
    marginBottom: 28,
  },
  profile: {
    backgroundColor: '#292231',
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    fontSize: 30,
    marginRight: 12,
  },
  playerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  playerLevel: {
    color: '#BEB3C8',
    fontSize: 12,
    marginTop: 4,
  },
  coins: {
    marginLeft: 'auto',
  },
  coinText: {
    color: '#F5DDAE',
    fontWeight: 'bold',
  },
  hero: {
    backgroundColor: '#302536',
    borderWidth: 1,
    borderColor: '#79566D',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },
  heroTag: {
    color: '#E8B6C5',
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  heroEmoji: {
    fontSize: 48,
    marginVertical: 18,
  },
  heroTitle: {
    color: '#F8E6C8',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroDescription: {
    color: '#D0C2CF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 22,
  },
  playButton: {
    backgroundColor: '#D69AAB',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
  },
  playText: {
    color: '#291B29',
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#F5DDAE',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 13,
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#292231',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  statNumber: {
    color: '#F5DDAE',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#BEB3C8',
    fontSize: 12,
    marginTop: 4,
  },
  seasonCard: {
    backgroundColor: '#292231',
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonEmoji: {
    fontSize: 27,
  },
  seasonInfo: {
    flex: 1,
    marginLeft: 13,
  },
  seasonNumber: {
    color: '#C5A9B8',
    fontSize: 10,
    letterSpacing: 1,
  },
  seasonName: {
    color: '#F8EDE0',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
  },
  arrow: {
    color: '#F5DDAE',
    fontSize: 25,
    marginHorizontal: 8,
  },
  footer: {
    color: '#887B91',
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 25,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moves: {
    color: '#D0C2CF',
    fontSize: 12,
  },
  gameMessage: {
    color: '#F5DDAE',
    textAlign: 'center',
    fontSize: 15,
    marginVertical: 15,
    minHeight: 24,
  },
  board: {
    backgroundColor: '#292231',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
  },
  cell: {
    width: 46,
    height: 66,
    position: 'relative',
  },
  tile: {
    position: 'absolute',
    left: 0,
    width: 43,
    height: 56,
    borderRadius: 7,
    backgroundColor: '#F5E8D2',
    borderWidth: 2,
    borderColor: '#D5B98C',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },
  blockedTile: {
    opacity: 0.48,
    backgroundColor: '#B9AFA7',
  },
  selectedTile: {
    borderColor: '#E68DAA',
    borderWidth: 4,
    backgroundColor: '#FFE5EE',
  },
  tileSymbol: {
    fontSize: 25,
  },
  gameInfo: {
    backgroundColor: '#292231',
    borderRadius: 13,
    padding: 15,
    marginTop: 16,
  },
  remaining: {
    color: '#F5DDAE',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameHint: {
    color: '#BEB3C8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 9,
  },
  winBox: {
    backgroundColor: '#302536',
    borderRadius: 16,
    padding: 18,
    marginTop: 18,
    alignItems: 'center',
  },
  winTitle: {
    color: '#F5DDAE',
    fontSize: 22,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: '#D69AAB',
    borderWidth: 1,
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  secondaryText: {
    color: '#F5DDAE',
    fontWeight: 'bold',
  },
  backButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  backText: {
    color: '#D69AAB',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
