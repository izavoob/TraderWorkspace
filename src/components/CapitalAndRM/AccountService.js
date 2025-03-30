class AccountService {
  static async getAllAccounts() {
    return await window.electronAPI.getAllAccounts();
  }

  static async addAccount(account) {
    // Переконаємося, що баланс розраховується правильно
    const startingEquity = parseFloat(account.startingEquity);
    const currentEquity = parseFloat(account.currentEquity);
    account.balance = currentEquity - startingEquity;
    
    return await window.electronAPI.addAccount(account);
  }

  static async updateAccount(account) {
    // Переконаємося, що баланс розраховується правильно
    const startingEquity = parseFloat(account.startingEquity);
    const currentEquity = parseFloat(account.currentEquity);
    account.balance = currentEquity - startingEquity;
    
    return await window.electronAPI.updateAccount(account);
  }

  static async deleteAccount(id) {
    return await window.electronAPI.deleteAccount(id);
  }

  static async getAccountById(id) {
    return await window.electronAPI.getAccountById(id);
  }

  static async updateAccountWithTrade(accountId, trade) {
    try {
      // Перевіряємо, чи трейд має результат Win або Loss
      // (Breakeven та Missed не враховуються)
      if (trade.result !== 'Win' && trade.result !== 'Loss') {
        console.log('Trade result is not Win or Loss, skipping equity update');
        return null;
      }

      // Використовуємо нову функцію з API для оновлення акаунту
      return await window.electronAPI.updateAccountWithTrade(accountId, trade);
    } catch (error) {
      console.error('Error updating account with trade:', error);
      throw error;
    }
  }

  static calculateProfit(currentEquity, startingEquity) {
    const startingEquityValue = parseFloat(startingEquity);
    const currentEquityValue = parseFloat(currentEquity);
    return ((currentEquityValue - startingEquityValue) / startingEquityValue) * 100;
  }
}

export default AccountService; 