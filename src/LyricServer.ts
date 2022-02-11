type Word = {
    string: string
}

type LyricLine = {
    time: number
    words: Word[]
}

const recievers: string[] = ["http://localhost:5000"]

function getCurrentTrackId(){

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
    return fetchLyrics(id);
}

async function sendLyrics(lyrics: LyricLine[] | null){

    for (let recvr of recievers){
        Spicetify!!.CosmosAsync.post(recvr, {lyrics: lyrics})
    }

}

function Main(){

    Spicetify.Player.addEventListener("songchange", async () => {
       const currentLyrics = await getCurrentTrackLyrics();
       sendLyrics(currentLyrics)
    });
}
Main();
