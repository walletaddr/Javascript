/**
 * Website: http://walletaddr.com/
 * GitHub: http://github.com/walletaddr
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @author Kevin Fung <https://github.com/mrfungbob>
 * @contributor Robert Huang <https://github.com/sagwwaa>
 * @version 1.0
 */

function doShortcode() {
	var inputString = document.getElementById("btcAddress").value;

	//check for valid BTC address or return error
	var addressRegex = /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g;
  	var found = inputString.match(addressRegex);
  	if(typeof(found) == 'undefined' || found == null){
  		document.getElementById("result").innerHTML = "<br>Error: Invalid BTC Address";
  		return;
	}

	inputString = inputString.slice(1);
	var letterResult = findLetters(inputString);
	var numberResult = findNumbers(inputString);

	var finalString = "";	//if first character is letter, add letter first
	if(inputString.charAt(0).match(/[A-Za-z]/g)){
		finalString = letterResult + " " + numberResult;
	}
	else{
		finalString = numberResult + " " + letterResult;
	}

	document.getElementById("result").innerHTML = "<br>BTC Shortcode: "+finalString;
}

function findNumbers(inputString) {
	var numberArray = inputString.match(/[1-9]+/g);
	var numbersLength = numberArray.length;

	var finalNumberArray = [];

	//save first character
	finalNumberArray.push(numberArray[0]);

	//find middle number and save
	if(numbersLength > 2){
		var middleNumbersArray = [];
		var middleNumberTable = {};
		for(var n = 1; n < numberArray.length -1; n++){
			if(middleNumberTable.hasOwnProperty(numberArray[n])){
				middleNumberTable[numberArray[n]] +=1;
			}
			else{
				middleNumberTable[numberArray[n]] = 1;
			}
			middleNumbersArray.push(numberArray[n]);
		}
		//remove duplicate middle numbers before proceeding
		for(var m = middleNumbersArray.length - 1; m >= 0; m--){
			if(middleNumberTable[middleNumbersArray[m]] > 1){
				middleNumbersArray.splice(m,1);
			}
		}
		//if we have middle numbers left, find the max
		if(middleNumbersArray.length > 0){
			var middleNumber = Math.max(...middleNumbersArray);
			finalNumberArray.push(middleNumber.toString());
		}

	}

	if(numbersLength > 1){
		finalNumberArray.push(numberArray[numbersLength - 1].toString());
	}
	var result = formatNumbers(finalNumberArray);

	return result;


}
function findLetters(inputString) {
	var letterBlocksArray = inputString.match(/[A-Za-z]+/g);
	var letterArray = inputString.match(/[A-Z]+|[a-z]+/g);
	var letterUppercaseArray = inputString.match(/[A-Z]+/g);
	var letterLowercaseArray = inputString.match(/[a-z]+/g);

	//check the case of the character in the string, assign upper or lower
	var firstCharacter = letterBlocksArray[0].charAt(0);
	var lastCharacter = letterBlocksArray[letterBlocksArray.length-1].charAt(letterBlocksArray[letterBlocksArray.length-1].length-1);
	var isFirstLowerCase = firstCharacter == firstCharacter.toLowerCase();
	var isLastLowerCase = lastCharacter == lastCharacter.toLowerCase();

	var firstBlock = letterArray[0];
	var secondBlock = "";
	var thirdBlock = "";
	var lastBlock = letterArray[letterArray.length-1];
	var finalLetterBlock = "";
	//if the first char is lowercase, then it's safe to assume that the first element of the split array is the first block
	//The second block can be assumed to be the first element of the opposite case
	if(isFirstLowerCase){
		secondBlock = letterUppercaseArray[0];
	}else{
		secondBlock = letterLowercaseArray[0];
	}

	if(isLastLowerCase){
		thirdBlock = letterUppercaseArray[letterUppercaseArray.length-1];
	}else{
		thirdBlock = letterLowercaseArray[letterLowercaseArray.length-1];
	}

	//if the first whole block is bigger than the first letter block then the first and second block are probably together
	if(letterBlocksArray[0].length > firstBlock.length){
		finalLetterBlock = firstBlock + secondBlock;
	}
	else{
		finalLetterBlock = firstBlock +"-" +secondBlock;
	}

	//check second and third block to see if case is the same
	var secondCharacter = secondBlock.charAt(0);
	var thirdCharacter = thirdBlock.charAt(0);
	var isSecondLowerCase = secondCharacter == secondCharacter.toLowerCase();
	var isThirdLowerCase = thirdCharacter == thirdCharacter.toLowerCase();
	//if they are both not the same case then add a "-"
	if(!(isSecondLowerCase && isThirdLowerCase) && !(!isSecondLowerCase && !isThirdLowerCase)){
		finalLetterBlock += "-";
	}

	//if last element of the letter block is bigger than the lastBlock length, then it's probably in the same chunk
	if(letterBlocksArray[letterBlocksArray.length-1].length > lastBlock.length){
		finalLetterBlock += thirdBlock + lastBlock;
	}
	else{
		finalLetterBlock += thirdBlock +"-" + lastBlock;
	}

	return finalLetterBlock;
}

//check combined string length
function requiresNumberChunking(inputString1, inputString2) {
  var totalStringLength = inputString1.length + inputString2.length;
  if(totalStringLength > 4){
  	return true;
  }
  else{
  	return false;
  }
}

//iterate through array to determine chunking
//if required then add "-". If not then combine strings and add to next iteration
function formatNumbers(stringArray) {
	//return if only one element
	if(stringArray.length <= 1){
		return stringArray[0].toString();
	}

	var resultString = "";
	for(var i = 0; i < stringArray.length-1; i++){
		if(requiresNumberChunking(stringArray[i],stringArray[i+1])){
			resultString += stringArray[i]+"-";
		}
		else{
			stringArray[i+1] = stringArray[i]+stringArray[i+1];
		}
	}
	//don't forget to add the last number in
	resultString += stringArray[stringArray.length-1];
	return resultString;
}
