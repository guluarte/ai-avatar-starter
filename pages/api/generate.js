import fs from "fs";

const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
  return `data:image/png;base64,${base64}`;
};

function getRandomFileName() {
  var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  var random = ("" + Math.random()).substring(2, 8);
  var random_number = timestamp + random;
  return random_number;
}

const generateAction = async (req, res) => {
  console.log("Received request");

  const input = JSON.parse(req.body).input;
  const videogame = JSON.parse(req.body).videogame;
  const landscape = JSON.parse(req.body).landscape;

  // Art Medium + The actual things you want in the image + Art Styles (could be an artist or an actual style like Renaissance) + Modifications (extra details on how the image should look)

  // Illustration of jupiter clouds by dan mumford, yellow planets, green tinted colors, uhd

  // input + rodo hale + roblox/fornite + landscape

  // roblox, fornite, zelda, mario, call of duty

  // const videogameStyle = "fornite"
  // const landscape = "fantasy"

  const basePrompt = `avatar of rodo hale as a ${input}, ${videogame} style art, ${landscape} landscape, epic scene, high exposure, highly detailed, fantastical, vibrant colors, uhd, looking at the camera`;

  console.log(basePrompt)

  const response = await fetch(
    `https://api-inference.huggingface.co/models/guluarte/fornite-style-avatar`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: basePrompt,
      }),
    }
  );


  // Check for different statuses to send proper payload
  if (response.ok) {
    const buffer = await response.arrayBuffer();
    // Make sure to change to base64
    // const filename = `/images/generated/${getRandomFileName()}.png`;
    // fs.writeFileSync(`public${filename}`, Buffer.from(buffer));
    res.status(200).json({ image: bufferToBase64(buffer) });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
