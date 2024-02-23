import Web3 from 'web3';

async function sendTransactionToMetaMask(amount) {
  try {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];

      const destinationAddress = '0x74fb2d1c447b9B6b15A59C05892506d2c311Fe71'; // Replace with the desired destination address

      const txObject = {
        from: account,
        to: destinationAddress,
        value: web3Instance.utils.toWei(amount.toString(), 'ether'),
      };

      const tx = await web3Instance.eth.sendTransaction(txObject);
      console.log(tx);
      return {
        transactionHash: tx.transactionHash,
        amount,
        destinationAddress,
      };
    } else {
      throw new Error('MetaMask not detected');
    }
  } catch (error) {
    throw error;
  }
}




export {sendTransactionToMetaMask};
