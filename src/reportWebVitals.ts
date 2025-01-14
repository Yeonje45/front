// reportWebVitals.ts 파일은 웹 애플리케이션의 성능을 모니터링하고 보고하는 데 사용되는 파일이지만, 필수적으로 유지해야 하는 파일은 아닙니다. 
// 만약 성능 측정에 대한 특별한 요구사항이 없고, 이 파일이 필요하지 않다고 판단된다면 삭제해도 됩니다.

import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
