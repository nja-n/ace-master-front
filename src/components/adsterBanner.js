// import React, { useEffect } from 'react';

// const AdBanner = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = '//www.highperformanceformat.com/868de074ad8e2d1ab7e50afdd01fc2b2/invoke.js';
//     script.type = 'text/javascript';
//     script.async = true;
//     document.body.appendChild(script);

//     // Cleanup script when component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return <div id="ad-container"></div>;
// };

// export default AdBanner;

import React from 'react';

const AdBanner = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <script type="text/javascript">
            atOptions = {
              'key' : '868de074ad8e2d1ab7e50afdd01fc2b2',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/868de074ad8e2d1ab7e50afdd01fc2b2/invoke.js"></script>
        `,
      }}
    />
  );
};

export default AdBanner;
