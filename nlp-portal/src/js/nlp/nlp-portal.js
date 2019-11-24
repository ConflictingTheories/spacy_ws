/*                                            *\
** ------------------------------------------ **
**                  NLP API                   **
** ------------------------------------------ **
**          Copyright (c) 2019           **
**              - Kyle Derby MacInnis         **
**                                            **
** Any unauthorized distribution or transfer  **
**    of this work is strictly prohibited.    **
**                                            **
**           All Rights Reserved.             **
** ------------------------------------------ **
\*                                            */

// API Constants
const portal_server = "";
const nlp_rest_server = "http://ssh-001.kderbyma.com:8088/";
const nlp_ws_server = "ws://ssh-001.kderbyma.com:8765/";

// Multi-Data Set
let redactionSubmission = [];
let reportingSubmission = [];
// Single Data Set
let redactionList = [];
let reportingList = [];
// Webscoket
let ws = null;

// Connect to Client Websocket Server
function connectToWS(listId){
    ws = new WebSocket(nlp_ws_server);
    // On Open
    ws.onopen = function (event) {
        ws.send("Here's some text that the server is urgently awaiting translation!");
        ws.onmessage = function (event){
            let msg = event.data;
            displayTags(msg,listId);
            console.log(msg);
        }
    };
}

function sendMsg(textId){
    let msg = document.getElementById(textId).value;
    ws.send(msg);
}

function displayTags(msg,listId){
    let msgObj = JSON.parse(msg);
    let tags = Object.keys(msgObj);
    let list = document.getElementById(listId);
    let bodytags = tags.map((x,i)=>{
        let tokens = msgObj[x];
        let output = [`${tokens.map((y)=>`<tr>${'<td></td>'.repeat(i)}<td>${y}</td>${'<td></td>'.repeat(tags.length-1-i)}</tr>`)}`]
        return output.join('');
    });
    // Output Table
    list.innerHTML = [`<thead>${tags.map(x=>'<th>'+x+'</th>')}</thead><tbody>`,...bodytags,`</tbody>`].join('');
}

// Load Row from Data
function loadRow(button, textId) {
    let newText = button.innerText;
    document.getElementById(textId).innerText = newText
}

// Load Local CSV
function localCSV(inputId, tableId, textId) {
    var dvCSV = document.getElementById(tableId);
    var fileUpload = document.getElementById(inputId);
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                dvCSV.innerHTML = "";
                console.log('LOADED', e)
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    console.log('Cells,', cells)
                    console.log('Rows', rows);
                    if (cells.length > 0) {
                        for (var j = 0; j < cells.length; j++) {
                            var li = document.createElement("li");
                            li.classList.add('collection-item')
                            li.innerHTML = `<a style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;cursor:pointer;" onclick="loadRow(this,'${textId}')">${cells[j]}</a></div>`;
                            dvCSV.appendChild(li);
                        }
                    }
                }
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}

// Fetch Remote CSV [WIP]
function remoteRemoteCSV(inputId, tableId, textId) {
    var dvCSV = document.getElementById(tableId);
    let url = document.getElementById(inputId).value;

    $.ajaxPrefilter('script', function (options) {
        options.crossDomain = true;
    });

    $.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        success: function (data) {
            console.log(data);
            var rows = data.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].split(",");
                console.log('Cells,', cells)
                console.log('Rows', rows);
                if (cells.length > 0) {
                    for (var j = 0; j < cells.length; j++) {
                        var li = document.createElement("li");
                        li.classList.add('collection-item')
                        li.innerHTML = `<a style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;cursor:pointer;" onclick="loadRow(this,'${textId}')">${cells[j]}</a></div>`;
                        dvCSV.appendChild(li);
                    }
                }
            }
        },
        error: function (request, status, error) {
            console.error(error);
        }
    });

}

// Clear Text Selection
function clearSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

// TEXT SELECTION FUNCTION (FOR HIGHLEGHTED TEXT)
function getSelectionText(textId) {
    var text = "";
    var start, end;
    text = window.getSelection();
    start = text.anchorOffset
    end = text.focusOffset

    return {
        text: text,
        start: start,
        end: end
    }
}

// Select Individual Word on Click
function getWordOnClick(textId) {

    let text = document.getElementById(textId).innerText;
    let sele = window.getSelection();

    console.log(text);
    start = sele.anchorOffset
    end = sele.focusOffset

    console.log(sele, text, start, end);

    if (start == end && text != '') {
        let foundWord = false;
        let foundStart = null;
        let foundEnd = null;
        let cnt = 0;
        while (!foundWord && cnt < 100) {
            // Find Start
            if (foundStart === null && (start - cnt) > 0 && text[start - cnt] !== " " && text[start - cnt] !== "\n" && text[start + cnt] !== "") {
                console.log(text[start - cnt])
                // Do nothing
            } else {
                if (foundStart === null) {
                    foundStart = start - cnt == 0 ? start - cnt : start - cnt + 1;
                    console.log("START", foundStart)
                }
            }
            // Find End
            if (foundEnd === null && (end + cnt) < text.length && text[end + cnt] !== " " && text[start + cnt] !== "\n" && text[start + cnt] !== "") {
                // Do nothing
                console.log(text[end + cnt])
            } else {
                if (foundEnd === null) {
                    foundEnd = end + cnt;
                    console.log("END", foundEnd)
                }
            }
            // Found both Sides
            if (foundStart !== null && foundEnd !== null) {
                console.log(foundStart, foundEnd, text.substring(foundStart, foundEnd))
                foundWord = true;
                let range = document.createRange();
                range.setEnd(sele.focusNode, foundEnd);
                range.setStart(sele.focusNode, foundStart);
                sele.removeAllRanges()
                sele.addRange(range);
                // textarea.selectionStart=foundStart;
                // textarea.selectionEnd=foundEnd;
                // textarea.focus();
            } else {
                console.log('searching .. ..')
                cnt++;
            }
        }
    }
}

// Redact Selection and Return Info
function redactSelection(type, listId, textId) {
    let selectionText = getSelectionText(textId);
    if (selectionText.start !== selectionText.end) {
        switch (type) {
            case 'people':
                redactionList.push([selectionText.start, selectionText.end, 'PERSON']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'PERSON']</li>`
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'address':
                redactionList.push([selectionText.start, selectionText.end, 'ADDRESS']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'ADDRESS']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'phone':
                redactionList.push([selectionText.start, selectionText.end, 'PHONE']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'PHONE']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'email':
                redactionList.push([selectionText.start, selectionText.end, 'EMAIL'])
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'EMAIL']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            default:
                Swal.fire({
                    title: 'Missing Information!',
                    text: 'Missing Type Information - Something appears to have gone wrong.',
                    type: 'error',
                    confirmButtonText: 'Got it, Thanks',
                })
                    .then((res) => {
                        console.log(res);
                        clearSelection();
                    });
        }
    }
}

// Redact Selection and Return Info
function reportSelection(type, listId, textId) {
    let selectionText = getSelectionText(textId);
    if (selectionText.start !== selectionText.end) {
        switch (type) {
            case 'PERSON':
                reportingList.push([selectionText.start, selectionText.end, 'PERSON']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'PERSON']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'location':
                reportingList.push([selectionText.start, selectionText.end, 'LOCATION']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'LOCATION']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'time':
                reportingList.push([selectionText.start, selectionText.end, 'TIME']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'TIME']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'weapon':
                reportingList.push([selectionText.start, selectionText.end, 'OBJECT']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'OBJECT']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            default:
                Swal.fire({
                    title: 'Missing Information!',
                    text: 'Missing Type Information - Something appears to have gone wrong.',
                    type: 'error',
                    confirmButtonText: 'Got it, Thanks',
                })
                    .then((res) => {
                        console.log(res);
                    });
        }
    }
}

// Clear List of Current Data Set
function clearRedactions(listId) {
    redactionList = [];
    document.getElementById(listId).innerHTML = '';
}

// Clear List of Current Data Set
function clearReporting(listId) {
    reportingList = [];
    document.getElementById(listId).innerHTML = '';
}

// Save Current Data Set Learning
function saveRedaction(textId, listId) {
    let payload = [
        document.getElementById(textId).innerText,
        { entities: redactionList.map(x => x) }
    ];

    redactionSubmission.push(payload);
    clearRedactions(listId)
    console.log(redactionSubmission)
}
// Save Data Set Learning
function saveReport(textId, listId) {
    let payload = [
        document.getElementById(textId).innerText,
        { entities: reportingList.map(x => x) }
    ]
    reportingSubmission.push(payload);
    clearReporting(listId);
    console.log(reportingSubmission)
}
// Upload New Training Material
function uploadTraining(url, payload){
    $.ajax({
        type: "POST",
        url: `${portal_server}${url}`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (data) {
            console.log(data);
        },
        error: function (request, status, error) {
            console.error(error);
        }
    });
}
// Refresh Model (Retrain)
function refreshModel(type){
    $.ajax({
        type: "GET",
        url: `${portal_server}/api/retrain/${type}`,
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
        },
        error: function (request, status, error) {
            console.error(error);
        }
    });
}

// Load New Model
function loadModel(textId){
    let type = document.getElementById(textId).value;
    $.ajax({
        type: "GET",
        url: `${portal_server}/api/reload/${type}`,
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
        },
        error: function (request, status, error) {
            console.error(error);
        }
    });
}
// Return JSON to browser
function exportJSON() {
    Swal.fire({
        title: 'Finished Training?',
        text: 'Confirm to submit.',
        type: 'info',
        showCancelButton: true,
        cancelButtontext: "Go Back",
        confirmButtonText: 'Got it, Thanks',
    })
        .then((res) => {
            console.log(res);
            if (res.value) {
                if (reportingSubmission.length > 0) {
                    uploadTraining('/api/train/report', reportingSubmission);
                    var a = document.createElement("a");
                    var file = new Blob([JSON.stringify(reportingSubmission)], { type: "application/json;charset=utf-8" });
                    a.href = URL.createObjectURL(file);
                    a.download = 'reportingData.json';
                    a.click();
                }
                if (redactionSubmission.length > 0) {
                    uploadTraining('/api/train/redact', redactionSubmission);
                    var a = document.createElement("a");
                    var file = new Blob([JSON.stringify(redactionSubmission)], { type: "application/json;charset=utf-8" });
                    a.href = URL.createObjectURL(file);
                    a.download = 'redactionData.json';
                    a.click();
                }
            }
        });


}