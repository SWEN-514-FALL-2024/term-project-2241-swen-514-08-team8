import { Product } from '../components/products';
import { Cart } from '../components/products';
import { CartItem } from '../components/checkout';
import { SERVER_URL } from '../constants';

// All endpoints provided by fakestoreapi.com
export function useProducts() {
  // Change the urls to our API Gateway endpoints
  async function getProducts() {
    return await getData(SERVER_URL + '/products/');
  }

  async function getProductById(id: number) {
    return await getData(`${SERVER_URL}/products/${id}`);
  }

  async function createProduct(product: Omit<Product, "id">) {
    return await getData(`${SERVER_URL}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
  }

  return {
    getProducts,
    getProductById,
    createProduct
  };
}

export function useCart(){
  async function addToCart(prodId : Cart) {
    return await getData(`${SERVER_URL}/cart/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prodId),
    });
  }

  async function getCart() { 
    return await getData(SERVER_URL + '/cart/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`,
        'Content-Type': 'application/json',
      },
      body: null,
    });
  }

  async function updateAddedCart(prodId : CartItem) { 
    return await getData(SERVER_URL + '/cart/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prodId),
    });
  }

  return {
    addToCart,
    getCart,
    updateAddedCart
  };
}

type RequestResult = {
  json: object;
  success: boolean;
};

/**
 * Fetch helper method.
 * @param url Url to Reach
 * @param options CRUD options
 * @returns
 */
async function getData(
  url: string,
  options?: RequestInit
): Promise<RequestResult> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      json: data,
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      json: {},
      success: false,
    };
  }
}
