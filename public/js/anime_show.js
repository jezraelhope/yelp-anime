// ==================================
//SELECT ELEMENTS
// ==================================

const downvoteBtn = document.getElementById("downvote-btn");
const upvoteBtn = document.getElementById("upvote-btn");
const score = document.getElementById("score");
import ColorThief from './node_modules/colorthief/dist/color-thief.umd.js'
const colorThief = new ColorThief();

// ==================================
//color thief demo
// ==================================
const imageColor = colorThief.getColor("https://upload.wikimedia.org/wikipedia/en/e/e5/SMVolume1.jpg")
console.log(imageColor)
// ==================================
//SEND VOTE
// ==================================

const sendVote = async (voteType) => {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
        //,body: ""
    }
    if(voteType === "up") {
        options.body = JSON.stringify({
            voteType: "up",
            animeId
        })
    } else if(voteType === "down") {
        options.body = JSON.stringify({
            voteType: "down",
            animeId
        })
    } else {
        throw "voteType must be 'up' or 'down' "
    }
    
    await fetch("/anime/vote", options)
    .then(data => {
        return data.json()
    })
    .then(res => {
        console.log(res)
        handleVote(res.score, res.code);
    })
    .catch(err => {
        console.log(err)
    }) 
    
}

const handleVote = (newScore, code) => {
    score.innerText = newScore
    if (code === 0) {
        upvoteBtn.classList.remove("btn-success");
        upvoteBtn.classList.add("btn-outline-success");
        downvoteBtn.classList.remove("btn-danger");
        downvoteBtn.classList.add("btn-outline-danger");
    } else if(code === 1) {
        upvoteBtn.classList.remove("btn-outline-success");
        upvoteBtn.classList.add("btn-success");
        downvoteBtn.classList.remove("btn-danger");
        downvoteBtn.classList.add("btn-outline-danger");
    } else if(code === -1) {
        upvoteBtn.classList.remove("btn-success");
        upvoteBtn.classList.add("btn-outline-success");
        downvoteBtn.classList.remove("btn-outline-danger");
        downvoteBtn.classList.add("btn-danger");
    } else {
        console.log("error in handleVote")
    }
}



// ==================================
//ADD EVENT LISTENERS
// ==================================
upvoteBtn.addEventListener("click", async function(){
    sendVote("up")
})
downvoteBtn.addEventListener("click", async function(){
    sendVote("down")
})