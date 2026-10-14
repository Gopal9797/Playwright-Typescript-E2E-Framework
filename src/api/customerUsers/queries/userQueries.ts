export const AVAILABLE_USER_SUBSCRIPTIONS_QUERY = `
query AvailableUserSubscriptions(
  $customerAccountId: ID!
  $dealerAccountId: ID!
  $userId: ID
) {
  availableUserSubscriptions(
    customerAccountId: $customerAccountId
    dealerAccountId: $dealerAccountId
    userId: $userId
  ) {
    subscriptions {
      contractLines {
        id
        status
        contract {
          id
          contractNumber
          purchaseOrderNumber
          status
          negativeRequests {
            id
            action
            quantity
            product {
              id
              __typename
            }
            __typename
          }
          __typename
        }
        licenseBreakdown {
          assignedSeats
          unassignedSeats
          __typename
        }
        pendingQuoteLine {
          id
          action
          quantity
          __typename
        }
        product {
          id
          __typename
        }
        __typename
      }
      licenseBreakdown {
        assignedSeats
        unassignedSeats
        __typename
      }
      product {
        id
        description
        isNonTransferable
        family {
          id
          description
          type
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const ASSIGN_SUBSCRIPTIONS_TO_USERS_MUTATION = `
mutation AssignSubscriptionsToUsers(
  $customerAccountId: ID!
  $dealerAccountId: ID!
  $subscriptionIds: [ID!]!
  $userIds: [ID!]!
) {
  assignSubscriptionsToUsers(
    customerAccountId: $customerAccountId
    dealerAccountId: $dealerAccountId
    subscriptionIds: $subscriptionIds
    userIds: $userIds
  ) {
    users {
      ...UserDetails
      roles
      productLines {
        __typename
        ... on ContractLine {
          id
          startDate
          status
          contract {
            id
            contractNumber
            purchaseOrderNumber
            renewalDate
            __typename
          }
          licenseBreakdown {
            licenses {
              __typename
              ... on License {
                id
                holderId
                __typename
              }
              ... on OfflineLicense {
                id
                checkInDate
                checkOutDate
                holderId
                revokeWhenOnline
                __typename
              }
            }
            __typename
          }
          product {
            id
            description
            isNonTransferable
            family {
              description
              __typename
            }
            __typename
          }
          __typename
        }
        ... on ExternalContractLine {
          id
          endDate
          startDate
          product {
            id
            description
            isNonTransferable
            family {
              description
              __typename
            }
            __typename
          }
          __typename
        }
      }
      __typename
    }
    contractLines {
      id
      breakdown {
        quoteId
        licenseBreakdown {
          assignedSeats
          unassignedSeats
          __typename
        }
        __typename
      }
      licenseBreakdown {
        assignedSeats
        unassignedSeats
        __typename
      }
      pendingQuoteLine {
        id
        licenseBreakdown {
          assignedSeats
          unassignedSeats
          __typename
        }
        __typename
      }
      users {
        id
        email
        firstName
        lastName
        roles
        status
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment UserDetails on User {
  id
  createdAt
  email
  firstName
  iamAccountId
  lastName
  status
  __typename
}
`;

export const REVOKE_USER_LICENSE_MUTATION = `
mutation RevokeUserLicense(
  $customerAccountId: ID!
  $dealerAccountId: ID!
  $subscriptionId: ID!
  $userId: ID!
) {
  revokeUserLicense(
    customerAccountId: $customerAccountId
    dealerAccountId: $dealerAccountId
    subscriptionId: $subscriptionId
    userId: $userId
  ) {
    contractLine {
      id
      amendmentBreakdown {
        id
        licenseBreakdown {
          assignedSeats
          unassignedSeats
          licenses {
            __typename
            ... on License {
              id
              holderId
              __typename
            }
            ... on OfflineLicense {
              id
              checkInDate
              checkOutDate
              holderId
              revokeWhenOnline
              __typename
            }
          }
          __typename
        }
        users {
          id
          email
          firstName
          lastName
          roles
          status
          __typename
        }
        __typename
      }
      licenseBreakdown {
        assignedSeats
        unassignedSeats
        __typename
      }
      __typename
    }
    user {
      id
      productLines {
        __typename
        ... on ContractLine {
          id
          __typename
        }
        ... on ExternalContractLine {
          id
          __typename
        }
      }
      __typename
    }
    __typename
  }
}
`;
