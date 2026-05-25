// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice5Parite {
    function estPair(uint nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }
}
