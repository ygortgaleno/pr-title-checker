import * as core from '@actions/core';
import * as github from '@actions/github';

export const validateTitlePrefix = (title: string, prefix: string): boolean => title.toLowerCase().startsWith(prefix.toLowerCase());

export const validateEvent = () => {
	const validEvent = ['pull_request'];
	const {eventName} = github.context;
	core.info(`Event name: ${eventName}`);
	if (!validEvent.includes(eventName)) {
		throw new Error(`Invalid event: ${eventName}`);
	}
};

export const getPullRequestTitle = async (): Promise<string> => {
	const authToken = core.getInput('github_token', {required: true});
	const client = github.getOctokit(authToken);

	const owner = github.context.payload.repository?.owner.login;
	if (!owner) {
		throw new Error('Owner repo not found');
	}

	const {repo} = github.context.repo;
	const pullNumber = github.context.payload.pull_request?.number;
	if (!pullNumber) {
		throw new Error('Pullnumber not found');
	}

	const {data: pullRequest} = await client.rest.pulls.get({
		owner,
		repo,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		pull_number: pullNumber,
	});

	return pullRequest.title;
};

export const testPullRequestTitleRegex = (pullRequestTitle: string) => {
	const regexInput = core.getInput('regex');
	const regex = RegExp(regexInput);
	if (!regex.test(pullRequestTitle)) {
		throw new Error(`Pull Request title "${pullRequestTitle}" failed to pass match regex - ${regexInput}`);
	}
};

export const isIgnoredPrefix = (pullRequestTitle: string): boolean => {
	const ignoredPrefixesList = core.getInput('ignored_prefixes');
	core.info(`Ignored Prefixes: ${ignoredPrefixesList}`);
	if (!ignoredPrefixesList.length) {
		return false;
	}

	return ignoredPrefixesList.split(',').some(prefix => validateTitlePrefix(pullRequestTitle, prefix));
};

export const isAllowedPrefix = (pullRequestTitle: string): boolean => {
	const allowedPrefixes = core.getInput('allowed_prefixes');
	core.info(`Allowed Prefixes: ${allowedPrefixes}`);
	if (allowedPrefixes.length) {
		return true;
	}

	return allowedPrefixes.split(',').some(prefix => validateTitlePrefix(pullRequestTitle, prefix));
};
