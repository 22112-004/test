"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, Pause, Play } from "lucide-react"

// Define the card type
type Card = {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

// Generate a shuffled deck of cards
const generateCards = (): Card[] => {
  const values = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍑", "🍍", "🥝"]
  const cards = [...values, ...values].map((value, index) => ({
    id: index,
    value,
    flipped: false,
    matched: false,
  }))
  return cards.sort(() => Math.random() - 0.5)
}

export function CardMatchingGameComponent() {
  const [cards, setCards] = useState<Card[]>(generateCards())
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(180) // 3 minutes
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
    } else if (timeRemaining === 0) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [isPlaying, timeRemaining])

  const flipCard = (card: Card) => {
    if (selectedCards.length === 2 || card.flipped || card.matched) return

    const newCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    setCards(newCards)
    setSelectedCards([...selectedCards, card])

    if (selectedCards.length === 1) {
      setTimeout(checkMatch, 1000)
    }
  }

  const checkMatch = () => {
    const [card1, card2] = selectedCards
    if (card1.value === card2.value) {
      setCards(
        cards.map((c) => (c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c))
      )
      setScore(score + 100 + combo * 50)
      setCombo(combo + 1)
    } else {
      setCards(cards.map((c) => (c.id === card1.id || c.id === card2.id ? { ...c, flipped: false } : c)))
      setScore(Math.max(0, score - 10))
      setCombo(0)
    }
    setSelectedCards([])
  }

  const togglePause = () => {
    setIsPlaying(!isPlaying)
  }

  const endGame = () => {
    setIsPlaying(false)
    // Add game over logic here
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-4 flex justify-between items-center w-full max-w-md">
        <div className="text-2xl font-bold">スコア: {score}</div>
        <div className="text-xl">
          <Timer className="inline mr-2" />
          {formatTime(timeRemaining)}
        </div>
        <div className="text-xl">コンボ: {combo}</div>
        <Button onClick={togglePause}>{isPlaying ? <Pause /> : <Play />}</Button>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-md">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched ? "bg-primary text-primary-foreground" : "bg-accent"
            }`}
            onClick={() => flipCard(card)}
          >
            {card.flipped || card.matched ? card.value : ""}
          </Card>
        ))}
      </div>
    </div>
  )
}