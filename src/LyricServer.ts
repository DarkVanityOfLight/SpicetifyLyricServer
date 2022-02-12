type Word = {
    string: string
}

type LyricLine = {
    time: number
    words: Word[]
}

const recievers: string[] = ["localhost:5000"]

function importSocketIo(){

    const tag = document.createElement("script");
    tag.src = "https://cdn.socket.io/4.4.1/socket.io.min.js";
    tag.integritiy = "sha384-fKnu0iswBIqkjxrhQCTZ7qlLHOFEgNkRmK2vaO/LbTZSXdJfAu6ewRBdwHPhBo/H";
    tag.crossorigin = "anonymous";
    document.body.appendChild(tag);
    return tag

}

function getCurrentTrackId(){

    if(Spicetify.Player.data.track == undefined){
        return null
    }
    const trackURI = Spicetify.Player.data.track.uri
    return getTrackId(trackURI)
}

function getTrackId(trackURI: string){
    return trackURI.split(":")[2]
}

async function fetchLyrics(id: string){

    const baseURL = "hm://lyrics/v1/track/";
    try{
        const resp = await Spicetify!!.CosmosAsync.get(baseURL + id);
        const lyrics: LyricLine[] = resp.lines
        return lyrics
    }catch (e){
        return null
    }

}

async function getCurrentTrackLyrics(){
    const id = getCurrentTrackId();
    if (id == null){
        return null
    }
    return fetchLyrics(id);
}

async function sendLyrics(lyrics: LyricLine[] | null){

    for (let recvr of recievers){
        Spicetify!!.CosmosAsync.post(recvr, {lyrics: lyrics})
    }

}

function Main(){

    constsocketIOTag = importSocketIo();
    
    Spicetify.Player.addEventListener("songchange", async () => {
       const currentLyrics = await getCurrentTrackLyrics();
       sendLyrics(currentLyrics)
    });
}
Main();
