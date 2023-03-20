let score = 0;

let button = document.querySelector('#submitButton');
let wordInput = document.querySelector('#wordInput')
let scoreDisplay = document.querySelector('#scoreDisplay')
let timeDisplay = document.querySelector('#timeDisplay')
timeDisplay
const usedWords = new Set();
let gameOver=false;
let lastTimeoutID = -1;
button.addEventListener('click',(e)=>
{
    e.preventDefault();
    if(gameOver) return;
    GetAnswer()
})

async function GetAnswer()
{
    const word = wordInput.value;
    wordInput.value = "";
    if(usedWords.has(word))
    {
        alert("Already used the word!")
        return
    }
    const response = await axios.get('/checkWord',{params:{word:word}});
    if(response.data.result == "ok")
    {
        alert("Good one!")
        SaveScore(word)
    }
    else if(response.data.result == "not-on-board")
    {
        alert(`${word} is not on the board!`)
    }
    else
    {
        alert(`${word} is not in our dictionary!`)
    }
}

function SaveScore(word)
{
    score += word.length
    usedWords.add(word);
    scoreDisplay.innerHTML=score;
}
function StartTimer()
{
    if(lastTimeoutID!= -1)
    {
        clearTimeout(lastTimeoutID);
    }
    timeDisplay.innerHTML=20
    lastTimeoutID = setTimeout(()=>{
        gameOver = true;
        button.disabled = true;
        button.value="Game Over!"
        PostHighScore()
    },20000)
}
async function PostHighScore()
{
    console.log(score);
    const response = await axios.post('/postScore',{score:score});

}
setInterval(()=>{timeDisplay.innerHTML = (timeDisplay.innerHTML-0.1).toFixed(1)}, 100)
StartTimer();