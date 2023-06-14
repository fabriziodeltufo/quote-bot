/*  -----------------------------------------------------------------------------------------------
  chatGPT CONFIG.
--------------------------------------------------------------------------------------------------- */
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY = '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';


/*  -----------------------------------------------------------------------------------------------
  VARIABLES WEB APP
--------------------------------------------------------------------------------------------------- */
const character = document.querySelectorAll('.character'); // array
const loader = document.querySelector(".loading");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const saveBtn = document.querySelector('#save');
const shareBtn = document.querySelector('#share');




/*  -----------------------------------------------------------------------------------------------
  FUNCTIONS
--------------------------------------------------------------------------------------------------- */

// GENERATE RANDOM ACTIONS 
function getRandomAction() {
    const actions = [
        'saluta nel tuo modo più iconico',
        'dai un consiglio di stile in base ai tuoi gusti',
        'racconta la tua ultima avventura',
        'svelami i tuoi sogni',
        'dimmi chi è il tuo migliore amico',
        'scrivi la tua bio di linkedin'
    ];


    // da zero a 5 
    const indexRandom = Math.floor(Math.random() * actions.length);
    return actions[indexRandom];
}


// PLAY GAME
async function playCharacter(nameCharacter) {

    console.log(nameCharacter);

    // show loader
    loader.classList.remove("loading-hidden");


    // genera azione random x prompt GPT
    const action = getRandomAction();

    // crea promptGPT con personaggio e azione
    const completeChat = []; // array contiene prompt x GPT

    completeChat.push({
        role: "user",
        content: `Sei ${nameCharacter} e ${action} con un massimo di 100 caratteri senza mai uscire dal tuo personaggio `
    });

    console.log(completeChat);

    // setta livello di creativita di GPT
    const temperature = 0.7;


    // passa tutti i parametri a Open AI API x interrogare chatGPT
    const response = await fetch(API_URL, {

        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: completeChat,
            temperature: temperature
        })

    })

    // ritorna da chatGPT la risposta e la converte in json nella variabile data
    const data = await response.json();

    // convertito in json, legge il msg creato da chatGPT
    const message = data.choices[0].message.content;

    // hide loader
    loader.classList.add("loading-hidden");


    // delete blank to convert nameCharacter to nameImage connected to Charater
    const nameImage = nameCharacter.replace(/\s+/g, '-');

    // mostra modal con valori da chatGPT
    modalContent.innerHTML = `
    <div class="character"><img src="./images/${nameImage}.png"></div>
    <h2>${nameCharacter}</h2>
    <p>${message}</p>
    <code>Character: ${nameCharacter} | Action: ${action} | Temperature: ${temperature}</code> `;

    modal.classList.remove("modal-hidden");
}


// SAVE QUOTE TO IMAGE
function saveQuote() {
    html2canvas(modalContent).then(function (canvas) {
        // document.body.appendChild(canvas);
        console.log(canvas);
        const dataURL = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'quote.jpg';
        link.click();
    });
}


//  SHARE THE QUOTE
function shareQuote() {

    // 1. collect msg to share - prelevato dirett da modal content
    const modalNameCharacter = modal.querySelector('h2').innerText;
    const modalQuote = modal.querySelector('p').innerText;

    const text = `Senti cosa ha da dire ${modalNameCharacter} : "${modalQuote}" #quoteBOT #BooleanCodingWeek2023 `


    // 2. share API
    if (navigator.canShare) {
        navigator.share({ text: text });

    } else {

        console.error('share API not supported');
        fallbackShare();
    }
}


// FALLBACKSHARE
function fallbackShare() {
    const href = 'https://wa.me/?text=${ encodeURIComponent(text) }';
    window.location.href = href;
}


/*  -----------------------------------------------------------------------------------------------
  INIT AND EVENTS
--------------------------------------------------------------------------------------------------- */

// PLAY GAME - QUOTE BY BOT
character.forEach(function (element) {
    element.addEventListener('click', function () {
        playCharacter(element.dataset.description);
    })
})


// MODAL-CLOSE
modalClose.addEventListener('click', function () {
    modal.classList.add("modal-hidden");
    loader.classList.add("loading-hidden");
    // reset console to start new game
    console.clear();
})


// SAVE BUTTON
saveBtn.addEventListener('click', saveQuote);


// SHARE BUTTON
shareBtn.addEventListener('click', shareQuote);








