// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import { PingAuthenticationConfig } from '@techops-ui/ping-authentication';

const production = true;

const pingProd: PingAuthenticationConfig = {
  authority: 'https://idp.aa.com',
  client_id: 'MtlPlngInv-7617204-prod-mLzLE',
};
let apiEnv = 'https://im-api.maverick.aa.com';

export const environment = {
  production,
  ping: {
    automatic_silent_renew: true,
    pingProd,
  },
  apiEnv,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
