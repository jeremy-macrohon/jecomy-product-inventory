Feature: Product inventory API
  As an inventory operator
  I want to use authentication, a barcode scanner, and inventory insights
  So that the app can securely manage lubricant and parts stock

  Background:
    Given there is a user account with email "admin@jecomy.com" and password "SecurePass123" and name "Admin"
    And I am logged in

  Scenario: Add a product and retrieve it
    When I create a product with id "1" name "Engine Oil" and quantity 5
    Then the product list should contain a product with id "1"

  Scenario: Update product quantity after purchase
    Given a product exists with id "2" name "Brake Pads" and quantity 10
    When I update product "2" quantity to 8
    Then the product "2" should have quantity 8

  Scenario: View inventory insights
    Given a product exists with id "3" name "Air Filter" and quantity 15
    When I request inventory insights
    Then the insights should show total products 1 and total quantity 15
