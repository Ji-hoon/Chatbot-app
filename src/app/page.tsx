'use client'

import { useTheme } from "next-themes"
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import { MemoizedReactMarkdown } from "@/components/shared/Markdown";

type Chat = {
    role: "user" | "assistant";
    content: string;
}

export default function Home() {
    const { theme, setTheme } = useTheme();
    const [ message, setMessage ] = useState("");
    const [question, setQuestion] = useState("");

    const [ messages, setMessages ] = useState<Chat[]>([]);

    //console.log("theme", theme);
    // 테마는 변경이 되는데, 클래스네임이 반영이 안되네...

    // async는 useEffect에서 사용할 수 없음
    // 즉시 실행 함수에 감싸 사용해야 함

    // IIFE
    // 즉시실행 함수 구문
    //소괄호 2개 사용 ()()
    // (function() {

    // })() 

    function handleQuestion(e) {
        setQuestion(e.target.value);
    }

    function postChatAPI() {
        console.log(question);
        //setMessage("");

        (async () => {
            const response = await fetch("/api/chat", {
              method: "POST",
              body : JSON.stringify({
                // 보낼 때 message 히스토리도 포함되어야 한다.
                "messages" : [
                    ...messages,
                    {
                        role: 'user',
                        content: question,
                    }
                ],
              }),
            });
            //setMessage(`Q. ${question} : `);
            //if(question !== "") setQuestion("");
    
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let content ="";
            if(!reader) return;
    
            while (true) {
              
              const { done, value } = await reader.read();
    
              if(done) {
                console.log("done!"); 
                break;
              }
              const decodedValue = decoder.decode(value);
              content += decodedValue;
              //console.log(decodedValue);
              //setMessage((v) => v + decodedValue);
              setMessages([
                ...messages,
                {role : 'user', content : question},
                {role : 'assistant', content : content}
              ]);
            }
    
          })()
    }

    return (
        <>
        <h3 className="bg-white dark:bg-slate-800 dark:bg-primary">GPT에게 질문해보세요.
        <button style={{float:"right"}} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}
        </button></h3>
        <input onChange={(e) => handleQuestion(e)} value={question} />
        <button onClick={postChatAPI} disabled={!question}>질문!</button>
        <p>
            {!messages &&  "질문을 입력해주세요."}
            {messages.map( (message, index) => (
                <div key={index} className="flex">
                    <div>{message.role}</div>
                    <MemoizedReactMarkdown key={index}>{message.content}</MemoizedReactMarkdown>
                    </div>)
            )}
            </p>
      </>
    )
}