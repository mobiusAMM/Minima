/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MobiusBaseBurner,
  MobiusBaseBurnerInterface,
} from "../MobiusBaseBurner";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_emergencyOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recoveryReceiver",
        type: "address",
      },
      {
        internalType: "contract IWrapper",
        name: "_mobiusWrapper",
        type: "address",
      },
      {
        internalType: "contract Minima",
        name: "_router",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_baseToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "MinimaRouter",
    outputs: [
      {
        internalType: "contract Minima",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MobiusWrapper",
    outputs: [
      {
        internalType: "contract IWrapper",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "coin",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "is_killed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "receiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "coin",
        type: "address",
      },
    ],
    name: "recover_balance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "recoveryReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newEmergencyOwner",
        type: "address",
      },
    ],
    name: "setEmergencyOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isKilled",
        type: "bool",
      },
    ],
    name: "setKilled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "minimaAddress",
        type: "address",
      },
    ],
    name: "setMinima",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wrapper",
        type: "address",
      },
    ],
    name: "setMobiusWrapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newReciever",
        type: "address",
      },
    ],
    name: "setReciever",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newRecovery",
        type: "address",
      },
    ],
    name: "setRecovery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001c3c38038062001c3c833981016040819052620000349162000406565b6200004862000042620000d1565b620000d5565b600580546001600160a01b03199081166001600160a01b0389811691909117909255600680548216888416179055600780548216878416179055600280548216868416179055600380548216858416179055600180549091168383161790819055620000c591168360001962000125602090811b62000d2b17901c565b505050505050620006ca565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b801580620001b45750604051636eb1769f60e11b81526001600160a01b0384169063dd62ed3e906200015e9030908690600401620004f2565b60206040518083038186803b1580156200017757600080fd5b505afa1580156200018c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001b29190620004bb565b155b620001dc5760405162461bcd60e51b8152600401620001d39062000621565b60405180910390fd5b620002378363095ea7b360e01b8484604051602401620001fe9291906200050c565b60408051808303601f190181529190526020810180516001600160e01b0319939093166001600160e01b03938416179052906200023c16565b505050565b600062000298826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316620002d860201b62000e8e179092919060201c565b805190915015620002375780806020019051810190620002b9919062000499565b620002375760405162461bcd60e51b8152600401620001d390620005d7565b6060620002e98484600085620002f3565b90505b9392505050565b606082471015620003185760405162461bcd60e51b8152600401620001d3906200055a565b6200032385620003c2565b620003425760405162461bcd60e51b8152600401620001d390620005a0565b600080866001600160a01b03168587604051620003609190620004d4565b60006040518083038185875af1925050503d80600081146200039f576040519150601f19603f3d011682016040523d82523d6000602084013e620003a4565b606091505b509092509050620003b7828286620003c8565b979650505050505050565b3b151590565b60608315620003d9575081620002ec565b825115620003ea5782518084602001fd5b8160405162461bcd60e51b8152600401620001d3919062000525565b60008060008060008060c087890312156200041f578182fd5b86516200042c81620006b1565b60208801519096506200043f81620006b1565b60408801519095506200045281620006b1565b60608801519094506200046581620006b1565b60808801519093506200047881620006b1565b60a08801519092506200048b81620006b1565b809150509295509295509295565b600060208284031215620004ab578081fd5b81518015158114620002ec578182fd5b600060208284031215620004cd578081fd5b5051919050565b60008251620004e88184602087016200067e565b9190910192915050565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03929092168252602082015260400190565b6000602082528251806020840152620005468160408501602087016200067e565b601f01601f19169190910160400192915050565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6040820152651c8818d85b1b60d21b606082015260800190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6040820152691bdd081cdd58d8d9595960b21b606082015260800190565b60208082526036908201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60408201527f20746f206e6f6e2d7a65726f20616c6c6f77616e636500000000000000000000606082015260800190565b60005b838110156200069b57818101518382015260200162000681565b83811115620006ab576000848401525b50505050565b6001600160a01b0381168114620006c757600080fd5b50565b61156280620006da6000396000f3fe608060405234801561001057600080fd5b506004361061011b5760003560e01c8063d95315b7116100b2578063f0d85c8911610081578063f2fde38b11610066578063f2fde38b14610202578063f7260d3e14610215578063fc202cfd1461021d5761011b565b8063f0d85c89146101e7578063f170c85c146101fa5761011b565b8063d95315b7146101b1578063db2f5f79146101b9578063dcabf86b146101cc578063ec88ed4a146101df5761011b565b80639c868ac0116100ee5780639c868ac01461017b578063a0db86f914610183578063a3029aca14610196578063ae8747a0146101a95761011b565b80630959950414610120578063715018a61461013557806389afcb441461013d5780638da5cb5b14610166575b600080fd5b61013361012e366004611103565b610230565b005b6101336102c8565b61015061014b3660046110e7565b610313565b60405161015d9190611233565b60405180910390f35b61016e610797565b60405161015d919061116f565b6101506107a6565b6101336101913660046110e7565b6107c7565b6101336101a43660046110e7565b610840565b61016e61097d565b61016e61098c565b6101506101c73660046110e7565b61099b565b6101336101da3660046110e7565b610b06565b61016e610b8d565b6101336101f53660046110e7565b610b9c565b61016e610c15565b6101336102103660046110e7565b610c24565b61016e610c95565b61013361022b3660046110e7565b610ca4565b610238610797565b6001600160a01b0316336001600160a01b0316148061026157506005546001600160a01b031633145b6102865760405162461bcd60e51b815260040161027d9061128f565b60405180910390fd5b50600780547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674010000000000000000000000000000000000000000179055565b6102d0610ea7565b6001600160a01b03166102e1610797565b6001600160a01b0316146103075760405162461bcd60e51b815260040161027d906113b7565b6103116000610eab565b565b60075460009074010000000000000000000000000000000000000000900460ff16156103515760405162461bcd60e51b815260040161027d90611380565b6040517f70a082310000000000000000000000000000000000000000000000000000000081526000906001600160a01b038416906370a082319061039990339060040161116f565b60206040518083038186803b1580156103b157600080fd5b505afa1580156103c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103e9919061113b565b90506000816103fd57600092505050610792565b6104126001600160a01b038516333085610f13565b6001546001600160a01b0385811691161461058c576001600160a01b0380851660009081526004602090815260408083206002549094168352929052205460ff166104e357600254610491906001600160a01b0386811691167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff610d2b565b6001600160a01b03808516600090815260046020908152604080832060025490941683529290522080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790555b6002546001546040517ffe0291560000000000000000000000000000000000000000000000000000000081526001600160a01b039283169263fe029156926105389289929091169087906000906004016111c1565b602060405180830381600087803b15801561055257600080fd5b505af1158015610566573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058a919061113b565b505b6003546001546040517f70a082310000000000000000000000000000000000000000000000000000000081526001600160a01b0392831692635ed8bda59216907373a210637f6f6b7005512677ba6b3c96bb4aa44b9082906370a08231906105f890309060040161116f565b60206040518083038186803b15801561061057600080fd5b505afa158015610624573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610648919061113b565b6000306040518663ffffffff1660e01b815260040161066b9594939291906111ea565b602060405180830381600087803b15801561068557600080fd5b505af1158015610699573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106bd919061113b565b506006546040517f70a0823100000000000000000000000000000000000000000000000000000000815261078b916001600160a01b0316907373a210637f6f6b7005512677ba6b3c96bb4aa44b906370a082319061071f90309060040161116f565b60206040518083038186803b15801561073757600080fd5b505afa15801561074b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061076f919061113b565b7373a210637f6f6b7005512677ba6b3c96bb4aa44b9190610f3a565b6001925050505b919050565b6000546001600160a01b031690565b60075474010000000000000000000000000000000000000000900460ff1681565b6107cf610ea7565b6001600160a01b03166107e0610797565b6001600160a01b0316146108065760405162461bcd60e51b815260040161027d906113b7565b600680547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b610848610797565b6001600160a01b0316336001600160a01b0316148061087157506005546001600160a01b031633145b61088d5760405162461bcd60e51b815260040161027d9061128f565b600380547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b03838116919091179091556001546040517f095ea7b300000000000000000000000000000000000000000000000000000000815291169063095ea7b3906109279084907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9060040161121a565b602060405180830381600087803b15801561094157600080fd5b505af1158015610955573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610979919061111f565b5050565b6003546001600160a01b031681565b6007546001600160a01b031681565b60006109a5610797565b6001600160a01b0316336001600160a01b031614806109ce57506005546001600160a01b031633145b6109ea5760405162461bcd60e51b815260040161027d9061128f565b6007546040517f70a082310000000000000000000000000000000000000000000000000000000081526001600160a01b038085169263a9059cbb9291169083906370a0823190610a3e90309060040161116f565b60206040518083038186803b158015610a5657600080fd5b505afa158015610a6a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a8e919061113b565b6040518363ffffffff1660e01b8152600401610aab92919061121a565b602060405180830381600087803b158015610ac557600080fd5b505af1158015610ad9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610afd919061111f565b50600192915050565b610b0e610797565b6001600160a01b0316336001600160a01b03161480610b3757506005546001600160a01b031633145b610b535760405162461bcd60e51b815260040161027d9061128f565b600280547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b6002546001600160a01b031681565b610ba4610ea7565b6001600160a01b0316610bb5610797565b6001600160a01b031614610bdb5760405162461bcd60e51b815260040161027d906113b7565b600780547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b6005546001600160a01b031681565b610c2c610ea7565b6001600160a01b0316610c3d610797565b6001600160a01b031614610c635760405162461bcd60e51b815260040161027d906113b7565b6001600160a01b038116610c895760405162461bcd60e51b815260040161027d906112c6565b610c9281610eab565b50565b6006546001600160a01b031681565b610cac610797565b6001600160a01b0316336001600160a01b03161480610cd557506005546001600160a01b031633145b610cf15760405162461bcd60e51b815260040161027d9061128f565b600580547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b801580610dcc57506040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081526001600160a01b0384169063dd62ed3e90610d7a9030908690600401611183565b60206040518083038186803b158015610d9257600080fd5b505afa158015610da6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dca919061113b565b155b610de85760405162461bcd60e51b815260040161027d90611480565b610e898363095ea7b360e01b8484604051602401610e0792919061121a565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610f59565b505050565b6060610e9d8484600085610fe8565b90505b9392505050565b3390565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610f34846323b872dd60e01b858585604051602401610e079392919061119d565b50505050565b610e898363a9059cbb60e01b8484604051602401610e0792919061121a565b6000610fae826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610e8e9092919063ffffffff16565b805190915015610e895780806020019051810190610fcc919061111f565b610e895760405162461bcd60e51b815260040161027d90611423565b60608247101561100a5760405162461bcd60e51b815260040161027d90611323565b611013856110a8565b61102f5760405162461bcd60e51b815260040161027d906113ec565b600080866001600160a01b0316858760405161104b9190611153565b60006040518083038185875af1925050503d8060008114611088576040519150601f19603f3d011682016040523d82523d6000602084013e61108d565b606091505b509150915061109d8282866110ae565b979650505050505050565b3b151590565b606083156110bd575081610ea0565b8251156110cd5782518084602001fd5b8160405162461bcd60e51b815260040161027d919061123e565b6000602082840312156110f8578081fd5b8135610ea081611509565b600060208284031215611114578081fd5b8135610ea08161151e565b600060208284031215611130578081fd5b8151610ea08161151e565b60006020828403121561114c578081fd5b5051919050565b600082516111658184602087016114dd565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b0394851681529290931660208301526040820152606081019190915260800190565b6001600160a01b039586168152938516602085015260408401929092526060830152909116608082015260a00190565b6001600160a01b03929092168252602082015260400190565b901515815260200190565b600060208252825180602084015261125d8160408501602087016114dd565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b6020808252600a908201527f4f6e6c79206f776e657200000000000000000000000000000000000000000000604082015260600190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526010908201527f4275726e65722069732070617573656400000000000000000000000000000000604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b60208082526036908201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60408201527f20746f206e6f6e2d7a65726f20616c6c6f77616e636500000000000000000000606082015260800190565b60005b838110156114f85781810151838201526020016114e0565b83811115610f345750506000910152565b6001600160a01b0381168114610c9257600080fd5b8015158114610c9257600080fdfea264697066735822122064bfa62c4e3a4570efe9604a022213572fd16d87c3bdde7a1d829248af0a1afd64736f6c63430008000033";

type MobiusBaseBurnerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MobiusBaseBurnerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MobiusBaseBurner__factory extends ContractFactory {
  constructor(...args: MobiusBaseBurnerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MobiusBaseBurner";
  }

  deploy(
    _emergencyOwner: string,
    _receiver: string,
    _recoveryReceiver: string,
    _mobiusWrapper: string,
    _router: string,
    _baseToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MobiusBaseBurner> {
    return super.deploy(
      _emergencyOwner,
      _receiver,
      _recoveryReceiver,
      _mobiusWrapper,
      _router,
      _baseToken,
      overrides || {}
    ) as Promise<MobiusBaseBurner>;
  }
  getDeployTransaction(
    _emergencyOwner: string,
    _receiver: string,
    _recoveryReceiver: string,
    _mobiusWrapper: string,
    _router: string,
    _baseToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _emergencyOwner,
      _receiver,
      _recoveryReceiver,
      _mobiusWrapper,
      _router,
      _baseToken,
      overrides || {}
    );
  }
  attach(address: string): MobiusBaseBurner {
    return super.attach(address) as MobiusBaseBurner;
  }
  connect(signer: Signer): MobiusBaseBurner__factory {
    return super.connect(signer) as MobiusBaseBurner__factory;
  }
  static readonly contractName: "MobiusBaseBurner";
  public readonly contractName: "MobiusBaseBurner";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MobiusBaseBurnerInterface {
    return new utils.Interface(_abi) as MobiusBaseBurnerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MobiusBaseBurner {
    return new Contract(address, _abi, signerOrProvider) as MobiusBaseBurner;
  }
}
