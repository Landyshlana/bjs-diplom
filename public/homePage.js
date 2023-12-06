"use strict";
const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(response => {
		if (response.success) {
			location.reload();
		}
	});
};

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});
//получение текущих курсов валют
const ratesBoard = new RatesBoard();
setInterval(ApiConnector.getStocks(response => {
	if (response.success) {
		ratesBoard.clearTable();
		ratesBoard.fillTable(response.data);
	}
}), 60000);


//пополнение баланса, реализовать сообщение об ошибке, всё остальное работает
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, "успешно");
		} else {
			moneyManager.setMessage(false, response.error)
		};
	});
};

//конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, "успешно");
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
};
//перевод валюты человеку 
moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, "успешно");
		} else {
			moneyManager.setMessage(false, response.error)
		}
	});

};

const favoritesWidget = new FavoritesWidget();
//запрос начального списка избраннго
ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});


//добавление пользователя в список избранного
favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(true, "успешно");
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
};

favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(true, "успешно");
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
};