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

// Multi-Data Set
let redactionSubmission = [];
let reportingSubmission = [];
// Single Data Set
let redactionList = [];
let reportingList = [];

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
function remoteRemoteCSV(inputId, textId) {

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

// Add Tags (Styling)
function addTagSel(tag, idelm) {
    // https://CoursesWeb.net/javascript/
    var tag_type = new Array('<', '>');        // for BBCode tag, replace with:  new Array('[', ']');
    var txta = document.getElementById(idelm);
    var start = tag_type[0] + tag + tag_type[1];
    var end = tag_type[0] + '/' + tag + tag_type[1];
    var IE = /*@cc_on!@*/false;    // this variable is false in all browsers, except IE

    if (IE) {
        var r = document.selection.createRange();
        var tr = txta.createTextRange();
        var tr2 = tr.duplicate();
        tr2.moveToBookmark(r.getBookmark());
        tr.setEndPoint('EndToStart', tr2);
        var tag_seltxt = start + r.text + end;
        var the_start = txta.value.replace(/[\r\n]/g, '.').indexOf(r.text.replace(/[\r\n]/g, '.'), tr.text.length);
        txta.value = txta.value.substring(0, the_start) + tag_seltxt + txta.value.substring(the_start + tag_seltxt.length, txta.value.length);

        var pos = txta.value.length - end.length;    // Sets location for cursor position
        tr.collapse(true);
        tr.moveEnd('character', pos);        // start position
        tr.moveStart('character', pos);        // end position
        tr.select();                 // selects the zone
    }
    else if (txta.selectionStart || txta.selectionStart == "0") {
        var startPos = txta.selectionStart;
        var endPos = txta.selectionEnd;
        var tag_seltxt = start + txta.value.substring(startPos, endPos) + end;
        txta.value = txta.value.substring(0, startPos) + tag_seltxt + txta.value.substring(endPos, txta.value.length);

        // Place the cursor between formats in #txta
        txta.setSelectionRange((endPos + start.length), (endPos + start.length));
        txta.focus();
    }
    return tag_seltxt;
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
            case 'racial':
                redactionList.push([selectionText.start, selectionText.end, 'RACIAL']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'RACIAL']</li>`;
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
            case 'title':
                redactionList.push([selectionText.start, selectionText.end, 'TITLE'])
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'TITLE']</li>`;
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
            case 'perpetrator':
                reportingList.push([selectionText.start, selectionText.end, 'PERPETRATOR']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'PERPETRATOR']</li>`;
                    document.getElementById(listId).innerHTML = dom;
                }
                clearSelection();
                break;
            case 'victim':
                reportingList.push([selectionText.start, selectionText.end, 'VICTIM']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'VICTIM']</li>`;
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
                reportingList.push([selectionText.start, selectionText.end, 'WEAPON']);
                if (listId) {
                    let dom = document.getElementById(listId).innerHTML;
                    dom += `<li class="collection-item">[${selectionText.start}, ${selectionText.end}, 'WEAPON']</li>`;
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
    let payload = {
        text: document.getElementById(textId).innerText,
        entities: redactionList.map(x => x)
    }
    redactionSubmission.push(payload);
    clearRedactions(listId)
    console.log(redactionSubmission)
}

// Save Data Set Learning
function saveReport(textId, listId) {
    let payload = {
        text: document.getElementById(textId).innerText,
        entities: reportingList.map(x => x)
    }
    reportingSubmission.push(payload);
    clearReporting(listId);
    console.log(reportingSubmission)
}

function exportJSON(){
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
            if(reportingSubmission.length > 0){
                var a = document.createElement("a");
                var file = new Blob([JSON.stringify(reportingSubmission)], {type:"application/json;charset=utf-8"});
                a.href = URL.createObjectURL(file);
                a.download = 'reportingData.json';
                a.click();
            }
            if(redactionSubmission.length > 0){
                var a = document.createElement("a");
                var file = new Blob([JSON.stringify(redactionSubmission)], {type:"application/json;charset=utf-8"});
                a.href = URL.createObjectURL(file);
                a.download = 'redactionData.json';
                a.click();
            }
        }
    });

  
}