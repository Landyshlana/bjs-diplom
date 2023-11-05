"use strict";
const logoutButton = new LogoutButton();
logoutButton.action = () => {
	ApiConnector.logout(response => {
		if (response) {
			location.reload();
		}
	});
};

ApiConnector.current(response => {
	if (response.data) {
		ProfileWidget.showProfile(response.data);
	}
});
//получение текущих курсов валют
const ratesBoard = new RatesBoard();
const stocks = ApiConnector.getStocks(response => {
	if (response.data) {
		ratesBoard.clearTable();
		ratesBoard.fillTable(response.data);
	}
});
let time = setInterval(stocks, 1000);

//пополнение баланса, реализовать сообщение об ошибке, всё остальное работает
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, response => {
		if (response.data) {
			ProfileWidget.showProfile(response.data);
		}
	})
	moneyManager.setMessage();
};


//конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.data) {
			ProfileWidget.showProfile(response.data);
		}
	})
	moneyManager.setMessage();
};
//перевод валюты человеку 
moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, response => {
		if (response.data) {
			ProfileWidget.showProfile(response.data);
		}
	})
	moneyManager.setMessage();
};

const favoritesWidget = new FavoritesWidget();
//запрос начального списка избраннго
ApiConnector.getFavorites(response => {
	if (response.getData) {
		favoritesWidget.clearTable();
	} else {
		favoritesWidget.fillTable(response.data);
	}
	moneyManager.updateUsersList(response.data);
});


//добавление пользователя в список избранного
favoritesWidget.addUserCallback = (getData) => {
	ApiConnector.addUserToFavorites(getData, response => {
		if (response.getData) {
			favoritesWidget.clearTable();
		} else {
			favoritesWidget.fillTable(getData);
		}
	})
	favoritesWidget.setMessage();
};

favoritesWidget.removeUserCallback = (getData) => {
	ApiConnector.removeUserFromFavorites(getData, response => {
		if (response.getData) {
			favoritesWidget.clearTable();
		} else {
			favoritesWidget.fillTable(getData);
		}
	})
	favoritesWidget.setMessage();
}