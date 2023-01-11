import { Configuration, OpenAIApi} from "openai";
import React, { useState, useRef, useEffect} from "react";

import * as app from "./App.css";
const App = () => {
  const [askQuestion, setInput] = useState("");
  const [answer, setAnswer] = useState([]);
  const [language, setLanguage] = useState("");
  const divRef = useRef();
  
const api = import.meta.env.VITE_API_KEY;
  useEffect(()=> scrollToBottom, [answer,askQuestion]);

  const scrollToBottom = () => {
    divRef?.current?.lastChild?.scrollIntoView({ behavior: 'smooth', display:'block' });
  }
  const handleQuestionInput = (e) => {
    const input = e.target.value;
    setInput(input);
  };
  const configuration = new Configuration({
    apiKey: api,
  });
  const openai = new OpenAIApi(configuration);

  const submitQuestion = async () => {
    setAnswer((prev) => [...prev, { question: askQuestion }]);
    setInput("");
    try {
      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 3000,
        temperature: 0.5,
        prompt: `${askQuestion}`,
      });
      const reply = data.choices[0].text;
      setAnswer((prev) => [...prev, { answer: reply }]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div
          style={{
            background: "#5336d5",
            display: "flex",
            alignItems: "center",
            padding: "15px",
            height: "60px",
            width: "100%",
          }}
        >
          <i className="ri-robot-fill drop"> Demo Bot</i>
        </div>
        <div className="messages">
          {answer.map((element, index) => (
            <div
            
              key={index}
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {element.question && (
                <div
                  className="question"
                  style={{ alignSelf: "flex-end" }}
                >
                  {element.question}
                </div>
              )}
              {element.answer && (
                <div div ref={divRef} style={{display:'flex', alignSelf: "flex-start", flexDirection:'column', gap:'3px'}}>
                  <i
                    className="ri-robot-fill drop"
                    style={{
                      color: " white",
                      background: " #603fef",
                      width: "max-content",
                      height:'max-content',
                      padding: "5px",
                      borderRadius: "50%",
                    }}
                  ></i>
                  <div className="answer">{element?.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="form-container">
          <input
            className= "prompt" 
            onChange={(e) => {
              handleQuestionInput(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitQuestion();
              }
            }}
            value={askQuestion}
            placeholder="Aa"
            pattern="[a-z*]"
          />
          {askQuestion.length > 1 &&
          
          <i
            className="ri-send-plane-2-fill submit"
            onClick={submitQuestion}
         ></i>
          }
        </div>
      </div>
    </div>
  );
};

export default App;
