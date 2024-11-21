export async function fetchMessageHistory(senderId, receiverId, lastEvaluatedKey = null, limit = 10) {
  try {
    const response = await fetch("https://8jtaj9psal.execute-api.eu-west-1.amazonaws.com/Dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization :"Bearer eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjODYxMDMyMC00MDkxLTcwOWUtNjQ5MS05ZjU0YmUzZTU4ZWMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMi0wOS0yNiIsImdlbmRlciI6Im1hbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9RUHVKZk9hRmMiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoiYzg2MTAzMjAtNDA5MS03MDllLTY0OTEtOWY1NGJlM2U1OGVjIiwib3JpZ2luX2p0aSI6IjQ0NTc5ZWE0LTA4NDMtNDc5ZC04YjkwLWI4ZGY2Y2MwNjA2ZCIsImF1ZCI6IjJtbnYxN3ZvYTdlOHE2YmFubGcwajBxdGgiLCJldmVudF9pZCI6IjQzODBmYmRjLWY0M2MtNGJhMS04OWUxLTM4ZDA1MmEyZDZmZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzMyMTY0ODAyLCJuYW1lIjoiQ2hpcmFuIiwicGhvbmVfbnVtYmVyIjoiKzkxOTk0MDU0MjU2MiIsImV4cCI6MTczMjI1MTIwMiwiY3VzdG9tOnJvbGUiOiJhZG1pbiIsImlhdCI6MTczMjE2NDgwMiwianRpIjoiZWUzMjI1YzYtODRkZC00NTU0LTlkMjgtYWFlNjM5ZDVhZGYwIiwiZW1haWwiOiJpdHNjaGlyYW4yNkBnbWFpbC5jb20ifQ.ADkateMHA4no9YxNde0oS7PtbB6eYGNxZtdH4l-h_V-QhwK3hQq-d3cRDc0uN3pkTfIvlBarF7pxK8Exb0vm7onQznCcCKaB8mrX42UaqNBUcRCy1vfwmjdKXlYEjkodCG2k6RdMxtHhRaAC4WaHZHC9gMosqs5ZtbeDcVEF4nl8uWb-6mYJ5jConS4rc0bweB_DXXjFnTYmFkMleBjXz-xLpUUus_Qql8hhldwyQHpi9QTfS5PtCqfaTbY2ttt9OsZclXG7PB7S2RgfGUpglWoHpMsYAAYUebh00R4EDH69xHhX7xJmgSVPKAnhDiDcO480kDMaegN0ItQpUZr9qg"
      },
      body: JSON.stringify({
        senderId: senderId,
        receiverId: receiverId,
        lastEvaluatedKey: lastEvaluatedKey, // Pass last evaluated key for pagination
        limit: limit,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch message history.");
    }

    const responseBody = await response.json();
    const data = JSON.parse(responseBody.body);

    const messages = data.messages.map((msg) => {
      // Convert the timestamp to a Date object
      const date = new Date(msg.timestamp);
      console.log(date);
      // Adjust to IST (UTC + 5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(date.getTime() + istOffset);
      console.log(istDate);
      // Format the IST date to a readable string and update the message object
      msg.timestamp = istDate; // Format as 'YYYY-MM-DD HH:MM:SS'
      console.log(msg.timestamp);
      return msg;
    });

    const newLastEvaluatedKey = data.lastEvaluatedKey || null;

    console.log("Converted messages:", messages);
    console.log("Extracted lastEvaluatedKey:", newLastEvaluatedKey);

    return { messages, lastEvaluatedKey: newLastEvaluatedKey };
  } catch (error) {
    console.error("Error fetching message history:", error);
    return { messages: [], lastEvaluatedKey: null };
  }
}
