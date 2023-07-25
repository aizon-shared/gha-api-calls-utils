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
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const constants_1 = require("../constants");
// It returns the commit sha of a branch (last commit).
exports.default = (token, owner, repo, branch) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, github_1.getOctokit)(token);
    const { data } = yield client.request('GET /repos/{owner}/{repo}/branches/{branch}', {
        owner,
        repo,
        branch,
        headers: {
            'X-GitHub-Api-Version': constants_1.GITHUB_API_VERSION
        }
    });
    return data.commit.sha;
});
