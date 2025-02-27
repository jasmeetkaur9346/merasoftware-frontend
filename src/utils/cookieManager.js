import { Cookies } from 'react-cookie';
const cookies = new Cookies();
// API के अनुसार base configuration
const DEFAULT_CONFIG = {
  path: '/',
  secure: true,
  sameSite: 'none',
//   httpOnly: true
};
class CookieManager {
//   static setUserToken(token) {
//     cookies.set('token', token, {
//       ...DEFAULT_CONFIG,
//       maxAge: 365 * 24 * 60 * 60 * 1000  
//     });
//   }
  // User Details - कम समय के लिए
  static setUserDetails(userDetails) {
    const minimalUserData = {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
        // Don't store profile pic in cookie - it's too large
        // Don't store wallet balance - it's handled by backend
      };
    cookies.set('user-details', minimalUserData, {
      ...DEFAULT_CONFIG,
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
  }
  // Cart Items - temporary storage
  static setCartItems(cartItems) {
    cookies.set('cart-items', cartItems, {
      ...DEFAULT_CONFIG,
      maxAge: 48 * 60 * 60 * 1000  // 48 hours
    });
  }
  // Wallet Balance - regular updates
//   static setWalletBalance(balance) {
//     cookies.set('wallet-balance', balance, {
//       ...DEFAULT_CONFIG,
//       maxAge: 24 * 60 * 60 * 1000  
//     });
//   }
  // Get any cookie
  static get(name) {
    return cookies.get(name);
  }
  // Remove specific cookie
  static remove(name) {
    cookies.remove(name, { path: '/', sameSite: 'none', secure: true });
  }
  // Clear all cookies
  static clearAll() {
    ['user-details', 'cart-items'].forEach(name => {
      this.remove(name);
    });
  }
}
export default CookieManager;