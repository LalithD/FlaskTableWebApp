(function() {
	"use strict";
	window.onload = function() {
		console.log("table-design.js has loaded.");
		let numCols = document.querySelectorAll("thead tr th").length;
		for (let i = 0; i < numCols; ++i) {
			let elements = document.querySelectorAll(`table td:nth-child(${i})`);
			let maxVal = -Infinity;
			let maxValIndex = [];
			let minVal = Infinity;
			let minValIndex = [];
			for (let j = 0; j < elements.length; ++j) {
				let currVal = parseFloat(elements[j].innerText);
				if (currVal > maxVal) {
					maxVal = currVal;
					maxValIndex = [j];
				}
				if (currVal === maxVal) {
					maxValIndex.push(j);
				}
				if (currVal < minVal) {
					minVal = currVal;
					minValIndex = [j]
				}
				if (currVal === minVal) {
					minValIndex.push(j);
				}
			}
			for (let j = 0; j < maxValIndex.length; ++j) {
				elements[maxValIndex[j]].classList.add("maxValClass");
			}
			for (let j = 0; j < minValIndex.length; ++j) {
				elements[minValIndex[j]].classList.add("minValClass");
			}
		}
	};
}());
