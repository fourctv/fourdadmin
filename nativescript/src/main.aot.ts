// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from 'nativescript-angular/platform-static';

import { WebModuleNgFactory } from './app/fourDAdmin.web.module.ngfactory';

platformNativeScript().bootstrapModuleFactory(WebModuleNgFactory);
