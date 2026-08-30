import pb from '@/lib/pocketbase/client'

export interface BingoDrawEntry {
  number: number
  drawn_at: string
  drawn_by?: string
}

export interface BingoGame {
  id: string
  title: string
  drawn_numbers: number[]
  last_number: number | null
  status: 'em_andamento' | 'pausado' | 'finalizado'
  round_prize?: string
  max_number: number // usually 75
  draw_history?: BingoDrawEntry[]
  created: string
  updated: string
}

/** Retorna a coluna do Bingo padrão de 75 bolas (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75) */
export function getBingoColumn(num: number): {
  letter: 'B' | 'I' | 'N' | 'G' | 'O'
  color: string
} {
  if (num <= 15) return { letter: 'B', color: 'bg-pink-600 text-white border-pink-500' }
  if (num <= 30) return { letter: 'I', color: 'bg-purple-600 text-white border-purple-500' }
  if (num <= 45) return { letter: 'N', color: 'bg-blue-600 text-white border-blue-500' }
  if (num <= 60) return { letter: 'G', color: 'bg-cyan-600 text-white border-cyan-500' }
  return { letter: 'O', color: 'bg-orange-500 text-white border-orange-400' }
}

/**
 * Busca a partida ativa de bingo atual
 */
export async function getCurrentBingoGame(): Promise<BingoGame | null> {
  try {
    const list = await pb.collection('bingo_games').getList<BingoGame>(1, 1, {
      sort: '-updated,-created',
    })
    return list.items[0] || null
  } catch (error) {
    console.error('Erro ao buscar jogo de bingo:', error)
    return null
  }
}

/**
 * Cria ou reinicia uma nova partida de bingo
 */
export async function createOrResetBingoGame(params?: {
  title?: string
  round_prize?: string
  max_number?: number
}): Promise<BingoGame> {
  const currentGame = await getCurrentBingoGame()

  const payload = {
    title: params?.title || 'Super Bingo Beneficente Abraçolândia 2025',
    round_prize: params?.round_prize || 'Smart TV 55" 4K + Prêmios Especiais',
    max_number: params?.max_number || 75,
    drawn_numbers: [],
    last_number: null,
    draw_history: [],
    status: 'em_andamento',
  }

  if (currentGame) {
    return await pb.collection('bingo_games').update<BingoGame>(currentGame.id, payload)
  } else {
    return await pb.collection('bingo_games').create<BingoGame>(payload)
  }
}

/**
 * Sorteia o próximo número aleatoriamente
 */
export async function drawNextRandomNumber(
  gameId: string,
  drawnBy: string = 'Equipe do Palco',
): Promise<{ game: BingoGame; drawnNumber: number }> {
  const game = await pb.collection('bingo_games').getOne<BingoGame>(gameId)
  const max = game.max_number || 75
  const currentDrawn = game.drawn_numbers || []

  // Filtrar todos os números restantes disponíveis
  const available: number[] = []
  for (let i = 1; i <= max; i++) {
    if (!currentDrawn.includes(i)) {
      available.push(i)
    }
  }

  if (available.length === 0) {
    throw new Error('Todos os números (1 a ' + max + ') já foram sorteados nesta partida!')
  }

  // Escolher aleatoriamente
  const randomIndex = Math.floor(Math.random() * available.length)
  const chosenNumber = available[randomIndex]

  const updatedDrawn = [...currentDrawn, chosenNumber]
  const updatedHistory = [
    ...(game.draw_history || []),
    {
      number: chosenNumber,
      drawn_at: new Date().toISOString(),
      drawn_by: drawnBy,
    },
  ]

  const updatedGame = await pb.collection('bingo_games').update<BingoGame>(gameId, {
    drawn_numbers: updatedDrawn,
    last_number: chosenNumber,
    draw_history: updatedHistory,
  })

  return { game: updatedGame, drawnNumber: chosenNumber }
}

/**
 * Marca manualmente um número cantado no globo físico
 */
export async function markManualNumber(
  gameId: string,
  num: number,
  drawnBy: string = 'Globo Físico',
): Promise<{ game: BingoGame; markedNumber: number }> {
  const game = await pb.collection('bingo_games').getOne<BingoGame>(gameId)
  const max = game.max_number || 75
  const currentDrawn = game.drawn_numbers || []

  if (num < 1 || num > max) {
    throw new Error(`O número deve estar entre 1 e ${max}.`)
  }

  if (currentDrawn.includes(num)) {
    throw new Error(`O número ${num} já foi cantado/sorteado anteriormente!`)
  }

  const updatedDrawn = [...currentDrawn, num]
  const updatedHistory = [
    ...(game.draw_history || []),
    {
      number: num,
      drawn_at: new Date().toISOString(),
      drawn_by: drawnBy,
    },
  ]

  const updatedGame = await pb.collection('bingo_games').update<BingoGame>(gameId, {
    drawn_numbers: updatedDrawn,
    last_number: num,
    draw_history: updatedHistory,
  })

  return { game: updatedGame, markedNumber: num }
}

/**
 * Desfaz a última chamada de número caso tenha havido engano
 */
export async function undoLastDrawnNumber(gameId: string): Promise<BingoGame> {
  const game = await pb.collection('bingo_games').getOne<BingoGame>(gameId)
  const currentDrawn = [...(game.drawn_numbers || [])]
  const currentHistory = [...(game.draw_history || [])]

  if (currentDrawn.length === 0) {
    throw new Error('Nenhum número foi sorteado ainda para desfazer.')
  }

  currentDrawn.pop()
  currentHistory.pop()

  const newLast = currentDrawn.length > 0 ? currentDrawn[currentDrawn.length - 1] : null

  return await pb.collection('bingo_games').update<BingoGame>(gameId, {
    drawn_numbers: currentDrawn,
    last_number: newLast,
    draw_history: currentHistory,
  })
}

/**
 * Atualiza status e prêmio da rodada de bingo
 */
export async function updateBingoSettings(
  gameId: string,
  data: {
    title?: string
    round_prize?: string
    status?: 'em_andamento' | 'pausado' | 'finalizado'
  },
): Promise<BingoGame> {
  return await pb.collection('bingo_games').update<BingoGame>(gameId, data)
}
