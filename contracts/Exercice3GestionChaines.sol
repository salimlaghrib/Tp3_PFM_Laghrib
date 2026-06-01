// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice3GestionChaines {
    string public message;

    string public lastString;
    uint public lastLength;
    bool public lastComparison;

    event StringComputed(string result);
    event LengthComputed(uint result);
    event ComparisonComputed(bool result);

    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }

    function concatenerTx(string memory a, string memory b) public returns (string memory) {
        lastString = string.concat(a, b);
        emit StringComputed(lastString);
        return lastString;
    }

    function concatenerAvec(string memory autre) public view returns (string memory) {
        return string.concat(message, autre);
    }

    function concatenerAvecTx(string memory autre) public returns (string memory) {
        lastString = string.concat(message, autre);
        emit StringComputed(lastString);
        return lastString;
    }

    function longueur(string memory s) public pure returns (uint) {
        return bytes(s).length;
    }

    function longueurTx(string memory s) public returns (uint) {
        lastLength = bytes(s).length;
        emit LengthComputed(lastLength);
        return lastLength;
    }

    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    function comparerTx(string memory a, string memory b) public returns (bool) {
        lastComparison = keccak256(bytes(a)) == keccak256(bytes(b));
        emit ComparisonComputed(lastComparison);
        return lastComparison;
    }
}
