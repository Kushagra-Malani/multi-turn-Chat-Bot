import { useState } from "react";

function App() {
  const [ans, setAns] = useState("")
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    "who won the latest noble peace prize ",
    "where does pizza come from",
    "how to make a sandwitch"
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random()*surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async() => {
    if(!value){
      setError("Error: Please enter a question")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      setAns(data)
      console.log(data);
      // setChatHistory([{
      //   role: "user",
      //   parts: value
      // },
      // {
      //   role: "model",
      //   parts: data
      // }
      // ])
      setValue("")
    } catch (error) {
      console.log(chatHistory);
      console.log(error);
      setError("Something went wrong! Please try again later")
    }
  }

  const clear = () => {
    setValue("");
    setError("")
    setChatHistory([])
  }

  return (
    <div className="App">
      <section className="search-section">
        <p>What do you want to know?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="When is Christmas...?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {/* {chatHistory.map((chatItem, idx) => <div key={idx}>
            <p className="answer">{chatItem.role} : {chatItem.parts}</p>
          </div>)} */}
          <p className="answer">{value} : {ans}</p>
        </div>
      </section>
    </div>
  );
}

export default App;

// run the react app frontent in a separate terminal from that of server.js by: npm run start:frontend