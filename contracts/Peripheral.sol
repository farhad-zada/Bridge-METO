// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {ISOTO} from "./ISOTO.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

///@dev Lock address for Sepolia 0x60D4ffa780d25c29a3fe2F6e53bB74D8469D12A8
contract Peripheral is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    error InvalidChainId(uint256 id); // This error indicates that the given id was not included into chainIds
    error InsufficientAllowance(uint256 allowance); // This error indicates that the allownce was less than the amount to be transferred
    error InsufficentFee(uint256 fee);
    error InsufficiendFunds(uint256 balance);
    error InsufficentAmount(uint256 amount);
    error NotAdmin(address who);

    uint256 public index;
    uint256 public totalLocked;

    ISOTO public soto;

    struct Chain {
        uint256 id;
        string name;
        uint256 fee;
        bool status;
    }

    mapping(uint256 => Chain) public chains;
    mapping(address => uint256[]) public transfersOut;
    mapping(address => uint256[]) public transfersIn;
    mapping(address => bool) private adminAddresses;

    event Sent(
        uint256 messageId,
        uint256 chainId,
        address destination,
        address from,
        address to,
        uint256 amount
    );

    event Accepted(
        uint256 messageId,
        uint256 chainId,
        address source,
        address from,
        address to,
        uint256 amount
    );

    event ChainId(uint256 chainId, Chain chain);

    event AdminSet(address who, bool status);

    modifier admin(address who) {
        if (!adminAddresses[who]) revert NotAdmin(who);
        _;
    }

    constructor() {
        _disableInitializers();
    }

    function initialize(address _token) public initializer {
        soto = ISOTO(_token);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

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
    ) public payable {
        ///@dev check if chain ID is a valid ID supported by contract
        if (!chains[chainId].status) revert InvalidChainId(chainId);
        if (chains[chainId].fee > msg.value)
            revert InsufficentFee(chains[chainId].fee);

        ///@dev check if the msg.sender has enough allowance, more or equal to amount
        uint256 balance = soto.balanceOf(msg.sender);
        if (balance < amount) revert InsufficientAllowance(balance);
        totalLocked -= amount;
        index++;
        transfersOut[msg.sender].push(index);
        soto.burnOf(msg.sender, amount);

        emit Sent(index, chainId, destination, msg.sender, receiver, amount);
    }

    function accept(
        uint256 messageId,
        uint256 chainId,
        address source,
        address from,
        address to,
        uint256 amount
    ) public admin(msg.sender) {
        totalLocked += amount;
        transfersIn[from].push(messageId);
        soto.mint(to, amount);
        emit Accepted(messageId, chainId, source, from, to, amount);
    }

    function setChainId(
        uint256 id,
        string memory name,
        uint256 fee,
        bool status
    ) public {
        chains[id] = Chain(id, name, fee, status);
        emit ChainId(id, chains[id]);
    }

    function setAdmin(address who, bool status) public onlyOwner {
        adminAddresses[who] = status;
        emit AdminSet(who, status);
    }

    function withdraw(
        address token,
        address payable to,
        uint256 amount
    ) public payable onlyOwner returns (bool) {
        if (amount <= 0) revert InsufficentAmount(amount);
        if (token == address(0)) {
            if (address(this).balance < amount)
                revert InsufficiendFunds(address(this).balance);
            address owner = owner();
            (bool success, ) = owner.call{value: amount}("");
            require(success, "ETH transfer failed");
            return true;
        }
        if (IERC20Upgradeable(token).balanceOf(address(this)) < amount)
            revert InsufficiendFunds(address(this).balance);
        IERC20Upgradeable(token).transfer(to, amount);
        return true;
    }

    // Function to receive ETH in the contract (optional)
    receive() external payable {}
}
