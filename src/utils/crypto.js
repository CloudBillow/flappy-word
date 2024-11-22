// 前端加密代码 (crypto.js)
const SECRET_KEY = '3ab6c89d1e#$@';

// Base64编码
function encodeBase64(str) {
  try {
    return btoa(str); // 移除 encodeURIComponent
  } catch (err) {
    return str;
  }
}

// 添加前缀
function addPrefix(str) {
  const prefix = Math.random().toString(36).slice(2, 10);
  return `${prefix}#${str}`;
}

// 加密函数
export function encrypt(str) {
  try {
    if (!str) return '';

    // 先进行 URL 编码
    const encoded = encodeURIComponent(str);
    const withPrefix = addPrefix(encoded);
    let result = '';

    // XOR 加密
    for (let i = 0; i < withPrefix.length; i++) {
      const charCode = withPrefix.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode);
    }

    // Base64 编码
    return encodeBase64(result);
  } catch (err) {
    console.error('Encryption error:', err);
    return str;
  }
}
