const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value.trim());
});

const getWordInfo = async (word) => {
    if (!word) {
        resultDiv.innerHTML = "<p>Please enter a word.</p>";
        return;
    }

    try {
        resultDiv.innerHTML = "Fetching Data...";
        // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Word not found");
        }
    
        // const data = await response.json();
        if (!data.length) {
            throw new Error("No data available");
        }
        let meanings = data[0].meanings[0] || {};
        let definitions = meanings.definitions ? meanings.definitions[0] || {} : {};
        let phonetics = data[0].phonetics.find(p => p.audio) || {};
        let audioUrl = phonetics.audio || "";
        resultDiv.innerHTML = `
            <h2><strong>Word:</strong> ${data[0].word}</h2>
            <p class="partOfSpeech">${meanings.partOfSpeech || "Not Available"}</p>
            <p><strong>Meaning:</strong> ${definitions.definition || "Not found"}</p>
            <p><strong>Example:</strong> ${definitions.example || "Not Found"}</p>
        `;

        // Fetching antonyms
        resultDiv.innerHTML += `<p> <strong>Antonyms:</strong></p>`;
        if (!definitions.antonyms || definitions.antonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            definitions.antonyms.forEach(antonym => {
                resultDiv.innerHTML += `<li>${antonym}</li>`;
            });
        }
        // Fetching synonyms
        resultDiv.innerHTML += `<p> <strong>Synonyms:</strong> </p>`;
        if (!definitions.synonyms || definitions.synonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            definitions.synonyms.forEach(synonym => {
                resultDiv.innerHTML += `<li>${synonym}</li>`;
            });
        }
        // Adding more details
        resultDiv.innerHTML += `<div><a href="${data[0].sourceUrls ? data[0].sourceUrls[0] : '#'}" target="_blank">Read More</a></div>`;
        // Adding pronunciation audio
        if (audioUrl) {
            resultDiv.innerHTML += `
                <p class="audio"><strong>Pronunciation:</strong>
                    <button id="playAudio">Play</button>
                </p>
                <audio id="audio" src="${audioUrl}"></audio>
            `;
            document.getElementById('playAudio').addEventListener('click', () => {
                document.getElementById('audio').play();
            });
        } else {
            resultDiv.innerHTML += `<p><strong>Pronunciation:</strong> Not Available</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Sorry, the word could not be found</p>`;
    }
};