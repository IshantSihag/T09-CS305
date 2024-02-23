function generateID() {
  const timestamp = new Date().getTime().toString().slice(-6); // Taking the last 6 digits of the current timestamp
  const randomNumber = Math.floor(Math.random() * 100); // Generating a random number between 0 to 99
  const paddedRandomNumber = randomNumber.toString().padStart(2, '0'); // Ensuring the random number is 2 digits

  const generatedID = `JB${timestamp}${paddedRandomNumber}`;
  return generatedID;
}

function generateTestID() {
  const timestamp = new Date().getTime().toString().slice(-6); // Taking the last 6 digits of the current timestamp
  const randomNumber = Math.floor(Math.random() * 100); // Generating a random number between 0 to 99
  const paddedRandomNumber = randomNumber.toString().padStart(2, '0'); // Ensuring the random number is 2 digits

  const generatedID = `TS${timestamp}${paddedRandomNumber}`;
  return generatedID;
}


export { generateID,generateTestID }