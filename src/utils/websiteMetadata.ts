export interface WebsiteMetadata {
  title?: string;
  favicon?: string;
}

const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchWebsiteMetadata = async (url: string): Promise<WebsiteMetadata> => {
  const favicon = await getFaviconUrl(url);
  
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    const html = await response.text();
    const title = parseTitle(html);
    
    return {
      title: title || new URL(url).hostname,
      favicon
    };
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error);
    return {
      title: new URL(url).hostname,
      favicon
    };
  }
};

const getFaviconUrl = async (url: string): Promise<string> => {
  const baseUrl = new URL(url).origin;
  return `https://www.google.com/s2/favicons?domain=${baseUrl}&sz=32`;
};

const parseTitle = (html: string): string | undefined => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  return doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
         doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
         doc.querySelector('title')?.textContent?.trim() ||
         undefined;
};
