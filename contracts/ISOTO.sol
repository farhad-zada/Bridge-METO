// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

interface ISOTO is IERC20Upgradeable {
    function mint(address account, uint256 amount) external;

    function burnOf(address account, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}
