export async function googleAuth(credential) {
  const response = await fetch(
    "http://127.0.0.1:8000/google-login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  localStorage.setItem("token", data.access_token);

  return data;
}