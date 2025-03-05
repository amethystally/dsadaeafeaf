"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Country code to name mapping
const countryNames: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  JP: "Japan",
  CN: "China",
  RU: "Russia",
  BR: "Brazil",
  IN: "India",
  MX: "Mexico",
  KR: "South Korea",
  CH: "Switzerland",
  BE: "Belgium",
}

export function EmailFetcher({ isUsername = false }: { isUsername?: boolean }) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input) {
      setError(`Please enter a valid ${isUsername ? "username" : "email address"}`)
      return
    }

    if (!isUsername && !input.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/fetch-email-data?email=${encodeURIComponent(input)}&_=${timestamp}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.text()
      
      let formattedResult = data.trim()

      if (formattedResult.toUpperCase() === "SG") {
        formattedResult = "Account doesn't exist"
      } else if (formattedResult.length === 2 && /^[A-Z]{2}$/.test(formattedResult)) {
        const countryName = countryNames[formattedResult] || "Unknown Country"
        formattedResult = `${formattedResult} (${countryName})`
      }

      setResult(formattedResult)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="space-y-4 pb-6">
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          TikTok {isUsername ? "Username" : "Email"} Region Fetcher
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
          Enter a TikTok {isUsername ? "username" : "email address"} to discover its region
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Input
              type={isUsername ? "text" : "email"}
              placeholder={isUsername ? "@username" : "tiktok@example.com"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="h-14 px-6 text-lg rounded-xl border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-xl font-medium text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-all duration-300 relative overflow-hidden shine-effect active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch Region"
            )}
            <span className="absolute top-0 left-0 w-full h-full shine-element"></span>
          </Button>
        </form>

        {error && (
          <Alert
            variant="destructive"
            className="mt-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl"
          >
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Region:</h3>
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-sm">
              <p className="font-mono text-xl font-semibold text-pink-600 dark:text-pink-400">{result}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}