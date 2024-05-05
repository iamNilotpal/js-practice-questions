function generateKey(url, config = {}) {
  const keys = Object.keys(config);
  let configKey = '';
  keys.map((key) => (configKey += `${key}:${config[key]}`));
  return `${url}-${configKey}`;
}

async function makeAPICall(path, config = {}) {
  try {
    const response = await fetch(path, config);
    return response.json();
  } catch (error) {
    console.log('Error : ', error);
    return null;
  }
}

function cacheAPICall(timeout) {
  const cache = new Map();
  return async (path, config) => {
    const key = generateKey(path, config);
    const inCache = cache.has(key);

    if (!inCache) {
      const data = await makeAPICall(path, config);
      cache.set(key, { expiry: timeout + Date.now(), data });
      return { ...cache.get(key), fromCache: false };
    }

    const cacheData = cache.get(key);
    if (cacheData.expiry > Date.now()) return { ...cacheData, fromCache: true };

    const data = await makeAPICall(path, config);
    cache.set(key, { expiry: timeout + Date.now(), data });
    return { ...cache.get(key), fromCache: false };
  };
}

const fetchWithCache = cacheAPICall(500);

async function main() {
  let data = await fetchWithCache(
    'https://jsonplaceholder.typicode.com/todos/1'
  );
  console.log('First API call : ', data);

  await new Promise((rs) => setTimeout(rs, 2000));
  data = await fetchWithCache('https://jsonplaceholder.typicode.com/todos/1');
  console.log('Second API call : ', data);

  setTimeout(async () => {
    data = await fetchWithCache('https://jsonplaceholder.typicode.com/todos/1');
    console.log('Third API call : ', data);
  }, 3000);

  setTimeout(async () => {
    data = await fetchWithCache('https://jsonplaceholder.typicode.com/todos/1');
    console.log('Fourth API call : ', data);
  }, 6000);
}

main();
