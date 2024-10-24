"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, Pause, Play } from "lucide-react"

type CardType = {
  id: number
  suit: string
  value: string
  flipped: boolean
  matched: boolean
}

const suits = ["♥", "♦", "♠", "♣"]
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

const generateDeck = (): CardType[] => {
  const deck = suits.flatMap((suit, suitIndex) =>
    values.map((value, valueIndex) => ({
      id: suitIndex * 13 + valueIndex,
      suit,
      value,
      flipped: false,
      matched: false,
    }))
  )
  return deck.sort(() => Math.random() - 0.5)
}

export function TrumpCardMemoryGameComponent() {
  const [cards, setCards] = useState<CardType[]>(generateDeck())
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [pairsFound, setPairsFound] = useState(0)
  const [remainingTime, setRemainingTime] = useState(180) // 3分
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedCards, setSelectedCards] = useState<CardType[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && remainingTime > 0) {
      timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000)
    } else if (remainingTime === 0) {
      endGame()
    }
    return () => clearInterval(timer)
  }, [isPlaying, remainingTime])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
    }
  }, [score, highScore])

  const flipCard = (card: CardType) => {
    if (selectedCards.length === 2 || card.flipped || card.matched) return

    const newCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    setCards(newCards)
    setSelectedCards([...selectedCards, card])

    if (selectedCards.length === 1) {
      setTimeout(checkMatch, 1000)
    }
  }

  const checkMatch = () => {
      if (selectedCards.length !== 2) {
    console.error('Expected 2 selected cards, but got', selectedCards.length);
    return;
  }
    const [card1, card2] = selectedCards
    if (card1.value === card2.value) {
      setCards(
        cards.map((c) =>
          c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c
        )
      )
      const newCombo = combo + 1
      const comboMultiplier = newCombo <= 1 ? 1 : newCombo === 2 ? 1.2 : newCombo === 3 ? 1.5 : 2
      const baseScore = 100 + (card1.suit === card2.suit ? 50 : 0)
      const points = Math.floor(baseScore * comboMultiplier)
      setScore(score + points)
      setCombo(newCombo)
      setPairsFound(pairsFound + 1)
    } else {
      setTimeout(() => {
        setCards(
          cards.map((c) =>
            c.id === card1.id || c.id === card2.id ? { ...c, flipped: false } : c
          )
        )
      }, 1000)
      setCombo(0)
    }
    setSelectedCards([])
  }

  const togglePause = () => {
    setIsPlaying(!isPlaying)
  }

  const endGame = () => {
    setIsPlaying(false)
    // ゲーム終了時の処理をここに追加
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-4 flex justify-between items-center w-full max-w-4xl">
        <div className="text-2xl font-bold">スコア: {score}</div>
        <div className="text-xl">ハイスコア: {highScore}</div>
        <div className="text-xl">
          <Timer className="inline mr-2" />
          {formatTime(remainingTime)}
        </div>
        <div className="text-xl">コンボ: {combo}</div>
        <div className="text-xl">ペア: {pairsFound}/26</div>
        <Button onClick={togglePause}>{isPlaying ? <Pause /> : <Play />}</Button>
      </div>
      <div className="grid grid-cols-8 gap-2 max-w-4xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-16 h-24 flex items-center justify-center text-lg cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched
                ? card.suit === "♥" || card.suit === "♦"
                  ? "bg-red-500 text-white"
                  : "bg-primary text-primary-foreground"
                : "bg-accent"
            }`}
            onClick={() => flipCard(card)}
          >
            {card.flipped || card.matched ? (
              <div className="flex flex-col items-center">
                <div>{card.value}</div>
                <div>{card.suit}</div>
              </div>
            ) : (
              ""
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}