import core from '@actions/core';
import {getPullRequestTitle, isAllowedPrefix, isIgnoredPrefix, testPullRequestTitleRegex, validateEvent} from './utils';

const run = async () => {
	try {
		validateEvent();
		const pullRequestTitle = await getPullRequestTitle();
		core.info(`Pull Request title: "${pullRequestTitle}"`);
		testPullRequestTitleRegex(pullRequestTitle);

		if (isIgnoredPrefix(pullRequestTitle)) {
			return;
		}

		if (!isAllowedPrefix(pullRequestTitle)) {
			throw new Error(`Pull Request title "${pullRequestTitle}" did not match any of the prefixes`);
		}

		return;
	} catch (error) {
		core.setFailed((error as Error).message);
	}
};

(async () => {
	await run();
})();
