// Dropzone
const myDropzone = new Dropzone(document.body, {
  previewsContainer: false,
  clickable: false,
  url: "/api/v1/file-explorer/upload",
  maxFilesize: null,
});

myDropzone.on("addedfile", (file) => {
  if (programState[0].state !== "fileExplorer") {
    iziToast.error({
      title: "Files can only be added to the file explorer",
      position: "topCenter",
      timeout: 3500,
    });
    myDropzone.removeFile(file);
  } else if (fileExplorerArray.length < 1) {
    iziToast.error({
      title: "Cannot Upload File Here",
      position: "topCenter",
      timeout: 3500,
    });
    myDropzone.removeFile(file);
  } else {
    if (file.fullPath) {
      file.directory =
        getFileExplorerPath() +
        file.fullPath.substring(0, file.fullPath.indexOf(file.name));
    } else {
      file.directory = getFileExplorerPath();
    }
  }
});

myDropzone.on("sending", (file, xhr, formData) => {
  xhr.setRequestHeader("data-location", encodeURI(file.directory));
  xhr.setRequestHeader("x-access-token", MSTREAMAPI.currentServer.token);
});

myDropzone.on("totaluploadprogress", (percent, uploaded, size) => {
  document.getElementById("upload-progress-inner").style.width = percent + "%";
  if (percent === 100) {
    document.getElementById("upload-progress-inner").style.width = "0%";
  }
});

myDropzone.on("queuecomplete", (file, xhr, formData) => {
  var successCount = 0;
  for (var i = 0; i < myDropzone.files.length; i++) {
    if (myDropzone.files[i].status === "success") {
      successCount += 1;
    }
  }

  if (successCount === myDropzone.files.length) {
    iziToast.success({
      title: "Files Uploaded",
      position: "topCenter",
      timeout: 3500,
    });
    if (programState[0].state === "fileExplorer") {
      senddir();
    }
  } else if (successCount === 0) {
    // do nothing
  } else {
    iziToast.warning({
      title:
        successCount +
        " out of " +
        myDropzone.files.length +
        " were uploaded successfully",
      position: "topCenter",
      timeout: 3500,
    });

    if (programState[0].state === "fileExplorer") {
      senddir();
    }
  }

  myDropzone.removeAllFiles();
});

myDropzone.on("error", (err, msg, xhr) => {
  var iziStuff = {
    title: "Upload Failed",
    position: "topCenter",
    timeout: 3500,
  };

  if (msg.error) {
    iziStuff.message = msg.error;
  }

  iziToast.error(iziStuff);
});

////////////////////////////// Global Variables
// These vars track your position within the file explorer
var fileExplorerArray = [];
// Stores an array of searchable objects
var currentBrowsingList = [];
// This variable tracks the state of the explorer column
var programState = [];

let curFileTracker;

const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, (s) => {
    return entityMap[s];
  });
}

function renderAlbum(id, artist, name, albumArtFile, year) {
  return `<li class="collection-item">
    <div ${year ? `data-year="${year}"` : ""} ${artist ? `data-artist="${artist}"` : ""
    } ${id ? `data-album="${id}"` : ""
    } class="albumz flex2" onclick="getAlbumsOnClick(this);">
        ${albumArtFile
      ? `<img class="album-art-box" loading="lazy" src="${MSTREAMAPI.currentServer.host}album-art/${albumArtFile}?compress=s&token=${MSTREAMAPI.currentServer.token}">`
      : '<svg xmlns="http://www.w3.org/2000/svg" class="album-art-box" viewBox="0 0 512 512" xml:space="preserve"><path d="M437 75C390.7 28.6 326.7 0 256 0 114.6 0 0 114.6 0 256c0 70.7 28.6 134.7 75 181s110.3 75 181 75c141.4 0 256-114.6 256-256 0-70.7-28.6-134.7-75-181zM256 477.9c-122.3 0-221.9-99.5-221.9-221.9S133.7 34.1 256 34.1 477.9 133.7 477.9 256 378.3 477.9 256 477.9z"/><path d="M256 145.1c-61.3 0-110.9 49.7-110.9 110.9S194.7 366.9 256 366.9 366.9 317.3 366.9 256c0-61.2-49.7-110.9-110.9-110.9zm0 187.7c-42.4 0-76.8-34.4-76.8-76.8s34.4-76.8 76.8-76.8 76.8 34.4 76.8 76.8-34.4 76.8-76.8 76.8z"/><path d="M238.9 238.9H273V273h-34.1zM256 102.4V68.3h-.6c-31 0-60.1 7.6-85.8 21l1-.5c-26 13.5-47.7 31.9-64.5 54.2l-.3.5 27.3 20.5c28.1-37.5 72.4-61.5 122.3-61.5l.6-.1z"/></svg>'
    }
        <span><b>${name}</b> ${year ? `<br>[${year}]` : ""}</span>
    </div>
  </li>`;
}

function renderArtist(artist) {
  return `<li class="collection-item">
      <div data-artist="${artist}" class="artistz" onclick="getArtistz(this)">${artist}</div>
    </li>`;
}

function renderFileWithMetadataHtml(filepath, lokiId, metadata) {
  return `<li data-lokiid="${lokiId}" class="collection-item">
    
    <div data-file_location="${filepath}" class="filez flex">
    
      <img class="album-art-box" loading="lazy" ${metadata["album-art"]
      ? `src="${MSTREAMAPI.currentServer.host}album-art/${metadata["album-art"]}?compress=s&token=${MSTREAMAPI.currentServer.token}"`
      : 'src="assets/img/default.png"'
    }>
      <div>
        <b><span>${!metadata || !metadata.title
      ? filepath.split("/").pop()
      : `${metadata.title}`
    }</span></b>
        ${metadata.artist
      ? `</b><br><span style="font-size:15px;">${metadata.artist}</span>`
      : ""
    }
      </div>
    </div>
  
    <div class="song-button-box">
      <span title="Play Now" onclick="playNow(this);" data-file_location="${filepath}" class="songDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.5 5H11l5 7-5 7h4.5l5-7z"/><path d="M8.5 5H4l5 7-5 7h4.5l5-7z"/></svg>
      </span>
      <span data-lokiid="${lokiId}" class="removePlaylistSong" onclick="removePlaylistSong(this);">remove</span>
    </div>
  </li>`;
}

function createMusicFileHtml(fileLocation, title, aa, rating, subtitle) {
  return `<li class="collection-item">
    <div data-file_location="${fileLocation}" class="filez ${aa ? "flex2" : ""
    }"  id="newfileLocation" onclick="onFileClick(this);">
      ${aa
      ? `<img loading="lazy" class="album-art-box" ${aa}>`
      : '<svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z" fill="#8A#7f0"/><path d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z" fill="#4e7ab5"/></svg>'
    } 
      <span>
        ${subtitle !== undefined ? `<b>` : ""}
        <span class="${aa ? "" : "item-text"}">${rating ? `[${rating}] ` : ""
    }${title}</span>
        ${subtitle !== undefined ? `</b><br><span>${subtitle}</span>` : ""}
      </span>
    </div>
    <div class="song-button-box">
      <span title="Play Now" onclick="playNow(this);" data-file_location="${fileLocation}" class="songDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.5 5H11l5 7-5 7h4.5l5-7z"/><path d="M8.5 5H4l5 7-5 7h4.5l5-7z"/></svg>
      </span>
      <span title="Add To Playlist" onclick="createPopper3(this);" data-file_location="${fileLocation}" class="fileAddToPlaylist">
        <svg class="pop-f" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 292.362 292.362"><path class="pop-f" d="M286.935 69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952 0-9.233 1.807-12.85 5.424C1.807 72.998 0 77.279 0 82.228c0 4.948 1.807 9.229 5.424 12.847l127.907 127.907c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428L286.935 95.074c3.613-3.617 5.427-7.898 5.427-12.847 0-4.948-1.814-9.229-5.427-12.85z"/></svg>
      </span>
    </div>
  </li>`;
}

function renderDirHtml(name) {
  return `<li class="collection-item">
    <div data-directory="${name}" class="dirz" onclick="handleDirClick(this);">
      <svg class="folder-image" viewBox="0 0 48 48" version="1.0" xmlns="http://www.w3.org/2000/svg"><path fill="#FFA000" d="M38 12H22l-4-4H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h31c1.7 0 3-1.3 3-3V16c0-2.2-1.8-4-4-4z"/><path fill="#FFCA28" d="M42.2 18H15.3c-1.9 0-3.6 1.4-3.9 3.3L8 40h31.7c1.9 0 3.6-1.4 3.9-3.3l2.5-14c.5-2.4-1.4-4.7-3.9-4.7z"/></svg>
      <span class="item-text">${name}</span>
    </div>
    <div class="song-button-box">
      <span style="padding-top:1px;" title="Add All To Queue" class="songDropdown" onclick="recursiveAddDir(this);" data-directory="${name}">
        <svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 1280 1276"><path d="M6760 12747 c-80 -5 -440 -10 -800 -11 -701 -2 -734 -4 -943 -57 -330 -84 -569 -281 -681 -563 -103 -256 -131 -705 -92 -1466 12 -241 16 -531 16 -1232 l0 -917 -1587 -4 c-1561 -3 -1590 -3 -1703 -24 -342 -62 -530 -149 -692 -322 -158 -167 -235 -377 -244 -666 -43 -1404 -42 -1813 7 -2355 21 -235 91 -400 233 -548 275 -287 730 -389 1591 -353 1225 51 2103 53 2330 7 l60 -12 6 -1489 c6 -1559 6 -1548 49 -1780 100 -535 405 -835 933 -921 88 -14 252 -17 1162 -24 591 -4 1099 -4 1148 1 159 16 312 56 422 112 118 59 259 181 333 290 118 170 195 415 227 722 18 173 21 593 6 860 -26 444 -32 678 -34 1432 l-2 811 54 7 c30 4 781 6 1670 5 1448 -2 1625 -1 1703 14 151 28 294 87 403 168 214 159 335 367 385 666 15 85 29 393 30 627 0 105 4 242 10 305 43 533 49 1047 15 1338 -44 386 -144 644 -325 835 -131 140 -278 220 -493 270 -92 21 -98 21 -1772 24 l-1680 3 3 1608 c2 1148 0 1635 -8 1706 -49 424 -255 701 -625 841 -243 91 -633 124 -1115 92z" transform="matrix(.1 0 0 -.1 0 1276)"/></svg>
      </span>
      <span data-directory="${name}" title="Download Directory" class="downloadDir" onclick="recursiveFileDownload(this);">
        <svg width="13" height="13" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1803 960q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z"/></svg>
      </span>
    </div>
  </li>`;
}

function createFileplaylistHtml(dataDirectory) {
  return `<li class="collection-item pointer">
    <div data-directory="${dataDirectory}" class="fileplaylistz" onclick="onFilePlaylistClick(this);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="25" height="25"><path d="M14.5 8a2.495 2.495 0 0 0-2.5 2.5v45c0 1.385 1.115 2.5 2.5 2.5h35c1.385 0 2.5-1.115 2.5-2.5V23l-13.75-1.25L37 8Z" opacity=".2"/><path fill="#1e98d1" d="M14.5 7A2.495 2.495 0 0 0 12 9.5v45c0 1.385 1.115 2.5 2.5 2.5h35c1.385 0 2.5-1.115 2.5-2.5V22l-13.75-1.25L37 7z"/><path d="M37 8v12.5a2.5 2.5 0 0 0 2.5 2.5H52Z" opacity=".2"/><path fill="#67A#e9" d="M37 7v12.5a2.5 2.5 0 0 0 2.5 2.5H52L37 7z"/><path d="M14.5 7A2.495 2.495 0 0 0 12 9.5v1C12 9.115 13.115 8 14.5 8H37V7z" opacity=".2" fill="#fff"/><path d="M24.199 28A2.149 2.085 0 0 0 22 30.086v19.831a2.149 2.085 0 0 0 3.223 1.805l17.704-9.916a2.149 2.085 0 0 0 0-3.61L25.223 28.28a2.149 2.085 0 0 0-1.024-.28z" opacity=".2"/><path d="M24.199 27A2.149 2.085 0 0 0 22 29.086v19.831a2.149 2.085 0 0 0 3.223 1.805l17.704-9.916a2.149 2.085 0 0 0 0-3.61L25.223 27.28a2.149 2.085 0 0 0-1.024-.28z" fill="#fff"/></svg>
      <span class="item-text">${dataDirectory}</span>
    </div>
    <div class="song-button-box">
      <span title="Add All To Queue" class="addFileplaylist" onclick="addFilePlaylist(this);" data-directory="${dataDirectory}">
        <svg xmlns="http://www.w3.org/2000/svg" height="9" width="9" viewBox="0 0 1280 1276"><path d="M6760 12747 c-80 -5 -440 -10 -800 -11 -701 -2 -734 -4 -943 -57 -330 -84 -569 -281 -681 -563 -103 -256 -131 -705 -92 -1466 12 -241 16 -531 16 -1232 l0 -917 -1587 -4 c-1561 -3 -1590 -3 -1703 -24 -342 -62 -530 -149 -692 -322 -158 -167 -235 -377 -244 -666 -43 -1404 -42 -1813 7 -2355 21 -235 91 -400 233 -548 275 -287 730 -389 1591 -353 1225 51 2103 53 2330 7 l60 -12 6 -1489 c6 -1559 6 -1548 49 -1780 100 -535 405 -835 933 -921 88 -14 252 -17 1162 -24 591 -4 1099 -4 1148 1 159 16 312 56 422 112 118 59 259 181 333 290 118 170 195 415 227 722 18 173 21 593 6 860 -26 444 -32 678 -34 1432 l-2 811 54 7 c30 4 781 6 1670 5 1448 -2 1625 -1 1703 14 151 28 294 87 403 168 214 159 335 367 385 666 15 85 29 393 30 627 0 105 4 242 10 305 43 533 49 1047 15 1338 -44 386 -144 644 -325 835 -131 140 -278 220 -493 270 -92 21 -98 21 -1772 24 l-1680 3 3 1608 c2 1148 0 1635 -8 1706 -49 424 -255 701 -625 841 -243 91 -633 124 -1115 92z" transform="matrix(.1 0 0 -.1 0 1276)"/></svg>
      </span>
      <span data-directory="${dataDirectory}" title="Download Playlist" class="downloadFileplaylist" onclick="downloadFileplaylist(this);">
        <svg width="12" height="12" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1803 960q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z"/></svg>
      </span>
    </div>
  </li>`;
}

function renderPlaylist(playlistName) {
  return `<li class="collection-item" data-playlistname="${encodeURIComponent(
    playlistName
  )}" class="playlist_row_container">
    <span data-playlistname="${encodeURIComponent(
    playlistName
  )}" class="playlistz" onclick="onPlaylistClick(this);">${escapeHtml(
    playlistName
  )}</span>
    <div class="song-button-box">
      <span data-playlistname="${encodeURIComponent(
    playlistName
  )}" class="deletePlaylist" onclick="deletePlaylist(this);">Delete</span>
    </div>
  </li>`;
}

function getLoadingSvg() {
  return '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="spinner-path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>';
}

function setBrowserRootPanel(panelName, showBar) {
  if (showBar === false) {
    document.getElementById("directory_bar").style.display = "none";
  } else {
    document.getElementById("directory_bar").style.display = "";
  }

  document.getElementById("localSearchBar").value = "";
  document.getElementById("directoryName").innerHTML = "";
  document.getElementById("local_search_btn").style.display = "";

  [...document.getElementsByClassName("panel_one_name")].forEach((el) => {
    el.innerHTML = panelName;
  });

  currentBrowsingList = [];
}

///////////////// File Explorer
function loadFileExplorer() {
  setBrowserRootPanel("File Explorer");
  programState = [{ state: "fileExplorer" }];

  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";

  // Reset file explorer vars
  fileExplorerArray = [];
  //send this directory to be parsed and displayed
  senddir(true);
}

async function senddir(root) {
  // Construct the directory string
  const directoryString = root === true ? "~" : getFileExplorerPath();
  document.getElementById("filelist").innerHTML = getLoadingSvg();

  try {
    const response = await MSTREAMAPI.dirparser(directoryString);
    document.getElementById("directoryName").innerHTML = response.path;

    if (root === true && response.path.length > 1) {
      fileExplorerArray.push(response.path.replaceAll("/", ""));
      programState.push({
        state: "fileExplorer",
        previousScroll: 0,
        previousSearch: "",
      });
    }
    printdir(response);
  } catch (err) {
    boilerplateFailure(err);
  }
}

// function that will receive JSON array of a directory listing.  It will then make a list of the directory and tack on classes for functionality
function printdir(response) {
  currentBrowsingList = [];
  let filelist = '<ul class="collection">';

  // Some APIs only return a list of files
  if (response.directories) {
    for (const dir of response.directories) {
      currentBrowsingList.push({ type: "directory", name: dir.name });
      filelist += renderDirHtml(dir.name);
    }
  }

  for (const file of response.files) {
    currentBrowsingList.push({ type: file.type, name: file.name });
    if (file.type === "m3u") {
      filelist += createFileplaylistHtml(file.name);
    } else {
      const title =
        file.artist != null || file.title != null
          ? file.artist + " - " + file.title
          : file.name;
      filelist += createMusicFileHtml(
        file.path || response.path + file.name,
        title
      );
    }
  }

  filelist += "</ul>";

  // clear the list
  document.getElementById("localSearchBar").value = "";

  // Post the html to the filelist div
  document.getElementById("filelist").innerHTML = filelist;
}

function getFileExplorerPath() {
  return fileExplorerArray.join("/") + "/";
}

function getDirectoryString2(component) {
  var newString =
    getFileExplorerPath() + component.getAttribute("data-directory");
  if (newString.substring(0, 1) !== "/") {
    newString = "/" + newString;
  }

  return newString;
}

if (typeof Storage !== "undefined" && localStorage.getItem("token")) {
  MSTREAMAPI.currentServer.token = localStorage.getItem("token");
}

function handleDirClick(el) {
  fileExplorerArray.push(el.getAttribute("data-directory"));
  programState.push({
    state: "fileExplorer",
    previousScroll: document.getElementById("filelist").scrollTop,
    previousSearch: document.getElementById("localSearchBar").value,
  });
  senddir();
}

function boilerplateFailure(err) {
  console.log(err);
  let msg = "Call Failed";
  // TODO: Check this
  if (err.responseJSON && err.responseJSON.error) {
    msg = err.responseJSON.error;
  }

  iziToast.error({
    title: msg,
    position: "topCenter",
    timeout: 3500,
  });
}

function onFileClick(el) {
  VUEPLAYERCORE.addSongWizard(el.getAttribute("data-file_location"), {}, true);
  // return `<iframe src="https://www.soundslice.com/slices/XLslc/embed/" width="100%" height="500" frameBorder="0"
  // allowfullscreen></iframe>`;
}

async function recursiveAddDir(el) {
  try {
    const directoryString = getDirectoryString2(el);
    const res = await MSTREAMAPI.recursiveScan(directoryString);
    addAllSongs(res);
  } catch (err) {
    boilerplateFailure(err);
  }
}

async function onFilePlaylistClick(el) {
  try {
    fileExplorerArray.push(el.getAttribute("data-directory"));
    programState.push({
      state: "fileExplorer",
      previousScroll: document.getElementById("filelist").scrollTop,
      previousSearch: document.getElementById("search_folders").value,
    });
    const directoryString = getFileExplorerPath();

    document.getElementById("directoryName").innerHTML =
      "/" + directoryString.substring(0, directoryString.length - 1);
    document.getElementById("filelist").innerHTML = getLoadingSvg();

    const response = await MSTREAMAPI.loadFileplaylist(directoryString);
    printdir(response);
  } catch (err) {
    boilerplateFailure(err);
  }
}

async function addFilePlaylist(el) {
  try {
    const res = await MSTREAMAPI.loadFileplaylist(getDirectoryString2(el));

    const translatedList = [];
    res.files.forEach((f) => {
      translatedList.push(f.path);
    });

    addAllSongs(translatedList);
  } catch (err) {
    boilerplateFailure(err);
  }
}

function addAll() {
  [...document.getElementsByClassName("filez")].forEach((el) => {
    VUEPLAYERCORE.addSongWizard(
      el.getAttribute("data-file_location"),
      {},
      true
    );
  });
}

function addAllSongs(res) {
  for (var i = 0; i < res.length; i++) {
    VUEPLAYERCORE.addSongWizard(res[i], {}, true);
  }
}

function playNow(el) {
  VUEPLAYERCORE.addSongWizard(
    el.getAttribute("data-file_location"),
    {},
    true,
    MSTREAMPLAYER.positionCache.val + 1
  );
}

let startInterval = false;
async function init() {
  try {
    const response = await MSTREAMAPI.ping();
    MSTREAMAPI.currentServer.vpaths = response.vpaths;
    VUEPLAYERCORE.playlists.length = 0;
    document.getElementById("pop-f").innerHTML =
      '<div class="pop-f pop-playlist">Add To Playlist:</div>';

    response.playlists.forEach((p) => {
      VUEPLAYERCORE.playlists.push(p);
      document.getElementById(
        "pop-f"
      ).innerHTML += `<div class="pop-list-item" onclick="addToPlaylistUI('${p.name}')">&#8226; ${p.name}</div>`;
      document.getElementById(
        "live-playlist-select"
      ).innerHTML += `<option value="${p.name}">${p.name}</option>`;
    });

    if (response.transcode) {
      MSTREAMPLAYER.transcodeOptions.serverEnabled = true;
      MSTREAMPLAYER.transcodeOptions.defaultCodec =
        response.transcode.defaultCodec;
      MSTREAMPLAYER.transcodeOptions.defaultBitrate =
        response.transcode.defaultBitrate;
      MSTREAMPLAYER.transcodeOptions.defaultAlgo =
        response.transcode.defaultAlgorithm;
    }
  } catch (err) {
    // window.location.href = 'login';
  }

  // load user settings
  try {
    const ivp = JSON.parse(localStorage.getItem("ignoreVPaths"));
    if (Array.isArray(ivp) || !(ivp instanceof Object)) {
      throw "bad!";
    }
    MSTREAMPLAYER.ignoreVPaths = ivp;
  } catch (e) { }

  try {
    // forced to an array to assure we're not stuffing nul values in here
    MSTREAMPLAYER.minRating = JSON.parse(localStorage.getItem("minRating"))[0];
  } catch (e) { }

  try {
    if (
      localStorage.getItem("transcode") === "true" &&
      MSTREAMPLAYER.transcodeOptions.serverEnabled === true
    ) {
      toggleTranscoding(undefined, true);
    }
    MSTREAMPLAYER.transcodeOptions.selectedCodec =
      localStorage.getItem("trans-codec-select");
    MSTREAMPLAYER.transcodeOptions.selectedBitrate = localStorage.getItem(
      "trans-bitrate-select"
    );
    MSTREAMPLAYER.transcodeOptions.selectedAlgo =
      localStorage.getItem("trans-algo-select");
  } catch (e) { }

  try {
    VUEPLAYERCORE.livePlaylist.name = localStorage.getItem(
      "live-playlist-auto-start"
    )
      ? localStorage.getItem("live-playlist-auto-start")
      : false;

    if (VUEPLAYERCORE.livePlaylist.name) {
      // get current playlist
      const response = await MSTREAMAPI.loadPlaylist(
        VUEPLAYERCORE.livePlaylist.name
      );

      // set the queue to the current playlist
      MSTREAMPLAYER.clearPlaylist();
      response.forEach((value) => {
        VUEPLAYERCORE.addSongWizard(
          value.filepath,
          value.metadata,
          false,
          undefined,
          false,
          true
        );
      });

      document.getElementById("set_live_playlist").classList.remove("green");
      document.getElementById("set_live_playlist").classList.add("blue");
      document.getElementById("set_live_playlist").value =
        "Disable Live Playlist";
      document.getElementById("live-playlist-hide-these").hidden = true;
    }
  } catch (err) { }

  dbStatus();
}

async function dbStatus() {
  try {
    const response = await MSTREAMAPI.dbStatus();
    // if not scanning
    if (!response.locked || response.locked === false) {
      clearInterval(startInterval);
      startInterval = false;
      document.getElementById("scan-status").innerHTML = "";
      document.getElementById("scan-status-files").innerHTML = "";

      return;
    }

    // Set Interval
    if (startInterval === false) {
      startInterval = setInterval(function () {
        dbStatus();
      }, 2000);
    }

    // Update status
    document.getElementById("scan-status").innerHTML = "Scan In Progress";
    document.getElementById("scan-status-files").innerHTML =
      response.totalFileCount + " files in DB";
  } catch (err) {
    document.getElementById("scan-status").innerHTML = "";
    document.getElementById("scan-status-files").innerHTML = "";
    clearInterval(startInterval);
    startInterval = false;
  }
}

function createPopper3(el) {
  if (curFileTracker === el.getAttribute("data-file_location")) {
    curFileTracker = undefined;
    document.getElementById("pop-f").style.visibility = "hidden";
    return;
  }

  curFileTracker = el.getAttribute("data-file_location");
  Popper.createPopper(el, document.getElementById("pop-f"), {
    placement: "bottom-end",
    onFirstUpdate: function (data) {
      document.getElementById("pop-f").style.visibility = "visible";
    },
    modifiers: [
      {
        name: "flip",
        options: {
          boundariesElement: "scrollParent",
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundariesElement: "scrollParent",
        },
      },
    ],
  });
}

const myModal = new HystModal({});

function openShareModal() {
  myModal.open("#sharePlaylist");
}

function openSaveModal() {
  myModal.open("#savePlaylist");
}

function openLivePlaylistModal() {
  myModal.open("#livePlaylist");
}

function openNewPlaylistModal() {
  myModal.open("#newPlaylist");
}

function openPlaybackModal() {
  myModal.open("#speedModal");
}

function openMetadataModal(metadata, fp) {
  if (metadata === null) {
    return iziToast.warning({
      title: "No Metadata Found",
      position: "topCenter",
      timeout: 3500,
    });
  }

  document.getElementById("meta--title").innerHTML = metadata.title;
  document.getElementById("meta--album").innerHTML = metadata.album;
  document.getElementById("meta--artist").innerHTML = metadata.artist;
  document.getElementById("meta--year").innerHTML = metadata.year;
  document.getElementById("meta--disk").innerHTML = metadata.disk;
  document.getElementById("meta--track").innerHTML = metadata.track;
  document.getElementById("meta--rating").innerHTML = metadata.rating;
  document.getElementById("meta--rg").innerHTML = metadata["replaygain-track"];
  document.getElementById("meta--fp").innerHTML = fp;
  document.getElementById("meta--fp").href = "media" + fp;
  document.getElementById("meta--aa").innerHTML =
    "album-art/" + metadata["album-art"];
  if (metadata["album-art"]) {
    document.getElementById(
      "meta--aa"
    ).href = `album-art/${metadata["album-art"]}`;
  } else {
    document.getElementById("meta--aa").href = "#";
  }

  myModal.open("#metadataModel");
}

function openEditModal() {
  document.getElementById("server_address").value =
    MSTREAMAPI.currentServer.host;
  document.getElementById("server_username").value =
    MSTREAMAPI.currentServer.username;
  myModal.open("#editServer");
}

async function addToPlaylistUI(playlist) {
  try {
    await MSTREAMAPI.addToPlaylist(playlist, curFileTracker);
    iziToast.success({
      title: "Song Added!",
      position: "topCenter",
      timeout: 3500,
    });
  } catch (err) {
    iziToast.error({
      title: "Failed to add song",
      position: "topCenter",
      timeout: 3500,
    });
  }
}

/////////////// Download Playlist
function downloadPlaylist() {
  // Loop through array and add each file to the playlist
  const downloadFiles = [];
  for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
    downloadFiles.push(MSTREAMPLAYER.playlist[i].rawFilePath);
  }

  if (downloadFiles < 1) {
    return;
  }

  // Use key if necessary
  document.getElementById("downform").action =
    "api/v1/download/zip?token=" + MSTREAMAPI.currentServer.token;

  let input = document.createElement("INPUT");
  input.type = "hidden";
  input.name = "fileArray";
  input.value = JSON.stringify(downloadFiles);
  document.getElementById("downform").appendChild(input);

  //submit form
  document.getElementById("downform").submit();
  // clear the form
  document.getElementById("downform").innerHTML = "";
}

function recursiveFileDownload(el) {
  const directoryString = getDirectoryString2(el);
  document.getElementById("downform").action =
    "api/v1/download/directory?token=" + MSTREAMAPI.currentServer.token;

  let input = document.createElement("INPUT");
  input.type = "hidden";
  input.name = "directory";
  input.value = directoryString;
  document.getElementById("downform").appendChild(input);

  //submit form
  document.getElementById("downform").submit();
  // clear the form
  document.getElementById("downform").innerHTML = "";
}

function downloadFileplaylist(el) {
  document.getElementById("downform").action =
    "api/v1/download/m3u?token=" + MSTREAMAPI.currentServer.token;

  const input = document.createElement("INPUT");
  input.type = "hidden";
  input.name = "path";
  input.value = getDirectoryString2(el);
  document.getElementById("downform").appendChild(input);

  //submit form
  document.getElementById("downform").submit();
  // clear the form
  document.getElementById("downform").innerHTML = "";
}

function onSearchButtonClick() {
  // Hide Filepath
  document.getElementById("search_folders").classList.toggle("super-hide");
  // Show Search Input
  document.getElementById("directoryName").classList.toggle("super-hide");

  if (
    !document.getElementById("search_folders").classList.contains("super-hide")
  ) {
    document.getElementById("localSearchBar").focus();
  } else {
    document.getElementById("localSearchBar").value = "";
    document
      .getElementById("localSearchBar")
      .dispatchEvent(new Event("change"));
  }
}

async function onBackButton() {
  if (programState.length < 2) {
    return;
  }

  const thisState = programState.pop();
  const backState = programState[programState.length - 1];

  if (backState.state === "allPlaylists") {
    await getAllPlaylists(undefined);
  } else if (backState.state === "allAlbums") {
    await getAllAlbums(undefined);
  } else if (backState.state === "allArtists") {
    await getAllArtists(undefined);
  } else if (backState.state === "artist") {
    await getArtistsAlbums(backState.name);
  } else if (backState.state === "fileExplorer") {
    fileExplorerArray.pop();
    await senddir();
  } else if (backState.state === "searchPanel") {
    setupSearchPanel(backState.searchTerm, undefined);
  }

  // Fill in Search Bar
  if (backState.state !== "searchPanel" && thisState.previousSearch) {
    document.getElementById("localSearchBar").value = thisState.previousSearch;
    document.getElementById("localSearchBar").dispatchEvent(new Event("keyup"));
  }

  // Scroll to position
  if (thisState.previousScroll) {
    document.getElementById("filelist").scrollTop = thisState.previousScroll;
  }
}

///////////////////// Playlists
async function getAllPlaylists() {
  setBrowserRootPanel("Playlists");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
  document.getElementById("directoryName").innerHTML =
    '<input class="newPlaylistButton btn green" style="height:24px;" value="New Playlist" type="button" onclick="openNewPlaylistModal();">';
  programState = [{ state: "allPlaylists" }];

  try {
    const response = await MSTREAMAPI.getAllPlaylists();
    VUEPLAYERCORE.playlists.length = 0;
    document.getElementById("pop-f").innerHTML =
      '<div class="pop-f pop-playlist">Add To Playlist:</div>';
    document.getElementById(
      "live-playlist-select"
    ).innerHTML = `<option value="" disabled selected>Select Playlist</option>`;

    // loop through the json array and make an array of corresponding divs
    let playlists = '<ul class="collection">';
    response.forEach((p) => {
      playlists += renderPlaylist(p.name);
      const lol = { name: p.name, type: "playlist" };
      currentBrowsingList.push(lol);
      VUEPLAYERCORE.playlists.push(lol);
      document.getElementById(
        "pop-f"
      ).innerHTML += `<div class="pop-list-item" onclick="addToPlaylistUI('${p.name}')">&#8226; ${p.name}</div>`;
      document.getElementById(
        "live-playlist-select"
      ).innerHTML += `<option value="${p.name}">${p.name}</option>`;
    });
    playlists += "</ul>";

    document.getElementById("filelist").innerHTML = playlists;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

function deletePlaylist(el) {
  const playlistname = decodeURIComponent(el.getAttribute("data-playlistname"));

  iziToast.question({
    timeout: 10000,
    close: false,
    overlayClose: true,
    overlay: true,
    displayMode: "once",
    id: "question",
    zindex: 99999,
    title: `Delete '${playlistname}'?`,
    position: "center",
    buttons: [
      [
        "<button><b>Delete</b></button>",
        async (instance, toast) => {
          try {
            await MSTREAMAPI.deletePlaylist(playlistname);
            document
              .querySelector(
                'li[data-playlistname="' +
                encodeURIComponent(playlistname) +
                '"]'
              )
              .remove();
          } catch (err) {
            boilerplateFailure(err);
          }
          instance.hide({ transitionOut: "fadeOut" }, toast, "button");
        },
        true,
      ],
      [
        "<button>Go Back</button>",
        (instance, toast) => {
          instance.hide({ transitionOut: "fadeOut" }, toast, "button");
        },
      ],
    ],
  });
}

async function onPlaylistClick(el) {
  try {
    const playlistname = decodeURIComponent(
      el.getAttribute("data-playlistname")
    );
    document.getElementById("directoryName").innerHTML =
      "Playlist: " + playlistname;
    document.getElementById("filelist").innerHTML = getLoadingSvg();
    currentBrowsingList = [];
    programState.push({
      state: "playlist",
      name: playlistname,
      previousScroll: document.getElementById("filelist").scrollTop,
      previousSearch: document.getElementById("localSearchBar").value,
    });
    document.getElementById("localSearchBar").value = "";
    const response = await MSTREAMAPI.loadPlaylist(playlistname);

    // Add the playlist name to the modal
    document.getElementById("playlist_name").value = playlistname;

    let files = "";
    response.forEach((value) => {
      currentBrowsingList.push({
        type: "file",
        name:
          !value.metadata || !value.metadata.title
            ? value.filepath
            : `${value.metadata.artist} - ${value.metadata.title}`,
        metadata: value.metadata,
        filepath: value.filepath,
        lokiId: value.lokiId,
      });

      files += renderFileWithMetadataHtml(
        value.filepath,
        value.lokiId,
        value.metadata
      );
    });

    document.getElementById("filelist").innerHTML = files;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    boilerplateFailure(response, error);
  }
}

function removePlaylistSong(el) {
  try {
    const lokiId = el.getAttribute("data-lokiid");
    MSTREAMAPI.removePlaylistSong(lokiId);

    // remove from currentBrowsingList
    currentBrowsingList = currentBrowsingList.filter((item) => {
      return item.lokiId !== lokiId;
    });

    document.querySelector(`li[data-lokiid="${lokiId}"]`).remove();
  } catch (err) {
    return boilerplateFailure(err);
  }
}

async function newPlaylist() {
  document.getElementById("new_playlist").disabled = true;
  try {
    const title = document.getElementById("new_playlist_name").value;
    await MSTREAMAPI.newPlaylist(title);
    myModal.close();
    iziToast.success({
      title: "Playlist Created",
      position: "topCenter",
      timeout: 3000,
    });

    document.getElementById("newPlaylistForm").reset();
    VUEPLAYERCORE.playlists.push({ name: title, type: "playlist" });
    document.getElementById(
      "pop-f"
    ).innerHTML += `<div class="pop-list-item" onclick="addToPlaylistUI('${title}')">&#8226; ${title}</div>`;
    document.getElementById(
      "live-playlist-select"
    ).innerHTML += `<option value="${title}">${title}</option>`;

    if (programState[0].state === "allPlaylists") {
      getAllPlaylists();
    }
  } catch (err) {
    boilerplateFailure(err);
  }
  document.getElementById("new_playlist").disabled = false;
}

async function setLivePlaylist() {
  try {
    document.getElementById("set_live_playlist").disabled = true;

    if (VUEPLAYERCORE.livePlaylist.name !== false) {
      VUEPLAYERCORE.livePlaylist.name = false;
      document.getElementById("set_live_playlist").classList.remove("blue");
      document.getElementById("set_live_playlist").classList.add("green");
      document.getElementById("set_live_playlist").value =
        "Enable Live Playlist";
      document.getElementById("live-playlist-hide-these").hidden = false;
      myModal.close();
      return;
    }

    let livePlaylistName;

    if (document.getElementById("radio-use-existing").checked === true) {
      if (document.getElementById("live-playlist-select").value === "") {
        const err = new Error("No Playlist Selected");
        err.responseJSON = { error: "No Playlist Selected" };
        throw err;
      }
      livePlaylistName = document.getElementById("live-playlist-select").value;
    } else {
      if (document.getElementById("new-live-playlist-name").value === "") {
        const err = new Error("Playlist Name Required");
        err.responseJSON = { error: "Playlist Name Required" };
        throw err;
      }
      livePlaylistName = document.getElementById(
        "new-live-playlist-name"
      ).value;
    }

    // check if checkbox is checked
    if (document.getElementById("persist_live_queue").checked === true) {
      localStorage.setItem("live-playlist-auto-start", livePlaylistName);
    } else {
      localStorage.removeItem("live-playlist-auto-start");
    }

    // set live var
    VUEPLAYERCORE.livePlaylist.name = livePlaylistName;

    // get current playlist
    const response = await MSTREAMAPI.loadPlaylist(
      VUEPLAYERCORE.livePlaylist.name
    );

    // set the queue to the current playlist
    if (response.length > 0) {
      MSTREAMPLAYER.clearPlaylist();
      response.forEach((value) => {
        VUEPLAYERCORE.addSongWizard(
          value.filepath,
          value.metadata,
          false,
          undefined,
          false,
          true
        );
      });
    } else {
      // save current queue
      const songs = [];
      for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
        songs.push(MSTREAMPLAYER.playlist[i].filepath);
      }
      MSTREAMAPI.savePlaylist(livePlaylistName, songs, true);
    }

    document.getElementById("set_live_playlist").classList.remove("green");
    document.getElementById("set_live_playlist").classList.add("blue");
    document.getElementById("set_live_playlist").value =
      "Disable Live Playlist";
    document.getElementById("live-playlist-hide-these").hidden = true;

    // close modal
    myModal.close();
  } catch (err) {
    boilerplateFailure(err);
  } finally {
    document.getElementById("set_live_playlist").disabled = false;
  }
}

async function savePlaylist() {
  if (MSTREAMPLAYER.playlist.length == 0) {
    iziToast.warning({
      title: "No playlist to save!",
      position: "topCenter",
      timeout: 3500,
    });
    return;
  }

  try {
    document.getElementById("save_playlist").disabled = true;
    const title = document.getElementById("playlist_name").value;

    //loop through array and add each file to the playlist
    const songs = [];
    for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
      songs.push(MSTREAMPLAYER.playlist[i].filepath);
    }

    MSTREAMAPI.savePlaylist(title, songs);

    myModal.close();
    iziToast.success({
      title: "Playlist Saved",
      position: "topCenter",
      timeout: 3000,
    });

    if (programState[0].state === "allPlaylists") {
      getAllPlaylists();
    }

    VUEPLAYERCORE.playlists.push({ name: title, type: "playlist" });
    document.getElementById(
      "pop-f"
    ).innerHTML += `<div class="pop-list-item" onclick="addToPlaylistUI('${title}')">&#8226; ${title}</div>`;
    document.getElementById(
      "live-playlist-select"
    ).innerHTML += `<option value="${title}">${title}</option>`;
  } catch (err) {
    boilerplateFailure(err);
  } finally {
    document.getElementById("save_playlist").disabled = false;
  }
}

/////////////// Artists
async function getAllArtists() {
  setBrowserRootPanel("Artists");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  programState = [{ state: "allArtists" }];

  try {
    const response = await MSTREAMAPI.artists({
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    });

    // parse through the json array and make an array of corresponding divs
    let artists = '<ul class="collection">';
    response.artists.forEach((value) => {
      artists += renderArtist(value);
      currentBrowsingList.push({ type: "artist", name: value });
    });
    artists += "</ul>";

    document.getElementById("filelist").innerHTML = artists;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    boilerplateFailure(response, error);
  }
}

function getArtistz(el) {
  const artist = el.getAttribute("data-artist");
  programState.push({
    state: "artist",
    name: artist,
    previousScroll: document.getElementById("filelist").scrollTop,
    previousSearch: document.getElementById("localSearchBar").value,
  });

  getArtistsAlbums(artist);
}

async function getArtistsAlbums(artist) {
  setBrowserRootPanel("Albums");
  document.getElementById("directoryName").innerHTML = "Artist: " + artist;
  document.getElementById("filelist").innerHTML = getLoadingSvg();

  try {
    const response = await MSTREAMAPI.artistAlbums({
      artist: artist,
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    });

    let albums = "<ul>";
    response.albums.forEach((value) => {
      const albumString = value.name ? value.name : "SINGLES";
      // 'value.name === null ? artist : null' is some clever shit that only passes in artist info when the album is null
      // This is so we get the singles for this artist
      // If the album is specified, we don't want to limit by artist
      albums += renderAlbum(
        value.name,
        value.name === null ? artist : null,
        albumString,
        value.album_art_file,
        value.year
      );
      currentBrowsingList.push({
        type: "album",
        name: value.name,
        artist: artist,
        album_art_file: value.album_art_file,
      });
    });
    albums += "</ul>";

    document.getElementById("filelist").innerHTML = albums;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    boilerplateFailure(response, error);
  }
}

/////////////// Albums
async function getAllAlbums() {
  setBrowserRootPanel("Albums");
  document.getElementById("filelist").innerHTML = getLoadingSvg();

  programState = [{ state: "allAlbums" }];

  try {
    const response = await MSTREAMAPI.albums({
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    });

    //parse through the json array and make an array of corresponding divs
    let albums = '<ul class="collection">';
    response.albums.forEach((value) => {
      currentBrowsingList.push({
        type: "album",
        name: value.name,
        album_art_file: value.album_art_file,
      });

      albums += renderAlbum(
        value.name,
        undefined,
        value.name,
        value.album_art_file,
        value.year
      );
    });
    albums += "</ul>";

    document.getElementById("filelist").innerHTML = albums;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

function getAlbumsOnClick(el) {
  getAlbumSongs(
    el.hasAttribute("data-album") ? el.getAttribute("data-album") : null,
    el.hasAttribute("data-artist") ? el.getAttribute("data-artist") : null,
    el.hasAttribute("data-year") ? el.getAttribute("data-year") : null
  );
}

async function getAlbumSongs(album, artist, year) {
  document.getElementById("directoryName").innerHTML = "Album: " + album;

  programState.push({
    state: "album",
    name: album,
    previousScroll: document.getElementById("filelist").scrollTop,
    previousSearch: document.getElementById("localSearchBar").value,
  });

  //clear the list
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  currentBrowsingList = [];

  document.getElementById("localSearchBar").value = "";

  try {
    const response = await MSTREAMAPI.albumSongs({
      album,
      artist,
      year,
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    });

    //parse through the json array and make an array of corresponding divs
    let files = '<ul class="collection">';
    response.forEach((song) => {
      currentBrowsingList.push({
        type: "file",
        name: song.metadata.title
          ? song.metadata.title
          : song.metadata.filename,
      });
      files += createMusicFileHtml(
        song.filepath,
        song.metadata.title ? song.metadata.title : song.metadata.filename,
        undefined,
        undefined,
        song.metadata.artist ? song.metadata.artist : undefined
      );
    });
    files += "</ul>";

    document.getElementById("filelist").innerHTML = files;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    boilerplateFailure(err);
  }
}

////////////// Rated Songs
async function getRatedSongs() {
  setBrowserRootPanel("Starred");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  programState = [{ state: "allRated" }];

  try {
    const response = await MSTREAMAPI.getRated({
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    });
    //parse through the json array and make an array of corresponding divs
    let files = "";
    response.forEach((value) => {
      let rating = value.metadata.rating / 2;
      if (!Number.isInteger(rating)) {
        rating = rating.toFixed(1);
      }

      currentBrowsingList.push({
        type: "file",
        name: value.metadata.artist
          ? value.metadata.artist + " - " + value.metadata.title
          : value.filepath,
        metadata: value.metadata,
      });

      files += createMusicFileHtml(
        value.filepath,
        value.metadata.title
          ? value.metadata.title
          : value.filepath.split("/").pop(),
        value.metadata["album-art"]
          ? `src="${MSTREAMAPI.currentServer.host}album-art/${value.metadata["album-art"]}?compress=s&token=${MSTREAMAPI.currentServer.token}"`
          : `src="assets/img/default.png"`,
        rating,
        value.metadata.artist
          ? `<span style="font-size:15px;">${value.metadata.artist}</span>`
          : ""
      );
    });

    document.getElementById("filelist").innerHTML = files;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

///////////////// Recently Played
function getRecentlyPlayed() {
  setBrowserRootPanel("Recently Played");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
  document.getElementById("directoryName").innerHTML =
    'Get last &nbsp;&nbsp;<input onkeydown="submitRecentlyPlayed();" onfocusout="redoRecentlyPlayed();" id="recently-played-limit" class="recently-added-input" type="number" min="1" step="1" value="100">&nbsp;&nbsp; songs';

  redoRecentlyPlayed();
}

async function redoRecentlyPlayed() {
  currentBrowsingList = [];
  programState = [{ state: "recentlyPlayed" }];

  try {
    const response = await MSTREAMAPI.getRecentlyPlayed(
      document.getElementById("recently-played-limit").value,
      Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      })
    );

    //parse through the json array and make an array of corresponding divs
    let filelist = '<ul class="collection">';
    response.forEach((el) => {
      currentBrowsingList.push({
        type: "file",
        name: el.metadata.title
          ? el.metadata.artist + " - " + el.metadata.title
          : el.filepath.split("/").pop(),
      });

      filelist += createMusicFileHtml(
        el.filepath,
        el.metadata.title
          ? `${el.metadata.title}`
          : el.filepath.split("/").pop(),
        el.metadata["album-art"]
          ? `src="${MSTREAMAPI.currentServer.host}album-art/${el.metadata["album-art"]}?compress=s&token=${MSTREAMAPI.currentServer.token}"`
          : `src="assets/img/default.png"`,
        undefined,
        el.metadata.artist
          ? `<span style="font-size:15px;">${el.metadata.artist}</span>`
          : ""
      );
    });

    filelist += "</ul>";

    document.getElementById("filelist").innerHTML = filelist;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

function submitRecentlyPlayed() {
  if (event.keyCode === 13) {
    document.getElementById("recently-played-limit").blur();
  }
}

///////////////// Most Played
function getMostPlayed() {
  setBrowserRootPanel("Most Played");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
  document.getElementById("directoryName").innerHTML =
    'Get last &nbsp;&nbsp;<input onkeydown="submitMostPlayed();" onfocusout="redoMostPlayed();" id="most-played-limit" class="recently-added-input" type="number" min="1" step="1" value="100">&nbsp;&nbsp; songs';

  redoMostPlayed();
}

async function redoMostPlayed() {
  currentBrowsingList = [];
  programState = [{ state: "mostPlayed" }];

  try {
    const response = await MSTREAMAPI.getMostPlayed(
      document.getElementById("most-played-limit").value,
      Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      })
    );

    //parse through the json array and make an array of corresponding divs
    let filelist = '<ul class="collection">';
    response.forEach((el) => {
      currentBrowsingList.push({
        type: "file",
        name: el.metadata.title
          ? el.metadata.artist + " - " + el.metadata.title
          : el.filepath.split("/").pop(),
      });

      filelist += createMusicFileHtml(
        el.filepath,
        el.metadata.title
          ? `${el.metadata.title}`
          : el.filepath.split("/").pop(),
        el.metadata["album-art"]
          ? `src="${MSTREAMAPI.currentServer.host}album-art/${el.metadata["album-art"]}?compress=s&token=${MSTREAMAPI.currentServer.token}"`
          : `src="assets/img/default.png"`,
        undefined,
        el.metadata.artist
          ? `<span style="font-size:15px;">${el.metadata.artist} [${el.metadata["play-count"]} plays]</span>`
          : `<span style="font-size:15px;">[${el.metadata["play-count"]} plays]</span>`
      );
    });

    filelist += "</ul>";

    document.getElementById("filelist").innerHTML = filelist;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

function submitMostPlayed() {
  if (event.keyCode === 13) {
    document.getElementById("most-played-limit").blur();
  }
}

///////////////// Recently Added
function getRecentlyAdded() {
  setBrowserRootPanel("Recently Added");
  document.getElementById("filelist").innerHTML = getLoadingSvg();
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
  document.getElementById("directoryName").innerHTML =
    'Get last &nbsp;&nbsp;<input onkeydown="submitRecentlyAdded();" onfocusout="redoRecentlyAdded();" id="recently-added-limit" class="recently-added-input" type="number" min="1" step="1" value="100">&nbsp;&nbsp; songs';

  redoRecentlyAdded();
}

async function redoRecentlyAdded() {
  currentBrowsingList = [];
  programState = [{ state: "recentlyAdded" }];

  try {
    const response = await MSTREAMAPI.getRecentlyAdded(
      document.getElementById("recently-added-limit").value,
      Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      })
    );

    //parse through the json array and make an array of corresponding divs
    let filelist = '<ul class="collection">';
    response.forEach((el) => {
      currentBrowsingList.push({
        type: "file",
        name: el.metadata.title
          ? el.metadata.artist + " - " + el.metadata.title
          : el.filepath.split("/").pop(),
      });

      filelist += createMusicFileHtml(
        el.filepath,
        el.metadata.title
          ? `${el.metadata.title}`
          : el.filepath.split("/").pop(),
        el.metadata["album-art"]
          ? `src="${MSTREAMAPI.currentServer.host}album-art/${el.metadata["album-art"]}?compress=s&token=${MSTREAMAPI.currentServer.token}"`
          : `src="assets/img/default.png"`,
        undefined,
        el.metadata.artist
          ? `<span style="font-size:15px;">${el.metadata.artist}</span>`
          : ""
      );
    });

    filelist += "</ul>";

    document.getElementById("filelist").innerHTML = filelist;
  } catch (err) {
    document.getElementById("filelist").innerHTML =
      "<div>Server call failed</div>";
    return boilerplateFailure(err);
  }
}

function submitRecentlyAdded() {
  if (event.keyCode === 13) {
    document.getElementById("recently-added-limit").blur();
  }
}

///////////////// Transcode
function setupTranscodePanel() {
  setBrowserRootPanel("Transcode", false);

  if (!MSTREAMPLAYER.transcodeOptions.serverEnabled) {
    document.getElementById("filelist").innerHTML =
      '<div class="pad-6"><b>Transcoding is disabled on this server</b></div>';
    return;
  }

  document.getElementById("filelist").innerHTML = `
    <div class="browser-panel">
      <div>
        <label for="enable_transcoding_locally">
          <input type="checkbox" class="filled-in" onchange="toggleTranscoding(this);" id="enable_transcoding_locally" 
          name="transcode" ${MSTREAMPLAYER.transcodeOptions.frontendEnabled ? "checked" : ""
    }/>
          <span>Enable Transcoding</span>
        </label>
      </div>
      <p>
        Default Codec:<br> <b>${MSTREAMPLAYER.transcodeOptions.defaultCodec} ${MSTREAMPLAYER.transcodeOptions.defaultBitrate
    } ${MSTREAMPLAYER.transcodeOptions.defaultAlgo}</b>
      </p>
      <form>
        <label for="trans-codec-select">Codec</label>
        <select onchange="changeTranscodeCodec();" class="browser-default trans-input" name="pets" id="trans-codec-select">
          <option value="">Default</option>
          <option value="opus">Opus OGG</option>
          <option value="mp3">mp3</option>
          <option value="aac">AAC</option>
        </select>
        <br>
        <label for="trans-bitrate-select">Bit Rate</label>
        <select onchange="changeTranscodeBitrate();" class="browser-default trans-input" name="pets" id="trans-bitrate-select">
          <option value="">Default</option>
          <option value="64k">64k</option>
          <option value="96k">96k</option>
          <option value="128k">128k</option>
          <option value="192k">192k</option>
        </select>
        <br>
        <label for="trans-algo-select">Algorithm</label>
        <select onchange="changeTranscodeAlgo();" class="browser-default trans-input" name="pets" id="trans-algo-select">
          <option value="">Default</option>
          <option value="buffer">Buffer</option>
          <option value="stream">Stream</option>
        </select>
      </form>
    </div>`;

  document.getElementById("trans-codec-select").value = MSTREAMPLAYER
    .transcodeOptions.selectedCodec
    ? MSTREAMPLAYER.transcodeOptions.selectedCodec
    : "";
  document.getElementById("trans-bitrate-select").value = MSTREAMPLAYER
    .transcodeOptions.selectedBitrate
    ? MSTREAMPLAYER.transcodeOptions.selectedBitrate
    : "";
  document.getElementById("trans-algo-select").value = MSTREAMPLAYER
    .transcodeOptions.selectedAlgo
    ? MSTREAMPLAYER.transcodeOptions.selectedAlgo
    : "";
}

function changeTranscodeBitrate() {
  const value = document.getElementById("trans-bitrate-select").value;
  MSTREAMPLAYER.transcodeOptions.selectedBitrate = value ? value : null;
  value
    ? localStorage.setItem("trans-bitrate-select", value)
    : localStorage.removeItem("trans-bitrate-select");
}

function changeTranscodeCodec() {
  const value = document.getElementById("trans-codec-select").value;
  MSTREAMPLAYER.transcodeOptions.selectedCodec = value ? value : null;
  value
    ? localStorage.setItem("trans-codec-select", value)
    : localStorage.removeItem("trans-codec-select");
}

function changeTranscodeAlgo() {
  const value = document.getElementById("trans-algo-select").value;
  MSTREAMPLAYER.transcodeOptions.selectedAlgo = value ? value : null;
  value
    ? localStorage.setItem("trans-algo-select", value)
    : localStorage.removeItem("trans-algo-select");
}

function toggleTranscoding(el, manual) {
  // checkbox button while we convert the playlist
  if (el) {
    el.disabled = true;
  }

  const checked = manual || el.checked;

  const a = checked ? "media/" : "transcode/";
  const b = checked ? "transcode/" : "media/";

  document.getElementById("ffmpeg-logo").style.stroke = checked
    ? "#388E3C"
    : "#DDD";
  MSTREAMPLAYER.transcodeOptions.frontendEnabled = checked ? true : false;

  localStorage.setItem("transcode", checked ? true : false);

  // Convert playlist
  for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
    MSTREAMPLAYER.playlist[i].url = MSTREAMPLAYER.playlist[i].url.replace(a, b);
  }

  // re-enable checkbox
  if (el) {
    el.disabled = false;
  }
}

///////////////////////////// Mobile Stuff
function getMobilePanel() {
  setBrowserRootPanel("Mobile Apps", false);

  document.getElementById(
    "filelist"
  ).innerHTML = `<div class="mobile-links pad-6">
      <a target="_blank" href="https://play.google.com/store/apps/details?id=mstream.music&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
        <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/>
      </a>
    </div>
    <div class="mobile-links pad-6">
      <a target="_blank" href="https://apps.apple.com/us/app/mstream-player/id1605378892">
        <img alt='Get it on The App Store' src='assets/img/app-store-logo.png'/>
      </a>
    </div>
    <br>
    <div class="pad-6">
      <a target="_blank" href="/qr"><b>Checkout the QR Code tool to help add your server to the app</b></a>
    </div>`;
}

//////////////////////////  Share playlists
async function submitShareForm() {
  try {
    document.getElementById("share_it").disabled = true;
    const shareTimeInDays = document.getElementById("share_time").value;

    //loop through array and add each file to the playlist
    const stuff = [];
    for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
      stuff.push(MSTREAMPLAYER.playlist[i].filepath);
    }

    if (stuff.length == 0) {
      document.getElementById("share_it").disabled = false;
      return;
    }

    const response = await MSTREAMAPI.makeShared(stuff, shareTimeInDays);
    const adrs =
      window.location.protocol +
      "//" +
      window.location.host +
      "/shared/" +
      response.playlistId;
    document.getElementById("share-textarea").value = adrs;
  } catch (err) {
    boilerplateFailure(err);
  }

  document.getElementById("share_it").disabled = false;
}

///////////////// Auto DJ
function autoDjPanel() {
  setBrowserRootPanel("Auto DJ", false);

  let newHtml = `<div class="pad-6"><p>Auto DJ randomly generates a playlist.  Click the \'DJ\' button on the bottom enable it</p>
    <h5>Use Folders</h5>`;
  for (let i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
    let checkedString = "";
    if (!MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]]) {
      checkedString = "checked";
    }
    newHtml += `
      <label for="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}">
        <input ${checkedString} id="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}" type="checkbox"
          value="${MSTREAMAPI.currentServer.vpaths[i]}" name="autodj-folders" onchange="onAutoDJFolderChange(this)">
        <span>${MSTREAMAPI.currentServer.vpaths[i]}</span>
      </label><br>`;
  }

  newHtml +=
    '<h5>Minimum Rating</h5> <select class="browser-default" onchange="updateAutoDJRatings(this)" id="autodj-ratings">';
  for (let i = 0; i < 11; i++) {
    newHtml += `<option ${Number(MSTREAMPLAYER.minRating) === i ? "selected" : ""
      } value="${i}">${i === 0 ? "Disabled" : +(i / 2).toFixed(1)}</option>`;
  }
  newHtml += "</select>";
  newHtml +=
    '<br><p><input type="button" class="btn blue" value="Toggle Auto DJ" onclick="MSTREAMPLAYER.toggleAutoDJ();"></p></div>';

  document.getElementById("filelist").innerHTML = newHtml;
}

function onAutoDJFolderChange(el) {
  // Don't allow user to deselect all options
  if (document.querySelector("input[name=autodj-folders]:checked") === null) {
    el.checked = true;
    iziToast.warning({
      title: "Auto DJ requires a directory",
      position: "topCenter",
      timeout: 3500,
    });
    return;
  }

  if (el.checked) {
    MSTREAMPLAYER.ignoreVPaths[el.value] = false;
  } else {
    MSTREAMPLAYER.ignoreVPaths[el.value] = true;
  }

  localStorage.setItem(
    "ignoreVPaths",
    JSON.stringify(MSTREAMPLAYER.ignoreVPaths)
  );
}

function updateAutoDJRatings(el) {
  MSTREAMPLAYER.minRating = el.value;
  localStorage.setItem("minRating", JSON.stringify([MSTREAMPLAYER.minRating]));
}

////////////// Jukebox
function setupJukeboxPanel() {
  setBrowserRootPanel("Jukebox Mode", false);

  let newHtml;
  if (JUKEBOX.stats.live !== false && JUKEBOX.connection !== false) {
    newHtml = createJukeboxPanel();
  } else {
    newHtml = `
      <div class="pad-6">
        <h5>Jukebox Mode allows you to control this page remotely</h5>
        <input class="btn green" value="Connect" type="button" onclick="connectToJukeBox(this)">
      </div>`;
  }

  // Add the content
  document.getElementById("filelist").innerHTML = newHtml;
}

function createJukeboxPanel() {
  if (JUKEBOX.stats.error !== false) {
    return '<div class="pad-6">An error occurred.  Please refresh the page and try again</div>';
  }

  let address = "";
  if (MSTREAMAPI.currentServer.host) {
    address = `${MSTREAMAPI.currentServer.host}remote/${JUKEBOX.stats.adminCode}`;
  } else {
    address = `${window.location.protocol}//${window.location.host}/remote/${JUKEBOX.stats.adminCode}`;
  }

  // const address = `${window.location.protocol}//${window.location.host}/remote/${JUKEBOX.stats.adminCode}`;
  return `<div class="autoselect pad-6">
    <h4>Code: ${JUKEBOX.stats.adminCode}</h4>
    <h4><a target="_blank" href="${address}">${address}</a><h4>
    ${qrcodegen.QrCode.encodeText(
    address,
    qrcodegen.QrCode.Ecc.MEDIUM
  ).toSvgString(2)}
    </div>`;
}

function connectToJukeBox(el) {
  el.disabled = true;
  el.style.display = "none";

  document.getElementById("filelist").innerHTML += getLoadingSvg();

  JUKEBOX.createWebsocket(MSTREAMAPI.currentServer.token, false, () => {
    setupJukeboxPanel();
  });
}

//////////////////////// Local Search
function runLocalSearch(el) {
  // Do nothing if we are in the search panel
  if (document.getElementById("db-search")) {
    return;
  }

  const searchVal = el.value;
  let filelist = "";
  currentBrowsingList.forEach((x) => {
    const lowerCase = x.name !== null ? x.name.toLowerCase() : "null";
    if (lowerCase.indexOf(searchVal.toLowerCase()) !== -1) {
      if (x.type === "directory") {
        filelist += renderDirHtml(x.name);
      } else if (x.type === "playlist") {
        filelist += renderPlaylist(x.name);
      } else if (x.type === "album") {
        const albumString = x.name ? x.name : "SINGLES";
        filelist += renderAlbum(
          x.name,
          x.name === null ? x.artist : null,
          albumString,
          x.album_art_file
        );
      } else if (x.type === "artist") {
        filelist += renderArtist(x.name);
      } else {
        if (programState[programState.length - 1].state === "playlist") {
          filelist += renderFileWithMetadataHtml(
            x.filepath,
            x.lokiId,
            x.metadata
          );
        } else if (x.type == "m3u") {
          filelist += createFileplaylistHtml(x.name);
        } else {
          const fileLocation = x.path || getFileExplorerPath() + x.name;
          const title =
            x.artist != null || x.title != null
              ? x.artist + " - " + x.title
              : x.name;
          filelist += createMusicFileHtml(fileLocation, title);
        }
      }
    }
  });

  document.getElementById("filelist").innerHTML = filelist;
}

//////////////////////// Search
const searchToggles = {
  albums: true,
  artists: true,
  files: false,
  titles: true,
};

const searchMap = {
  albums: {
    name: "Album",
    class: "albumz",
    data: "album",
    func: "getAlbumsOnClick",
  },
  artists: {
    name: "Artist",
    class: "artistz",
    data: "artist",
    func: "getArtistz",
  },
  files: {
    name: "File",
    class: "filez",
    data: "file_location",
    func: "onFileClick",
  },
  title: {
    name: "Song",
    class: "filez",
    data: "file_location",
    func: "onFileClick",
  },
};

function setupSearchPanel(searchTerm) {
  setBrowserRootPanel("Search DB");
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
  programState = [{ state: "searchPanel" }];

  let valString = "";
  if (searchTerm) {
    valString = `value="${searchTerm}"`;
  }

  document.getElementById("filelist").innerHTML = `<div>
      <form id="db-search" action="javascript:submitSearchForm()" class="flex">
        <input ${valString} id="search-term" required type="text" placeholder="Search Database">
        <!-- <button type="submit" class="searchButton">
          <svg fill="#DDD" viewBox="-150 -50 1224 1174" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M960 832L710.875 582.875C746.438 524.812 768 457.156 768 384 768 171.969 596 0 384 0 171.969 0 0 171.969 0 384c0 212 171.969 384 384 384 73.156 0 140.812-21.562 198.875-57L832 960c17.5 17.5 46.5 17.375 64 0l64-64c17.5-17.5 17.5-46.5 0-64zM384 640c-141.375 0-256-114.625-256-256s114.625-256 256-256 256 114.625 256 256-114.625 256-256 256z"></path></svg>
        </button> -->
      </form>
    </div>
    <div class="flex">
      <label class="grow" for="search-in-artists">
        <input ${searchToggles.artists === true ? "checked" : ""
    } id="search-in-artists" class="filled-in" type="checkbox">
        <span>Artists</span>
      </label>
      <label class="grow" for="search-in-albums">
        <input ${searchToggles.albums === true ? "checked" : ""
    } id="search-in-albums" class="filled-in" type="checkbox">
        <span>Albums</span>
      </label>
      <label class="grow" for="search-in-titles">
        <input ${searchToggles.titles === true ? "checked" : ""
    } id="search-in-titles" class="filled-in" type="checkbox">
        <span>Song Titles</span>
      </label>
      <label class="grow" for="search-in-filepaths">
        <input ${searchToggles.files === true ? "checked" : ""
    } id="search-in-filepaths" class="filled-in" type="checkbox">
        <span>File Paths</span>
      </label>
    </div>
    <div id="search-results"></div>`;

  document.getElementById("search_folders").value = "";
  document.getElementById("search_folders").dispatchEvent(new Event("change"));

  if (searchTerm) {
    submitSearchForm();
  }
}

async function submitSearchForm() {
  try {
    document.getElementById("search-results").innerHTML +=
      '<div class="loading-screen"><svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="spinner-path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div>';

    const postObject = {
      search: document.getElementById("search-term").value,
      ignoreVPaths: Object.keys(MSTREAMPLAYER.ignoreVPaths).filter((vpath) => {
        return MSTREAMPLAYER.ignoreVPaths[vpath] === true;
      }),
    };

    if (
      document.getElementById("search-in-artists") &&
      document.getElementById("search-in-artists").checked === false
    ) {
      postObject.noArtists = true;
    }
    searchToggles.artists =
      document.getElementById("search-in-artists").checked;
    if (
      document.getElementById("search-in-albums") &&
      document.getElementById("search-in-albums").checked === false
    ) {
      postObject.noAlbums = true;
    }
    searchToggles.albums = document.getElementById("search-in-albums").checked;
    if (
      document.getElementById("search-in-filepaths") &&
      document.getElementById("search-in-filepaths").checked === false
    ) {
      postObject.noFiles = true;
    }
    searchToggles.files = document.getElementById(
      "search-in-filepaths"
    ).checked;
    if (
      document.getElementById("search-in-titles") &&
      document.getElementById("search-in-titles").checked === false
    ) {
      postObject.noTitles = true;
    }
    searchToggles.titles = document.getElementById("search-in-titles").checked;

    const res = await MSTREAMAPI.search(postObject);

    if (programState[0].state === "searchPanel") {
      programState[0].searchTerm = postObject.search;
    }

    let noResultsFlag = true;

    // Populate list
    let searchList = '<ul class="collection">';
    Object.keys(res).forEach((key) => {
      res[key].forEach((value, i) => {
        noResultsFlag = false;

        // perform some operation on a value;
        searchList += `<li class="collection-item">
          <div onclick="${searchMap[key].func}(this);" data-${searchMap[key].data
          }="${value.filepath ? value.filepath : value.name}" class="${searchMap[key].class
          } left">
            <b>${searchMap[key].name}:</b> ${value.name}
          </div>
          ${key === "files" || key === "title"
            ? `<div class="song-button-box">
            <span title="Play Now" onclick="playNow(this);" data-file_location="${value.filepath}" class="songDropdown">
              <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.5 5H11l5 7-5 7h4.5l5-7z"/><path d="M8.5 5H4l5 7-5 7h4.5l5-7z"/></svg>
            </span>
            <span title="Add To Playlist" onclick="createPopper3(this);" data-file_location="${value.filepath}" class="fileAddToPlaylist">
              <svg class="pop-f" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 292.362 292.362"><path class="pop-f" d="M286.935 69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952 0-9.233 1.807-12.85 5.424C1.807 72.998 0 77.279 0 82.228c0 4.948 1.807 9.229 5.424 12.847l127.907 127.907c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428L286.935 95.074c3.613-3.617 5.427-7.898 5.427-12.847 0-4.948-1.814-9.229-5.427-12.85z"/></svg>
            </span>
          </div>`
            : ""
          }
        </li>`;
      });
    });

    searchList += "</ul>";

    if (noResultsFlag === true) {
      searchList = "<h5>No Results Found</h5>";
    }

    document.getElementById("search-results").innerHTML = searchList;
  } catch (err) {
    boilerplateFailure(err);
  }
}

///////////////// Config
function advancedConfig() {
  setBrowserRootPanel("Config", false);

  let newHtml = `<div class="pad-6">
    <h5>Use Folders</h5>
    <p>Unchecked folders will be ignored in all DB queries (including Auto DJ)</p>`;

  for (let i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
    let checkedString = "";
    if (!MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]]) {
      checkedString = "checked";
    }
    newHtml += `
      <label for="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}">
        <input ${checkedString} id="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}" type="checkbox"
          value="${MSTREAMAPI.currentServer.vpaths[i]}" name="autodj-folders" onchange="onAutoDJFolderChange(this)">
        <span>${MSTREAMAPI.currentServer.vpaths[i]}</span>
      </label><br>`;
  }

  document.getElementById("filelist").innerHTML = newHtml;
}

////////////////// Layout
function setupLayoutPanel() {
  setBrowserRootPanel("Layout", false);

  const newHtml = `
    <div>
      <div class="switch">
        <label>
          <input onchange="tglBookCtrls(this);" type="checkbox" ${VUEPLAYERCORE.altLayout.audioBookCtrls === true ? "checked" : ""
    }>
          <span class="lever"></span>
          Audio Book Controls
        </label>
      </div>
      <br>
      <div class="switch">
        <label>
          <input onchange="flipPlayer(this);" type="checkbox" ${VUEPLAYERCORE.altLayout.flipPlayer === true ? "checked" : ""
    }>
          <span class="lever"></span>
          Player On Bottom
        </label>
      </div>
      <br>
      <div class="switch">
        <label>
          <input onchange="tglMoveMetadata(this);" type="checkbox" ${VUEPLAYERCORE.altLayout.moveMeta === true ? "checked" : ""
    }>
          <span class="lever"></span>
          Metadata in Queue
        </label>
      </div>
      <br>
      <!-- <div class="switch">
        <label>
          <input type="checkbox">
          <span class="lever"></span>
          Single Browser
        </label>
      </div>
      <br> -->
      <!-- <div class="switch">
        <label>
          <input type="checkbox">
          <span class="lever"></span>
          Light Mode
        </label>
      </div> -->
    </div>`;

  // Add the content
  document.getElementById("filelist").innerHTML = newHtml;
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("mstream-player").style.display = "block";
  document.getElementById("filelist").style.display = "block";
  document.getElementById("playlist").style.display = "block";
  document.getElementById("header_tab").style.display = "block";
  document.getElementById("backbtn").style.display = "block";
  document.getElementById("local_search_btn").style.display = "block";
  document.getElementById("add_all").style.display = "block";
  document.getElementById("newcontent").style.display = "none";
  document.getElementById("content").style.display = "flex";
}

function tglMoveMetadata() {
  VUEPLAYERCORE.altLayout.moveMeta = !VUEPLAYERCORE.altLayout.moveMeta;
  localStorage.setItem("altLayout", JSON.stringify(VUEPLAYERCORE.altLayout));
}

function tglBookCtrls() {
  VUEPLAYERCORE.altLayout.audioBookCtrls =
    !VUEPLAYERCORE.altLayout.audioBookCtrls;
  localStorage.setItem("altLayout", JSON.stringify(VUEPLAYERCORE.altLayout));
}

function flipPlayer() {
  VUEPLAYERCORE.altLayout.flipPlayer = !VUEPLAYERCORE.altLayout.flipPlayer;
  document.getElementById("content").classList.toggle("col-rev");
  document.getElementById("flip-me").classList.toggle("col-rev");

  localStorage.setItem("altLayout", JSON.stringify(VUEPLAYERCORE.altLayout));
}

async function updateServer() {
  try {
    document.getElementById("save_server").disabled = true;

    let host = document.getElementById("server_address").value;
    if (host.slice(-1) !== "/") {
      host += "/";
    }

    const res = await MSTREAMAPI.login(
      document.getElementById("server_username").value,
      document.getElementById("server_password").value,
      host
    );

    MSTREAMAPI.currentServer.host = host;
    MSTREAMAPI.currentServer.username =
      document.getElementById("server_username").value;
    MSTREAMAPI.currentServer.token = res.token;

    myModal.close();

    init();
    loadinstruction();
    // loadFileExplorer();
    localStorage.setItem(
      "current-server",
      JSON.stringify(MSTREAMAPI.currentServer)
    );
    document.getElementById("server_password").value = "";
  } catch (err) {
    console.log(err);
    boilerplateFailure(err);
  } finally {
    document.getElementById("save_server").disabled = false;
  }
}

function isElectron() {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    window.process.type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}

function initElectron() {
  const navEl = document.getElementById("sidenav");

  // remove links
  navEl.removeChild(document.querySelector("#admin-side-link"));
  navEl.removeChild(document.querySelector("#logout-side-link"));

  // add link to edit server
  navEl.innerHTML += `<div class="side-nav-item my-waves" onclick="changeView(openEditModal, this);">
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3s-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7zm-.9.8c-.9-.9-2.1-1.4-3.3-1.4s-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8zM19 13h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm3.5 0h-2v-2h2v2zm3.5 0h-2v-2h2v2z"/></svg>
  <span>Edit Server</span>
  </div>`;

  try {
    const curServer = JSON.parse(localStorage.getItem("current-server"));
    console.log(curServer);
    if (curServer.host && curServer.token) {
      MSTREAMAPI.currentServer.host = curServer.host;
      MSTREAMAPI.currentServer.token = curServer.token;
      MSTREAMAPI.currentServer.username = curServer.username;
    }
  } catch (err) { }

  // check if server
  if (!MSTREAMAPI.currentServer.host) {
    openEditModal();
  } else {
    loadFileExplorer();
    init();
  }
  // if not edit server panel
}

if (isElectron()) {
  initElectron();
} else {
  init();
  loadinstruction();
  // loadFileExplorer();
}

function loadIframe() {
  var fileLocation = document
    .getElementById("newfileLocation")
    .getAttribute("data-file-location");
  location.href = "iframe.html";
  //file=' + encodeURIComponent(fileLocation);
}

function loadmusicTab() {
  // document.getElementsByClassName('row-x grow').style.display = 'none';
  setBrowserRootPanel("Music Lessons");
  const musictab = `<div class="row row-x grow">
  <div id="browser1" class="col col-x s12 m12 h1 flex-x">
      <div class="header-tab hide-on-small-only">
          <h4 class="panel_one_name" style="color: #ffffff; margin: 30px 0 0 10px;">Music
              Lessons</h4>
      </div>
      <div id="directory_bar1" class="level-2 flex">


          <div id="search_folders1" class="super-hide">
              <input id="localSearchBar1" onkeyup="runLocalSearch(this)" type="text" placeholder="Search List"
                  autocomplete="off">
          </div>

      </div>
      <div class="upload-progress-bar">
          <div style="width:0%" id="upload-progress-inner1" class="upload-progress-inner"></div>
      </div>
      <div id="filelist1">
          <ul class="collection">
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Abhi Na Jao.mp3" class="filez " id="newfileLocation1"
                      onclick="changeView(loadfirstiframe, this)">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 1 - C MAJOR SCALE</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Ae mere watan.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadsecondiframe, this)">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 2 - JINGLE BELLS</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Chukar mere maan ko guiar tab sheet.mp3"
                      class="filez " id="newfileLocation" onclick="changeView(loadthirdiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 3 - FIVE HUNDRED MILES</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Five Hundred Miles.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadfourthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 4 - YEH SHAAM MASTANI</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/GOT Theme.mp3" class="filez " id="newfileLocation"
                      onclick="changeView(loadfifthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 5 - MERE SAPNO KI RANI</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadsixthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 6 - NATIONAL ANTHEM</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadseventhiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 7 - CHUKAR MERE MANN KO</span>

                      </span>
                  </div>
                 
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadeightiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 8 - TU JOH MILA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadninthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 9 - TUJSE NARAJ NAHI ZINDAGI</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadtenthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 10 - AANE WALA PAL</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadeleventhiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 11 - JEENA JEENA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(loadtwelvthiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 12 - KAKAAN</span>

                      </span>
                  </div>
                  
              </li>
          </ul>
          <ul class="collection">
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Abhi Na Jao.mp3" class="filez " id="newfileLocation1"
                      onclick="changeView(load13thiframe, this)">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 13 - LO MAAN LIYA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Ae mere watan.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load14thiframe, this)">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 14 - ZINDA HU YAAR</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Chukar mere maan ko guiar tab sheet.mp3"
                      class="filez " id="newfileLocation" onclick="changeView(load15thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 15 - ZINDAGI DO PAL KI</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/Five Hundred Miles.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load16thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 16 - TU HAR LAMHA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/GOT Theme.mp3" class="filez " id="newfileLocation"
                      onclick="changeView(load17thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 17 - TUMHI JAKE BHALO BASO</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load18thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 18 - TOMAKE CHUYE DILAN</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load19thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 19 - FULA RE FULLA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load20thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 20 - AMAY PRASHNA KARE</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load21stiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 21 - AMARO PARANO JAHA CHAY</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load22ndiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 22 - LAICHHANA JAYAT</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load23rdiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 23 - JASHN E BAHARA</span>

                      </span>
                  </div>
                  
              </li>
              <li class="collection-item">
                  <div data-file_location="/music-tracks/JINGLE BELLS SHEET.mp3" class="filez "
                      id="newfileLocation" onclick="changeView(load24thiframe, this);">
                      <svg class="music-image" height="18" width="18" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40">
                          <path
                              d="M9 37.5c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V5.429l25-3.846V29c0 3.584-2.916 6.5-6.5 6.5s-6.5-2.916-6.5-6.5 2.916-6.5 6.5-6.5a6.43 6.43 0 012.785.634l.715.34V11.023l-19 2.931V31c0 3.584-2.916 6.5-6.5 6.5z"
                              fill="#8A#7f0"></path>
                          <path
                              d="M37 2.166V29c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V10.441l-1.152.178-18 2.776-.848.13V31c0 3.308-2.692 6-6 6s-6-2.692-6-6 2.692-6 6-6a5.93 5.93 0 012.57.586l1.43.68V5.858l24-3.692M38 1L12 5v19.683A6.962 6.962 0 009 24a7 7 0 107 7V14.383l18-2.776v11.076A6.962 6.962 0 0031 22a7 7 0 107 7V1z"
                              fill="#4e7ab5"></path>
                      </svg>
                      <span>

                          <span class="item-text">LESSON NO. 24 - TUM HI HO</span>

                      </span>
                  </div>
                  
              </li>
          </ul>
      </div>
      <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    <a href="#" onclick="changeView(loadmusicTab, this)" class="tab-item active">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
        style="enable-background:new 0 0 48 48">
        <path
          d="M452-160q6 20 16.5 41.5T490-80H200q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h480q33 0 56.5 23.5T760-800v284q-18-2-40-2t-40 2v-284H480v280l-100-60-100 60v-280h-80v640h252ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-50-100 160-100-160-100v200ZM280-800h200-200Zm172 0H200h480-240 12Z" />
      </svg>
      <span>Music Lessons</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>
      <div style="visibility:hidden; position: absolute;" class="pop-f" id="pop-f" role="tooltip">
          <div class="pop-f pop-playlist">Add To Playlist:</div>
          <div class="pop-list-item" onclick="addToPlaylistUI('Music Tracks')">• Music Tracks</div>
          <div class="pop-list-item" onclick="addToPlaylistUI('Sample tracks')">• Sample tracks</div>
      </div>
  </div>


</div>`;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";
  document.getElementById("newcontent").style.flexBasis = "auto";
  if (document.getElementById("newcontent").offsetWidth >= 600) {
    document.getElementById("newcontent").style.overflowY = "hidden";
  } else {
    document.getElementById("newcontent").style.overflowY = "scroll";
    document.getElementById("newcontent").style.marginTop = "0px";
  }
  document.getElementById("newcontent").innerHTML = musictab;
  document.getElementById("content").style.display = "none";

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadinstruction(event) {
  // window.location.href = 'instruction.html';
  const instruction = `
  
  <h5 class="steps">Steps for beginner:</h5>
  <h5 class="intro">Before you begin, it's important to have some basic knowledge. If you're completely new to guitar and have no prior experience, please follow these initial steps:
</h6>
<h6 class="points">1. Learn to Tune Your Guitar Using an App: Using a tuning app is an easy and effective way to ensure your guitar is in tune.
</h6>
<iframe src="https://www.youtube.com/embed/338d2XeGzww?si=NzKyAGZMTpONK2pN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="iframe"></iframe>
<h6 class="points">2. How to Hold Your Guitar: Properly holding your guitar is crucial for comfort and ease of playing.</h6>
<iframe class="iframe" src="https://www.youtube.com/embed/dUpjh7CcY_0?si=DRQPjuzotP2Wen3k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h6 class="points">3. How to Hold a Plectrum: Knowing how to correctly hold a plectrum (pick) is important for effective strumming and picking.
</h6>
<iframe class="iframe" src="https://www.youtube.com/embed/OT29cTu67L4?si=T6xkPz_paavuTeiN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h6 class="points">4. How to Read Tabs: Understanding how to read guitar tablature (tabs) will help you play a wide variety of songs.
</h6>
<iframe class="iframe iframe-last" src="https://www.youtube.com/embed/pQC3JsbgaTw?si=ooBV7wj7DTLn02m7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h5 class="note">Note - "Please remember that things won't come easily at first; you need to give consistent effort and be patient to learn things properly."</h6>
<div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item active" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>
  `;

  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";
  if (document.getElementById("newcontent").offsetWidth >= 600) {
    document.getElementById("newcontent").style.flexBasis = "inherit";
  } else {
    document.getElementById("newcontent").style.flexBasis = "fit-content";
    document.getElementById("newcontent").style.marginTop = "0px";
  }
  document.getElementById("newcontent").scrollTop = 0;
  document.getElementById("newcontent").style.overflowY = "scroll";

  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = instruction;

  const newUrl = window.location.origin + "/instructions";
  window.history.pushState({ path: newUrl }, "", newUrl);

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  // menuButton.addEventListener("click", toggleMenu);
}

function loadfirstiframe() {
  // window.location.href = 'abhinajao.html';
  const first_iframe = `

  <iframe src="https://www.soundslice.com/slices/cHWzc/embed/" class="load-iframe" width="100%" height="100%" frameBorder="0" allowfullscreen></iframe>
  <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = first_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadsecondiframe() {
  // window.location.href = 'abhinajao.html';
  const second_iframe = `

 <iframe src="https://www.soundslice.com/slices/hdWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>


  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = second_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadthirdiframe() {
  // window.location.href = 'abhinajao.html';
  const third_iframe = `

 <iframe src="https://www.soundslice.com/slices/xdWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>


  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = third_iframe;
  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadfourthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const fourth_iframe = `

    <iframe src="https://www.soundslice.com/slices/DJWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = fourth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadfifthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const fifth_iframe = `

    <iframe src="https://www.soundslice.com/slices/nHWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = fifth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadsixthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const sixth_iframe = `

    <iframe src="https://www.soundslice.com/slices/s7Wzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = sixth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadseventhiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const seventh_iframe = `

    <iframe src="https://www.soundslice.com/slices/trWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = seventh_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadeightiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const eight_iframe = `

    <iframe src="https://www.soundslice.com/slices/prWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = eight_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadninthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const ninth_iframe = `

    <iframe src="https://www.soundslice.com/slices/RhWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = ninth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadtenthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const tenth_iframe = `

   <iframe src="https://www.soundslice.com/slices/xqWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

   <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = tenth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadeleventhiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const eleventh_iframe = `

   <iframe src="https://www.soundslice.com/slices/WhWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

   <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = eleventh_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function loadtwelvthiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const twelth_iframe = `

    <iframe src="https://www.soundslice.com/slices/hhWzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = twelth_iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load13thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

   <iframe src="https://www.soundslice.com/slices/zMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

   <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>
  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load14thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

   <iframe src="https://www.soundslice.com/slices/WMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

   <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load15thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

   <iframe src="https://www.soundslice.com/slices/PMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

   <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load16thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

  <iframe src="https://www.soundslice.com/slices/xMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

  <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load17thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

 <iframe src="https://www.soundslice.com/slices/gMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load18thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

 <iframe src="https://www.soundslice.com/slices/pMjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load19thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

 <iframe src="https://www.soundslice.com/slices/fkjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load20thiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

 <iframe src="https://www.soundslice.com/slices/ykjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load21stiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

 <iframe src="https://www.soundslice.com/slices/2kjzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

 <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load22ndiframe() {
  // window.location.href = 'fivehundredmiles.html';
  const iframe = `

<iframe src="https://www.soundslice.com/slices/t4jzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

<div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = iframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load23rdiframe() {
  const twentythirdiframe = `

    <iframe src="https://www.soundslice.com/slices/k6Lzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = twentythirdiframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function load24thiframe() {
  const twentyfourthiframe = `

    <iframe src="https://www.soundslice.com/slices/j6Lzc/embed/" width="100%" height="100%" class="load-iframe" frameBorder="0" allowfullscreen></iframe>

    <div class="menu-overlay">
    <div class="menu-options">
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
      <button class="option-button" onclick="MSTREAMAPI.logout();">Logout</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>
  </nav>

  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";

  document.getElementById("newcontent").style.overflowY = "hidden";
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = twentyfourthiframe;

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);
}

function chord(element) {
  const chord = `
    <div class="chord-main">
      <div class="baarish" id="chord-lyrics">
      <pre class="song-details-pre">
Song - Baarish
Singer - Mohammed Irfan, Gajendra Verma
Music - Mithoon
Lyricist - Mithon
Movie - Yaariyan</pre>
        <pre>
<span class="chordset">(Gm)</span> Dil mera hai nasamajh <span class="chordset">(F)</span> kitna
<span class="chordset">(Cm)</span> Besabar ye bevakoof <span class="chordset">(Gm)</span> bada
<span class="chordset">(Gm)</span> Chahta hai kitna <span class="chordset">(F)</span> tujhe
<span class="chordset">(F)</span> Khud magar nahi jaan <span class="chordset">(Gm)</span> saka

<span class="chordset">(Gm)</span> Is dard-e-dil ki sifaarish
Ab <span class="chordset">(F)</span> kar de koi yahaan
Ke <span class="chordset">(D#)</span> mil jaye ise wo baarish
Jo <span class="chordset">(D)</span> bhiga de poori <span class="chordset">(Gm)</span> tarah

<span class="chordset">(Gm)</span> Is dard-e-dil ki sifaarish
Ab <span class="chordset">(F)</span> kar de koi yahaan
Ke <span class="chordset">(D#)</span> mil jaye ise wo baarish
Jo <span class="chordset">(D)</span> bhiga de poori <span class="chordset">(Gm)</span> tarah

<span class="chordset">(Gm)</span> Yaariyaan <span class="chordset">(F)</span>
<span class="chordset">(Gm)</span> Yaariyaan <span class="chordset">(F)</span>

<span class="chordset">(Dm D# Cm Gm)</span>

<span class="chordset">(Gm)</span> Kya hua <span class="chordset">(Dm)</span> asar tere <span class="chordset">(C)</span> sath rehkar na jane
Ki <span class="chordset">(D#)</span> hosh <span class="chordset">(F)</span> mujhe na <span class="chordset">(Gm)</span> raha
<span class="chordset">(Gm)</span> Lafz me <span class="chordset">(Dm)</span> re <span class="chordset">(C)</span> zubaan pe aake ruke
Par <span class="chordset">(D#)</span> ho na <span class="chordset">(F)</span> sake wo <span class="chordset">(Gm)</span> bayaan

<span class="chordset">(D#)</span> Dhadkan tera hi <span class="chordset">(F)</span> naam jape
<span class="chordset">(D#)</span> Aankhein bhi <span class="chordset">(F)</span> paigaam yeh de
<span class="chordset">(D#)</span> Teri nazar ka yeh asar hai <span class="chordset">(D)</span> mujhpe jo hua

<span class="chordset">(Gm)</span> Is dard-e-dil ki sifaarish
Ab <span class="chordset">(F)</span> kar de koi yahaan
Ke <span class="chordset">(D#)</span> mil jaye ise wo baarish
Jo <span class="chordset">(D)</span> bhiga de poori <span class="chordset">(Gm)</span> tarah
<span class="chordset">(Gm)</span> Is dard-e-dil ki sifaarish
Ab <span class="chordset">(F)</span> kar de koi yahaan
Ke <span class="chordset">(D#)</span> mil jaye ise wo baarish
Jo <span class="chordset">(D)</span> bhiga de poori <span class="chordset">(Gm)</span> tarah</pre>
      </div>
      <div class="chord-func">
      <div class="chord-btn">
        <span id="transpose-txt">SCALE TRANSPOSE</span>
        <button id="transposeUp">+1</button>
        <button id="transposeDown">-1</button>
        <button class="reset-btn" id="reset-scale">RESET</button>
      </div>
     
      <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
      <div class="capo-container" id="capo">
        <div class="capo-h2">
          <h2>FIND BEST CAPO POSITION</h2>
        </div>
        <button id="findBestCapo">Find Best Capo Position</button>
        <div id="result"></div>
      </div>

      <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

      <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
    </div>
    </div>
  `;

  const parineeta = `<div class="chord-main">
      <div class="baarish" id="chord-lyrics">
      <pre class="song-details-pre">
Song - Kaisi Paheli Zindagani
Singer -  Sunidhi Chauhan
Music - Shantanu Moitra
Lyricist - Swanand Kirkire
Movie - Parineeta</pre>
      <pre>
[Intro]
<span class="chordset">(A# Gm Cm F)</span> X2

[Verse]                                 
<span class="chordset">(A#)</span>Nayi nahin nayi yeh baaten, 
Yeh baaten hain pu<span class="chordset">(Cm)</span>rani
<span class="chordset">(F)</span>Kaisi paheli hai, 
Yeh Kaisi paheli zinda<span class="chordset">(A#)</span>gani
                                          
<span class="chordset">(A#)</span>Thaama haan roka isko kisne, 
Haan yeh to behta <span class="chordset">(Cm)</span>paani                          
<span class="chordset">(F)</span>Kaisi paheli hai, 
Yeh kaisi paheli zinda<span class="chordset">(A#)</span>gani
 
[Bridge]   
<span class="chordset">(A#)</span>La <span class="chordset">(D#)</span>La <span class="chordset">(F)</span> La <span class="chordset">(A#)</span>La
La La La <span class="chordset">(D#)</span>La
Zoo  Zoo  Zoo  <span class="chordset">(F)</span>Zoo, 
Zoo  Zoo,Zoo,Zoo <span class="chordset">(A#)</span>Zoo
                          
<span class="chordset">(A#)</span>Pee <span class="chordset">(D#)</span>le <span class="chordset">(F)</span>i<span class="chordset">(A#)</span>se 
ismein na<span class="chordset">(D#)</span>sha Jisne pi<span class="chordset">(F)</span>ya 
woh gham mein bhi han<span class="chordset">(A#)</span>sa
 
[Verse]                             
<span class="chordset">(A#)</span>Pal mein hansaye aur Pal mein
rulaaye yeh ka<span class="chordset">(Cm)</span>hani
<span class="chordset">(F)</span>Kaisi paheli hai Yeh
kaisi paheli zinda<span class="chordset">(A#)</span>gani
                                         
<span class="chordset">(A#)</span>Thaama haan roka isko kisne 
Haan yeh to behta <span class="chordset">(Cm)</span>paani
<span class="chordset">(F)</span>Kaisi pahali hai Yeh 
kaisi paheli zinda<span class="chordset">(A#)</span>gani ooh

[Bridge]
<span class="chordset">(A#)</span>La <span class="chordset">(D#)</span>La <span class="chordset">(F)</span>La <span class="chordset">(A#)</span>La
La La La <span class="chordset">(D#)</span>La
Zoo  Zoo  Zoo  <span class="chordset">(F)</span>Zoo, 
Zoo  Zoo,Zoo,Zoo <span class="chordset">(A#)</span>Zoo
    
<span class="chordset">(A#)</span>Aan <span class="chordset">(D#)</span>khon <span class="chordset">(F)</span>mein <span class="chordset">(A#)</span>gar 
sapna na<span class="chordset">(D#)</span>ya Aansu te<span class="chordset">(F)</span>ra 
ik moti hai ba<span class="chordset">(A#)</span>na 

[Verse]                                    
<span class="chordset">(A#)</span>Sooni dagar pe jaise Soyi 
yeh chhanv ho su<span class="chordset">(Cm)</span>haani
<span class="chordset">(F)</span>Kaisi paheli hai Yeh 
kaisi paheli zinda<span class="chordset">(A#)</span>gani
                                         
<span class="chordset">(A#)</span>Thaama haan roka isko kisne 
Haan yeh to behta <span class="chordset">(Cm)</span>paani                  
<span class="chordset">(F)</span>Kaisi kaisi paheli Zinda<span class="chordset">(A#)</span>gani ooh baby

[Verse]
<span class="chordset">(A#)</span>Nayi nahin nayi yeh baaten, 
Yeh baaten hain pu<span class="chordset">(Cm)</span>rani
<span class="chordset">(F)</span>Kaisi paheli hai, 
Yeh Kaisi paheli zinda<span class="chordset">(A#)</span>gani 

<span class="chordset">(A#)</span>Thaama haan roka isko kisne, 
Haan yeh to behta <span class="chordset">(Cm)</span>paani   
<span class="chordset">(F)</span>Kaisi paheli hai, 
Yeh kaisi paheli zinda<span class="chordset">(A#)</span>gani</pre>

      </div>
      <div class="chord-func">
      
      <div class="chord-btn">
        <span id="transpose-txt">SCALE TRANSPOSE</span>
        <button id="transposeDown">-1</button>
        <button id="transposeUp">+1</button>
        <button class="reset-btn" id="reset-scale">RESET</button>
      </div>
     
      <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
      <div class="capo-container" id="capo">
        <div class="capo-h2">
          <h2>FIND BEST CAPO POSITION</h2>
        </div>
        <button id="findBestCapo">Find Best Capo Position</button>
        <div id="result"></div>
      </div>

      <div class="overlay"></div>

      <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

      <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
    </div>
    </div>`;

  const yess_boss = `<div class="chord-main">
      <div class="baarish" id="chord-lyrics">
      <pre class="song-details-pre">
Song - Main Koi Aisa Geet Gaoon
Singer -  Abhijeet & Alka Yagnik
Music - Jatin - Lalit
Lyricist - Javed Akhtar
Movie - Yes Boss</pre>
      <pre>
[Intro]
<span class="chordset">(G) (Em) (D) (G)</span> X2

[Chorus]                                  
Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
..Little Pause [ Music ]
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon
..Little Pause [ Music ]

Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon        
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho

<span class="chordset">(G) (Em) (D) (G)</span> - [ Music ]

[Chorus]
Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon      
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho.....

Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon      
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho.....

[Verse 1]
<span class="chordset">(G)</span>Tum Ko Bulaoon, Yeh <span class="chordset">(Bm)</span>Palkein Bichaoon
Ka<span class="chordset">(C)</span>dam Tum Jahan Jahan Ra<span class="chordset">(D)</span>kho
Zameen Ko <span class="chordset">(G)</span>Aasman Ba<span class="chordset">(D)</span>noo
Si<span class="chordset">(G)</span>taroon Se Sa<span class="chordset">(D)</span>jaoon
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho

[Chorus]
Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho

[Instrumental]

[Verse 2]
<span class="chordset">(G)</span>Main Titliyoon Ke Peeche <span class="chordset">(G)</span>Bhagoon
Main Jugnuoon Ke Peeche <span class="chordset">(D)</span>Jaoon                 
<span class="chordset">(G)</span>Ye Rang Hai, Woh Roshni Hai                
Tumhare Paas Dono <span class="chordset">(D)</span>Laoon

<span class="chordset">(C)</span>Jitni Khushbooye<span class="chordset">(D)</span>in........
<span class="chordset">(A)</span>Baag Mein Mi<span class="chordset">(D)</span>lein..........
Haan, <span class="chordset">(C)</span>Jitni Khushbooye<span class="chordset">(D)</span>in
<span class="chordset">(A)</span>Baag Mein <span class="chordset">(D)</span>Milein

Main Laoon Wa<span class="chordset">(C)</span>han Pe Ke
<span class="chordset">(D)</span>Tum Ho <span class="chordset">(G)</span>Jahan <span class="chordset">(D)</span>Jahan Pe
<span class="chordset">(G)</span>Ek Pal Bhi <span class="chordset">(D)</span>Thairoon
<span class="chordset">(G)</span>Main Gulsita <span class="chordset">(D)</span>Banaoon
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum <span class="chordset">(G)</span>Kaho

[Chorus]
Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon         
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho

[Instrumental]

[Verse 3]
<span class="chordset">(G)</span>Agar Kaho To Main Sunaoon          
Tumhe Haseen Kahani<span class="chordset">(D)</span>yaan             
<span class="chordset">(G)</span>Sunoogi Kya Meri Zubani              
Tum Ek Paari Ki Das<span class="chordset">(D)</span>taan

<span class="chordset">(C)</span>Ya Main <span class="chordset">(D)</span>Karoon.......
<span class="chordset">(A)</span>Tumse <span class="chordset">(D)</span>Baiyaan.......
<span class="chordset">(C)</span>Ya Main <span class="chordset">(D)</span>Karoon <span class="chordset">(A)</span>Tumse <span class="chordset">(D)</span>Baiyaan
<span class="chordset">(C)</span>Ke Raja Se Rani <span class="chordset">(D)</span>Mili Thi 
<span class="chordset">(G)</span>Kahan <span class="chordset">(D)</span>Kahani<span class="chordset">(G)</span>yoon Ke Na<span class="chordset">(D)</span>gar Mein
<span class="chordset">(G)</span>Tumhe Le Ke <span class="chordset">(D)</span>Jaoon
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho
 
[Bridge]
<span class="chordset">(G)</span>Tum Ko Bulaoon, Yeh <span class="chordset">(Bm)</span>Palkein Bichaoon
Ka<span class="chordset">(C)</span>dam Tum Jahan Jahan Ra<span class="chordset">(D)</span>kho
Zameen Ko <span class="chordset">(G)</span>Aasman Ba<span class="chordset">(D)</span>noo
Si<span class="chordset">(G)</span>taroon Se Sa<span class="chordset">(D)</span>jaoon
<span class="chordset">(C)</span>Agar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho

[Chorus]
Main Koi <span class="chordset">(G)</span>Aisa Geet <span class="chordset">(D)</span>Gaoon
Ke <span class="chordset">(G)</span>Aarzoo Ja<span class="chordset">(D)</span>gaoon        
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho
A<span class="chordset">(C)</span>gar <span class="chordset">(D)</span>Tum Ka<span class="chordset">(G)</span>ho
L<span class="chordset">(C)</span>La <span class="chordset">(D)</span>La La<span class="chordset">(G)</span>La
hm<span class="chordset">(C)</span>hm <span class="chordset">(D)</span>hm hm<span class="chordset">(G)</span>hm</pre>

      </div>
      <div class="chord-func">
      <div class="chord-btn">
        <span id="transpose-txt">SCALE TRANSPOSE</span>
        <button id="transposeDown">-1</button>
        <button id="transposeUp">+1</button>
        <button class="reset-btn" id="reset-scale">RESET</button>
      </div>
     
      <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
      <div class="capo-container" id="capo">
        <div class="capo-h2">
          <h2>FIND BEST CAPO POSITION</h2>
        </div>
        <button id="findBestCapo">Find Best Capo Position</button>
        <div id="result"></div>
      </div>

      <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

      <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>

    </div>
    </div>`;

  const khamoshiyaan = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song - Khamoshiyan
Singer -   Arijit Singh
Composer - Jeet Gannguli
Lyricist - Rashmi Singh
Movie - Khamoshiyan</pre>
    <pre>
<span class="chordset">(Dm)</span>Khamoshiyaan.....A<span class="chordset">(F)</span>waaz Hain
Tum <span class="chordset">(Am)</span>Sunne to Aao Ka<span class="chordset">(Gm)</span>bhi....
Chu <span class="chordset">(Dm)</span>Kar Tumhe....Khil <span class="chordset">(F)</span>Jayengi
Ghar <span class="chordset">(Am)</span>Inko Bulao Ka<span class="chordset">(Gm)</span>bhi...

[Pre-Chorus]

<span class="chordset">(A#)</span>Beqrar Hain....<span class="chordset">(A#)</span>Baat Karne Ko...
<span class="chordset">(C)</span>Kahne Do Inko Za<span class="chordset">(A)</span>raaaa....

[Chorus]

Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Teri Me<span class="chordset">(C)</span>ri...Khamoshi<span class="chordset">(F)</span>yan...
Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Lipti Hu<span class="chordset">(C)</span>i...Khamoshi<span class="chordset">(F)</span>yan...<span class="chordset">(Am)(Dm)</span>

[Bridge]

<span class="chordset">(Dm)</span>Kya Uss Gali Mein, Kabhi Tera Jana, Hu<span class="chordset">(Gm)</span>a
Ja<span class="chordset">(C)</span>haan Se Zamaane, Ko Guzre Zamaana, Hu<span class="chordset">(F)</span>a...
<span class="chordset">(Dm)</span>Mera Samay Toh, Wahin Pe Hai Thehra, Hu<span class="chordset">(Gm)</span>a
Ba<span class="chordset">(C)</span>taaun Tumhe Kya, Mere Sath Kya Kya, Hu<span class="chordset">(F)</span>a...

[Verse 2]

Kha<span class="chordset">(Dm)</span>moshiyan...Ek <span class="chordset">(F)</span>Saaz Hai
Tum <span class="chordset">(Am)</span>Dhun Koi Laao <span class="chordset">(Gm)</span>Zaraa...
Kha<span class="chordset">(Dm)</span>moshiyan...Al<span class="chordset">(F)</span>faaz Hai    
Kabhi <span class="chordset">(Am)</span>Aa Gunguna Le <span class="chordset">(Gm)</span>Zaraa...

[Pre-Chorus]

<span class="chordset">(A#)</span>Beqrar Hain....<span class="chordset">(A#)</span>Baat Karne Ko...
<span class="chordset">(C)</span>Kahne Do Inko Za<span class="chordset">(A)</span>raaaa....

[Chorus]

Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Teri Me<span class="chordset">(C)</span>ri...Khamoshi<span class="chordset">(F)</span>yan...
Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Lipti Hu<span class="chordset">(C)</span>i...Khamoshi<span class="chordset">(F)</span>yan...<span class="chordset">(Am)(Dm)</span>

[Bridge]

<span class="chordset">(Dm)</span>Nadiya Ka Paani, Bhi Khamosh Behta, Ya<span class="chordset">(Gm)</span>haan
<span class="chordset">(C)</span>li Chandni Mein, Chhipi Lakh Khamoshi<span class="chordset">(F)</span>yan...
<span class="chordset">(Dm)</span>Baarish Ki Boondon, Ki Hoti Kahaan Hai Zu<span class="chordset">(Gm)</span>baan
Su<span class="chordset">(C)</span>lagte Dilon Mein, Hain Khamosh Uthta <span class="chordset">(F)</span>Dhuan...

[Verse 3]

Kha<span class="chordset">(Dm)</span>moshiyan....Aa<span class="chordset">(F)</span>kash Hain
Tum <span class="chordset">(Am)</span>Udne Toh Aao Za<span class="chordset">(Gm)</span>raa...
Kha<span class="chordset">(Dm)</span>moshiyan....Eh<span class="chordset">(F)</span>sas Hain
Tumhe <span class="chordset">(Am)</span>Mehsoos Hoti Hai <span class="chordset">(Gm)</span>Kya....

[Pre-Chorus]

<span class="chordset">(A#)</span>Beqrar Hain....<span class="chordset">(A#)</span>Baat Karne Ko...
<span class="chordset">(C)</span>Kahne Do Inko Za<span class="chordset">(A)</span>raaa....

[Chorus]

Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Teri Me<span class="chordset">(C)</span>ri...Khamoshi<span class="chordset">(F)</span>yan...
Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Lipti Hu<span class="chordset">(C)</span>i...Khamoshi<span class="chordset">(F)</span>yan...

Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Teri Me<span class="chordset">(C)</span>ri...Khamoshi<span class="chordset">(F)</span>yan...
Khamoshi<span class="chordset">(A#)</span>yan.....<span class="chordset">(A#)</span>
Lipti Hu<span class="chordset">(C)</span>i...Khamoshi<span class="chordset">(F)</span>yan...<span class="chordset">(Am)(Dm)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const dhadak = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song - Dhadak
Singer -   Ajay Gogavale & Shreya Ghoshal
Composer - Ajay-Atul
Lyricist - Amitabh Bhattacharya
Movie - Dhadak</pre>
    <pre>
<span class="chordset">(Gm)</span> Marhami sa chaand hai <span class="chordset">(Dm)</span> tu
Diljala <span class="chordset">(F)</span> sa main andhe<span class="chordset">(Gm)</span>ra<span class="chordset">(D)</span>
Ek doo<span class="chordset">(Gm)</span>je ke liye <span class="chordset">(Dm)</span> hai
Neend me<span class="chordset">(F)</span>ri,khwaab te<span class="chordset">(Gm)</span>ra

Tu ghata <span class="chordset">(Gm)</span> hai phu<span class="chordset">(Cm)</span>haar <span class="chordset">(F)</span> ki
Main ghadi <span class="chordset">(F)</span> inte<span class="chordset">(A#)</span>zaar <span class="chordset">(D#)</span> ki
<span class="chordset">(D#)</span> Apna milna likha
<span class="chordset">(F)</span> Issi baras hai <span class="chordset">(D)</span> na

Jo <span class="chordset">(Gm)</span> meri manzilo ko jaati <span class="chordset">(Dm)</span> hai
Tere <span class="chordset">(Cm)</span> naam ki koi sadak hai <span class="chordset">(Gm)</span>na<span class="chordset">(D)</span>
Jo <span class="chordset">(Gm)</span> mere dil ko dil banaati <span class="chordset">(Dm)</span> hai
Tere <span class="chordset">(Cm)</span> naam ki <span class="chordset">(D)</span> koi dhadak hai <span class="chordset">(Gm)</span> na

<span class="chordset">(G)</span> Koi baadhni joda odh ke
<span class="chordset">(G)</span> Baabul ki <span class="chordset">(Cm)</span> gali
<span class="chordset">(F)</span> aau chhod <span class="chordset">(A#)</span> ke <span class="chordset">(D)</span>
<span class="chordset">(G)</span> Tere hi liye laungi piya

<span class="chordset">(G)</span> Solah saal <span class="chordset">(Cm)</span> ke <span class="chordset">(F)</span> saawan jod <span class="chordset">(A#)</span> ke
Pyaar se <span class="chordset">(D)</span> tham<span class="chordset">(Gm)</span>na dor
ba<span class="chordset">(D)</span>rik <span class="chordset">(Gm)</span> hai
Saat jan<span class="chordset">(D)</span>mon ki <span class="chordset">(Cm)</span> yeh
pehli taa<span class="chordset">(A#)</span>rikh <span class="chordset">(D)</span> hai

Dor ka <span class="chordset">(Gm)</span>ek <span class="chordset">(Cm)</span>main sir<span class="chordset">(F)</span>ra
Aur te<span class="chordset">(F)</span>ra hai <span class="chordset">(A#)</span>dus<span class="chordset">(D#)</span>ra
Jud sake bich mein <span class="chordset">(F)</span> kayi tadap hai <span class="chordset">(D)</span> na
Jo <span class="chordset">(Gm)</span> meri manzilon ko jati <span class="chordset">(Dm)</span> hai

Tere <span class="chordset">(Cm)</span> naam ki koi sadak hai <span class="chordset">(Gm)</span>na<span class="chordset">(D)</span>
Jo <span class="chordset">(Gm)</span> mere dil ko dil banaati <span class="chordset">(Dm)</span> hai
Tere <span class="chordset">(Cm)</span> naam ki <span class="chordset">(D)</span> koi dhadak hai <span class="chordset">(Gm)</span> na</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const darkhast = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song - Darkhaast
Singer -   Arijit Singh & Sunidhi Chauhan 
Composer - Mithoon 
Lyricist - Sayeed Quadr
Movie - Shivaay</pre>
    <pre>
<span class="chordset">(G)</span>Iss qadar..<span class="chordset">(Bm)</span>
Tu mujhe <span class="chordset">(G)</span>pyaar kar..<span class="chordset">(Bm)</span>
Jisey <span class="chordset">(G)</span>kabhi na main s<span class="chordset">(Bm)</span>akoon
Phir <span class="chordset">(Em)</span>bhula..<span class="chordset">(D)</span>
 
<span class="chordset">(G)</span>Zindagi..<span class="chordset">(Bm)</span>
Laayi <span class="chordset">(G)</span>humein yahaan..<span class="chordset">(Bm)</span>
Koi i<span class="chordset">(Em)</span>raada toh ra<span class="chordset">(C)</span>ha hoga bha<span class="chordset">(D)</span>la
 
[Chorus]

Ki dar<span class="chordset">(G)</span>khaast hai yeh
Jo aayi <span class="chordset">(Bm)</span>raat hai yeh      
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de
 
Jo ab lam<span class="chordset">(G)</span>haat hai yeh
Bade hi <span class="chordset">(Bm)</span>khaas hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de [x2]
 
[Humming]
<span class="chordset">(G)(Bm)(C)(D)(G)</span>
 
<span class="chordset">(C)</span>Raahon mein mere <span class="chordset">(Em)</span>saath chal tu
<span class="chordset">(C)</span>Thaame mera <span class="chordset">(Em)</span>haath chal tuj
<span class="chordset">(C)</span>Waqt jitna <span class="chordset">(D)</span>bhi ho haasil
<span class="chordset">(C)</span>Saara mere <span class="chordset">(Em)</span>naam kar tu
 
<span class="chordset">(Am)</span>
Waqt jitna bhi ho haasil
<span class="chordset">(D)</span>
Saara mere naam kar tu...
 
{Chorus]
   
Ki ar<span class="chordset">(G)</span>maan hai yeh
Guzaarish <span class="chordset">(Bm)</span>jaan hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de
 
Jo ab lam<span class="chordset">(G)</span>haat hai yeh
Bade hi <span class="chordset">(Bm)</span>khaas hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de
  
[Verse]

<span class="chordset">(G)</span>Lamz jismon pe aise sajaye
<span class="chordset">(Bm)</span>Baarishon se bhi woh dhul na paaye                      
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya bhula de...<span class="chordset">(G)</span>
 
Ho <span class="chordset">(G)</span>naksh lamhon pe aise banaye
<span class="chordset">(Bm)</span>Muddaton se bhi woh mit na paaye           
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya bhula de...<span class="chordset">(G)</span>
 
Hmm.. <span class="chordset">(C)</span>tujhse toh hoon main yun <span class="chordset">(D)</span>bohat mutasir
<span class="chordset">(C)</span>Par kya karoon main hoon <span class="chordset">(D)</span>ek musafir
<span class="chordset">(C)</span>Kaisi khushi hai <span class="chordset">(Am)</span>jisme nami hai
<span class="chordset">(F)</span>Jaane tu ye ya <span class="chordset">(D)</span>jaane na, <span class="chordset">(G)</span>o…
 
[Chorus]
     
Jo jaz<span class="chordset">(G)</span>baat hai yeh
Bade hi <span class="chordset">(Bm)</span>pak hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de

Jo ab <span class="chordset">(G)</span>lamhaat hai yeh
Bade hi <span class="chordset">(Bm)</span>khaas hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de
 
{Outro]
   
Ki <span class="chordset">(G)</span>darkhaast hai yeh
Jo aayi <span class="chordset">(Bm)</span>raat hai yeh
Tu <span class="chordset">(C)</span>meri baahon mein <span class="chordset">(D)</span>duniya <span class="chordset">(G)</span>bhula de....</pre>

    </div>
    <div class="chord-func">
   
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const raaz = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
     <pre class="song-details-pre">
Song: Raaz Aankhei Teri
Singer: Arijit Singh
Music : Jeet Gannguli
Movie: Raaz-Reboot</pre>
    <pre>
Raaz<span class="chordset">(Am)</span> aankhein te<span class="chordset">(G)</span>ri
Sab ba<span class="chordset">(G)</span>yaan kar ra<span class="chordset">(F)</span>hi
Sun ra<span class="chordset">(Dm)</span>ha dil te<span class="chordset">(E)</span>ri khamoshi<span class="chordset">(Am)</span>yaan

Kuch ka<span class="chordset">(Am)</span>ho na su<span class="chordset">(G)</span>no
Paas<span class="chordset">(G)</span> mere ra<span class="chordset">(F)</span>ho
Ishq<span class="chordset">(Dm)</span> ki kaisi hai<span class="chordset">(E)</span> ye gehrai<span class="chordset">(Am)</span>yaan

Saa<span class="chordset">(Dm)</span>ya bhi jism<span class="chordset">(G)</span> se
Ho<span class="chordset">(F)</span>ta hai kya judaa
Jit<span class="chordset">(Dm)</span>ni bhi zor<span class="chordset">(G)</span> ki ho aandhi<span class="chordset">(E)</span>yaan

Raaz<span class="chordset">(Am)</span> aankhein te<span class="chordset">(G)</span>ri
Sab ba<span class="chordset">(G)</span>yaan kar ra<span class="chordset">(F)</span>hi
Sun ra<span class="chordset">(Dm)</span>ha dil te<span class="chordset">(E)</span>ri khamoshi<span class="chordset">(Am)</span>yaan

<span class="chordset">(Am)</span> <span class="chordset">(F)</span> <span class="chordset">(Dm)</span> <span class="chordset">(E)</span>

<span class="chordset">(C)</span> Jeene ka tu sahara
<span class="chordset">(E)</span> Tu hi roshni
<span class="chordset">(C)</span> Kehta hai har sitara
<span class="chordset">(E)</span> Meri tu chand<span class="chordset">(F)</span>ni

<span class="chordset">(F)</span> Hum judaa ho<span class="chordset">(G)</span> jaaye
Aisa<span class="chordset">(G)</span> mumkin na<span class="chordset">(E)</span>hi

Dhoop<span class="chordset">(Am)</span> ho tum me<span class="chordset">(G)</span>ri
Chaanv<span class="chordset">(G)</span> bhi ho tum<span class="chordset">(F)</span> hi
Paas<span class="chordset">(Dm)</span> ho toh door<span class="chordset">(E)</span> hai tanhaai<span class="chordset">(Am)</span>yaan

<span class="chordset">(C)</span> Main chalunga mushkilon mein
<span class="chordset">(E)</span> Saaya ban tera
<span class="chordset">(C)</span> Is jahan mein, us jahan mein
<span class="chordset">(E)</span> Bas ek tu me<span class="chordset">(F)</span>ra

<span class="chordset">(F)</span> Khusbuon se<span class="chordset">(G)</span> teri
Mehke<span class="chordset">(G)</span> jism me<span class="chordset">(E)</span>ra

Raat<span class="chordset">(Am)</span> aayegi<span class="chordset">(G)</span> toh
Main su<span class="chordset">(G)</span>bah laaun<span class="chordset">(F)</span>ga
Maut<span class="chordset">(Dm)</span> aayegi<span class="chordset">(E)</span> toh lad jaaun<span class="chordset">(Am)</span>ga

Saa<span class="chordset">(Dm)</span>ya bhi jism<span class="chordset">(G)</span> se
Ho<span class="chordset">(F)</span>ta hai kya judaa
Jit<span class="chordset">(Dm)</span>ni bhi zor<span class="chordset">(G)</span> ki ho aandhi<span class="chordset">(E)</span>yaan

Kuch ka<span class="chordset">(Am)</span>ho na su<span class="chordset">(G)</span>no
Paas<span class="chordset">(G)</span> mere ra<span class="chordset">(F)</span>ho
Ishq<span class="chordset">(Dm)</span> ki kaisi hai<span class="chordset">(E)</span> ye gehrai<span class="chordset">(Am)</span>yaan</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const sapnokiraani = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Meri Sapnon Ki Rani
Singer: Kishor Kumar
Music : JS. D. Burman
Movie: Aradhana</pre>
    <pre>
Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa

Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa

<span class="chordset">(A#m)</span> Pyaar ki galiyaan<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Baagon ki kaliyaan<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Sab rang<span class="chordset">(G#)</span> raliyaan<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(C#)</span> Pooch ra<span class="chordset">(A#m)</span>hi hai<span class="chordset">(A#m)</span>

<span class="chordset">(A#m)</span> Pyaar ki galiyaan
<span class="chordset">(A#m)</span> Baagon ki kaliyaa
<span class="chordset">(A#m)</span> Sab rang<span class="chordset">(G#)</span> raliyaan
<span class="chordset">(C#)</span> Pooch ra<span class="chordset">(A#m)</span>hi hai<span class="chordset">(A#m)</span>

Geet<span class="chordset">(G#)</span> panghat pe<span class="chordset">(C#)</span> kis din<span class="chordset">(A#m)</span> gaayegi tu

Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa

<span class="chordset">(A#m)</span> Phool si khilke<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Paas aa dil ke<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Door se milke<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(C#)</span> Chain na aaye<span class="chordset">(A#m)</span>

<span class="chordset">(A#m)</span> Phool si khilke
<span class="chordset">(A#m)</span> Paas aa dil ke
<span class="chordset">(A#m)</span> Door se milke
<span class="chordset">(C#)</span> Chain na aaye<span class="chordset">(A#m)</span>

Aur<span class="chordset">(G#)</span> kab tak mu<span class="chordset">(C#)</span>jhe tad<span class="chordset">(A#m)</span>paayegi tu

Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa

<span class="chordset">(A#m)</span> Kya hai bharosa<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Aashiq dil ka<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(A#m)</span> Aur kisi pe<span class="chordset">(A#m)</span> <span class="chordset">(G#)</span>
<span class="chordset">(C#)</span> Yeh aa jaaye<span class="chordset">(A#m)</span>

<span class="chordset">(A#m)</span> Kya hai bharosa
<span class="chordset">(A#m)</span> Aashiq dil ka
<span class="chordset">(A#m)</span> Aur kisi pe
<span class="chordset">(C#)</span> Yeh aa jaaye<span class="chordset">(A#m)</span>

Aa<span class="chordset">(G#)</span> gaya to bo<span class="chordset">(C#)</span>hot pach<span class="chordset">(A#m)</span>taayegi tu

Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa

Mere<span class="chordset">(A#m)</span> sapnon ki<span class="chordset">(G#)</span> rani kab<span class="chordset">(A#m)</span> aayegi tu
Aayi<span class="chordset">(A#m)</span> rut mas<span class="chordset">(G#)</span>taani kab<span class="chordset">(F#)</span> aayegi tu
Beeti<span class="chordset">(A#m)</span> jaaye zinda<span class="chordset">(G#)</span>gaani kab<span class="chordset">(C#)</span> aayegi tu
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa
Chali<span class="chordset">(G#)</span> aa, tu chali<span class="chordset">(A#m)</span> aa
Chali<span class="chordset">(G#)</span> aa, haan tu chali<span class="chordset">(A#m)</span> aa</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const chahume = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
     <pre class="song-details-pre">
Song: Chahun Main Ya Naa
Singer: Arijit Singh, Palak Muchhal
Music : Jeet Gangulli
Movie: Aashiqui 2</pre>
    <pre>
<span class="chordset">(Am)</span>Tu hi ye mujhko ba<span class="chordset">(G)</span>ta de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Apne tu dil kapa<span class="chordset">(G)</span>ta de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>

<span class="chordset">(Am)</span>Tu hi ye mujhko<span class="chordset">(G)</span>bata de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Apne tu dil ka<span class="chordset">(G)</span>pata de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>

<span class="chordset">(Am)</span>Itna bata doon tujhko
<span class="chordset">(G)</span>Chahat pe apni mujhko
<span class="chordset">(F)</span>Yun to nahi ikhti<span class="chordset">(G)</span>yaar
<span class="chordset">(Am)</span>Phir bhi yeh socha dil ne
<span class="chordset">(G)</span>Ab jo laga hoon milne
<span class="chordset">(F)</span>Poochu tujhe ek<span class="chordset">(G)</span>baar

<span class="chordset">(Am)</span>Tu hi ye mujhko ba<span class="chordset">(G)</span>ta de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Apne tu dil ka pa<span class="chordset">(G)</span>ta de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>

<span class="chordset">(Am)</span><span class="chordset">(G)</span><span class="chordset">(F)</span><span class="chordset">(G)</span>

<span class="chordset">(C)</span>Aisi kabhi<span class="chordset">(Am)</span>pehle
Hui<span class="chordset">(F)</span>na thi khwahi<span class="chordset">(G)</span>shein
<span class="chordset">(C)</span>Kisi se bhi<span class="chordset">(Am)</span>milne
Ki na<span class="chordset">(F)</span>ki thi koshi<span class="chordset">(G)</span>shein

<span class="chordset">(Am)</span>Uljhan meri sul<span class="chordset">(G)</span>jha de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Aankhon aankhon mein ja<span class="chordset">(G)</span>ta de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>

<span class="chordset">(C)</span>Mere chote chote khwaab hain
Khaabon mein<span class="chordset">(Em)</span>geet hain
Geeton mein<span class="chordset">(F)</span>zindagi hai<span class="chordset">(G)</span>
Chaahat hai<span class="chordset">(C)</span>preet hai

Abhi main na dekhoon<span class="chordset">(C)</span>khwaab wo
Jin mein na<span class="chordset">(Em)</span>tu mile
Le khole<span class="chordset">(F)</span>honth maine<span class="chordset">(G)</span>
Ab tak the<span class="chordset">(C)</span>jo sile

<span class="chordset">(Am)</span>Mujhko na jitna mujh pe
<span class="chordset">(G)</span>Utna is dil ko tujh pe
<span class="chordset">(F)</span>Hone laga ait<span class="chordset">(E)</span>baar
<span class="chordset">(Am)</span>Tanha lamhon mein apne
<span class="chordset">(G)</span>Bunti hoon tere sapne
<span class="chordset">(F)</span>Tujhse hua mujhko<span class="chordset">(E)</span>pyaar

<span class="chordset">(Am)</span>Poochungi tujhko<span class="chordset">(G)</span>kabhi na
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Tere khaabon mein ab<span class="chordset">(G)</span>jeena
<span class="chordset">(F)</span>Chahun main kyun na<span class="chordset">(G)</span>

<span class="chordset">(Am)</span><span class="chordset">(F)</span><span class="chordset">(G)</span>
<span class="chordset">(Am)</span><span class="chordset">(F)</span><span class="chordset">(G)</span>

<span class="chordset">(Am)</span>Tu hi ye mujhko<span class="chordset">(G)</span>bata de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span>
<span class="chordset">(Am)</span>Apne tu dil ka<span class="chordset">(G)</span>pata de
<span class="chordset">(F)</span>Chahun main ya na<span class="chordset">(G)</span></pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const yehfitoormera = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Yeh Fitoor Mera
Singer: Arijit Singh
Music : Amit Trivedi
Lyrics: Swanand Kirkire
Movie: Fitoor</pre>
    <pre>
[Verse]

<span class="chordset">(F#m)</span>Zindagi ne<span class="chordset">(A)</span>ki hai kaisi<span class="chordset">(B)</span>saazishein,
<span class="chordset">(F#m)</span>Poori hui<span class="chordset">(A)</span>dil ki wo far<span class="chordset">(B)</span>maishein..<span class="chordset">(E)</span><span class="chordset">(B)</span>
<span class="chordset">(F#m)</span>Maangi duaa ek<span class="chordset">(A)</span>tujh tak jaa pahunchi,
<span class="chordset">(B)</span>Parvardigara, parvardigara
<span class="chordset">(F#m)</span>Kaisi suni tune<span class="chordset">(A)</span>meri khamoshi,
O<span class="chordset">(B)</span>parvardigara

[Chorus]

Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra laaya<span class="chordset">(A)</span>mujhko hai tere ka<span class="chordset">(B)</span>reeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra rehmat<span class="chordset">(A)</span>teri<span class="chordset">(B)</span>
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra maine<span class="chordset">(A)</span>badla re mera na<span class="chordset">(B)</span>seeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra chaahat<span class="chordset">(A)</span>teri
<span class="chordset">(B)</span>O  parvardigara, parvardigara

[Instrumental]

<span class="chordset">(F#m A B)</span> (X2)

[Verse]

<span class="chordset">(F#m)</span>Dheeme dheeme<span class="chordset">(A)</span>jal rahi thi<span class="chordset">(B)</span>khwaishein,
<span class="chordset">(F#m)</span>Dil mein dabi,<span class="chordset">(A)</span>ghut rahi far<span class="chordset">(B)</span>maaishein<span class="chordset">(E)</span><span class="chordset">(B)</span>
<span class="chordset">(F#m)</span>Banke dhuaan wo<span class="chordset">(A)</span>Tujh tak jaa pahunchi,<span class="chordset">(B)</span>parvardigara..
<span class="chordset">(F#m)</span>Deewangi ki<span class="chordset">(A)</span>hadd maine nochi o<span class="chordset">(B)</span>parvardigara

[Chorus]

Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra laaya<span class="chordset">(A)</span>mujhko hai tere ka<span class="chordset">(B)</span>reeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra rehmat<span class="chordset">(A)</span>teri<span class="chordset">(B)</span>
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra maine<span class="chordset">(A)</span>badla re mera na<span class="chordset">(B)</span>seeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra chaahat<span class="chordset">(A)</span>teri
<span class="chordset">(B)</span>O  parvardigara, parvardigara (COUPLE OF TIMES)

[Instrumental]
<span class="chordset">(B)</span> (X2)
<span class="chordset">(F#m)</span> <span class="chordset">(A)</span> <span class="chordset">(B)</span> <span class="chordset">(E)</span>
<span class="chordset">(D)</span> <span class="chordset">(F#m)</span> <span class="chordset">(A)</span> <span class="chordset">(E)</span> (X2)
<span class="chordset">(F#m)</span> <span class="chordset">(E)</span> <span class="chordset">(B7)</span> Break

[Chorus]

Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra laaya<span class="chordset">(A)</span>mujhko hai tere ka<span class="chordset">(B)</span>reeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra rehmat<span class="chordset">(A)</span>teri<span class="chordset">(B)</span>
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra maine<span class="chordset">(A)</span>badla re mera na<span class="chordset">(B)</span>seeb,
Ye fi<span class="chordset">(D)</span>toor me<span class="chordset">(E)</span>ra chaahat<span class="chordset">(A)</span>teri
<span class="chordset">(B)</span>O  parvardigara, parvardigara......</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const tujohmila = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Tu Jo Mila
Singer: KK
Music : Pritam
Lyrics: Kausar Munir
Movie: Bajrangi Bhaijaan</pre>
    <pre>
<span class="chordset">(C)</span> Aashiyaana <span class="chordset">(Em)</span> mera
<span class="chordset">(C)</span> Saath tere <span class="chordset">(Em)</span> hai na
<span class="chordset">(F)</span> Dhoondhte te<span class="chordset">(F)</span>ri gali
<span class="chordset">(F)</span> Mujhko ghar mi<span class="chordset">(G)</span>la

<span class="chordset">(C)</span> Aab o daana <span class="chordset">(Em)</span> mera
<span class="chordset">(C)</span> Haath tere <span class="chordset">(Em)</span> hai na
<span class="chordset">(F)</span> Dhoondhte te<span class="chordset">(F)</span>ra Khuda
<span class="chordset">(F)</span> Mujhko Rab <span class="chordset">(G)</span> mila

Tu jo mi<span class="chordset">(Dm)</span>la
Lo ho gaya main kaa<span class="chordset">(G)</span>bil
Tu jo mi<span class="chordset">(Em)</span>la
To ho gaya sab haa<span class="chordset">(F)</span>sil <span class="chordset">(C)</span>haan

Mushkil sa<span class="chordset">(Dm)</span>hi
Aasaan hui man<span class="chordset">(G)</span>zil
Kyunki <span class="chordset">(F)</span>Tu Dhad<span class="chordset">(G)</span>kan
Main <span class="chordset">(C)</span> Dil

<span class="chordset">(C)</span> Rooth jaana <span class="chordset">(Em)</span> tera
<span class="chordset">(C)</span> Maan jaana <span class="chordset">(Em)</span> mera
<span class="chordset">(F)</span> Dhoondhte te<span class="chordset">(F)</span>ri hansi
<span class="chordset">(F)</span> Mil gayi meri khu<span class="chordset">(G)</span>shi

<span class="chordset">(C)</span> Raah hoon main <span class="chordset">(Em)</span> teri
<span class="chordset">(C)</span> Tu hai tu <span class="chordset">(Em)</span> meri
<span class="chordset">(F)</span> Dhoondhte te<span class="chordset">(F)</span>re nishaan
<span class="chordset">(F)</span> Mill gayi khu<span class="chordset">(G)</span>di

Tu jo mi<span class="chordset">(Dm)</span>la
Lo ho gaya main kaa<span class="chordset">(G)</span>bil
Tu jo mi<span class="chordset">(Em)</span>la
To ho gaya sab haa<span class="chordset">(F)</span>sil <span class="chordset">(C)</span>haan
Mushkil sa<span class="chordset">(Dm)</span>hi
Aasaan hui man<span class="chordset">(G)</span>zil
Kyunki <span class="chordset">(F)</span> Tu Dhad<span class="chordset">(G)</span>kan
Main <span class="chordset">(C)</span> Dil

Tu jo mi<span class="chordset">(Dm)</span>la
Lo ho gaya main aa<span class="chordset">(G)</span>bil
Tu jo mi<span class="chordset">(Em)</span>la
To ho gaya sab haa<span class="chordset">(F)</span>sil <span class="chordset">(C)</span>haan
Mushkil sa<span class="chordset">(Dm)</span>hi
Aasaan hui man<span class="chordset">(G)</span>zil
Kyunki <span class="chordset">(F)</span> Tu Dhad<span class="chordset">(G)</span>kan
Main <span class="chordset">(C)</span> Dil</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const abhimujme = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
     <pre class="song-details-pre">
Song: Abhi Mujh Mein Kahin
Singer: Sonu Nigam
Music : Ajay Atul
Lyrics: Amitabh Bhattacharya
Movie: Agneepath </pre>
    <pre>
<span class="chordset">(D)</span> Abhi mujh mein kahin
Baaki <span class="chordset">(G)</span>thodi si <span class="chordset">(D)</span>hai
zinda<span class="chordset">(Bm)</span>gi<span class="chordset">(F#)</span>
 
<span class="chordset">(D)</span>Jagi dhadkan nayi
Jaana <span class="chordset">(G)</span>zinda hoon
<span class="chordset">(D)</span>main toh a<span class="chordset">(Bm)</span>bhi<span class="chordset">(F#)</span>
 
Kuch <span class="chordset">(G)</span>aisi la<span class="chordset">(A)</span>gan
Is <span class="chordset">(G)</span>lamhe mein <span class="chordset">(A)</span>hai
Ye <span class="chordset">(E)</span>lamha ka<span class="chordset">(G)</span>haan tha me<span class="chordset">(A)</span>ra
 
Ab <span class="chordset">(D)</span>hai saam<span class="chordset">(Bm)</span>ne
Ise <span class="chordset">(D)</span>choo loon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa<span class="chordset">(F#)</span>
 
Khushi<span class="chordset">(D)</span>yaan choom <span class="chordset">(Bm)</span>loon
Ya <span class="chordset">(D)</span>roloon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa
 
Ho <span class="chordset">(D)</span>Abhi mujh mein kahin
Baaki <span class="chordset">(G)</span>thodi si <span class="chordset">(D)</span>hai zinda<span class="chordset">(Bm)</span>gi
 
Ho <span class="chordset">(D)</span>dhoop mein
jal<span class="chordset">(C)</span>te huey tann <span class="chordset">(D)</span>ko
Chaa<span class="chordset">(Bm)</span>ya ped ki<span class="chordset">(F#)</span>i mil
ga<span class="chordset">(D)</span>yi<span class="chordset">(F#)</span>
 
<span class="chordset">(D)</span>Roothe bachche
<span class="chordset">(C)</span>ki hansi jai<span class="chordset">(D)</span>se
Phus<span class="chordset">(Bm)</span>lane se <span class="chordset">(F#)</span>phir khil
ga<span class="chordset">(D)</span>yi
 
Kuch ai<span class="chordset">(E)</span>sa hi mehsoos
dil ko <span class="chordset">(D)</span>ho raha hai
Barson <span class="chordset">(E)</span>ke puraane zakhmo pell
mar<span class="chordset">(D)</span>ham laga sa hai
 
Ek <span class="chordset">(G)</span>aisa Re<span class="chordset">(A)</span>hem
Is <span class="chordset">(G)</span>lamhe mein <span class="chordset">(A)</span>hai
Ye <span class="chordset">(E)</span>lamha ka<span class="chordset">(G)</span>haan tha me<span class="chordset">(A)</span>ra
 
Ab <span class="chordset">(D)</span>hai saam<span class="chordset">(Bm)</span>ne
Ise <span class="chordset">(D)</span>choo loon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa<span class="chordset">(F#)</span>
 
Khushi<span class="chordset">(D)</span>yaan choom <span class="chordset">(Bm)</span>loon
Ya <span class="chordset">(D)</span>roloon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa
 
<span class="chordset">(D)</span>Dor se tu<span class="chordset">(C)</span>ti patang jai<span class="chordset">(D)</span>si
Thi <span class="chordset">(Bm)</span>ye zinda<span class="chordset">(F#)</span>gani me<span class="chordset">(D)</span>ri<span class="chordset">(F#)</span>
<span class="chordset">(D)</span>Aaj hai kal <span class="chordset">(C)</span>ho mera na <span class="chordset">(D)</span>ho
Har <span class="chordset">(Bm)</span>din thi ka<span class="chordset">(F#)</span>hani me<span class="chordset">(D)</span>ri
 
Ek ban<span class="chordset">(E)</span>dhan naya peechhe
se ab mujh<span class="chordset">(D)</span>ko bulaye
Aane <span class="chordset">(E)</span>wale kal ki kyun fikar
mujh<span class="chordset">(D)</span>ko sata jaye
 
Ek <span class="chordset">(G)</span>aisi chu<span class="chordset">(A)</span>bhan
Is <span class="chordset">(G)</span>lamhe mein <span class="chordset">(A)</span>hai
Ye <span class="chordset">(E)</span>lamha ka<span class="chordset">(G)</span>haan tha me<span class="chordset">(A)</span>ra
 
Ab <span class="chordset">(D)</span>hai saam<span class="chordset">(Bm)</span>ne
Ise <span class="chordset">(D)</span>choo loon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa<span class="chordset">(F#)</span>
 
Khushi<span class="chordset">(D)</span>yaan choom <span class="chordset">(Bm)</span>loon
Ya <span class="chordset">(D)</span>roloon za<span class="chordset">(A)</span>ra
Mar <span class="chordset">(G)</span>jaaoon ya <span class="chordset">(A)</span>jee loon
za<span class="chordset">(D)</span>raa</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const hamariadhuri = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Hamari Adhuri Kahani
Singer: Arijit Singh
Music : Jeet Gannguli
Lyrics: Rashmi Singh and Virag Mishra
Movie: Hamari Adhuri Kahani</pre>
    <pre>
Paas <span class="chordset">(C)</span>aaye..
Doori<span class="chordset">(C)</span>yaan phir bhi kam
naa hu<span class="chordset">(F)</span>i Ek a<span class="chordset">(C)</span>dhuri
si hamari kahani ra<span class="chordset">(F)</span>hi
 
Aas<span class="chordset">(F)</span>maan ko zameen,
ye zaroori nahi
Ja Mi<span class="chordset">(G)</span>le.. Ja Mi<span class="chordset">(C)</span>le..
 
Ishq <span class="chordset">(F)</span>saccha wahi
Jisko milti nahi
manzi<span class="chordset">(G)</span>lein.. manzi<span class="chordset">(C)</span>lein..
 
[Hook]
 
Rang <span class="chordset">(C)</span>thhe, noor tha
Jab ka<span class="chordset">(F)</span>reeb tu tha
Ek <span class="chordset">(G)</span>jannat sa tha,
yeh ja<span class="chordset">(C)</span>haan<span class="chordset">(E)</span>
 
Waqt <span class="chordset">(C)</span>ki ret pe
kuch me<span class="chordset">(F)</span>re naam sa
Likh ke <span class="chordset">(A#)</span>chhod gaya
tu ka<span class="chordset">(C)</span>haan<span class="chordset">(G)(C)</span>
 
 
[Chorus]
 
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..
 
[Verse]
 
<span class="chordset">(C)</span>Khushbuon se teri
<span class="chordset">(C)</span>unhi takra ga<span class="chordset">(F)</span>ye
<span class="chordset">(Dm)</span>Chalte chalte <span class="chordset">(G)</span>dekho na
<span class="chordset">(Em)</span>Hum kahaan aa ga<span class="chordset">(Am)</span>ye
 
[Hook]
 
Janna<span class="chordset">(C)</span>tein agar yahin
Tu di<span class="chordset">(F)</span>khe kyon nahin
Chaand <span class="chordset">(G)</span>suraj sabhi
hai ya<span class="chordset">(C)</span>haan<span class="chordset">(E)</span>
 
Inte<span class="chordset">(C)</span>zar tera
sadiyon <span class="chordset">(F)</span>se kar raha
Pyaasi <span class="chordset">(A#)</span>baithi hai kab se
ya<span class="chordset">(C)</span>haan<span class="chordset">(G)(C)</span>
 
 
[Chorus]
 
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..
 
[Verse]
 
<span class="chordset">(C)</span>Pyaas ka ye safar
khatam ho jaye<span class="chordset">(F)</span>ga
<span class="chordset">(Dm)</span>Kuch adhura <span class="chordset">(G)</span>sa jo tha
<span class="chordset">(Em)</span>poora ho jaye<span class="chordset">(Am)</span>ga
 
 
[Hook]
 
Jhuk ga<span class="chordset">(C)</span>ya aasmaan
Mill ga<span class="chordset">(F)</span>ye do jahaan
Har ta<span class="chordset">(G)</span>raf hai milan
ka sa<span class="chordset">(C)</span>maa<span class="chordset">(E)</span>
 
Doli<span class="chordset">(C)</span>ya hain saji,
khushbo<span class="chordset">(F)</span>yein har kahin
Padhne <span class="chordset">(A#)</span>aaya Khuda
khud ya<span class="chordset">(C)</span>haan<span class="chordset">(G)(C)</span>..
 
 
[Chorus]
 
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..
Ha<span class="chordset">(Am)</span>mari adhuri ka<span class="chordset">(F)</span>hani..
Ha<span class="chordset">(G)</span>mari adhuri ka<span class="chordset">(C)</span>hani..</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const yehjism = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
     <pre class="song-details-pre">
Song: Yeh Jism
Singer: Ali Azmat
Music : Arko Pravo Mukherjee
Lyrics: Arko Pravo Mukherjee,Munish
Movie: Jism 2</pre>
    <pre>
Yeh <span class="chordset">(Em)</span> jism hai toh kya Ye rooh ka libaas hai
Yeh <span class="chordset">(D)</span> dard hai toh kya Ye ishq ki talash hai
Fa<span class="chordset">(C)</span>naa kiya mujhe Ye chahne ki aas ne
Ta<span class="chordset">(D)</span>raa ta<span class="chordset">(C)</span>raa shi<span class="chordset">(Em)</span>kast hi hua
 
Ra<span class="chordset">(Em)</span>za hai kya teri, dilo Jahaan tabaah kiya
Sa<span class="chordset">(D)</span>zaa bhi kya teri, wafaa ko bewafaa kiya
<span class="chordset">(C)</span>Wah re zindagi, se yun mujhe juda kiya
Ka<span class="chordset">(D)</span>haan Ka<span class="chordset">(C)</span>haan, phi<span class="chordset">(Em)</span>run main dhoondta
 
Ra<span class="chordset">(Em)</span>za hai kya teri, dilo Jahaan tabaah kiya
Sa<span class="chordset">(D)</span>zaa bhi kya teri, wafaa ko bewafaa kiya
<span class="chordset">(C)</span>Wah re zindagi, se yun mujhe juda kiya
Ka<span class="chordset">(D)</span>haan Ka<span class="chordset">(C)</span>haan, phi<span class="chordset">(Em)</span>run main dhoondta
 
Wa<span class="chordset">(Em)</span>haan jahaan tuhi mera libaas hai
Wa<span class="chordset">(D)</span>haan jahaan teri hi bas talash hai
Wa<span class="chordset">(C)</span>haan jahaan tujhi pe khatam aas hai
Wa<span class="chordset">(D)</span>hin shu<span class="chordset">(C)</span>ru wa<span class="chordset">(Em)</span>hin pe dafan jaan hai
 
Wa<span class="chordset">(Em)</span>haan jahaan tuhi mera libaas hai
Wa<span class="chordset">(D)</span>haan jahaan teri hi bas talash hai
Wa<span class="chordset">(C)</span>haan jahaan tujhi pe khatam aas hai
Wa<span class="chordset">(D)</span>hin shu<span class="chordset">(C)</span>ru wa<span class="chordset">(Em)</span>hin pe dafan jaan hai
 
Yeh <span class="chordset">(Em)</span> jism hai toh kya Ye rooh ka libaas hai
Yeh <span class="chordset">(D)</span> dard hai toh kya Ye ishq ki talash hai
Fa<span class="chordset">(C)</span>naa kiya mujhe Ye chahne ki aas ne
Ta<span class="chordset">(D)</span>raa ta<span class="chordset">(C)</span>raa shi<span class="chordset">(Em)</span>kast hi hua</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const ajibdastan = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Ajib Dastan Hain Yeh
Singer: Lata Mangeshkar
Music : Shankar Jaikishan
Lyrics: Shailendra
Movie: Dil Apna Aur Preet Parai>/pre>

<pre>
[Chorus]
<span class="chordset">(F)</span>Ajeeb dastaan hai <span class="chordset">(F)</span>ye,
<span class="chordset">(F)</span>Kahan shuru kahan kha-<span class="chordset">(Gm)</span>tam
<span class="chordset">(Gm)</span>Yeh manzilein hai kaun-<span class="chordset">(A#)</span>si,
<span class="chordset">(C)</span>Na woh samajh sake na <span class="chordset">(F)</span>hum
 
[Verse 1]
<span class="chordset">(F)</span>Yeh roshni ke sath <span class="chordset">(A#)</span>kyu,
Dhuan utha chirag <span class="chordset">(F)</span>se X2
<span class="chordset">(C)</span>Yeh khwab dekhti hu <span class="chordset">(A#)</span>mai,
<span class="chordset">(A#)</span>Ke jag padi hu khwab <span class="chordset">(F)</span>se
 
[Chorus]
<span class="chordset">(F)</span>Ajeeb dastaan hai <span class="chordset">(F)</span>ye,
<span class="chordset">(F)</span>Kahan shuru kahan kha-<span class="chordset">(Gm)</span>tam
<span class="chordset">(Gm)</span>Yeh manzilein hai kaun-<span class="chordset">(A#)</span>si,
<span class="chordset">(C)</span>Na woh samajh sake na <span class="chordset">(F)</span>hum
  
[Verse 2]
<span class="chordset">(F)</span>Mubarke tumhe ke <span class="chordset">(A#)</span>tum,
Kisi ke nur ho ga<span class="chordset">(F)</span>ye X2
<span class="chordset">(C)</span>Kisi ke itne pas <span class="chordset">(A#)</span>ho,
<span class="chordset">(A#)</span>Ke sab se dur ho ga<span class="chordset">(F)</span>ye
 
[Chorus]
<span class="chordset">(F)</span>Ajeeb dastaan hai <span class="chordset">(F)</span>ye,
<span class="chordset">(F)</span>Kahan shuru kahan kha-<span class="chordset">(Gm)</span>tam
<span class="chordset">(Gm)</span>Yeh manzilein hai kaun-<span class="chordset">(A#)</span>si,
<span class="chordset">(C)</span>Na woh samajh sake na <span class="chordset">(F)</span>hum 
 
[Verse 3]
<span class="chordset">(F)</span>Kisi ka pyar leke <span class="chordset">(A#)</span>tum,
Naya jahan basaao-<span class="chordset">(F)</span>ge X2
<span class="chordset">(C)</span>Yeh shaam jab bhi aaye-<span class="chordset">(A#)</span>gi,
Tum humko yaad aao-<span class="chordset">(F)</span>ge
 
[Chorus]
<span class="chordset">(F)</span>Ajeeb dastaan hai <span class="chordset">(F)</span>ye,
<span class="chordset">(F)</span>Kahan shuru kahan kha-<span class="chordset">(Gm)</span>tam
<span class="chordset">(Gm)</span>Yeh manzilein hai kaun-<span class="chordset">(A#)</span>si,
<span class="chordset">(C)</span>Na woh samajh sake na <span class="chordset">(F)</span>hum</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const ikkkudi = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Ikk Kudi 
Singer: Shahid Mallya
Music : Amit Trivedi
Lyrics: Late Shri shiv kumar Batalvi
Movie: Udta Punjab</pre>
    
    <pre>
[Intro]
<span class="chordset">(F# E B F#)</span> (x2)
 
[Verse 1]
 
<span class="chordset">(F#)</span>Ikk kudi jida<span class="chordset">(E)</span> naam mohabbat
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai...
<span class="chordset">(F#)</span>O saad muraadi, so<span class="chordset">(E)</span>hni phabbat
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai
 
[Solo]
<span class="chordset">(F#)</span> <span class="chordset">(E)</span> <span class="chordset">(B)</span> <span class="chordset">(F#)</span>
 
[Bridge]
 
O.. Soo<span class="chordset">(B)</span>rat oss <span class="chordset">(F#)</span>di, pari<span class="chordset">(B)</span>yaan war<span class="chordset">(F#)</span>gi
See<span class="chordset">(D#m)</span>rat di o<span class="chordset">(E)</span>.. mariyam <span class="chordset">(F#)</span>lagdi
Has<span class="chordset">(B)</span>ti hai <span class="chordset">(F#)</span>taan phul <span class="chordset">(B)</span>jhad'de <span class="chordset">(F#)</span>ne
Turdi <span class="chordset">(D#m)</span>hai taan<span class="chordset">(E)</span> ghazal hai <span class="chordset">(F#)</span>lagdi
<span class="chordset">(E)</span>Lamm salammi<span class="chordset">(B)</span> saru de <span class="chordset">(F#)</span>kad di haaye..
<span class="chordset">(E)</span>Umar aje hai<span class="chordset">(B)</span> marke <span class="chordset">(F#)</span>agg di
Par na<span class="chordset">(D#m)</span>ina di<span class="chordset">(E)</span> gal sam<span class="chordset">(F#)</span>ajh di
 
[Verse 2]
 
<span class="chordset">(F#)</span>Ikk kudi jida<span class="chordset">(E)</span> naam mohabbat
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai...
<span class="chordset">(F#)</span>O saad muraadi, so<span class="chordset">(E)</span>hni phabbat
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai
Gum <span class="chordset">(E)</span>hai, gum <span class="chordset">(B)</span>hai, gum <span class="chordset">(F#)</span>hai</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const kyamujhepyar = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Kya Mujhe Pyar Hain
Singer: Kk
Music : Pritam
Lyrics: Nilesh Mishra
Movie: Woh Lamhe</pre>
    <pre>
[Intro]
 
<span class="chordset">(F#m)</span><span class="chordset">(E)</span><span class="chordset">(D)</span><span class="chordset">(E)</span> X4
      
Kyun Aaj<span class="chordset">(F#m)</span>kal Neend Kam Khwaab <span class="chordset">(E)</span>Jyada Hai
Lagta Khu<span class="chordset">(D)</span>da Tha Koi Nek I<span class="chordset">(E)</span>raada Hain
Kal Ka Fa<span class="chordset">(F#m)</span>kir Aaj Dil Sheh<span class="chordset">(E)</span>zada Hain
Lagta Khu<span class="chordset">(D)</span>da Ka Koi Nek I<span class="chordset">(E)</span>raada Hain
 
[Chorus]
 
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(E)</span>Ya
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(C#m)</span>Ya
 
Oh oh oh <span class="chordset">(F#m)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh
Oh oh oh <span class="chordset">(D)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh X2
 
[Verse]
 
Pa<span class="chordset">(F#m)</span>thhar Ke Inn Ras<span class="chordset">(E)</span>ton Pe
Phoo<span class="chordset">(D)</span>lon Ki Ek Cha<span class="chordset">(E)</span>dar Hain
Jab<span class="chordset">(F#m)</span>se Milen Ho <span class="chordset">(E)</span>Hamko
Bad<span class="chordset">(D)</span>la Har Ek Man<span class="chordset">(E)</span>zar Hain
 
[Pre Chorus]
 
Dekho Ja<span class="chordset">(F#m)</span>haan Mein Neele Neele Aas<span class="chordset">(E)</span>maan Tale
Rang Na<span class="chordset">(D)</span>ye Naye Hain Jaise Ghul<span class="chordset">(E)</span>te Hue
Soye The <span class="chordset">(F#m)</span>Khwaab Mere Jaage Tere <span class="chordset">(E)</span>Waaste
Tere Kha<span class="chordset">(D)</span>yaalon Me Hai Bheege Mere <span class="chordset">(E)</span>Raaste
 
[Chorus]
 
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(E)</span>Ya
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(C#m)</span>Ya
 
Oh oh oh <span class="chordset">(F#m)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh
Oh oh oh <span class="chordset">(D)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh X2
 
[Verse]
 
Tum <span class="chordset">(F#m)</span>Kyon Chale Aa<span class="chordset">(E)</span>te Ho
Har <span class="chordset">(D)</span>Roj In Khwaa<span class="chordset">(E)</span>bon Mein
Chup<span class="chordset">(F#m)</span>ke Se Aa Bhi <span class="chordset">(E)</span>Jao
Ek <span class="chordset">(D)</span>Din Meri Baa<span class="chordset">(E)</span>hon Mein
 
[Pre Chorus]
 
Tere Hi <span class="chordset">(F#m)</span>Sapanen Andheron Mein U<span class="chordset">(E)</span>jaalon Mein
Koi Na<span class="chordset">(D)</span>sha Hain Teri Aankhon Ke <span class="chordset">(E)</span>Pyaalon Mein
Tu Mere <span class="chordset">(F#m)</span>Khwaabon Mein Jawaabon Mein Sa<span class="chordset">(E)</span>waalon Mein
Har Din Chu<span class="chordset">(D)</span>ra Tumehn Main Laata Hoon Kha<span class="chordset">(E)</span>yalon Mein
 
[Chorus]
 
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(E)</span>Ya
Kya Mujhe <span class="chordset">(A)</span>Pyar Hain <span class="chordset">(E)</span>Ya
Kaisa Khu<span class="chordset">(F#m)</span>maar Hain <span class="chordset">(C#m)</span>Ya
 
Oh oh oh <span class="chordset">(F#m)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh
Oh oh oh <span class="chordset">(D)</span>oh -
oh oh oh oh oh <span class="chordset">(E)</span>oh oh oh Oh X2</pre>

    </div>
    <div class="chord-func">
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const zehnaseeb = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Zehnaseeb 
Singer: Chinmayi Sripaada,
Shekhar Ravjiani
Music : Vishal & Shekar
Lyrics: Amitabh Bhattacharya
Movie: Hasee Toh Phasee</pre>
    <pre>
Zehna<span class="chordset">(D)</span>seeb, Zehana<span class="chordset">(G)</span>seeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
Mere ka<span class="chordset">(D)</span>reeb, mere ha<span class="chordset">(G)</span>beeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
 
<span class="chordset">(D)</span>Tere sang <span class="chordset">(Am)</span>beete har lamhe pe
humko <span class="chordset">(G)</span>naaz hai
Tere sang <span class="chordset">(Am)</span>jo na beete
spe ait<span class="chordset">(G)</span>raaz hai
Iss kadar <span class="chordset">(G)</span>hum dono ka milna
ek <span class="chordset">(E)</span>raaz hai
 
Huaa a<span class="chordset">(D)</span>meer dil gha<span class="chordset">(G)</span>reeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
Zehna<span class="chordset">(D)</span>seeb, Zehana<span class="chordset">(G)</span>seeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
 
<span class="chordset">(D)</span>Lena-dena nahi duniya se mera
Bas <span class="chordset">(G)</span>tujh se kaam hai<span class="chordset">(D)</span>
<span class="chordset">(Am)</span>Teri ankhiyon ke <span class="chordset">(C)</span>sheher me
Yaara sab <span class="chordset">(D)</span>intezaam hai
 
<span class="chordset">(D)</span>Khushiyon ka ek tukda mile
Ya mile <span class="chordset">(G)</span>gham ki khurchane<span class="chordset">(D)</span>
<span class="chordset">(Am)</span>Yaara tere mere <span class="chordset">(C)</span>kharche me
Dono ka hi <span class="chordset">(D)</span>ek daam hai
 
Hona <span class="chordset">(C)</span>likha tha yun<span class="chordset">(Bm)</span>hi jo hu<span class="chordset">(D)</span>aa
Yaa hote <span class="chordset">(C)</span>hote a<span class="chordset">(Bm)</span>bhi <span class="chordset">(G)</span>anjaane mein hog<span class="chordset">(D)</span>ya
 
Jo bhi hua<span class="chordset">(D)</span>...hua a<span class="chordset">(G)</span>jeeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
Zehna<span class="chordset">(D)</span>seeb, Zehana<span class="chordset">(G)</span>seeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
 
Huaa a<span class="chordset">(D)</span>meer dil gha<span class="chordset">(G)</span>reeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
Zehna<span class="chordset">(D)</span>seeb, Zehana<span class="chordset">(G)</span>seeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb
 
Zehna<span class="chordset">(D)</span>seeb, Zehana<span class="chordset">(G)</span>seeb
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha
Tujhe <span class="chordset">(Am)</span>chaahun beta<span class="chordset">(C)</span>hasha zehna<span class="chordset">(D)</span>seeb</pre>

    </div>
    <div class="chord-func">
    
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>
    <div class="control-outer">
    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div></div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a href="#" class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a href="#" class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a href="#" class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const tuhhimerishabhai = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Tu hi Meri Shab Hai
Singer: Kk
Music : Pritam
Lyrics: Sayeed Qadri
Movie: Gangster</pre>
    <pre>
[Intro]
<span class="chordset">(Am)</span><span class="chordset">(Em)</span><span class="chordset">(F)</span><span class="chordset">(Am)</span>
<span class="chordset">(Am)</span><span class="chordset">(Em)</span><span class="chordset">(F)</span><span class="chordset">(Am)</span>
 
[Chorus]
<span class="chordset">(Am)</span>Tu hi meri shab <span class="chordset">(G)</span>hai subha hai
<span class="chordset">(F)</span>tu hi din hai me<span class="chordset">(Am)</span>ra
<span class="chordset">(Am)</span>Tu hi mera rab <span class="chordset">(G)</span>hai jahaan ha
<span class="chordset">(F)</span>tu hi meri duni<span class="chordset">(Am)</span>ya
 
<span class="chordset">(Am)</span>Tu waqt mere li<span class="chordset">(G)</span>ye...
<span class="chordset">(F)</span>main hoon tera lam<span class="chordset">(Am)</span>ha
<span class="chordset">(Am)</span>Kaise rahega bha<span class="chordset">(G)</span>la...
<span class="chordset">(F)</span>hoke tu mujhse ju<span class="chordset">(Am)</span>daa
 
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
 
<span class="chordset">(Am)</span>Tu hi meri shab <span class="chordset">(G)</span>hai subha hai
<span class="chordset">(F)</span>tu hi din hai me<span class="chordset">(Am)</span>ra
<span class="chordset">(Am)</span>Tu hi mera rab <span class="chordset">(G)</span>hai jahaan ha
<span class="chordset">(F)</span>tu hi meri duni<span class="chordset">(Am)</span>ya
 
<span class="chordset">(Am)</span>Tu waqt mere li<span class="chordset">(G)</span>ye...
<span class="chordset">(F)</span>main hoon tera lam<span class="chordset">(Am)</span>ha
<span class="chordset">(Am)</span>Kaise rahega bha<span class="chordset">(G)</span>la...
<span class="chordset">(F)</span>hoke tu mujhse ju<span class="chordset">(Am)</span>daa
 
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
 
[Verse]
<span class="chordset">(Am)</span>Aankhon se <span class="chordset">(Em)</span>padhke tujhe
<span class="chordset">(G)</span>dil pe ma<span class="chordset">(Am)</span>ine likha
<span class="chordset">(Am)</span>Tu ban ga<span class="chordset">(Em)</span>ya hai mere
<span class="chordset">(G)</span>jeene ki <span class="chordset">(Am)</span>ek wajah Hoo...
 
<span class="chordset">(Am)</span>Aankhon se <span class="chordset">(Em)</span>padhke tujhe
<span class="chordset">(G)</span>dil pe ma<span class="chordset">(Am)</span>ine likha
<span class="chordset">(Am)</span>Tu ban ga<span class="chordset">(Em)</span>ya hai mere
<span class="chordset">(G)</span>jeene ki <span class="chordset">(Am)</span>ek wajah
 
<span class="chordset">(Am)</span>Teri ha<span class="chordset">(D)</span>si...
<span class="chordset">(Am)</span>teri a<span class="chordset">(D)</span>daa...
<span class="chordset">(Am)</span>Auron se <span class="chordset">(G)</span>hai
<span class="chordset">(Em)</span>bilkul ju<span class="chordset">(Am)</span>daa...
 
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
 
[Verse]
<span class="chordset">(Am)</span>Aankhen te<span class="chordset">(Em)</span>ri shabnami
<span class="chordset">(G)</span>chehra te<span class="chordset">(Am)</span>ra aaina
<span class="chordset">(Am)</span>Tu hai u<span class="chordset">(Em)</span>daasi bhari
<span class="chordset">(G)</span>koi ha<span class="chordset">(Am)</span>seen dastan Hoo...
 
<span class="chordset">(Am)</span>Aankhen te<span class="chordset">(Em)</span>ri shabnami
<span class="chordset">(G)</span>chehra te<span class="chordset">(Am)</span>ra aaina
<span class="chordset">(Am)</span>Tu hai u<span class="chordset">(Em)</span>daasi bhari
<span class="chordset">(G)</span>koi ha<span class="chordset">(Am)</span>seen dastan
 
<span class="chordset">(Am)</span>Dil mein hai <span class="chordset">(D)</span>kya...
<span class="chordset">(Am)</span>kuchh toh ba<span class="chordset">(D)</span>ta...
<span class="chordset">(Am)</span>Kyon hai bha<span class="chordset">(G)</span>la...
<span class="chordset">(Em)</span>khud se kha<span class="chordset">(Am)</span>fa...
 
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
 
[Chorus]
<span class="chordset">(Am)</span>Tu hi meri shab <span class="chordset">(G)</span>hai subha hai
<span class="chordset">(F)</span>tu hi din hai me<span class="chordset">(Am)</span>ra
<span class="chordset">(Am)</span>Tu hi mera rab <span class="chordset">(G)</span>hai jahaan ha
<span class="chordset">(F)</span>tu hi meri duni<span class="chordset">(Am)</span>ya
 
<span class="chordset">(Am)</span>Tu waqt mere li<span class="chordset">(G)</span>ye...
<span class="chordset">(F)</span>main hoon tera lam<span class="chordset">(Am)</span>ha
<span class="chordset">(Am)</span>Kaise rahega bha<span class="chordset">(G)</span>la...
<span class="chordset">(F)</span>hoke tu mujhse ju<span class="chordset">(Am)</span>daa
 
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...
<span class="chordset">(Am)</span>Oh o <span class="chordset">(G)</span>o o <span class="chordset">(F)</span>o o <span class="chordset">(Am)</span>oh...</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const merayaara = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Mere Yaaraa 
Singer: Arijit Singh and Neeti Mohan
Music : Kaushik-Guddu-Akash (JAM8)
Lyrics: Rashmi Virag
Movie: Sooryavanshi</pre>
    <pre>
[Intro]
<span class="chordset">(D)</span> Tumse Dil Jab Se Mi<span class="chordset">(Bm)</span>la Hai
Koi To v<span class="chordset">(G)</span>jaah Hai
Ishq Hu<span class="chordset">(A)</span>aa Hai
<span class="chordset">(D)</span> Itni Si Baat Sa<span class="chordset">(Bm)</span>majh Lo
Saare Ja<span class="chordset">(G)</span>han Mein
Tumse Hu<span class="chordset">(A)</span>aa Hai

Oh <span class="chordset">(Em)</span> Lakhon Mile
Koi Bhi Na <span class="chordset">(D)</span> Tumsa Mila
Oh <span class="chordset">(G)</span> Mera Ye Dil
Teri Oar <span class="chordset">(D)</span> Chalta Gaya Na Ru<span class="chordset">(A)</span>ka
Mere <span class="chordset">(G)</span> Yaara, Mere <span class="chordset">(D)</span> Yaara
Maan <span class="chordset">(G)</span> Ja Na Mere <span class="chordset">(D)</span> Yaaraa

[Chorus]
<span class="chordset">(D)</span> Aake Mujhe Thaam <span class="chordset">(G)</span> Le
<span class="chordset">(G)</span> Tu Bhi Mera Naam <span class="chordset">(A)</span> Le
Mere <span class="chordset">(G)</span> Yaara, Mere <span class="chordset">(D)</span> Yaara
Maan <span class="chordset">(G)</span> Ja Na Mere <span class="chordset">(D)</span> Yaaraa

[Verse]
Oh <span class="chordset">(D)</span> Teri Meri Baatein <span class="chordset">(Bm)</span> Hoti Rahe
<span class="chordset">(D)</span> Aisi Mulakatein <span class="chordset">(Bm)</span> Hoti Rahe
<span class="chordset">(Em)</span> Tu Jo Mere <span class="chordset">(G)</span> Paas Rahe
<span class="chordset">(A)</span> Jadoo Sa Yun Chalta Rahe

<span class="chordset">(D)</span> Hona Hai Jise Wo <span class="chordset">(Bm)</span> Ho Jane Do
<span class="chordset">(D)</span> Khona Hai Ise To <span class="chordset">(Bm)</span> Kho Jane Do
<span class="chordset">(Em)</span> Door Se To <span class="chordset">(G)</span> Hoga Nahi
<span class="chordset">(A)</span> Thoda To Kareeb Aane Do

Oh <span class="chordset">(Em)</span> Lakhon Mile
Koi Bhi Na <span class="chordset">(D)</span> Tumsa Mila
Oh <span class="chordset">(G)</span> Mera Ye Dil
Teri Oar <span class="chordset">(D)</span> Chalta Gaya Na Ru<span class="chordset">(A)</span>ka
Mere <span class="chordset">(G)</span> Yaara, Mere <span class="chordset">(D)</span> Yaara
Maan <span class="chordset">(G)</span> Ja Na Mere <span class="chordset">(D)</span> Yaaraa

[Chorus]
<span class="chordset">(D)</span> Aake Mujhe Thaam <span class="chordset">(G)</span> Le
<span class="chordset">(G)</span> Tu Bhi Mera Naam <span class="chordset">(A)</span> Le
Mere <span class="chordset">(G)</span> Yaara, Mere <span class="chordset">(D)</span> Yaara
Maan <span class="chordset">(G)</span> Ja Na Mere <span class="chordset">(D)</span> Yaaraa</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const beetelamhe = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Beete Lamhein 
Singer:  KK
Music : Mithoon 
Lyrics: Sayeed Quadri
Movie: The Train- An Inspiration</pre>
    <pre>
Dard <span class="chordset">(Em)</span>mein bhi yeh lab musku<span class="chordset">(Bm)</span>ra jaate hai
Beete <span class="chordset">(C)</span>lamhe hume jab bhi <span class="chordset">(D)</span>yaad aate hai
<span class="chordset">(G)</span>Beete <span class="chordset">(Bm)</span>lamhe <span class="chordset">(C)</span><span class="chordset">(D)</span>

<span class="chordset">(G)</span>Chand lamhaat <span class="chordset">(Bm)</span>ke vaas<span class="chordset">(C)</span>te hi sa<span class="chordset">(D)</span>hi
<span class="chordset">(G)</span>Muskura kar mi<span class="chordset">(Bm)</span>li thi mu<span class="chordset">(C)</span>jhe zinda<span class="chordset">(D)</span>gi
<span class="chordset">(G)</span>Chand lamhaat <span class="chordset">(Bm)</span>ke vaas<span class="chordset">(C)</span>te hi sa<span class="chordset">(D)</span>hi
<span class="chordset">(G)</span>Muskura kar <span class="chordset">(Bm)</span>mili thi mu<span class="chordset">(C)</span>jhe zinda<span class="chordset">(D)</span>gi

Tere <span class="chordset">(C)</span>aagosh <span class="chordset">(D)</span>mein din the <span class="chordset">(G)</span>mere ka<span class="chordset">(Em)</span>te
Teri <span class="chordset">(C)</span>baahon <span class="chordset">(D)</span>mein thi me<span class="chordset">(G)</span>ri raate ka<span class="chordset">(Em)</span>ti<span class="chordset">(D)</span>
<span class="chordset">(C)</span> Woh oh oo ho,oh hoo <span class="chordset">(D)</span>

Aaj <span class="chordset">(Em)</span>bhi jab wo pal mujhko <span class="chordset">(Bm)</span>yaad aate hain
Dil se <span class="chordset">(C)</span>saarey gamo ko bhoo<span class="chordset">(D)</span>la jate hai

Dard <span class="chordset">(Em)</span>mein bhi yeh lab musku<span class="chordset">(Bm)</span>ra jaate hai
Beete <span class="chordset">(C)</span>lamhe hume jab bhi <span class="chordset">(D)</span>yaad aate hai
Dard <span class="chordset">(Em)</span>mein bhi yeh lab musku<span class="chordset">(Bm)</span>ra jaate hai
Beete <span class="chordset">(C)</span>lamhe hume jab bhi <span class="chordset">(D)</span>yaad aate hai
<span class="chordset">(G)</span>Beete <span class="chordset">(Bm)</span>lamhe <span class="chordset">(C)</span> <span class="chordset">(D)</span>

Mere <span class="chordset">(G)</span>kandhe pe <span class="chordset">(Bm)</span>sir ko <span class="chordset">(C)</span>jhukana te<span class="chordset">(D)</span>ra
Mere <span class="chordset">(G)</span>seene mein <span class="chordset">(Bm)</span>khud ko <span class="chordset">(C)</span>chupana te<span class="chordset">(D)</span>ra
Mere <span class="chordset">(G)</span>kandhe pe <span class="chordset">(Bm)</span>sir ko <span class="chordset">(C)</span>jhukana te<span class="chordset">(D)</span>ra
Mere <span class="chordset">(G)</span>seene mein <span class="chordset">(Bm)</span> khud ko <span class="chordset">(C)</span>chupana te<span class="chordset">(D)</span>ra

Aake <span class="chordset">(C)</span>meri pa<span class="chordset">(D)</span>naahon mein <span class="chordset">(G)</span>shaam o se<span class="chordset">(Em)</span>her
Kaanch <span class="chordset">(C)</span>ki tarah <span class="chordset">(D)</span>woh toot <span class="chordset">(G)</span>jana <span class="chordset">(Em)</span>tera <span class="chordset">(D)</span> <span class="chordset">(C)</span> <span class="chordset">(D)</span>
<span class="chordset">(C)</span> Woh oh oo ho,oh hoo <span class="chordset">(D)</span>

Aaj <span class="chordset">(Em)</span>bhi jab wo manzar na<span class="chordset">(Bm)</span>zar aate hai
Dil ki <span class="chordset">(C)</span>veeraniyon ko mi<span class="chordset">(D)</span>ta jate hai

Dard <span class="chordset">(Em)</span>mein bhi ye lab musku<span class="chordset">(Bm)</span>ra jaate hai
Beete <span class="chordset">(C)</span>lamhe hame jab bhi <span class="chordset">(D)</span>yaad aate hai
Dard <span class="chordset">(Em)</span>mein bhi ye lab musku<span class="chordset">(Bm)</span>ra jaate hai
Beete <span class="chordset">(C)</span>lamhe hame jab bhi <span class="chordset">(D)</span>yaad aate hai

Dard <span class="chordset">(Em)</span>me <span class="chordset">(Bm)</span>....beete <span class="chordset">(C)</span> lamhe <span class="chordset">(D)</span>
Dard <span class="chordset">(Em)</span>me <span class="chordset">(Bm)</span>....beete <span class="chordset">(C)</span> lamhe <span class="chordset">(D)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const ijazat = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Ijazat
Singer: Arijit Singh 
Music : Meet Bros
Lyrics: Shabbir Ahmed
Movie: One Night Stand</pre>
    <pre>
Kaise ba<span class="chordset">(F#m)</span>taaye, kaise ja<span class="chordset">(F#m)</span>taaye
Subah tak <span class="chordset">(C#m)</span>tujhme jeena <span class="chordset">(D)</span>chaahein
Bheege la<span class="chordset">(F#m)</span>bon ki, geeli han<span class="chordset">(F#m)</span>si ko
Peene ka <span class="chordset">(C#m)</span>mausam hai peena <span class="chordset">(A)</span>chaahein

Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki <span class="chordset">(E)</span>mujhko <span class="chordset">(A)</span>aadat hai
Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki mujhko<span class="chordset">(E)</span>

Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span>
Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span>

<span class="chordset">(F#m)</span> <span class="chordset">(E)</span> <span class="chordset">(D)</span> <span class="chordset">(A)</span>

Eh<span class="chordset">(F#m)</span>saas tere aur <span class="chordset">(E)</span>mere toh
Ik <span class="chordset">(E)</span>dooje se judd ra<span class="chordset">(D)</span>he
Ik <span class="chordset">(F#m)</span>teri talab mujhe <span class="chordset">(C#m)</span>aisi lagi
Mere <span class="chordset">(E)</span>hosh bhi udne la<span class="chordset">(D)</span>ge

Mujhe <span class="chordset">(D)</span>milta sukoon teri <span class="chordset">(E)</span>baahon mein
Ja<span class="chordset">(C#m)</span>nnat Jaisi ek <span class="chordset">(E)</span>raahat hai

Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki <span class="chordset">(E)</span>mujhko <span class="chordset">(A)</span>aadat hai
Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki mujhko<span class="chordset">(E)</span>

Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span>
Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span>

Kyun <span class="chordset">(F#m)</span>sabse juda, kyun <span class="chordset">(E)</span>sabse alag
An<span class="chordset">(E)</span>daaz tere lag<span class="chordset">(D)</span>te
Be<span class="chordset">(F#m)</span>saakhta hum saa<span class="chordset">(C#m)</span>ye se tere
Har <span class="chordset">(E)</span>shaam lipatte <span class="chordset">(A)</span>hain

Har <span class="chordset">(D)</span>waqt mera, qur<span class="chordset">(E)</span>bat mein teri
<span class="chordset">(C#m)</span>Jab guzre toh i<span class="chordset">(E)</span>badat hai

Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki <span class="chordset">(E)</span>mujhko <span class="chordset">(A)</span>aadat hai
Ik <span class="chordset">(F#m)</span>baat ka<span class="chordset">(E)</span>hoon kya i<span class="chordset">(D)</span>jazat hai
Tere <span class="chordset">(F#m)</span>ishq ki mujhko<span class="chordset">(E)</span>

Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span>
Aadat <span class="chordset">(F#m)</span>hai <span class="chordset">(C#m)</span>o aadat <span class="chordset">(F#m)</span>hain<span class="chordset">(A)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const guzarish = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Guzarish
Singer: Javed Ali, Sonu Nigam
Music : A.R. Rahman
Lyrics: Prasoon Joshi
Movie : Ghajini</pre>
    <pre>
Tu <span class="chordset">(Am)</span>meri adhoori <span class="chordset">(G)</span>pyaas pyaas
Tu <span class="chordset">(Am)</span>aa gayi man ko <span class="chordset">(G)</span>raas raas <span class="chordset">(Am)</span>

Tu <span class="chordset">(Am)</span>meri adhoori <span class="chordset">(G)</span>pyaas pyaas
Tu <span class="chordset">(Am)</span>aa gayi man ko <span class="chordset">(G)</span>raas raas
Ab <span class="chordset">(Am)</span>to tu aaja <span class="chordset">(G)</span>pass pass
Hai gu<span class="chordset">(C)</span>zaarish

Hai <span class="chordset">(Am)</span>haal to dil ka <span class="chordset">(G)</span>tang tang
Tu <span class="chordset">(Am)</span>rang ja mere <span class="chordset">(G)</span>rang rang
Bas <span class="chordset">(Am)</span>chalna mere <span class="chordset">(G)</span>sang sang
Hain gu<span class="chordset">(C)</span>zaarish

<span class="chordset">(Dm)</span>Kehde tu hai to zinn<span class="chordset">(G)</span>dagi
<span class="chordset">(Am)</span>Chainon se chootke <span class="chordset">(C)</span>hasegi
<span class="chordset">(G)</span>Moti honge moti raahon <span class="chordset">(C)</span>mein
<span class="chordset">(Am)</span>yeh yeh yeh

Tu <span class="chordset">(Am)</span>meri adhoori <span class="chordset">(G)</span>pyaas pyaas
Tu <span class="chordset">(Am)</span>aa gayi man ko <span class="chordset">(G)</span>raas raas
Ab <span class="chordset">(Am)</span>to tu aaja <span class="chordset">(G)</span>pass pass
Hai gu<span class="chordset">(C)</span>zaarish

<span class="chordset">(Dm)</span>Sheeshe ke khwaab leke
<span class="chordset">(Dm)</span>Raaton mein chal raha hoon
<span class="chordset">(Am)</span>Takra na jao ka<span class="chordset">(F)</span>hin

<span class="chordset">(Dm)</span>Aasha ki lau hai roshan
<span class="chordset">(Dm)</span>Phir bhi Toofan ka dar hai
<span class="chordset">(Am)</span>Lau bhuj na jaye <span class="chordset">(F)</span>kahin

<span class="chordset">(Bb)</span>Bas ek haan ki gu<span class="chordset">(C)</span>zaarish
<span class="chordset">(Bb)</span>Phir hogi khushiyon ki <span class="chordset">(C)</span>baarish

Tu <span class="chordset">(Am)</span>meri adhoori <span class="chordset">(G)</span>pyaas pyaas
Tu <span class="chordset">(Am)</span>aa gayi man ko <span class="chordset">(G)</span>raas raas
Ab <span class="chordset">(Am)</span>to tu aaja <span class="chordset">(G)</span>pass pass
Hai gu<span class="chordset">(C)</span>zaarish

<span class="chordset">(Dm)</span>Chanda hai aasma hai
<span class="chordset">(Dm)</span>Aur baadal bhi ghane hai
<span class="chordset">(Am)</span>Yeh chanda chup jaye <span class="chordset">(F)</span>na

<span class="chordset">(Dm)</span>Tanhayi dus rahi hai
<span class="chordset">(Dm)</span>Aur dhadkan badh rahi hai
<span class="chordset">(Am)</span>Ek pal bhi chain aaye <span class="chordset">(F)</span>na

<span class="chordset">(Bb)</span>Kaisi ajab daas<span class="chordset">(C)</span>tan hai
<span class="chordset">(Bb)</span>Bechainiyan bas ya<span class="chordset">(C)</span>han hai

Tu <span class="chordset">(Am)</span>meri adhoori <span class="chordset">(G)</span>pyaas pyaas
Tu <span class="chordset">(Am)</span>aa gayi man ko <span class="chordset">(G)</span>raas raas
Ab <span class="chordset">(Am)</span>to tu aaja <span class="chordset">(G)</span>pass pass
Hai gu<span class="chordset">(C)</span>zaarish

Hai <span class="chordset">(Am)</span>haal to dil ka <span class="chordset">(G)</span>tang tang
Tu <span class="chordset">(Am)</span>rang ja mere <span class="chordset">(G)</span>rang rang
Bas <span class="chordset">(Am)</span>chalna mere <span class="chordset">(G)</span>sang sang
Hain gu<span class="chordset">(C)</span>zaarish

<span class="chordset">(Dm)</span>Kehde tu hai to zinn<span class="chordset">(G)</span>dagi
<span class="chordset">(Am)</span>Chainon se chootke <span class="chordset">(C)</span>hasegi
<span class="chordset">(G)</span>Moti honge moti raahon <span class="chordset">(C)</span>mein
<span class="chordset">(Am)</span>yeh yeh yeh</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const panidarang = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Pani Da Rang 
Singer: Ayushmann Khurrana 
Music : Abhishek-Akshay,
Bann,Rochak Kohli & Ayushmann Khurrana
Lyrics: Ayushmann Khurrana
Movie: Vicky Donor</pre>
    <pre>
Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(D)</span>Vekh Ke
Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(D)</span>Vekh Ke
Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(D)</span>Vekh Ke
<span class="chordset">(C)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(C)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De

<span class="chordset">(Em)</span> Maahiya Na Aaya Mera
<span class="chordset">(D)</span> Maahiya Na <span class="chordset">(Em)</span>Aaya
<span class="chordset">(Em)</span> Maahiya Na Aaya Mera
<span class="chordset">(D)</span> Maahiya Na <span class="chordset">(Em)</span>Aaya
<span class="chordset">(D)</span> Raanjhana Na Aaya Mera
<span class="chordset">(C)</span> Maahiya Na <span class="chordset">(D)</span>Aaya
<span class="chordset">(Em)</span>Maahiya Na <span class="chordset">(D)</span>Aaya Mera
<span class="chordset">(C)</span>Raanjhana Na <span class="chordset">(Em)</span>Aaya

<span class="chordset">(Em)</span> Akhaan Da Noor <span class="chordset">(C)</span>Vekh Ke
<span class="chordset">(Em)</span> Akhaan Da Noor <span class="chordset">(C)</span>Vekh Ke
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De

<span class="chordset">(G)</span>Kamli Ho Gayi <span class="chordset">(Em)</span>Tere Bina
<span class="chordset">(C)</span>Aaja Raanjhan <span class="chordset">(Em)</span>Mere
<span class="chordset">(G)</span>Kamli Ho Gayi <span class="chordset">(Em)</span>Tere Bina
<span class="chordset">(C)</span>Aaja Raanjhan <span class="chordset">(Em)</span>Mere
<span class="chordset">(Am)</span>Baarish Barkha <span class="chordset">(D)</span>Sab Kuch Beh Gayi
<span class="chordset">(C)</span>Aaya Ni Jind <span class="chordset">(Em)</span>Mere
<span class="chordset">(Am)</span>Baarish Barkha <span class="chordset">(D)</span>Sab Kuch Beh Gayi
<span class="chordset">(C)</span>Aaya Ni Jind <span class="chordset">(Em)</span>Mere

Ak<span class="chordset">(Em)</span>haan Da Noor <span class="chordset">(C)</span>Vekh Ke
Ak<span class="chordset">(Em)</span>haan Da Noor <span class="chordset">(C)</span>Vekh Ke
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De

<span class="chordset">(Em)</span> Kothe Utte Baike <span class="chordset">(D)</span> Akhiyaan Milaunde
<span class="chordset">(C)</span> Na Jaana <span class="chordset">(D)</span>Hume Tu Kabhi <span class="chordset">(Em)</span>Chod
<span class="chordset">(Em)</span> Tere Utte Marda <span class="chordset">(D)</span> Pyaar Tenu Karda
<span class="chordset">(C)</span> Milega <span class="chordset">(D)</span>Tujhe Na Koi <span class="chordset">(Em)</span>Aur
Tu Bhi <span class="chordset">(Em)</span>Aa Sabko <span class="chordset">(D)</span>Chod Ke
Tu Bhi <span class="chordset">(Em)</span>Aa Sabko <span class="chordset">(D)</span>Chod Ke
Meri <span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span>Anju Rul <span class="chordset">(Em)</span>De

Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(C)</span>Vekh Ke
Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(C)</span>Vekh Ke
Pani <span class="chordset">(Em)</span>Da Rang <span class="chordset">(C)</span>Vekh Ke
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span> Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span> Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span> Anju Rul <span class="chordset">(Em)</span>De
<span class="chordset">(Am)</span> Akhiyaan Jo <span class="chordset">(D)</span> Anju Rul <span class="chordset">(Em)</span>De</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const humnava = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Humnava 
Singer:Papon
Music : Mithoon
Lyrics: Sayeed Quadri
Movie: Hamari Adhuri Kahani</pre>
    <pre>
<span class="chordset">(Em)</span>Aye Humnava
Mujhe apna <span class="chordset">(D)</span>bana le
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

<span class="chordset">(Em)</span>Hoon akela
Zara haath <span class="chordset">(D)</span>badha de
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

Kab se main <span class="chordset">(Am)</span>dar-dar
phir ra<span class="chordset">(D)</span>ha
Musaafir <span class="chordset">(G)</span>dil ko pa<span class="chordset">(C)</span>naah de
Tu a<span class="chordset">(Am)</span>waargi ko
me<span class="chordset">(Am)</span>ri aaj theh<span class="chordset">(D)</span>ra de

<span class="chordset">(Em)</span>Ho sake toh
Thoda pyaar ja<span class="chordset">(D)</span>taa de
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

<span class="chordset">(Em)</span><span class="chordset">(D)</span><span class="chordset">(Bm)</span><span class="chordset">(C)</span>

<span class="chordset">(A)</span>Murjhaayi si <span class="chordset">(Em)</span>shaakh pe dil ki
<span class="chordset">(A)</span>Phool khilte hain <span class="chordset">(Em)</span>kyun
<span class="chordset">(A)</span>Baat gulon ki <span class="chordset">(Em)</span>zikr mehak ka
<span class="chordset">(D)</span>Acha lagta hai <span class="chordset">(Em)</span>kyun

Un <span class="chordset">(D)</span>rango se tu<span class="chordset">(C)</span>ne milaaya
<span class="chordset">(D)</span>Jinse kabhi main <span class="chordset">(C)</span>mil na paaya
Dil <span class="chordset">(D)</span>karta hai te<span class="chordset">(G)</span>ra shukriya
<span class="chordset">(D)</span>Phir se bahaare tu <span class="chordset">(Em)</span>laa de

<span class="chordset">(Em)</span>Dil ka soona
Banjar meh<span class="chordset">(D)</span>ka de
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

<span class="chordset">(Em)</span>Ho sake toh
Thoda pyaar ja<span class="chordset">(D)</span>taa de
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

<span class="chordset">(A)</span>Waise toh mau<span class="chordset">(Em)</span>sam guzre hain
<span class="chordset">(A)</span>Zindagi mein ka<span class="chordset">(Em)</span>yi
<span class="chordset">(A)</span>Par ab naa jaane <span class="chordset">(Em)</span>kyun mujhe wo
<span class="chordset">(D)</span>Lag rahe hain ha<span class="chordset">(Em)</span>seen

Tere <span class="chordset">(D)</span>aane par ja<span class="chordset">(C)</span>ana maine
Ka<span class="chordset">(D)</span>hi na kahi zin<span class="chordset">(C)</span>da hoon main
Jee<span class="chordset">(D)</span>ne lagaa <span class="chordset">(G)</span> ab ye fizaayein
<span class="chordset">(D)</span>Chehre ko chooti ha<span class="chordset">(Em)</span>waayein

<span class="chordset">(Em)</span>Inki tarah
Do kadam toh ba<span class="chordset">(D)</span>dha le
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de

<span class="chordset">(Em)</span>Hoon akela
Zara haath <span class="chordset">(D)</span>badha de
Soo<span class="chordset">(D)</span>khi padi dil ki <span class="chordset">(Bm)</span>is zamee
Ko bhi<span class="chordset">(C)</span>ga de</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const subhanallah = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Subhanallah
Singer: Sreeram, Shilpa Rao
Music : Pritam
Lyrics: Amitabh Bhattacharya
Movie : Yeh Jawaani Hai Deewani</pre>
    <pre>
<span class="chordset">(A)</span> Ek din kabhi jo khud ko taraashe
<span class="chordset">(E)</span> Meri nazar se tu za<span class="chordset">(D)</span>ra, <span class="chordset">(A)</span> haaye re
<span class="chordset">(A)</span> Aankhon se teri kya kya chupa hai
<span class="chordset">(E)</span> Tujhko dikhaaun main za<span class="chordset">(D)</span>ra, <span class="chordset">(A)</span> haaye re

<span class="chordset">(Bm)</span> Ik ankahi si daas<span class="chordset">(A)</span>taan daastaan
<span class="chordset">(D)</span> Kehne lagega <span class="chordset">(E)</span> aaina

Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua
Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua

<span class="chordset">(A)</span> <span class="chordset">(F#m)</span> <span class="chordset">(D)</span> <span class="chordset">(A)</span>
<span class="chordset">(A)</span> <span class="chordset">(F#m)</span> <span class="chordset">(A)</span> <span class="chordset">(D)</span>

<span class="chordset">(A)</span> Meri khamoshi se <span class="chordset">(D)</span> baatein chun le<span class="chordset">(A)</span>na
<span class="chordset">(A)</span> Unki dori se taa<span class="chordset">(D)</span>rifein bun le<span class="chordset">(A)</span>na <span class="chordset">(F#m)</span><span class="chordset">(Bm)</span>

<span class="chordset">(A)</span> Meri khamoshi se <span class="chordset">(D)</span> baatein chun le<span class="chordset">(A)</span>na
<span class="chordset">(A)</span> Unki dori se taa<span class="chordset">(D)</span>rifein bun le<span class="chordset">(A)</span>na

<span class="chordset">(F#m)</span> Kal nahi thi jo
<span class="chordset">(Bm)</span> Aaj lagti hoon
<span class="chordset">(D)</span> Taareef meri <span class="chordset">(E)</span> hai khaamakha
<span class="chordset">(D)</span> Tohfa hai tera <span class="chordset">(A)</span> meri adaa

<span class="chordset">(Bm)</span> Ye do dilon ka waas<span class="chordset">(A)</span>ta waasta
<span class="chordset">(D)</span> Khul ke bataaya ja<span class="chordset">(E)</span>aye naa

Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua
Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua
Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua
Subhanal<span class="chordset">(A)</span>lah
<span class="chordset">(F#m)</span> Jo ho raha hai <span class="chordset">(A)</span> pehli dafaa hai wal<span class="chordset">(D)</span>lah
<span class="chordset">(A)</span> Aisa hua</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const banjara = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Banjaara
Singer: Mohd.irfan
Music : Mithoon
Lyrics: Mithoon
Movie : Ek Villain</pre>
    <pre>
<span class="chordset">(C#m)</span> Jise zindagi <span class="chordset">(A)</span> dhoondh rahi hai
<span class="chordset">(C#m)</span> Kya ye woh ma<span class="chordset">(A)</span>kaam mera hai
<span class="chordset">(C#m)</span> Yahaan chain se <span class="chordset">(A)</span> bas ruk jaaun
<span class="chordset">(C#m)</span> Kyun dil ye mu<span class="chordset">(A)</span>jhe kehta hai
<span class="chordset">(B)</span> Jazbaat naye se mile hain
<span class="chordset">(B)</span> Jaane kya asar ye huaa hai
<span class="chordset">(A)</span> Ik aas mili phir mujhko
<span class="chordset">(A)</span> Jo qubool ki<span class="chordset">(G#)</span>si ne kiya hai

Haan..
<span class="chordset">(C#m)</span> Kisi shaayar ki ghazal
<span class="chordset">(A)</span> Jo de rooh ko sukoon ke pal
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar
<span class="chordset">(C#m)</span> Naye mausam ki sehar
<span class="chordset">(A)</span> Yaa sard mein dopahar
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banja<span class="chordset">(C#m)</span>re ko ghar

Bridge:

Hmm...
<span class="chordset">(C#m)</span><span class="chordset">(B)</span><span class="chordset">(A)</span><span class="chordset">(B)</span><span class="chordset">(A)</span>
<span class="chordset">(C#m)</span><span class="chordset">(A)</span><span class="chordset">(C#m)</span><span class="chordset">(A)</span><span class="chordset">(B)</span>
<span class="chordset">(C#m)</span><span class="chordset">(A)</span><span class="chordset">(B)</span>

<span class="chordset">(E)</span> Jaise koi kinaara
<span class="chordset">(G#m)</span> Deta ho sahaara
Mujhe <span class="chordset">(A)</span> wo mila ki<span class="chordset">(B)</span>si mod <span class="chordset">(E)</span>par
<span class="chordset">(E)</span> Koi raat ka taara
<span class="chordset">(G#m)</span> Karta ho ujaala
Wai<span class="chordset">(A)</span>se hi roshan ka<span class="chordset">(B)</span>re woh <span class="chordset">(E)</span>shehar

<span class="chordset">(G#)</span> Dard mere woh bhu<span class="chordset">(C#m)</span>la hi gayaa
Kuch <span class="chordset">(A)</span> aisa asar hu<span class="chordset">(B)</span>aa
<span class="chordset">(B)</span> Jeena mujhe phir se woh sikha ra<span class="chordset">(C#m)</span>ha

Hmm..

<span class="chordset">(C#m)</span> Jaise baarish kar de tar
<span class="chordset">(A)</span> Yaa marham dard par
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banja<span class="chordset">(C#m)</span>re ko ghar
<span class="chordset">(C#m)</span> Naye mausam ki sehar
<span class="chordset">(A)</span> Yaa sard mein dopahar
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar

Bridge:
<span class="chordset">(C#m)</span><span class="chordset">(F#m)</span><span class="chordset">(B)</span><span class="chordset">(E)</span>
<span class="chordset">(A)</span><span class="chordset">(F#m)</span><span class="chordset">(A)</span><span class="chordset">(G#)</span>

<span class="chordset">(C#m)</span><span class="chordset">(A)</span><span class="chordset">(B)</span>
<span class="chordset">(F#m)</span><span class="chordset">(B)</span><span class="chordset">(A)</span><span class="chordset">(C#m)</span><span class="chordset">(E)</span>

<span class="chordset">(E)</span> Muskaata yeh chehra
<span class="chordset">(G#m)</span> Deta hai jo pehraa
Jaa<span class="chordset">(A)</span>ne chhupata kya <span class="chordset">(B)</span> dil ka saman<span class="chordset">(E)</span>dar
<span class="chordset">(E)</span> Auron ko toh hardam <span class="chordset">(G#m)</span> saaya deta hai
Woh <span class="chordset">(A)</span> dhoop mein hai <span class="chordset">(B)</span> khada khud <span class="chordset">(E)</span> magar

<span class="chordset">(G#)</span> Chot lagi hai u<span class="chordset">(C#m)</span>sey phir kyun
Meh<span class="chordset">(A)</span>soos mujhe ho ra<span class="chordset">(B)</span>ha hai
<span class="chordset">(B)</span> Dil tu bata de kya hai iraada <span class="chordset">(C#m)</span> tera

<span class="chordset">(C#m)</span> Main parinda besabar
<span class="chordset">(A)</span> Tha uda jo darbadar
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banja<span class="chordset">(C#m)</span>rey ko ghar

<span class="chordset">(C#m)</span> Naye mausam ki sehar
<span class="chordset">(A)</span> Yaa sard mein dopahar
<span class="chordset">(B)</span> Koi mujhko yun mila hai
Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar
<span class="chordset">(B)</span> Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar
<span class="chordset">(B)</span> Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar
<span class="chordset">(B)</span> Jaise banjaa<span class="chordset">(C#m)</span>re ko ghar</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const tiktikvajate = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Tik Tik Vajate Dokyat
Singer: Sonu Nigam, Sayali Pankaj
Music : Pankaj Padghan
Lyrics: Mangesh Kangane
Movie : Duniyadari</pre>
    <pre>
<span class="chordset">(E)</span> Tik tik vajate <span class="chordset">(A)</span> dokya<span class="chordset">(B)</span>taa
<span class="chordset">(A)</span> Dhad dhad vadhate <span class="chordset">(E)</span> thokyat
<span class="chordset">(E)</span> Kadhi ju<span class="chordset">(F#m)</span>ni <span class="chordset">(E)</span> kadhi na<span class="chordset">(F#m)</span>vi
<span class="chordset">(E)</span> Sampate aantar <span class="chordset">(F#m)</span> zokyat

<span class="chordset">(C#m)</span> Naahi kadhi <span class="chordset">(A)</span> sari tari
<span class="chordset">(F#m)</span> Bhijate ang <span class="chordset">(B)</span> panya<span class="chordset">(E)</span>ne
<span class="chordset">(C#m)</span> Sochu tumhe <span class="chordset">(A)</span> palbhar bhi
<span class="chordset">(F#m)</span> Barase sawan <span class="chordset">(B)</span> joma<span class="chordset">(E)</span>ne

<span class="chordset">(E)</span> Shimpalya <span class="chordset">(F#m)</span>che
<span class="chordset">(E)</span> Show pees na<span class="chordset">(F#m)</span>ko
<span class="chordset">(E)</span> Jiv aadakala <span class="chordset">(F#m)</span> motyat

<span class="chordset">(E)</span> Tik tik vajate <span class="chordset">(A)</span> dokya<span class="chordset">(B)</span>taa
<span class="chordset">(A)</span> Dhad dhad vadhate <span class="chordset">(E)</span> thokyat

<span class="chordset">(C#m)</span> Sur hi tu <span class="chordset">(A)</span> taal hi tu
<span class="chordset">(F#m)</span> Ruthe jo chand wo <span class="chordset">(B)</span> noor hai <span class="chordset">(E)</span> tu
<span class="chordset">(C#m)</span> Aasu hi tu <span class="chordset">(A)</span> hasu hi tu
<span class="chordset">(F#m)</span> Odhe manachi ni <span class="chordset">(B)</span> hurhur <span class="chordset">(E)</span> tu

<span class="chordset">(E)</span> Roj <span class="chordset">(F#m)</span> nave <span class="chordset">(E)</span> bhas <span class="chordset">(F#m)</span> tuje
<span class="chordset">(E)</span> Vadhate antar <span class="chordset">(F#m)</span> swasat
<span class="chordset">(E)</span> Tik tik vajate <span class="chordset">(A)</span> doky<span class="chordset">(B)</span>aat
<span class="chordset">(A)</span> Dhad dhad vadhate <span class="chordset">(E)</span> thokyat</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const jeevrangle = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Jeev Rangla
Singer: Hariharan,Shreya Ghoshal,Mukta Barve
Music : Ajay-Atul
Lyrics: Sanjay Patil
Movie : Jogwa</pre>
    <pre>
<span class="chordset">Jiv (Bm)</span> Rangala gungala rangala
a<span class="chordset">(Em)</span> sa piramachi aas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>
<span class="chordset">Jiv (Bm)</span> lagala laabhala dhyass ho <span class="chordset">(Em)</span> tuja
gahiwarala shwas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>

<span class="chordset">(Bm)</span> Pailtira neshil saath mala deshil
<span class="chordset">(E)</span> kalij majha <span class="chordset">(F#)</span> tu..
<span class="chordset">(Bm)</span> Sukh bharatila aala nabh dharatila aala
<span class="chordset">(E)</span> punawacha chand <span class="chordset">(F#)</span> tu..

[CHORUS]
<span class="chordset">Jiv (Bm)</span> Rangala gungala rangala
a<span class="chordset">(Em)</span> sa piramachi aas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>
<span class="chordset">Jiv (Bm)</span> lagala laabhala dhyass ho <span class="chordset">(Em)</span> tuja
gahiwarala shwas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>

<span class="chordset">(B)</span> <span class="chordset">(Em)</span> <span class="chordset">(B)</span> <span class="chordset">(Em)</span>
<span class="chordset">(B)</span> <span class="chordset">(B)</span> <span class="chordset">(D)</span> <span class="chordset">(D)</span>
<span class="chordset">(G)</span> <span class="chordset">(F#)</span> <span class="chordset">(F#m)</span>

[VERSE]
<span class="chordset">Chand (Bm)</span> sugandha deil raat usasa deil
Sari <span class="chordset">(E)</span> dharati <span class="chordset">(F#m)</span> tuji
ruja<span class="chordset">(Bm)</span> vya <span class="chordset">(F#)</span> chi <span class="chordset">(E)</span> ma <span class="chordset">(F#m)</span> ti <span class="chordset">(Bm)</span> tu..

Khula <span class="chordset">(Bm)</span> aabhal dhagaal tyala rudhi cha vitaal
Majhya <span class="chordset">(E)</span> raagh saja <span class="chordset">(F#m)</span> na hi
<span class="chordset">(Bm)</span> kaka <span class="chordset">(F#)</span> nachi <span class="chordset">(E)</span> tod <span class="chordset">(F#)</span> maal <span class="chordset">(B)</span> tuu..

Khula <span class="chordset">(Bm)</span> kalija he <span class="chordset">(E)</span> majhe tula dila mi aan <span class="chordset">(F#)</span> dan
Tujhya <span class="chordset">(Bm)</span> payav ma <span class="chordset">(E)</span> khil majhya janmacha gon <span class="chordset">(F#)</span> dhal

[CHORUS]
<span class="chordset">Jiv (Bm)</span> Rangala gungala rangala
a<span class="chordset">(Em)</span> sa piramachi aas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>
<span class="chordset">Jiv (Bm)</span> lagala laabhala dhyass ho <span class="chordset">(Em)</span> tuja
gahiwarala shwas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>

<span class="chordset">(Bm)</span> Pailtira neshil saath mala deshil
<span class="chordset">(E)</span> kalij majha <span class="chordset">(F#)</span> tu..
<span class="chordset">(Bm)</span> Sukh bharatila aala nabh dharatila aala
<span class="chordset">(E)</span> punawacha chand <span class="chordset">(F#)</span> tu..

[CHORUS]
<span class="chordset">Jiv (Bm)</span> Rangala gungala rangala
a<span class="chordset">(Em)</span> sa piramachi aas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span>
<span class="chordset">Jiv (Bm)</span> lagala laabhala dhyass ho <span class="chordset">(Em)</span> tuja
gahiwarala shwas <span class="chordset">(Bm)</span> tu..<span class="chordset">(F#)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const kakaan = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Kaakan
Singer: Shankar Mahadevan & Neha Rajpal
Music : Ajay Singha
Lyrics: Omkar Mangesh Dutt
Movie : Kaakan</pre>
    <pre>
<span class="chordset">Jag (C)</span> nyaachi asha..
yaa ma<span class="chordset">(Am)</span> nachi bhaasha..
Tu na <span class="chordset">(F)</span> bolta na aikta
sam<span class="chordset">(G)</span> jun ghe na..

Swap<span class="chordset">(C)</span> naanche rang..
mi tu<span class="chordset">(Am)</span> jhyat dang..
Ure <span class="chordset">(Dm)</span> baaki kaay
tuzhi saath sang as<span class="chordset">(G)</span> taana..

Aakaashi <span class="chordset">(C)</span> chandra chaandanya..
todun <span class="chordset">(C)</span> mi ka <span class="chordset">(E)</span> aan<span class="chordset">(F)</span> lya..
Manaacha <span class="chordset">(Dm)</span> paalna ka<span class="chordset">(Fm)</span> ru..
baandhuni <span class="chordset">(G)</span> ghe jara jhu<span class="chordset">(E)</span> la..

Dolaata <span class="chordset">(C)</span> tuuch saajani..
sukhacha <span class="chordset">(C)</span> sparsh <span class="chordset">(E)</span> tu na<span class="chordset">(F)</span> va..
Tujhya <span class="chordset">(Dm)</span> vina ure na arth jiv<span class="chordset">(G)</span> ana..

Uja<span class="chordset">(A#)</span> le tuzhya ha<span class="chordset">(Fm)</span sune kan <span class="chordset">(C)</span> kan..
An <span class="chordset">(A#)</span> chandra he haa<span class="chordset">(Fm)</span> ticha kaa<span class="chordset">(C)</span> kan..

<span class="chordset">(Dm)</span> Bhetila aani tu navi kahani
<span class="chordset">(G)</span> maalun shwaasat <span class="chordset">(C)</span> ye..
<span class="chordset">(Dm)</span> Lataanchi gaani ti tuzhi nishani
<span class="chordset">(G)</span> manaach majhya ure..

<span class="chordset">(Dm)</span> Rangvuni taak aayushya maajhe
<span class="chordset">(G)</span> sur tuzhe saad <span class="chordset">(C)</span> de..
<span class="chordset">(Dm)</span> Pahaata oli ti tuzhya ushaashi..
<span class="chordset">(G)</span> raati la aavaaj <span class="chordset">(C)</span> de..

<span class="chordset">(F)</span> Yein aata mi <span class="chordset">(G)</span> urashi ashaahi
<span class="chordset">(Dm)</span> jaanayachi vel na<span class="chordset">(G)</span> ko..
<span class="chordset">(F)</span> Odh tuzhi maajhya <span class="chordset">(G)</span> laage jiva re
<span class="chordset">(Dm)</span> jivaashi khel na<span class="chordset">(C)</span> ko..

Tu a<span class="chordset">(C)</span> shich ye na..
ni mi<span class="chordset">(Am)</span> thit ghe na..
Jag <span class="chordset">(F)</span> dhund dhund nako
paash bandh kuth<span class="chordset">(G)</span> lach aata..

De haa<span class="chordset">(C)</span> tat haat..
jari <span class="chordset">(Am)</span> door vaat..
Bhiti <span class="chordset">(F)</span> naahi aaj..
tuzhi sang saath as<span class="chordset">(G)</span> taana..

Aakaashi <span class="chordset">(C)</span> chandra <span class="chordset">(G)</span> chaanda<span class="chordset">(F)</span> nya..
todun <span class="chordset">(C)</span> mi ka <span class="chordset">(E)</span> aan<span class="chordset">(F)</span> lya..
Manaacha <span class="chordset">(Dm)</span> paalna ka<span class="chordset">(Fm)</span> ru..
baandhuni <span class="chordset">(G)</span> ghe jara jhu<span class="chordset">(E)</span> la..

Dolaata <span class="chordset">(C)</span> tuuch <span class="chordset">(G)</span> saaja<span class="chordset">(F)</span> ni..
sukhacha <span class="chordset">(C)</span> sparsh <span class="chordset">(E)</span> tu na<span class="chordset">(F)</span> va..
Tujhya <span class="chordset">(Dm)</span> vina ure na arth jiv<span class="chordset">(G)</span> ana..

Uja<span class="chordset">(A#)</span> le tuzhya ha<span class="chordset">(Fm)</span> sune kan <span class="chordset">(C)</span> kan..
An <span class="chordset">(A#)</span> chandra he haa<span class="chordset">(Fm)</span> ticha kaa<span class="chordset">(C)</span> kan..</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const jiyekyun = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Jiyein Kyun
Singer: Papon
Music : Pritam
Lyrics: Jaideep Sahni 
Movie : Dum Maaro Dum</pre>
    <pre>
<span class="chordset">Na (E)</span> aaye ho, na <span class="chordset">(G#m)</span> aaoge
Na <span class="chordset">(C#m)</span> phone pe, bu<span class="chordset">(G#m)</span> laoge
Na <span class="chordset">(F#m)</span> shaam ki, ka<span class="chordset">(A)</span> rari chai
La<span class="chordset">(B)</span> bon se yun, pilaoge

Na <span class="chordset">(E)</span> aaye ho, na <span class="chordset">(G#m)</span> aaoge
Na <span class="chordset">(C#m)</span> din dhale, sa<span class="chordset">(G#m)</span> taoge
Na <span class="chordset">(F#m)</span> raat ki, na<span class="chordset">(A)</span> shili bai
Is <span class="chordset">(B)</span> neend mein jagaoge

[Chorus]

Gaye <span class="chordset">(E)</span> tum gaye ho ky<span class="chordset">(F#m)</span> un
Yeh <span class="chordset">(E)</span> raat baki <span class="chordset">(B)</span> hai
Gaye <span class="chordset">(E)</span> tum gaye ho ky<span class="chordset">(F#m)</span> un
<span class="chordset">(E)</span> Saath baki <span class="chordset">(B)</span> hai

Gaye <span class="chordset">(F#m)</span> tum gaye hum tham gaye
her <span class="chordset">(A)</span> baat baaki hain
Gaye <span class="chordset">(E)</span> kyun  
Toh Jiyein <span class="chordset">(A)</span> kyun

Na <span class="chordset">(E)</span> aaye ho, na <span class="chordset">(G#m)</span> aaoge
Na <span class="chordset">(C#m)</span> dooriyaan dhi<span class="chordset">(G#m)</span> khaoge
Na <span class="chordset">(F#m)</span> thaam ke woh <span class="chordset">(A)</span> josh mein
Yun <span class="chordset">(B)</span> hosh se udaoge

Na <span class="chordset">(E)</span> aaye ho, na <span class="chordset">(G#m)</span> aaoge
Na <span class="chordset">(C#m)</span> jhoot se su<span class="chordset">(G#m)</span> naoge
Na <span class="chordset">(F#m)</span> rooth ke si<span class="chordset">(A)</span> rhane mein
re<span class="chordset">(B)</span> mote ko chupaoge

Gaye <span class="chordset">(E)</span> tum gaye ho ky<span class="chordset">(F#m)</span> un
Yeh <span class="chordset">(E)</span> raat baki <span class="chordset">(B)</span> hai
Gaye <span class="chordset">(E)</span> tum gaye ho ky<span class="chordset">(F#m)</span> un
<span class="chordset">(E)</span> Saath baki <span class="chordset">(B)</span> hai

Gaye <span class="chordset">(F#m)</span> tum gaye hum tham gaye
her <span class="chordset">(A)</span> baat baaki hain
Gaye <span class="chordset">(E)</span> kyun  
Toh Jiyein <span class="chordset">(A)</span> kyun

[Bridge]

<span class="chordset">(C#m)</span> Aankh bhi <span class="chordset">(A)</span> tham gayi
<span class="chordset">(F#m)</span> na thaki<span class="chordset">(E)</span>
<span class="chordset">(C#m)</span> Raat bhi <span class="chordset">(A)</span> na bati
<span class="chordset">(F#m)</span> na kati<span class="chordset">(E)</span>

<span class="chordset">(C#m)</span> Raat bhi <span class="chordset">(A)</span> chherhti <span class="chordset">(F#m)</span> maar ti<span class="chordset">(E)</span>
<span class="chordset">(C#m)</span> Neend bhi <span class="chordset">(A)</span> lut gayi, <span class="chordset">(F#m)</span> chin gayi<span class="chordset">(E)</span> 
<span class="chordset">(C#m)</span> Raat bhi <span class="chordset">(A)</span> na sahi, <span class="chordset">(F#m)</span> na rahi<span class="chordset">(E)</span>
<span class="chordset">(C#m)</span> Raat bhi <span class="chordset">(A)</span> laazmi, <span class="chordset">(F#m)</span> zaalmi<span class="chordset">(E)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const hawavein = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Hawayein 
Singer: Arijit Singh
Music : Pritam
Lyrics: Irshad Kamil
Movie : Jab Harry Met Sejal</pre>
    <pre>
[Intro]

Tujh <span class="chordset">(D)</span> ko… main rakh loon wa<span class="chordset">(G)</span>haan
Jahaan pe ka<span class="chordset">(A)</span>hin
Hai mera ya<span class="chordset">(D)</span>qeen.

Main <span class="chordset">(D)</span> jo… tera naa hu<span class="chordset">(G)</span>aa
Kisi ka na<span class="chordset">(A)</span>hin..
Kisi ka na<span class="chordset">(D)</span>hin..

[Chorus]

Le jaayein jaane <span class="chordset">(G)</span> kahaan
Hawayein, hawayein…
Le jaayein tujhe <span class="chordset">(D)</span> kahaan
Hawayein, hawayein.

Begaani hai yeh <span class="chordset">(G)</span> baaghi
Hawayein, hawayein
Le jaaye mujhe <span class="chordset">(D)</span> kahaan
Hawayein, hawayein.

Le jaayein jaane <span class="chordset">(Em)</span> kahaan,
na mujhko kha<span class="chordset">(A)</span>bar
Na tujhko pa<span class="chordset">(D)</span> taa…

Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(A)</span> Oo<span class="chordset">(D)</span>

[Verse]

Banaati hai jo <span class="chordset">(D)</span> tu…
Woh yaadein jaane <span class="chordset">(A)</span> sang
mere kab tak cha<span class="chordset">(G)</span> le

Inhi mein to me<span class="chordset">(Em)</span> ri…
Subah bhi dhalein
<span class="chordset">(A)</span> Shamein dhalein
Mausam dha<span class="chordset">(D)</span> lein.

Khayalon ka she<span class="chordset">(D)</span> har…
Tu jaane tere <span class="chordset">(A)</span> hone se hi aabaad <span class="chordset">(G)</span> hai
Hawayein haq <span class="chordset">(Em)</span> mein…
Wohi hai aate <span class="chordset">(A)</span> jaate jo tera naam <span class="chordset">(D)</span> le.

[Chorus]

Deti hain jo sa<span class="chordset">(G)</span> dayein
Hawayein, hawayein
Na jaane kya ba<span class="chordset">(D)</span> tayein
Hawayein, hawayein.

Le jaaye tujhe <span class="chordset">(G)</span> kahaan
hawayein, hawayein
Le jaaye mujhe <span class="chordset">(D)</span> kahaan
Hawayein, hawayein.

Le jaayein jaane <span class="chordset">(Em)</span> kahaan,
na mujhko kha<span class="chordset">(A)</span> bar
Na tujhko pa<span class="chordset">(D)</span> taa…

Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(A)</span> Oo<span class="chordset">(D)</span>

[Verse]

Cheh<span class="chordset">(D)</span> ra.. kyun milta te<span class="chordset">(G)</span> ra
Yun khwabon se me<span class="chordset">(A)</span> re
Ye kya raaz <span class="chordset">(D)</span> hai?

Kal <span class="chordset">(D)</span> bhi.. meri na thi <span class="chordset">(G)</span> tu
Naa hogi tu <span class="chordset">(A)</span> Kal
Meri aaj <span class="chordset">(D)</span> hai.

[Chorus]

Teri hai meri, <span class="chordset">(G)</span> saari wafayein wafayein
Maangi hai tere <span class="chordset">(D)</span> liye duaayein duaayein
Le jaaye tujhe <span class="chordset">(G)</span> kahaan
hawayein, hawayein.
Le jaaye mujhe <span class="chordset">(D)</span> kahaan
Hawayein, hawayein.

[Chorus/Outro]

Le jaaye jaane <span class="chordset">(G)</span> kahaan
Le jaaye tujhe <span class="chordset">(D)</span> kahaan 
Le jaaye jaane <span class="chordset">(G)</span> kahaan 
Le jaaye tujhe <span class="chordset">(D)</span> kahaan 
Le jaaye jaane <span class="chordset">(G)</span> kahaan 
Le jaaye tujhe <span class="chordset">(D)</span> kahaan 
Le jaaye jaane <span class="chordset">(G)</span> kahaan 
Le jaaye tujhe <span class="chordset">(D)</span> kahaan 

Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(G)</span> hoo Oo<span class="chordset">(D)</span> hoo
Oo<span class="chordset">(A)</span> Oo<span class="chordset">(D)</span></pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;

  const jashnebahara = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Jashn-E-Bahaaraa
Singer: Javed Ali
Music : A.R.Rahman 
Lyrics: Javed Akhtar 
Movie : Jodhaa Akbar</pre>
    <pre>
<span class="chordset">(A)</span> Kehne Ko Jashan-<span class="chordset">(G)</span>-<span class="chordset">(B)</span>ahara Hai
<span class="chordset">(D)</span> Ishq Yeh Dekhke Hairaan Hai
<span class="chordset">(F#m)</span> Kehne Ko Jashan-<span class="chordset">(G)</span>-<span class="chordset">(B)</span>ahara Hai
<span class="chordset">(D)</span> Ishq Yeh Dekhke Hairaan Hai

<span class="chordset">(F#m)</span> Phool Se Khusboo <span class="chordset">(E)</span> Khafa Khafa Hai
<span class="chordset">(D)</span> Gulsan Mein <span class="chordset">(E)</span>
<span class="chordset">(F#m)</span> Chupa Hai Koi <span class="chordset">(Bm)</span> Ranj Fiza Ki
<span class="chordset">(E)</span> Chilman Mein

Sare <span class="chordset">(C#m)</span> Sehmein Nazare <span class="chordset">(F#m)</span> Hain
Soye Soye <span class="chordset">(E)</span> Vaqt Ke Dhare <span class="chordset">(C#m)</span> Hain
Aur <span class="chordset">(C#m)</span> Dil Mein Koi
<span class="chordset">(D)</span> Khoyi Si Baatein <span class="chordset">(A)</span> Hain <span class="chordset">(E)</span> ooo

<span class="chordset">(A)</span> Kehne Ko Jashan-<span class="chordset">(G)</span>-<span class="chordset">(B)</span>ahara Hai
<span class="chordset">(D)</span> Ishq Yeh Dekhke Hairaan Hai
<span class="chordset">(F#m)</span> Phool Se Khusboo <span class="chordset">(E)</span> Khafa Khafa Hai
<span class="chordset">(D)</span> Gulsan Mein <span class="chordset">(E)</span>
<span class="chordset">(F#m)</span> Chupa Hai Koi <span class="chordset">(Bm)</span> Ranj Fiza Ki
<span class="chordset">(E)</span> Chilman Mein

<span class="chordset">(A)</span> Kaise Kahen <span class="chordset">(D)</span> Kya Hai Sitam
<span class="chordset">(A)</span> Sochte Hai <span class="chordset">(D)</span> Abb Yeh Hum <span class="chordset">(A)</span>
Koi <span class="chordset">(Bm)</span> Kaise Kahen Woh
<span class="chordset">(G)</span> Hai Ya Nahi Hu<span class="chordset">(A)</span>mare

<span class="chordset">(A)</span> Karte To Hai <span class="chordset">(D)</span> Saath Safar
<span class="chordset">(A)</span> Fasle Hain <span class="chordset">(D)</span> Phir Bhi Magar
Jaise <span class="chordset">(Bm)</span> Milte Nahi Kisi
<span class="chordset">(G)</span> Dariya Ke Do Ki<span class="chordset">(A)</span>nare

<span class="chordset">(D)</span> Pass Hain Phir Bhi <span class="chordset">(F#m)</span> Paas Nahi
<span class="chordset">(A)</span> Humko Yeh Gum <span class="chordset">(F#m)</span> Raas Nahi
<span class="chordset">(D)</span> Seeshe Ki Ek Di<span class="chordset">(G)</span> ware
Hai Jaise<span class="chordset">(A)</span> Darmiyan

Sare <span class="chordset">(C#m)</span> Sehmein Nazare <span class="chordset">(F#m)</span> Hain
Soye Soye <span class="chordset">(E)</span> Vaqt Ke Dhare <span class="chordset">(C#m)</span> Hain
Aur <span class="chordset">(C#m)</span> Dil Mein Koi
<span class="chordset">(D)</span> Khoyi Si Baatein <span class="chordset">(A)</span> Hain <span class="chordset">(E)</span> ooo

<span class="chordset">(A)</span> Kehne Ko Jashan-<span class="chordset">(G)</span>-<span class="chordset">(B)</span>ahara Hai
<span class="chordset">(D)</span> Ishq Yeh Dekhke Hairaan Hai
<span class="chordset">(F#m)</span> Phool Se Khusboo <span class="chordset">(E)</span> Khafa Khafa Hai
<span class="chordset">(D)</span> Gulsan Mein <span class="chordset">(E)</span>
<span class="chordset">(F#m)</span> Chupa Hai Koi <span class="chordset">(Bm)</span> Ranj Fiza Ki
<span class="chordset">(E)</span> Chilman Mein

<span class="chordset">(A)</span> Humne Jo Tha <span class="chordset">(D)</span> Nagma Suna
<span class="chordset">(A)</span> Dil Ne Tha <span class="chordset">(D)</span> Usko Chuna
Yeh <span class="chordset">(Bm)</span> Dastan Humen
<span class="chordset">(G)</span> Vaqt Ne Kaise Su<span class="chordset">(A)</span> nai

<span class="chordset">(A)</span> Humjo Agar <span class="chordset">(D)</span> Hai Gumgin
<span class="chordset">(A)</span> Woh Bhi Udhar <span class="chordset">(D)</span> Khush To Nahi
Mula<span class="chordset">(Bm)</span> kato Mein Jaise
<span class="chordset">(G)</span> Ghul Si Gai Tan<span class="chordset">(A)</span> hai

<span class="chordset">(D)</span> Milke Bhi Hum <span class="chordset">(F#m)</span> Milte Nahi
<span class="chordset">(A)</span> Khilke Bhi Gul <span class="chordset">(F#m)</span> Khilte Nahi
<span class="chordset">(D)</span> Aankhon Mein Hai
Ba<span class="chordset">(G)</span> harein Dil Mein <span class="chordset">(A)</span> Khilza

Sare <span class="chordset">(C#m)</span> Sehmein Nazare <span class="chordset">(F#m)</span> Hain
Soye Soye <span class="chordset">(E)</span> Vaqt Ke Dhare <span class="chordset">(C#m)</span> Hain
Aur <span class="chordset">(C#m)</span> Dil Mein Koi
<span class="chordset">(D)</span> Khoyi Si Baatein <span class="chordset">(A)</span> Hain <span class="chordset">(E)</span> ooo

<span class="chordset">(A)</span> Kehne Ko Jashan-<span class="chordset">(G)</span>-<span class="chordset">(B)</span>ahara Hai
<span class="chordset">(D)</span> Ishq Yeh Dekhke Hairaan Hai
<span class="chordset">(F#m)</span> Phool Se Khusboo <span class="chordset">(E)</span> Khafa Khafa Hai
<span class="chordset">(D)</span> Gulsan Mein <span class="chordset">(E)</span>
<span class="chordset">(F#m)</span> Chupa Hai Koi <span class="chordset">(Bm)</span> Ranj Fiza Ki
<span class="chordset">(E)</span> Chilman Mein</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const terahonelaga = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Tera Hone Laga Hoon
Singer: Atif Aslam, Alisha Chinai
Music : Pritam
Lyrics: Ashish Pandit
Movie:  Ajab Prem Ki Ghazab Kahani</pre>
    <pre>
[Bridge]  
<span class="chordset">(G#)</span>Shining in the sand in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>feel me, Girl feel me.  

<span class="chordset">(G#)</span>Shining in the shade in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>heal me, Girl heal me  

<span class="chordset">(G#)</span>Thinking about the love we making  
And <span class="chordset">(G#)</span>the life we sharing  
Come and <span class="chordset">(Fm)</span>feel me, Girl feel  

<span class="chordset">(G#)</span>Shining in the sand in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>feel me, Come on heal me  

[Verse 1]  
Oh aaja tu bhi <span class="chordset">(G#)</span>mera mera  
Tera Jo ik<span class="chordset">(Fm)</span>raar hua  
Toh kyun na mein bhi  
<span class="chordset">(G#)</span>Keh dun keh dun  
Hua mujhe bhi <span class="chordset">(Fm)</span>pyaar hua  

[Chorus]  
<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

[Bridge]  
<span class="chordset">(G#)</span>Shining in the sand in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>feel me, Girl feel me.  

<span class="chordset">(G#)</span>Shining in the shade in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>heal me, Girl heal me  

<span class="chordset">(G#)</span>Thinking about the love we making  
And <span class="chordset">(G#)</span>the life we sharing  
Come and <span class="chordset">(Fm)</span>feel me, Girl feel  

<span class="chordset">(G#)</span>Shining in the sand in sun like  
a<span class="chordset">(G#)</span>pearl up on the ocean  
Come and <span class="chordset">(Fm)</span>feel me, Come on heal me  

[Verse 2]  
<span class="chordset">(G#)</span>Waise to mann mera  
<span class="chordset">(Fm)</span>Phele bhi raaton mein  
<span class="chordset">(A#m)</span>Aksar hi <span class="chordset">(D#)</span>chahat ke haan  
<span class="chordset">(A#)</span>Sapne san<span class="chordset">(D#)</span>jota tha  

<span class="chordset">(G#)</span>Phele bhi dhadkan yeh  
<span class="chordset">(Fm)</span>Dhun koi gaati thi  
<span class="chordset">(A#m)</span>Par ab jo <span class="chordset">(D#)</span>hota hai woh  
<span class="chordset">(A#)</span>Phele na <span class="chordset">(D#)</span>hota tha  

Hua hai tujhe, <span class="chordset">(G#)</span>jo bhi jo bhi  
Mujhe bhi is <span class="chordset">(Fm)</span>paar hua  
Toh kyun na main bhi,  
<span class="chordset">(G#)</span>keh doon keh doon  
Hua mujhe bhi <span class="chordset">(Fm)</span>pyaar hua  

[Chorus]  
<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

[Verse 3]  
<span class="chordset">(G#)</span>Aankhon se choo lun ke  
<span class="chordset">(Fm)</span>Bahein tarasti hai  
<span class="chordset">(A#m)</span>Dil ne pu<span class="chordset">(D#)</span>kara hai haan  
<span class="chordset">(A#)</span>Ab toh cha<span class="chordset">(D#)</span>le aao  

<span class="chordset">(G#)</span>Aaoge shabnam ki  
<span class="chordset">(Fm)</span>Boonde barasthi hai  
<span class="chordset">(A#m)</span>Mausam i<span class="chordset">(D#)</span>shaara hai haan  
<span class="chordset">(A#)</span>Ab toh cha<span class="chordset">(D#)</span>le aao  

[Pre-Chorus]  
Bahon mein dale <span class="chordset">(G#)</span>bahein bahein  
Bahon ka jaise <span class="chordset">(Fm)</span>haar hua  
Haan maana main ne <span class="chordset">(G#)</span>maana maana  
Hua mujhe bhi <span class="chordset">(Fm)</span>pyaar hua  

[Chorus]  
<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

<span class="chordset">(G#)</span>Te<span class="chordset">(Fm)</span>ra  
<span class="chordset">(Cm)</span>hone la<span class="chordset">(D#)</span>ga hoon<span class="chordset">(G#)</span>  
Khone La<span class="chordset">(G#)</span>ga hoon  
Jab se mi<span class="chordset">(Cm)</span>la <span class="chordset">(A#m)</span>hoon<span class="chordset">(G#)</span>  

[Bridge]  
<span class="chordset">(G#)</span>Shining in the sand in sun like  
a<span class="chordset">(G#)</span</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const qaafirana = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Qaafirana
Singer: Arijit & Nikhita
Music : Amit Trivedi
Lyrics: Amitabh Bhattacharya
Movie: Kedarnath</pre>
    <pre>[Intro]
<span class="chordset">(E)</span><span class="chordset">(A)</span><span class="chordset">(E)</span><span class="chordset">(A)</span>
<span class="chordset">(E)</span><span class="chordset">(A)</span><span class="chordset">(E)</span><span class="chordset">(A)</span>
<span class="chordset">(E)</span><span class="chordset">(A)</span><span class="chordset">(E)</span><span class="chordset">(A)</span>

[Verse]
<span class="chordset">(E)</span>Inn waadi<span class="chordset">(F#m)</span>yon mein  
<span class="chordset">(B)</span>Takra chu<span class="chordset">(E)</span>ke hai  
<span class="chordset">(E)</span>Humse mu<span class="chordset">(F#m)</span>safir  
<span class="chordset">(A)</span>Yun toh ka<span class="chordset">(B)</span>yi  

<span class="chordset">(E)</span>Dil na la<span class="chordset">(F#m)</span>gaya  
<span class="chordset">(B)</span>Humne ki<span class="chordset">(E)</span>si se  
<span class="chordset">(E)</span>Qisse su<span class="chordset">(F#m)</span>ne hai  
<span class="chordset">(A)</span>Yun toh ka<span class="chordset">(B)</span>yi  

[Pre-Chorus]  
<span class="chordset">(E)</span>Aise tum mile ho  
<span class="chordset">(A)</span>Aise tum mi<span class="chordset">(B)</span>le ho  
<span class="chordset">(E)</span>Jaise mil rahi ho  
<span class="chordset">(A)</span>Itr se ha<span class="chordset">(B)</span>wa  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai  

[Bridge]  
<span class="chordset">(E)</span>Aise tum mile ho  
<span class="chordset">(A)</span>Aise tum mi<span class="chordset">(B)</span>le ho  
<span class="chordset">(E)</span>Jaise mil rahi ho  
<span class="chordset">(A)</span>Itr se ha<span class="chordset">(B)</span>wa  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai  

[Verse]  
<span class="chordset">(C#m)</span>Khamoshi<span class="chordset">(E)</span>yon mein  
<span class="chordset">(G#m)</span>Boli tu<span class="chordset">(C#m)</span>mhari  
<span class="chordset">(A)</span>Kuchh iss ta<span class="chordset">(E)</span>rah  
<span class="chordset">(B)</span>Goonjti hai  

<span class="chordset">(A)</span>Kaano se <span class="chordset">(E)</span>mere  
<span class="chordset">(G#m)</span>Hote hu<span class="chordset">(C#m)</span>ye wo  
<span class="chordset">(A)</span>Dil ka pa<span class="chordset">(E)</span>ta  
<span class="chordset">(B)</span>Dhoondhti hai  

[Pre-Chorus]  
<span class="chordset">(E)</span>Beswadiyon mein  
<span class="chordset">(A)</span>Beswadi<span class="chordset">(B)</span>yon mein  
<span class="chordset">(E)</span>Jaise mil raha ho  
<span class="chordset">(A)</span>Koi zay<span class="chordset">(B)</span>ka  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai  

[Bridge]  
<span class="chordset">(E)</span>Aise tum mile ho  
<span class="chordset">(A)</span>Aise tum mi<span class="chordset">(B)</span>le ho  
<span class="chordset">(E)</span>Jaise mil rahi ho  
<span class="chordset">(A)</span>Itr se ha<span class="chordset">(B)</span>wa  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai  

La <span class="chordset">(E)</span>la la la  
<span class="chordset">(A)</span>La la la la  
La <span class="chordset">(E)</span>la la la  
<span class="chordset">(A)</span>La la la  

Aah <span class="chordset">(E)</span>ha aah ha  
<span class="chordset">(A)</span>Aah ha ha ha  
Aah <span class="chordset">(E)</span>ha  
<span class="chordset">(A)</span>Ha  

[Verse]  
<span class="chordset">(E)</span>Godhi mein pahadiyon ki  
Ujli dopahari gu<span class="chordset">(A)</span>zarna  
Haaye haaye tere <span class="chordset">(F#m)</span>saath mein  
<span class="chordset">(E)</span>Acha lage  

<span class="chordset">(C#m)</span>Sharmeeli akhiyon se  
Tera meri nazrein u<span class="chordset">(A)</span>taarna  
Haaye haaye har <span class="chordset">(F#m)</span>baat pe  
<span class="chordset">(E)</span>Acha lage  

<span class="chordset">(E)</span>Dhalti huyi shaam <span class="chordset">(G#m)</span>ne  
<span class="chordset">(C#m)</span>Bataya hai ki door  
<span class="chordset">(B)</span>Manzil pe raat<span class="chordset">(A)</span> hai  

<span class="chordset">(E)</span>Mujhko tasalli hai <span class="chordset">(G#m)</span>yeh  
<span class="chordset">(C#m)</span>Ki hone talak raat  
<span class="chordset">(B)</span>Hum dono saath <span class="chordset">(A)</span>hai<span class="chordset">(B)</span>  

[Pre-Chorus]  
<span class="chordset">(E)</span>Sang chal rahe hai  
<span class="chordset">(A)</span>Sang chal ra<span class="chordset">(B)</span>he hai  
<span class="chordset">(E)</span>Dhoop ke kinaare  
<span class="chordset">(A)</span>Chhaaon ki ta<span class="chordset">(B)</span>rah  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai  

[Bridge]  
<span class="chordset">(E)</span>Aise tum mile ho  
<span class="chordset">(A)</span>Aise tum mi<span class="chordset">(B)</span>le ho  
<span class="chordset">(E)</span>Jaise mil rahi ho  
<span class="chordset">(A)</span>Itr se ha<span class="chordset">(B)</span>wa  

[Chorus]  
Qaafi<span class="chordset">(F#m)</span>rana <span class="chordset">(A)</span>sa hai  
Ishq <span class="chordset">(B)</span>hai ya <span class="chordset">(E)</span>kya hai</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const tumsehi = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Tum Se Hi
Singer: Mohit Chauhan
Music : Pritam
Lyrics: Irshad Kamil
Movie: Jab We Met</pre>
    <pre>
    <span class="chordset">(G)</span>Na hai <span class="chordset">(D)</span>yeh pa <span class="chordset">(C)</span>na<br>
<span class="chordset">(C)</span>Na Kho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai<br>
Tera <span class="chordset">(G)</span>Na Ho <span class="chordset">(D)</span>na Ja<span class="chordset">(C)</span>ne<br>
<span class="chordset">(C)</span>Kyun Ho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai<br><br>

<span class="chordset">(D)</span>Tum Se Hi Din <span class="chordset">(C)</span>Hota Hai<br>
<span class="chordset">(D)</span>Surmaiye Shaam <span class="chordset">(C)</span>Aati<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(D)</span>Har Ghadi Saans <span class="chordset">(C)</span>Aati Hai<br>
<span class="chordset">(D)</span>Zindagi Keh <span class="chordset">(C)</span>lati Hai<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(G)</span>Na hai <span class="chordset">(D)</span>yeh pa <span class="chordset">(C)</span>na<br>
<span class="chordset">(C)</span>Na Kho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai<br>
Tera <span class="chordset">(G)</span>Na Ho <span class="chordset">(D)</span>na Ja<span class="chordset">(C)</span>ne<br>
<span class="chordset">(C)</span>Kyun Ho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai<br><br>

<span class="chordset">(G)</span>Aankhon Mein Ankhne Teri<br>
<span class="chordset">(Em)</span>Bahoon Mein Baahein Teri<br>
<span class="chordset">(C)</span>Mera Na Mujhe Mein Kuch<br>
Ra<span class="chordset">(D)</span>ha Hu<span class="chordset">(G)</span>a Kya<br><br>

<span class="chordset">(G)</span>Baaton Mein Baatein Teri<br>
<span class="chordset">(Em)</span>Raatein Saugatein Teri<br>
<span class="chordset">(C)</span>Kyun Tera Sab Yeh<br>
Ho Ga<span class="chordset">(D)</span>ya Hu<span class="chordset">(G)</span>a Kya<br><br>

<span class="chordset">(D)</span>Mein Kahin Bhi <span class="chordset">(C)</span>Jata Hoon<br>
<span class="chordset">(D)</span>Tumse Hi Mil <span class="chordset">(C)</span>Jata Hoon<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(D)</span>Shor Mein Kha<span class="chordset">(C)</span>moshi Hai<br>
<span class="chordset">(D)</span>Thodi Se Be<span class="chordset">(C)</span>hoshi Hai<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(G)</span>Aadha Sa Wada Kabhi<br>
<span class="chordset">(Em)</span>Aadhe Se Jayada Kabhi<br>
<span class="chordset">(C)</span>Jee Chahe Karlu<br>
Is Ta<span class="chordset">(D)</span>rah Wa<span class="chordset">(G)</span>fa Ka<br><br>

<span class="chordset">(G)</span>Chode Na Chote Kabhi<br>
<span class="chordset">(Em)</span>Tode Na Tute Kabhi<br>
<span class="chordset">(C)</span>Jo Dhaga Tumse<br>
Jud Ga<span class="chordset">(D)</span>ya Wa<span class="chordset">(G)</span>fa Ka<br><br>

<span class="chordset">(D)</span>Mein Tera Shar<span class="chordset">(C)</span>maya Hoon<br>
<span class="chordset">(D)</span>Jo Mein Ban<span class="chordset">(C)</span>Paya Hoon<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(D)</span>Raste Mil <span class="chordset">(C)</span>jate Hai<br>
<span class="chordset">(D)</span>Manzile Mil <span class="chordset">(C)</span>jati Hai<br>
Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi Tum <span class="chordset">(D)</span>se <span class="chordset">(G)</span>Hi<br><br>

<span class="chordset">(G)</span>Na Hai <span class="chordset">(D)</span>Yeh Pa <span class="chordset">(C)</span>na<br>
<span class="chordset">(C)</span>Na Kho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai<br>
Tera <span class="chordset">(G)</span>Na Ho <span class="chordset">(D)</span>na Ja <span class="chordset">(C)</span>ne<br>
<span class="chordset">(C)</span>Kyun Ho <span class="chordset">(D)</span>na Hi <span class="chordset">(G)</span>Hai
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const aajaomeritamanna = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Aa Jao Meri Tamanna 
Singer: Javed Ali and Jojo
Music : Pritam
Lyrics: Irshad Kamil
Movie:  Ajab Prem Ki Ghazab Kahani</pre>
    <pre>
[Intro]
Thoda Te<span class="chordset">(Dm)</span>har, Thoda Te<span class="chordset">(C)</span>har
Sun Le Za<span class="chordset">(Dm)</span>ra, Sun Le Za<span class="chordset">(C)</span>ra
Dil Keh Ra<span class="chordset">(Dm)</span>ha, Dil Keh Ra<span class="chordset">(C)</span>ha
De Na Sa<span class="chordset">(Dm)</span>ja Yun Bewa<span class="chordset">(C)</span>ja

[Pre-Chorus]
<span class="chordset">(Gm)</span>Rooth Kar
Mujhse Na <span class="chordset">(Am)</span>Ja Abhi
<span class="chordset">(A#)</span>Bhool Kar
Shikwa Gi<span class="chordset">(C)</span>la Sabhi Pyaar <span class="chordset">(Am)</span>Ka

[Chorus]
Aa <span class="chordset">(Dm)</span>Ja<span class="chordset">(C)</span>oo Meri Ta<span class="chordset">(A#)</span>mana
<span class="chordset">(Dm)</span>Baha<span class="chordset">(C)</span>on Mein <span class="chordset">(A#)</span>Aao
Ke <span class="chordset">(Dm)</span>Ho<span class="chordset">(C)</span> Na Paye Ju<span class="chordset">(A#)</span>da Hum
<span class="chordset">(F)</span>Aise <span class="chordset">(C)</span>Mujh Mein Sa<span class="chordset">(A#)</span>mao

[Verse 1]
Hoo <span class="chordset">(Dm)</span>Har Ghadi Lag Rahi Teri Ka<span class="chordset">(Am)</span>mi
<span class="chordset">(Dm)</span>Le Chali Kis Gali Yeh Zinda<span class="chordset">(C)</span>gi
<span class="chordset">(Dm)</span>Hai Pata Lapata Hoon Pyaar <span class="chordset">(Am)</span>Mein
<span class="chordset">(A#)</span>Ankahi Ansuni Chahat Ja<span class="chordset">(C)</span>gi

[Pre-Chorus]
<span class="chordset">(Gm)</span>Jo Hua Phele Hu<span class="chordset">(Am)</span>aa Nahi
<span class="chordset">(A#)</span>Aaj Tum Kar Lo Za<span class="chordset">(C)</span>ra Yakin
Pyaar <span class="chordset">(Am)</span>Ka

<span class="chordset">[Chorus]</span>
Aa <span class="chordset">(Dm)</span>Ja<span class="chordset">(C)</span>oo Meri Ta<span class="chordset">(A#)</span>mana
<span class="chordset">(Dm)</span>Baha<span class="chordset">(C)</span>on Mein <span class="chordset">(A#)</span>Aao
Ke <span class="chordset">(Dm)</span>Ho<span class="chordset">(C)</span> Na Paye Ju<span class="chordset">(A#)</span>da Hum
<span class="chordset">(F)</span>Aise <span class="chordset">(C)</span>Mujh Mein Sa<span class="chordset">(A#)</span>mao

[Verse 2]
Hoo <span class="chordset">(Dm)</span>Rut Jawan Dil Jawan
Hasrat Ja<span class="chordset">(Am)</span>wan
<span class="chordset">(Dm)</span>Tu Hai To Yeh Bhi Hai
Sare Ja<span class="chordset">(C)</span>wan

<span class="chordset">(Dm)</span>Woh Nagar Woh Dagar
Ho Gi Has<span class="chordset">(Am)</span>sen
<span class="chordset">(A#)</span>Tu Mile Pyaar Se
Mujhko Ja<span class="chordset">(C)</span>han

[Pre-Chorus]
<span class="chordset">(Gm)</span>Pana Hai
Tujhko Yeh <span class="chordset">(Am)</span>Dil Kahe
<span class="chordset">(A#)</span>Har Ghadi
Ab To Na<span class="chordset">(C)</span>sha Rahe Pyaar <span class="chordset">(Am)</span>Ka

[Chorus]
Aa <span class="chordset">(Dm)</span>Ja<span class="chordset">(C)</span>oo Meri Ta<span class="chordset">(A#)</span>mana
<span class="chordset">(Dm)</span>Baha<span class="chordset">(C)</span>on Mein <span class="chordset">(A#)</span>Aao
Ke <span class="chordset">(Dm)</span>Ho<span class="chordset">(C)</span> Na Paye Ju<span class="chordset">(A#)</span>da Hum
<span class="chordset">(F)</span>Aise <span class="chordset">(C)</span>Mujh Mein Sa<span class="chordset">(A#)</span>mao

</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const agartumsath = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Agar Tum Sath Ho
Singer: Alka Yagnik, Arijit Singh
Music : A.R Rahman
Lyrics: Irshad Kamil
Movie: Tamasha</pre>
    <pre>
    <span class="chordset">(D#)</span>Pal bhar tha<span class="chordset">(G#)</span>har jaao
<span class="chordset">(D#)</span>Dil ye sam<span class="chordset">(G#)</span>bhal jaaye
<span class="chordset">(D#)</span>Kaise tumhe rok ka<span class="chordset">(G#)</span>run<span class="chordset">(A#)</span>

<span class="chordset">(D#)</span>Meri ta<span class="chordset">(G#)</span>raf aata
<span class="chordset">(D#)</span>har gham phi<span class="chordset">(G#)</span>sal jaaye
<span class="chordset">(D#)</span>Aankhon mein tum ko bha<span class="chordset">(G#)</span>run<span class="chordset">(A#)</span>

<span class="chordset">(D#)</span>Bin bole baatein
<span class="chordset">(G#)</span>tumse ka<span class="chordset">(A#)</span>run
Agar <span class="chordset">(G#)</span>tum saath <span class="chordset">(A#)</span>ho..<span class="chordset">(D#)</span>
Agar <span class="chordset">(G#)</span>tum saath <span class="chordset">(A#)</span>ho..<span class="chordset">(D#)</span>

[Verse]

<span class="chordset">(D#)</span>Behti <span class="chordset">(G#)</span>rehti..<span class="chordset">(A#)</span>
<span class="chordset">(D#)</span>Nahar nadi<span class="chordset">(G#)</span>ya si teri duni<span class="chordset">(A#)</span>ya mein

<span class="chordset">(D#)</span>Meri duni<span class="chordset">(G#)</span>ya hai
teri chaaha<span class="chordset">(A#)</span>ton mein
<span class="chordset">(D#)</span>Main dhal jaa<span class="chordset">(G#)</span>ta hoon
teri aada<span class="chordset">(A#)</span>ton mein
agar <span class="chordset">(G#)</span>tum saath <span class="chordset">(A#)</span>ho<span class="chordset">(D#)</span>

[Bridge]

<span class="chordset">(G#)</span>Teri nazron mein hai
<span class="chordset">(A#)</span>tere sapne
<span class="chordset">(G#)</span>Tere sapno mein hai
<span class="chordset">(D#)</span>naraazi

<span class="chordset">(G#)</span>Mujhe lagta hai ke
<span class="chordset">(A#)</span>baatein dil ki
<span class="chordset">(G#)</span>Hoti lafzon ki <span class="chordset">(A#)</span>dhokebaazi
<span class="chordset">(D#)</span>Tum saath ho ya na ho
<span class="chordset">(G#)</span>kya fark <span class="chordset">(A#)</span>hai

<span class="chordset">(D#)</span>Bedard thi zindagi
<span class="chordset">(G#)</span>bedard <span class="chordset">(A#)</span>hai
Agar <span class="chordset">(G#)</span>tum saath <span class="chordset">(A#)</span>ho<span class="chordset">(D#)</span>
Agar <span class="chordset">(G#)</span>tum saath <span class="chordset">(A#)</span>ho<span class="chordset">(D#)</span>
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const indino = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : In Dino
Singer : Soham
Music : Pritam Chakraborty
Lyrics: Sayeed Quadri 
Movie : Life in a Metro</pre>
    <pre>
    <span class="chordset">(C)</span>in Di<span class="chordset">(C)</span>no, Dil Mera,<br> Mujhse <span class="chordset">(C)</span>Hai Keh Raha
<span class="chordset">(G)</span>Tu <span class="chordset">(F)</span>Khaab Sa<span class="chordset">(C)</span>ja
<span class="chordset">(G)</span>Tu<span class="chordset">(F)</span>Ji Le Ja<span class="chordset">(C)</span>ra

<span class="chordset">(C)</span>Hai Tujhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mu<span class="chordset">(C)</span>habbat
<span class="chordset">(C)</span>Hai Tujhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mu<span class="chordset">(C)</span>habbat

<span class="chordset">(C)</span>in Di<span class="chordset">(C)</span>no, Dil Mera,
Mujhse <span class="chordset">(C)</span>Hai Keh Raha
<span class="chordset">(G)</span>Tu <span class="chordset">(F)</span>Khaab Sa<span class="chordset">(C)</span>ja
<span class="chordset">(G)</span>Tu<span class="chordset">(F)</span>Ji Le Ja<span class="chordset">(C)</span>ra

<span class="chordset">(C)</span>Hai Tujhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mu<span class="chordset">(C)</span>habbat
<span class="chordset">(C)</span>Hai Tujhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mu<span class="chordset">(C)</span>habbat

<span class="chordset">(C)</span>berang Si Hai Badi Zindagi
Kuchh <span class="chordset">(G)</span>Rang To Bha<span class="chordset">(C)</span>roon
<span class="chordset">(C)</span>Main Apani Tanahaayi Ke Waaste
Abbb <span class="chordset">(G)</span>Kuchh Toh Ka<span class="chordset">(C)</span>roon

<span class="chordset">(C)</span>berang Si Hai Badi Zindagi
Kuchh <span class="chordset">(G)</span>Rang To Bha<span class="chordset">(C)</span>roon
<span class="chordset">(C)</span>Main Apani Tanahaayi Ke Waaste
Abbb <span class="chordset">(G)</span>Kuchh Toh Ka<span class="chordset">(C)</span>roon

<span class="chordset">(G)</span>Jab Mi<span class="chordset">(G)</span>le Thodi <span class="chordset">(G)</span>Fursat
<span class="chordset">(G)</span>Jab Mi<span class="chordset">(G)</span>le Thodi <span class="chordset">(G)</span>Fursat
Mujhse <span class="chordset">(C)</span>Karle Mu<span class="chordset">(C)</span>habbat
Hai Tu<span class="chordset">(C)</span>jhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mo<span class="chordset">(C)</span>habbat

<span class="chordset">(C)</span>(<span class="chordset">(A#)</span><span class="chordset">(Am)</span><span class="chordset">(G#)</span><span class="chordset">(A#)</span>)
<span class="chordset">(C)</span>(<span class="chordset">(A#)</span><span class="chordset">(Am)</span><span class="chordset">(G#)</span><span class="chordset">(A#)</span>)

<span class="chordset">(C)</span>Usako Chhupaakar Main Sabse Kabhi
Le Cha<span class="chordset">(G)</span>loon Kahin <span class="chordset">(C)</span>Door...
<span class="chordset">(C)</span>Aankhon Ke Pyaalon Se Pita Rahoon
Usake <span class="chordset">(G)</span>Chehre Ka <span class="chordset">(C)</span>Noor

<span class="chordset">(C)</span>Usako Chhupaakar Main Sabse Kabhi
Le Cha<span class="chordset">(G)</span>loon Kahin <span class="chordset">(C)</span>Door...
<span class="chordset">(C)</span>Aankhon Ke Pyaalon Se Pita Rahoon
Usake <span class="chordset">(G)</span>Chehre Ka <span class="chordset">(C)</span>Noor

<span class="chordset">(G)</span>Iss Ja<span class="chordset">(G)</span>maane Se <span class="chordset">(G)</span>Chhupakar
<span class="chordset">(G)</span>Iss Ja<span class="chordset">(G)</span>maane Se <span class="chordset">(G)</span>Chhupakar…
Puri <span class="chordset">(C)</span>Karloon Main <span class="chordset">(C)</span>Hasrat

Hai <span class="chordset">(C)</span>Tujhe Bhi I<span class="chordset">(G)</span>zaazat
Karle <span class="chordset">(C)</span>Tu Bhi Mo<span class="chordset">(C)</span>habbat…

<span class="chordset">(C)</span>in Di<span class="chordset">(C)</span>no, Dil Mera,
Mujhse <span class="chordset">(Am)</span>Hai Keh Raha
<span class="chordset">(G)</span>Tu <span class="chordset">(F)</span>Khaab Sa<span class="chordset">(C)</span>ja
<span class="chordset">(G)</span>Tu<span class="chordset">(F)</span>Ji Le Ja<span class="chordset">(C)</span>ra

<span class="chordset">(C)</span>in Di<span class="chordset">(C)</span>no, Dil Mera,
Mujhse <span class="chordset">(Am)</span>Hai Keh Raha
<span class="chordset">(G)</span>Tu <span class="chordset">(F)</span>Khaab Sa<span class="chordset">(C)</span>ja
<span class="chordset">(G)</span>Tu<span class="chordset">(F)</span>Ji Le Ja<span class="chordset">(C)</span>ra
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const merebina = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Mere Bina 
Singer: Nikhil Dsouza
Music : Pritam
Lyrics: Kumaar
Movie: Crook</pre>
    <pre>
<span class="chordset">(D)</span><span class="chordset">(A)</span><span class="chordset">(G)</span>
<span class="chordset">(D)</span><span class="chordset">(A)</span><span class="chordset">(G)</span>

[Verse]
Mere Bi<span class="chordset">(D)</span>na main
rehne la<span class="chordset">(Bm)</span>ga hun
Teri ha<span class="chordset">(Em)</span>waon me
behne la<span class="chordset">(A)</span>ga hun

Jaane main <span class="chordset">(D)</span>kaise
tera hu<span class="chordset">(Bm)</span>aa hun
Mujhe to <span class="chordset">(Em)</span>lagta hai main shayad
tere <span class="chordset">(A)</span>dil ki dua hu haa

[Chorus]
<span class="chordset">(D)</span>Tujhko jo paa<span class="chordset">(G)</span>ya ahaa
<span class="chordset">(Bm)</span>To jeena aa<span class="chordset">(Em)</span>ya
Ab ye <span class="chordset">(Bm)</span>lamha theher jaye
<span class="chordset">(Bm)</span>tham jaye bas jaye
<span class="chordset">(G)</span>hum Dono ke darmi<span class="chordset">(A)</span>yan

<span class="chordset">(D)</span>Tujhko jo paa<span class="chordset">(G)</span>ya aha
<span class="chordset">(Bm)</span>To jeena aa<span class="chordset">(Em)</span>ya
Ab ye <span class="chordset">(Bm)</span>lamha theher jaye
<span class="chordset">(Bm)</span>tham jaye bas jaye
<span class="chordset">(G)</span>hum Dono ke darmi<span class="chordset">(A)</span>yan

[Verse]
Pehle se <span class="chordset">(D)</span>zyada
main jee<span class="chordset">(Bm)</span>raha hu
Jabse main <span class="chordset">(Em)</span>tere
dil se ju<span class="chordset">(A)</span>da hu

Rahon pe <span class="chordset">(D)</span>teri
main to cha<span class="chordset">(Bm)</span>la hu
Tu meri <span class="chordset">(Em)</span>manzil hai
tere <span class="chordset">(Em)</span>kadmon pe bas
<span class="chordset">(A)</span>rukne laga hu haa

[Chorus]
<span class="chordset">(D)</span>Tujhko jo paa<span class="chordset">(G)</span>ya aha
<span class="chordset">(Bm)</span>To jeena aa<span class="chordset">(Em)</span>ya
Ab ye <span class="chordset">(Bm)</span>lamha theher jaye
<span class="chordset">(Bm)</span>tham jaye bas jaye
<span class="chordset">(G)</span>hum Dono ke darmi<span class="chordset">(A)</span>yana<span class="chordset">(D)</span>

<span class="chordset">(F#m)</span><span class="chordset">(G)</span><span class="chordset">(G)</span><span class="chordset">(A)</span>
<span class="chordset">(F#m)</span><span class="chordset">(G)</span><span class="chordset">(G)</span><span class="chordset">(A)</span>

[Verse]
<span class="chordset">(D)</span>Teri nazar me
nayi <span class="chordset">(Bm)</span>si adaa hai
Naya <span class="chordset">(G)</span>sa nasha bhi
ghula <span class="chordset">(A)</span>hai

<span class="chordset">(D)</span>Kayi dino se
bandha th<span class="chordset">(Bm)</span>aa baadal jo
Tere <span class="chordset">(G)</span>hi baalon me
khula <span class="chordset">(A)</span>hai

Teri ha<span class="chordset">(G)</span>don me
meri ba<span class="chordset">(Bm)</span>sar hai
Ab tu<span class="chordset">(G)</span>jhe bhi
jana ki<span class="chordset">(A)</span>dhar hai

Jahan ra<span class="chordset">(D)</span>he tu
main wo ja<span class="chordset">(Bm)</span>han hu
Jise ji<span class="chordset">(Em)</span>ye tu
main wo sa<span class="chordset">(A)</span>ma hu

Teri wa<span class="chordset">(D)</span>ja se
naya na<span class="chordset">(Bm)</span>ya hu
Pehle ka<span class="chordset">(D)</span>ha na maine
ab ye tumse
<span class="chordset">(A)</span>kehne laga hu..haa

[Chorus]
<span class="chordset">(D)</span>Tujhko jo paa<span="chordset">(G)</span>ya aha
<span class="chordset">(Bm)</span>To jeena aa<span="chordset">(Em)</span>ya
Ab ye <span class="chordset">(Bm)</span>lamha theher jaye
<span class="chordset">(Bm)</span>tham jaye bas jaye
<span class="chordset">(G)</span>hum Dono ke darmi<span="chordset">(A)</span>yana<span="chordset">(D)</span>
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const lomaanliya = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Lo Maan Liya
Singer: Arijit Singh
Music : Jeet Gannguli
Lyrics: Jeet Gannguli, kausar Munir
Movie: Raaz Reboot</pre>
    <pre>
    <span class="chordset">[Chorus]</span>
Lo <span class="chordset">(F#m)</span>maan liya hum<span class="chordset">(Bm)</span>ne
Hai <span class="chordset">(C#)</span>pyar nahi tum<span class="chordset">(F#m)</span>ko
Tum <span class="chordset">(F#m)</span>yaad nahi hum<span class="chordset">(Bm)</span>ko
Hum <span class="chordset">(C#)</span>yaad nahi tum<span class="chordset">(F#m)</span>ko

<span class="chordset">[Pre-Chorus]</span>
Bas <span class="chordset">(C#m)</span>ek dafaa mud<span class="chordset">(D)</span>ke dekho
Aye <span class="chordset">(C#)</span>yaar zara hum<span class="chordset">(A)</span>ko

<span class="chordset">[Chorus]</span>
Lo <span class="chordset">(F#m)</span>maan liya hum<span class="chordset">(Bm)</span>ne
Hai <span class="chordset">(C#)</span>pyar nahi tum<span class="chordset">(F#m)</span>ko
Tum <span class="chordset">(F#m)</span>yaad nahi hum<span class="chordset">(Bm)</span>ko
Hum <span class="chordset">(C#)</span>yaad nahi tum<span class="chordset">(F#m)</span>ko

<span class="chordset">[Verse]</span>
Lo <span class="chordset">(A)</span>maan liya de<span class="chordset">(E)</span>kha hi nahi
Tere <span class="chordset">(C#)</span>kaandhe ka wo <span class="chordset">(F#m)</span>til
Lo <span class="chordset">(A)</span>maan liya too<span class="chordset">(E)</span>ta hi nahi
Tere <span class="chordset">(C#)</span>hathon se mera <span class="chordset">(F#m)</span>dil

<span class="chordset">[Pre-Chorus]</span>
Chha<span class="chordset">(C#m)</span>aon mein teri bee<span class="chordset">(D)</span>ti hi nahi
Wo <span class="chordset">(C#)</span>garmi ki baa<span class="chordset">(A)</span>tein
Baa<span class="chordset">(C#m)</span>hon mein teri guz<span class="chordset">(D)</span>ri hi nahi
Wo <span class="chordset">(C#)</span>sardi ki raa<span class="chordset">(A)</span)tein

<span class="chordset">[Chorus]</span>
Lo <span class="chordset">(F#m)</span>maan liya hum<span class="chordset">(Bm)</span>ne
Hai <span class="chordset">(C#)</span>pyar nahi tum<span class="chordset">(F#m)</span>ko
Tum <span class="chordset">(F#m)</span>yaad nahi hum<span class="chordset">(Bm)</span>ko
Hum <span class="chordset">(C#)</span>yaad nahi tum<span class="chordset">(F#m)</span>ko

<span class="chordset">[Verse]</span>
Jaa<span class="chordset">(A)</span>o le jaao <span class="chordset">(E)</span>neend meri
<span class="chordset">(C#)</span>Uff na karenge <span class="chordset">(F#m)</span>hum
Jo <span class="chordset">(A)</span>le jaaoge <span class="chordset">(E)</span>khwaab mere
Toh <span class="chordset">(C#)</span>kaise jiyenge <span class="chordset">(F#m)</span>hum

<span class="chordset">[Pre-Chorus]</span>
Jee<span class="chordset">(C#m)</span>na humko aa<span class="chordset">(D)</span>ta hi nahi
Teri <span class="chordset">(C#)</span>saanson ke si<span class="chordset">(A)</span>va
Mar<span class="chordset">(C#m)</span>na bhi ab na<span class="chordset">(D)</span>mumkin hai
Teri <span class="chordset">(C#)</span>baahon ke si<span class="chordset">(A)</span>va

<span class="chordset">[Chorus]</span>
Lo <span class="chordset">(F#m)</span>maan liya hum<span class="chordset">(Bm)</span>ne
Par<span class="chordset">(C#)</span>wah nahi tum<span class="chordset">(F#m)</span>ko
Tum <span class="chordset">(F#m)</span>yaad nahi hum<span class="chordset">(Bm)</span>ko
Hum <span class="chordset">(C#)</span>yaad nahi tum<span class="chordset">(F#m)</span>ko
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const ennasona = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Enna Sona 
Singer: Arijit Singh
Music : A.R Rahman
Lyrics: Gulzar
Movie: OK Jaanu</pre>
    <pre>
[Intro]
<span class="chordset">(Gm)</span><span class="chordset">(F)</span><span class="chordset">(D#)</span><span class="chordset">(F)</s
<span class="chordset">(Gm)</span><span class="chordset">(F)</span><span class="chordset">(D#)</span><span class="chordset">(Dm)</s

[Chorus]
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(F)</span>
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(Dm)</span>

Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(F)</span>
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(Dm)</span>

Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(F)</span>van
Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(Dm)</span>van

Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span>, enna <span class="chordset">(D#)</span>sona<span class="chordset">(F)</span>
Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span> <span class="chordset">(D#)</span>o…<span class="chordset">(A#)</span>

Enna <span class="chordset">(Gm)</span>Sona <span class="chordset">(F)</span>Ooo
Enna <span class="chordset">(D#)</span>Sona <span class="chordset">(Dm)</span>Ooo
Enna <span class="chordset">(Gm)</span>Sona...<span class="chordset">(F)</span>
Enna <span class="chordset">(D#)</span>Sona...<span class="chordset">(F)</span>

[Instrumental]
<span class="chordset">(Gm)</span><span class="chordset">(F)</span><span class="chordset">(A#)</span><span class="chordset">(F)</span>
<span class="chordset">(A#)</span><span class="chordset">(G#)</span><span class="chordset">(G)</span><span class="chordset">(G)</span>

[Instrumental]
<span class="chordset">(C)</span><span class="chordset">(D#)</span><span class="chordset">(A#)</span><span class="chordset">(F)</span>
<span class="chordset">(C)</span><span class="chordset">(D#)</span><span class="chordset">(Dm)</span><span class="chordset">(Gm/A#)</span>

[Verse]
Kol <span class="chordset">(F)</span>hove te<span class="chordset">(A#)</span>
sekh lag<span class="chordset">(D#)</span>da ae<span class="chordset">(F)</span>
Door <span class="chordset">(A#)</span>jaave te<span class="chordset">(F)</span>
dil jal<span class="chordset">(Gm)</span>da ae<span class="chordset">(F)</span>

Kehdi <span class="chordset">(A#)</span>agg na<span class="chordset">(F)</span>al
Rabb ne ba<span class="chordset">(Gm)</span>naya<span class="chordset">(D#)</span>
Rabb ne ba<span class="chordset">(F)</span>naya, Rabb ne ba<span class="chordset">(D)</span>naya

[Chorus]
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(A#)</span>
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(Dm)</span>

Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(Dm)</span>van
Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(Dm)</span>van

Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span>, enna <span class="chordset">(D#)</span>sona<span class="chordset">(Dm)</span>
Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span> <span class="chordset">(D#)</span>o…<span class="chordset">(Dm)</span>

[Instrumental Solo]
<span class="chordset">(Gm/D#)</span><span class="chordset">(F/A#)</span><span class="chordset">(Dm/Gm)</span><span class="chordset">(D#/F)</span>
<span class="chordset">(Gm/D#)</span><span class="chordset">(F/A#)</span><span class="chordset">(F/D#)</span><span class="chordset">(Gm/A)</span>
<span class="chordset">(Dm/F)</span><span class="chordset">(F/A#)</span>

[Verse]
Taap <span class="chordset">(F)</span>lagge na<span class="chordset">(A#)</span>
tatti chan<span class="chordset">(D#)</span>dni da<span class="chordset">(F)</span>
Saari <span class="chordset">(A#)</span>raati main<span class="chordset">(F)</span>
oss chid<span class="chordset">(Gm)</span>kavan<span class="chordset">(F)</span>

Kinne <span class="chordset">(A#)</span>dardan naal<span class="chordset">(Dm)</span>
Rabb ne ba<span class="chordset">(Gm)</span>naya<span class="chordset">(D#)</span>
Rabb ne ba<span class="chordset">(F)</span>naya,
Rabb ne ba<span class="chordset">(D)</span>naya<span class="chordset">(Gm)</span>

[Chorus]
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(F)</span>
Enna <span class="chordset">(Gm)</span>sona kyun<span class="chordset">(F)</span>
Rabb ne ba<span class="chordset">(D#)</span>naya..<span class="chordset">(Dm)</span>

Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(Dm)</span>van
Aavan <span class="chordset">(Gm)</span>javan te main
<span class="chordset">(F)</span>yaara nu ma<span class="chordset">(D#)</span>na<span class="chordset">(Dm)</span>van

Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span>, enna <span class="chordset">(D#)</span>sona<span class="chordset">(F)</span>
Enna <span class="chordset">(Gm)</span>sona<span class="chordset">(F)</span> <span class="chordset">(D#)</span>o…<span class="chordset">(A#)</span>
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const tujaanena = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Tu Jaane Na 
Singer: Atif Aslam
Music : Pritam
Lyrics: rshad Kamil
Movie:  Ajab Prem Ki Ghazab Kahani</pre>
    <pre>
    <span class="chordset">(G)</span>Kaise Bataye <span class="chordset">(Em)</span>Kyu Tujhko Chahe
<span class="chordset">(Am)</span>Yaara Bata Naa <span class="chordset">(D)</span>Paye
<span class="chordset">(G)</span>Baate Dilo Ki <span class="chordset">(Em)</span>Dekho Zuban Ki
<span class="chordset">(Am)</span>Aankhe Tujhe Sam<span class="chordset">(D)</span>jhaye

<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na
<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na

<span class="chordset">(G)</span>Mil Ke Bhi <span class="chordset">(D)</span>Hum Na Mi<span class="chordset">(Em)</span>le
<span class="chordset">(D)</span>Tum Mil<span class="chordset">(G)</span>o Ke Hai Faas<span class="chordset">(C)</span>le
<span class="chordset">(Am)</span>Tum <span class="chordset">(D)</span>Se Na Jaane K<span class="chordset">(G)</span>yu

<span class="chordset">(G)</span>Anjaane Hai Silsi<span class="chordset">(D)</span>le
<span class="chordset">(Em)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu
<span class="chordset">(G)</span>Sapne Hai Palkon Ta<span class="chordset">(C)</span>le
<span class="chordset">(Am)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu

<span class="chordset">(G)</span>Kaise Bataye <span class="chordset">(Em)</span>Kyu Tujhko Chahe
<span class="chordset">(Am)</span>Yaara Bata Naa <span class="chordset">(D)</span>Paye
<span class="chordset">(G)</span>Baate Dilo Ki <span class="chordset">(Em)</span>Dekho Zuban Ki
<span class="chordset">(Am)</span>Aankhe Tujhe Sam<span class="chordset">(D)</span>jhaye

<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na
<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na

<span class="chordset">(G)</span>Nigahon Mein Dekho Meri
<span class="chordset">(C)</span>Jo Hai Bas Gaya
<span class="chordset">(G)</span>Wo Hai Milta Tumse Huba<span class="chordset">(D)</span>hoo Ooo

<span class="chordset">(G)</span>Jaane Teri Aankhe Thi Ya
<span class="chordset">(C)</span>Baate Thi Wajah
<span class="chordset">(G)</span>Hue Tum Jo Dil Ki Aar<span class="chordset">(D)</span>zoo

<span class="chordset">(C)</span>Tum Paas Hoke Bhi
<span class="chordset">(G)</span>Tum Aas Hoke Bhi
<span class="chordset">(C)</span>Ehsaas Hoke Bhi
<span class="chordset">(G)</span>Apne Nahi Aise Ho <span class="chordset">(D)</span>

<span class="chordset">(D)</span>Hum Ko Gi<span class="chordset">(Em)</span>le
<span class="chordset">(D)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu
<span class="chordset">(G)</span>Milon Ke Hai Faas<span class="chordset">(C)</span>le
<span class="chordset">(Am)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu

<span class="chordset">(G)</span>Anjaane Hai Silsi<span class="chordset">(D)</span>le
<span class="chordset">(Em)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu
<span class="chordset">(G)</span>Sapne Hai Palkon Ta<span class="chordset">(C)</span>le
<span class="chordset">(Am)</span>Tum Se Na Jaane K<span class="chordset">(D)</span>yu

<span class="chordset">(G)</span>Kaise Bataye <span class="chordset">(Em)</span>Kyu Tujhko Chahe
<span class="chordset">(Am)</span>Yaara Bata Naa <span class="chordset">(D)</span>Paye
<span class="chordset">(G)</span>Baate Dilo Ki <span class="chordset">(Em)</span>Dekho Zuban Ki
<span class="chordset">(Am)</span>Aankhe Tujhe Sam<span class="chordset">(D)</span>jhaye

<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na
<span class="chordset">(G)</span>Tu Jaane Na <span class="chordset">(D)</span>Aa
<span class="chordset">(G)</span>Tu Jaane Na
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const jeelezaraa = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Jee Le Zaraa
Singer: Vishal Dadlani
Music : Ram Sampath
Lyrics: Javed Akhtar
Movie: Talaash</pre>
    <pre>
<span class="chordset">(Am)</span>Main hoon gumsum tu bhi
<span class="chordset">(C)</span>khaamosh <span class="chordset">(Em)</span>hai
<span class="chordset">(Am)</span>Sach hai samay ka hi
<span class="chordset">(C)</span>sab dosh <span class="chordset">(Em)</span>hai

<span class="chordset">(Dm)</span>Dhadkan dhadkan
<span class="chordset">(F)</span>ik gam rehta <span class="chordset">(G)</span>hai
<span class="chordset">(Dm)</span>Jaane kyu phir
<span class="chordset">(F)</span>bhi dil kehta <span class="chordset">(G)</span>hai

Jee le za<span class="chordset">(Am)</span>ra, jee le za<span class="chordset">(G)</span>ra
Kehta hai <span class="chordset">(Am)</span>dil, jee le za<span class="chordset">(G)</span>ra
<span class="chordset">(F)</span>Aye humsa<span class="chordset">(G)</span>far, aye humna<span class="chordset">(Am)</span>va
<span class="chordset">(F)</span>Aa paas <span class="chordset">(G)</span>aa, jee le za<span class="chordset">(Am)</span>ra

<span class="chordset">(Am)</span>Hai zindagi mana <span class="chordset">(G)</span>dard bhari
Phir bhi <span class="chordset">(F)</span>isme ye <span class="chordset">(G)</span>raahat
bhi <span class="chordset">(Am)</span>hai

<span class="chordset">(Am)</span>Main hoon tera aur <span class="chordset">(G)</span>tu hai meri
Yunhi ra<span class="chordset">(F)</span>he hum ye <span class="chordset">(G)</span>chahat
bhi <span class="chordset">(Am)</span>hai

<span class="chordset">(Dm)</span>Phir dil ke dil se
<span class="chordset">(G)</span>pul kyu toote <span class="chordset">(Am)</span>hain
<span class="chordset">(Dm)</span>kyun hum jeene se
<span class="chordset">(G)</span>itne roothe <span class="chordset">(Am)</span>hain

<span class="chordset">(Dm)</span>Aa dil ke dar<span class="chordset">(F)</span>waze
hum kho <span class="chordset">(G)</span>le
<span class="chordset">(Dm)</span>Aa hum dono <span class="chordset">(F)</span>jee bhar
ke ro <span class="chordset">(G)</span>le

Jee le za<span class="chordset">(Am)</span>ra, jee le za<span class="chordset">(G)</span>ra
Kehta hai <span class="chordset">(Am)</span>dil, jee le za<span class="chordset">(G)</span>ra
<span class="chordset">(F)</span>Aye humsa<span class="chordset">(G)</span>far, aye humna<span class="chordset">(Am)</span>va
<span class="chordset">(F)</span>Aa paas <span class="chordset">(G)</span>aa, jee le za<span class="chordset">(Am)</span>ra

<span class="chordset">(Am)</span>Gam ke ye baadal gu<span class="chordset">(G)</span>zar jaane de
<span class="chordset">(Am)</span>Ab zindagi ko ni<span class="chordset">(G)</span>khar jaane de
<span class="chordset">(Dm)</span>Chod de ab yaa<span class="chordset">(F)</span>don ke dukh seh<span class="chordset">(G)</span>na
<span class="chordset">(Dm)</span>Sun bhi le jo <span class="chordset">(F)</span>dil ka hai keh<span class="chordset">(G)</span>na

Jee le za<span class="chordset">(Am)</span>ra, jee le za<span class="chordset">(G)</span>ra
Kehta hai <span class="chordset">(Am)</span>dil, jee le za<span class="chordset">(G)</span>ra
<span class="chordset">(F)</span>Aye humsa<span class="chordset">(G)</span>far, aye humna<span class="chordset">(Am)</span>va
<span class="chordset">(F)</span>Aa paas <span class="chordset">(G)</span>aa, jee le za<span class="chordset">(Am)</span>ra
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const kyahuwaterawada = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Kya Hua Tera Wada  
Singer: Mohammed Rafi
Music : R.D Burman
Lyrics: Majrooh Sultanpuri
Movie: Hum Kisise kum nahi</pre>
    <pre>
<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada
Bhoolega <span class="chordset">(F)</span>dil jis din tumhein
Woh din <span class="chordset">(C)</span>zindagi ka aakhiri
<span class="chordset">(F)</span>din hoga

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada

[Verse 1]  
Yaad hai <span class="chordset">(Dm)</span>mujhko  
toone ka<span class="chordset">(A#)</span>ha tha  
Tumse na<span class="chordset">(Am)</span>hin roo<span class="chordset">(C)</span>thenge  
ka<span class="chordset">(F)</span>bhi

Dil ki ta<span class="chordset">(Dm)</span>rah se  
aaj mi<span class="chordset">(A#)</span>le hain  
Kaise bha<span class="chordset">(Am)</span>la chhoo<span class="chordset">(C)</span>tenge  
ka<span class="chordset">(F)</span>bhi

<span class="chordset">(F)</span>Teri baa<span class="chordset">(C)</span>hon mein  
<span class="chordset">(F)</span>beeti har <span class="chordset">(C)</span>shaam  
<span class="chordset">(A#)</span>Bewafa yeh bhi kya  
<span class="chordset">(F)</span>ya<span class="chordset">(C)</span>d na<span class="chordset">(F)</span>hin

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada
Bhoolega <span class="chordset">(F)</span>dil jis din tumhein
Woh din <span class="chordset">(C)</span>zindagi ka aakhiri
<span class="chordset">(F)</span>din hoga

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada

[Verse 2]  
O kehne <span class="chordset">(A#)</span>waale  
mujhko farebi  
Kaun farebi  
<span class="chordset">(C)</span>hai yeh ba<span class="chordset">(F)</span>ta

Woh jisne <span class="chordset">(A#)</span>gham liya  
pyaar ki khatir Ya jisne  
<span class="chordset">(C)</span>pyaar ko bech di<span class="chordset">(F)</span>ya

<span class="chordset">(F)</span>Nasha dau<span class="chordset">(C)</span>lat ka  
<span class="chordset">(F)</span>aisa bhi <span class="chordset">(C)</span>kya  
<span class="chordset">(A#)</span>Ke tujhe kuchh bhi  
<span class="chordset">(F)</span>yaa<span class="chordset">(C)</span>d na<span class="chordset">(F)</span>hin

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada
Bhoolega <span class="chordset">(F)</span>dil jis din tumhein
Woh din <span class="chordset">(C)</span>zindagi ka aakhiri
<span class="chordset">(F)</span>din hoga

<span class="chordset">(A#)</span>Kya hua tera <span class="chordset">(F)</span>vaada
woh ka<span class="chordset">(A#)</span>sam woh i<span class="chordset">(F)</span>rada
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const kalank = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Kalank 
Singer: Arijit Singh
Music : Pritam
Lyrics: Amitabh Bhattacharya
Movie: Kalank</pre>
    <pre>
<span class="chordset">(A#)</span>(<span class="chordset">Gm</span>)(<span class="chordset">F#</span>)
<span class="chordset">(A#)</span>(<span class="chordset">Gm</span>)(<span class="chordset">F#</span>)

[VERSE 1]
Hawaao me bah<span class="chordset">(D#)</span>engey
Ghaaton me ra<span class="chordset">(F#)</span>henge
Tu barkhaa me<span class="chordset">(Gm)</span>ri
Me te<span class="chordset">(F#)</span>ra baadal pi<span class="chordset">(D#)</span>ya

Jo tere naa hu<span class="chordset">(D#)</span>e toh
Kisike naa rah<span class="chordset">(F#)</span>henge
Diwaani tu me<span class="chordset">(Gm)</span>ri
Main te<span class="chordset">(F#)</span>ra paagal pi<span class="chordset">(D#)</span>ya

[CHORUS]
Hazaaro meki<span class="chordset">(Gm)</span>si <span class="chordset">(D#)</span>ko
Takdeer <span class="chordset">(F#)</span>ai<span class="chordset">(A#)</span>si
Milli hai ek <span class="chordset">(Gm)</span>raan <span class="chordset">(D#)</span>jhaa
Aur heer <span class="chordset">(F#)</span>jai<span class="chordset">(A#)</span>si

Naa jane yeh ja<span class="chordset">(D#)</span>maana
Kyu chahey yeh mi<span class="chordset">(F#)</span>taana
Kalank na<span class="chordset">(Gm)</span>hi ishq <span class="chordset">(F#)</span>hai
kaajal pi<span class="chordset">(D#)</span>ya
Kalank na<span class="chordset">(Gm)</span>hi ishq <span class="chordset">(F#)</span>hai
kajal pi<span class="chordset">(D#)</span>ya

[Piya Re Part]
<span class="chordset">(Cm)</span>(<span class="chordset">F</span>)(<span class="chordset">Gm</span>)(<span class="chordset">D#</span>)
<span class="chordset">(Cm)</span>(<span class="chordset">F</span>)(<span class="chordset">Gm</span>)(<span class="chordset">D#</span>)
<span class="chordset">(A#)</span>(<span class="chordset">A#</span>)(<span class="chordset">D#</span>)(<span class="chordset">D#</span>)
<span class="chordset">(A#)</span>(<span class="chordset">A#</span>)(<span class="chordset">Gm</span>)(<span class="chordset">Cm</span>)

INSTRUMENTAL
<span class="chordset">(Cm)</span>(<span class="chordset">F</span>)(<span class="chordset">Gm</span>)(<span class="chordset">D#</span>)
<span class="chordset">(Cm)</span>(<span class="chordset">F</span>)(<span class="chordset">Gm</span>)(<span class="chordset">D#</span>)

[VERSE 2]
<span class="chordset">(A#)</span>Duniya ki nazron mein
<span class="chordset">(A#m)</span>ye rog hai
<span class="chordset">(A#)</span>Ho jinko <span class="chordset">(Gm)</span>vo jaane
<span class="chordset">(A#)</span>ye jog hai

<span class="chordset">(A#)</span>Ek tarfa shayad ho
<span class="chordset">(A#m)</span>dil ka bharam
<span class="chordset">(A#)</span>Do tarfa <span class="chordset">(Gm)</span>hai to ye
<span class="chordset">(A#)</span>sanjog hai

Laai re humein <span class="chordset">(Cm)</span>zindg
<span class="chordset">(F#)</span>ki kahani <span class="chordset">(Cm)</span>kaise mod <span class="chordset">(A#)</spa
Huye re khud <span class="chordset">(Gm)</span>se par
<span class="chordset">(F#)</span>Hum kisi se <span class="chordset">(Cm)</span>naata jod <span class="chordset">(A#)</spa

[CHORUS]
Hazaron mein ki<span class="chordset">(Gm)</span>si <span class="chordset">(D#)</span>ko
takdir <span class="chordset">(F#)</span>ai<span class="chordset">(A#)</span>si
Mili hai ek <span class="chordset">(Gm)</span>raan<span class="chordset">(D#)</span>Jha
aur heer <span class="chordset">(F#)</span>jai<span class="chordset">(A#)</span>si

Na jaane ye ja<span class="chordset">(D#)</span>maana,
kyun chaahe re mi<span class="chordset">(F#)</span>taana
Kalank na<span class="chordset">(Gm)</span>hi ishq <span class="chordset">(F#)</span>hai
kajal pi<span class="chordset">(A#)</span>ya
Kalank na<span class="chordset">(Gm)</span>hi ishq <span class="chordset">(F#)</span>hai
kajal pi<span class="chordset">(D#)</span>ya

[HOOK]
Me <span class="chordset">(Cm)</span>tera me… tera
me <span class="chordset">(F)</span>tera main
tera me <span class="chordset">(Gm)</span>tera
me <span class="chordset">(D#)</span>tera

Main <span class="chordset">(Cm)</span>gehra tamas,
tu su<span class="chordset">(F)</span>nehra saveraa
Main <span class="chordset">(Gm)</span>tera, ho main <span class="chordset">(D#)</span>tera

Mu<span class="chordset">(Cm)</span>safir main bhatka,
tu <span class="chordset">(F)</span>mera baseraa
Main <span class="chordset">(Gm)</span>tera, ho main <span class="chordset">(D#)</span>tera

Tu <span class="chordset">(Cm)</span>jugnu chamkta,
main <span class="chordset">(F)</span>jungle ghanera
Main <span class="chordset">(Gm)</span>tera....<span class="chordset">(D#)</span>

[OUTRO]
Ho, piya <span class="chordset">(Cm)</span>main <span class="chordset">(F)</span>tera,
main <span class="chordset">(Gm)</span>tera, main <span class="chordset">(D#)</span>tera
<span class="chordset">(Cm)</span>oo.. oo.. oo <span class="chordset">(F)</span>oh
Main <span class="chordset">(Gm)</span>tera, ho main <span class="chordset">(D#)</span>tera

<span class="chordset">(Cm)</span>oo.. oo.. oo <span class="chordset">(F)</span>oh
oh<span class="chordset">(Gm)</span>oo ho o… <span class="chordset">(D#)</span>o
<span class="chordset">(Cm)</span>oo.. oo.. oo <span class="chordset">(F)</span>oh
oh<span class="chordset">(Gm)</span>oo ho o… <span class="chordset">(D#)</span>o
Ooo<span class="chordset">(A#)</span>
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const uskahibanana = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Uska Hi Banana
Singer : Arijit Singh
Music : Chirantan
Lyrics: Junaid Wasi
Movie : 1920 Evil Returns</pre>
    <pre>
<span class="chordset">(Cm)</span>(<span class="chordset">Fm</span>)(<span class="chordset">G</span>)(<span class="chordset">G</span>)
<span class="chordset">(Cm)</span>(<span class="chordset">Fm</span>)(<span class="chordset">G</span>)(<span class="chordset">G</span>)

[Verse 1]
Meri <span class="chordset">(Cm)</span>Kismat Ke
Har Ek <span class="chordset">(Cm)</span>Panne Pe
Mere <span class="chordset">(Fm)</span>Jeete Ji
Baad <span class="chordset">(Fm)</span>Marne Ke

Mere <span class="chordset">(G)</span>Har Ek Kal
Har Ek <span class="chordset">(Cm)</span>Lamhein Mein
Tu <span class="chordset">(A#)</span>Likh De <span class="chordset">(G#)</span>Mera U<span class="chordset">(G)</span>

Har Ka<span class="chordset">(Cm)</span>hani Mein
Saare <span class="chordset">(Cm)</span>Kisson Mein
Dil Ki <span class="chordset">(Fm)</span>Duniya Ke
Sacche <span class="chordset">(Fm)</span>Rishton Mein

Zinda<span class="chordset">(G)</span>gaani Ke
Saare <span class="chordset">(Cm)</span>Hisson Mein
Tu <span class="chordset">(A#)</span>Likh De <span class="chordset">(G#)</span>Mera U<span class="chordset">(G)</span>

[Chorus]
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na

<span class="chordset">(Cm)</span>(<span class="chordset">G#</span>)(<span class="chordset">D#</span>)(<span class="chordset">A#</span>)
<span class="chordset">(Cm)</span>(<span class="chordset">G#</span>)(<span class="chordset">D#</span>)(<span class="chordset">A#</span>)

[Verse 2]
<span class="chordset">(Cm)</span>Uska Hoon Us
<span class="chordset">(Fm)</span>Main Hoon Usse Hoon
U<span class="chordset">(Gm)</span>si Ka Rehne <span class="chordset">(Cm)</span>De..

<span class="chordset">(Cm)</span>Main Toh Pyasa Hoon Hai
<span class="chordset">(Fm)</span>Dariya Wo Zariya Woh
<span class="chordset">(Gm)</span>Jeene Ka Me<span class="chordset">(Cm)</span>re

<span class="chordset">(Cm)</span>Mujhe Ghar De
Ga<span class="chordset">(Fm)</span>li De Shehar De
U<span class="chordset">(Gm)</span>si Ke Naam <span class="chordset">(Cm)</span>Ke

<span class="chordset">(Cm)</span>Kadam Yeh
Cha<span class="chordset">(Fm)</span>lein Ya Ruken Ab
U<span class="chordset">(Gm)</span>si Ke Vaas<span class="chordset">(Cm)</span>te

Dil <span class="chordset">(A#)</span>Mujhe De A<span class="chordset">(G#)</span>gar
Dard <span class="chordset">(Gm)</span>De Uska <span class="chordset">(Cm)</span>Par<span class="chordset">(A#)</span>
Uski <span class="chordset">(Gm)</span>Ho Woh Ha<span class="chordset">(G#)</span>si
Gunje <span class="chordset">(A#)</span>Jo Mera <span class="chordset">(G)</span>Ghar

[Chorus]
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na

<span class="chordset">(Cm)</span>(<span class="chordset">G#</span>)(<span class="chordset">D#</span>)(<span class="chordset">A#</span>)
<span class="chordset">(Cm)</span>(<span class="chordset">G#</span>)(<span class="chordset">D#</span>)(<span class="chordset">A#</span>)

[Verse 3]
<span class="chordset">(Cm)</span>Mere Hisse Ki
Khu<span class="chordset">(Fm)</span>shi Ko Hashi Ko Tu
<span class="chordset">(Gm)</span>Chaahe Aadha <span class="chordset">(Cm)</span>Kar

<span class="chordset">(Cm)</span>Chahe Lele Tu
Me<span class="chordset">(Fm)</span>ri Zindagi Par
Ye <span class="chordset">(Gm)</span>Mujh Se Vaada <span class="chordset">(Cm)</span>Kar

<span class="chordset">(Cm)</span>Uske Ashkon Pe
Gu<span class="chordset">(Fm)</span>mon Pe Dukhon Pe
Har <span class="chordset">(Gm)</span>Uske Zakhm <span class="chordset">(Cm)</span

Haq Mera Hi
Ra<span class="chordset">(Fm)</span>he Har Jagah
Har Gha<span class="chordset">(Gm)</span>di Haan Umar <span class="chordset">(Cm)</span>Bhar

Ab Fa<span class="chordset">(A#)</span>kht Ho Ye<span class="chordset">(G#)</span>hi
Woh Ra<span class="chordset">(Gm)</span>he Mujh Mein <span class="chordset">(Cm)</span>Hi<span class="chordset">(A#)</span>
Woh Ju<span class="chordset">(Gm)</span>da Kehne <span class="chordset">(G#)</span>Ko
Bichjde <span class="chordset">(A#)</span>Na Par Ka<span class="chordset">(G)</span>hi

[Chorus]
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Jab Ba<span class="chordset">(G#)</span>na Uska Hi Ba<span class="chordset">(G)</span>na

[Verse 4]
Meri <span class="chordset">(Cm)</span>Kismat Ke
Har Ek <span class="chordset">(Cm)</span>Panne Pe
Mere <span class="chordset">(Fm)</span>Jeete Ji
Baad <span class="chordset">(Fm)</span>Marne Ke

Mere <span class="chordset">(G)</span>Har Ek Kal
Har Ek <span class="chordset">(Cm)</span>Lamhein Mein
Tu <span class="chordset">(A#)</span>Likh De <span class="chordset">(G#)</span>Mera U<span class="chordset">(G)</span>

[Outro]
<span class="chordset">(Cm)</span>(<span class="chordset">Cm</span>)(<span class="chordset">Fm</span>)(<span class="chordset">Fm</span>)
(<span class="chordset">G</span>)(<span class="chordset">Cm</span>)(<span class="chordset">A#</span>)(<span class="chordset">G#</span>)(<span class="chordset">G</span>)
Aye Khu<span class="chordset">(Cm)</span>da Aye Khu<span class="chordset">(A#)</span>da
Aye Khu<span class="chordset">(A#)</span>da Aye Khu<span class="chordset">(G#)</span>da

(<span class="chordset">G#m</span>)(<span class="chordset">G</span>)(<span class="chordset">Cm</span>)(<span class="chordset">A#</span>)(<span class="chordset">G#</span>)
(<span class="chordset">G</span>)(<span class="chordset">Cm</span>)
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const lakhduniyakahe = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song :Lakh Duniya Kahe
Singer :Ram Sampath
Music :Ram Sampath
Lyrics:Javed Akhtar
Movie :Talaash</pre>
    <pre>
[Chorus]
<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

Meri <span class="chordset">(A)</span>har soch me
Meri <span class="chordset">(F#m)</span>har baat me
Mere <span class="chordset">(D)</span>ehsas me
Mere <span class="chordset">(E)</span>jazbat <span class="chordset">(A)</span>me

Tum hi <span class="chordset">(B)</span>tum ho
Tum har ka<span class="chordset">(E)</span>hin ho

<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

<span class="chordset">(A)...(E)...(D)...(E)</span>

Tumne <span class="chordset">(F#m)</span>choda hai,
<span class="chordset">(E)</span>Kab saath <span class="chordset">(A)</span>mera.
Thaame <span class="chordset">(D)</span>ho aaj <span class="chordset">(E)</span>bhi
Haath <span class="chordset">(A)</span>mera

Koi <span class="chordset">(Bm)</span>manzil ko<span class="chordset">(E)</span>i
reh gu<span class="chordset">(A)</span>zar ho.
Aaj <span class="chordset">(D)</span>bhi tum me<span class="chordset">(E)</span>re
hum<span class="chordset">(A)</span>safar ho
Jaun <span class="chordset">(B)</span>chahe Jahan
tum wa<span class="chordset">(E)</span>hin ho...

<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

<span class="chordset">(A)</span>Lakh duniya ka<span class="chordset">(E)</span>he
Tum na<span class="chordset">(F#m)</span>hi ho<span class="chordset">(A)</span>
Tum ya<span class="chordset">(D)</span>hin <span class="chordset">(E)</span>ho
Tum ya<span class="chordset">(A)</span>hin ho

The rest of the song
is played in the same pattern...
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const terideewani = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Teri Deewani 
Singer: Kailash Kher
Music : Kailash, Paresh, Naresh
Lyrics: Kailash, Paresh, Naresh
Movie: Album</pre>
    <pre>
<span class="chordset">(Em)</span>Preet ki lat mohe aisi laagi
<span class="chordset">(C)</span>Ho gayi main mat<span class="chordset">(Em)</span>waari
<span class="chordset">(D)</span>Bal bal jaau apne piya ko
Hey main <span class="chordset">(C)</span>jaau waari <span class="chordset">(Em)</span>waari

<span class="chordset">(D)</span>Mohe <span class="chordset">(D)</span>sudh budh nahi rahi tan mann ki
<span class="chordset">(C)</span>Ye toh <span class="chordset">(Em)</span>jaane duniya saari
<span class="chordset">(C)</span>Be<span class="chordset">(D)</span>bas aur laa<span class="chordset">(D)</span>chaar phiru main
<span class="chordset">(D)</span>Haari main dil <span class="chordset">(Em)</span>haari
<span class="chordset">(D)</span>Haari main dil <span class="chordset">(Em)</span>haari

<span class="chordset">(D)</span>Tere naam se jee loon
<span class="chordset">(C)</span>Tere naam se mar jaau <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Tere naam se jee loon
<span class="chordset">(C)</span>Tere naam se mar jaau
<span class="chordset">(D)</span>Teri jaan ke sadke main
<span class="chordset">(C)</span>Kuch aisa kar<span class="chordset">(Em)</span>jaau

<span class="chordset">(Em)</span>Tune kya <span class="chordset">(D)</span>kar daala
<span class="chordset">(C)</span>Mar gayi main <span class="chordset">(Bm)</span>mit gayi main
<span class="chordset">(Am)</span>Ho ji <span class="chordset">(G)</span>haan ji
<span class="chordset">(D)</span>ho gayi main <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani
<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani

<span class="chordset">(Em)</span>Tune kya <span class="chordset">(D)</span>kar daala
<span class="chordset">(C)</span>Mar gayi main <span class="chordset">(Bm)</span>mit gayi main
<span class="chordset">(Am)</span>Ho ji <span class="chordset">(G)</span>haan ji
<span class="chordset">(D)</span>ho gayi main <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani
<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani

<span class="chordset">(Em)</span>Ishq junoon jab had se
<span class="chordset">(C)</span>badh jaye<span class="chordset">(D)</span>
<span class="chordset">(Em)</span>Ishq junoon jab had se
<span class="chordset">(C)</span>badh jaye<span class="chordset">(D)</span>
<span class="chordset">(Em)</span>Haste haste aashiq
<span class="chordset">(C)</span>sooli chadh <span class="chordset">(Em)</span>jaye

<span class="chordset">(Em)</span>Ishq ka jadoo
<span class="chordset">(C)</span>sar chadh<span class="chordset">(D)</span>kar bole
<span class="chordset">(Em)</span>Ishq ka jadoo
<span class="chordset">(C)</span>sar chadh<span class="chordset">(D)</span>kar bole
<span class="chordset">(Em)</span>Khoob lagalo pehre
<span class="chordset">(C)</span>raste rab <span class="chordset">(Em)</span>khole

<span class="chordset">(D)</span>Yahi ishq di marzi hai
<span class="chordset">(C)</span>Yahi rab di marzi hai <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Yahi ishq di marzi hai
<span class="chordset">(C)</span>Yahi rab di marzi hai
<span class="chordset">(D)</span>Tere bin jina kaisa
<span class="chordset">(C)</span>Kya Kudgarzi Hai

<span class="chordset">(Em)</span>Tune kya <span class="chordset">(D)</span>kar daala
<span class="chordset">(C)</span>Mar gayi main <span class="chordset">(Bm)</span>mit gayi main
<span class="chordset">(Am)</span>Ho ji <span class="chordset">(G)</span>haan ji
<span class="chordset">(D)</span>ho gayi main <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani
<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani

<span class="chordset">(D)</span>(D)
<span class="chordset">(Em)</span>(Em)
<span class="chordset">(D)</span>(D)
<span class="chordset">(Em)</span>(Em)

<span class="chordset">(Em)</span>Aye main <span class="chordset">(Em)</span>rang rangeeli
<span class="chordset">(C)</span>deewa<span class="chordset">(D)</span>ni
<span class="chordset">(Em)</span>Aye main <span class="chordset">(Em)</span>rang rangeeli
<span class="chordset">(C)</span>deewa<span class="chordset">(D)</span>ni
<span class="chordset">(Em)</span>Aye main <span class="chordset">(Em)</span>albeli, main
<span class="chordset">(C)</span>mastaa<span class="chordset">(D)</span>ni

<span class="chordset">(D)</span>Gau ba<span class="chordset">(C)</span>jaau
<span class="chordset">(Em)</span> sabko rijhau
<span class="chordset">(Em)</span>Aye main <span class="chordset">(Em)</span>din dharam se
<span class="chordset">(C)</span>begaani<span class="chordset">(D)</span>
<span class="chordset">(Em)</span>Aye main <span class="chordset">(Em)</span>deewani main
<span class="chordset">(C)</span>deewani

<span class="chordset">(D)</span>Tere naam se jee loon
<span class="chordset">(C)</span>Tere naam se mar jaau <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Tere naam se jee loon
<span class="chordset">(C)</span>Tere naam se mar jaau
<span class="chordset">(D)</span>Teri jaan ke sadke main
<span class="chordset">(C)</span>Kuch aisa kar<span class="chordset">(Em)</span>jaau

<span class="chordset">(Em)</span>Tune kya <span class="chordset">(D)</span>kar daala
<span class="chordset">(C)</span>Mar gayi main <span class="chordset">(Bm)</span>mit gayi main
<span class="chordset">(Am)</span>Ho ji <span class="chordset">(G)</span>haan ji
<span class="chordset">(D)</span>ho gayi main <span class="chordset">(Em)</span>

<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani
<span class="chordset">(D)</span>Teri <span class="chordset">(C)</span>deewani <span class="chordset">(Em)</span>deewani
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const beintehaan = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song :Be Intehaan
Singer : Atif Aslam & Sunidhi Chauhan
Music : Pritam
Lyrics: Mayur Puri 
Movie : Race 2</pre>
    <pre>
[Intro]
<span class="chordset">(Em)</span>Suno na kahe kya suno na
Dil mera <span class="chordset">(C)</span>suno na
Suno za<span class="chordset">(D)</span>ra
Teri <span class="chordset">(C)</span>baahon <span class="chordset">(D)</span>me
Mujhe <span class="chordset">(Em)</span>rehna hai <span class="chordset">(G)</span>raat bhar
Teri <span class="chordset">(C)</span>baahon <span class="chordset">(D)</span>me hogi su<span class="chordset">(Am)</span>bah

[Chorus]
Be inte<span class="chordset">(G)</span>haan be inte<span class="chordset">(Em)</span>haan
Yun pyaar <span class="chordset">(C)</span>kar be inte<span class="chordset">(D)</span>haan
Dekha ka<span class="chordset">(G)</span>run saari u<span class="chordset">(Em)</span>mar
Tere ni<span class="chordset">(C)</span>shaan be inte<span class="chordset">(D)</span>haan

Koi ka<span class="chordset">(C)</span>sar naa ra<span class="chordset">(D)</span>he
Meri kha<span class="chordset">(C)</span>bar naa rahe
Chhu le mu<span class="chordset">(Em)</span>jhe is ka<span class="chordset">(D)</span>dar
Be inte<span class="chordset">(C)</span>haan

[Verse 2]
Jab <span class="chordset">(Em)</span>saanson me teri
Saansen ghuli toh
<span class="chordset">(Am)</span>Phir sulagne la<span class="chordset">(Em)</span>ge
Eh<span class="chordset">(C)</span>saas mere <span class="chordset">(D)</span>mujhse kehne la<span class="chordset">(G)</span>ge

Haa <span class="chordset">(Em)</span>baahon me teri
aake jahaan do
<span class="chordset">(Am)</span>Yun simatne la<span class="chordset">(Em)</span>ge
Sai<span class="chordset">(C)</span>laab jaise <span class="chordset">(D)</span>koi behne la<span class="chordset">(G)</span>ge

[Bridge]
Khoya hoon <span class="chordset">(C)</span>main aagosh <span class="chordset">(D)</span>mein
Tu bhi <span class="chordset">(C)</span>kahaan ab hosh <span class="chordset">(D)</span>mein
Makh<span class="chordset">(C)</span>mali raat <span class="chordset">(D)</span>ki ho naa su<span class="chordset">(Am)</span>bah

[Chorus]
Be inte<span class="chordset">(G)</span>haan be inte<span class="chordset">(Em)</span>haan
Yun pyaar <span class="chordset">(C)</span>kar be inte<span class="chordset">(D)</span>haan

[Bridge]
Gustakhi<span class="chordset">(Em)</span>yan kuch tum karo
Kuch hum ka<span class="chordset">(Am)</span>re iss ta<span class="chordset">(D)</span>rah
Sharrma ke <span class="chordset">(G)</span>do saaye hain <span class="chordset">(Am)</span>jo
Muh pher <span class="chordset">(D)</span>le hum se ya<span class="chordset">(Am)</span]haan

[Verse 3]
Haan <span class="chordset">(Em)</span>chhu toh liya
hai ye jism tune
<span class="chordset">(Am)</span>Rooh bhi choom <span class="chordset">(Em)</span>le
Al<span class="chordset">(C)</span>faaz bhige
<span class="chordset">(D)</span>bhige kyun hai me<span class="chordset">(G)</span>re

Haan <span class="chordset">(Em)</span>yun choor ho ke majboor ho ke
<span class="chordset">(Am)</span>Qatra qatra ka<span class="chordset">(Em)</span>he
Eh<span class="chordset">(C)</span>saas bheege
<span class="chordset">(D)</span>bheege kyun hain me<span class="chordset">(G)</span>re

[Bridge]
Do bekha<span class="chordset">(C)</span>bar bheege ba<span class="chordset">(D)</span>dan
Ho besa<span class="chordset">(C)</span>bar bheege ba<span class="chordset">(D)</span>dan
Le ra<span class="chordset">(C)</span>he raat <span class="chordset">(D)</span>bhar angdai<span class="chordset">(Am)</span>yaan

[Chorus]
Be inte<span class="chordset">(G)</span>haan be inte<span class="chordset">(Em)</span>haan
Yun pyaar <span class="chordset">(C)</span>kar be inte<span class="chordset">(D)</span>haan
Dekha ka<span class="chordset">(G)</span>run saari u<span class="chordset">(Em)</span>mar
Tere ni<span class="chordset">(C)</span>shaan be inte<span class="chordset">(D)</span>haan

[Outro]
Koi ka<span class="chordset">(C)</span>sar naa ra<span class="chordset">(D)</span>he
Meri kha<span class="chordset">(C)</span>bar naa rahe
Chhu le mu<span class="chordset">(Em)</span>jhe is ka<span class="chordset">(D)</span>dar
Be inte<span class="chordset">(C)</span>haan
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const sunonasangemarmar = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Suno Na Sangemarmar 
Singer: Arijit Singh
Music : Jeet Ganguly
Lyrics: Kausar Munir
Movie: Youngistaan</pre>
    <pre>
[Chorus]
<span class="chordset">(Cm)</span>Suno na sange<span class="chordset">(A#)</span>marmar
<span class="chordset">(G#)</span>Ki yeh mi<span class="chordset">(Cm)</span>naare
<span class="chordset">(Cm)</span>Kuch bhi na<span class="chordset">(A#)</span>hi hai
<span class="chordset">(G#)</span>Aage tum<span class="chordset">(Cm)</span>haare

<span class="chordset">(Cm)</span>Aaj se <span class="chordset">(A#)</span>dil pe mere
<span class="chordset">(G#)</span>Raaj tum<span class="chordset">(D#)</span>haara
<span class="chordset">(G)</span>Taj tum<span class="chordset">(D#)</span>hara

<span class="chordset">(Cm)</span>Suno na sange<span class="chordset">(A#)</span>marmar
<span class="chordset">(G#)</span>Ki yeh mi<span class="chordset">(Cm)</span>naare

[Verse 1]
Bin tere <span class="chordset">(D#)</span>maddham maddham
<span class="chordset">(A#)</span>Bhi chal ra<span class="chordset">(D#)</span>hi thi dhadkan
<span class="chordset">(F)</span>Jab se mi<span class="chordset">(A#)</span>le tum humein
<span class="chordset">(F)</span>Aanchal se <span class="chordset">(A#)</span>tere bandhe
<span class="chordset">(G)</span>Dil ud ra<span class="chordset">(D#)</span>ha hai

[Chorus]
<span class="chordset">(Cm)</span>Suno na aas<span class="chordset">(A#)</span>maano
<span class="chordset">(G#)</span>ke yeh si<span class="chordset">(Cm)</span>tare
<span class="chordset">(Cm)</span>Kuch bhi na<span class="chordset">(A#)</span>hi hai
<span class="chordset">(G#)</span>Aage tum<span class="chordset">(Cm)</span>hare

[Verse 2]
Yeh dekho <span class="chordset">(D#)</span>sapne mere
<span class="chordset">(A#)</span>Neendon se <span class="chordset">(D#)</span>hoke tere
<span class="chordset">(F)</span>Raaton se <span class="chordset">(A#)</span>kehte hain lo
<span class="chordset">(F)</span>Hum toh sa<span class="chordset">(A#)</span>vere hai wo
<span class="chordset">(G)</span>Sach gaye jo<span class="chordset">(D#)</span>

[Outro]
<span class="chordset">(Cm)</span>Suno na do ja<span class="chordset">(A#)</span>hano
<span class="chordset">(G#)</span>Ke yeh na<span class="chordset">(Cm)</span>zare
<span class="chordset">(Cm)</span>Kuch bhi na<span class="chordset">(A#)</span>hi hai
<span class="chordset">(G#)</span>Aage tum<span class="chordset">(Cm)</span>hare

<span class="chordset">(Cm)</span>Aaj se <span class="chordset">(A#)</span>dil pe mere
<span class="chordset">(G#)</span>Raaj tum<span class="chordset">(Cm)</span>haara
<span class="chordset">(G)</span>Taj tum<span class="chordset">(D#)</span>hara
<span class="chordset">(Cm)</span>Suno na sange<span class="chordset">(A#)</span>marmar
<span class="chordset">(G#)</span>Ki yeh mi<span class="chordset">(Cm)</span>naare
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const basekbaar = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song: Bas Ek Baar 
Singer: Soham Naik
Music : Anurag Saikia
Lyrics: Kunaal Vermaa
Movie: Solo Album</pre>
    <pre>
[Verse 1]
<span class="chordset">(C)</span>Meri nazron ko tune
<span class="chordset">(Dm)</span>sapna dikhaya
<span class="chordset">(F)</span>Ja<span class="chordset">(G)</span>gaya mu<span class="chordset">(C)</span>jhe raaton
<span class="chordset">(C)</span>mein

<span class="chordset">(C)</span>Dabi dabi saanson mein
<span class="chordset">(Dm)</span>khushboo le aaya
<span class="chordset">(F)</span>Ka<span class="chordset">(G)</span>bhi jo naa <span class="chordset">(C)</span>thi raahon
<span class="chordset">(C)</span>mein

[Pre-Chorus]
<span class="chordset">(F)</span>Aisa mera <span class="chordset">(C)</span>dil kabhi na tha
<span class="chordset">(Dm)</span>Jai<span class="chordset">(F)</span>sa yeh ho gaya
<span class="chordset">(Dm)</span>Ka<span class="chordset">(F)</span>ramaat teri hai yeh

[Chorus]
<span class="chordset">(C)</span>Bas <span class="chordset">(Dm)</span>ek baar tumko
<span class="chordset">(F)</span>dekhne ko tarsun
<span class="chordset">(G)</span>Maano na <span class="chordset">(C)</span>kehna me

Main toh bas<span class="chordset">(C)</span>ek baar tumko
<span class="chordset">(Dm)</span>dekhne ko tarsun
<span class="chordset">(F)</span>Kehta hai <span class="chordset">(G)</span>dil yeh <span class="chordset">(C)</span>mera

[Instrumental]
<span class="chordset">(Am)</span>(Em)<span class="chordset">(F)</span>
<span class="chordset">(Am)</span>(Em)<span class="chordset">(F)</span>

[Verse 2]
<span class="chordset">(C)</span>Aate aate <span class="chordset">(Am)</span>tum le aana
<span class="chordset">(Dm)</span>Be <span class="chordset">(G)</span>mausam ki
kuch baarishein yahaan<br>

<span class="chordset">(C)</span>Aadhe aadhe <span class="chordset">(Am)</span>bheege dono
hon <span class="chordset">(Dm)</span>Phir apni
kuch <span class="chordset">(G)</span>khwahishein riha

[Pre-Chorus]
<span class="chordset">(F)</span>Aisa mera <span class="chordset">(C)</span>dil kabhi na tha
<span class="chordset">(Dm)</span>Hai<span class="chordset">(F)</span>raan bewajah
<span class="chordset">(Dm)</span>Saugaat teri hai yeh<br>

[Chorus]
<span class="chordset">(C)</span>Bas <span class="chordset">(Dm)</span>ek baar tumko
<span class="chordset">(F)</span>dekhne ko tarsun
<span class="chordset">(G)</span>Kehta hai <span class="chordset">(C)</span>dil yeh mera

Haan bas<span class="chordset">(C)</span>ek baar tumko
<span class="chordset">(Dm)</span>dekhne ko tarsun
<span class="chordset">(F)</span>Kehta hai <span class="chordset">(G)</span>dil yeh <span class="chordset">(C)</span>mera

[Instrumental
<span class="chordset">(C)</span>(Em)<span class="chordset">(F)</span>(G)

[Bridge]
<span class="chordset">(C)</span>Baithe baithe <span class="chordset">(Am)</span>soche tumko
Do <span class="chordset">(Dm)</span>ankhein hi
<span class="chordset">(G)</span>bun<span class="chordset">(C)</span>ti kahaniyaan

<span class="chordset">(C)</span>Hanste hanste <span class="chordset">(Am)</span>baatein karte
Ik <span class="chordset">(Dm)</span>dooje se
<span class="chordset">(G)</span>khwaa<span class="chordset">(C)</span>bon ke darmiyaan

[Pre-Chorus]
<span class="chordset">(F)</span>Aisa mera <span class="chordset">(C)</span>dil kabhi na tha
<span class="chordset">(Dm)</span>Is <span class="chordset">(F)</span>baar ho gaya
<span class="chordset">(Dm)</span>Khu<span class="chordset">(F)</span>rafat teri hai yeh

[Chorus]
<span class="chordset">(C)</span>Bas <span class="chordset">(Dm)</span>ek baar tumko
<span class="chordset">(F)</span>dekhne ko tarsun
<span class="chordset">(G)</span>Kehta hai <span class="chordset">(C)</span>dil yeh mera

Haan bas <span class="chordset">(C)</span>ek baar tumko
<span class="chordset">(Dm)</span>dekhne ko tarsun
<span class="chordset">(F)</span>Maano na <span class="chordset">(G)</span>kehna me

[Outro]
Main toh bas<span class="chordset">(C)</span>ek baar tumko
<span class="chordset">(Dm)</span>dekhne ko tarsun
<span class="chordset">(F)</span>Kehta hai <span class="chordset">(G)</span>dil yeh <span class="chordset">(C)</span>
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;
  const piyaorepiya = `<div class="chord-main">
    <div class="baarish" id="chord-lyrics">
    <pre class="song-details-pre">
Song : Piya O Re Piya
Singer : Atif Aslam & Shreya Ghoshal
Music : Sachin Jigar
Lyrics: Priya Panchal 
Movie : Tere Naal Love Ho Gaya</pre>
    <pre>
Main<span class="chordset">(D)</span>vaari jawan
Mai <span class="chordset">(D)</span>vaari jawan
<span class="chordset">(Bm)</span>Saantho ki hoya ve ka<span class="chordset">(A)</span>soor re

Main <span class="chordset">(D)</span>vaari jawan
Main <span class="chordset">(D)</span>vaari jawan
<span class="chordset">(Bm)</span>Dil toh hoya maj<span class="chordset">(A)</span>boor

Main <span class="chordset">(D)</span>vaari jawan
Main <span class="chordset">(D)</span>vaari jawan

<span class="chordset">(D)</span>Chhu liya tune
<span class="chordset">(Bm)</span>Labh se aankhon ko
<span class="chordset">(D)</span>Mannatein puri tum se <span class="chordset">(A)</span>hi

<span class="chordset">(D)</span>Tu mile jahan
<span class="chordset">(Bm)</span>Mera jahan hai wahan
<span class="chordset">(D)</span>Raunakein saari tum se <span class="chordset">(D)</span>hi<span class="chordset">(A)</span><span class="chordset">(G)</span>

Hoo <span class="chordset">(D)</span>chhu liya tune
<span class="chordset">(Bm)</span>Labh se aankhon ko
<span class="chordset">(D)</span>Mannatein puri tum se <span class="chordset">(A)</span>hi

<span class="chordset">(D)</span>Tu mile jahan
<span class="chordset">(Bm)</span>Mera jahan hai wahan
<span class="chordset">(D)</span>Raunakein saari tum se <span class="chordset">(A)</span>hi

Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(A)</span>ya re pi<span class="chordset">(D)</span>ya
Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(F#)</span>ya re pi<span class="chordset">(D)</span>ya

<span class="chordset">(Bm)</span>In dooriyon ne
<span class="chordset">(G)</span>Nazdikeinyon se
<span class="chordset">(A)</span>Sauda koyi kar li<span class="chordset">(D)</span>ya<br>

Hoo<span class="chordset">(Bm)</span>jhukke nigahon ne
<span class="chordset">(G)</span>Dil se ishq ka
<span class="chordset">(A)</span>Waada koyi kar li<span class="chordset">(D)</span>ya

Main <span class="chordset">(D)</span>vaari jawan
Main <span class="chordset">(D)</span>vaari jawan
<span class="chordset">(G)</span>Saantho ki hoya ve ka<span class="chordset">(A)</span>soor re

<span class="chordset">(D)</span>Sau sau taaron se
Bhar <span class="chordset">(Bm)</span>ke yeh daaman
<span class="chordset">(D)</span>Le chal mukhe kahin <span class="chordset">(A)</span>door

Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(F#)</span>ya re pi<span class="chordset">(D)</span>ya
Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(F#)</span>ya re pi<span class="chordset">(D)</span>ya

<span class="chordset">(D)</span>Koyi kami si thi <span class="chordset">(Bm)</span>jeene mein
<span class="chordset">(C)</span>Jana yeh humne ka<span class="chordset">(D)</span>han
<span class="chordset">(D)</span>Aise mile ho <span class="chordset">(Bm)</span>jaise humpe
<span class="chordset">(F#)</span>Ho mehere<span class="chordset">(F)</span>ban<span class="chordset">(G)</span> yeh khu<span class="chordset">(D)</span>da

Ho Main <span class="chordset">(D)</span>vaari jawan
Main<span class="chordset">(D)</span>vaari jawan
<span class="chordset">(Bm)</span>Saantho ki hoya ve ka<span class="chordset">(A)</span>soor re

Rab <span class="chordset">(D)</span>di marzi hai ap<span class="chordset">(Bm)</span>na yeh milna
<span class="chordset">(G)</span>Barsa hai humpe uska <span class="chordset">(A)</span>noor

Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(F#)</span>ya re pi<span class="chordset">(D)</span>ya
Pi<span class="chordset">(D)</span>ya o're pi<span class="chordset">(G)</span>ya
Pi<span class="chordset">(Bm)</span>ya re pi<span class="chordset">(F#)</span>ya re pi<span class="chordset">(D)</span>ya
</pre>

    </div>
    <div class="chord-func">
  
    <div class="chord-btn">
      <span id="transpose-txt">SCALE TRANSPOSE</span>
      <button id="transposeDown">-1</button>
      <button id="transposeUp">+1</button>
      <button class="reset-btn" id="reset-scale">RESET</button>
    </div>
   
    <p class="transpose-note">Note: Use the scale transpose buttons to adjust the song's scale to your vocal range. "-" lowers the scale, "+" raises it. This changes all chords on the sheet. Click "RESET" to return to the original scale.</p>
    <div class="capo-container" id="capo">
      <div class="capo-h2">
        <h2>FIND BEST CAPO POSITION</h2>
      </div>
      <button id="findBestCapo">Find Best Capo Position</button>
      <div id="result"></div>
    </div>

    <div id="controls">
  <button id="autoscrollBtn">AUTOSCROLL</button>
  <button id="decreaseSpeed">-</button>
  <span id="speedIndicator">1.0x</span>
  <button id="increaseSpeed">+</button>
  <button id="resetBtn">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="15"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
  </button>
</div>

    <div class="menu-overlay">
    <div class="menu-options">
            <button class="option-button" onclick="MSTREAMAPI.logout();">Home</button>
      <button class="option-button" onclick="changeView(loadinstruction, this)">Reference Videos</button>
      
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a class="tab-item" id="transpose-1" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="exposure-neg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"></path></svg>
      <span>Transpose</span>
    </a>
<a class="tab-item" id="transpose+1">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"></path>
      </svg>
      <span>Transpose</span>
    </a>
    <button class="menu-button">
      <i class="fas fa-chevron-up"></i>
    </button>
    <a class="tab-item" id="findNewBestCapo">
      <svg version="1.1" viewBox="0 0 800 800" width="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path transform="translate(52,82)" d="m0 0h7l5 3 3 5v23l2 20 7 28 17 50 15 42 4-2 7-3 5 1 7 10 9 15 32 52 13 21 14 23 13 21 48 78 9 14 2 1v-7l5-10 7-7 13-7 9-2h16l8 1 6-13 3-13v-11l-3-15-6-19 1-7 4-4 17-6 10-6 8-7 6-9 4-13-1-17v-28l3-32 4-23 6-20 7-16 16-27 13-19 11-15 11-14 11-13 6-7 9-6 6-2h14l10 3 9 6 7 8 4 10 1 6v14l-3 14-4 9-6 10-7 8-7 5-5 2h-11l-10-5-5-5v-6l5-5 5 2 5 5 2 1h6l6-4 7-8 7-14 1-5v-14l-4-11-4-5-9-3-11 1-8 4-6 5-10 14-9 14-9 16-9 19-6 16-5 21-1 6v32l5 30 7 24 10 25-2 6-8 7-3 6 1 9 4 9 4 6 7 6 13 8 4 5 7 19 8 9 10 3h10l10-2 5 3 8 10 12 16 22 28 13 16 18 22 13 15 9 10 7 8 12 13 23 23 22 18 10 9 8 7 12 11 11 9 11 10 14 11 11 10 7 10 3 6v8l-7 11-6 5-7-1-9-8-4 2-7 8-6-4-7-7-11-9-14-12-14-11-15-12-40-30-36-26-23-16-32-22-43-29-20-13-32-21-22-14-12-8-3-1-15 44-17 45-11 26-6 12-2 3 17 4 33 8 5 1 2-5 4-4 20 4 58 15 64 16 27 7 6 3 2 2-1 15-5 31-4 6-5 1-30-7-139-31-5-2-2-3v-7l1-5h-2l-3 9-4 2-8-6-10-8-13-8-12-5-31-8-26-8-20-8-19-10-13-10-9-9-10-16-12-25-15-36-16-41-17-46-15-41-10-29-17-48-15-43-17-48-19-56-8-28-3-16v-22l3-8 4-5zm65 198m1 1 3 11 33 90 17 46 13 35 10 28 16 47 11 26 5 8 7 4 11 4 11 3h5l-2-9v-19l4-15 8-16 1-5-10-16-11-17-12-19-14-22-12-19-15-23-15-24-11-17-12-19-16-25-14-22-10-15zm197 185-12 3-9 5-6 7-3 11v10l5-4 7-8 1-3h2l7-8 9-10 1-3z"/>
<path transform="translate(383,664)" d="m0 0h1v5l-2-2z"/>
<path transform="translate(384,663)" d="m0 0"/>
<path transform="translate(124,292)" d="m0 0"/>
<path transform="translate(123,291)" d="m0 0"/>
<path transform="translate(121,287)" d="m0 0"/>
</svg>
      <span>Best Capo</span>
    </a>
    <a class="tab-item" id="reset-scale-new">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-width="2"
          d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
        </path>
      </svg>
      <span>Reset</span>
    </a>
  </nav>
  </div>
  </div>`;


  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";
  document.getElementById("newcontent").style.flexBasis = "inherit";
  document.getElementById("newcontent").scrollTop = 0;
  document.getElementById("newcontent").style.overflowY = "scroll";
  document.getElementById("content").style.display = "none";

  // Function to update content and URL
  function updateContentBaarishGuitar(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/baarish";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function KaisiPaheliZindagani(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/kaisi-paheli-zindagani";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }

  function MainKoiAisaGeet(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/main-koi-aisa-geet-gaoon";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Khamoshiyaan(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/khamoshiyan";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Dhadak(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/dhadak";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Darkhaast(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/darkhaast";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Raaz(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/raaz-aankhei-teri";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function SapnonRani(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/meri-sapnon-ki-rani";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function ChahunMain(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/chahun-main-ya-naa";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function YehFitoor(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/yeh-fitoor-mera";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function TuJohMila(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/tu-joh-mila";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function AbhiMujh(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/abhi-mujh-mein-kahin";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Hamari(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/hamari-adhuri-kahani";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Jism(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/yeh-jism";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function AjibDastan(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/ajib-dastan";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function IkkKudi(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/ikk-kudi";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function PyarHain(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/kya-mujhe-pyar-hain";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function ZehnaSeeb(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/zehnaseeb";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Shab(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/tu-hi-meri-shab-hai";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function MereYaara(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/mere-yaaraa";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function BeeteLamhe(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/beete-lamhe";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Ijazat(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/ijazat";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Gujarish(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/guzarish";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function PaniDaRang(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/panidarang";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Humnava(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/humnava";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Subhanallah(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/subhanallah";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Banjara(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/banjaara";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Tiktikvajate(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/tiktikvajate";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Jeevrangla(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/jeevrangla";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Kakaan(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/kakaan";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Jyeinkyu(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/jyeinkyu";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Hawayein(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/hawayein";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Terahonelaga(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/terahonelaga";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Jashnebahara(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/jashnebahara";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Qaafirana(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/qaafirana";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Tumsehi(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/tumsehi";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Aajaomeritamanna(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/aajaomeritamanna";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Indino(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/indino";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Agartumsath(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/agartumsath";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Merebina(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/merebina";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Lomaanliya(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/lomaanliya";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Ennasona(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/ennasona";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Tujaanena(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/tujaanena";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Jeelezaraa(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/jeelezaraa";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Kyahuwaterawada(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/kyahuwaterawada";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Kalank(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/kalank";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Uskahibanana(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/uskahibanana";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Lakhduniyakahe(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/lakhduniyakahe";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Terideewani(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/terideewani";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Beintehaan(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/beintehaan";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Sunonasangemarmar(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/sunonasangemarmar";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Basekbaar(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/basekbaar";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  function Piyaorepiya(chord) {
    document.getElementById("newcontent").innerHTML = chord;

    const newUrl = window.location.origin + "/piyaorepiya";
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  // function updateContentBaarishPiano(chord) {
  //   document.getElementById("newcontent").innerHTML = chord;

  //   const newUrl = window.location.origin + "/baarish-piano";
  //   window.history.pushState({ path: newUrl }, "", newUrl);
  // }

  // Check URL on page load
  // document.addEventListener("DOMContentLoaded", function () {
  //   if (window.location.pathname === "/baarish/guitar") {
  //     fetch("/api/baarish-chord")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const newContentElement = document.getElementById("newcontent");
  //         if (newContentElement) {
  //           newContentElement.innerHTML = data.chord;
  //         } else {
  //           console.error("Element with id 'newcontent' not found");
  //         }
  //       })
  //       .catch((error) => console.error("Error:", error));
  //   }
  // });

  if (element == "one") {
    updateContentBaarishGuitar(chord);
  } else if (element == "two") {
    KaisiPaheliZindagani(parineeta);
  } else if (element == "three") {
    MainKoiAisaGeet(yess_boss);
  } else if (element == "four") {
    Khamoshiyaan(khamoshiyaan);
  } else if (element == "five") {
    Dhadak(dhadak);
  } else if (element == "six") {
    Darkhaast(darkhast);
  } else if (element == "seven") {
    Raaz(raaz);
  } else if (element == "eight") {
    SapnonRani(sapnokiraani);
  } else if (element == "nine") {
    ChahunMain(chahume);
  } else if (element == "ten") {
    YehFitoor(yehfitoormera);
  } else if (element == "eleven") {
    TuJohMila(tujohmila);
  } else if (element == "twelve") {
    AbhiMujh(abhimujme);
  } else if (element == "thirteen") {
    Hamari(hamariadhuri);
  } else if (element == "fourteen") {
    Jism(yehjism);
  } else if (element == "fiveteen") {
    AjibDastan(ajibdastan);
  } else if (element == "sixteen") {
    IkkKudi(ikkkudi);
  } else if (element == "seventeen") {
    PyarHain(kyamujhepyar);
  } else if (element == "18") {
    ZehnaSeeb(zehnaseeb);
  } else if (element == "19") {
    Shab(tuhhimerishabhai);
  } else if (element == "20") {
    MereYaara(merayaara);
  } else if (element == "21") {
    BeeteLamhe(beetelamhe);
  } else if (element == "22") {
    Ijazat(ijazat);
  } else if (element == "23") {
    Gujarish(guzarish);
  } else if (element == "24") {
    PaniDaRang(panidarang);
  } else if (element == "25") {
    Humnava(humnava);
  } else if (element == "26") {
    Subhanallah(subhanallah);
  } else if (element == "27") {
    Banjara(banjara);
  } else if (element == "28") {
    Tiktikvajate(tiktikvajate);
  } else if (element == "29") {
    Jeevrangla(jeevrangle);
  } else if (element == "30") {
    Kakaan(kakaan);
  } else if (element == "31") {
    Jyeinkyu(jiyekyun);
  } else if (element == "32") {
    Hawayein(hawavein);
  }
  else if (element == "33") {
    Jashnebahara(jashnebahara);
  }
  else if (element == "34") {
    Terahonelaga(terahonelaga);
  }
  else if (element == "35") {
    Qaafirana(qaafirana);
  }
  else if (element == "36") {
    Tumsehi(tumsehi);
  }
  else if (element == "37") {
    Aajaomeritamanna(aajaomeritamanna);
  }
  else if (element == "38") {
    Agartumsath(agartumsath);
  }
  else if (element == "39") {
    Indino(indino);
  }
  else if (element == "40") {
    Merebina(merebina);
  }
  else if (element == "41") {
    Lomaanliya(lomaanliya);
  }
  else if (element == "42") {
    Ennasona(ennasona);
  }
  else if (element == "43") {
    Tujaanena(tujaanena);
  }
  else if (element == "44") {
    Jeelezaraa(jeelezaraa);
  }
  else if (element == "45") {
    Kyahuwaterawada(kyahuwaterawada);
  }
  else if (element == "46") {
    Kalank(kalank);
  }
  else if (element == "47") {
    Uskahibanana(uskahibanana);
  }
  else if (element == "48") {
    Lakhduniyakahe(lakhduniyakahe);
  }
  else if (element == "49") {
    Terideewani(terideewani);
  }
  else if (element == "50") {
    Beintehaan(beintehaan);
  }
  else if (element == "51") {
    Sunonasangemarmar(sunonasangemarmar);
  }
  else if (element == "52") {
    Basekbaar(basekbaar);
  }
  else if (element == "53") {
    Piyaorepiya(piyaorepiya);
  }
  else {
    console.log("chord lyrics not found");
  }

  const content = document.getElementById("chord-lyrics");
  const autoscrollBtn = document.getElementById("autoscrollBtn");
  const decreaseSpeed = document.getElementById("decreaseSpeed");
  const increaseSpeed = document.getElementById("increaseSpeed");
  const speedIndicator = document.getElementById("speedIndicator");
  const resetBtn = document.getElementById("resetBtn");

  let isScrolling = false;
  let scrollSpeed = 1;
  const minScrollSpeed = 0.1; // Minimum scroll speed
  const maxScrollSpeed = 2; // Maximum scroll speed
  const minScrollAmount = 1; // Minimum scroll amount for smoother scrolling
  let scrollDelay = 80; // Default scroll delay in milliseconds

  const viewportHeight = window.innerHeight;
  let contentTop;

  function calculateMaxHeight() {
    const contentRect = content.getBoundingClientRect();
    contentTop = contentRect.top;

    let availableHeight;

    if (document.getElementById("newcontent").offsetWidth <= 600) {
      availableHeight = viewportHeight - contentTop - 20;
    } else {
      availableHeight = viewportHeight - contentTop;
    }

    content.style.maxHeight = `${availableHeight}px`;
    content.style.overflowY = "auto";

    if (
      document.getElementById("result").style.display == "flex" &&
      document.getElementById("newcontent").offsetWidth > 600 &&
      document.getElementById("newcontent").offsetWidth < 1000
    ) {
      document.querySelector(".baarish").style.paddingTop = "10.5rem";
      document.querySelector(".overlay").style.viewportHeight = "15vh";
    } else if (
      document.getElementById("result").style.display == "flex" &&
      document.getElementById("newcontent").offsetWidth <= 600
    ) {
      content.style.maxHeight = `${availableHeight}px`;
      content.style.overflowY = "auto";
    } else if (document.getElementById("result").style.display == "none") {
      document.querySelector(".baarish").style.paddingTop = "0rem";
    }
  }

  calculateMaxHeight();
  window.addEventListener("resize", calculateMaxHeight);

  function autoScroll() {
    if (!isScrolling) return;

    const scrollAmount = Math.max(scrollSpeed, minScrollAmount);
    content.scrollTop += scrollAmount;

    setTimeout(autoScroll, scrollDelay);
  }

  function startAutoScroll() {
    if (!isScrolling) {
      isScrolling = true;
      autoscrollBtn.textContent = "STOP";
      autoScroll();
    } else {
      stopAutoScroll();
    }
  }

  function stopAutoScroll() {
    isScrolling = false;
    autoscrollBtn.textContent = "AUTOSCROLL";
  }

  function adjustSpeed(increment) {
    const newSpeed = Math.max(
      minScrollSpeed,
      Math.min(scrollSpeed + increment, maxScrollSpeed)
    );

    if (newSpeed !== scrollSpeed) {
      scrollSpeed = newSpeed;
      scrollDelay = 100 + (1 - scrollSpeed) * 50;
      speedIndicator.textContent = scrollSpeed.toFixed(1) + "x";
    }
  }

  function toggleReset() {
    content.scrollTop = 0;
  }

  autoscrollBtn.addEventListener("click", startAutoScroll);
  decreaseSpeed.addEventListener("click", () => adjustSpeed(-0.1));
  increaseSpeed.addEventListener("click", () => adjustSpeed(0.1));
  resetBtn.addEventListener("click", toggleReset);

  // Initialize speed indicator
  // speedIndicator.textContent = scrollSpeed.toFixed(1) + "x";

  // content.style.overflowY = "auto";
  // content.style.maxHeight = "68vh"; // Set to an appropriate height

  // Ensure proper initialization
  // document.addEventListener("DOMContentLoaded", () => {
  //   pauseBtn.textContent = "▶️";
  // });
  const chordsElement = document.getElementById("chord-lyrics");
  const originalChordLyrics = chordsElement.innerHTML;
  const transposeplus1Button = document.getElementById("transpose+1");
  const transposeminus1Button = document.getElementById("transpose-1");
  const transposeUpButton = document.getElementById("transposeUp");
  const transposeDownButton = document.getElementById("transposeDown");

  if (!chordsElement) {
    console.error("Chords element not found");
  }
  if (!transposeUpButton) {
    console.error("Transpose Up button not found");
  }
  if (!transposeDownButton) {
    console.error("Transpose Down button not found");
  }

  const allChords = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const openChords = ["A", "Am", "C", "D", "Dm", "E", "Em", "G"];

  let currentTransposition = 0;

  function transposeChord(chord, semitones) {
    const allChords = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
    ];
    const chordRegex = /^([A-G]#?)([m]?)([57]?)$/;
    const match = chord.match(chordRegex);

    if (!match) return chord; // Return original if not a recognized chord

    let [, note, minor, extension] = match;
    let index = allChords.indexOf(note);
    if (index === -1) return chord; // Return original if note not found

    let newIndex = (index + semitones + 12) % 12;
    let newNote = allChords[newIndex];

    return newNote + (minor || "") + (extension || "");
  }

  function transpose(direction) {
    let textContent = chordsElement.innerHTML;
    let regex = /(\([^)]*\))/g; // Match chords within parentheses

    currentTransposition += direction === "up" ? 1 : -1;

    let transposedText = textContent.replace(regex, (match, chordGroup) => {
      let chordsArray = chordGroup.split(" ").map((chord) => {
        // Remove parentheses and transpose
        return transposeChord(
          chord.replace(/[()]/g, ""),
          direction === "up" ? 1 : -1
        );
      });
      return `(${chordsArray.join(" ")})`;
    });

    chordsElement.innerHTML = transposedText;
  }

  function updateLyricsWithTransposedChords(semitones) {
    const lyricsElement = document.getElementById("chord-lyrics");
    let newLyrics = lyricsElement.innerHTML;

    const chordRegex = /\(([^)]+)\)/g;
    newLyrics = newLyrics.replace(chordRegex, (match, chord) => {
      const transposedChords = chord
        .split(" ")
        .map((c) => transposeChord(c, semitones))
        .join(" ");
      return `(${transposedChords})`;
    });

    lyricsElement.innerHTML = newLyrics;
  }

  function findBestCapoAndUpdate() {
    const lyricsElement = document.getElementById("chord-lyrics");
    const chordRegex = /\(([^)]+)\)/g;
    const chords = [];

    // Extract all chords from the lyrics
    let match;
    while ((match = chordRegex.exec(lyricsElement.innerHTML)) !== null) {
      chords.push(...match[1].split(" "));
    }

    // Remove duplicates
    const uniqueChords = [...new Set(chords)];

    // Define open chords and common bar chords
    const openChords = ["A", "Am", "C", "D", "Dm", "E", "Em", "F", "G"];

    const barChords = [
      "A#",

      "A#m",

      "B",

      "Bm",

      "Cm",

      "C#",

      "C#m",

      "D#",

      "D#m",

      "Fm",

      "F#",

      "F#m",

      "Gm",

      "G#",

      "G#m",
    ];

    // Find the best capo positions
    let capoPositions = [];

    for (let capo = 0; capo <= 11; capo++) {
      let openChordCount = 0;
      let barChordCount = 0;
      for (let chord of uniqueChords) {
        const transposedChord = transposeChord(chord, -capo);
        if (openChords.includes(transposedChord)) {
          openChordCount++;
        } else if (barChords.includes(transposedChord)) {
          barChordCount++;
        }
      }
      capoPositions.push({
        position: capo,
        openChords: openChordCount,
        barChords: barChordCount,
      });
    }

    // Sort capo positions by number of open chords (descending) and bar chords (ascending)
    capoPositions.sort((a, b) => {
      if (b.openChords !== a.openChords) {
        return b.openChords - a.openChords;
      }
      return a.barChords - b.barChords;
    });

    // Choose the best capo position, preferring lower frets
    let bestCapo = capoPositions[0].position;
    if (bestCapo > 6 && capoPositions.length > 1) {
      bestCapo = capoPositions[1].position;
    }

    // Transpose chords in the lyrics
    let newLyrics = lyricsElement.innerHTML;
    newLyrics = newLyrics.replace(chordRegex, (match, chord) => {
      const transposedChords = chord
        .split(" ")
        .map((c) => transposeChord(c, -bestCapo))
        .join(" ");
      return `(${transposedChords})`;
    });

    lyricsElement.innerHTML = newLyrics;

    // Update the result display
    let resultHTML = `
    <p class="capo-pos"><strong><b>Best capo position:</b> </strong>Fret ${bestCapo}</p>
    <p class="play-chords"><strong><span class="chordset">Chords</span> have been <span class="chordset">transposed</span> in the <span class="chordset">lyrics above.</span></strong></p>
    <p class="play-chords-below" id="play-below"><strong><span class="chordset">Chords</span> have been <span class="chordset">transposed</span> in the <span class="chordset">lyrics below.</span></strong></p>

  `;
    document.getElementById("result").innerHTML = resultHTML;
    document.getElementById("result").style.display = "flex";

    // Get the snackbar DIV
    var x = document.getElementById("play-below");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace("show", "");
      x.style.display = "none";
      calculateMaxHeight();
    }, 3000);

    // Reset currentTransposition
    currentTransposition = -bestCapo;
    calculateMaxHeight();
  }
  document
    .getElementById("findBestCapo")
    .addEventListener("click", findBestCapoAndUpdate);

  document
    .getElementById("findNewBestCapo")
    .addEventListener("click", findBestCapoAndUpdate);

  document.getElementById("reset-scale").addEventListener("click", () => {
    chordsElement.innerHTML = originalChordLyrics;
    currentTransposition = 0;
    document.getElementById("result").style.display = "none";
    calculateMaxHeight();
  });

  document.getElementById("reset-scale-new").addEventListener("click", () => {
    chordsElement.innerHTML = originalChordLyrics;
    currentTransposition = 0;
    document.getElementById("result").style.display = "none";
    calculateMaxHeight();
  });

  transposeplus1Button.addEventListener("click", () => {
    transpose("up");
  });
  transposeminus1Button.addEventListener("click", () => {
    transpose("down");
  });

  transposeUpButton.addEventListener("click", () => {
    transpose("up");
  });
  transposeDownButton.addEventListener("click", () => {
    transpose("down");
  });

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  menuButton.addEventListener("click", toggleMenu);

  // document.querySelectorAll(".option-button").forEach((button) => {
  //   button.addEventListener("click", () => {
  //     alert(`You clicked: ${button.textContent}`);
  //     // Here you would typically add the logic to navigate to the selected section
  //     toggleMenu(); // Close the menu after selection
  //   });
  // });
}

function loadchordset() {
  // window.location.href = 'instruction.html';
  const rootUrl = window.location.origin; // This will remove /baarish
  window.history.pushState({ path: rootUrl }, "", rootUrl);
  const chordset = `
  
  <div class="container-new">
    <h1>CHORDS LIBRARY</h1>
    <div class="search-container">
    
      <input type="text" placeholder="Search.." name="search" style="padding-left: 1rem;">
      <span class="clear-search">&times;</span>
      <button type="submit"><i class="fa fa-search"></i></button>
  </div>
    <div class="row-new task__contents">
        <div class="col-new">
            <div class="card-new" onclick="chord('one')">
                <img src="../assets/img/Baarish-thumbnail.JPEG.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">BAARISH - YAARIYAN</h5>
                    <p class="card-meta-new martop">Mohammed Irfan & Gajendra Verma</p>
                    <div class="badge-btns">
                   <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-new-parineeta">
            <div class="card-new" onclick="chord('two')">
                <img src="../assets/img/parineeta.png" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new-parineeta">KAISI PAHELI ZINDAGANI - PARINEETA</h5>
                    <p class="card-meta-new">Sunidhi Chauhan & Shantanu Moitra</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                    
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('three')">
                <img src="../assets/img/YESS-BOSS-POSTER.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new-parineeta">MAIN KOI AISA GEET GAOON - YESS BOSS</h5>
                    <p class="card-meta-new">Abhijeet & Alka Yagnik</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('four')">
                <img src="../assets/img/KHAMOSHIYAN.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">KHAMOSHIYAN - TITLE TRACK</h5>
                    <p class="card-meta-new">Arjit Singh & Jeet Gannguli</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('five')">
                <img src="../assets/img/Dhadak.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">DHADAK - TITLE TRACK</h5>
                    <p class="card-meta-new martop">Ajay Gogavale & Shreya Ghoshal</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('six')">
                <img src="../assets/img/Darkhast.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">DARKHAAST - SHIVAAY</h5>
                    <p class="card-meta-new martop">Arijit Singh & Sunidhi Chauhan</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('seven')">
                <img src="../assets/img/raazteri.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Raaz Aankhei Teri - razz reboot</h5>
                    <p class="card-meta-new">Arijit Singh & Jeet Gannguli</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('eight')">
                <img src="../assets/img/merisapno.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Meri Sapnon Ki Rani - aradhana</h5>
                    <p class="card-meta-new">Kishor Kumar & JS. D. Burman</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('nine')">
                <img src="../assets/img/chahume.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Chahun Main Ya Naa - aashiqui 2</h5>
                    <p class="card-meta-new">Arijit Singh & Palak Muchhal</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('ten')">
                <img src="../assets/img/yehfitoor.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Yeh Fitoor Mera - fitoor</h5>
                    <p class="card-meta-new">Arijit Singh & Amit Trivedi</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('eleven')">
                <img src="../assets/img/tujohmila.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tu Jo Mila - bajrangi bhaijaan</h5>
                    <p class="card-meta-new">KK & Pritam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('twelve')">
                <img src="../assets/img/abhimujme.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Abhi Mujh Mein Kahin - agneepath</h5>
                    <p class="card-meta-new">Sonu Nigam & Ajay Atul</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('thirteen')">
                <img src="../assets/img/hamariadhuri.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Hamari Adhuri Kahani - title track</h5>
                    <p class="card-meta-new">Arijit Singh & Jeet Gannguli</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('fourteen')">
                <img src="../assets/img/yehjism.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Yeh Jism - Jism 2</h5>
                    <p class="card-meta-new martop">Arko Pravo Mukherjee & Munish</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('fiveteen')">
                <img src="../assets/img/ajibdasta.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Ajib Dastan - dil apna aur preet parai</h5>
                    <p class="card-meta-new">Lata Mangeshkar & Shankar Jaikishan</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('sixteen')">
                <img src="../assets/img/ikkkudi.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Ikk Kudi - udta punjab</h5>
                    <p class="card-meta-new">Shahid Mallya & Amit Trivedi</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('seventeen')">
                <img src="../assets/img/kyamujepyar.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Kya Mujhe Pyar Hain - woh lamhe</h5>
                    <p class="card-meta-new">Pritam & Nilesh Mishra</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new" onclick="chord('18')">
                <img src="../assets/img/zehnaseeb.png" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Zehnaseeb - hasee toh phasee</h5>
                    <p class="card-meta-new">Chinmayi Sripaada & Shekhar Ravjiani</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('19')">
                <img src="../assets/img/tuhhimeri.jpg" alt="Blog post image">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tu hi Meri Shab Hai - gangster</h5>
                    <p class="card-meta-new">Kk & Pritam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('20')">
                <img src="../assets/img/mereyaara.jpg" alt="Mere Yaara">
                <div class="card-body-new">
                    <h5 class="card-title-new">Mere Yaaraa - Sooryavanshi</h5>
                    <p class="card-meta-new"> Arijit Singh & Neeti Mohan</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('21')">
                <img src="../assets/img/beetelamhe.jpg" alt="Beete Lamhe">
                <div class="card-body-new">
                    <h5 class="card-title-new">Beete Lamhein - The Train- An Inspiration</h5>
                    <p class="card-meta-new"> KK & Mithoon</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('22')">
                <img src="../assets/img/ijazaat.jpg" alt="Ijazat">
                <div class="card-body-new">
                    <h5 class="card-title-new">Ijazat - One Night Stand</h5>
                    <p class="card-meta-new"> Arijit Singh & Meet Bros</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('23')">
                <img src="../assets/img/guzarish.jpg" alt="Guzarish">
                <div class="card-body-new">
                    <h5 class="card-title-new">Guzarish - Ghajini</h5>
                    <p class="card-meta-new"> A.R. Rahman, Javed Ali & Sonu Nigam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('24')">
                <img src="../assets/img/paanida.jpg" alt="Pani Da Rang">
                <div class="card-body-new">
                    <h5 class="card-title-new">Pani Da Rang - Vicky Donor</h5>
                    <p class="card-meta-new">Abhishek-Akshay,
Bann,Rochak Kohli & Ayushmann Khurrana</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('25')">
                <img src="../assets/img/humnava.jpg" alt="Humnava">
                <div class="card-body-new">
                    <h5 class="card-title-new">Humnava - Hamari Adhuri Kahani</h5>
                    <p class="card-meta-new">Papon & Mithoon</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('26')">
                <img src="../assets/img/subhanalla.jpg" alt="Subhnallah">
                <div class="card-body-new">
                    <h5 class="card-title-new">Subhanallah - Hamari Adhuri Kahani</h5>
                    <p class="card-meta-new">Sreeram, Shilpa Rao & Pritam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('27')">
                <img src="../assets/img/banjara.jpg" alt="Banjaara">
                <div class="card-body-new">
                    <h5 class="card-title-new">Banjaara - Ek Villain</h5>
                    <p class="card-meta-new">Mohd.irfan & Mithoon</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('28')">
                <img src="../assets/img/tiktikvajate.png" alt="Tik Tik Vajate Dokyat">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tik Tik Vajate Dokyat - Duniyadari</h5>
                    <p class="card-meta-new">Sonu Nigam, Sayali Pankaj & Pankaj Padghan</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
      </div>
        <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('29')">
                <img src="../assets/img/jeevrangla.png" alt="Jeev Rangla">
                <div class="card-body-new">
                    <h5 class="card-title-new">Jeev Rangla - Jogwa</h5>
                    <p class="card-meta-new">Hariharan,Shreya Ghoshal,Mukta Barve & Ajay-Atul</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>  
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('30')">
                <img src="../assets/img/kakaan.jpg" alt="Kaakan">
                <div class="card-body-new">
                    <h5 class="card-title-new">Kaakan - Kaakan</h5>
                    <p class="card-meta-new">Shankar Mahadevan & Neha Rajpal & Ajay Singha</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('31')">
                <img src="../assets/img/jyeinkyu.jpg" alt="Jyeikyu">
                <div class="card-body-new">
                    <h5 class="card-title-new">Jiyein Kyun - Dum Maaro Dum</h5>
                    <p class="card-meta-new">Papon & Pritam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('32')">
                <img src="../assets/img/hawayein.jpg" alt="Hawayein">
                <div class="card-body-new">
                    <h5 class="card-title-new">Hawayein - Jab Harry Met Sejal</h5>
                    <p class="card-meta-new">Arijit Singh & Pritam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('33')">
                <img src="../assets/img/jashnebahara.jpg" alt="Jashn-E-Bahaaraa">
                <div class="card-body-new">
                    <h5 class="card-title-new">Jashn-E-Bahaaraa - Jodhaa Akbar</h5>
                    <p class="card-meta-new">Javed Ali & A.R.Rahman </p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('34')">
                <img src="../assets/img/tera_hone_laga_hu.jpg" alt="Tera Hone Laga Hu">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tera Hone Laga Hu - Ajab Prem Ki Ghazab Kahani</h5>
                    <p class="card-meta-new">Atif Aslam, Alisha Chinai </p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('35')">
                <img src="../assets/img/Quaafirana.jpg" alt="Quaafirana">
                <div class="card-body-new">
                    <h5 class="card-title-new">Quaafirana - Kedarnath</h5>
                    <p class="card-meta-new">Arijit & Nikhita </p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('36')">
                <img src="../assets/img/Tum se Hi.jpg" alt="Tum Se Hi">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tum Se Hi - Jab We Met</h5>
                    <p class="card-meta-new">Mohit Chauhan </p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('37')">
                <img src="../assets/img/aajao_mere_tamanna.jpg" alt="Aa Jao Meri Tamanna">
                <div class="card-body-new">
                    <h5 class="card-title-new">Aa Jao Meri Tamanna - Ajab Prem Ki Ghazab Kahani</h5>
                    <p class="card-meta-new">Javed Ali and Jojo </p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('38')">
                <img src="../assets/img/agar_tum_sath_ho.jpg" alt="Agar Tum Sath Ho">
                <div class="card-body-new">
                    <h5 class="card-title-new">Agar Tum Sath Ho - Tamasha</h5>
                    <p class="card-meta-new">Alka Yagnik, Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('39')">
                <img src="../assets/img/in_dino.jpg" alt="In Dinoa">
                <div class="card-body-new">
                    <h5 class="card-title-new">In Dino - Life in a Metro</h5>
                    <p class="card-meta-new">Soham & Pritam Chakraborty</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('40')">
                <img src="../assets/img/mere bina.jpg" alt="Mere Bina">
                <div class="card-body-new">
                    <h5 class="card-title-new">Mere Bina - Crook</h5>
                    <p class="card-meta-new">Nikhil Dsouza</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('41')">
                <img src="../assets/img/lo maan liya.jpg" alt="Lo Maan Liya">
                <div class="card-body-new">
                    <h5 class="card-title-new">Lo Maan Liya - Raaz Reboot</h5>
                    <p class="card-meta-new">Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('42')">
                <img src="../assets/img/Enna_sona.jpg" alt="Enna Sona">
                <div class="card-body-new">
                    <h5 class="card-title-new">Enna Sona - OK Jaanu</h5>
                    <p class="card-meta-new">Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('43')">
                <img src="../assets/img/Tu_jane_naa.jpg" alt="Tu Jaane Na">
                <div class="card-body-new">
                    <h5 class="card-title-new">Tu Jaane Na - Ajab Prem Ki Ghazab Kahani</h5>
                    <p class="card-meta-new">Atif Aslam</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('44')">
                <img src="../assets/img/jee le zaraa.jpg" alt="Jee Le Zaraa">
                <div class="card-body-new">
                    <h5 class="card-title-new">Jee Le Zaraa - Talaash</h5>
                    <p class="card-meta-new">Vishal Dadlani</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('45')">
                <img src="../assets/img/kya_hua_tera_wada.jpg" alt="Kya Hua Tera Wada">
                <div class="card-body-new">
                    <h5 class="card-title-new">Kya Hua Tera Wada - Hum Kisise kum nahi</h5>
                    <p class="card-meta-new">Mohammed Rafi</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('46')">
                <img src="../assets/img/Kalank.jpg" alt="Kalank">
                <div class="card-body-new">
                    <h5 class="card-title-new">Kalank - Kalank</h5>
                    <p class="card-meta-new">Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('47')">
                <img src="../assets/img/uska he bana.jpg" alt="Uska Hi Banana">
                <div class="card-body-new">
                    <h5 class="card-title-new">Uska Hi Banana - 1920 Evil Returns</h5>
                    <p class="card-meta-new">Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('48')">
                <img src="../assets/img/lakh duniya kahe.jpg" alt="Lakh Duniya Kahe">
                <div class="card-body-new">
                    <h5 class="card-title-new">Lakh Duniya Kahe - Talaash</h5>
                    <p class="card-meta-new">Ram Sampath</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('49')">
                <img src="../assets/img/terideewani.jpg" alt="Teri Deewani">
                <div class="card-body-new">
                    <h5 class="card-title-new">Teri Deewani - Album</h5>
                    <p class="card-meta-new">Kailash Kher</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('50')">
                <img src="../assets/img/be_inteha.jpg" alt="Be Intehaan">
                <div class="card-body-new">
                    <h5 class="card-title-new">Be Intehaan - Race 2</h5>
                    <p class="card-meta-new">Atif Aslam & Sunidhi Chauhan</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('51')">
                <img src="../assets/img/sunonasangemarmar.jpg" alt="Suno Na Sangemarmar">
                <div class="card-body-new">
                    <h5 class="card-title-new">Suno Na Sangemarmar - Youngistaan</h5>
                    <p class="card-meta-new">Arijit Singh</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('52')">
                <img src="../assets/img/bas_ek_bar.jpg" alt="Bas Ek Baar">
                <div class="card-body-new">
                    <h5 class="card-title-new">Bas Ek Baar - Solo Album</h5>
                    <p class="card-meta-new">Soham Naik</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>
    <div class="col-new">
            <div class="card-new card-bottom" onclick="chord('53')">
                <img src="../assets/img/piya_o_re_piya.jpg" alt="Piya O Re Piya">
                <div class="card-body-new">
                    <h5 class="card-title-new">Piya O Re Piya - Tere Naal Love Ho Gaya</h5>
                    <p class="card-meta-new">Atif Aslam & Shreya Ghoshal</p>
                    <div class="badge-btns">
                    <span class="badge-new badge-info-new">GUITAR CHORDS</span>
                    <span class="badge-new badge-warning-new">PIANO CHORDS</span></div>
                </div>
            </div>
        </div>

</div>
</div>  
    
        

<div class="menu-overlay">
    <div class="menu-options">
     <button class="option-button">Home</button>
      <button class="option-button">Reference Videos</button>
      <button class="option-button">Music Lessons</button>
      <button class="option-button" onclick="changeView(loadchordset, this)">Chords Library</button>
    </div>
  </div>

  <nav class="tab-bar">
    <a href="#" onclick="MSTREAMAPI.logout();" class="tab-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="#" class="tab-item" onclick="changeView(loadinstruction, this)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      <span>Reference Videos</span>
    </a>
    
    <a href="#" class="tab-item active" onclick="changeView(loadchordset, this)">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 0 1 416 154v22"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0 1 23-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 0 0-12.6-9.61L204 102a16.48 16.48 0 0 0-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80"></path></svg>
      <span>Chords Library</span>
    </a>
    
  </nav>
  `;
  document.getElementById("mstream-player").style.display = "none";
  document.getElementById("filelist").style.display = "none";
  document.getElementById("playlist").style.display = "none";
  document.getElementById("header_tab").style.display = "none";
  document.getElementById("backbtn").style.display = "none";
  document.getElementById("local_search_btn").style.display = "none";
  document.getElementById("add_all").style.display = "none";
  document.getElementById("newcontent").style.display = "block";
  document.getElementById("newcontent").style.flexBasis = "inherit";
  document.getElementById("newcontent").style.overflowY = "scroll";
  document.getElementById("newcontent").scrollTop = 0;
  if (document.getElementById("newcontent").offsetWidth <= 600) {
    document.getElementById("newcontent").style.paddingTop = 0;
  }
  document.getElementById("content").style.display = "none";
  document.getElementById("newcontent").innerHTML = chordset;

  const newUrl = window.location.origin + "/chords";
  window.history.pushState({ path: newUrl }, "", newUrl);

  const taskContents = document.querySelector(".task__contents");
  const searchName = document.querySelector("[name='search']");
  const clearButton = document.querySelector(".clear-search");

  // Clear input when clear button is clicked
  clearButton.addEventListener("click", function () {
    searchName.value = "";
    this.style.display = "none";
    searchName.focus();
    // Trigger the search function to update results
    searchName.dispatchEvent(new Event("input"));
  });

  function searchTask(e) {
    const searchValue = e.target.value.toLowerCase();
    const cards = Array.from(
      taskContents.querySelectorAll(".col-new, .col-new-parineeta")
    );

    cards.forEach((card) => {
      const title = card.querySelector(
        ".card-title-new, .card-title-new-parineeta"
      );
      if (title) {
        const titleText = title.textContent.toLowerCase();
        if (titleText.includes(searchValue)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      }
    });
  }

  searchName.addEventListener("input", function (e) {
    searchTask.apply(this, arguments);
    clearButton.style.display = this.value ? "inline" : "none";
  });

  const tabItems = document.querySelectorAll(".tab-item");
  const menuButton = document.querySelector(".menu-button");
  const menuOverlay = document.querySelector(".menu-overlay");

  tabItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      tabItems.forEach((tab) => tab.classList.remove("active"));
      item.classList.add("active");

      // Add and remove pulse animation
      item.classList.add("pulse");
      setTimeout(() => {
        item.classList.remove("pulse");
      }, 300);
    });
  });
  function toggleMenu() {
    menuButton.classList.toggle("active");
    menuOverlay.style.display =
      menuOverlay.style.display === "flex" ? "none" : "flex";
    menuButton.innerHTML = menuButton.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-chevron-up"></i>';

    // Add and remove shake animation
    menuButton.classList.add("shake");
    setTimeout(() => {
      menuButton.classList.remove("shake");
    }, 300);
  }

  // menuButton.addEventListener("click", toggleMenu);
}
