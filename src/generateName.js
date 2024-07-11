export default (url) => {
  const newURL = new URL(url);
  const { hostname, pathname } = newURL;
  const mHostname = hostname.replace(/(\W)/g, '-');
  const mPathname = pathname.replace(/(\W)/g, '-');
  return `${mHostname}${mPathname}.html`;
};
