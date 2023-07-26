"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const getTags_1 = __importDefault(require("../src/githubApi/getTags"));
const getBranchCommit_1 = __importDefault(require("../src/githubApi/getBranchCommit"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repositories = JSON.parse(core_1.default.getInput('repositories'));
        const token = core_1.default.getInput('githubToken');
        const owner = core_1.default.getInput('repositoryOwner');
        const branch = core_1.default.getInput('branch');
        core_1.default.debug(`repositories: '${repositories}`);
        core_1.default.debug(`token: '${token}`);
        core_1.default.debug(`owner: '${owner}`);
        core_1.default.debug(`branch: '${branch}`);
        const repoTagPairs = yield Promise.all(repositories.map((repo) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const commit = yield (0, getBranchCommit_1.default)(token, owner, repo, branch);
            const tags = yield (0, getTags_1.default)(token, owner, repo);
            const tagInLatestCommit = (_a = tags.find((tag) => tag.commit.sha === commit)) === null || _a === void 0 ? void 0 : _a.name;
            if (!tagInLatestCommit) {
                throw new Error(`Tag not found in latest commit (${commit}) for repository ${repo}`);
            }
            return [repo, tagInLatestCommit];
        })));
        const latestTags = Object.fromEntries(repoTagPairs);
        core_1.default.setOutput('latestTags', JSON.stringify(latestTags));
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
});
