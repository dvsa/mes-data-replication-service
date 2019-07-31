Feature: As a driving examiner, I want my journal to by synchronised to a cache, so I can get my most up to date schedule regularly

  @skip
  Scenario: Journal with no slots
    Given there is an active examiner in the TARS replica with staffNumber '123'
    When I invoke the journal poller
    Then there should be a journal in the cache for staffNumber '123'
