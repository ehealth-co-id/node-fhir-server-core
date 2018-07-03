const { route_args, common_args, write_args, search_args } = require('../common.arguments');
const { read_scopes, write_scopes } = require('../common.scopes');
const { CONFIG_KEYS, VERSIONS } = require('../../../constants');
const resource_specific_args = require('./valueset.arguments');
const controller = require('./valueset.controller');

let write_only_scopes = write_scopes('ValueSet');
let read_only_scopes = read_scopes('ValueSet');

let search_args_array = Object.getOwnPropertyNames(search_args)
    .map((arg_name) => Object.assign({ versions: VERSIONS.STU3 }, search_args[arg_name]));

let common_args_array = Object.getOwnPropertyNames(common_args)
	.map((arg_name) => common_args[arg_name]);

let resource_args_array = Object.getOwnPropertyNames(resource_specific_args)
	.map((arg_name) => Object.assign({ versions: VERSIONS.STU3 }, resource_specific_args[arg_name]));

const resource_all_arguments = [
    route_args.BASE,
    ...search_args_array,
    ...common_args_array,
    ...resource_args_array,
];

let routes = [
	{
		type: 'get',
		path: '/:base/valueset',
		args: resource_all_arguments,
		scopes: read_only_scopes,
		controller: controller.search
	},
	{
		type: 'post',
		path: '/:base/valueset/_search',
		args: resource_all_arguments,
		scopes: read_only_scopes,
		controller: controller.search
	},
    {
        type: 'get',
        path: '/:base/valueset/:id/_history/:versionid',
        args: [
            route_args.BASE,
            route_args.ID,
            route_args.VERSION_ID
        ],
        scopes: read_only_scopes,
        controller: controller.searchByVersionId
    },
    {
        type: 'get',
        path: '/:base/valueset/_history',
        args: resource_all_arguments,
        scopes: read_only_scopes,
        controller: controller.history
    },
    {
        type: 'get',
        path: '/:base/valueset/:id/_history',
        args: resource_all_arguments,
        scopes: read_only_scopes,
        controller: controller.historyById
    },
	{
		type: 'get',
		path: '/:base/valueset/:id',
		args: [
			route_args.BASE,
			route_args.ID
		],
		scopes: read_only_scopes,
		controller: controller.searchById
	},
	{
		type: 'post',
		path: '/:base/valueset',
		args: [
			route_args.BASE,
			write_args.RESOURCE_ID,
			write_args.RESOURCE_BODY
		],
		scopes: write_only_scopes,
		controller: controller.create
	},
	{
		type: 'put',
		path: '/:base/valueset/:id',
		args: [
			route_args.ID,
			route_args.BASE,
			write_args.RESOURCE_BODY
		],
		scopes: write_only_scopes,
		controller: controller.update
	},
	{
		type: 'delete',
		path: '/:base/valueset/:id',
		args: [
			route_args.ID,
			route_args.BASE,
			write_args.RESOURCE_BODY
		],
		scopes: write_only_scopes,
		controller: controller.remove
	}
];

/**
 * @name exports
 * @summary ValueSet config
 */
module.exports = {
	routeOptions: {
		profileKey: CONFIG_KEYS.VALUESET
	},
	routes
};
