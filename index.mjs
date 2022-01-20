import moment from "moment";
import axios from "axios";
import Web3 from "web3";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

/**
 * MODIFY YOUR DEVICE INFORMATION HERE
 * {BNS_SERVER_URL}: bns server base url provided by itm, do not put a slash at the end
 * {PRIVATE_KEY}: 64 hex characters
 * {CALLER_ADDRESS}: your client device wallet address, must be paired with your PRIVATE_KEY
 */

const BNS_SERVER_URL = "https://bns.itrustmachines.com";
const PRIVATE_KEY = "PUT_YOUR_PRIVATE_KEY_HERE";
const CALLER_ADDRESS = "PUT_YOUR_WALLET_ADDRESS_HERE";

const cookieJar = new CookieJar();
const api = wrapper(
  axios.create({
    baseURL: BNS_SERVER_URL,
    withCredentials: true,
    jar: cookieJar,
    headers: { "device-type": "sdk" }, // this is required to communicate with bns server
  })
);

const web3 = new Web3();

const signData = (toSignMessage) => {
  return web3.eth.accounts.sign(toSignMessage, PRIVATE_KEY);
};

const login = async (address) => {
  var toSignMessage = `I confirm that I am the owner of the following address:${address}, and I agree to login to Blockchain Notary with this wallet address. Validate timestamp:${moment(
    moment.now()
  ).format("x")}.`;
  var signature = signData(toSignMessage);
  var res = await api.post("/account/login", {
    address: address,
    sig: {
      r: signature.r.slice(2),
      s: signature.s.slice(2),
      v: signature.v.slice(2),
    },
    toSignMessage: toSignMessage,
  });
  return res.data;
};

const getClearanceOrderAndSn = async (indexValueKey) => {
  var res = await api.get(`/clearanceOrderAndSn/${indexValueKey}`);
  return res.data;
};

const ledgerInput = async (
  address,
  indexValue,
  clearanceOrder,
  cmd,
  metadata,
  timestamp
) => {
  console.log(
    "ledgerInput start, indexValue=",
    indexValue,
    "clearanceOrder=",
    clearanceOrder
  );
  // sign message, the order is important, do not change the order, or signature verification will fail
  var ledgerInputMessage =
    address + timestamp + cmd + indexValue + metadata + clearanceOrder;
  var ledgerInputSignature = signData(ledgerInputMessage);

  var res = await api.post("/input", {
    callerAddress: address,
    timestamp: timestamp,
    clearanceOrder: clearanceOrder,
    cmd: cmd,
    indexValue: indexValue,
    metadata: metadata,
    sigClient: {
      r: ledgerInputSignature.r.slice(2),
      s: ledgerInputSignature.s.slice(2),
      v: ledgerInputSignature.v.slice(2),
    },
  });

  return res.data;
};

const run = async () => {
  /**
   * PLEASE MAKE SURE YOU USE LOWERCASE ADDRESS AND INDEX VALUE KEY
   **/
  var callerAddress = CALLER_ADDRESS.toLocaleLowerCase();
  var indexValueKey = callerAddress;
  /** 1. Login to server, this is very important. **/
  await login(callerAddress);

  /** 2. Get clearanceOrder and sn from spo server api**/
  var clearanceOrderAndSn = await getClearanceOrderAndSn(indexValueKey);
  console.log("getClearanceOrderAndSn response=", clearanceOrderAndSn);

  /**3. Prepare ledger input request data and sign message
   * MODIFY DATA YOU WANT TO ATTEST HERE
   * {indexValue}: This is important for your data to be located in the right place in TP-Merkle-Tree,
   *               and it should always be as the following format "{indexValueKey}_R{sn}"
   * {cmd}: Messages you want to attest, if there are multiple columns, we highly suggest you use JSON format to specify them
   * **/
  var indexValue = indexValueKey + "_R" + clearanceOrderAndSn.sn;
  var timestamp = Date.now();

  // edit data you want to attest here
  const cmdObject = {
    text: "Put some messages here for attestation",
    description: "here is a description",
    otherField: "Put other fields if needed",
    timestamp: timestamp,
    callerAddress: callerAddress,
  };
  // make sure CMD is in JSON format!!
  var cmd = JSON.stringify(cmdObject);
  console.log(cmd);

  var metadata = "More description of this attestation data";
  var ledgerInputResponse = await ledgerInput(
    callerAddress,
    indexValue,
    clearanceOrderAndSn.clearanceOrder,
    cmd,
    metadata,
    timestamp
  );
  console.log("ledgerInputResponse=", ledgerInputResponse);
};

run();
