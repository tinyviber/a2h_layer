import { o as object, s as string } from "../_libs/zod.mjs";
import { a as listRuns, n as getRun } from "./run-store-lbcundTN.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-functions-CXn30WOj.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listRunsFn_createServerFn_handler = createServerRpc({
	id: "d748faf6a7dfce2c993afa8e5398f9302a6d468c7d20ae0f5c92a2dc884ef011",
	name: "listRunsFn",
	filename: "src/lib/run-functions.ts"
}, (opts) => listRunsFn.__executeServer(opts));
var listRunsFn = createServerFn({ method: "GET" }).handler(listRunsFn_createServerFn_handler, async () => {
	return listRuns();
});
var getRunFn_createServerFn_handler = createServerRpc({
	id: "28d9a41ba979249265dc9b70e4cd1858f0fa764906c54f5ecc12f1482ab09b14",
	name: "getRunFn",
	filename: "src/lib/run-functions.ts"
}, (opts) => getRunFn.__executeServer(opts));
var getRunFn = createServerFn({ method: "GET" }).validator(object({ id: string().min(1) })).handler(getRunFn_createServerFn_handler, async ({ data }) => {
	return getRun(data.id);
});
//#endregion
export { getRunFn_createServerFn_handler, listRunsFn_createServerFn_handler };
