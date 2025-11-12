import axios from "axios";
import fs from "fs";
import path from "path";
import { ASSEMBLY_API_KEY, BASE_URL } from "../../../index";

export async function transcribeVoice(fileUrl: string, messageId: number): Promise<string | null> {
  const tmpDir = path.resolve("tmp");
  
  
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const oggPath = path.join(tmpDir, `voice_${messageId}.ogg`);

  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  fs.writeFileSync(oggPath, response.data);

  const uploadRes = await axios.post(`${BASE_URL}/upload`, response.data, {
    headers: {
      authorization: ASSEMBLY_API_KEY,
      "content-type": "application/octet-stream",
    },
  });

  const audioUrl = uploadRes.data.upload_url;

  const transcriptRes = await axios.post(
    `${BASE_URL}/transcript`,
    { audio_url: audioUrl, language_code: "en" },
    { headers: { authorization: ASSEMBLY_API_KEY } }
  );

  const transcriptId = transcriptRes.data.id;

  let text: string | null = null;
  while (true) {
    const pollingRes = await axios.get(`${BASE_URL}/transcript/${transcriptId}`, {
      headers: { authorization: ASSEMBLY_API_KEY },
    });
    const status = pollingRes.data.status;

    if (status === "completed") {
      text = pollingRes.data.text;
      break;
    } else if (status === "error") {
      throw new Error(`Transcription error: ${pollingRes.data.error}`);
    }

    await new Promise((res) => setTimeout(res, 3000));
  }

  if (fs.existsSync(oggPath)) {
    fs.unlinkSync(oggPath);
  }

  return text;
}
