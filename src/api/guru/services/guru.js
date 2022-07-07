'use strict';

/**
 * guru service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::guru.guru');
