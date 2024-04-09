from dora.store.repos.code import CodeRepoService
from dora.store.models.code import PullRequest

from typing import List


class PullRequestAnalyticsService:
    def __init__(self, repo_service):
        self._code_repo: CodeRepoService = repo_service

    def get_prs_by_ids(self, pr_ids: List[str]) -> List[PullRequest]:
        return self._code_repo.get_prs_by_ids(pr_ids)


def get_pr_analytics_service():
    return PullRequestAnalyticsService(CodeRepoService())