import alpine from 'alpinejs';

import './lib/banner.js';
import './lib/header.js';
import {logger} from './lib/logger.js';
import './lib/quick-link.js';
import './lib/register-service-worker.js';

logger.logModule?.('common');

alpine.start();
