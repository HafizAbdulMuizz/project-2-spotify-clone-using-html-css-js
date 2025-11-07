console.log("Lets Write JawaScript!");
let currentsong = new Audio;
let currentsongname = '';
let songs;
let currfolder;
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // agar seconds single digit hon to 0 laga do (e.g., 2:05)
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    return `${mins}:${paddedSecs}`;
}
// ye getsong function jo commented ha ye us developer ka ah jaha se me practice kar raha hu
// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`/${folder}/`)[1]);
//         }
//     }
// }

// mera getsong is se thora sa different ha kio keh mene fetch json file k through kiya ha kio keh mera local server ha 
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`${folder}.json`);
    songs = await a.json();
    // return response

    let songurl = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songurl.innerHTML = ""
    for (const song of songs) {
        songurl.innerHTML = songurl.innerHTML + `<li> 
    
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div class="songname">${song}</div>
                                <div class="artist">HArry</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                   <img class="invert" src="play.svg" alt="">
                                </div>
                                
                            </div></li>`

    }
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            playmusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
        });
    })
    return songs

}
function playmusic(track, pause = false) {

    currentsong.src = (`${currfolder}/${track}`);
    currentsongname = track
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00";
}
async function displayallalbums() {
    let a = await fetch("songs/albums.json");
    let response = await a.json();
    let array = Array.from(response);
    let cardcontainer = document.querySelector(".containercard")
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        let folder = e
        let a = await fetch(`songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response);
        cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="play.svg" alt="">
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">

                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])

        })

    });
}
async function main() {
    await getsongs("songs/hiphop")
    playmusic(songs[0], true)
    // ye comment kiya hoa function wo ha jo us developer ne likha h jaha se me practice kar raha ha development ki
    //     async function displayAlbums() {
    //     let a = await fetch(`http://127.0.0.1:3000/songs/`);
    //     let response = await a.text();
    //     let div = document.createElement("div");
    //     div.innerHTML = response;
    //     let anchors = div.getElementsByTagName("a");

    //     Array.from(anchors).forEach(e => {
    //         if (e.href.includes("/songs")) {
    //             console.log(e.href.split("/").slice(-2)[0]);
    //         }
    //     });
    // }
    // AB mujhy ye smjh nhi a rhi keh developer ne jo code likha ha displayalbum ka us tareeqay se shaad me nhi kar sakta kio ke mene json use kiay ha fetch arnay k liye mera folder main songs ha usk ander cs or ncs k folders ha or ncs or cs k songs paray ha or ncs or cs k json file songs folder me hi ha 
    displayallalbums();
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "play.svg"


        }

    })
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"

    })
    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentsongname)
        console.log(index)
        console.log(index)
        if ([index - 1] >= 0) {
            playmusic(songs[index - 1])
            console.log("prev clicked")
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsongname)
        console.log(index)
        if ([index + 1] < songs.length) {
            playmusic(songs[index + 1])
            console.log("next clicked")
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = (e.target.value / 100)
    })
    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }

    })

}
main();
