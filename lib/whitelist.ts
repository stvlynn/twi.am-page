/**
 * 允许重定向的安全URL白名单
 * 用于登录后重定向回应用程序
 */

// 允许重定向的域名和路径前缀
export const REDIRECT_WHITELIST = [
  // 主域名
  'https://twi.am',
  // 应用子域名
  'https://app.twi.am',
  'https://mbti.twi.am',
  'https://doodle.twi.am',
  // 环境变量中设置的APP_URL
  process.env.NEXT_PUBLIC_APP_URL,
];

/**
 * 验证URL是否在白名单中
 * @param url 要验证的URL
 * @returns 如果URL在白名单中则返回true，否则返回false
 */
export function isUrlInWhitelist(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return REDIRECT_WHITELIST.some(whitelistedUrl => {
      // 如果whitelistedUrl为undefined（例如环境变量未设置），跳过
      if (!whitelistedUrl) return false;
      
      // 检查URL是否以白名单中的URL开头
      return url.startsWith(whitelistedUrl);
    });
  } catch (error) {
    // 如果URL格式无效，返回false
    console.error('Invalid URL format:', error);
    return false;
  }
}

/**
 * 获取安全的重定向URL，如果不在白名单中则返回根路径
 * @param url 要检查的URL
 * @returns 安全的重定向URL
 */
export function getSafeRedirectUrl(url: string | null): string {
  if (!url) return '/';
  
  return isUrlInWhitelist(url) ? url : '/';
} 