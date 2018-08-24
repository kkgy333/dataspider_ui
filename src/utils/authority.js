// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('dataspider-authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('dataspider-authority', authority);
}

export function getToken() {
  return localStorage.getItem('dataspider-token') || '';
}

export function setToken(token) {
  return localStorage.setItem('dataspider-token', token);

}
