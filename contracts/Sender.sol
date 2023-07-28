// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {ISOTO} from "./ISOTO.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

///@dev Sender address for Sepolia 0x8Fe5cB2CA521054b505DB6caA34d916ADad1c6Ec
contract Sender {
    error InvalidChainId(uint256 id); // This error indicates that the given id was not included into chainIds
    error InsufficientAmount(uint256 balance); // This error indicates that the balance was less than the amount to be transferred

    uint256 public index;

    ISOTO public soto = ISOTO(0x02589a13010223b8a60106D6CAf2d51032Ec73ed); //SOTO in sepolia

    mapping(uint256 => bool) public chainIds;

    event Sent(
        uint256 messageId,
        uint256 chainId,
        address destination,
        address from,
        address to,
        uint256 amount
    );

    event ChainId(uint256 chainId, bool status);

    constructor() {
        index = 0;
    }

    ///@notice this function emits a log that is then handled to send the tokens to specified destionation
    ///@dev This function is used to send token to a specified destination chain
    ///@param chainId is ID for the specified destination chain
    ///@param destination is the address of the destination contract which is gonna unlock assets
    ///@param receiver is the address for who the unlock is gonna happen
    ///@param amount is the amount of asset to be transferred

    function send(
        uint256 chainId,
        address destination,
        address receiver,
        uint256 amount
    ) public {
        ///@dev check if chain ID is a valid ID supported by contract
        if (!chainIds[chainId]) revert InvalidChainId(chainId);

        ///@dev check if the msg.sender has enough balance, more or equal to amount
        uint256 balance = soto.balanceOf(msg.sender);
        if (balance < amount) revert InsufficientAmount(balance);

        soto.burnOf(msg.sender, amount);

        index++;
        emit Sent(index, chainId, destination, msg.sender, receiver, amount);
    }

    function setChainId(uint256 id, bool status) public {
        chainIds[id] = status;
        emit ChainId(id, status);
    }
}
