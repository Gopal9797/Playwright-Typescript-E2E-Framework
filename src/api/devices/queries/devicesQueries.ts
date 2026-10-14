export const DEVICES_V2_QUERY = `
query getDevice($dealerAccountId: ID!, $unassignedOnly: Boolean, $first: Int) {
  dealerDevicesV2(
    dealerAccountId: $dealerAccountId
    initialise: false
    first: $first
    before: null
    order: null
    unassignedOnly: $unassignedOnly
  ) {
    totalCount
    deviceSyncState
    nodes {
      description
      firmware
      iconUrl
      id
      isExternal
      modelName
      ownerName
      partNumber
      reference
      serialNumber
      transferDate
      transferStatus
      superKeyLines {
        expiryDate
        id
        product {
          description
          id
          isEnabled
          trialDuration
        }
      }
      productLines {
        ... on ContractLine {
          id
          isExternal
          listPriceTotal
          netPriceTotal
          purchaseOrderNumber
          quantity
          startDate
          status
        }
        ... on ExternalContractLine {
          endDate
          id
          startDate
        }
      }
      superKeyCount {
        total
        used
      }
      owner {
        ... on DealerCustomer {
          companyName
          id
          optInStatus
        }
        ... on Account {
          companyName
          customerNumber
          id
          primary
        }
      }
      desiredDealerCustomer {
        companyName
        id
        optInStatus
      }
      customerTransferRequest {
        createdAt
        id
        reference
        requestDate
        transferStatus
        updatedAt
      }
    }
  }
}
`;

export const DEVICES_V2_BY_PART_NUMBER_AND_SERIAL_CONTAINS_QUERY = `
query getDeviceByPartNumberAndSerialContains($dealerAccountId: ID!, $unassignedOnly: Boolean, $first: Int, $partNumber: String!, $serialNumberContains: String!) {
  dealerDevicesV2(
    dealerAccountId: $dealerAccountId
    initialise: false
    first: $first
    before: null
    order: null
    unassignedOnly: $unassignedOnly
    where: { partNumber: { eq: $partNumber }, serialNumber: { contains: $serialNumberContains } }
  ) {
    totalCount
    deviceSyncState
    nodes {
      id
      serialNumber
      partNumber
    }
  }
}
`;

export const DEVICES_V2_BY_SERIAL_QUERY = `
query getDeviceBySerial($dealerAccountId: ID!, $serialNumber: String!) {
  dealerDevicesV2(
    dealerAccountId: $dealerAccountId
    initialise: false
    first: null
    after: null
    last: null
    before: null
    where: { serialNumber: { eq: $serialNumber } }
    order: null
  ) {
    totalCount
    deviceSyncState
    nodes {
      id
      serialNumber
      partNumber
    }
  }
}
`;

export const CREATE_SUPERKEY_MUTATION = `
mutation CreateSuperkey(
  $dealerAccountId: ID!
  $deviceId: ID!
  $skus: [SuperkeySkuRequestInput!]!
) {
  createSuperkey(
    dealerAccountId: $dealerAccountId
    deviceId: $deviceId
    skus: $skus
  ) {
    id
    superKeyCount {
      total
      used
    }
    superKeyLines {
      id
      expiryDate
      product {
        id
        description
      }
    }
  }
}
`;

export const REVOKE_SUPERKEY_MUTATION = `
mutation RevokeSuperkey(
  $dealerAccountId: ID!
  $deviceId: ID!
  $skus: [SuperkeySkuRequestInput!]!
) {
  revokeSuperkey(
    dealerAccountId: $dealerAccountId
    deviceId: $deviceId
    skus: $skus
  ) {
    id
    superKeyCount {
      total
      used
    }
    superKeyLines {
      id
      expiryDate
      product {
        id
        description
      }
    }
  }
}
`;

export const ADD_SKUS_TO_SUPERKEY_MUTATION = `
mutation AddSkusToSuperkey(
  $dealerAccountId: ID!
  $deviceId: ID!
  $skus: [SuperkeySkuRequestInput!]!
) {
  addSkusToSuperkey(
    dealerAccountId: $dealerAccountId
    deviceId: $deviceId
    skus: $skus
  ) {
    id
    superKeyCount {
      total
      used
    }
    superKeyLines {
      id
      expiryDate
      product {
        id
        description
      }
    }
  }
}
`;

export const TRANSFER_DEVICE_MUTATION = `
  mutation TransferDevice(
    $customerAccountCDHId: String!
    $deviceIds: [ID!]!
  ) {
    transferMultipleDevices(
      customerAccountCDHId: $customerAccountCDHId
      iamDeviceIds: $deviceIds
    ) {
      id
      owner {
        ... on DealerCustomer {
          companyName
          id
          optInStatus
        }
        ... on Account {
          companyName
          customerNumber
          id
          primary
        }
      }
    }
  }
`;

export const ASSIGN_SUBSCRIPTIONS_TO_DEVICES_MUTATION = `
mutation AssignSubscriptionsToDevices(
  $customerAccountId: ID!
  $dealerAccountId: ID!
  $deviceIds: [ID!]!
  $subscriptionIds: [ID!]!
  $transferOptions: TransferOptionsInput
) {
  assignSubscriptionsToDevices(
    customerAccountId: $customerAccountId
    dealerAccountId: $dealerAccountId
    deviceIds: $deviceIds
    subscriptionIds: $subscriptionIds
    transferOptions: $transferOptions
  ) {
    id
    transferStatus
    desiredDealerCustomer {
      id
      companyName
    }
    owner {
      ... on Account {
        id
        companyName
      }
      ... on DealerCustomer {
        id
        companyName
      }
    }
    productLines {
      ... on ContractLine {
        id
        isExternal
        startDate
        status
        contract {
          id
          contractNumber
          renewalDate
          status
        }
        product {
          id
          description
          family {
            description
          }
        }
      }
      ... on ExternalContractLine {
        id
        startDate
        product {
          id
          description
          family {
            description
          }
        }
      }
    }
    superKeyLines {
      id
    }
  }
}`;

export const REVOKE_LICENSE_MUTATION = `
mutation RevokeLicense(
  $dealerAccountId: ID!
  $customerAccountId: ID!
  $deviceId: ID!
  $subscriptionId: ID!
) {
  revokeLicense(
    dealerAccountId: $dealerAccountId
    customerAccountId: $customerAccountId
    deviceId: $deviceId
    subscriptionId: $subscriptionId
  ) {
    device {
        id
        transferStatus
        productLines {
          ... on ContractLine {
            id
            isExternal
            startDate
            status
            contract {
              id
              contractNumber
              renewalDate
              status
            }
            product {
              id
              description
            }
          }
        }
      }
    }
}`;