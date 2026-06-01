// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice1Addition {
    uint public nombre1;
    uint public nombre2;

    uint public lastAddition2;

    event Addition2Computed(uint a, uint b, uint result);

    constructor(uint _nombre1, uint _nombre2) {
        nombre1 = _nombre1;
        nombre2 = _nombre2;
    }

    function setNombres(uint _nombre1, uint _nombre2) public {
        nombre1 = _nombre1;
        nombre2 = _nombre2;
    }

    function addition1() public view returns (uint) {
        return nombre1 + nombre2;
    }

    function addition2(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function addition2Tx(uint a, uint b) public returns (uint) {
        lastAddition2 = a + b;
        emit Addition2Computed(a, b, lastAddition2);
        return lastAddition2;
    }
}
