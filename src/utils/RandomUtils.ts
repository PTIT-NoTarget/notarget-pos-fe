export const RandomUtils = {
  generateRandomString(length: number = 8): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  },
  generatePaymentUid(): string {
    let dateStr: number = Date.now();
    return "UID" + this.generateRandomString(25 - dateStr.toString().length) + Date.now();
  },
};
