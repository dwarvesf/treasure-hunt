const BASE_URL = "https://treasure-hunt.fly.dev";

function getTeam(id?: string | number) {
  if (!id) return null;
  return fetch(`${BASE_URL}/api/teams/${id}`)
    .then((res) => res.json())
    .catch(() => null);
}

function answerClue(clueId: string | number, answer: string) {
  if (!answer) return null;
  return fetch(`${BASE_URL}/api/clues/${clueId}/answer`, {
    method: "POST",
    body: JSON.stringify({ answer }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch(() => null);
}

const api = { getTeam, answerClue };
export default api;
