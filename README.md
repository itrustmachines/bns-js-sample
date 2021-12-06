# BNS Javascript Sample

This is only a simple sample code for you to develop your own BNS Javascript Application.

## How to Run the Sample Code

1. Install Node JS
2. Run `npm install`
3. Fill in the field `CALLER_ADDRESS` and `PRIVATE_KEY` in `index.mjs` file.
   You can get your wallet address and private key from MetaMask. Follow the step in this article: [How to Export an Account Private Key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)
4. Run `node index.mjs`
5. You will see a console log with the message: `ledgerInputResponse= { status: 'ok', description: 'OK', ...(omit) }` This means the request has succesfully sent to BNS.

## **IMPORTANT RESTRICTION**

**PLEASE DO NOT USE A BROWSER TO SEND REQUEST TO BNS SERVER DIRECTLY.**

**PLEASE DO NOT USE A BROWSER TO SEND REQUEST TO BNS SERVER DIRECTLY.**

**PLEASE DO NOT USE A BROWSER TO SEND REQUEST TO BNS SERVER DIRECTLY.**

According to our security policy, CORS is forbidden, please do not use browser to send request directly to BNS server.

What you should do instead:

1. Create your own NodeJS Server. Receive your request from a frontend page to your own NodeJS server, and send the request to BNS server via this NodeJS server.
2. Use other sdk to implement your BNS client would make your life easier, please refer to:
   - [BNS JAVA SDK](https://github.com/itrustmachines/bns-java-client)
   - [BNS C SDK](https://github.com/itrustmachines/bns-mcu-porting-kit)
3. Based on the sample code, you can create your own bns client in any language.
