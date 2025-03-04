class AccountService {
  static async getAllAccounts() {
    return await window.electronAPI.getAllAccounts();
  }

  static async addAccount(account) {
    return await window.electronAPI.addAccount(account);
  }

  static async updateAccount(account) {
    return await window.electronAPI.updateAccount(account);
  }

  static async deleteAccount(id) {
    return await window.electronAPI.deleteAccount(id);
  }

  static async updateAccountBalance(accountId, profitPercent) {
    try {
      // Отримуємо поточний акаунт
      const account = await window.electronAPI.getAccountById(accountId);
      
      if (!account) {
        throw new Error('Account not found');
      }

      // Розраховуємо прибуток/збиток в доларах від початкового currentEquity
      const profitAmount = (account.currentEquity * profitPercent) / 100;
      
      // Оновлюємо баланс
      const newBalance = account.balance + profitAmount;
      
      // Оновлюємо акаунт з новим балансом, але залишаємо currentEquity незмінним
      const updatedAccount = {
        ...account,
        balance: newBalance
      };

      return await window.electronAPI.updateAccount(updatedAccount);
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw error;
    }
  }

  static calculateProfitAmount(currentEquity, profitPercent) {
    return (currentEquity * profitPercent) / 100;
  }
}

export default AccountService; 