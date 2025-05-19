import React, { useEffect } from 'react';

function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1603709474206949"
      data-ad-slot="7123127725"
      data-ad-format="auto"
      data-full-width-responsive="true">
    </ins>
  );
}

export default AdBanner;
