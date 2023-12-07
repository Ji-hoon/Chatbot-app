'use client'

import { useTheme } from "next-themes"

export default function Home() {
    const { theme, setTheme } = useTheme();
    console.log("theme", theme);
    // 테마는 변경이 되는데, 클래스네임이 반영이 안되네...
    return (
        <>
        <div className="bg-white dark:bg-slate-800 dark:bg-primary">Page</div>
        <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}
        </div>
      </>
    )
}