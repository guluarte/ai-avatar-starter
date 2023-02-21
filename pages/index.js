import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const defaultPrompt = "big dog";
  const defaultVideoGame = "call of duty";
  const defaultLandscape = "alien";
  const maxRetries = 20;
  const [input, setInput] = useState(defaultPrompt);
  const [videogame, setVideogame] = useState(defaultVideoGame);
  const [landscape, setLandscape] = useState(defaultLandscape);
  const [img, setImg] = useState("");
  const [retry, setRetry] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // Add this function
  const onChange = (event) => {
    setInput(event.target.value);
  };
  const onChangeVideoGame = (event) => {
    setVideogame(event.target.value);
  };
  const onChangeLandscape = (event) => {
    setLandscape(event.target.value);
  };
  const generateAction = async () => {
    console.log("Generating...");

    if (isGenerating && retry === 0) return;

    // Set loading has started
    setIsGenerating(true);

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: JSON.stringify({ input, videogame, landscape }),
    });

    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }
    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    //setInput(defaultPrompt);
    setImg(data.image);

    setIsGenerating(false);
  };
  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>Game AI Avatar Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Game AI Avatar Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Turn your prompt into a videogame character</h2>
          </div>
          <div className="prompt-container">
            <h3>I'm a</h3>
            <input className="prompt-box" value={input} onChange={onChange} />
            <h3>in the game:</h3>
            <input
              className="prompt-box"
              value={videogame}
              onChange={onChangeVideoGame}
            />
            <h3>chilling in a [...] landscape:</h3>
            <input
              className="prompt-box"
              value={landscape}
              onChange={onChangeLandscape}
            />
            <div className="prompt-buttons">
              <a className="generate-button" onClick={generateAction}>
                <div className="generate">
                  {isGenerating ? (
                    <>
                      <p>
                        <span className="loader"></span>
                      </p>

                      {retry > 0 ? (
                        <>
                          <br />
                          <span>just {retry} seconds more</span>
                          <span className="span-text">
                            model still loading, the dev is too poor to pay for
                            a dedicated GPU LOL
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={finalPrompt} />
            {/* Add prompt here */}
            <p>{finalPrompt}</p>
          </div>
        )}
      </div>
      {!isGenerating ? (
        <div className="badge-container grow">
          <a href="https://buildspace.so" target="_blank" rel="noreferrer">
            <p>
              <Image src={buildspaceLogo} alt="buildspace logo" height={20} />{" "}
              build with
              <br /> buildspace 🧡
            </p>
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
