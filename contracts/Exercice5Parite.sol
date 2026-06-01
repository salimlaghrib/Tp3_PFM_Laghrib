// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice5Parite {
    uint public lastNombre;
    bool public lastEstPair;

    event PariteVerifie(uint nombre, bool estPair);

    function estPair(uint nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }

    function estPairTx(uint nombre) public returns (bool) {
        lastNombre = nombre;
        lastEstPair = nombre % 2 == 0;
        emit PariteVerifie(nombre, lastEstPair);
        return lastEstPair;
    }
}
