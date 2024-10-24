'use client'

import React, { useState } from "react"
import { Grid, List, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DiscoverScreenComponent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const images = [
    { id: 1, src: "/placeholder.svg?height=200&width=200", title: "Image 1", category: "Nature" },
    { id: 2, src: "/placeholder.svg?height=200&width=200", title: "Image 2", category: "Urban" },
    { id: 3, src: "/placeholder.svg?height=200&width=200", title: "Image 3", category: "Portrait" },
    { id: 4, src: "/placeholder.svg?height=200&width=200", title: "Image 4", category: "Abstract" },
    { id: 5, src: "/placeholder.svg?height=200&width=200", title: "Image 5", category: "Nature" },
    { id: 6, src: "/placeholder.svg?height=200&width=200", title: "Image 6", category: "Urban" },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ディスカバー</h1>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">グリッド表示</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">リスト表示</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="フィルター" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">カラー</SelectItem>
            <SelectItem value="style">スタイル</SelectItem>
            <SelectItem value="category">カテゴリー</SelectItem>
            <SelectItem value="size">サイズ</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="表示オプション" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="popular">人気順</SelectItem>
            <SelectItem value="relevant">関連度順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
        {images.map((image) => (
          <Card key={image.id} className={viewMode === "list" ? "flex" : ""}>
            <div className={`relative ${viewMode === "list" ? "w-1/3" : "w-full"}`}>
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
            <CardContent className={`p-4 ${viewMode === "list" ? "w-2/3" : "w-full"}`}>
              <h3 className="font-semibold mb-2">{image.title}</h3>
              <Badge>{image.category}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}