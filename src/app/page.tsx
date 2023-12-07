'use client'

import { useTheme } from "next-themes"

export default function Home() {
    const { theme, setTheme } = useTheme();
    console.log("theme", theme);
    return (
        <>
        <div className="text-blue-800 dark:bg-primary">Page</div>
        <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}
        </div>
      </>
    )
}