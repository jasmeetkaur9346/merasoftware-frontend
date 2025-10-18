import { Cookies } from 'react-cookie';

const COOKIE_DOMAIN = process.env.REACT_APP_COOKIE_DOMAIN || undefined;
const cookies = new Cookies();

const DEFAULT_CONFIG = {
  path: '/',
  secure: true,
  sameSite: 'none',
  domain: COOKIE_DOMAIN,
};

class CookieManager {
  static setUserDetails(userDetails) {
    const minimalUserData = {
      id: userDetails.id,
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role,
    };

    cookies.set('user-details', minimalUserData, {
      ...DEFAULT_CONFIG,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static setCartItems(cartItems) {
    cookies.set('cart-items', cartItems, {
      ...DEFAULT_CONFIG,
      maxAge: 48 * 60 * 60 * 1000,
    });
  }

  static get(name) {
    return cookies.get(name);
  }

  static remove(name) {
    cookies.remove(name, {
      path: '/',
      secure: true,
      sameSite: 'none',
      domain: COOKIE_DOMAIN,
    });
  }

  static clearAll() {
    ['user-details', 'cart-items'].forEach((name) => {
      this.remove(name);
    });
  }
}

export default CookieManager;
