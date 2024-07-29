// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import { PingAuthenticationConfig } from '@techops-ui/ping-authentication';

const production = window.location.host === 'im.maverick.aa.com';
//const production = false; //non-prod

const pingNonProd: PingAuthenticationConfig = {
  authority: 'https://idptest.aa.com',
  client_id: 'MtlPlngInv-7617204-test-laYjc',
};
const pingProd: PingAuthenticationConfig = {
  authority: 'https://idp.aa.com',
  client_id: 'MtlPlngInv-7617204-prod-mLzLE',
};

let apiEnv = '';
switch (window.location.hostname) {
    case "localhost":
      apiEnv = "https://localhost:60229"; //localhost - swagger url
      //apiEnv = "https://localhost:52096";  
    break;
  case "im.maverick.aa.com":
    apiEnv = "https://im-api.maverick.aa.com";
    break;
  default:
    apiEnv = "https://im-api-np.maverick.aa.com";
    break;
}

export const environment = {
  production: window.location.host !== 'localhost:4200' && window.location.host !== 'localhost' && window.location.host !== 'localhost:80' && window.location.host !== 'localhost:81' && window.location.host !== 'localhost:60229' && window.location.host !== 'im-np.maverick.aa.com' && window.location.host !== 'qxd07000990.corpaa.aa.com',
  //production: false, // localhost
  //production: true, // prod
  ping: {
    automatic_silent_renew: true,
    ...(production ? pingProd : pingNonProd),
  },
  apiEnv,
  nonprod: window.location.host == 'im-np.maverick.aa.com' ? true : false,
  apiURL: window.location.host == 'im-np.maverick.aa.com' ? 'https://im-api-np.maverick.aa.com' : 'https://im-api.maverick.aa.com',
  //'https://im-api-np.maverick.aa.com',  
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
