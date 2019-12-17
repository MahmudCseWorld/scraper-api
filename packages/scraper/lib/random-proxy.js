const proxyChain = require("proxy-chain");

const { proxies } = require("../proxies.json");

const stringifyProxy = proxy =>
  `${proxy.username}:${proxy.password}@${proxy.address}:${proxy.port}`;

const randProxy = proxies =>
  proxies[Math.floor(Math.random() * proxies.length)];

const getProxy = async () => {
  const proxy = stringifyProxy(randProxy(proxies));
  return proxyChain.anonymizeProxy(`http://${proxy}`);
};

module.exports = getProxy;
