type Word = {
    string: string
}

type LyricLine = {
    time: number
    words: Word[]
}

const recievers: string[] = ["localhost:5000"]
const sockets: Map<string, any> = new Map()

function importSocketIo(){

    return new Promise(resolve => {
        const tag = document.createElement("script");
        tag.src = "https://cdn.socket.io/4.4.1/socket.io.min.js";
        tag.integrity = "sha384-fKnu0iswBIqkjxrhQCTZ7qlLHOFEgNkRmK2vaO/LbTZSXdJfAu6ewRBdwHPhBo/H";
        tag.crossOrigin = "anonymous";
        tag.onload = resolve
        document.body.appendChild(tag);
    })
}

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

async function Main(){

    await importSocketIo();

    Spicetify.Player.addEventListener("songchange", async () => {
       const currentLyrics = await getCurrentTrackLyrics();
       sendLyrics(currentLyrics)
    });
}
Main();
