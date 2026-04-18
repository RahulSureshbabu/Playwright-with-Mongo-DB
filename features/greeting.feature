@regression
Feature: Greeting generation
  As a user of the demo app
  I want to generate greetings
  So that I get either guest or personalized output

  Background:
    Given the demo app is open

  @smoke @regression
  Scenario: TC-001 Home page loads with heading
    Then I should see the heading "Welcome to UI Test Sandbox"

  @smoke @regression
  Scenario: TC-002 Guest greeting when input is empty
    When I click the generate greeting button
    Then I should see greeting output "Hello, Guest!"

  @regression
  Scenario: TC-003 Personalized greeting when input has name
    When I enter the name "Rahul"
    And I click the generate greeting button
    Then I should see greeting output "Hello, Rahul!"

  @regression @db
  Scenario: TC-004 Personalized greeting is saved to the database
    Given the greetings table is empty
    When I enter the name "Alice"
    And I click the generate greeting button
    Then I should see greeting output "Hello, Alice!"
    And the latest greeting in the database should have name "Alice"

  @regression @db
  Scenario: TC-005 Guest greeting is saved to the database
    Given the greetings table is empty
    When I click the generate greeting button
    Then I should see greeting output "Hello, Guest!"
    And the latest greeting in the database should be for a guest

  @negative
  Scenario: TC-N01 Intentional failure for demo
    When I enter the name "Rahul"
    And I click the generate greeting button
    Then I should see greeting output "Hello, RAHUL!"
