import { useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string };
export default function AssetImage({ src, fallback = '/images/hero-dual-4x4.jpg', onError, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  return <img {...props} src={failed ? fallback : src} onError={e => { if (!failed && src !== fallback) setFailed(true); onError?.(e); }} />;
}
