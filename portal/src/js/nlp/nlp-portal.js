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

const redactionList = [];
const reportingList = [];

function clearRedactions(){
    redactionList = [];
}

function clearReporting(){
    reportingList = [];
}

function clearSelection(){
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
function getSelectionText() {
    var text = "";
    var start, end;
    
    if (window.getSelection) {
        let sele =window.getSelection();
        console.log(sele);
        text = sele.toString();
        start = Math.min(sele.baseOffset,sele.extentOffset);
        end = Math.max(sele.baseOffset,sele.extentOffset);
    }

    return {
        text: text,
        start: start,
        end: end
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
function redactSelection(type, listId) {
    let selectionText = getSelectionText();
    switch (type) {
        case 'people':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'PERSON']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'PERSON']</li>`
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'racial':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'RACIAL']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'RACIAL']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'address':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'ADDRESS']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'ADDRESS']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'phone':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'PHONE']);
             if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'PHONE']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'email':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'EMAIL'])
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'EMAIL']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'title':
            addTagSel('b', 'training-txt');
            redactionList.push([selectionText.start, selectionText.end, 'TITLE'])
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'TITLE']</li>`;
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
            clearSelection();
    }
}

// Redact Selection and Return Info
function reportSelection(type, listId) {
    let selectionText = getSelectionText();
    switch (type) {
        case 'perpetrator':
            addTagSel('b', 'training-txt');
            reportingList.push([selectionText.start, selectionText.end, 'PERPETRATOR']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'PERPETRATOR']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'victim':
            addTagSel('b', 'training-txt');
            reportingList.push([selectionText.start, selectionText.end, 'VICTIM']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'VICTIM']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'location':
            addTagSel('b', 'training-txt');
            reportingList.push([selectionText.start, selectionText.end, 'LOCATION']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'LOCATION']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'time':
            addTagSel('b', 'training-txt');
            reportingList.push([selectionText.start, selectionText.end, 'TIME']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'TIME']</li>`;
                document.getElementById(listId).innerHTML = dom;
            }
            clearSelection();
            break;
        case 'weapon':
            addTagSel('b', 'training-txt');
            reportingList.push([selectionText.start, selectionText.end, 'WEAPON']);
            if(listId){
                let dom = document.getElementById(listId).innerHTML;
                dom += `<li>[${selectionText.start}, ${selectionText.end}, 'WEAPON']</li>`;
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


function saveRedaction(textId){
    let payload = {
        text: document.getElementById(textId).innerText,
        entities: redactionList
    }
    console.log(payload)
}

function saveReport(textId){
    let payload = {
        text: document.getElementById(textId).innerText,
        entities: reportingList
    }
    console.log(payload)
}