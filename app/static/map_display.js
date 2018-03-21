/* jshint esnext: true */
var globalVar = null;
(function() {
    "use strict";
    window.onload = function() {
        console.log("SVG load function running.");

        let initMap = document.getElementById("svgMap");

        let pathArr = document.getElementsByTagName("path");

        for (let i = 0; i < pathArr.length; ++i) {
            pathArr[i].onmouseover = showDiv;
            pathArr[i].onmousemove = moveDiv;
            pathArr[i].onmouseout = hideDiv;
            pathArr[i].onclick = clickAction; // optional: change to ondblclick
        }

        $.ajax({
            type: "POST",
            url: "/get_map_data/",
            data: {},
            success: addData,
            fail: function() {
                alert("An unexpected error occurred.");
            },
            dataType: "JSON"
        });

        function showDiv() {
            document.getElementById("mouseoverDiv").style.display = "block";
        }

        function hideDiv() {
            document.getElementById("mouseoverDiv").style.display = "none";
        }

        function moveDiv(evt) {
            let mouseoverDiv = document.getElementById("mouseoverDiv");
            mouseoverDiv.style.left = (evt.clientX+10) + "px";
            mouseoverDiv.style.top = (evt.clientY+10) + "px";
            let valueString = " ??";
            if (globalVar !== null) {
                let stateRows = globalVar.tables[0].rows;
                for (let i = 0; i < stateRows.length; ++i) {
                    if (stateRows[i].state === evt.target.getAttribute("id")) {
                        valueString = " " + Math.round(stateRows[i].displayvalue * 1000)/10 + "%";
                    }
                }
            }
            mouseoverDiv.innerText = evt.target.getAttribute("id") + valueString;
        }

        function clickAction(evt) {
            let stateName = evt.target.getAttribute("id");
            // alert(stateName + " double clicked!");
            document.getElementById("stateNameDiv").innerText = stateName;
        }

        function addData(data) {
            globalVar = data;
            console.log(data);
            let dataObj = data.tables[0].rows;
            for (let i = 0; i < dataObj.length; ++i) {
                if (dataObj[i].state !== "XX" && dataObj[i].state !== "HI") {
                    document.getElementById(dataObj[i].state).classList.add("mapCategory" + dataObj[i].mapvalue);
                }
            }
        }

    };
}());
