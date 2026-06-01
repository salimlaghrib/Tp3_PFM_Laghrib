// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice4NombrePositif {
    int public lastNombre;
    bool public lastEstPositif;

    event NombrePositifVerifie(int nombre, bool estPositif);

    function estPositif(int nombre) public pure returns (bool) {
        return nombre > 0;
    }

    function estPositifTx(int nombre) public returns (bool) {
        lastNombre = nombre;
        lastEstPositif = nombre > 0;
        emit NombrePositifVerifie(nombre, lastEstPositif);
        return lastEstPositif;
    }
}
