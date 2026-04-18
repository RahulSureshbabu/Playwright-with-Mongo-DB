const nameInput = document.getElementById("name-input");
const greetButton = document.getElementById("greet-btn");
const greetingOutput = document.getElementById("greeting-output");

greetButton.addEventListener("click", async () => {
  const name = nameInput.value;

  greetButton.disabled = true;
  greetingOutput.textContent = "Generating greeting...";

  try {
    const response = await fetch("/api/greet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    greetingOutput.textContent = data.greeting;
  } catch (_error) {
    greetingOutput.textContent = "Unable to generate greeting right now.";
  } finally {
    greetButton.disabled = false;
  }
});
