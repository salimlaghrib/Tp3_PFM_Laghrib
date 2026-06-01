// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice2Conversion {
    uint public lastWei;
    uint public lastEther;

    event EtherEnWei(uint montantEther, uint resultatWei);
    event WeiEnEther(uint montantWei, uint resultatEther);

    function etherEnWei(uint montantEther) public pure returns (uint) {
        return montantEther * 1 ether;
    }

    function etherEnWeiTx(uint montantEther) public returns (uint) {
        lastWei = montantEther * 1 ether;
        emit EtherEnWei(montantEther, lastWei);
        return lastWei;
    }

    function weiEnEther(uint montantWei) public pure returns (uint) {
        return montantWei / 1 ether;
    }

    function weiEnEtherTx(uint montantWei) public returns (uint) {
        lastEther = montantWei / 1 ether;
        emit WeiEnEther(montantWei, lastEther);
        return lastEther;
    }
}
