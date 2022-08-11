function check(Component) {
	return !!Component['astro:php'];
}

async function renderToStaticMarkup(Component, props, slotted) {
	return { html: Component.code };
}

export default {
	check,
	renderToStaticMarkup,
};
