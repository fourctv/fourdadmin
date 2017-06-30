// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { WebModule } from './app/fourDAdmin.web.module';

platformNativeScriptDynamic().bootstrapModule(WebModule);
