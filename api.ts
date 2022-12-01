import { Md5 } from "ts-md5";

const BASE_URL = "https://df-treasure-hunt-2022.fly.dev";

function getTeam(id?: string | number) {
  if (!id) return null;
  return fetch(`${BASE_URL}/api/teams/${id}`)
    .then((res) => res.json())
    .catch(() => null);
}

function getQuestion(teamId: string, questionCode: string) {
  const hash = Md5.hashStr(`${questionCode}${teamId}`);
  return fetch(`${BASE_URL}/api/questions/${hash}`)
    .then((res) => res.json())
    .catch(() => null);
}

function answerClue(clueId: string | number, answers: Array<string>) {
  if (!answers) return null;
  return fetch(`${BASE_URL}/api/clues/${clueId}/answer`, {
    method: "POST",
    body: JSON.stringify({ answers }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch(() => null);
}

const api = { getTeam, getQuestion, answerClue };
export default api;
