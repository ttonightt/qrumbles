export const isFunction = func => {
	return !!(func && func.constructor && func.call && func.apply);
};