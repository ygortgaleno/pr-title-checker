"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedPrefix = exports.isIgnoredPrefix = exports.testPullRequestTitleRegex = exports.getPullRequestTitle = exports.validateEvent = exports.validateTitlePrefix = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const validateTitlePrefix = (title, prefix) => title.toLowerCase().startsWith(prefix.toLowerCase());
exports.validateTitlePrefix = validateTitlePrefix;
const validateEvent = () => {
    const validEvent = ['pull_request'];
    const { eventName } = github.context;
    core.info(`Event name: ${eventName}`);
    if (!validEvent.includes(eventName)) {
        throw new Error(`Invalid event: ${eventName}`);
    }
};
exports.validateEvent = validateEvent;
const getPullRequestTitle = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const authToken = core.getInput('github_token', { required: true });
    const client = github.getOctokit(authToken);
    const owner = (_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.owner.login;
    if (!owner) {
        throw new Error('Owner repo not found');
    }
    const { repo } = github.context.repo;
    const pullNumber = (_b = github.context.payload.pull_request) === null || _b === void 0 ? void 0 : _b.number;
    if (!pullNumber) {
        throw new Error('Pullnumber not found');
    }
    const { data: pullRequest } = yield client.rest.pulls.get({
        owner,
        repo,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        pull_number: pullNumber,
    });
    return pullRequest.title;
});
exports.getPullRequestTitle = getPullRequestTitle;
const testPullRequestTitleRegex = (pullRequestTitle) => {
    const regexInput = core.getInput('regex');
    const regex = RegExp(regexInput);
    if (!regex.test(pullRequestTitle)) {
        throw new Error(`Pull Request title "${pullRequestTitle}" failed to pass match regex - ${regexInput}`);
    }
};
exports.testPullRequestTitleRegex = testPullRequestTitleRegex;
const isIgnoredPrefix = (pullRequestTitle) => {
    const ignoredPrefixesList = core.getInput('ignored_prefixes');
    core.info(`Ignored Prefixes: ${ignoredPrefixesList}`);
    if (!ignoredPrefixesList.length) {
        return false;
    }
    return ignoredPrefixesList.split(',').some(prefix => (0, exports.validateTitlePrefix)(pullRequestTitle, prefix));
};
exports.isIgnoredPrefix = isIgnoredPrefix;
const isAllowedPrefix = (pullRequestTitle) => {
    const allowedPrefixes = core.getInput('allowed_prefixes');
    core.info(`Allowed Prefixes: ${allowedPrefixes}`);
    if (allowedPrefixes.length) {
        return true;
    }
    return allowedPrefixes.split(',').some(prefix => (0, exports.validateTitlePrefix)(pullRequestTitle, prefix));
};
exports.isAllowedPrefix = isAllowedPrefix;
