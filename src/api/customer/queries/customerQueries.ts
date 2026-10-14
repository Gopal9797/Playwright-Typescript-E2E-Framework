export const DEALER_CUSTOMERS_QUERY = `
query DealerCustomers($accountId: ID!) {
  dealerCustomers(accountId: $accountId) {
    id
    autoRenewEnabled
    companyName
    optInStatus
    shipToContactBulkDetails: shipToContactBulkOperation {
      bulkOperationId
      failedContractIds
      newShipToContactId
      oldShipToContactId
      status
      successContractIds
      __typename
    }
    defaultShipToAddress {
      id
      __typename
    }
    organization {
      id
      verified
      organization {
        id
        name
        __typename
      }
      __typename
    }
    users {
      ... on PendingUser {
        id
        email
        role
        status
        __typename
      }
      ... on User {
        id
        email
        firstName
        lastName
        role
        status
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const LINK_EXISTING_VW_CUSTOMER_MUTATION = `
mutation LinkExistingVwCustomer(
  $dealerAccountId: ID!
  $customerAccountId: ID!
) {
  linkExistingVwCustomer(
    dealerAccountId: $dealerAccountId
    customerAccountId: $customerAccountId
  )
}
`;
