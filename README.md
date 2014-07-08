#Arkanos Financial Suite (AFS)

`Arkanos Financial Suite` is a personal bookkeeping tool.

Copyright (C) 2005-2014 Matheus Borges Teixeira.

Free for personal use, all other rights reserved.

This Sheet might not be compatible with all versions of Excel.
Definitely not compatible with OpenOffice.

##Instructions

Paper size configured: `A4`

Margins: `1.05cm` x `1.05cm` x `1.05cm` x `1.05cm`

###Targets Tab
This is a rather simple tab. A graphic to visualize saving goals. Uses linear interpolation based on a set goal in `P28`. Yearly expanded to hold history, for reference only. Only graph is in printable area.

###Overview Tab
This is a read-only tab. All data is fetched from other tables. Displays overview from all months. The average value is calculated only from the months where expenses/income are greater than `0`.

###Consumption Control Tab

To avoid calculation error notices all around, by default the read date will always increase by one day. This will help the table ignore the values for calculation.

**Important:** Please only overwrite values which are needed, specially in mirror cells, as they avoid calculation error notices.

####Electricity
The Electricity bills are calculated based on the regular German contracts, with a base price and a cost per consumed kWh. The table above is the configuration plus overall values:

* `Last Year's reading`: Will be the base to calculate the bill.

* `Reading Date`: Date where the reading above was registered.

* `Working Cost per year`: This is the yearly base gross price from the contract.

* `Cost per kWh`: The gross cost per kWh.

* `Total Payment`: Calculated from the sum of all payments.

* `Total Cost`: Calculated from the sum all all costs.

####Heating
The Heating costs are calculated based on the average German heating costs method, more specifically from `Kalorimeta`. Costs are configured on the top table, reading values on the middle and the last table at the bottom is just to display calculated information.

**Considerations:**

1. It ignores the distribution of the costs as it varies from each contract, so use the effective cost on base and need, that the estimation will work.

2. The heaters were tailored to one particular flat. The formulas and the table need to be adapted if the flat uses more or less heaters.

3. The numbers `914X` are just the code from the heaters.

4. Estimations here, in comparison to the electricity, are very rough, because usually costs vary much between years.

###Monthly Tabs

There is one separated tab for each month. New data can be added to the transaction table only via [inserting a new entire row](http://office.microsoft.com/en-001/excel-help/insert-rows-columns-or-cells-HP005200926.aspx#BMinsertrows).

**Valid transaction types:** _Cash_, _Electronic_, _Received_, _Withdraw_, _Credit_, _Deposit_ and _Saving_. See below for more details how they are used. Any other type will be ignored.

**Note on _Saving_:** This is basically a way of removing money from the bank account without adding to the wallet.

**Note on _Values_:** The formulas described below are fixed, so if negative values are used, it might invert the type's meaning. (i.e. Negative _Electronic_ values are the same as _Credit_)

**Note on columns `G-N`:** They hold configuration for the formulas, leave it hidden.


####Overview Table

* `Last Month Bank Accounts Cash`: Takes the bank status from last month.
**Important:** January configuration needs to be manually set.

* `Last Month Cash`: The amount of money which should be currently on the wallet.
**Important:** January configuration needs to be manually set.

* `Total Money Expenses`: Sums all transactions from the type _Cash_.

* `Total Electronic Expenses`: Sums transactions from the type _Electronic_.

* `Total Money Income`: Sums all transactions from the type _Received_.

* `Total Electronic Income`: Sums all transactions from the type _Credit_.

* `Money in Cash`: Sums all transactions with _Withdraw_ and _Received_, minus the sum of all money expenses above **and** transactions from the type _Deposit_. Should be the amount of money currently in the wallet.

* `Money in Bank Accounts`: Sums all transactions with _Credit_ and _Deposit_, minus the sum of all electronic expenses above **and** transactions from the types _Saving_ and _Withdraw_. Should be the amount of money currently in the bank.
