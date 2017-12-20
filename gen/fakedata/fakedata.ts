import { Radar } from "../common/interfaces";

export const pushed = [
    'FR0010314401',
    'FR0000989501',
    'LU0627756538'
]

export const fav = [
    'NL0011585146'
]

export const case_2_model = [
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.2, SRRI: 1.2, Amont: 4000, Price: 66147, Shares: 0.0604713743631608, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 6000, Price: 19.21, Shares: 312.337324310255, },
    { Symbol: 'LU0281578517', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Pioneer Fds Euro Bond', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 6000, Price: 9.18, Shares: 653.59477124183, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 1000, Price: 151.8, Shares: 6.58761528326746, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 1000, Price: 67.68, Shares: 14.7754137115839, },
    { Symbol: 'LU0568620560', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.1, SRRI: 0.1, Amont: 2000, Price: 100.87, Shares: 19.8275007435313, },
]


export const case_2_initial = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 1, SRRI: 1, Amont: 80000, Price: 1, Shares: 80000, },
]

export const case_2_proposed = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.75, SRRI: 1, Amont: 15000, Price: 1, Shares: 15000, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.025, SRRI: 0.6, Amont: 2000, Price: 66147, Shares: 0.0302356871815804, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.0625, SRRI: 0.6, Amont: 5000, Price: 19.21, Shares: 2260.28, },
    { Symbol: 'LU0281578517', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Pioneer Fds Euro Bond', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.0625, SRRI: 0.6, Amont: 5000, Price: 9.18, Shares: 544.66, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.025, SRRI: 0.15, Amont: 2000, Price: 151.8, Shares: 13.18, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.025, SRRI: 0.15, Amont: 2000, Price: 67.68, Shares: 29.55, },
    { Symbol: 'LU0568620560', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.05, SRRI: 0.4, Amont: 4000, Price: 100.87, Shares: 39.66, },
]


export const case_3_model = [
    { Symbol: 'IE00B4ND3602', MacroAssetClass: 'Funds', AssetClass: 'Commodities', AssetType: 'Gold', Name: 'iShares Physical Gold ETC', Mstar_BCH: '', Mstar_SRRI: 2, WEIGHT: 0.05, SRRI: 0.1, Amont: 5000, Price: 21.74615, Shares: 229.925756973073, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.25, SRRI: 1.5, Amont: 25000, Price: 66147, Shares: 0.377946089769755, },
    { Symbol: 'LU0399031052', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Small Cap', Name: 'UBS (Lux) ES Small Caps Europe (EUR)', Mstar_BCH: '', Mstar_SRRI: 5, WEIGHT: 0.1, SRRI: 0.5, Amont: 10000, Price: 201.01, Shares: 49.7487687179742, },
    { Symbol: 'FR0010816819', MacroAssetClass: 'Funds', AssetClass: 'Alternative', AssetType: 'Event Driven', Name: 'Lutetia Patrimoine', Mstar_BCH: '', Mstar_SRRI: 3, WEIGHT: 0.03, SRRI: 0.09, Amont: 3000, Price: 118.75, Shares: 25.2631578947368, },
    { Symbol: 'FR0010930446', MacroAssetClass: 'Funds', AssetClass: 'Alternative', AssetType: 'Global Macro', Name: 'H2O Multistrategies', Mstar_BCH: '', Mstar_SRRI: 6, WEIGHT: 0.04, SRRI: 0.24, Amont: 4000, Price: 241878.9, Shares: 0.0165372010539158, },
    { Symbol: 'LU0627756538', MacroAssetClass: 'Funds', AssetClass: 'Alternative', AssetType: 'Systematic Future', Name: 'DB Platinum IV Systematic Alpha', Mstar_BCH: '', Mstar_SRRI: 4, WEIGHT: 0.03, SRRI: 0.12, Amont: 3000, Price: 104.48742, Shares: 28.7115903522166, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.2, SRRI: 0.6, Amont: 20000, Price: 19.21, Shares: 1041.12441436752, },
    { Symbol: 'LU0518421895', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Amundi Fds Bond Euro Government', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.2, SRRI: 0.6, Amont: 20000, Price: 131.89, Shares: 151.641519448025, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 5000, Price: 151.8, Shares: 32.9380764163373, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 5000, Price: 67.68, Shares: 73.8770685579196, },
]

export const case_3_initial = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0, SRRI: 1, Amont: 0, Price: 1, Shares: 0, },
    { Symbol: 'NL0011585146', MacroAssetClass: 'Equity', AssetClass: 'Equity', AssetType: 'Equity', Name: 'Ferrari NV', Mstar_BCH: '', Mstar_SRRI: 6, WEIGHT: 0.05, SRRI: 1.2, Amont: 20000, Price: 55.3, Shares: 361.663652802893, },
    { Symbol: 'XS1327539976', MacroAssetClass: 'Fixed Income', AssetClass: 'Fixed Income', AssetType: 'Corporate', Name: 'OTE Plc 4.375% 02-DEC-2019', Mstar_BCH: '', Mstar_SRRI: 7, WEIGHT: 0.1, SRRI: 0.7, Amont: 10000, Price: 106.28, Shares: 94.0910801656003, },
    { Symbol: 'LU0145482039', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Generali IS Euro Corporate Bond', Mstar_BCH: '', Mstar_SRRI: 3, WEIGHT: 0.20, SRRI: 0.45, Amont: 15000, Price: 215.113, Shares: 69.7307926531637, },
    { Symbol: 'IE0007472990', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Vanguard Euro Government Bond Index', Mstar_BCH: '', Mstar_SRRI: 3, WEIGHT: 0.35, SRRI: 1.05, Amont: 35000, Price: 222.98, Shares: 156.964750201812, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: '', Mstar_SRRI: 4, WEIGHT: 0.15, SRRI: 0.4, Amont: 10000, Price: 151.8, Shares: 65.8761528326746, },
    { Symbol: 'LU1191877379', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'BGF European High Yield Bond Fund', Mstar_BCH: '', Mstar_SRRI: 3, WEIGHT: 0.15, SRRI: 0.3, Amont: 10000, Price: 11.07, Shares: 903.342366757001, },
]

export const case_3_proposed = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0, SRRI: 1, Amont: 0, Price: 1, Shares: 0, },
    { Symbol: 'NL0011585146', MacroAssetClass: 'Equity', AssetClass: 'Equity', AssetType: 'Equity', Name: 'Ferrari', Mstar_BCH: '', Mstar_SRRI: 6, WEIGHT: 0.05, SRRI: 0.6, Amont: 10000, Price: 55.3, Shares: 180.831826401447, },
    { Symbol: 'IE0007472990', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Vanguard Euro Government Bond Index', Mstar_BCH: '', Mstar_SRRI: 3, WEIGHT: 0, SRRI: 1.05, Amont: 0, Price: 222.98, Shares: 0, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.15, SRRI: 0.6, Amont: 10000, Price: 66147, Shares: 0.151178435907902, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.2, SRRI: 0.6, Amont: 20000, Price: 19.21, Shares: 1041.12441436752, },
    { Symbol: 'LU0518421895', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Amundi Fds Bond Euro Government', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.4, SRRI: 1.2, Amont: 40000, Price: 131.89, Shares: 303.28303889605, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.1, SRRI: 0.3, Amont: 10000, Price: 151.8, Shares: 65.8761528326746, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.1, SRRI: 0.3, Amont: 10000, Price: 67.68, Shares: 147.754137115839, },
]



export const case_4_model = [
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.2, SRRI: 1.2, Amont: 40000, Price: 66147, Shares: 0.604713743631608, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 60000, Price: 19.21, Shares: 3123.37324310255, },
    { Symbol: 'LU0281578517', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Pioneer Fds Euro Bond', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 60000, Price: 9.18, Shares: 6535.9477124183, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 151.8, Shares: 65.8761528326746, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 67.68, Shares: 147.754137115839, },
    { Symbol: 'LU0568620560', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.1, SRRI: 0.1, Amont: 20000, Price: 100.87, Shares: 198.275007435313, },
]

export const case_4_initial = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.3, SRRI: 1, Amont: 60000, Price: 1, Shares: 60000, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.2, SRRI: 1.2, Amont: 40000, Price: 66147, Shares: 0.604713743631608, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.15, SRRI: 0.9, Amont: 30000, Price: 19.21, Shares: 1561.68662, },
    { Symbol: 'LU0281578517', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Pioneer Fds Euro Bond', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.15, SRRI: 0.9, Amont: 30000, Price: 131.89, Shares: 227.462279, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 151.8, Shares: 65.8761528326746, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 67.68, Shares: 147.754137115839, },
    { Symbol: 'LU0568620560', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.1, SRRI: 0.1, Amont: 20000, Price: 100.87, Shares: 198.275007435313, },
]

export const case_4_initial_ = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0, SRRI: 1, Amont: 0, Price: 1, Shares: 0, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.2, SRRI: 1.2, Amont: 40000, Price: 66147, Shares: 0.604713743631608, },
    { Symbol: 'LU0119099819', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 60000, Price: 19.21, Shares: 3123.37324310255, },
    { Symbol: 'LU0281578517', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Pioneer Fds Euro Bond', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 60000, Price: 131.89, Shares: 454.924558344075, },
    { Symbol: 'LU0201576401', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 151.8, Shares: 65.8761528326746, },
    { Symbol: 'LU0281579598', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 10000, Price: 67.68, Shares: 147.754137115839, },
    { Symbol: 'LU0568620560', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.1, SRRI: 0.1, Amont: 20000, Price: 100.87, Shares: 198.275007435313, },
]


export const case_4_proposed = [
    { Symbol: 'CASH_EUR', MacroAssetClass: 'CASH', AssetClass: 'CASH', AssetType: 'CASH', Name: 'CASH', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0, SRRI: 1, Amont: 0, Price: 1, Shares: 0, },
    { Symbol: 'FR0010314401', MacroAssetClass: 'Funds', AssetClass: 'Equity', AssetType: 'Large Cap', Name: 'Amundi Actions Euro', Mstar_BCH: 'MSCI EMU NR USD', Mstar_SRRI: 6, WEIGHT: 0.2, SRRI: 1.2, Amont: 44000, Price: 66147, Shares: 0.665185117994769, },
    { Symbol: 'LU0533595319', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Corporate Bond', Name: 'Amundi Fds Bond Euro Corporate', Mstar_BCH: 'Barclays Euro Agg Corps TR EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 66000, Price: 19.21, Shares: 3435.71056741281, },
    { Symbol: 'LU0518421895', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Government Bond', Name: 'Amundi Fds Bond Euro Government', Mstar_BCH: 'Citi EMU GBI EUR', Mstar_SRRI: 3, WEIGHT: 0.3, SRRI: 0.9, Amont: 66000, Price: 131.89, Shares: 500.417014178482, },
    { Symbol: 'FR0000989501', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'Inflation Linked', Name: 'Amundi Fds Bond Euro Inflation', Mstar_BCH: 'Barclays Euro Infln Lkd TR EUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 11000, Price: 151.8, Shares: 72.463768115942, },
    { Symbol: 'LU0257968619', MacroAssetClass: 'Funds', AssetClass: 'Fixed Income', AssetType: 'High Yield', Name: 'Pioneer Fds Euro High Yield', Mstar_BCH: 'BofAML European Ccy HY Constnd TR HEUR', Mstar_SRRI: 3, WEIGHT: 0.05, SRRI: 0.15, Amont: 11000, Price: 67.68, Shares: 162.529550827423, },
    { Symbol: 'FR0011006360', MacroAssetClass: 'Funds', AssetClass: 'Money Market', AssetType: 'Money Market', Name: 'Amundi Fds Cash EUR', Mstar_BCH: '', Mstar_SRRI: 1, WEIGHT: 0.1, SRRI: 0.1, Amont: 22000, Price: 100.87, Shares: 218.102508178844, },
]



 /*
const radar_0_client:Radar = {
    actual: {
        riskAdequacy: 1,
        efficency: 1,
        consistency: 1,
        riskAnalysis: 1,
        concentration: 1,
        overlap: 1,
    },
    guideLines: RadarItem;
    limits: RadarItem;
    proposed: RadarItem;
    riskAdequacyAlert: 'green',
    efficencyAlert: 'green',
    consistencyAlert:'green',
    riskAnalysisAlert:'green',
    concentrationAlert: 'green',
    overlapAlert: 'green',
    numOfAlerts: 0;
    color: 'green'
}
const makeRadar  =  (cAd:number, cEff: number, cCons: number, cRA: number, cOver:number, cConc:number ,
                    mAd:number, mEff: number, mCons: number, mRA: number, mOver:number, mConc:number 
    
) => {

}

*/