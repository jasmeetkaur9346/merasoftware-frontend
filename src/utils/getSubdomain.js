const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');

  // Localhost check
  if (host.includes('localhost')) {
    return 'localhost'; // fallback for local testing
  }

  // e.g. admin.merasoftware.com => admin
  if (parts.length >= 3) {
    return parts[0];
  }

  return 'main'; // main domain
};

export default getSubdomain;