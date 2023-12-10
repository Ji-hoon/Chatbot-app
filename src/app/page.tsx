'use client'

import { useTheme } from "next-themes"
import { useEffect, useState, useMemo, CSSProperties } from "react";
import { MemoizedReactMarkdown } from "@/components/shared/Markdown";
import ScaleLoader from "react-spinners/ScaleLoader";

type Chat = {
    role: "User" | "Assistant";
    content: string;
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    height: "20px",
};

export default function Home() {
    const { theme, setTheme } = useTheme();
    const [ message, setMessage ] = useState("");
    const [question, setQuestion] = useState("");

    const [ messages, setMessages ] = useState<Chat[]>([]);

    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");

    //console.log("theme", theme);
    // 테마는 변경이 되는데, 클래스네임이 반영이 안되네...

    // async는 useEffect에서 사용할 수 없음
    // 즉시 실행 함수에 감싸 사용해야 함

    // IIFE
    // 즉시실행 함수 구문
    //소괄호 2개 사용 ()()
    // (function() {

    // })() 

    function handleQuestion(e:React.ChangeEvent<HTMLInputElement>) {
        setQuestion(e.target.value);
    }

    function postChatAPI() {
        console.log(question);
        //setMessage("");
        setLoading(true);

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
              setQuestion("");
              setLoading(false);

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
                {role : 'User', content : question},
                {role : 'Assistant', content : content}
              ]);
            }
    
          })()
    }

    return (
        <div className="py-3 px-5">
            <h3 className="py-3 text-2xl" >GPT에게 질문해보세요.
                <button className="bg-gray-800 dark:bg-gray-100 dark:text-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-md" 
                        style={{float:"right"}} 
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}</button>
            </h3>
            <div className="flex">
                <input className="px-3 py-2 text-sm shadow-sm rounded-md w-1/2 ring-gray-300 dark:ring-gray-900 ring-1 ring-inset"
                        placeholder="질문을 입력하고 질문하기 버튼을 클릭하세요."
                        onChange={(e) => handleQuestion(e)} value={question} />
                <button className="w-20 mx-1 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        onClick={postChatAPI} 
                        disabled={!question || loading}>
                    <ScaleLoader 
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        height={15}
                        aria-label="Loading Spinner" />{!loading && "질문하기"}</button>
            </div>
            <p className="my-3">
            {!messages &&  "질문을 입력해주세요."}
            {messages.map( (message, index) => (
                <div key={index} className="flex border-t border-gray-200 dark:border-gray-700 py-3">
                    <p className="w-1/6 text-indigo-600 py-2 px-3">{message.role}</p>
                    <p className="w-5/6 px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md">
                        <MemoizedReactMarkdown key={index}>{message.content}</MemoizedReactMarkdown>
                    </p>
                </div>)
            )}
            </p>
        </div>
    )
}