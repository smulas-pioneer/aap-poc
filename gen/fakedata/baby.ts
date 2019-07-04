import { Security } from "../common/interfaces";
import { sumBy } from "lodash";

export const babySecurities: Security[] = [
  { IsinCode: 'DE000A1HRVD5', Currency: 'EUR', Maturity: null, AssetId: 'DE000A1HRVD5', Kilovar: '1', IsFund: '0', SecurityName: 'DAIGAG 3.625% 10/21', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Real Estate', Sector: null, Rating: 'BBB+', Country: 'Germany', Region: 'Europe', Price: 108.5515 },
  { IsinCode: 'ES00000126B2', Currency: 'EUR', Maturity: null, AssetId: 'ES00000126B2', Kilovar: '1', IsFund: '0', SecurityName: 'SPAIN 2.75% 10/24', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'A-', Country: 'Spain', Region: 'Europe', Price: 115.921 },
  { IsinCode: 'ES0000012E51', Currency: 'EUR', Maturity: null, AssetId: 'ES0000012E51', Kilovar: '1', IsFund: '0', SecurityName: 'SPAIN 1.45% 04/29', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'A-', Country: 'Spain', Region: 'Europe', Price: 111.201 },
  { IsinCode: 'EUR', Currency: 'EUR', Maturity: null, AssetId: 'EUR', Kilovar: '1', IsFund: '0', SecurityName: 'EURO', MacroAssetClass: 'Money Market', MicroAssetClass: 'Money Market', Sector: null, Rating: null, Country: 'Europe', Region: 'Europe', Price: 1 },
  { IsinCode: 'FR0000120628', Currency: 'EUR', Maturity: null, AssetId: 'FR0000120628', Kilovar: '1', IsFund: '0', SecurityName: 'AXA', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'France', Region: 'Europe', Price: 23.51 },
  { IsinCode: 'FR0000121485', Currency: 'EUR', Maturity: null, AssetId: 'FR0000121485', Kilovar: '1', IsFund: '0', SecurityName: 'KERING', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Consumer Discretionary', Rating: null, Country: 'France', Region: 'Europe', Price: 526.6 },
  { IsinCode: 'FR0000131104', Currency: 'EUR', Maturity: null, AssetId: 'FR0000131104', Kilovar: '1', IsFund: '0', SecurityName: 'BNP PARIBAS', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'France', Region: 'Europe', Price: 41.865 },
  { IsinCode: 'FR0010424143', Currency: 'EUR', Maturity: null, AssetId: 'FR0010424143', Kilovar: '1', IsFund: '0', SecurityName: 'LYXOR EURSTX 50 D -2X INVERS (ITA)', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'France', Region: 'Europe', Price: 3.538 },
  { IsinCode: 'FR0010869578', Currency: 'EUR', Maturity: null, AssetId: 'FR0010869578', Kilovar: '1', IsFund: '0', SecurityName: 'LYXOR ETF SGI DLY DBLE SH', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'Not Rated', Country: 'France', Region: 'Europe', Price: 28.847 },
  { IsinCode: 'FR0011758085', Currency: 'EUR', Maturity: null, AssetId: 'FR0011758085', Kilovar: '1', IsFund: '0', SecurityName: 'LYXOR FTSE ITA MID CAP PIR ETF', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Italy', Region: 'Europe', Price: 109.6805 },
  { IsinCode: 'FR0012444750', Currency: 'EUR', Maturity: null, AssetId: 'FR0012444750', Kilovar: '1', IsFund: '0', SecurityName: 'ACAFP VAR PERP(4.25%)', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A-', Country: 'France', Region: 'Europe', Price: 109.6805 },
  { IsinCode: 'FR0012759744', Currency: 'EUR', Maturity: null, AssetId: 'FR0012759744', Kilovar: '1', IsFund: '0', SecurityName: 'RENAUL 1.25% 06/22', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'BBB+', Country: 'France', Region: 'Europe', Price: 102.687 },
  { IsinCode: 'FR0013083656', Currency: 'EUR', Maturity: null, AssetId: 'FR0013083656', Kilovar: '1', IsFund: '0', SecurityName: 'GREAT EUROPEAN MODELS-IC', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'France', Region: 'Europe', Price: 496.54 },
  { IsinCode: 'IE00B29M2K49', Currency: 'EUR', Maturity: null, AssetId: 'IE00B29M2K49', Kilovar: '1', IsFund: '0', SecurityName: 'BNY MELLON GL LT GLOBAL EQTY -C EUR', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Ireland', Region: 'Europe', Price: 2.9243 },
  { IsinCode: 'IE00B5429P46', Currency: 'EUR', Maturity: null, AssetId: 'IE00B5429P46', Kilovar: '1', IsFund: '0', SecurityName: 'GLG EUROP EQ ALT FD IN', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Ireland', Region: 'Europe', Price: 113.43 },
  { IsinCode: 'IE00B68XV540', Currency: 'EUR', Maturity: null, AssetId: 'IE00B68XV540', Kilovar: '1', IsFund: '0', SecurityName: 'MUZIN ENH YIELD ST- HI EUR DIS', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'Not Rated', Country: 'Ireland', Region: 'Europe', Price: 88.84 },
  { IsinCode: 'IE00B6TYL671', Currency: 'EUR', Maturity: null, AssetId: 'IE00B6TYL671', Kilovar: '1', IsFund: '0', SecurityName: 'KAMES ABS RETURN BOND C', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'Not Rated', Country: 'Ireland', Region: 'Europe', Price: 10.1804 },
  { IsinCode: 'IE00B706BP88', Currency: 'EUR', Maturity: null, AssetId: 'IE00B706BP88', Kilovar: '1', IsFund: '0', SecurityName: 'BNY MELLON ABS RET BD-S EUR', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Diversified Bond', Sector: null, Rating: 'Not Rated', Country: 'Ireland', Region: 'Europe', Price: 102.1515 },
  { IsinCode: 'IE00B81TMV64', Currency: 'EUR', Maturity: null, AssetId: 'IE00B81TMV64', Kilovar: '1', IsFund: '0', SecurityName: 'ALGEBRIS FINANCIAL I EUR', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'Not Rated', Country: 'Ireland', Region: 'Europe', Price: 158.3 },
  { IsinCode: 'IT0000072170', Currency: 'EUR', Maturity: null, AssetId: 'IT0000072170', Kilovar: '1', IsFund: '0', SecurityName: 'FINECOBANK SPA', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Italy', Region: 'Europe', Price: 9.91 },
  { IsinCode: 'IT0000072618', Currency: 'EUR', Maturity: null, AssetId: 'IT0000072618', Kilovar: '1', IsFund: '0', SecurityName: 'INTESA SANPAOLO', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Italy', Region: 'Europe', Price: 1.885 },
  { IsinCode: 'IT0003132476', Currency: 'EUR', Maturity: null, AssetId: 'IT0003132476', Kilovar: '1', IsFund: '0', SecurityName: 'ENI SPA', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Energy', Rating: null, Country: 'Italy', Region: 'Europe', Price: 14.498 },
  { IsinCode: 'IT0003934657', Currency: 'EUR', Maturity: null, AssetId: 'IT0003934657', Kilovar: '1', IsFund: '0', SecurityName: 'BTPS 4% 02/37', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'BBB', Country: 'Italy', Region: 'Europe', Price: 122.917 },
  { IsinCode: 'IT0004053440', Currency: 'EUR', Maturity: null, AssetId: 'IT0004053440', Kilovar: '1', IsFund: '0', SecurityName: 'DATALOGIC SPA', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Information Technology', Rating: null, Country: 'Italy', Region: 'Europe', Price: 16.82 },
  { IsinCode: 'IT0005028003', Currency: 'EUR', Maturity: null, AssetId: 'IT0005028003', Kilovar: '1', IsFund: '0', SecurityName: 'BTPS 2.15% 12/21', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'BBB', Country: 'Italy', Region: 'Europe', Price: 104.3435 },
  { IsinCode: 'IT0005094088', Currency: 'EUR', Maturity: null, AssetId: 'IT0005094088', Kilovar: '1', IsFund: '0', SecurityName: 'BTPS 1.65% 03/32', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'BBB', Country: 'Italy', Region: 'Europe', Price: 96.1985 },
  { IsinCode: 'IT0005366767', Currency: 'EUR', Maturity: null, AssetId: 'IT0005366767', Kilovar: '1', IsFund: '0', SecurityName: 'NEXI SPA', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Information Technology', Rating: null, Country: 'Italy', Region: 'Europe', Price: 9.071 },
  { IsinCode: 'JE00B588CD74', Currency: 'JPY', Maturity: null, AssetId: 'JE00B588CD74', Kilovar: '1', IsFund: '0', SecurityName: 'ETFS PHYS SWISS GOLD EUR (ITA)', MacroAssetClass: 'Commodities', MicroAssetClass: 'Commodities', Sector: null, Rating: null, Country: 'Jersey', Region: 'Europe', Price: 119.73 },
  { IsinCode: 'LU0179826135', Currency: 'EUR', Maturity: null, AssetId: 'LU0179826135', Kilovar: '1', IsFund: '0', SecurityName: 'BLUEBAY IG BOND FD-B', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 188.59 },
  { IsinCode: 'LU0256884064', Currency: 'USD', Maturity: null, AssetId: 'LU0256884064', Kilovar: '1', IsFund: '0', SecurityName: 'ALLIANZ RCM EUROL EG', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 2614.23 },
  { IsinCode: 'LU0278093082', Currency: 'EUR', Maturity: null, AssetId: 'LU0278093082', Kilovar: '1', IsFund: '0', SecurityName: 'VONT EM MARKT EQTY I', MacroAssetClass: 'Equity', MicroAssetClass: 'EM Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 200.65 },
  { IsinCode: 'LU0284394151', Currency: 'EUR', Maturity: null, AssetId: 'LU0284394151', Kilovar: '1', IsFund: '0', SecurityName: 'DNCA INVEST EUROSE -I', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Other', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 170.56 },
  { IsinCode: 'LU0332400745', Currency: 'USD', Maturity: null, AssetId: 'LU0332400745', Kilovar: '1', IsFund: '0', SecurityName: 'JPM EM MK LOCAL CCY DEBT CA', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 121.45 },
  { IsinCode: 'LU0353189763', Currency: 'EUR', Maturity: null, AssetId: 'LU0353189763', Kilovar: '1', IsFund: '0', SecurityName: 'WEL FARGO US CAP GRTH', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 374.28 },
  { IsinCode: 'LU0490769915', Currency: 'EUR', Maturity: null, AssetId: 'LU0490769915', Kilovar: '1', IsFund: '0', SecurityName: 'HENDERSON GARTMORE FD UK ABS RTN-I HEDGE', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 7.0406 },
  { IsinCode: 'LU0572586674', Currency: 'EUR', Maturity: null, AssetId: 'LU0572586674', Kilovar: '1', IsFund: '0', SecurityName: 'ALKEN ABS RTRN EUROPE FD-CL I ACC', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 144.32 },
  { IsinCode: 'LU0599947438', Currency: 'EUR', Maturity: null, AssetId: 'LU0599947438', Kilovar: '1', IsFund: '0', SecurityName: 'DWS CONCEPT KALDEMORGEN IC', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 141.49 },
  { IsinCode: 'LU0853555893', Currency: 'USD', Maturity: null, AssetId: 'LU0853555893', Kilovar: '1', IsFund: '0', SecurityName: 'JUPITER JGF DYNAMIC BOND IEUR', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 13.38 },
  { IsinCode: 'LU0926439729', Currency: 'EUR', Maturity: null, AssetId: 'LU0926439729', Kilovar: '1', IsFund: '0', SecurityName: 'VONTOBEL-EM MKT DBT-I USD', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Diversified Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 136.7 },
  { IsinCode: 'LU1327051279', Currency: 'EUR', Maturity: null, AssetId: 'LU1327051279', Kilovar: '1', IsFund: '0', SecurityName: 'LYXOR DDS S&P500 (ITA)', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 32.895 },
  { IsinCode: 'LU1681041031', Currency: 'EUR', Maturity: null, AssetId: 'LU1681041031', Kilovar: '1', IsFund: '0', SecurityName: 'AM FLOAT RAT US CORP U ETF HED EUR-MILAN', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 50.09 },
  { IsinCode: 'LU1681041114', Currency: 'EUR', Maturity: null, AssetId: 'LU1681041114', Kilovar: '1', IsFund: '0', SecurityName: 'AM FLOATING RATE EURO CORPORAT 1-3-MILAN', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'Not Rated', Country: 'Luxembourg', Region: 'Europe', Price: 100.93 },
  { IsinCode: 'LU1681045370', Currency: 'EUR', Maturity: null, AssetId: 'LU1681045370', Kilovar: '1', IsFund: '0', SecurityName: 'AMUNDI MSCI EMERGG MKT UC ETF-EUR-MILAN', MacroAssetClass: 'Equity', MicroAssetClass: 'EM Equity', Sector: 'Financials', Rating: null, Country: 'Luxembourg', Region: 'Europe', Price: 4.1925 },
  { IsinCode: 'NL0011821202', Currency: 'NOK', Maturity: null, AssetId: 'NL0011821202', Kilovar: '1', IsFund: '0', SecurityName: 'ING GROEP NV', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Financials', Rating: null, Country: 'Netherlands', Region: 'Europe', Price: 10.164 },
  { IsinCode: 'NO0005052605', Currency: 'NOK', Maturity: null, AssetId: 'NO0005052605', Kilovar: '1', IsFund: '0', SecurityName: 'NORSK HYDRO', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Materials', Rating: null, Country: 'Norway', Region: 'Europe', Price: 30.76 },
  { IsinCode: 'PTOTEXOE0024', Currency: 'SEK', Maturity: null, AssetId: 'PTOTEXOE0024', Kilovar: '1', IsFund: '0', SecurityName: 'PORTUGAL 1.95% 06/29', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Government Bond', Sector: null, Rating: 'BBB', Country: 'Portugal', Region: 'Europe', Price: 115.4855 },
  { IsinCode: 'SE0000872095', Currency: 'SEK', Maturity: null, AssetId: 'SE0000872095', Kilovar: '1', IsFund: '0', SecurityName: 'SWEDISH ORPHAN BIOVITRUM AB', MacroAssetClass: 'Equity', MicroAssetClass: 'Europe Equity', Sector: 'Health Care', Rating: null, Country: 'Sweden', Region: 'Europe', Price: 182.7 },
  /*
  { IsinCode: 'NOK', Currency: 'NOK', Maturity: null, AssetId: 'NOK', Kilovar: '1', IsFund: '0', SecurityName: 'NORWEGIAN KRONE', MacroAssetClass: 'Money Market', MicroAssetClass: 'Money Market', Sector: null, Rating: null, Country: 'Norway', Region: 'Europe', Price: 0.1 },
  { IsinCode: 'SEK', Currency: 'SEK', Maturity: null, AssetId: 'SEK', Kilovar: '1', IsFund: '0', SecurityName: 'SWEDISH KRONA', MacroAssetClass: 'Money Market', MicroAssetClass: 'Money Market', Sector: null, Rating: null, Country: 'Sweden', Region: 'Europe', Price: 0.095 },
  { IsinCode: 'JPY', Currency: 'JPY', Maturity: null, AssetId: 'JPY', Kilovar: '1', IsFund: '0', SecurityName: 'JAPANESE YEN', MacroAssetClass: 'Money Market', MicroAssetClass: 'Money Market', Sector: null, Rating: null, Country: 'Japan', Region: 'Pacific', Price: 0.0082 },
  { IsinCode: 'USD', Currency: 'USD', Maturity: null, AssetId: 'USD', Kilovar: '1', IsFund: '0', SecurityName: 'US DOLLAR', MacroAssetClass: 'Money Market', MicroAssetClass: 'Money Market', Sector: null, Rating: null, Country: 'United States', Region: 'North America', Price: 0.89 },
  */
  { IsinCode: 'US00724F1012', Currency: 'USD', Maturity: null, AssetId: 'US00724F1012', Kilovar: '1', IsFund: '0', SecurityName: 'ADOBE INC', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Information Technology', Rating: null, Country: 'United States', Region: 'North America', Price: 301.39 },
  { IsinCode: 'US02079K3059', Currency: 'USD', Maturity: null, AssetId: 'US02079K3059', Kilovar: '1', IsFund: '0', SecurityName: 'ALPHABET INC CL A', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Telecommunication Services', Rating: null, Country: 'United States', Region: 'North America', Price: 1112.6 },
  { IsinCode: 'US4523271090', Currency: 'USD', Maturity: null, AssetId: 'US4523271090', Kilovar: '1', IsFund: '0', SecurityName: 'ILLUMINA INC', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Health Care', Rating: null, Country: 'United States', Region: 'North America', Price: 371.37 },
  { IsinCode: 'US46120E6023', Currency: 'USD', Maturity: null, AssetId: 'US46120E6023', Kilovar: '1', IsFund: '0', SecurityName: 'INTUITIVE SURGIC INC', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Health Care', Rating: null, Country: 'United States', Region: 'North America', Price: 529.52 },
  { IsinCode: 'US64110L1061', Currency: 'USD', Maturity: null, AssetId: 'US64110L1061', Kilovar: '1', IsFund: '0', SecurityName: 'NETFLIX INC', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Telecommunication Services', Rating: null, Country: 'United States', Region: 'North America', Price: 375.43 },
  { IsinCode: 'US6516391066', Currency: 'USD', Maturity: null, AssetId: 'US6516391066', Kilovar: '1', IsFund: '0', SecurityName: 'NEWMONT GOLDCORP CORP', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Materials', Rating: null, Country: 'United States', Region: 'North America', Price: 38.44 },
  { IsinCode: 'US67066G1040', Currency: 'USD', Maturity: null, AssetId: 'US67066G1040', Kilovar: '1', IsFund: '0', SecurityName: 'NVIDIA CORP', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Information Technology', Rating: null, Country: 'United States', Region: 'North America', Price: 162.23 },
  { IsinCode: 'US6745991058', Currency: 'USD', Maturity: null, AssetId: 'US6745991058', Kilovar: '1', IsFund: '0', SecurityName: 'OCCIDENTAL PETROLEUM', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Energy', Rating: null, Country: 'United States', Region: 'North America', Price: 48.78 },
  { IsinCode: 'US7170811035', Currency: 'USD', Maturity: null, AssetId: 'US7170811035', Kilovar: '1', IsFund: '0', SecurityName: 'PFIZER INC-USD', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Health Care', Rating: null, Country: 'United States', Region: 'North America', Price: 44.22 },
  { IsinCode: 'US79466L3024', Currency: 'USD', Maturity: null, AssetId: 'US79466L3024', Kilovar: '1', IsFund: '0', SecurityName: 'SALESFORCE COM', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Information Technology', Rating: null, Country: 'United States', Region: 'North America', Price: 154.12 },
  { IsinCode: 'US91913Y1001', Currency: 'USD', Maturity: null, AssetId: 'US91913Y1001', Kilovar: '1', IsFund: '0', SecurityName: 'VALERO ENERGY CORP', MacroAssetClass: 'Equity', MicroAssetClass: 'North America Equity', Sector: 'Energy', Rating: null, Country: 'United States', Region: 'North America', Price: 80.7 },
  { IsinCode: 'XS0222383027', Currency: 'EUR', Maturity: null, AssetId: 'XS0222383027', Kilovar: '1', IsFund: '0', SecurityName: 'GLAXOSMITH 4% 06/25', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A+', Country: 'United Kingdom', Region: 'Europe', Price: 116.714 },
  { IsinCode: 'XS0758420748', Currency: 'EUR', Maturity: null, AssetId: 'XS0758420748', Kilovar: '1', IsFund: '0', SecurityName: 'HEIANA 3.50% 03/24', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'BBB+', Country: 'Netherlands', Region: 'Europe', Price: 116.714 },
  { IsinCode: 'XS0874840845', Currency: 'EUR', Maturity: null, AssetId: 'XS0874840845', Kilovar: '1', IsFund: '0', SecurityName: 'GE 2.625% 3/23', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A', Country: 'Ireland', Region: 'Europe', Price: 108.7145 },
  { IsinCode: 'XS1014610254', Currency: 'EUR', Maturity: null, AssetId: 'XS1014610254', Kilovar: '1', IsFund: '0', SecurityName: 'VW 2.625% 1/24', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A-', Country: 'Germany', Region: 'Europe', Price: 108.7145 },
  { IsinCode: 'XS1061711575', Currency: 'EUR', Maturity: null, AssetId: 'XS1061711575', Kilovar: '1', IsFund: '0', SecurityName: 'AEGON VAR 4/44', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A-', Country: 'Netherlands', Region: 'Europe', Price: 110.4655 },
  { IsinCode: 'XS1062900912', Currency: 'EUR', Maturity: null, AssetId: 'XS1062900912', Kilovar: '1', IsFund: '0', SecurityName: 'ASSGEN 4.125% 04/05/26', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A-', Country: 'Italy', Region: 'Europe', Price: 112.9805 },
  { IsinCode: 'XS1412711217', Currency: 'EUR', Maturity: null, AssetId: 'XS1412711217', Kilovar: '1', IsFund: '0', SecurityName: 'ENIIM 1.625% 05/28 EMTN', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A-', Country: 'Italy', Region: 'Europe', Price: 109.1065 },
  { IsinCode: 'XS1560863802', Currency: 'EUR', Maturity: null, AssetId: 'XS1560863802', Kilovar: '1', IsFund: '0', SecurityName: 'BAC FRN 02/25', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'A+', Country: 'United States', Region: 'North America', Price: 104.739 },
  { IsinCode: 'XS1785340172', Currency: 'EUR', Maturity: null, AssetId: 'XS1785340172', Kilovar: '1', IsFund: '0', SecurityName: 'ISPIM 1.75% 03/28', MacroAssetClass: 'Fixed Income', MicroAssetClass: 'Corporate Bond', Sector: null, Rating: 'BBB+', Country: 'Italy', Region: 'Europe', Price: 102.632 },

];

const position = {
  FR0012444750: { price: 0.0125398585847679, quantity: 200000, weight: 0.0125398585847679 },
  XS1061711575: { price: 0.00937945125346967, quantity: 150000, weight: 0.00937945125346967 },
  XS1062900912: { price: 0.0190600265604174, quantity: 300000, weight: 0.0190600265604174 },
  XS1560863802: { price: 0.00891321925565333, quantity: 150000, weight: 0.00891321925565333 },
  IT0005094088: { price: 0.0106192560746358, quantity: 200000, weight: 0.0106192560746358 },
  IT0005028003: { price: 0.0146829024788572, quantity: 250000, weight: 0.0146829024788572 },
  IT0003934657: { price: 0.0203539687941845, quantity: 300000, weight: 0.0203539687941845 },
  DE000A1HRVD5: { price: 0.018899318168795, quantity: 300000, weight: 0.018899318168795 },
  XS1412711217: { price: 0.0104703366043415, quantity: 170000, weight: 0.0104703366043415 },
  XS0874840845: { price: 0.0185127811851722, quantity: 300000, weight: 0.0185127811851722 },
  XS0222383027: { price: 0.0174002408642231, quantity: 250000, weight: 0.0174002408642231 },
  XS0758420748: { price: 0.0166428765111658, quantity: 250000, weight: 0.0166428765111658 },
  XS1785340172: { price: 0.0174413586562564, quantity: 300000, weight: 0.0174413586562564 },
  PTOTEXOE0024: { price: 0.0213634250969832, quantity: 330000, weight: 0.0213634250969832 },
  FR0012759744: { price: 0.00871758333951309, quantity: 150000, weight: 0.00871758333951309 },
  ES0000012E51: { price: 0.0219107913911659, quantity: 350000, weight: 0.0219107913911659 },
  ES00000126B2: { price: 0.0132638644297206, quantity: 200000, weight: 0.0132638644297206 },
  XS1014610254: { price: 0.00931418970026171, quantity: 150000, weight: 0.00931418970026171 },
  IE00B81TMV64: { price: 0.0305950819251966, quantity: 3390, weight: 0.0305950819251966 },
  LU1681041031: { price: 0.0188316967514118, quantity: 6647, weight: 0.0188316967514118 },
  LU1681041114: { price: 0.0471961912331567, quantity: 8265, weight: 0.0471961912331567 },
  LU0179826135: { price: 0.0244711601699516, quantity: 2284.425, weight: 0.0244711601699516 },
  LU0332400745: { price: 0.0256241245496285, quantity: 3780, weight: 0.0256241245496285 },
  IE00B6TYL671: { price: 0.0234295002848742, quantity: 40693, weight: 0.0234295002848742 },
  FR0010869578: { price: 0.0160968863067752, quantity: 9799, weight: 0.0160968863067752 },
  IE00B68XV540: { price: 0.018711211671635, quantity: 3710.661, weight: 0.018711211671635 },
  LU0926439729: { price: 0.0205612616477162, quantity: 2978.635, weight: 0.0205612616477162 },
  US00724F1012: { price: 0.0057385455651453, quantity: 400, weight: 0.0057385455651453 },
  US02079K3059: { price: 0.00541820969696559, quantity: 100, weight: 0.00541820969696559 },
  FR0000120628: { price: 0.00510299760847026, quantity: 3900, weight: 0.00510299760847026 },
  FR0000131104: { price: 0.00457961323837074, quantity: 2000, weight: 0.00457961323837074 },
  IT0004053440: { price: 0.00224113549480328, quantity: 2400, weight: 0.00224113549480328 },
  IT0003132476: { price: 0.00506677723683707, quantity: 6200, weight: 0.00506677723683707 },
  IT0000072170: { price: 0.0159552175672063, quantity: 28927, weight: 0.0159552175672063 },
  US4523271090: { price: 0.0057977304813813, quantity: 325, weight: 0.0057977304813813 },
  NL0011821202: { price: 0.00783372952607236, quantity: 14226, weight: 0.00783372952607236 },
  IT0000072618: { price: 0.00506953344865423, quantity: 47943, weight: 0.00506953344865423 },
  US46120E6023: { price: 0.00453814543641169, quantity: 175, weight: 0.00453814543641169 },
  FR0000121485: { price: 0.00534595707006598, quantity: 185, weight: 0.00534595707006598 },
  US64110L1061: { price: 0.0053849306363211, quantity: 300, weight: 0.0053849306363211 },
  US6516391066: { price: 0.0049143408057106, quantity: 2600, weight: 0.0049143408057106 },
  IT0005366767: { price: 0.00671525124135931, quantity: 13450, weight: 0.00671525124135931 },
  NO0005052605: { price: 0.00581875693431992, quantity: 33426, weight: 0.00581875693431992 },
  US67066G1040: { price: 0.00975017491243017, quantity: 1292, weight: 0.00975017491243017 },
  US6745991058: { price: 0.00713417371618517, quantity: 2900, weight: 0.00713417371618517 },
  US7170811035: { price: 0.00412252633679779, quantity: 1891, weight: 0.00412252633679779 },
  US79466L3024: { price: 0.00922555343808826, quantity: 1240, weight: 0.00922555343808826 },
  SE0000872095: { price: 0.00386405254864544, quantity: 4014, weight: 0.00386405254864544 },
  US91913Y1001: { price: 0.00926399075313264, quantity: 2278, weight: 0.00926399075313264 },
  LU0256884064: { price: 0.0136240422999191, quantity: 94.469, weight: 0.0136240422999191 },
  LU1681045370: { price: 0.0188922079757148, quantity: 81718, weight: 0.0188922079757148 },
  IE00B29M2K49: { price: 0.0155740183875611, quantity: 93728.508, weight: 0.0155740183875611 },
  FR0013083656: { price: 0.00938127999258518, quantity: 340, weight: 0.00938127999258518 },
  LU1327051279: { price: 0.0327175719332823, quantity: 17371, weight: 0.0327175719332823 },
  FR0010424143: { price: 0.0303401595539824, quantity: 146076, weight: 0.0303401595539824 },
  FR0011758085: { price: 0.00848121734013991, quantity: 1216, weight: 0.00848121734013991 },
  LU0278093082: { price: 0.0200421896779329, quantity: 1963.016, weight: 0.0200421896779329 },
  LU0353189763: { price: 0.0101556219782082, quantity: 561, weight: 0.0101556219782082 },

  EUR: {isCash:true, price: 1, quantity: 51169, weight: 0.1048188036364528 },
  /*
  EUR: {isCash:true, price: 0.0248188036364528, quantity: 438538.69, weight: 0.0248188036364528 },
  JPY: {isCash:true, price: 0.0463697916238022, quantity: 100000000, weight: 0.0463697916238022 },
  NOK: {isCash:true, price: 0.000373331528969505, quantity: 63780.78, weight: 0.000373331528969505 },
  SEK: {isCash:true, price: 1.97946971492756E-05, quantity: 3685.89, weight: 1.97946971492756E-05 },
  USD: {isCash:true, price: 0.0303815270644107, quantity: 609838.73, weight: 0.0303815270644107 },
  */
  LU0284394151: { price: 0.00937225036712569, quantity: 971, weight: 0.00937225036712569 },
  LU0599947438: { price: 0.0200435516977838, quantity: 2522.3405, weight: 0.0200435516977838 },
  JE00B588CD74: { price: 0.0208349402409882, quantity: 3036, weight: 0.0208349402409882 },
  LU0572586674: { price: 0.00872895876345315, quantity: 1073.92658, weight: 0.00872895876345315 },
  IE00B706BP88: { price: 0.00920547592037585, quantity: 1580.175, weight: 0.00920547592037585 },
  IE00B5429P46: { price: 0.0175674404988028, quantity: 2724.806, weight: 0.0175674404988028 },
  LU0490769915: { price: 0.00916792839635123, quantity: 23003.942, weight: 0.00916792839635123 },
  LU0853555893: { price: 0.0100239892417043, quantity: 13237.67, weight: 0.0100239892417043 },

}

const rebalance = (por:any[]) => {
  const tot = sumBy(por, p=>p.WEIGHT);
  return por.map(p=>({...p,WEIGHT: p.WEIGHT/tot}));
}

export const bbCase = rebalance(babySecurities.map(s => {
  return {
    ...s,
    Symbol: s.IsinCode,
    MacroAssetClass: s.MacroAssetClass,
    AssetClass: s.MacroAssetClass,
    AssetType: s.MicroAssetClass,
    Name: s.SecurityName,
    Mstar_BCH: '',
    Mstar_SRRI: 1,
    isCash: position[s.IsinCode].isCash,
    WEIGHT: position[s.IsinCode].weight,
    //    Weight: position[s.IsinCode].quantity,
    SRRI: 1,
    Amont: position[s.IsinCode].quantity * s.Price,
    Price: s.Price,
    Shares: position[s.IsinCode].quantity,
  }
}));


const swapIndex = [[2,21],[5,14],[3,20],[10,18],[22,4]];

const sw1 = swapIndex.reduce((p,c)=>{
  p[c[0]]=c[1];
  p[c[1]]= c[0];
  return p;
},{})

export const bbProposal = bbCase.map((b,i)=>{
  const target = sw1[i];
  return {...b,
    WEIGHT: target ? bbCase[target].WEIGHT :b.WEIGHT
  }
});
