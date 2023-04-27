import { Builder, By, Key, until } from 'selenium-webdriver';
import { ServiceBuilder } from 'selenium-webdriver/edge';
import { Options } from 'selenium-webdriver/edge';

describe('Example Test', () => {
	let driver;

	beforeAll(async () => {
		driver = await new Builder()
			.forBrowser('MicrosoftEdge')
			.setEdgeService(
				new ServiceBuilder(
					'D:/music_management_reactjs/mucsicmanage-reactjs/src/tests/msedgedriver.exe',
				),
			)
			.setEdgeOptions(
				new Options().addArguments(
					'window-position=center',
					'window-size=800,1000',
				),
			)
			.build();
	});

	afterAll(async () => {
		await driver.quit();
	});

	jest.setTimeout(60000); // đặt thời gian chờ tối đa là 30 giây
	test('should get page title', async () => {
		await driver.get('http://localhost:3000/login');

		// Đợi cho đến khi trang được load hoàn toàn
		await driver.wait(until.elementLocated(By.id('formBasicUsername')), 35000);
		await driver.wait(
			until.elementIsVisible(
				await driver.findElement(By.id('formBasicUsername')),
			),
			35000,
		);
		const username = await driver.findElement(By.id('formBasicUsername'));
		const password = await driver.findElement(By.id('formBasicPassword'));
		const button = await driver.findElement(By.id('icon-button-undefined'));
		const usernameP = driver.findElement(By.xpath('(//p)[1]'));
		const passwordP = driver.findElement(By.xpath('(//p)[2]'));
		const statusP = driver.findElement(By.xpath('(//p)[3]'));
		//startlogin
		expect(await usernameP.getText()).toEqual('');
		expect(await passwordP.getText()).toEqual('');
		expect(await statusP.getText()).toEqual('');

		//login not full form
		await button.click();
		expect(await usernameP.getText()).toEqual('Please enter username');
		expect(await passwordP.getText()).toEqual('Please enter Password');
		expect(await statusP.getText()).toEqual(
			'Please enter username and password.',
		);

		//login with only username
		// await username.sendKeys('e@gmail.com');
		await send(username, 'e@gmail.com');
		expect(await usernameP.getText()).toEqual('');
		expect(await statusP.getText()).toEqual('');
		await button.click();
		expect(await passwordP.getText()).toEqual('Please enter Password');
		expect(await statusP.getText()).toEqual(
			'Please enter username and password.',
		);

		//login with only password
		await clear(username);
		expect(await usernameP.getText()).toEqual('Please enter username');
		expect(await statusP.getText()).toEqual('');
		// await password.sendKeys('Abcd@1234');
		await send(password, 'Abcd@1234');

		expect(await passwordP.getText()).toEqual('');
		await button.click();
		expect(await usernameP.getText()).toEqual('Please enter username');
		expect(await statusP.getText()).toEqual(
			'Please enter username and password.',
		);

		//login with no found username
		await send(username, 'mnbv@gmail.com');
		expect(await usernameP.getText()).toEqual('');
		expect(await statusP.getText()).toEqual('');
		// await password.sendKeys('Abcd@1234');
		expect(await passwordP.getText()).toEqual('');
		await button.click();
		await new Promise((resolve) => setTimeout(resolve, 1500));
		expect(await statusP.getText()).toEqual(
			'Login failed. No account found matching username.',
		);

		//login with incorrect password
		await clear(username);
		await send(username, 'e@gmail.com');
		expect(await usernameP.getText()).toEqual('');
		expect(await statusP.getText()).toEqual('');
		// await password.sendKeys('Abcd@1234');
		await send(password, 'a');
		expect(await passwordP.getText()).toEqual('');
		await button.click();
		await new Promise((resolve) => setTimeout(resolve, 1500));
		expect(await statusP.getText()).toEqual(
			'Login failed. Your password is incorrect. Please re-enter your password.',
		);

		//login with correct account
		await clear(password);
		await send(password, 'Abcd@1234');
		expect(await usernameP.getText()).toEqual('');
		expect(await passwordP.getText()).toEqual('');
		expect(await statusP.getText()).toEqual('');
		await button.click();
		await new Promise((resolve) => setTimeout(resolve, 5000));
		expect(
			await await driver.wait(until.urlIs('http://localhost:3000/songs'), 5000),
		).toBeTruthy();

		//logout
		const logoutBtn = await driver.findElement(By.id('logout-btn'));
		await driver.executeScript('arguments[0].click();', logoutBtn);
		await new Promise((resolve) => setTimeout(resolve, 3000));
		expect(
			await await driver.wait(until.urlIs('http://localhost:3000/'), 5000),
		).toBeTruthy();
	});

	async function clear(element) {
		const text = await element.getAttribute('value');
		for (let i = text.length - 1; i >= 0; i--) {
			await element.sendKeys(Key.BACK_SPACE);
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}

	async function send(element, text, delay = 50) {
		for (const char of text) {
			await element.sendKeys(char);
			await delayExecution(delay);
		}
	}

	async function delayExecution(time) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, time);
		});
	}
});
