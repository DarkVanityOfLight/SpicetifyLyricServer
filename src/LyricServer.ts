

type Word = {
    string: string
}

type LyricLine = {
    time: number
    words: Word[]
}

function getCurrentTrackId(Player: any){

    const trackURI = Player.data.track.uri
    return getTrackId(trackURI)
}

function getTrackId(trackURI: string){
    return trackURI.split(":")[2]
}

async function fetchLyrics(CosmosAsync: any, id: string){

    const baseURL = "hm://lyrics/v1/track/";
    const resp = await CosmosAsync.get(baseURL + id);
    const lyrics: LyricLine = resp.lines

    return lyrics
}

function onQueueChange(){
    
}

(async function Main(){
    // @ts-ignore
    const {
        URI,
        Platform: { History },
        Player,
        CosmosAsync,
    } = Spicetify; 

    Spicetify.Player.origin._events.addListener("queue_update", onQueueChange);

)();
