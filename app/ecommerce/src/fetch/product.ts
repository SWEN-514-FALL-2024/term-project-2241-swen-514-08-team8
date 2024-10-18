// All endpoints provided by fakestoreapi.com
export function useProducts() {
  // Change the urls to our API Gateway endpoints
  async function getProducts() {
    return await getData("https://fakestoreapi.com/products/");
  }

  async function getProductById(id: number) {
    return await getData(`https://fakestoreapi.com/products/${id}`);
  }

  return {
    getProducts,
    getProductById,
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
