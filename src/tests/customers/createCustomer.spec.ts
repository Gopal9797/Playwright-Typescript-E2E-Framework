import { expect, test } from '../../fixture/customerTestFixture';
import { HomePageNew, TopNavTab } from '../../pages/HomePageNew';
import { CustomersPage } from '../../pages/customer/CustomersPage';
import type { CreateCustomerBasePage } from '../../pages/customer/CreateCustomerNavigation';
import { CustomerSelectionPage } from '../../pages/CustomerSelectionPage';
import type { ContractsPage } from '../../pages/ContractsPage';
import type { ReviewNewCustomerPage } from '../../pages/customer/ReviewNewCustomerPage';
import { ShipToContactInfoPage } from '../../pages/customer/ShipToContactInfoPage';
import { LocationInfoPage } from '../../pages/customer/LocationInfoPage';

const existingCustomer = {
	ownerName: 'Gopinath Rajarathinam',
	emailAddress: 'gopinath_rajarathinam@trimble.com',
	emailAddressWithMixedCase: 'GopiNath_RajaRathinaM@TRIMble.Com',
	companyName: 'Test Company 123',
};
const linkCustomer = {
	ownerName: 'Gopinath R',
	emailAddress: 'gopinath_r+dnu_automation@trimble.com.test-google-a.com',
	companyName: 'Construction Company',
}
const invalidEmailAddress = 'invalid@email.';
const linkAccountDealerName = 'TamilNadu Pipes Syndicate';
const createUniqueOwnerEmail = (timeStamp: number) => `gopinath_r+owner_${timeStamp}@trimble.com.test-google-a.com`;
const createUniqueContactEmail = (timeStamp: number) => `gopinath_r+contact_${timeStamp}@trimble.com.test-google-a.com`;
const createUniqueOrganizationEmail = (timeStamp: number) => `gopinath_r+organization_${timeStamp}@trimble.com.test-google-a.com`;
const createUniqueCompanyName = (timeStamp: number) => `Automation Customer ${timeStamp}`;
const shipToContact = {
	firstName: 'Automation',
	lastName: 'Contact',
};
type OrganizationSearch = {
	name: string;
	country: string;
	city: string;
};
type CompanyProfile = {
	language: string;
	industry: string;
};
const organizationSearch: OrganizationSearch = {
	name: 'Paragon Estate Limited',
	country: 'New Zealand',
	city: 'Papakura',
};
const companyProfile: CompanyProfile = {
	language: 'English',
	industry: 'Civil Construction',
};
const nzCustomerLocation = {
	country: 'New Zealand',
	streetAddress: '456 GREAT SOUTH ROAD',
	city: 'Papakura',
	region: 'Auckland',
	zipCode: '2113',
};

type HappyPathData = {
	label: string;
	companyNamePrefix: string;
	company: CompanyProfile;
	organization: OrganizationSearch;
	contact: typeof shipToContact & {
		phoneNumber: string;
		expectedPhoneNumber: string;
	};
	location: typeof nzCustomerLocation;
	expectedShipToAddress: string;
	useEnteredAddress: boolean;
};

const happyPathData: HappyPathData[] = [
	{
		label: 'ASCII  @dailysanity',
		companyNamePrefix: 'Automation Customer',
		company: companyProfile,
		organization: organizationSearch,
		contact: { ...shipToContact, phoneNumber: '211786651', expectedPhoneNumber: '+64211786651' },
		location: nzCustomerLocation,
		expectedShipToAddress: '456 GREAT SOUTH ROAD, Papakura, 2113, New Zealand',
		useEnteredAddress: false,
	},
	{
		label: 'Japanese',
		companyNamePrefix: '自動化テスト株式会社',
		company: { language: 'Japanese', industry: 'Civil Construction' },
		organization: { name: 'Sony Group Corporation', country: 'Japan', city: 'Tagajo' },
		contact: { firstName: '自動化', lastName: '連絡先', phoneNumber: '9012345678', expectedPhoneNumber: '+819012345678' },
		location: { country: 'Japan', streetAddress: '芝公園４丁目２−８', city: '港区', region: 'Tokyo', zipCode: '1050011' },
		expectedShipToAddress: '芝公園４丁目２−８, 港区, Tokyo 1050011, Japan',
		useEnteredAddress: true,
	},
];

test.describe('Create Customer', () => {
	for (const isFromCreateContract of [false, true]) {
		const originSuffix = isFromCreateContract ? ' - From Contracts' : ' - From Customers @dailysanity';
		test(`Cancel${originSuffix}`, { tag: ['@NZDEV-T306', '@NZDEV-T307'] }, async ({ customersPage, contractsPage }) => {
			const timeStamp = Date.now();
			const ownerEmail = createUniqueOwnerEmail(timeStamp);
			const shipToContactEmail = createUniqueContactEmail(timeStamp);
			const companyName = createUniqueCompanyName(timeStamp);

			let entryPage = await OpenCancellationEntryPage(customersPage, contractsPage, isFromCreateContract);

			entryPage = await test.step('Cancel from Owner Information', async () => {
				const ownerInfoPage = await entryPage.CreateNewCustomer();
				await ownerInfoPage.assertBasicFields();
				return CancelAndAssertEntryPage(ownerInfoPage, isFromCreateContract);
			});

			entryPage = await test.step('Cancel from Company Information', async () => {
				const companyInfoPage = await OpenCompanyInfo(entryPage, ownerEmail);
				await companyInfoPage.assertBasicFields();
				return CancelAndAssertEntryPage(companyInfoPage, isFromCreateContract);
			});

			entryPage = await test.step('Cancel from Search for Organization', async () => {
				const searchForOrgPage = await OpenOrganizationSearch(entryPage, ownerEmail, companyName);
				await searchForOrgPage.assertBasicFields();
				return CancelAndAssertEntryPage(searchForOrgPage, isFromCreateContract);
			});

			entryPage = await test.step('Cancel from Organization List', async () => {
				const organizationListPage = await OpenOrganizationList(entryPage, ownerEmail, companyName);
				await organizationListPage.assertBasicFields();
				await expect(organizationListPage.resultsCount, 'Organization search should return more than zero results')
					.toHaveText(/^[1-9]\d*\s+Results$/);
				return CancelAndAssertEntryPage(organizationListPage, isFromCreateContract);
			});

			entryPage = await test.step('Cancel from Location Information', async () => {
				const locationInfoPage = await OpenLocationInfo(entryPage, ownerEmail, companyName);
				await locationInfoPage.assertBasicFields();
				return CancelAndAssertEntryPage(locationInfoPage, isFromCreateContract);
			});

			entryPage = await test.step('Cancel from Ship-to Contact Information', async () => {
				const shipToContactInfoPage = await OpenShipToContactInfo(entryPage, ownerEmail, companyName);
				await shipToContactInfoPage.assertBasicFields();
				return CancelAndAssertEntryPage(shipToContactInfoPage, isFromCreateContract);
			});

			const returnedPage = await test.step('Verify review details and cancel', async () => {
				const shipToContactInfoPage = await OpenShipToContactInfo(entryPage, ownerEmail, companyName);

				// Check email validation on the Ship-to Contact Information page
				await shipToContactInfoPage.firstNameTxt.fill(shipToContact.firstName);
				await shipToContactInfoPage.lastNameTxt.fill(shipToContact.lastName);
				await shipToContactInfoPage.emailAddressTxt.fill('test@');
				await shipToContactInfoPage.nextBtn.click();
				await expect(shipToContactInfoPage.feedbackLbl).toHaveText('Invalid email');

				await shipToContactInfoPage.EnterContactInformation(shipToContact.firstName, shipToContact.lastName, shipToContactEmail, '211786651');
				const reviewPage = await shipToContactInfoPage.NextReviewCustomer();
				await AssertReviewInformation(reviewPage, ownerEmail, companyName, shipToContactEmail);
				return CancelAndAssertEntryPage(reviewPage, isFromCreateContract);
			});

			await test.step('Verify the cancelled customer is absent from Customers', async () => {
				const customersPage = returnedPage instanceof CustomersPage
					? returnedPage
					: await new HomePageNew(returnedPage.page).SelectCustomersTab();
				await customersPage.searchBar.Search(companyName, 0);
				await expect(customersPage.gridTotalCount).toHaveText('0 Results');
			});
		});
	}

	test('Existing user @dailysanity', { tag: ['@NZDEV-T340'] }, async ({ customersPage }) => {
		const ownerInfoPage = await customersPage.CreateNewCustomer();

		// Hit next without entering email address and the feedback label should display an error
		await ownerInfoPage.Next();
		await expect(ownerInfoPage.feedbackLbl).toHaveText('Please enter a valid email address');

		// Enter an invalid email address
		await ownerInfoPage.emailAddressTxt.fill(invalidEmailAddress);

		// As the email being entered the feedback label should update accordingly
		await expect(ownerInfoPage.feedbackLbl)
			.toHaveText('This will be the primary account owner\'s Trimble ID email address.');

		await ownerInfoPage.Next();
		await expect(ownerInfoPage.feedbackLbl).toHaveText('Please enter a valid email address');

		// Valid email but with uppercase letters
		await ownerInfoPage.emailAddressTxt.fill(existingCustomer.emailAddressWithMixedCase);
		await ownerInfoPage.emailAddressTxt.press('Tab');

		// The email matched alert should be visible for a valid email despite the case difference
		await ownerInfoPage.assertEmailMatchedAlert(
			existingCustomer.ownerName,
			existingCustomer.emailAddress,
			existingCustomer.companyName,
		);

		// Valid email but with all lowercase letters
		await ownerInfoPage.emailAddressTxt.fill(existingCustomer.emailAddress);
		await ownerInfoPage.emailAddressTxt.press('Tab');

		// The email matched alert should be visible for a valid email despite the case difference
		await ownerInfoPage.assertEmailMatchedAlert(
			existingCustomer.ownerName,
			existingCustomer.emailAddress,
			existingCustomer.companyName,
		);

		await ownerInfoPage.NextContinueWithThisAccount(existingCustomer.companyName);
	});

	test('Link Account @dailysanity', { tag: ['@NZDEV-T311'] }, async ({ customersPage }) => {
		const homePage = new HomePageNew(customersPage.page);
		await homePage.SelectDealer(linkAccountDealerName);

		const ownerInfoPage = await customersPage.CreateNewCustomer();
		await ownerInfoPage.EnterEmailAddress(linkCustomer.emailAddress);
		await ownerInfoPage.assertLinkAccountButton();

		const existingAccountDetectedModal = await ownerInfoPage.NextLinkAccount();
		await existingAccountDetectedModal.assertBasicFields();
		await CancelAndAssertCustomersPage(existingAccountDetectedModal);
	});

	test('Address Match Dialog', async ({ customersPage }) => {
		const timeStamp = Date.now();
		const ownerEmail = createUniqueOwnerEmail(timeStamp);
		const companyName = createUniqueCompanyName(timeStamp);
		const shipToContactEmail = createUniqueContactEmail(timeStamp);

		const locationInfoPage = await OpenLocationInfo(customersPage, ownerEmail, companyName);
		await locationInfoPage.pageHeader.scrollIntoViewIfNeeded();
		await locationInfoPage.streetAddressTxt.fill('456 GREAT SOUTH ROAD OPAHEKE');
		await locationInfoPage.stateCmb.selectOption({ label: 'Auckland' });
		const addressMatchModal = await locationInfoPage.NextAddressMatch();

		await addressMatchModal.assertBasicFields();
		await expect(addressMatchModal.enteredAddress)
			.toHaveText('456 GREAT SOUTH ROAD OPAHEKE, PAPAKURA, Auckland 2113, New Zealand');
		await expect(addressMatchModal.recommendedAddress)
			.toHaveText('456 GREAT SOUTH ROAD, PAPAKURA, Auckland 2113, New Zealand');

		await test.step('Verify the recommended address is preserved on review', async () => {
			await addressMatchModal.UseRecommendedAddress();
			const shipToContactInfoPage = await ShipToContactInfoPage.init(customersPage.page);
			await shipToContactInfoPage.EnterContactInformation(shipToContact.firstName, shipToContact.lastName, shipToContactEmail);
			const reviewPage = await shipToContactInfoPage.NextReviewCustomer();
			await expect(reviewPage.streetAddressTxt).toHaveAttribute('value', nzCustomerLocation.streetAddress);
			await expect(reviewPage.cityTxt).toHaveAttribute('value', /^Papakura$/i);
			await expect(reviewPage.stateTxt).toHaveAttribute('value', nzCustomerLocation.region);
			await expect(reviewPage.zipCodeTxt).toHaveAttribute('value', nzCustomerLocation.zipCode);
			await expect(reviewPage.countryTxt).toHaveAttribute('value', nzCustomerLocation.country);
			await CancelAndAssertCustomersPage(reviewPage);
		});
	});

	for (const data of happyPathData) {
		test(`Happy Path - ${data.label}`, { tag: ['@happyPath'] }, async ({ customersPage, homePageNew, page }) => {
			const timeStamp = Date.now();
			const ownerEmail = createUniqueOwnerEmail(timeStamp);
			const companyName = `${data.companyNamePrefix} ${timeStamp}`;
			const shipToContactEmail = createUniqueContactEmail(timeStamp);
			const shipToAddress = data.expectedShipToAddress;
			const shipToContactName = `${data.contact.firstName} ${data.contact.lastName}`;

			const reviewPage = await test.step('Enter customer information and verify review details', async () => {
				const shipToContactInfoPage = await OpenShipToContactInfo(
					customersPage,
					ownerEmail,
					companyName,
					data.location,
					data.useEnteredAddress,
					data.organization,
					data.company,
				);
				await shipToContactInfoPage.EnterContactInformation(
					data.contact.firstName,
					data.contact.lastName,
					shipToContactEmail,
					data.contact.phoneNumber);
				const reviewPage = await shipToContactInfoPage.NextReviewCustomer();
				await AssertReviewInformation(
					reviewPage,
					ownerEmail,
					companyName,
					shipToContactEmail,
					data.location,
					data.contact,
					data.organization,
					data.company,
				);
				return reviewPage;
			});

			let customerDetailsPage = await test.step('Click on create customer and verify customer details', async () => {
				const customerDetailsPage = await reviewPage.CreateNewCustomer(companyName);
				await customerDetailsPage.assertCustomerName(companyName);
				await expect(customerDetailsPage.shipToAddress).toHaveText(shipToAddress, { ignoreCase: true });
				await expect(customerDetailsPage.shipToContactEmail).toHaveText(shipToContactEmail);
				await expect(customerDetailsPage.shipToContactName).toHaveText(shipToContactName);
				return customerDetailsPage;
			});

			let createContractCustomerDetailsPage = await test.step('Attempt to create a new contract from Customer Details page', async () => {
				const createContractCustomerDetailsPage = await customerDetailsPage.CreateNewContract();
				await createContractCustomerDetailsPage.assertBasicFields();

				await expect(createContractCustomerDetailsPage.shipToAddress).toHaveText(shipToAddress, { ignoreCase: true });
				await expect(createContractCustomerDetailsPage.shipToContactEmail).toHaveText(shipToContactEmail);
				await expect(createContractCustomerDetailsPage.shipToContactName).toHaveText(shipToContactName);
				return createContractCustomerDetailsPage;
			});

			await test.step('Cancel from Create contract customer details summary page should go to Customer Details page', async () => {
				await createContractCustomerDetailsPage.Cancel(companyName);
			});

			await test.step('Cancel from Contract Terms page should also go to Customer Details page', async () => {
				createContractCustomerDetailsPage = await customerDetailsPage.CreateNewContract();
				const termsPage = await createContractCustomerDetailsPage.Continue();
				await termsPage.termsPageAssertion();
				customerDetailsPage = await termsPage.CancelAndGoToCustomerDetailsPage();
				await customerDetailsPage.assertCustomerName(companyName);
			});

			await test.step('Return to customer table via tab navigation', async () => {
				homePageNew.SelectCustomersTab();
			});

			customerDetailsPage = await test.step('Link the newly created customer to TamilNadu Pipes Syndicate', async () => {
				// Change dealer to TamilNadu Pipes Syndicate
				const homePage = new HomePageNew(page);
				await homePage.SelectDealer(linkAccountDealerName);
				const customerListPage = await CustomersPage.init(page);

				const ownerInfoPage = await customerListPage.CreateNewCustomer();
				await ownerInfoPage.EnterEmailAddress(ownerEmail);
				await ownerInfoPage.assertLinkAccountButton();
				const existingAccountDetectedModal = await ownerInfoPage.NextLinkAccount();
				await expect(existingAccountDetectedModal.companyName).toHaveText(companyName);
				await expect(existingAccountDetectedModal.emailAddress).toHaveText(shipToContactEmail);

				const customerDetailsPage = await existingAccountDetectedModal.LinkCustomer(companyName);
				await customerDetailsPage.assertCustomerName(companyName);
				await expect(customerDetailsPage.shipToAddress).toHaveText(shipToAddress, { ignoreCase: true });
				await expect(customerDetailsPage.shipToContactEmail).toHaveText(shipToContactEmail);
				await expect(customerDetailsPage.shipToContactName).toHaveText(shipToContactName);
				return customerDetailsPage;
			});

			await test.step('Verify the linked customer persists in the target dealer customer table', async () => {
				homePageNew.SelectCustomersTab();
				const customerListPage = await CustomersPage.init(page);

				await customerListPage.searchBar.Search(companyName, 1);

				// Intrinsically checks the customer details page header for the correct company name
				await customerListPage.customersGrid.ExpectRowCount(1);
				await customerListPage.openCustomerFromGrid(companyName);
			});
		});
	}

	test('Create Organization @dailysanity', async ({ customersPage }) => {
		const timeStamp = Date.now();
		const ownerEmail = createUniqueOwnerEmail(timeStamp);
		const companyName = createUniqueCompanyName(timeStamp);
		const orgEmail = createUniqueOrganizationEmail(timeStamp);
		const contactEmail = createUniqueContactEmail(timeStamp);

		const newOrgName = '自動化組織';
		const newStreetAddress = '芝公園４丁目２−８';

		let orgListPage = await test.step('Open Organization List page', async () => {
			console.log(`Attempting to create customer with owner - ${ownerEmail}`);
			console.log(`Company name ${companyName}`);
			const organizationListPage = await OpenOrganizationList(customersPage, ownerEmail, companyName,
				{
					name: 'newOrgName',
					city: '東京',
					country: 'Japan'
				},
				{
					industry: 'Agriculture',
					language: 'Japanese'
				});

			return organizationListPage;
		});

		await test.step('Open Create Organization modal, basic checks and cancel', async () => {
			const createOrganizationModal = await orgListPage.CreateNewOrEditOrganization();
			await createOrganizationModal.assertBasicFields();
			orgListPage = await createOrganizationModal.Back();
		});

		await test.step('Create a new organization', async () => {
			console.log(`Attempting to create new organization - ${orgEmail}`);
			const assignOrgToCustomerModal = await orgListPage.CreateNewOrEditOrganization();
			await assignOrgToCustomerModal.AssertCustomerCardDetails(companyName, ownerEmail);
			await assignOrgToCustomerModal.EnterOrganizationDetails(
				newOrgName,
				'Japan',
				newStreetAddress,
				'港区',
				'Tokyo',
				'1050011',
				{
					email: orgEmail,
					phoneNumber: '+819012345678',
					industry: 'Agriculture',
				},
			);

			const addressMatchModal = await assignOrgToCustomerModal.CreateOrganizationDraftAddressMatch();
			await addressMatchModal.UseRecommendedAddress();
		});

		const locationInfoPage = await test.step('Edit the new organization and verify all the field values', async () => {
			const assignOrgToCustomerModal = await orgListPage.CreateNewOrEditOrganization();
			await assignOrgToCustomerModal.AssertCustomerCardDetails(companyName, ownerEmail);
			await expect.soft(assignOrgToCustomerModal.organizationNameTxt).toHaveValue(newOrgName);
			await expect.soft(assignOrgToCustomerModal.organizationEmailTxt).toHaveValue(orgEmail);
			await expect.soft(assignOrgToCustomerModal.phoneNumberTxt).toHaveValue('+81 90 1234 5678');
			await expect.soft(assignOrgToCustomerModal.SelectedOption(assignOrgToCustomerModal.industryCmb))
				.toHaveText('Agriculture');
			await expect.soft(assignOrgToCustomerModal.SelectedOption(assignOrgToCustomerModal.countryCmb))
				.toHaveText('Japan');
			await expect.soft(assignOrgToCustomerModal.streetAddressSearch.Input).toHaveValue('4 CHOME 2-8');
			await expect.soft(assignOrgToCustomerModal.cityTxt).toHaveValue('MINATO-KU');
			await expect.soft(assignOrgToCustomerModal.SelectedOption(assignOrgToCustomerModal.stateCmb))
				.toHaveText('Tokyo');
			await expect.soft(assignOrgToCustomerModal.zipCodeTxt).toHaveValue('105-0011');
			await assignOrgToCustomerModal.Close();
			const locationInfoPage = orgListPage.NextLocationInfo();
			return locationInfoPage;
		});

		const reviewPage = await test.step('Proceed to enter ship to contact info', async () => {
			const shipToContactInfoPage = await locationInfoPage.NextShipToContactInfo();
			await shipToContactInfoPage.EnterContactInformation(
				shipToContact.firstName,
				shipToContact.lastName,
				contactEmail
			)
			const reviewPage = await shipToContactInfoPage.NextReviewCustomer();
			return reviewPage;
		})

		await test.step('Verify the organization details in Review page', async () => {
			await expect.soft(reviewPage.organizationNameTxt).toHaveAttribute('value', newOrgName);
			await expect.soft(reviewPage.organizationCityTxt).toHaveAttribute('value', 'MINATO-KU');
			await expect.soft(reviewPage.organizationStateTxt).toHaveAttribute('value', 'Tokyo');
			await expect.soft(reviewPage.organizationCountryTxt).toHaveAttribute('value', 'Japan');

			await expect.soft(reviewPage.streetAddressTxt).toHaveAttribute('value', '4 CHOME 2-8');
			await expect.soft(reviewPage.cityTxt).toHaveAttribute('value', 'MINATO-KU');
			await expect.soft(reviewPage.stateTxt).toHaveAttribute('value', 'Tokyo');
			await expect.soft(reviewPage.countryTxt).toHaveAttribute('value', 'Japan');
			await expect.soft(reviewPage.zipCodeTxt).toHaveAttribute('value', '105-0011');
		})

		await test.step('Create customer and verify organization is created', async () => {
			const customerDetailsPage = await reviewPage.CreateNewCustomer(companyName);
		})
	});
});

async function CancelAndAssertCustomersPage(page: { Cancel(): Promise<CreateCustomerBasePage> }): Promise<CustomersPage> {
	const customersPage = await page.Cancel();
	if (!(customersPage instanceof CustomersPage)) {
		throw new Error('Expected cancellation to return CustomersPage, but received CustomerSelectionPage');
	}
	await expect(customersPage.pageHeader).toBeVisible();
	return customersPage;
}

async function OpenCancellationEntryPage(
	customersPage: CustomersPage,
	contractsPage: ContractsPage,
	isFromCreateContract: boolean,
): Promise<CreateCustomerBasePage> {
	if (!isFromCreateContract) {
		return customersPage;
	}
	await contractsPage.navigateToContractsList();
	await contractsPage.createANewContractButton.click();
	return CustomerSelectionPage.init(contractsPage.page);
}

async function CancelAndAssertEntryPage(
	page: { Cancel(): Promise<CreateCustomerBasePage> },
	isFromCreateContract: boolean,): Promise<CreateCustomerBasePage> {
	if (!isFromCreateContract) {
		return CancelAndAssertCustomersPage(page);
	}
	const customerSelectionPage = await page.Cancel();
	if (!(customerSelectionPage instanceof CustomerSelectionPage)) {
		throw new Error('Expected cancellation to return CustomerSelectionPage, but received CustomersPage');
	}
	await customerSelectionPage.customerSelectionPageAssertion();
	await expect(customerSelectionPage.customersListComboBox).toBeVisible();
	await expect(customerSelectionPage.createNewCustomerLink).toBeVisible();
	return customerSelectionPage;
}

async function OpenCompanyInfo(entryPage: CreateCustomerBasePage, ownerEmail: string) {
	const ownerInfoPage = await entryPage.CreateNewCustomer();
	await ownerInfoPage.EnterEmailAddress(ownerEmail);
	return ownerInfoPage.NextCompanyInfo();
}

async function OpenOrganizationSearch(
	entryPage: CreateCustomerBasePage,
	ownerEmail: string,
	companyName: string,
	company: CompanyProfile = companyProfile,
) {
	const companyInfoPage = await OpenCompanyInfo(entryPage, ownerEmail);
	await companyInfoPage.EnterCompanyInformation(companyName, company.language, company.industry);
	return companyInfoPage.NextSearchForOrganization();
}

async function OpenOrganizationList(
	entryPage: CreateCustomerBasePage,
	ownerEmail: string,
	companyName: string,
	organization: OrganizationSearch = organizationSearch,
	company: CompanyProfile = companyProfile,
) {
	const searchForOrgPage = await OpenOrganizationSearch(entryPage, ownerEmail, companyName, company);
	await searchForOrgPage.EnterOrganizationSearch(organization.name, organization.country, organization.city);
	return searchForOrgPage.NextOrganizationList();
}

async function OpenLocationInfo(
	entryPage: CreateCustomerBasePage,
	ownerEmail: string,
	companyName: string,
	organization: OrganizationSearch = organizationSearch,
	company: CompanyProfile = companyProfile,
) {
	const organizationListPage = await OpenOrganizationList(entryPage, ownerEmail, companyName, organization, company);
	await organizationListPage.SelectOrganization(organization.name);
	return organizationListPage.NextLocationInfo();
}

async function OpenShipToContactInfo(
	entryPage: CreateCustomerBasePage,
	ownerEmail: string,
	companyName: string,
	location = nzCustomerLocation,
	useEnteredAddress = false,
	organization: OrganizationSearch = organizationSearch,
	company: CompanyProfile = companyProfile,
) {
	const locationInfoPage = await OpenLocationInfo(entryPage, ownerEmail, companyName, organization, company);
	await locationInfoPage.EnterLocationInformation(
		location.country,
		location.streetAddress,
		location.city,
		location.region,
		location.zipCode,
	);
	if (useEnteredAddress) {
		const addressMatchModal = await locationInfoPage.NextAddressMatch();
		await addressMatchModal.assertBasicFields();
		await expect(addressMatchModal.enteredAddress)
			.toHaveText(`${location.streetAddress}, ${location.city}, ${location.region} ${location.zipCode}, ${location.country}`);
		return addressMatchModal.UseAddressEntered();
	}
	return locationInfoPage.NextShipToContactInfo();
}

async function AssertReviewInformation(
	reviewPage: ReviewNewCustomerPage,
	ownerEmail: string,
	companyName: string,
	shipToContactEmail: string,
	location = nzCustomerLocation,
	contact: HappyPathData['contact'] = { ...shipToContact, phoneNumber: '211786651', expectedPhoneNumber: '+64211786651' },
	organization: OrganizationSearch = organizationSearch,
	company: CompanyProfile = companyProfile,
): Promise<void> {
	await reviewPage.assertBasicFields();
	await expect(reviewPage.ownerEmailTxt).toHaveAttribute('value', ownerEmail);
	await expect(reviewPage.companyNameTxt).toHaveAttribute('value', companyName);
	await expect(reviewPage.languageTxt).toHaveAttribute('value', company.language);
	await expect(reviewPage.industryTxt).toHaveAttribute('value', company.industry);
	await expect(reviewPage.optInChk).not.toBeChecked();
	await expect(reviewPage.organizationNameTxt).toHaveAttribute('value', organization.name.toUpperCase());
	await expect(reviewPage.organizationCityTxt).toHaveAttribute('value', organization.city.toUpperCase());
	await expect(reviewPage.organizationCountryTxt).toHaveAttribute('value', organization.country);
	await expect(reviewPage.streetAddressTxt).toHaveAttribute('value', location.streetAddress);
	await expect(reviewPage.streetAddressLineTwoTxt).toHaveAttribute('value', '');
	await expect(reviewPage.cityTxt).toHaveAttribute('value', location.city);
	await expect(reviewPage.stateTxt).toHaveAttribute('value', location.region);
	await expect(reviewPage.zipCodeTxt).toHaveAttribute('value', location.zipCode);
	await expect(reviewPage.countryTxt).toHaveAttribute('value', location.country);
	await expect(reviewPage.firstNameTxt).toHaveAttribute('value', contact.firstName);
	await expect(reviewPage.lastNameTxt).toHaveAttribute('value', contact.lastName);
	await expect(reviewPage.contactEmailTxt).toHaveAttribute('value', shipToContactEmail);
	await expect(reviewPage.phoneNumberTxt).toHaveAttribute('value', contact.expectedPhoneNumber);
}
